// pages/api/identify-plant.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser to use formidable
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);

    const imageFile = files.image?.[0];

    if (!imageFile) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }

    // Set up Google Gemini API with the new model
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set.');
      return res.status(500).json({ error: 'API key not configured' });
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Updated model name
    
    // Convert the uploaded image file to the format Gemini API expects
    const imagePart = await fileToGenerativePart(imageFile.filepath, imageFile.mimetype);
    
    // Create prompt for the Gemini model
    const prompt = `
Please analyze this plant image and provide details in the following JSON format:
{
  "commonName": "name of the plant",
  "scientificName": "scientific name",
  "care": {
    "watering": "watering instructions",
    "sunlight": "light requirements",
    "temperature": "temperature needs",
    "soil": "soil requirements"
  },
  "description": "brief description of the plant"
}`;

    // Get response from Gemini API
    const geminiResult = await model.generateContent([prompt, imagePart]);
    const response = geminiResult.response;
    
    // Extract and parse JSON safely from the response text
    let jsonResponse;
    try {
      const rawText = response.text();
      // Attempt to find JSON block, potentially removing markdown backticks
      const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```|({[\s\S]*})/);
      if (jsonMatch && (jsonMatch[1] || jsonMatch[2])) {
        jsonResponse = JSON.parse(jsonMatch[1] || jsonMatch[2]);
      } else {
        // Fallback if no clear JSON block is found, try parsing the whole text
        jsonResponse = JSON.parse(rawText); 
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', response.text(), parseError);
      return res.status(500).json({ error: 'Failed to parse response from AI model.' });
    }

    // Ensure expected fields exist
    if (!jsonResponse || !jsonResponse.commonName || !jsonResponse.scientificName) {
        console.error('Invalid JSON structure received from Gemini:', jsonResponse);
        return res.status(500).json({ error: 'Received invalid data structure from AI model.' });
    }
    
    // Process the Gemini response and add learning resources
    const plantData = {
      plantName: jsonResponse.commonName,
      scientificName: jsonResponse.scientificName,
      confidence: 0.92,
      imageData: {
        base64: imagePart.inlineData.data,
        mimeType: imageFile.mimetype,
      },
      careInfo: [
        { icon: '💧', title: 'Water', description: jsonResponse.care?.watering || 'Info not available' },
        { icon: '☀️', title: 'Light', description: jsonResponse.care?.sunlight || 'Info not available' },
        { icon: '🌡️', title: 'Temperature', description: jsonResponse.care?.temperature || 'Info not available' },
        { icon: '🌱', title: 'Soil', description: jsonResponse.care?.soil || 'Info not available' }
      ],
      additionalInfo: jsonResponse.description,
      resources: [
        {
          title: 'Complete Care Guide',
          description: `Learn everything about caring for your ${jsonResponse.commonName}.`,
          url: `https://example.com/plants/${encodeURIComponent(jsonResponse.commonName)}`
        },
        {
          title: 'Common Issues & Solutions',
          description: 'Troubleshoot common problems with this plant species.',
          url: `https://example.com/troubleshooting/${encodeURIComponent(jsonResponse.scientificName)}`
        },
        {
          title: 'Community Discussion',
          description: 'Join conversations with other growers of this plant.',
          url: 'https://example.com/forum/plants'
        }
      ]
    };
    
    return res.status(200).json(plantData);
  } catch (error) {
    console.error('Plant identification error:', error);
    return res.status(500).json({ error: 'Error identifying plant: ' + error.message });
  }
}

// Helper function to convert file path to GoogleGenerativeAI.Part
async function fileToGenerativePart(filePath, mimeType) {
  const imageBuffer = await fs.promises.readFile(filePath);
  const base64Data = imageBuffer.toString('base64');
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    }
  };
}
