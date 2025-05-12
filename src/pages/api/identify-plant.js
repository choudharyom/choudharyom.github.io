// pages/api/identify-plant.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the image file from the request
    const image = req.body.image;
    
    // Set up Google Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    // Convert the image to proper format for Gemini API
    const imageData = await encodeImageToBase64(image);
    
    // Create prompt for the Gemini model
    const prompt = "Please identify this plant. Provide the common name, scientific name, care information (watering, sunlight, soil, temperature), and a brief description. Format the result as JSON.";
    
    // Get response from Gemini API
    const result = await model.generateContent([prompt, imageData]);
    const response = result.response;
    const jsonResponse = JSON.parse(response.text());
    
    // Process the Gemini response and add learning resources
    const plantData = {
      plantName: jsonResponse.commonName,
      scientificName: jsonResponse.scientificName,
      confidence: 0.92, // This would normally come from the API
      careInfo: [
        {
          icon: '💧',
          title: 'Water',
          description: jsonResponse.care.watering
        },
        {
          icon: '☀️',
          title: 'Light',
          description: jsonResponse.care.sunlight
        },
        {
          icon: '🌡️',
          title: 'Temperature',
          description: jsonResponse.care.temperature
        },
        {
          icon: '🌱',
          title: 'Soil',
          description: jsonResponse.care.soil
        }
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
    return res.status(500).json({ error: 'Error identifying plant' });
  }
}

// Helper function to encode image to base64
async function encodeImageToBase64(image) {
  // Implementation will depend on how your image is received
  // This is just a placeholder example
  const buffer = Buffer.from(await image.arrayBuffer());
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType: 'image/jpeg',
    },
  };
}