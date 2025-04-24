import Head from 'next/head';
import BlogPostLayout from '@/components/layout/BlogPostLayout';
import Script from 'next/script';
import { useEffect } from 'react';
import styles from '@/styles/BlogPost.module.css'; // Keep styles for content elements

// --- Define Meta and Author Data Once ---
const pageMeta = {
  title: 'Introduction to Neural Networks',
  description: 'A brief overview of neural networks, their structure, and how they learn, forming the foundation of modern AI.', // Added description
  canonicalUrl: "https://choudharyom.com/intro-to-neural-networks", // Keep specific canonical if needed
  date: "2025-04-15", // Example date - Update with actual publish date
  readingTime: "7 min read", // Example reading time
  tags: ['neural-networks', 'machine-learning', 'introduction', 'ai'], // Added tags
};

const pageAuthor = {
  name: "Om Choudhary", // Consistent name
  title: 'Software Architect👾',
  bio: 'I write about machine learning, neural networks, and mathematical foundations of AI. Currently working on research in deep learning optimization.',
  imageUrl: "/images/AuthorOm.png", // Use consistent image path
};
// --- End Data Definition ---

const IntroToNeuralNetworks = () => {
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
    <BlogPostLayout meta={pageMeta} author={pageAuthor} >
      <div className={styles.content}>
        <section>
          <p>
            Welcome! You've likely heard the terms "neural networks," "deep learning," and "artificial intelligence" buzzing around, powering everything from your smartphone's voice assistant to complex scientific discoveries. But what are these neural networks? How do they work? And how do they manage to "learn"?
          </p>
          
          <p>
            This post aims to be your comprehensive introduction. We'll journey from the basic inspiration behind neural networks to the fundamental mechanisms that allow them to learn from data. Whether you're a curious beginner or someone looking to solidify their foundational knowledge, this guide is for you.
          </p>

          <div className="highlight">
            <h3>What We'll Cover</h3>
            <ul>
              <li>The Core Idea: Neurons, Layers, and the Brain Analogy</li>
              <li>Mathematical Foundations: A Glimpse Under the Hood</li>
              <li>Forward Propagation: How Information Flows Through the Network</li>
              <li>Learning from Mistakes: Loss Functions and the Goal of Training</li>
              <li>Backpropagation: The Engine of Learning</li>
              <li>Gradient Descent: Adjusting the Weights</li>
              <li>Advanced Concepts and Future Directions</li>
            </ul>
          </div>
        </section>

        <h2 id="core-idea">The Core Idea: Neurons, Layers, and the Brain Analogy</h2>
        <p>
          Neural networks are, at their heart, computational models inspired by the intricate network of neurons in the human brain. While they are a vast simplification of biological neural processes, they capture the essence of distributed information processing and learning through interconnected units.
        </p>
        
        <h3 id="artificial-neuron">The Artificial Neuron</h3>
        <p>
          The fundamental building block is the artificial neuron, sometimes called a node or unit. A single neuron:
        </p>
        
        <ul>
          <li><strong>Receives Inputs:</strong> It takes one or more input values (x₁, x₂, ..., xₙ). These could be raw data features or outputs from neurons in a previous layer.</li>
          <li><strong>Has Associated Weights:</strong> Each input connection has a weight (w₁, w₂, ..., wₙ). These weights signify the strength or importance of that input connection.</li>
          <li><strong>Calculates a Weighted Sum:</strong> The neuron multiplies each input by its corresponding weight and sums them up. A bias term (b) is often added to this sum.</li>
          <li><strong>Applies an Activation Function:</strong> The result of the weighted sum (z) is passed through a non-linear activation function (f).</li>
        </ul>

        <div className="formula">
          <p>The final output of the neuron is:</p>
          <p>a = f(z) where z = (w₁x₁ + w₂x₂ + ... + wₙxₙ) + b</p>
          <p>Or in vector notation: a = f(w·x + b)</p>
        </div>

        <h3 id="network-layers">Layers of Neurons</h3>
        <p>
          Individual neurons aren't very powerful. The magic happens when they are organized into layers:
        </p>
        
        <ul>
          <li><strong>Input Layer:</strong> The entry point for your data.</li>
          <li><strong>Hidden Layers:</strong> The layers between the input and output layers where the bulk of computation happens.</li>
          <li><strong>Output Layer:</strong> This layer produces the final result of the network.</li>
        </ul>

        <pre>
          <code className="language-python">
{`# Simple neural network structure in Python
import numpy as np

class SimpleNeuralNetwork:
    def __init__(self, input_size, hidden_size, output_size):
        # Initialize weights and biases
        self.W1 = np.random.randn(input_size, hidden_size) * 0.01
        self.b1 = np.zeros((1, hidden_size))
        self.W2 = np.random.randn(hidden_size, output_size) * 0.01
        self.b2 = np.zeros((1, output_size))
        
    def forward(self, X):
        # Forward propagation
        self.z1 = np.dot(X, self.W1) + self.b1
        self.a1 = np.maximum(0, self.z1)  # ReLU activation
        self.z2 = np.dot(self.a1, self.W2) + self.b2
        self.a2 = self._softmax(self.z2)  # Softmax for classification
        return self.a2
        
    def _softmax(self, z):
        exp_z = np.exp(z - np.max(z, axis=1, keepdims=True))
        return exp_z / np.sum(exp_z, axis=1, keepdims=True)`}
          </code>
        </pre>

        <h2 id="mathematical-foundations">Mathematical Foundations: A Glimpse Under the Hood</h2>
        <p>
          While you can grasp the core concepts of neural networks intuitively, their operation is fundamentally mathematical. The key ingredients include:
        </p>
        
        <ul>
          <li><strong>Linear Algebra:</strong> Essential for handling inputs, weights, and calculations efficiently.</li>
          <li><strong>Calculus:</strong> Crucial for the learning process (backpropagation).</li>
          <li><strong>Probability and Statistics:</strong> Used in understanding loss functions and evaluating model performance.</li>
        </ul>

        <div className="highlight">
          <h3>Key Mathematical Components</h3>
          <ul>
            <li>Vectors and matrices for representing inputs and weights</li>
            <li>Matrix multiplication for weighted sum calculations</li>
            <li>Partial derivatives for calculating gradients during learning</li>
            <li>Chain rule for backpropagation</li>
          </ul>
        </div>

        <h2 id="forward-propagation">Forward Propagation: How Information Flows Through the Network</h2>
        <p>
          Forward propagation (or a forward pass) is the process of feeding input data through the network to get an output or prediction. It's the network's way of making a guess based on its current weights.
        </p>

        <h3>The Step-by-Step Flow</h3>
        <ol>
          <li><strong>Input:</strong> The process starts with your input data vector, x, which is fed into the input layer.</li>
          <li><strong>First Hidden Layer:</strong> Each neuron calculates its weighted sum and applies the activation function.</li>
          <li><strong>Subsequent Hidden Layers:</strong> The process repeats for any additional hidden layers.</li>
          <li><strong>Output Layer:</strong> Finally, the activation from the last hidden layer is fed into the output layer to produce the prediction.</li>
        </ol>

        <div className="formula">
          <p>For each layer k:</p>
          <p>z⁽ᵏ⁾ = W⁽ᵏ⁾·a⁽ᵏ⁻¹⁾ + b⁽ᵏ⁾</p>
          <p>a⁽ᵏ⁾ = f(z⁽ᵏ⁾)</p>
        </div>

        <h2 id="loss-functions">Learning from Mistakes: Loss Functions and the Goal of Training</h2>
        <p>
          The prediction from the forward pass is compared to the actual target value. The difference represents the network's error, quantified by a loss function.
        </p>
        
        <h3>Common Loss Functions</h3>
        <ul>
          <li><strong>Mean Squared Error (MSE):</strong> Often used for regression tasks.</li>
          <li><strong>Binary Cross-Entropy:</strong> Used for binary classification.</li>
          <li><strong>Categorical Cross-Entropy:</strong> Used for multi-class classification.</li>
        </ul>
        
        <p>
          The goal of training is to find the set of weights and biases that minimize the value of the loss function, averaged over the entire training dataset.
        </p>

        <h2 id="backpropagation">Backpropagation: The Engine of Learning</h2>
        <p>
          Backpropagation is arguably the most critical algorithm in training neural networks. It propagates the error signal backward through the network to calculate how much each weight and bias contributed to the overall error.
        </p>
        
        <h3>The Chain Rule: The Mathematical Magic</h3>
        <p>
          Backpropagation relies heavily on the chain rule from calculus. The loss depends on a chain of calculations, and the chain rule allows us to compute the derivative of the loss with respect to any parameter.
        </p>

        <div className="formula">
          <p>The derivative of the loss with respect to a weight is calculated by:</p>
          <p>∂L/∂w = ∂L/∂a · ∂a/∂z · ∂z/∂w</p>
        </div>

        <h3>Steps in Backpropagation</h3>
        <ol>
          <li>Calculate error at the output layer</li>
          <li>Calculate gradients for the output layer's weights and biases</li>
          <li>Propagate error back to previous layers</li>
          <li>Calculate gradients for each layer's weights and biases</li>
          <li>Repeat until reaching the first hidden layer</li>
        </ol>

        <h2 id="gradient-descent">Gradient Descent: Adjusting the Weights</h2>
        <p>
          After calculating the gradients through backpropagation, gradient descent is used to update the weights and biases in the direction that reduces the loss.
        </p>
        
        <h3>The Update Rule</h3>
        <div className="formula">
          <p>For each weight w and bias b:</p>
          <p>wₙₑw = wₒₗd - η · ∂L/∂w</p>
          <p>bₙₑw = bₒₗd - η · ∂L/∂b</p>
          <p>Where η (eta) is the learning rate.</p>
        </div>

        <p>
          Through many iterations of this forward pass → loss calculation → backward pass → weight update cycle, the network gradually adjusts its parameters to minimize the loss function, effectively "learning" the patterns in the training data.
        </p>

        <pre>
          <code className="language-python">
{`# Basic training loop pseudocode
def train(model, X_train, y_train, learning_rate, epochs):
    for epoch in range(epochs):
        # Forward pass
        y_pred = model.forward(X_train)
        
        # Calculate loss
        loss = calculate_loss(y_pred, y_train)
        
        # Backpropagation (calculate gradients)
        gradients = calculate_gradients(model, X_train, y_train)
        
        # Update weights and biases
        for param, grad in zip(model.parameters(), gradients):
            param -= learning_rate * grad
            
        # Print progress
        if epoch % 100 == 0:
            print(f"Epoch {epoch}, Loss: {loss}")`}
          </code>
        </pre>

        <h2 id="advanced-concepts">Beyond the Basics: Advanced Concepts</h2>
        
        <h3>Activation Functions</h3>
        <p>
          Different activation functions serve different purposes:
        </p>
        <ul>
          <li><strong>ReLU:</strong> Fast computation, helps with vanishing gradient problem</li>
          <li><strong>Sigmoid/Tanh:</strong> Maps values to bounded ranges</li>
          <li><strong>Softmax:</strong> Converts raw scores to probability distributions</li>
        </ul>
        
        <h3>Network Architectures</h3>
        <p>
          Beyond simple fully-connected networks, specialized architectures include:
        </p>
        <ul>
          <li><strong>Convolutional Neural Networks (CNNs):</strong> Specialized for grid-like data, particularly images</li>
          <li><strong>Recurrent Neural Networks (RNNs):</strong> Designed for sequential data like text or time series</li>
          <li><strong>Transformers:</strong> Modern architecture using attention mechanisms, revolutionizing NLP</li>
        </ul>
        
        <h3>Regularization Techniques</h3>
        <p>
          To prevent overfitting, techniques include:
        </p>
        <ul>
          <li><strong>L1/L2 Regularization:</strong> Adds penalties based on weight magnitude</li>
          <li><strong>Dropout:</strong> Randomly deactivates neurons during training</li>
          <li><strong>Early Stopping:</strong> Halts training when validation performance stops improving</li>
        </ul>

        <h2 id="conclusion">Looking Ahead: What's Next?</h2>
        <p>
          We've covered a lot of ground, from the basic neuron to the complexities of backpropagation, implementation, and optimization. Neural networks are a vast and rapidly evolving field. This introduction provides the foundation, but the journey doesn't end here.
        </p>
        
        <p>
          The power of neural networks lies in their ability to automatically learn intricate patterns from data. By understanding the core principles laid out here – layers, forward propagation, loss functions, backpropagation, and gradient descent – you are well-equipped to start exploring this fascinating field further.
        </p>
        
        <div className="highlight">
          <h3>Next Steps in Your Neural Network Journey</h3>
          <ul>
            <li>Experiment with implementations using frameworks like TensorFlow or PyTorch</li>
            <li>Dive deeper into specialized architectures like CNNs and RNNs</li>
            <li>Explore advanced optimization techniques</li>
            <li>Stay updated with cutting-edge research in deep learning</li>
          </ul>
        </div>
        
        <p>
          Keep learning, keep experimenting, and welcome to the world of neural networks!
        </p>
      </div>
    </BlogPostLayout>
  );
};

export default IntroToNeuralNetworks;
