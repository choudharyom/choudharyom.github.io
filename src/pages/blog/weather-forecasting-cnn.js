import Head from 'next/head';
import BlogPostLayout from '../../components/layout/BlogPostLayout'; // Corrected path assuming components is at src level
import Script from 'next/script';
import { useEffect } from 'react';
import styles from '@/styles/BlogPost.module.css'; // Import common blog post styles

// --- Define Meta and Author Data Once ---
const pageMeta = {
  title: "Weather Forecasting with Convolutional Neural Networks: A Mathematical Deep Dive",
  description: "Explore how Convolutional Neural Networks (CNNs) are transforming weather prediction through advanced mathematical modeling and machine learning techniques.",
  canonicalUrl: "https://choudharyom.com/weather-forecasting-cnn-deep-learning", // Keep specific canonical if needed
  date: "2024-07-28", // Example date - Update with actual publish date
  readingTime: "10 min read", // Example reading time
  tags: ['weather-forecasting', 'cnn', 'deep-learning', 'mathematics', 'neural-networks'],
};

const pageAuthor = {
  name: "Om Choudhary", // Consistent name
  title: "Software Architect👾",
  bio: "I write about embedded systems, neural networks, and mathematical foundations of AI.",
  imageUrl: "/images/AuthorOm.png", // Consistent image
};
// --- End Data Definition ---

export default function WeatherForecastingCNN() {
  useEffect(() => {
    // MathJax typesetting
    if (typeof window !== 'undefined' && window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
    // Prism.js syntax highlighting
    if (typeof window !== 'undefined' && window.Prism) {
      window.Prism.highlightAll();
    }
  }, []);

  return (
    <BlogPostLayout
      meta={pageMeta} // Pass the defined meta object
      author={pageAuthor} // Pass the defined author object
    >
      {/* reuse the title here */}
      <h1>{pageMeta.title}</h1> 

      {/* Consider moving tag rendering into BlogPostLayout if it's always the same format */}
      <p className={styles.meta}>
        Published on: {new Date(pageMeta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} | Tags: {' '}
        {pageMeta.tags.map((tag, index) => (
          <span key={tag}>
            <a href={`/tags/${tag}`}>{tag}</a>
            {index < pageMeta.tags.length - 1 ? ', ' : ''}
          </span>
        ))}
      </p>
      <Head>
        {/* Canonical link can be handled by BlogPostLayout if meta includes it */}
        <link rel="canonical" href={pageMeta.canonicalUrl} />
        {/* Prism.js CSS theme - Consider loading globally if used often */}
        <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism-tomorrow.min.css" rel="stylesheet" />
        {/* Keep inline styles specific to this post's structure */}
        <style>{`
          .highlight {
            background: #f7f9fb;
            border-left: 6px solid #4a76c5;
            border-radius: 12px 0 0 12px;
            box-shadow: 0 2px 12px 0 rgba(74, 118, 197, 0.07), 0 1.5px 4px 0 rgba(0,0,0,0.03);
            padding: 1.5em 1.5em 1.5em 2em;
            margin: 2em 0;
            transition: box-shadow 0.2s;
          }
          .highlight:hover {
            box-shadow: 0 4px 24px 0 rgba(74, 118, 197, 0.13), 0 2px 8px 0 rgba(0,0,0,0.06);
          }
          .highlight h3 {
            color: #4a76c5;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 0.7em;
            font-size: 1.25em;
            letter-spacing: 0.01em;
          }
          .highlight ul {
            margin: 0;
            padding-left: 1.2em;
          }
          .highlight li {
            margin-bottom: 0.3em;
            font-size: 1.07em;
          }
          @media (max-width: 600px) {
            .highlight {
              padding: 1em 1em 1em 1.2em;
              border-radius: 8px 0 0 8px;
            }
          }
        `}</style>
        {/* MathJax script for client-side rendering */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML" />
        {/* Prism.js for syntax highlighting */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js"/>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-python.min.js"/>
      </Head>
      {/* Use the common content wrapper style */}
      <div className={styles.content}>
        {/* Keep the existing article content */}
          <article>
            {/* Render meta line here if BlogPostLayout doesn't */}

        <section>
            <h2>Introduction: The Mathematical Symphony of Weather Prediction</h2>
            <p>
              In the intricate world of <strong>weather forecasting</strong>, <strong>Convolutional Neural Networks (CNNs)</strong> have emerged as a groundbreaking approach to understanding and predicting atmospheric dynamics. This deep learning technique bridges the gap between complex mathematical principles and practical meteorological predictions, offering unprecedented insights into the chaotic nature of weather systems.
            </p>
            <div className="highlight">
              <h3>Key Insights</h3>
              <ul>
                <li>CNNs transform how we interpret spatial weather data</li>
                <li>Mathematical modeling meets machine learning</li>
                <li>Potential applications across multiple sectors</li>
              </ul>
            </div>
          </section>
          <section>
            <h2>Case Studies</h2>
            <div className="highlight">
              <h3>Weather Forecasting with CNNs</h3>
              <p><strong>Goal:</strong> Predict temperature and precipitation likelihood for a specific location.</p>
              <ul>
                <li><strong>Features:</strong> Historical weather data (temperature, humidity, wind speed), atmospheric pressure, satellite imagery, seasonal trends, location coordinates.</li>
                <li><strong>Model:</strong> Convolutional Neural Network (CNN) for spatial data (weather maps) + fully connected layers.</li>
                <li><strong>Real-World Use:</strong> Agriculture planning, disaster preparedness, travel logistics.</li>
                <li><strong>Performance:</strong> Achieves ~85% accuracy on precipitation prediction with 24-hour forecasts.</li>
              </ul>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" className="neural-network-svg">
                <rect x="10" y="10" width="780" height="380" fill="#f0f0f0" stroke="#333" strokeWidth="2" rx="10"/>
                <g className="input-layer">
                  <circle cx="100" cy="100" r="20" fill="#4a76c5" opacity="0.7"/>
                  <circle cx="100" cy="200" r="20" fill="#4a76c5" opacity="0.7"/>
                  <circle cx="100" cy="300" r="20" fill="#4a76c5" opacity="0.7"/>
                  <text x="70" y="40" fontSize="16">Input Layer</text>
                  <text x="92" y="105" fontSize="12" textAnchor="end">Temp/Humidity</text>
                  <text x="80" y="205" fontSize="12" textAnchor="end">Pressure/Wind</text>
                  <text x="80" y="305" fontSize="12" textAnchor="end">Coordinates</text>
                </g>
                <g className="cnn-layer-1">
                  <rect x="220" y="80" width="60" height="60" fill="#e83e8c" opacity="0.7" rx="5"/>
                  <rect x="220" y="180" width="60" height="60" fill="#e83e8c" opacity="0.7" rx="5"/>
                  <text x="190" y="40" fontSize="16">CNN Layer 1</text>
                  <text x="222" y="110" fontSize="12">Conv Filter</text>
                  <text x="222" y="210" fontSize="12">Conv Filter</text>
                </g>
                <g className="cnn-layer-2">
                  <rect x="340" y="100" width="40" height="40" fill="#e83e8c" opacity="0.7" rx="5"/>
                  <rect x="340" y="200" width="40" height="40" fill="#e83e8c" opacity="0.7" rx="5"/>
                  <text x="310" y="40" fontSize="16">CNN Layer 2</text>
                  <text x="340" y="125" fontSize="12">Pooling</text>
                  <text x="340" y="225" fontSize="12">Pooling</text>
                </g>
                <g className="fc-layer">
                  <circle cx="490" cy="150" r="20" fill="#28a745" opacity="0.7"/>
                  <circle cx="490" cy="250" r="20" fill="#28a745" opacity="0.7"/>
                  <text x="460" y="40" fontSize="16">FC Layer</text>
                </g>
                <g className="output-layer">
                  <circle cx="640" cy="200" r="20" fill="#28a745" opacity="0.7"/>
                  <text x="610" y="40" fontSize="16">Output Layer</text>
                  <text x="660" y="205" fontSize="12">Temp/Precip</text>
                </g>
                <g className="connections" stroke="#666" strokeWidth="1.5" opacity="0.5">
                  <line x1="120" y1="100" x2="220" y2="110"/>
                  <line x1="120" y1="200" x2="220" y2="190"/>
                  <line x1="120" y1="300" x2="220" y2="200"/>
                  <line x1="280" y1="110" x2="340" y2="120"/>
                  <line x1="280" y1="210" x2="340" y2="220"/>
                  <path d="M380,120 Q435,135 470,150" fill="none"/>
                  <path d="M380,220 Q435,235 470,250" fill="none"/>
                  <path d="M510,150 Q575,175 620,200" fill="none"/>
                  <path d="M510,250 Q575,225 620,200" fill="none"/>
                </g>
              </svg>
              <h4>Understanding the Neural Network Layers</h4>
              <p>The diagram above illustrates the architecture of the neural network used for weather forecasting. Each layer plays a specific role in processing the input data and generating predictions:</p>
              <ul>
                <li><strong>Input Layer:</strong> This layer takes in various weather-related features, such as temperature and humidity (historical data), atmospheric pressure and wind speed, and location coordinates. These inputs represent both tabular data (e.g., temperature) and spatial data (e.g., satellite imagery, which is processed separately).</li>
                <li><strong>CNN Layer 1 (Convolutional Layer):</strong> Represented by the pink rectangles labeled "Conv Filter," this layer applies convolutional filters to the spatial data (e.g., satellite imagery or weather maps). Convolution helps extract spatial features like cloud patterns or pressure gradients, which are critical for weather prediction.</li>
                <li><strong>CNN Layer 2 (Pooling Layer):</strong> Represented by smaller pink rectangles labeled "Pooling," this layer downsamples the feature maps from the convolutional layer. Pooling (e.g., max pooling) reduces the spatial dimensions while retaining important features, making the network more computationally efficient and less prone to overfitting.</li>
                <li><strong>Fully Connected (FC) Layer:</strong> Represented by green circles, this layer combines the processed spatial features (from the CNN layers) with the tabular data (e.g., temperature, coordinates). It learns to integrate all features to make a cohesive prediction.</li>
                <li><strong>Output Layer:</strong> The final layer, also in green, produces the predictions: temperature and precipitation likelihood. These outputs are used for applications like agriculture planning or disaster preparedness.</li>
              </ul>
              <p>The arrows between layers represent the flow of data, with the network learning through backpropagation to adjust weights and minimize prediction errors.</p>
            </div>
          </section>
          <section className="math-definition">
            <h2>Mathematical Foundations of Weather Prediction</h2>
            <p>
              At the heart of weather forecasting lies a complex system of differential equations describing atmospheric dynamics. Let's explore the mathematical representation:
            </p>
            <div className="highlight">
              <h3>Fundamental Atmospheric Equations</h3>
              <p>The Navier-Stokes equations form the mathematical backbone of fluid dynamics:</p>
              <span>{`\\[ \\frac{\\partial \\vec{u}}{\\partial t} + (\\vec{u} \\cdot \\nabla)\\vec{u} = -\\frac{1}{\\rho}\\nabla p + \\nu \\nabla^2\\vec{u} + \\vec{f} \\]`}</span>
              <p>Where:</p>
              <ul>
                <li>{`\\(\\vec{u}\\)`} represents fluid velocity</li>
                <li>{`\\(p\\)`} is pressure</li>
                <li>{`\\(\\rho\\)`} is fluid density</li>
                <li>{`\\(\\nu\\)`} is kinematic viscosity</li>
                <li>{`\\(\\vec{f}\\)`} represents external forces</li>
              </ul>
            </div>
          </section>
          <section>
            <h2>Navier-Stokes Equations: The Mathematical Backbone of Fluid Dynamics</h2>
            <p>
              The Navier-Stokes equations are a set of partial differential equations that describe the motion of fluid substances, such as air and water, by modeling the conservation of mass, momentum, and energy. In the context of weather forecasting, these equations govern the behavior of the atmosphere, capturing phenomena like wind patterns, pressure gradients, and temperature changes that drive weather systems.
            </p>
            <div className="math-definition">
    <h3>The Navier-Stokes Equations</h3>
    <p>The incompressible form of the Navier-Stokes equations, often used in atmospheric modeling, consists of two main components:</p>
    <p><strong>Continuity Equation (Conservation of Mass):</strong></p>
    <span>{`\\[\\nabla \\cdot \\mathbf{u} = 0\\]`}</span>
    <p>This ensures that the fluid is incompressible, meaning the divergence of the velocity field {`\\(\\mathbf{u}\\)`} is zero.</p>
    <p><strong>Momentum Equation (Conservation of Momentum):</strong></p>
    <span>{`\\[\\frac{\\partial \\mathbf{u}}{\\partial t} + (\\mathbf{u} \\cdot \\nabla) \\mathbf{u} = -\\frac{1}{\\rho} \\nabla p + \\nu \\nabla^2 \\mathbf{u} + \\mathbf{f}\\]`}</span>
    <p>Where:</p>
    <ul>
      <li>{`\\(\\mathbf{u}\\)`} is the velocity field of the fluid.</li>
      <li>{`\\(t\\)`} is time.</li>
      <li>{`\\(\\rho\\)`} is the fluid density.</li>
      <li>{`\\(p\\)`} is the pressure.</li>
      <li>{`\\(\\nu\\)`} is the kinematic viscosity.</li>
      <li>{`\\(\\mathbf{f}\\)`} represents external forces (e.g., gravity, Coriolis force in weather models).</li>
    </ul>
    <p>These equations describe how the velocity of a fluid evolves over time under the influence of pressure gradients, viscosity, and external forces.</p>
  </div>
            <div className="highlight">
              <h3>Navier-Stokes in Weather Forecasting</h3>
              <p>
                In traditional weather forecasting, numerical weather prediction (NWP) models solve the Navier-Stokes equations on a discretized grid of the atmosphere. These models incorporate additional equations for thermodynamics and moisture to simulate the complex interactions that produce weather phenomena. For example:
              </p>
              <ul>
              <li>Wind patterns are driven by pressure gradients ({`-\\frac{1}{\\rho} \\nabla p`}).</li>
                <li>The Coriolis force, included in {`\\(\\mathbf{f}\\)`}, accounts for the Earth's rotation, influencing large-scale weather systems like cyclones.</li>
                <li>Viscosity ({`\\nu \\nabla^2 \\mathbf{u}`}) models the diffusion of momentum, though it’s often small in atmospheric flows.</li>
              </ul>
              <p>
                Solving these equations is computationally intensive, requiring supercomputers to simulate the atmosphere over time. However, neural networks, like the one in our weather forecasting case study, can approximate these dynamics by learning patterns directly from data, bypassing the need to solve the equations explicitly.
              </p>
            </div>
            <div className="math-definition">
              <h3>Connecting Navier-Stokes to Neural Networks</h3>
              <p>
                Neural networks can be used to approximate solutions to the Navier-Stokes equations, a technique known as physics-informed neural networks (PINNs). In PINNs, the network is trained not only on data but also on the physical constraints imposed by the Navier-Stokes equations. The loss function includes terms to enforce:
              </p>
              <span>{`\\[\\mathcal{L}_{\\text{PDE}} = \\left\\| \\frac{\\partial \\mathbf{u}}{\\partial t} + (\\mathbf{u} \\cdot \\nabla) \\mathbf{u} + \\frac{1}{\\rho} \\nabla p - \\nu \\nabla^2 \\mathbf{u} - \\mathbf{f} \\right\\|^2\\]`}</span>
              <p>
                This ensures that the network’s predictions align with the physical laws of fluid dynamics. In weather forecasting, PINNs can enhance the neural network from our case study by incorporating physical constraints, improving the accuracy of predictions for phenomena like storm development.
              </p>
            </div>
            <div className="highlight">
              <h3>Backpropagation and Navier-Stokes</h3>
              <p>
                Training a neural network to approximate Navier-Stokes solutions involves backpropagation, just as in our earlier examples. The gradients of the loss function, including the PDE residual {`\\(\\mathcal{L}_{\\text{PDE}}\\)`}, are computed with respect to the network’s weights. For example, the chain rule is applied to terms like {`\\(\\frac{\\partial \\mathbf{u}}{\\partial t}\\)`}, which are approximated by the network’s outputs. This allows the network to learn both from data (e.g., historical weather observations) and from the underlying physics, creating a hybrid approach that combines the strengths of traditional NWP and modern machine learning.
              </p>
            </div>
          </section>
          <section>
            <h2>Convolutional Neural Networks: Powering Spatial Data Processing</h2>
            <p>
              Convolutional Neural Networks (CNNs) are a class of neural networks specifically designed to process structured grid-like data, such as images or time-series data. In the context of weather forecasting, CNNs are particularly well-suited for handling spatial data like satellite imagery and weather maps, which contain critical information about cloud formations, pressure systems, and other atmospheric patterns. Let’s explore the architecture of CNNs, revisit their application in our weather forecasting case study, and examine how backpropagation enables their training.
            </p>
            <div className="highlight">
              <h3>Architecture of a CNN</h3>
              <p>A typical CNN consists of several types of layers, each serving a specific purpose in extracting and processing features from the input data:</p>
              <ul>
                <li><strong>Convolutional Layers:</strong> These layers apply convolution operations to the input data using learnable filters. Each filter slides over the input (e.g., a satellite image) to produce a feature map, capturing local patterns like edges or textures. In weather forecasting, this might correspond to detecting cloud patterns or pressure gradients.</li>
                <li><strong>Pooling Layers:</strong> Pooling layers downsample the feature maps, reducing their spatial dimensions while preserving important features. Max pooling, for example, takes the maximum value in a region, helping the network focus on the most prominent features and reducing computational complexity.</li>
                <li><strong>Fully Connected Layers:</strong> After convolution and pooling, the extracted features are flattened and passed through fully connected layers, which combine the features to make predictions. In our weather forecasting model, these layers integrate spatial features (from satellite imagery) with tabular data (e.g., temperature, coordinates) to predict temperature and precipitation.</li>
              </ul>
              <p>The CNN architecture from our weather forecasting case study (visualized earlier) follows this structure, with two convolutional layers, two pooling layers, and fully connected layers leading to the output.</p>
            </div>
            <div className="math-definition">
              <h3>Convolution Operation</h3>
              <p>The core operation in a convolutional layer is the convolution, which can be mathematically expressed as:</p>
              <span>{`\\[(f * g)(i, j) = \\sum_m \\sum_n f(m, n) \\cdot g(i-m, j-n)\\]`}</span>
              <p>Where:</p>
              <ul>
                <li>{`\\(f\\)`} is the input (e.g., a satellite image).</li>
                <li>{`\\(g\\)`} is the convolutional filter (a small matrix of weights).</li>
                <li>{`\\((i, j)\\)`} are the coordinates in the output feature map.</li>
              </ul>
              <p>This operation allows the network to learn spatial hierarchies of features, from low-level patterns (e.g., edges) in early layers to high-level patterns (e.g., cloud formations) in deeper layers.</p>
            </div>
            <div className="highlight">
              <h3>CNNs in Weather Forecasting</h3>
              <p>
                In our weather forecasting case study, the CNN processes spatial data like satellite imagery to extract features relevant to weather prediction. For example, the first convolutional layer might detect cloud patterns, while the second layer, after pooling, focuses on larger-scale structures like storm systems. These features are then combined with tabular data (e.g., temperature, humidity) in the fully connected layers to predict temperature and precipitation. This data-driven approach allows the network to learn complex patterns without explicitly solving the Navier-Stokes equations, making it more computationally efficient than traditional numerical weather prediction (NWP) models.
              </p>
            </div>
            <div className="highlight">
              <h3>Backpropagation in CNNs</h3>
              <p>
                Training a CNN involves backpropagation, just as in the PINN example for Navier-Stokes. However, the process is adapted to handle the unique structure of CNNs:
              </p>
              <ul>
                <li><strong>Gradients for Convolutional Layers:</strong> The gradients of the loss with respect to the filter weights are computed by convolving the input with the error term (the gradient of the loss with respect to the feature map). This is similar to the chain rule in backpropagation but applied spatially across the feature maps.</li>
                <li><strong>Gradients for Pooling Layers:</strong> In pooling layers (e.g., max pooling), the gradient is routed back to the position that contributed to the output (e.g., the max value), ensuring that the error is propagated correctly.</li>
                <li><strong>Weight Updates:</strong> The weights of the filters and fully connected layers are updated using gradient descent, just as in a standard neural network. The learning rate determines the step size for these updates.</li>
              </ul>
              <p>
                Backpropagation in CNNs allows the network to learn the optimal filters for extracting weather-related features, enabling accurate predictions of temperature and precipitation.
              </p>
            </div>
            <pre>
              <code className="language-python">{`
  # WeatherCNN from the Case Study
  class WeatherCNN(nn.Module):
      def __init__(self):
          super().__init__()
          self.conv1 = nn.Conv2d(3, 16, 3)  # Satellite imagery (RGB)
          self.conv2 = nn.Conv2d(16, 32, 3)
          self.fc1 = nn.Linear(32*6*6 + 5, 128)  # +5 for non-spatial features
          self.fc2 = nn.Linear(128, 2)  # Temp and precip outputs
      
      def forward(self, spatial_x, tabular_x):
          x = F.relu(self.conv1(spatial_x))
          x = F.max_pool2d(x, 2)
          x = F.relu(self.conv2(x))
          x = x.view(-1, 32*6*6)
          x = torch.cat((x, tabular_x), dim=1)  # Combine spatial and tabular data
          x = F.relu(self.fc1(x))
          return self.fc2(x)
              `}</code>
            </pre>
            <div className="highlight">
              <h3>Example: Enhanced WeatherCNN with nn.Module</h3>
              <p>
                Below is an enhanced version of the <code>WeatherCNN</code> model from our case study, implemented using PyTorch’s <code>nn.Module</code>. This version includes batch normalization and dropout to improve training stability and prevent overfitting. The model takes two types of inputs: spatial data (e.g., satellite imagery) and tabular data (e.g., temperature, humidity, coordinates), and predicts temperature and precipitation likelihood.
              </p>
              <pre>
                <code className="language-python">{`
  import torch
  import torch.nn as nn
  import torch.nn.functional as F

  class EnhancedWeatherCNN(nn.Module):
      def __init__(self):
          super(EnhancedWeatherCNN, self).__init__()
          # Convolutional layers for spatial data (e.g., satellite imagery: 3 channels, 32x32)
          self.conv1 = nn.Conv2d(in_channels=3, out_channels=16, kernel_size=3, padding=1)
          self.bn1 = nn.BatchNorm2d(16)  # Batch normalization after conv1
          self.conv2 = nn.Conv2d(in_channels=16, out_channels=32, kernel_size=3, padding=1)
          self.bn2 = nn.BatchNorm2d(32)  # Batch normalization after conv2
          self.pool = nn.MaxPool2d(kernel_size=2, stride=2)  # Pooling layer

          # Fully connected layers to combine spatial and tabular data
          self.fc1 = nn.Linear(32 * 8 * 8 + 5, 128)  # 32*8*8 from spatial, +5 for tabular
          self.dropout = nn.Dropout(0.5)  # Dropout for regularization
          self.fc2 = nn.Linear(128, 64)
          self.fc3 = nn.Linear(64, 2)  # Output: temperature and precipitation

      def forward(self, spatial_x, tabular_x):
          # Process spatial data through convolutional layers
          x = self.pool(F.relu(self.bn1(self.conv1(spatial_x))))  # Output: 16x16x16
          x = self.pool(F.relu(self.bn2(self.conv2(x))))  # Output: 8x8x32

          # Flatten the spatial features
          x = x.view(-1, 32 * 8 * 8)  # Flatten to (batch_size, 32*8*8)

          # Concatenate spatial features with tabular data
          x = torch.cat((x, tabular_x), dim=1)  # Combine: (batch_size, 32*8*8 + 5)

          # Process through fully connected layers
          x = F.relu(self.fc1(x))
          x = self.dropout(x)  # Apply dropout during training
          x = F.relu(self.fc2(x))
          x = self.fc3(x)  # Output: (batch_size, 2)
          return x

  # Example: Training loop with backpropagation
  def train_weather_cnn(model, train_loader, epochs=10, learning_rate=0.001):
      criterion = nn.MSELoss()  # Mean squared error for regression
      optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)
      
      model.train()
      for epoch in range(epochs):
          total_loss = 0
          for batch_idx, (spatial_data, tabular_data, targets) in enumerate(train_loader):
              # Zero the gradients
              optimizer.zero_grad()
              
              # Forward pass
              outputs = model(spatial_data, tabular_data)
              
              # Compute loss
              loss = criterion(outputs, targets)
              
              # Backward pass (backpropagation)
              loss.backward()
              
              # Update weights
              optimizer.step()
              
              total_loss += loss.item()
          print(f"Epoch {epoch+1}/{epochs}, Loss: {total_loss / len(train_loader):.4f}")

  # Example usage
  if __name__ == "__main__":
      # Dummy data for illustration
      spatial_data = torch.randn(32, 3, 32, 32)  # Batch of 32 images (3 channels, 32x32)
      tabular_data = torch.randn(32, 5)  # Batch of 32 tabular inputs (5 features)
      targets = torch.randn(32, 2)  # Batch of 32 targets (temp, precip)
      
      # Initialize model
      model = EnhancedWeatherCNN()
      
      # Train the model (simplified)
      train_loader = [(spatial_data, tabular_data, targets)]  # Dummy data loader
      train_weather_cnn(model, train_loader)
                `}</code>
              </pre>
              <div className="callout">
                <h3>Explanation of the EnhancedWeatherCNN</h3>
                <p>
                  Let’s break down the components of this <code>nn.Module</code> implementation:
                </p>
                <ul>
                  <li><strong>Initialization (<code>__init__</code>):</strong> Defines the layers of the network. The convolutional layers (<code>conv1</code>, <code>conv2</code>) process spatial data, with batch normalization (<code>bn1</code>, <code>bn2</code>) to stabilize training by normalizing activations. The pooling layer (<code>pool</code>) reduces spatial dimensions. The fully connected layers (<code>fc1</code>, <code>fc2</code>, <code>fc3</code>) combine features and produce the final output, with dropout (<code>dropout</code>) to prevent overfitting.</li>
                  <li><strong>Forward Pass (<code>forward</code>):</strong> Defines the data flow through the network. Spatial data passes through the convolutional and pooling layers, is flattened, and then concatenated with tabular data. The combined features are processed through the fully connected layers to produce the output (temperature and precipitation).</li>
                  <li><strong>Training Loop (<code>train_weather_cnn</code>):</strong> Demonstrates how backpropagation is used to train the model. The loop computes the loss, performs backpropagation with <code>loss.backward()</code>, and updates the weights using the Adam optimizer. This process mirrors the backpropagation concepts discussed earlier in the blog.</li>
                  <li><strong>Usage Example:</strong> Shows how to initialize and train the model with dummy data, illustrating the practical application of the CNN in weather forecasting.</li>
                </ul>
                <p>
                  This enhanced model builds on the original <code>WeatherCNN</code> by adding batch normalization and dropout, making it more robust for real-world weather forecasting tasks.
                </p>
              </div>
            </div>
          </section>
          <section>
            <h2>Real-World Applications and Sector Impact</h2>
            <table>
              <thead>
                <tr>
                  <th>Sector</th>
                  <th>Weather Prediction Impact</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Agriculture</td>
                  <td>Crop planning, irrigation optimization</td>
                </tr>
                <tr>
                  <td>Disaster Management</td>
                  <td>Early warning systems, evacuation planning</td>
                </tr>
                <tr>
                  <td>Energy</td>
                  <td>Renewable energy generation forecasting</td>
                </tr>
                <tr>
                  <td>Transportation</td>
                  <td>Route planning, safety management</td>
                </tr>
              </tbody>
            </table>
          </section>
          <section>
            <h2>Future Directions and Challenges</h2>
            <p>While CNNs represent a significant advancement, challenges remain:</p>
            <ul>
              <li>Managing high-dimensional atmospheric data</li>
              <li>Improving computational efficiency</li>
              <li>Addressing inherent chaotic system limitations</li>
            </ul>
          </section>
          <footer>
            <h3>External Resources</h3>
            <ul>
              <li>
                <a href="https://arxiv.org/list/cs.LG/recent" target="_blank" rel="noopener noreferrer">
                  ArXiv Machine Learning Research
                </a>
              </li>
              <li>
                <a href="https://www.tensorflow.org/tutorials/images/cnn" target="_blank" rel="noopener noreferrer">
                  TensorFlow CNN Tutorial
                </a>
              </li>
              <li>
                <a href="https://pytorch.org/tutorials/beginner/nn_tutorial.html" target="_blank" rel="noopener noreferrer">
                  PyTorch Neural Network Guide
                </a>
              </li>
            </ul>
          </footer>
        </article>
      </div>
    </BlogPostLayout>
  );
}
