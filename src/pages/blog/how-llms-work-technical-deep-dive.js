import Head from 'next/head';
import BlogPostLayout from '@/components/layout/BlogPostLayout';
import { useEffect } from 'react';
import styles from '@/styles/BlogPost.module.css';

// --- Define Meta and Author Data ---
const pageMeta = {
  id: 'llm-technical-deep-dive',
  slug: 'how-llms-work-technical-deep-dive',
  title: 'Unpacking the Magic: A Technical Deep Dive into How LLMs Work',
  description: 'A comprehensive technical exploration of Large Language Models, from tokenization and embeddings to the Transformer architecture and attention mechanisms.',
  coverImage: '/images/llm-architecture.jpg',
  canonicalUrl: "https://choudharyom.com/blog/how-llms-work-technical-deep-dive",
  date: "2025-06-06",
  readingTime: "18 min read",
  tags: ['llm', 'transformers', 'attention-mechanism', 'neural-networks', 'nlp'],
  content: `
    <p>Large Language Models like GPT, Claude, and Gemini seem almost magical in their ability to generate human-like text. This deep dive explores the sophisticated mathematics and architecture behind these powerful systems.</p>
  `
};

const pageAuthor = {
  name: "Om Choudhary",
  title: 'Software Architect👾',
  bio: 'I write about machine learning, neural networks, and mathematical foundations of AI. Currently working on research in deep learning optimization.',
  imageUrl: "/images/AuthorOm.png",
};

const LLMTechnicalDeepDive = () => {
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
    <BlogPostLayout meta={pageMeta} author={pageAuthor}>
      <div className={styles.content}>
        
        <section>
          <p>
            Large Language Models (LLMs) like ChatGPT, Google Gemini, and Claude often feel almost magical in their ability to understand and generate human-like text. We type a prompt, and they respond with coherent, relevant output. But beneath the surface, this 'magic' is the result of sophisticated mathematics, neural network architectures, and careful engineering. In this technical deep dive, we'll unpack exactly how these systems work, from the initial tokenization of your input to the final probability distributions that generate responses.
          </p>

          <div className="highlight">
            <h3>What you'll learn:</h3>
            <ul>
              <li>The mathematical foundations of the Transformer architecture</li>
              <li>How attention mechanisms capture contextual relationships</li>
              <li>The encoding process from text to high-dimensional vectors</li>
              <li>Training vs inference phases with detailed code examples</li>
              <li>The role of temperature, top-k, and nucleus sampling in generation</li>
            </ul>
          </div>

          <h2>Understanding GPT: Generative Pre-trained Transformer</h2>
          
          <p>
            The acronym GPT encapsulates three fundamental concepts that define how modern LLMs operate. Let's break down each component and understand why this architecture has become the foundation for nearly every major language model.
          </p>

          <h3>Generative: Creating New Content</h3>
          <p>
            Unlike search engines that retrieve existing content, LLMs are <strong>generative</strong> systems. They don't lookup answers—they compute them. The generative process is fundamentally about predicting probability distributions over possible next tokens:
          </p>

          <div className="highlight">
            <p>
              {'$$P(w_{t+1} | w_1, w_2, ..., w_t) = \\text{softmax}(f_\\theta(w_1, w_2, ..., w_t))$$'}
            </p>
            <p style={{textAlign: 'center', fontSize: '0.9em', color: '#666'}}>
              Probability of next token given previous sequence
            </p>
          </div>

          <p>
            Where <code>f_θ</code> represents the neural network with parameters θ, and the softmax function converts raw logits into a probability distribution over the entire vocabulary.
          </p>

          <h3>Pre-trained: Learning from Vast Datasets</h3>
          <p>
            The "pre-trained" aspect involves learning statistical patterns from enormous text corpora. During pre-training, models learn to minimize the cross-entropy loss:
          </p>

          <div className="highlight">
            <p>
              {'$$\\mathcal{L} = -\\sum_{i=1}^{|V|} y_i \\log(\\hat{y}_i)$$'}
            </p>
            <p style={{textAlign: 'center', fontSize: '0.9em', color: '#666'}}>
              Cross-entropy loss between predicted and actual next tokens
            </p>
          </div>

          <p>
            Where <code>|V|</code> is the vocabulary size, <code>y_i</code> is the true distribution (one-hot encoded), and <code>ŷ_i</code> is the predicted probability distribution.
          </p>

          <h2>Step 1: Tokenization - Converting Text to Numbers</h2>

          <p>
            Before any neural network processing can begin, text must be converted into numerical tokens. Modern LLMs use sophisticated subword tokenization algorithms like Byte Pair Encoding (BPE) or SentencePiece.
          </p>

          <pre>
            <code className="language-python">
{`# Example: Tokenization with Hugging Face Transformers
from transformers import AutoTokenizer
import torch

# Load a pre-trained tokenizer
tokenizer = AutoTokenizer.from_pretrained("gpt2")

# Tokenize input text
text = "The quick brown fox jumps over the lazy dog"
tokens = tokenizer.encode(text, return_tensors="pt")

print(f"Original text: {text}")
print(f"Token IDs: {tokens}")
print(f"Decoded tokens: {[tokenizer.decode([token]) for token in tokens[0]]}")

# Output might look like:
# Token IDs: tensor([[464, 2068, 7586, 21831, 18045, 625, 262, 16931, 3290]])
# Decoded: ['The', ' quick', ' brown', ' fox', ' jumps', ' over', ' the', ' lazy', ' dog']`}
            </code>
          </pre>

          <div className="figure-container">
            <svg width="700" height="550" xmlns="http://www.w3.org/2000/svg" fontFamily="Arial, sans-serif" aria-labelledby="svgTitle" role="img">
              <title id="svgTitle">Tokenization Process Visualization</title>
              <desc>Illustration of how input text is tokenized, showing original text, a tokenizer engine, the resulting tokens with their IDs, and a conceptual slider for different tokenization strategies.</desc>
              <style>{`
                .input-text-svg { font-size: 16px; fill: #333; }
                .token-box-svg { fill: #e0f7fa; stroke: #00796b; stroke-width: 1; rx: 5; ry: 5; }
                .token-text-svg { font-size: 14px; fill: #004d40; text-anchor: middle; dominant-baseline: central; }
                .token-id-text-svg { font-size: 11px; fill: #00796b; text-anchor: middle; dominant-baseline: central; }
                .label-text-svg { font-size: 14px; fill: #444; }
                .title-text-svg { font-size: 20px; font-weight: bold; fill: #2c3e50; text-anchor: middle; }
                .arrow-line-svg { stroke: #555; stroke-width: 2; marker-end: url(#arrowhead-svg); }
                .engine-box-svg { fill: #fffde7; stroke: #fbc02d; stroke-width: 1.5; rx:8; ry:8; }
                .engine-text-svg { font-size: 14px; font-weight: bold; fill: #e65100; text-anchor: middle; dominant-baseline: central; }
                .engine-subtext-svg { font-size: 12px; fill: #f57f17; text-anchor: middle; dominant-baseline: central; }
                .slider-track-svg { fill: #bdbdbd; rx:3; ry:3; }
                .slider-thumb-svg { fill: #00796b; stroke: #004d40; stroke-width:1; }
                .slider-label-svg { font-size: 12px; fill: #333; text-anchor: middle; }
              `}</style>
              <defs>
                <marker id="arrowhead-svg" viewBox="0 0 10 10" refX="8" refY="5"
                    markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#555" />
                </marker>
              </defs>

              <text x="350" y="35" className="title-text-svg">Tokenization Process</text>

              {/* Input Text */}
              <text x="30" y="75" className="label-text-svg">Input Text:</text>
              <rect x="30" y="85" width="640" height="40" fill="#f9f9f9" stroke="#d1d1d1" rx="5"/>
              <text x="40" y="110" className="input-text-svg">The quick brown fox jumps over the lazy dog</text>

              {/* Arrow to Tokenizer */}
              <line x1="350" y1="135" x2="350" y2="165" className="arrow-line-svg" />

              {/* Tokenizer Engine */}
              <rect x="275" y="175" width="150" height="60" className="engine-box-svg"/>
              <text x="350" y="200" className="engine-text-svg">Tokenizer</text>
              <text x="350" y="220" className="engine-subtext-svg">(e.g., BPE)</text>

              {/* Arrow from Tokenizer */}
              <line x1="350" y1="245" x2="350" y2="275" className="arrow-line-svg" />

              {/* Output Tokens */}
              <text x="30" y="300" className="label-text-svg">Output Tokens (with IDs):</text>
              
              {(() => {
                const tokensData = [
                  { text: "The", id: 464, width: 60 },
                  { text: " quick", id: 2068, width: 75 },
                  { text: " brown", id: 7586, width: 75 },
                  { text: " fox", id: 21831, width: 60 },
                  { text: " jumps", id: 18045, width: 75 }
                ];
                const tokensData2 = [
                  { text: " over", id: 625, width: 70 },
                  { text: " the", id: 262, width: 60 },
                  { text: " lazy", id: 16931, width: 70 },
                  { text: " dog", id: 3290, width: 60 }
                ];

                let elements = [];
                let currentX = 30;
                const tokenY1 = 340;
                const boxHeight = 40;
                const idOffsetY = 15;
                const spacing = 10;

                tokensData.forEach(token => {
                  elements.push(
                    <g key={`token-${token.id}-g1`}>
                      <rect x={currentX} y={tokenY1} width={token.width} height={boxHeight} className="token-box-svg"/>
                      <text x={currentX + token.width / 2} y={tokenY1 + boxHeight / 2} className="token-text-svg">{token.text}</text>
                      <text x={currentX + token.width / 2} y={tokenY1 + boxHeight + idOffsetY} className="token-id-text-svg">ID: {token.id}</text>
                    </g>
                  );
                  currentX += token.width + spacing;
                });

                currentX = 30; // Reset for second row, adjust starting X for centering if desired
                const totalWidthRow2 = tokensData2.reduce((sum, t) => sum + t.width, 0) + (tokensData2.length -1) * spacing;
                currentX = (700 - totalWidthRow2) / 2; // Center the second row

                const tokenY2 = tokenY1 + boxHeight + idOffsetY + 25;
                 tokensData2.forEach(token => {
                  elements.push(
                    <g key={`token-${token.id}-g2`}>
                      <rect x={currentX} y={tokenY2} width={token.width} height={boxHeight} className="token-box-svg"/>
                      <text x={currentX + token.width / 2} y={tokenY2 + boxHeight / 2} className="token-text-svg">{token.text}</text>
                      <text x={currentX + token.width / 2} y={tokenY2 + boxHeight + idOffsetY} className="token-id-text-svg">ID: {token.id}</text>
                    </g>
                  );
                  currentX += token.width + spacing;
                });
                return elements;
              })()}

              {/* Tokenization Strategy Slider - Visual Representation */}
              <text x="350" y="485" className="label-text-svg" textAnchor="middle">Tokenization Strategy</text>
              <rect x="125" y="500" width="450" height="10" className="slider-track-svg"/>
              {/* Thumb indicating BPE is selected for example */}
              <circle cx="125 + 450/3" cy="505" r="8" className="slider-thumb-svg">
                <title>BPE Strategy Selected (Example)</title>
              </circle>
              
              <text x="125" y="530" className="slider-label-svg">Word-Level</text>
              <text x="125 + 450/3" y="530" className="slider-label-svg">BPE</text>
              <text x="125 + 2*450/3" y="530" className="slider-label-svg">SentencePiece</text>
              <text x="125 + 450" y="530" className="slider-label-svg">Unigram</text>
            </svg>
            <p className="figure-caption">Figure 1: Tokenization process showing how text is broken down into subword units</p>
          </div>

          <h2>Step 2: Embeddings - Mapping Tokens to High-Dimensional Vectors</h2>

          <p>
            Once tokenized, each token is mapped to a dense vector representation. These embeddings capture semantic relationships between words in a high-dimensional space (typically 512, 768, 1024, or even 4096 dimensions for large models).
          </p>

          <div className="highlight">
            <p>
              {'$$\\vec{e}_i = E[\\text{token}_i] \\in \\mathbb{R}^{d_{model}}$$'}
            </p>
            <p style={{textAlign: 'center', fontSize: '0.9em', color: '#666'}}>
              Embedding lookup where E is the embedding matrix
            </p>
          </div>

          <pre>
            <code className="language-python">
{`# Creating and working with embeddings
import torch
import torch.nn as nn
import numpy as np

class TokenEmbedding(nn.Module):
    def __init__(self, vocab_size, d_model):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.d_model = d_model
    
    def forward(self, tokens):
        # Scale embeddings by sqrt(d_model) as in the original Transformer paper
        return self.embedding(tokens) * np.sqrt(self.d_model)

# Example usage
vocab_size = 50000
d_model = 512
embedding_layer = TokenEmbedding(vocab_size, d_model)

# Convert tokens to embeddings
token_ids = torch.tensor([[1, 5, 23, 456, 7890]])  # Batch of 1, sequence length 5
embeddings = embedding_layer(token_ids)
print(f"Embedding shape: {embeddings.shape}")  # [1, 5, 512]

# Compute cosine similarity between embeddings
def cosine_similarity(a, b):
    return torch.dot(a, b) / (torch.norm(a) * torch.norm(b))

# Check similarity between different token embeddings
sim = cosine_similarity(embeddings[0, 0], embeddings[0, 1])
print(f"Cosine similarity between tokens: {sim.item():.4f}")`}
            </code>
          </pre>

          {/* SVG Suggestion 2: Embedding Space Visualization */}
          <div className="figure-container">
            <svg width="700" height="500" xmlns="http://www.w3.org/2000/svg" fontFamily="Arial, sans-serif" aria-labelledby="svgTitleEmbedding" role="img">
              <title id="svgTitleEmbedding">Embedding Space Visualization</title>
              <desc>Illustration of a conceptual embedding space where semantically similar words form clusters. Shows clusters for 'Animals', 'Colors', and 'Actions', with unrelated words scattered.</desc>
              <style>{`
                .embedding-title-svg { font-size: 20px; font-weight: bold; fill: #2c3e50; text-anchor: middle; }
                .cluster-label-svg { font-size: 14px; font-weight: bold; text-anchor: middle; }
                .word-text-svg { font-size: 13px; text-anchor: middle; dominant-baseline: central; }
                .cluster-ellipse-svg { stroke-width: 1.5; fill-opacity: 0.15; }
                
                .animals-cluster-svg .cluster-label-svg { fill: #2962ff; } /* Darker Blue */
                .animals-cluster-svg .word-text-svg { fill: #1a237e; }    /* Navy Blue */
                .animals-cluster-svg .cluster-ellipse-svg { fill: #bbdefb; stroke: #64b5f6; } /* Light Blue */

                .colors-cluster-svg .cluster-label-svg { fill: #00897b; } /* Darker Teal */
                .colors-cluster-svg .word-text-svg { fill: #004d40; }   /* Dark Green/Teal */
                .colors-cluster-svg .cluster-ellipse-svg { fill: #b2dfdb; stroke: #4db6ac; } /* Light Teal */

                .actions-cluster-svg .cluster-label-svg { fill: #ef6c00; } /* Darker Orange */
                .actions-cluster-svg .word-text-svg { fill: #e65100; }   /* Deep Orange */
                .actions-cluster-svg .cluster-ellipse-svg { fill: #ffe0b2; stroke: #ffb74d; } /* Light Orange */

                .unrelated-word-svg { fill: #546e7a; font-size: 12px; text-anchor: middle; dominant-baseline: central; }
              `}</style>

              <text x="350" y="35" className="embedding-title-svg">Conceptual Embedding Space: Semantic Clusters</text>

              {/* Cluster 1: Animals */}
              <g className="animals-cluster-svg">
                <ellipse cx="180" cy="150" rx="100" ry="70" className="cluster-ellipse-svg"/>
                <text x="180" y="95" className="cluster-label-svg">Animals</text>
                {[
                  { text: "cat", x: 170, y: 130, size: 1 },
                  { text: "dog", x: 200, y: 120, size: 1 },
                  { text: "kitten", x: 140, y: 150, size: 0.9 },
                  { text: "puppy", x: 220, y: 145, size: 0.9 },
                  { text: "lion", x: 180, y: 175, size: 0.85 },
                  { text: "tiger", x: 120, y: 125, size: 0.95 },
                  { text: "bear", x: 230, y: 170, size: 0.9 },
                ].map(w => (
                  <text key={w.text} x={w.x} y={w.y} className="word-text-svg" 
                    style={{ fontSize: `${13 * w.size}px`, opacity: 0.7 + 0.3 * w.size }}>
                    {w.text}
                  </text>
                  ))}
              </g>

              {/* Cluster 2: Colors */}
              <g className="colors-cluster-svg">
                <ellipse cx="500" cy="160" rx="90" ry="65" className="cluster-ellipse-svg"/>
                <text x="500" y="105" className="cluster-label-svg">Colors</text>
                {[
                  { text: "red", x: 490, y: 140, size: 1 },
                  { text: "blue", x: 520, y: 135, size: 1 },
                  { text: "green", x: 460, y: 160, size: 0.9 },
                  { text: "yellow", x: 540, y: 155, size: 0.9 },
                  { text: "purple", x: 500, y: 185, size: 0.85 },
                  { text: "orange", x: 440, y: 180, size: 0.95 },
                ].map(w => (
                  <text key={w.text} x={w.x} y={w.y} className="word-text-svg" 
                    style={{ fontSize: `${13 * w.size}px`, opacity: 0.7 + 0.3 * w.size }}>
                    {w.text}
                  </text>
                  ))}
              </g>

              {/* Cluster 3: Actions */}
              <g className="actions-cluster-svg">
                <ellipse cx="350" cy="350" rx="110" ry="75" className="cluster-ellipse-svg"/>
                <text x="350" y="285" className="cluster-label-svg">Actions</text>
                {[
                  { text: "run", x: 340, y: 320, size: 1 },
                  { text: "jump", x: 380, y: 315, size: 1 },
                  { text: "eat", x: 300, y: 340, size: 0.9 },
                  { text: "sleep", x: 400, y: 335, size: 0.9 },
                  { text: "fly", x: 350, y: 365, size: 0.85 },
                  { text: "swim", x: 320, y: 380, size: 0.95 },
                  { text: "read", x: 420, y: 370, size: 0.9 },
                ].map(w => (
                  <text key={w.text} x={w.x} y={w.y} className="word-text-svg" 
                  style={{ fontSize: `${13 * w.size}px`, opacity: 0.7 + 0.3 * w.size }}>
                  {w.text}</text>
                ))}
              </g>

              {/* Unrelated Words */}
              <g>
                {[
                  { text: "king", x: 80, y: 300 },
                  { text: "queen", x: 100, y: 70 },
                  { text: "car", x: 600, y: 320 },
                  { text: "house", x: 550, y: 420 },
                  { text: "tree", x: 400, y: 70 },
                  { text: "book", x: 150, y: 430 },
                  { text: "moon", x: 620, y: 75 },
                ].map(w => (
                  <text key={w.text} x={w.x} y={w.y} className="unrelated-word-svg">{w.text}</text>
                ))}
              </g>

              {/* Legend (Optional, colors are indicative) */}
              <g transform="translate(580, 440)">
                <text x="0" y="0" fontSize="12" fill="#333" fontWeight="bold">Legend:</text>
                <rect x="0" y="10" width="10" height="10" fill="#bbdefb" stroke="#64b5f6"/>
                <text x="15" y="18" fontSize="11" fill="#2962ff">Animals</text>
                <rect x="0" y="30" width="10" height="10" fill="#b2dfdb" stroke="#4db6ac"/>
                <text x="15" y="38" fontSize="11" fill="#00897b">Colors</text>
                <rect x="0" y="50" width="10" height="10" fill="#ffe0b2" stroke="#ffb74d"/>
                <text x="15" y="58" fontSize="11" fill="#ef6c00">Actions</text>
                <circle cx="5" cy="75" r="3" fill="#546e7a"/>
                <text x="15" y="78" fontSize="11" fill="#546e7a">Unrelated</text>
              </g>

            </svg>
            <p className="figure-caption">Figure 2: High-dimensional embedding space projected to 3D showing semantic clustering</p>
          </div>

          <h2>Step 3: Positional Encoding - Preserving Sequential Information</h2>

          <p>
            Unlike RNNs, Transformers process all tokens in parallel, losing positional information. Positional encoding addresses this by adding position-dependent vectors to embeddings.
          </p>

          <div className="highlight">
            <p>
              {'$$PE_{(pos, 2i)} = \\sin\\left(\\frac{pos}{10000^{2i/d_{model}}}\\right)$$'}
            </p>
            <p>
              {'$$PE_{(pos, 2i+1)} = \\cos\\left(\\frac{pos}{10000^{2i/d_{model}}}\\right)$$'}
            </p>
            <p style={{textAlign: 'center', fontSize: '0.9em', color: '#666'}}>
              Sinusoidal positional encodings for position pos and dimension i
            </p>
          </div>

          <pre>
            <code className="language-python">
{`class PositionalEncoding(nn.Module):
    def __init__(self, d_model, max_seq_length=5000):
        super().__init__()
        
        pe = torch.zeros(max_seq_length, d_model)
        position = torch.arange(0, max_seq_length, dtype=torch.float).unsqueeze(1)
        
        # Create div_term for the sinusoidal pattern
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * 
                           (-np.log(10000.0) / d_model))
        
        # Apply sin to even indices
        pe[:, 0::2] = torch.sin(position * div_term)
        # Apply cos to odd indices
        pe[:, 1::2] = torch.cos(position * div_term)
        
        # Add batch dimension and register as buffer
        pe = pe.unsqueeze(0).transpose(0, 1)
        self.register_buffer('pe', pe)
    
    def forward(self, x):
        # Add positional encoding to embeddings
        return x + self.pe[:x.size(0), :]

# Example usage
pos_encoding = PositionalEncoding(d_model=512)
embedded_tokens = torch.randn(10, 1, 512)  # [seq_len, batch, d_model]
encoded = pos_encoding(embedded_tokens)

print(f"Original shape: {embedded_tokens.shape}")
print(f"With positional encoding: {encoded.shape}")

# Visualize positional encoding patterns
import matplotlib.pyplot as plt

def plot_positional_encoding(pe_matrix, positions=50, dimensions=64):
    plt.figure(figsize=(12, 8))
    plt.imshow(pe_matrix[:positions, :dimensions].T, 
               cmap='RdYlBu', aspect='auto')
    plt.colorbar()
    plt.xlabel('Position')
    plt.ylabel('Encoding Dimension')
    plt.title('Positional Encoding Patterns')
    plt.show()

# Uncomment to visualize:
# plot_positional_encoding(pos_encoding.pe.squeeze(1).numpy())`}
            </code>
          </pre>

          {/* SVG Suggestion 3: Positional Encoding Patterns */}
          <div className="figure-container">
            <svg width="700" height="450" xmlns="http://www.w3.org/2000/svg" fontFamily="Arial, sans-serif" aria-labelledby="svgTitlePE" role="img">
              <title id="svgTitlePE">Positional Encoding Patterns Visualization</title>
              <desc>Heatmap showing how sinusoidal positional encodings create unique patterns for each token position across different embedding dimensions.</desc>
              <style>{`
                .pe-title-svg { font-size: 20px; font-weight: bold; fill: #2c3e50; text-anchor: middle; }
                .pe-axis-label-svg { font-size: 14px; fill: #333; text-anchor: middle; }
                .pe-tick-label-svg { font-size: 10px; fill: #555; text-anchor: middle; }
                .pe-legend-text-svg { font-size: 12px; fill: #333; }
              `}</style>

              <text x="350" y="35" className="pe-title-svg">Positional Encoding Patterns</text>

              {/* Color Legend */}
              <defs>
                <linearGradient id="peGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor: '#0000FF', stopOpacity: 1}} /> {/* Blue for -1 */}
                  <stop offset="25%" style={{stopColor: '#ADD8E6', stopOpacity: 1}} /> {/* Light Blue */}
                  <stop offset="50%" style={{stopColor: '#FFFFE0', stopOpacity: 1}} /> {/* Light Yellow for 0 */}
                  <stop offset="75%" style={{stopColor: '#FFB6C1', stopOpacity: 1}} /> {/* Light Red */}
                  <stop offset="100%" style={{stopColor: '#FF0000', stopOpacity: 1}} /> {/* Red for +1 */}
                </linearGradient>
              </defs>
              <rect x="500" y="55" width="150" height="20" fill="url(#peGradient)" stroke="#333" strokeWidth="0.5"/>
              <text x="485" y="70" className="pe-legend-text-svg" textAnchor="end">-1</text>
              <text x="575" y="90" className="pe-legend-text-svg" textAnchor="middle">Value</text>
              <text x="665" y="70" className="pe-legend-text-svg" textAnchor="start">+1</text>

              {/* Heatmap Area */}
              <g transform="translate(60, 100)">
                {(() => {
                  const d_model_vis = 32; // Number of dimensions to visualize
                  const max_pos_vis = 50;  // Number of positions to visualize
                  const cell_width = 11;
                  const cell_height = 8;

                  const elements = [];

                  // Function to calculate PE value (simplified for visualization)
                  const getPEValue = (pos, i, d_model) => {
                    const div_term = Math.exp(i * (-Math.log(10000.0) / d_model));
                    if (i % 2 === 0) { // sin for even i
                      return Math.sin(pos * div_term);
                    } else { // cos for odd i
                      return Math.cos(pos * div_term);
                    }
                  };

                  // Function to map value (-1 to 1) to color
                  const getColor = (value) => {
                    // Map value from [-1, 1] to [0, 1]
                    const normalizedValue = (value + 1) / 2;
                    // Simple blue-yellow-red gradient
                    const r = Math.max(0, Math.min(255, Math.round(255 * normalizedValue)));
                    const b = Math.max(0, Math.min(255, Math.round(255 * (1 - normalizedValue))));
                    const g = Math.max(0, Math.min(255, 255 - Math.abs(normalizedValue - 0.5) * 2 * 200)); // more yellow in middle
                    return `rgb(${r},${g},${b})`;
                  };

                  for (let pos = 0; pos < max_pos_vis; pos++) {
                    for (let dim_idx = 0; dim_idx < d_model_vis; dim_idx++) {
                      const val = getPEValue(pos, dim_idx, d_model_vis); // Use d_model_vis for calculation consistency
                      elements.push(
                        <rect
                          key={`cell-${pos}-${dim_idx}`}
                          x={pos * cell_width}
                          y={dim_idx * cell_height}
                          width={cell_width}
                          height={cell_height}
                          fill={getColor(val)}
                        />
                      );
                    }
                  }

                  // Axis Labels
                  elements.push(<text key="y-axis-label" x={-35} y={(d_model_vis * cell_height) / 2} className="pe-axis-label-svg" transform={`rotate(-90, -35, ${(d_model_vis * cell_height) / 2})`}>Dimension Index (i)</text>);
                  elements.push(<text key="x-axis-label" x={(max_pos_vis * cell_width) / 2} y={d_model_vis * cell_height + 35} className="pe-axis-label-svg">Token Position (pos)</text>);

                  // Ticks for X-axis (Position)
                  for (let i = 0; i <= max_pos_vis; i += 10) {
                    elements.push(<text key={`x-tick-${i}`} x={i * cell_width} y={d_model_vis * cell_height + 15} className="pe-tick-label-svg">{i}</text>);
                  }
                   // Ticks for Y-axis (Dimension)
                  for (let i = 0; i < d_model_vis; i += 8) {
                     elements.push(<text key={`y-tick-${i}`} x={-15} y={i * cell_height + cell_height/2} className="pe-tick-label-svg" dominantBaseline="middle">{i}</text>);
                  }
                  elements.push(<text key="y-tick-last" x={-15} y={(d_model_vis-1) * cell_height + cell_height/2} className="pe-tick-label-svg" dominantBaseline="middle">{d_model_vis-1}</text>);

                  return elements;
                })()}
              </g>
            </svg>
            <p className="figure-caption">Figure 3: Sinusoidal positional encoding patterns create unique signatures for each position</p>
          </div>

          <h2>Step 4: Multi-Head Self-Attention - The Heart of Transformers</h2>

          <p>
            The attention mechanism allows tokens to "look at" and relate to other tokens in the sequence. Multi-head attention performs this operation multiple times in parallel, capturing different types of relationships.
          </p>

          <div className="highlight">
            <p>
              {'$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$'}
            </p>
            <p style={{textAlign: 'center', fontSize: '0.9em', color: '#666'}}>
              Scaled dot-product attention mechanism
            </p>
          </div>

          <p>
            Where Q (queries), K (keys), and V (values) are linear projections of the input, and <code>d_k</code> is the dimension of the key vectors.
          </p>

          <pre>
            <code className="language-python">
{`class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        assert d_model % num_heads == 0
        
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        
        # Linear projections for Q, K, V
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
        
    def scaled_dot_product_attention(self, Q, K, V, mask=None):
        # Calculate attention scores
        scores = torch.matmul(Q, K.transpose(-2, -1)) / np.sqrt(self.d_k)
        
        # Apply mask if provided (for causal/padding masks)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        
        # Apply softmax to get attention weights
        attention_weights = torch.softmax(scores, dim=-1)
        
        # Apply attention weights to values
        output = torch.matmul(attention_weights, V)
        return output, attention_weights
    
    def forward(self, query, key, value, mask=None):
        batch_size = query.size(0)
        
        # Linear projections and reshape for multi-head attention
        Q = self.W_q(query).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        K = self.W_k(key).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        V = self.W_v(value).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        
        # Apply scaled dot-product attention
        attention_output, attention_weights = self.scaled_dot_product_attention(Q, K, V, mask)
        
        # Concatenate heads and apply output projection
        attention_output = attention_output.transpose(1, 2).contiguous().view(
            batch_size, -1, self.d_model)
        
        output = self.W_o(attention_output)
        return output, attention_weights

# Example usage and attention visualization
d_model = 512
num_heads = 8
seq_length = 10
batch_size = 1

attention = MultiHeadAttention(d_model, num_heads)
x = torch.randn(batch_size, seq_length, d_model)

# Forward pass
output, attention_weights = attention(x, x, x)

print(f"Input shape: {x.shape}")
print(f"Output shape: {output.shape}")
print(f"Attention weights shape: {attention_weights.shape}")

# Visualize attention patterns
def visualize_attention(attention_weights, layer=0, head=0):
    """Visualize attention patterns as a heatmap"""
    attn = attention_weights[layer, head].detach().numpy()
    
    plt.figure(figsize=(10, 8))
    plt.imshow(attn, cmap='Blues')
    plt.colorbar()
    plt.xlabel('Key Position')
    plt.ylabel('Query Position')
    plt.title(f'Attention Patterns - Layer {layer}, Head {head}')
    plt.show()

# Uncomment to visualize:
# visualize_attention(attention_weights)`}
            </code>
          </pre>

          {/* SVG Suggestion 4: Attention Mechanism Visualization */}
          <div className="figure-container">
            <svg width="700" height="600" xmlns="http://www.w3.org/2000/svg" fontFamily="Arial, sans-serif" aria-labelledby="svgTitleAttention" role="img">
              <title id="svgTitleAttention">Attention Mechanism Visualization</title>
              <desc>Illustration of a self-attention matrix showing how tokens in a sentence attend to each other. Includes conceptual input field and head selector.</desc>
              <style>{`
                .attention-title-svg { font-size: 20px; font-weight: bold; fill: #2c3e50; text-anchor: middle; }
                .label-text-svg { font-size: 14px; fill: #444; }
                .input-box-svg { fill: #f9f9f9; stroke: #d1d1d1; rx: 5; }
                .input-text-svg { font-size: 16px; fill: #333; }
                .dropdown-box-svg { fill: #eef; stroke: #aac; rx: 3; }
                .dropdown-text-svg { font-size: 13px; fill: #335; text-anchor: middle; dominant-baseline: central;}
                .matrix-cell-svg { stroke: #ccc; stroke-width: 0.5; }
                .matrix-label-svg { font-size: 12px; fill: #333; text-anchor: middle; dominant-baseline: central; }
                .legend-text-svg { font-size: 12px; fill: #333; }
              `}</style>

              <text x="350" y="35" className="attention-title-svg">Self-Attention Matrix Visualization</text>

              {/* Conceptual Input Sentence */}
              <text x="30" y="75" className="label-text-svg">Input Sentence:</text>
              <rect x="30" y="85" width="400" height="35" className="input-box-svg"/>
              <text x="40" y="107" className="input-text-svg">The quick brown fox</text>

              {/* Conceptual Attention Head Selector */}
              <text x="450" y="75" className="label-text-svg">Attention Head:</text>
              <rect x="450" y="85" width="150" height="35" className="dropdown-box-svg"/>
              <text x="525" y="103" className="dropdown-text-svg">Head 1 of 8 ▼</text>
              <title>Conceptual: Select Attention Head</title>

              {/* Attention Matrix */}
              <g transform="translate(80, 160)">
                {(() => {
                  const tokens = ["The", "quick", "brown", "fox"];
                  // Example attention weights (Query attends to Key)
                  // Rows: Query, Columns: Key
                  const attentionWeights = [
                    [0.70, 0.20, 0.05, 0.05], // "The" attends to...
                    [0.10, 0.60, 0.20, 0.10], // "quick" attends to...
                    [0.05, 0.30, 0.50, 0.15], // "brown" attends to...
                    [0.05, 0.15, 0.45, 0.35]  // "fox" attends to...
                  ];
                  const cellSize = 80;
                  const labelOffset = 20;
                  const elements = [];

                  // Color scale: 0 (light blue) to 1 (dark blue)
                  const getColor = (weight) => {
                    const intensity = Math.floor(255 * (1 - weight)); // Lighter for lower weight
                    return `rgb(${intensity}, ${intensity}, 255)`; // Shades of blue
                  };

                  // Key labels (Top)
                  elements.push(<text key="key-label" x={(tokens.length * cellSize) / 2} y={-labelOffset - 5} className="matrix-label-svg" fontWeight="bold">Key (attended to)</text>);
                  tokens.forEach((token, j) => {
                    elements.push(
                      <text key={`col-label-${j}`} x={j * cellSize + cellSize / 2} y={-labelOffset + 15} className="matrix-label-svg">{token}</text>
                    );
                  });

                  // Query labels (Left)
                  elements.push(<text key="query-label" x={-labelOffset - 5} y={(tokens.length * cellSize) / 2} className="matrix-label-svg" fontWeight="bold" transform={`rotate(-90, ${-labelOffset - 5}, ${(tokens.length * cellSize) / 2})`}>Query (attending from)</text>);
                  tokens.forEach((token, i) => {
                    elements.push(
                      <text key={`row-label-${i}`} x={-labelOffset} y={i * cellSize + cellSize / 2} className="matrix-label-svg" textAnchor="end">{token}</text>
                    );
                  });

                  // Matrix cells
                  attentionWeights.forEach((row, i) => {
                    row.forEach((weight, j) => {
                      elements.push(
                        <g key={`cell-${i}-${j}-g`}>
                          <rect
                            x={j * cellSize}
                            y={i * cellSize}
                            width={cellSize}
                            height={cellSize}
                            fill={getColor(weight)}
                            className="matrix-cell-svg"
                          />
                          <text x={j * cellSize + cellSize/2} y={i * cellSize + cellSize/2} className="matrix-label-svg" fill={weight > 0.5 ? 'white' : 'black'}>{weight.toFixed(2)}</text>
                          <title>{`"${tokens[i]}" attends to "${tokens[j]}" with weight ${weight.toFixed(2)}`}</title>
                        </g>
                      );
                    });
                  });
                  return elements;
                })()}
              </g>

              {/* Color Legend for Attention Weights */}
              <defs>
                <linearGradient id="attentionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor: 'rgb(255,255,255)', stopOpacity: 1}} /> {/* Lightest blue for 0 */}
                  <stop offset="100%" style={{stopColor: 'rgb(0,0,255)', stopOpacity: 1}} /> {/* Darkest blue for 1 */}
                </linearGradient>
              </defs>
              <text x="350" y="530" className="label-text-svg" textAnchor="middle">Attention Weight</text>
              <rect x="275" y="545" width="150" height="20" fill="url(#attentionGradient)" stroke="#333" strokeWidth="0.5"/>
              <text x="265" y="555" className="legend-text-svg" textAnchor="end">0.0</text>
              <text x="435" y="555" className="legend-text-svg" textAnchor="start">1.0</text>
            </svg>
            <p className="figure-caption">Figure 4: Multi-head attention patterns showing how tokens attend to different parts of the sequence</p>
          </div>

          <h2>Step 5: Feed-Forward Networks and Layer Normalization</h2>

          <p>
            After attention, each position passes through a position-wise feed-forward network. The Transformer also uses residual connections and layer normalization for stable training.
          </p>

          <div className="highlight">
            <p>
              {'$$\\text{FFN}(x) = \\max(0, xW_1 + b_1)W_2 + b_2$$'}
            </p>
            <p>
              {'$$\\text{LayerNorm}(x) = \\gamma \\frac{x - \\mu}{\\sigma} + \\beta$$'}
            </p>
            <p style={{textAlign: 'center', fontSize: '0.9em', color: '#666'}}>
              Feed-forward network with ReLU activation and layer normalization
            </p>
          </div>

          <pre>
            <code className="language-python">
{`class TransformerBlock(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super().__init__()
        self.attention = MultiHeadAttention(d_model, num_heads)
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        
        # Feed-forward network
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.ReLU(),
            nn.Linear(d_ff, d_model),
            nn.Dropout(dropout)
        )
        
        self.dropout = nn.Dropout(dropout)
    
    def forward(self, x, mask=None):
        # Multi-head attention with residual connection and layer norm
        attn_output, _ = self.attention(x, x, x, mask)
        x = self.norm1(x + self.dropout(attn_output))
        
        # Feed-forward network with residual connection and layer norm
        ffn_output = self.ffn(x)
        x = self.norm2(x + self.dropout(ffn_output))
        
        return x

# Complete Transformer model
class GPTModel(nn.Module):
    def __init__(self, vocab_size, d_model, num_heads, num_layers, d_ff, max_seq_length):
        super().__init__()
        self.d_model = d_model
        
        # Token and positional embeddings
        self.token_embedding = nn.Embedding(vocab_size, d_model)
        self.positional_encoding = PositionalEncoding(d_model, max_seq_length)
        
        # Transformer blocks
        self.transformer_blocks = nn.ModuleList([
            TransformerBlock(d_model, num_heads, d_ff)
            for _ in range(num_layers)
        ])
        
        # Output layer
        self.ln_f = nn.LayerNorm(d_model)
        self.head = nn.Linear(d_model, vocab_size, bias=False)
    
    def forward(self, input_ids):
        # Embeddings
        x = self.token_embedding(input_ids)
        x = self.positional_encoding(x)
        
        # Pass through transformer blocks
        for block in self.transformer_blocks:
            x = block(x)
        
        # Final layer norm and projection
        x = self.ln_f(x)
        logits = self.head(x)
        
        return logits

# Model instantiation
model = GPTModel(
    vocab_size=50000,
    d_model=768,
    num_heads=12,
    num_layers=12,
    d_ff=3072,
    max_seq_length=1024
)

print(f"Model parameters: {sum(p.numel() for p in model.parameters()):,}")

# Example forward pass
input_ids = torch.randint(0, 50000, (2, 50))  # Batch size 2, sequence length 50
logits = model(input_ids)
print(f"Output logits shape: {logits.shape}")  # [2, 50, 50000]`}
            </code>
          </pre>

          <h2>Step 6: Text Generation and Sampling Strategies</h2>

          <p>
            Once we have logits from the model, we need to convert them into actual text. This involves various sampling strategies that balance creativity and coherence.
          </p>

          <div className="highlight">
            <p>
              {'$$P_i = \\frac{e^{z_i/T}}{\\sum_{j=1}^V e^{z_j/T}}$$'}
            </p>
            <p style={{textAlign: 'center', fontSize: '0.9em', color: '#666'}}>
              Temperature-scaled softmax where T controls randomness
            </p>
          </div>

          <pre>
            <code className="language-python">
{`class TextGenerator:
    def __init__(self, model, tokenizer):
        self.model = model
        self.tokenizer = tokenizer
    
    def generate_with_temperature(self, prompt, max_length=100, temperature=1.0):
        """Generate text using temperature sampling"""
        self.model.eval()
        
        # Tokenize prompt
        input_ids = self.tokenizer.encode(prompt, return_tensors="pt")
        generated = input_ids.clone()
        
        with torch.no_grad():
            for _ in range(max_length):
                # Get model predictions
                outputs = self.model(generated)
                logits = outputs[:, -1, :]  # Last token logits
                
                # Apply temperature scaling
                scaled_logits = logits / temperature
                probabilities = torch.softmax(scaled_logits, dim=-1)
                
                # Sample next token
                next_token = torch.multinomial(probabilities, 1)
                generated = torch.cat([generated, next_token], dim=-1)
                
                # Check for end token
                if next_token.item() == self.tokenizer.eos_token_id:
                    break
        
        return self.tokenizer.decode(generated[0], skip_special_tokens=True)
    
    def generate_with_top_k(self, prompt, max_length=100, k=50):
        """Generate text using top-k sampling"""
        self.model.eval()
        input_ids = self.tokenizer.encode(prompt, return_tensors="pt")
        generated = input_ids.clone()
        
        with torch.no_grad():
            for _ in range(max_length):
                outputs = self.model(generated)
                logits = outputs[:, -1, :]
                
                # Get top-k tokens
                top_k_logits, top_k_indices = torch.topk(logits, k)
                
                # Create probability distribution over top-k tokens
                probabilities = torch.softmax(top_k_logits, dim=-1)
                
                # Sample from top-k
                sampled_index = torch.multinomial(probabilities, 1)
                next_token = top_k_indices.gather(-1, sampled_index)
                
                generated = torch.cat([generated, next_token], dim=-1)
                
                if next_token.item() == self.tokenizer.eos_token_id:
                    break
        
        return self.tokenizer.decode(generated[0], skip_special_tokens=True)
    
    def generate_with_nucleus(self, prompt, max_length=100, p=0.9):
        """Generate text using nucleus (top-p) sampling"""
        self.model.eval()
        input_ids = self.tokenizer.encode(prompt, return_tensors="pt")
        generated = input_ids.clone()
        
        with torch.no_grad():
            for _ in range(max_length):
                outputs = self.model(generated)
                logits = outputs[:, -1, :]
                
                # Sort probabilities in descending order
                sorted_logits, sorted_indices = torch.sort(logits, descending=True)
                probabilities = torch.softmax(sorted_logits, dim=-1)
                
                # Calculate cumulative probabilities
                cumulative_probs = torch.cumsum(probabilities, dim=-1)
                
                # Find nucleus (top-p) cutoff
                sorted_indices_to_remove = cumulative_probs > p
                sorted_indices_to_remove[:, 1:] = sorted_indices_to_remove[:, :-1].clone()
                sorted_indices_to_remove[:, 0] = 0
                
                # Create filtered distribution
                filtered_logits = sorted_logits.clone()
                filtered_logits[sorted_indices_to_remove] = float('-inf')
                
                # Sample from filtered distribution
                probabilities = torch.softmax(filtered_logits, dim=-1)
                sampled_index = torch.multinomial(probabilities, 1)
                next_token = sorted_indices.gather(-1, sampled_index)
                
                generated = torch.cat([generated, next_token], dim=-1)
                
                if next_token.item() == self.tokenizer.eos_token_id:
                    break
        
        return self.tokenizer.decode(generated[0], skip_special_tokens=True)

# Demonstrate different sampling strategies
def compare_sampling_strategies():
    """Compare outputs from different sampling methods"""
    prompt = "The future of artificial intelligence"
    
    # Temperature sampling examples
    print("=== Temperature Sampling ===")
    for temp in [0.1, 0.7, 1.0, 1.5]:
        output = generator.generate_with_temperature(prompt, max_length=50, temperature=temp)
        print(f"Temperature {temp}: {output}")
    
    # Top-k sampling examples
    print("\\n=== Top-k Sampling ===")
    for k in [10, 50, 100]:
        output = generator.generate_with_top_k(prompt, max_length=50, k=k)
        print(f"Top-k {k}: {output}")
    
    # Nucleus sampling examples
    print("\\n=== Nucleus Sampling ===")
    for p in [0.5, 0.7, 0.9]:
        output = generator.generate_with_nucleus(prompt, max_length=50, p=p)
        print(f"Nucleus p={p}: {output}")

# Usage example (assuming you have a trained model and tokenizer)
# generator = TextGenerator(model, tokenizer)
# compare_sampling_strategies()`}
            </code>
          </pre>

          {/* SVG Suggestion 5: Sampling Strategy Comparison */}
          <div className="figure-container">
            <svg width="700" height="750" xmlns="http://www.w3.org/2000/svg" fontFamily="Arial, sans-serif" aria-labelledby="svgTitleSampling" role="img">
              <title id="svgTitleSampling">Sampling Strategy Comparison Visualization</title>
              <desc>Illustration comparing Temperature, Top-K, and Top-P sampling strategies by showing their effect on a base probability distribution and example outputs.</desc>
              <style>{`
                .sampling-title-svg { font-size: 20px; font-weight: bold; fill: #2c3e50; text-anchor: middle; }
                .strategy-title-svg { font-size: 16px; font-weight: bold; fill: #1a237e; }
                .label-text-svg { font-size: 14px; fill: #444; }
                .bar-chart-label-svg { font-size: 10px; text-anchor: middle; fill: #333; }
                .bar-base-svg { fill: #90caf9; } /* Light Blue */
                .bar-temp-low-svg { fill: #42a5f5; } /* Blue */
                .bar-temp-high-svg { fill: #1e88e5; } /* Darker Blue */
                .bar-topk-selected-svg { fill: #ffb74d; } /* Orange */
                .bar-topp-selected-svg { fill: #81c784; } /* Green */
                .bar-excluded-svg { fill: #e0e0e0; opacity: 0.7; } /* Grey for excluded */
                .slider-track-svg { fill: #bdbdbd; rx:3; ry:3; }
                .slider-thumb-svg { fill: #00796b; stroke: #004d40; stroke-width:1; }
                .slider-label-svg { font-size: 12px; fill: #333; text-anchor: middle; }
                .output-text-svg { font-size: 13px; fill: #555; font-style: italic; }
                .axis-line-svg { stroke: #888; stroke-width: 1; }
              `}</style>

              <text x="350" y="35" className="sampling-title-svg">Comparison of Text Generation Sampling Strategies</text>

              {/* Base Probability Distribution (Conceptual) */}
              <g id="base-distribution" transform="translate(50, 80)">
                <text x="0" y="0" className="label-text-svg" fontWeight="bold">Base Logits/Probabilities (Example):</text>
                <line x1="0" y1="100" x2="300" y2="100" className="axis-line-svg" /> {/* X-axis */}
                <line x1="0" y1="20" x2="0" y2="100" className="axis-line-svg" />   {/* Y-axis */}
                <text x="-10" y="20" className="bar-chart-label-svg" dominantBaseline="middle" textAnchor="end">High</text>
                <text x="-10" y="95" className="bar-chart-label-svg" dominantBaseline="middle" textAnchor="end">Low</text>
                
                {(() => {
                  const tokens = ["the", "cat", "sat", "on", "mat"];
                  const baseProbs = [0.4, 0.25, 0.15, 0.1, 0.05]; // Example probabilities (sum to 0.95, not 1 for simplicity)
                  const barWidth = 40;
                  const spacing = 15;
                  const maxHeight = 70;
                  let elements = [];
                  tokens.forEach((token, i) => {
                    const barHeight = baseProbs[i] * maxHeight / 0.4; // Scale to max prob
                    elements.push(
                      <g key={`base-bar-${i}`}>
                        <rect x={i * (barWidth + spacing) + 10} y={100 - barHeight} width={barWidth} height={barHeight} className="bar-base-svg" />
                        <text x={i * (barWidth + spacing) + 10 + barWidth/2} y="115" className="bar-chart-label-svg">{token}</text>
                      </g>
                    );
                  });
                  return elements;
                })()}
              </g>

              {/* --- Temperature Sampling --- */}
              <g id="temp-sampling" transform="translate(50, 230)">
                <text x="0" y="0" className="strategy-title-svg">1. Temperature Sampling</text>
                <text x="0" y="25" className="label-text-svg">Effect: Adjusts randomness. Low T = sharper, High T = flatter distribution.</text>
                
                {/* Slider for Temperature */}
                <text x="0" y="55" className="slider-label-svg" textAnchor="start">Temperature (T):</text>
                <rect x="120" y="45" width="150" height="8" className="slider-track-svg"/>
                <circle cx="120 + 150 * 0.7" cy="49" r="6" className="slider-thumb-svg"><title>T = 0.7</title></circle>
                <text x="120" y="65" className="slider-label-svg">0.1</text>
                <text x="120 + 150 * 0.7" y="65" className="slider-label-svg">0.7</text>
                <text x="120 + 150" y="65" className="slider-label-svg">1.5</text>

                {/* Visual: Low T (sharper) vs High T (flatter) - conceptual */}
                <rect x="300" y="40" width="30" height="20" className="bar-temp-low-svg" />
                <text x="340" y="55" className="slider-label-svg">Low T (e.g., 0.2)</text>
                <rect x="300" y="70" width="30" height="10" className="bar-temp-high-svg" />
                <text x="340" y="80" className="slider-label-svg">High T (e.g., 1.2)</text>

                <text x="0" y="100" className="label-text-svg">Example Output (T=0.7): "The cat probably..." (more likely, but some variance)</text>
                <text x="0" y="120" className="label-text-svg">Example Output (T=0.2): "The cat sat..." (very deterministic)</text>
                <text x="0" y="140" className="label-text-svg">Example Output (T=1.2): "The mat perhaps..." (more random, creative)</text>
              </g>

              {/* --- Top-K Sampling --- */}
              <g id="topk-sampling" transform="translate(50, 400)">
                <text x="0" y="0" className="strategy-title-svg">2. Top-K Sampling</text>
                <text x="0" y="25" className="label-text-svg">Effect: Considers only the K most probable tokens.</text>

                {/* Slider for K */}
                <text x="0" y="55" className="slider-label-svg" textAnchor="start">K:</text>
                <rect x="30" y="45" width="150" height="8" className="slider-track-svg"/>
                <circle cx="30 + 150 * (2/4)" cy="49" r="6" className="slider-thumb-svg"><title>K = 3</title></circle>
                <text x="30" y="65" className="slider-label-svg">1</text>
                <text x="30 + 150 * (2/4)" y="65" className="slider-label-svg">3</text>
                <text x="30 + 150" y="65" className="slider-label-svg">5</text>

                {/* Visual: Highlight top K tokens from base */}
                <g transform="translate(250, 20)">
                  <text x="0" y="0" className="bar-chart-label-svg" textAnchor="start">Distribution (K=3):</text>
                  {(() => {
                    const tokens = ["the", "cat", "sat", "on", "mat"];
                    const baseProbs = [0.4, 0.25, 0.15, 0.1, 0.05];
                    const k = 3;
                    const barWidth = 25; const spacing = 8; const maxHeight = 50;
                    let elements = [];
                    tokens.forEach((token, i) => {
                      const barHeight = baseProbs[i] * maxHeight / 0.4;
                      elements.push(
                        <rect key={`topk-bar-${i}`} x={i * (barWidth + spacing)} y={50 - barHeight} width={barWidth} height={barHeight} className={i < k ? "bar-topk-selected-svg" : "bar-excluded-svg"} />
                      );
                    });
                    return elements;
                  })()}
                </g>
                <text x="0" y="100" className="label-text-svg">Example Output (K=3): "The cat sat..." (selects from 'the', 'cat', 'sat')</text>
              </g>

              {/* --- Top-P (Nucleus) Sampling --- */}
              <g id="topp-sampling" transform="translate(50, 550)">
                <text x="0" y="0" className="strategy-title-svg">3. Top-P (Nucleus) Sampling</text>
                <text x="0" y="25" className="label-text-svg">Effect: Considers smallest set of tokens whose cumulative probability ≥ P.</text>

                {/* Slider for P */}
                <text x="0" y="55" className="slider-label-svg" textAnchor="start">P:</text>
                <rect x="30" y="45" width="150" height="8" className="slider-track-svg"/>
                <circle cx="30 + 150 * 0.9" cy="49" r="6" className="slider-thumb-svg"><title>P = 0.9</title></circle>
                <text x="30" y="65" className="slider-label-svg">0.1</text>
                <text x="30 + 150 * 0.9" y="65" className="slider-label-svg">0.9</text>
                <text x="30 + 150" y="65" className="slider-label-svg">1.0</text>

                {/* Visual: Highlight tokens for P=0.9 */}
                {/* Base probs: the=0.4, cat=0.25 (cum=0.65), sat=0.15 (cum=0.80), on=0.1 (cum=0.90) */}
                <g transform="translate(250, 20)">
                  <text x="0" y="0" className="bar-chart-label-svg" textAnchor="start">Distribution (P=0.9):</text>
                  {(() => {
                    const tokens = ["the", "cat", "sat", "on", "mat"];
                    const baseProbs = [0.4, 0.25, 0.15, 0.1, 0.05];
                    const p_threshold = 0.9;
                    let cumulativeProb = 0;
                    const barWidth = 25; const spacing = 8; const maxHeight = 50;
                    let elements = [];
                    tokens.forEach((token, i) => {
                      const barHeight = baseProbs[i] * maxHeight / 0.4;
                      let isSelected = false;
                      if (cumulativeProb < p_threshold) {
                        isSelected = true;
                        cumulativeProb += baseProbs[i];
                      }
                      elements.push(
                        <rect key={`topp-bar-${i}`} x={i * (barWidth + spacing)} y={50 - barHeight} width={barWidth} height={barHeight} className={isSelected ? "bar-topp-selected-svg" : "bar-excluded-svg"} />
                      );
                    });
                    return elements;
                  })()}
                </g>
                <text x="0" y="100" className="label-text-svg">Example Output (P=0.9): "The cat sat on..." (selects from 'the', 'cat', 'sat', 'on')</text>
              </g>

              <text x="350" y="720" className="label-text-svg" textAnchor="middle">Note: Base distribution and outputs are illustrative examples.</text>
            </svg>
            <p className="figure-caption">Figure 5: Different sampling strategies and their effects on output diversity</p>
          </div>

          <h2>Training vs Inference: Two Distinct Phases</h2>

          <p>
            Understanding the difference between training and inference is crucial for comprehending how LLMs work in practice.
          </p>

          <h3>Training Phase</h3>
          <p>
            During training, the model learns by predicting the next token and comparing it to the actual next token, then adjusting its parameters through backpropagation.
          </p>

          <pre>
            <code className="language-python">
{`class LLMTrainer:
    def __init__(self, model, tokenizer, learning_rate=1e-4):
        self.model = model
        self.tokenizer = tokenizer
        self.optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate)
        self.criterion = nn.CrossEntropyLoss()
    
    def train_step(self, batch_text):
        """Single training step"""
        self.model.train()
        self.optimizer.zero_grad()
        
        # Tokenize batch
        encoded = self.tokenizer(
            batch_text, 
            return_tensors="pt", 
            padding=True, 
            truncation=True,
            max_length=512
        )
        
        input_ids = encoded['input_ids']
        
        # Prepare inputs and targets
        # For causal language modeling, inputs are tokens[:-1] and targets are tokens[1:]
        inputs = input_ids[:, :-1]
        targets = input_ids[:, 1:]
        
        # Forward pass
        logits = self.model(inputs)
        
        # Reshape for loss calculation
        batch_size, seq_len, vocab_size = logits.shape
        logits = logits.reshape(-1, vocab_size)
        targets = targets.reshape(-1)
        
        # Calculate loss
        loss = self.criterion(logits, targets)
        
        # Backward pass
        loss.backward()
        
        # Gradient clipping to prevent exploding gradients
        torch.nn.utils.clip_grad_norm_(self.model.parameters(), max_norm=1.0)
        
        # Update parameters
        self.optimizer.step()
        
        return loss.item()
    
    def evaluate(self, eval_texts):
        """Evaluate model on validation data"""
        self.model.eval()
        total_loss = 0
        num_batches = 0
        
        with torch.no_grad():
            for text_batch in eval_texts:
                encoded = self.tokenizer(
                    text_batch, 
                    return_tensors="pt", 
                    padding=True, 
                    truncation=True,
                    max_length=512
                )
                
                input_ids = encoded['input_ids']
                inputs = input_ids[:, :-1]
                targets = input_ids[:, 1:]
                
                logits = self.model(inputs)
                
                # Calculate loss
                batch_size, seq_len, vocab_size = logits.shape
                logits = logits.reshape(-1, vocab_size)
                targets = targets.reshape(-1)
                
                loss = self.criterion(logits, targets)
                total_loss += loss.item()
                num_batches += 1
        
        return total_loss / num_batches if num_batches > 0 else float('inf')
    
    def train_epoch(self, train_data, eval_data=None):
        """Train for one epoch"""
        epoch_losses = []
        
        for batch_idx, batch in enumerate(train_data):
            loss = self.train_step(batch)
            epoch_losses.append(loss)
            
            # Log progress
            if batch_idx % 100 == 0:
                avg_loss = sum(epoch_losses[-100:]) / len(epoch_losses[-100:])
                print(f"Batch {batch_idx}, Average Loss: {avg_loss:.4f}")
        
        # Evaluate if validation data provided
        if eval_data:
            eval_loss = self.evaluate(eval_data)
            print(f"Epoch complete. Train Loss: {sum(epoch_losses)/len(epoch_losses):.4f}, "
                  f"Eval Loss: {eval_loss:.4f}")
        
        return epoch_losses

# Example training loop
def training_example():
    # Initialize trainer
    trainer = LLMTrainer(model, tokenizer)
    
    # Sample training data (in practice, this would be much larger)
    train_texts = [
        "The quick brown fox jumps over the lazy dog",
        "Machine learning is transforming how we process information",
        "Large language models can generate human-like text",
        # ... thousands more examples
    ]
    
    # Train for multiple epochs
    for epoch in range(5):
        print(f"\\nEpoch {epoch + 1}")
        losses = trainer.train_epoch([train_texts])
        
        # Save checkpoint
        torch.save({
            'epoch': epoch,
            'model_state_dict': model.state_dict(),
            'optimizer_state_dict': trainer.optimizer.state_dict(),
            'loss': sum(losses) / len(losses),
        }, f'checkpoint_epoch_{epoch}.pt')

# Calculate perplexity - a common metric for language models
def calculate_perplexity(model, tokenizer, text):
    """Calculate perplexity of text under the model"""
    model.eval()
    
    encoded = tokenizer(text, return_tensors="pt")
    input_ids = encoded['input_ids']
    
    with torch.no_grad():
        outputs = model(input_ids)
        logits = outputs[0]
        
        # Shift so that tokens < n predict n
        shift_logits = logits[..., :-1, :].contiguous()
        shift_labels = input_ids[..., 1:].contiguous()
        
        # Calculate cross-entropy loss
        loss_fct = nn.CrossEntropyLoss()
        loss = loss_fct(shift_logits.view(-1, shift_logits.size(-1)), 
                       shift_labels.view(-1))
        
        # Perplexity is exp(loss)
        perplexity = torch.exp(loss)
        
        return perplexity.item()

class LLMInference:
    def __init__(self, model, tokenizer):
        self.model = model
        self.tokenizer = tokenizer
        self.model.eval()  # Set to evaluation mode
    
    def generate_text(self, prompt, max_length=100, temperature=1.0, 
                     top_k=None, top_p=None, repetition_penalty=1.0):
        """
        Generate text with various decoding strategies
        """
        # Tokenize the prompt
        input_ids = self.tokenizer.encode(prompt, return_tensors="pt")
        
        # Keep track of generated tokens
        generated_ids = input_ids.clone()
        past_key_values = None  # For KV caching (optimization)
        
        with torch.no_grad():
            for step in range(max_length):
                # Forward pass - only compute for the last token if using KV cache
                if past_key_values is not None:
                    model_inputs = generated_ids[:, -1:]
                else:
                    model_inputs = generated_ids
                
                outputs = self.model(model_inputs, past_key_values=past_key_values)
                logits = outputs.logits[:, -1, :]  # Get logits for the last token
                past_key_values = outputs.past_key_values  # Cache for efficiency
                
                # Apply repetition penalty
                if repetition_penalty != 1.0:
                    logits = self._apply_repetition_penalty(
                        logits, generated_ids, repetition_penalty
                    )
                
                # Apply temperature scaling
                if temperature != 1.0:
                    logits = logits / temperature
                
                # Apply top-k filtering
                if top_k is not None:
                    logits = self._top_k_filtering(logits, top_k)
                
                # Apply nucleus (top-p) filtering
                if top_p is not None:
                    logits = self._nucleus_filtering(logits, top_p)
                
                # Convert logits to probabilities
                probabilities = torch.softmax(logits, dim=-1)
                
                # Sample next token
                next_token = torch.multinomial(probabilities, num_samples=1)
                
                # Append to generated sequence
                generated_ids = torch.cat([generated_ids, next_token], dim=-1)
                
                # Check for end-of-sequence token
                if next_token.item() == self.tokenizer.eos_token_id:
                    break
                
                # Optional: Print progress
                if step % 10 == 0:
                    current_text = self.tokenizer.decode(generated_ids[0])
                    print(f"Step {step}: {current_text}")
        
        # Decode the generated tokens
        generated_text = self.tokenizer.decode(generated_ids[0], skip_special_tokens=True)
        return generated_text
    
    def _apply_repetition_penalty(self, logits, prev_tokens, penalty):
        """Apply repetition penalty to reduce repetitive text"""
        for token_id in set(prev_tokens[0].tolist()):
            logits[0, token_id] /= penalty
        return logits
    
    def _top_k_filtering(self, logits, k):
        """Keep only top-k tokens"""
        top_k_logits, _ = torch.topk(logits, k)
        min_top_k = top_k_logits[:, -1].unsqueeze(-1)
        logits = torch.where(logits < min_top_k, 
                           torch.full_like(logits, float('-inf')), 
                           logits)
        return logits
    
    def _nucleus_filtering(self, logits, p):
        """Nucleus (top-p) filtering"""
        sorted_logits, sorted_indices = torch.sort(logits, descending=True)
        cumulative_probs = torch.cumsum(torch.softmax(sorted_logits, dim=-1), dim=-1)
        
        # Remove tokens with cumulative probability above the threshold
        sorted_indices_to_remove = cumulative_probs > p
        sorted_indices_to_remove[:, 1:] = sorted_indices_to_remove[:, :-1].clone()
        sorted_indices_to_remove[:, 0] = 0
        
        indices_to_remove = sorted_indices_to_remove.scatter(1, sorted_indices, sorted_indices_to_remove)
        logits = logits.masked_fill(indices_to_remove, float('-inf'))
        return logits
    
    def beam_search(self, prompt, num_beams=4, max_length=100):
        """
        Beam search decoding for more coherent text generation
        """
        input_ids = self.tokenizer.encode(prompt, return_tensors="pt")
        
        # Initialize beams
        beams = [(input_ids, 0.0)]  # (sequence, log_probability)
        
        for step in range(max_length):
            candidates = []
            
            for sequence, log_prob in beams:
                # Get predictions for this sequence
                outputs = self.model(sequence)
                logits = outputs.logits[0, -1, :]
                log_probs = torch.log_softmax(logits, dim=-1)
                
                # Get top-k candidates
                top_log_probs, top_indices = torch.topk(log_probs, num_beams)
                
                for i in range(num_beams):
                    new_sequence = torch.cat([sequence, top_indices[i].unsqueeze(0).unsqueeze(0)], dim=-1)
                    new_log_prob = log_prob + top_log_probs[i].item()
                    candidates.append((new_sequence, new_log_prob))
            
            # Keep top beams
            candidates.sort(key=lambda x: x[1], reverse=True)
            beams = candidates[:num_beams]
            
            # Check if all beams end with EOS token
            if all(seq[0, -1].item() == self.tokenizer.eos_token_id for seq, _ in beams):
                break
        
        # Return the best sequence
        best_sequence, _ = beams[0]
        return self.tokenizer.decode(best_sequence[0], skip_special_tokens=True)

# Performance optimization: KV Caching
class OptimizedInference(LLMInference):
    """Optimized inference with key-value caching"""
    
    def __init__(self, model, tokenizer):
        super().__init__(model, tokenizer)
        self.kv_cache = {}
    
    def generate_with_cache(self, prompt, max_length=100):
        """Generate text using KV cache for faster inference"""
        input_ids = self.tokenizer.encode(prompt, return_tensors="pt")
        generated_ids = input_ids.clone()
        
        # Initialize cache
        past_key_values = None
        
        with torch.no_grad():
            for step in range(max_length):
                # Only process the last token when using cache
                if step == 0:
                    model_input = generated_ids
                else:
                    model_input = generated_ids[:, -1:]
                
                # Forward pass with cache
                outputs = self.model(
                    model_input, 
                    past_key_values=past_key_values,
                    use_cache=True
                )
                
                logits = outputs.logits[:, -1, :]
                past_key_values = outputs.past_key_values
                
                # Sample next token
                probabilities = torch.softmax(logits, dim=-1)
                next_token = torch.multinomial(probabilities, 1)
                
                generated_ids = torch.cat([generated_ids, next_token], dim=-1)
                
                if next_token.item() == self.tokenizer.eos_token_id:
                    break
        
        return self.tokenizer.decode(generated_ids[0], skip_special_tokens=True)

# Example usage and benchmarking
def benchmark_inference():
    """Compare inference speeds with different optimizations"""
    import time
    
    prompt = "The future of artificial intelligence is"
    
    # Standard inference
    standard_inference = LLMInference(model, tokenizer)
    start_time = time.time()
    result1 = standard_inference.generate_text(prompt, max_length=50)
    standard_time = time.time() - start_time
    
    # Optimized inference with caching
    optimized_inference = OptimizedInference(model, tokenizer)
    start_time = time.time()
    result2 = optimized_inference.generate_with_cache(prompt, max_length=50)
    optimized_time = time.time() - start_time
    
    print(f"Standard inference: {standard_time:.2f}s")
    print(f"Optimized inference: {optimized_time:.2f}s")
    print(f"Speedup: {standard_time/optimized_time:.2f}x")
    
    return result1, result2`}
            </code>
          </pre>
          {/* SVG Suggestion 6: Training vs Inference Visualization */}
          <div className="figure-container">
            <svg width="700" height="650" xmlns="http://www.w3.org/2000/svg" fontFamily="Arial, sans-serif" aria-labelledby="svgTitleTrainInfer" role="img">
              <title id="svgTitleTrainInfer">Training vs. Inference Phase Visualization</title>
              <desc>Side-by-side comparison of the LLM training phase (with backpropagation and weight updates) and inference phase (token-by-token generation).</desc>
              <style>{`
                .main-title-svg { font-size: 20px; font-weight: bold; fill: #2c3e50; text-anchor: middle; }
                .phase-title-svg { font-size: 18px; font-weight: bold; text-anchor: middle; }
                .label-text-svg { font-size: 13px; fill: #444; }
                .sub-label-svg { font-size: 11px; fill: #666; text-anchor: middle; }
                .box-svg { stroke-width: 1.5; rx: 5; ry: 5; }
                .data-box-svg { fill: #e3f2fd; stroke: #90caf9; } /* Light Blue */
                .model-box-svg { fill: #fff9c4; stroke: #fff176; } /* Light Yellow */
                .process-box-svg { fill: #c8e6c9; stroke: #a5d6a7; } /* Light Green */
                .output-box-svg { fill: #ffccbc; stroke: #ffab91; } /* Light Orange */
                .arrow-svg { stroke: #555; stroke-width: 2; marker-end: url(#arrowhead-phases); }
                .dashed-arrow-svg { stroke: #777; stroke-width: 1.5; marker-end: url(#arrowhead-phases); stroke-dasharray: 4,2; }
                .panel-rect-svg { fill: #f5f5f5; stroke: #e0e0e0; rx:10; ry:10; }
              `}</style>
              <defs>
                <marker id="arrowhead-phases" viewBox="0 0 10 10" refX="8" refY="5"
                    markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#555" />
                </marker>
              </defs>

              <text x="350" y="35" className="main-title-svg">LLM: Training Phase vs. Inference Phase</text>

              {/* --- Training Phase Panel --- */}
              <g id="training-phase" transform="translate(30, 70)">
                <rect x="0" y="0" width="310" height="550" className="panel-rect-svg"/>
                <text x="155" y="30" className="phase-title-svg" fill="#00796b">Training Phase</text>

                {/* Input Data */}
                <rect x="80" y="60" width="150" height="40" className="data-box-svg box-svg"/>
                <text x="155" y="85" className="label-text-svg" textAnchor="middle">Input Batch (Text)</text>
                <line x1="155" y1="100" x2="155" y2="120" className="arrow-svg"/>

                {/* Tokenizer + Embeddings + Positional Encoding */}
                <rect x="55" y="120" width="200" height="40" className="process-box-svg box-svg"/>
                <text x="155" y="145" className="label-text-svg" textAnchor="middle">Tokenize & Encode</text>
                <line x1="155" y1="160" x2="155" y2="180" className="arrow-svg"/>

                {/* Transformer Model (Forward Pass) */}
                <rect x="80" y="180" width="150" height="60" className="model-box-svg box-svg"/>
                <text x="155" y="205" className="label-text-svg" textAnchor="middle">Transformer Model</text>
                <text x="155" y="225" className="sub-label-svg">(Forward Pass)</text>
                <line x1="155" y1="240" x2="155" y2="260" className="arrow-svg"/>

                {/* Logits */}
                <rect x="105" y="260" width="100" height="30" className="output-box-svg box-svg"/>
                <text x="155" y="280" className="label-text-svg" textAnchor="middle">Logits</text>
                <line x1="155" y1="290" x2="155" y2="310" className="arrow-svg"/>

                {/* Loss Calculation */}
                <rect x="55" y="310" width="200" height="40" className="process-box-svg box-svg"/>
                <text x="155" y="335" className="label-text-svg" textAnchor="middle">Loss Calculation</text>
                <text x="265" y="335" className="label-text-svg" dominantBaseline="middle" fill="#d32f2f"> (vs Targets)</text>
                <line x1="155" y1="350" x2="155" y2="370" className="arrow-svg" stroke="#d32f2f"/>

                {/* Gradients (Backpropagation) */}
                <rect x="80" y="370" width="150" height="40" className="process-box-svg box-svg" fill="#ffe0b2" stroke="#ffb74d"/>
                <text x="155" y="395" className="label-text-svg" textAnchor="middle">Gradients (Backprop)</text>
                <line x1="155" y1="410" x2="155" y2="430" className="arrow-svg" stroke="#d32f2f"/>

                {/* Optimizer */}
                <rect x="55" y="430" width="200" height="40" className="process-box-svg box-svg"/>
                <text x="155" y="455" className="label-text-svg" textAnchor="middle">Optimizer (e.g., AdamW)</text>
                <line x1="155" y1="470" x2="155" y2="490" className="arrow-svg" stroke="#d32f2f"/>

                {/* Update Model Weights */}
                <rect x="80" y="490" width="150" height="40" className="model-box-svg box-svg" fill="#fffde7" stroke="#fbc02d"/>
                <text x="155" y="515" className="label-text-svg" textAnchor="middle">Update Model Weights</text>
                
                {/* Loop back to model (conceptual) */}
                <path d="M 70 510 Q 30 350 80 210" stroke="#d32f2f" strokeWidth="1.5" fill="none" strokeDasharray="5,3" markerEnd="url(#arrowhead-phases)"/>
                <text x="35" y="360" className="sub-label-svg" transform="rotate(-70, 35, 360)" fill="#d32f2f">Repeat for Epochs</text>
              </g>

              {/* --- Inference Phase Panel --- */}
              <g id="inference-phase" transform="translate(360, 70)">
                <rect x="0" y="0" width="310" height="550" className="panel-rect-svg"/>
                <text x="155" y="30" className="phase-title-svg" fill="#1976d2">Inference Phase</text>

                {/* Input Prompt */}
                <rect x="80" y="60" width="150" height="40" className="data-box-svg box-svg"/>
                <text x="155" y="85" className="label-text-svg" textAnchor="middle">Input Prompt</text>
                <line x1="155" y1="100" x2="155" y2="120" className="arrow-svg"/>

                {/* Tokenizer + Embeddings + Positional Encoding */}
                <rect x="55" y="120" width="200" height="40" className="process-box-svg box-svg"/>
                <text x="155" y="145" className="label-text-svg" textAnchor="middle">Tokenize & Encode</text>
                <line x1="155" y1="160" x2="155" y2="180" className="arrow-svg"/>

                {/* Transformer Model (Forward Pass Only) */}
                <rect x="80" y="180" width="150" height="60" className="model-box-svg box-svg"/>
                <text x="155" y="205" className="label-text-svg" textAnchor="middle">Transformer Model</text>
                <text x="155" y="225" className="sub-label-svg">(Forward Pass Only)</text>
                <line x1="155" y1="240" x2="155" y2="260" className="arrow-svg"/>

                {/* Logits */}
                <rect x="105" y="260" width="100" height="30" className="output-box-svg box-svg"/>
                <text x="155" y="280" className="label-text-svg" textAnchor="middle">Logits</text>
                <line x1="155" y1="290" x2="155" y2="310" className="arrow-svg"/>

                {/* Sampling Strategy */}
                <rect x="55" y="310" width="200" height="40" className="process-box-svg box-svg"/>
                <text x="155" y="335" className="label-text-svg" textAnchor="middle">Sampling (Temp, Top-K/P)</text>
                <line x1="155" y1="350" x2="155" y2="370" className="arrow-svg"/>

                {/* Generated Token */}
                <rect x="80" y="370" width="150" height="40" className="output-box-svg box-svg" fill="#ffecb3" stroke="#ffe082"/>
                <text x="155" y="395" className="label-text-svg" textAnchor="middle">Generated Token</text>
                
                {/* Autoregressive Loop */}
                <path d="M 240 390 Q 280 300 230 210" stroke="#1976d2" strokeWidth="1.5" fill="none" className="dashed-arrow-svg"/>
                <text x="265" y="300" className="sub-label-svg" fill="#1976d2">Append & Repeat</text>

                {/* Final Output */}
                <rect x="55" y="450" width="200" height="40" className="data-box-svg box-svg" fill="#e1f5fe" stroke="#81d4fa"/>
                <text x="155" y="475" className="label-text-svg" textAnchor="middle">Generated Text Sequence</text>

                {/* KV Cache (Conceptual) */}
                <rect x="20" y="250" width="50" height="80" className="model-box-svg box-svg" fillOpacity="0.7"/>
                <text x="45" y="295" className="sub-label-svg" transform="rotate(-90, 45, 295)">KV Cache</text>
                <line x1="70" y1="230" x2="80" y2="230" className="dashed-arrow-svg" stroke="#1976d2"/>

              </g>
            </svg>
            <p className="figure-caption">Figure 6: Training phase vs inference phase showing the key differences in computation</p>
          </div>

          <h2>Advanced Topics: Scaling Laws and Emergent Abilities</h2>

          <p>
            As LLMs grow larger, they exhibit fascinating scaling behaviors and emergent capabilities that arise at certain model sizes.
          </p>

          <h3>Scaling Laws</h3>
          <p>
            Research has shown that model performance follows predictable scaling laws with respect to model size (N), dataset size (D), and compute (C):
          </p>
            <div className="highlight">
              <p>
                {"$$L(N, D, C) = \\left(\\frac{N_c}{N}\\right)^{\\alpha_N} + \\left(\\frac{D_c}{D}\\right)^{\\alpha_D} + \\left(\\frac{C_c}{C}\\right)^{\\alpha_C}$$"}
              </p>
              <p style={{textAlign: 'center', fontSize: '0.9em', color: '#666'}}>
                Scaling law relating loss to model parameters, data, and compute
              </p>
            </div>

          <pre>
            <code className="language-python">
{`# Scaling analysis and compute requirements
def analyze_scaling_laws():
    """Analyze scaling relationships for LLMs"""
    import numpy as np
    import matplotlib.pyplot as plt
    
    # Model sizes (in billions of parameters)
    model_sizes = np.array([0.1, 0.3, 0.7, 1.5, 6.7, 13, 30, 70, 175, 540])
    
    # Approximate perplexities (simplified for demonstration)
    perplexities = 50 * (model_sizes / 175) ** (-0.076)
    
    # Compute requirements (in FLOPs for training)
    # Rough estimate: 6N tokens × N parameters × 2 FLOPs/parameter
    compute_flops = 6 * model_sizes * 1e9 * model_sizes * 1e9 * 2
    
    # Memory requirements (parameters + gradients + optimizer states)
    # Assume mixed precision: 2 bytes per parameter + 8 bytes for Adam states
    memory_gb = model_sizes * (2 + 8) / 1024**3 * 1000  # Convert to GB
    
    print("Model Scaling Analysis:")
    print("=" * 50)
    for i, size in enumerate(model_sizes):
        print(f"{size:6.1f}B params | "
              f"Perplexity: {perplexities[i]:5.2f} | "
              f"Compute: {compute_flops[i]:.2e} FLOPs | "
              f"Memory: {memory_gb[i]:6.1f} GB")
    
    return model_sizes, perplexities, compute_flops, memory_gb

# Calculate optimal model size given compute budget
def optimal_model_size(compute_budget_flops):
    """Calculate optimal model size for given compute budget using Chinchilla scaling"""
    # Chinchilla optimal: roughly equal compute on model size and data
    # For compute C, optimal model size N ∝ C^0.5, optimal data D ∝ C^0.5
    
    # Constants from Chinchilla paper (simplified)
    A = 406.4  # Scaling constant
    B = 410.7  # Scaling constant
    alpha = 0.34  # Model size exponent
    beta = 0.28   # Data size exponent
    
    # Optimal model size in billions of parameters
    optimal_N = (compute_budget_flops / (6 * 2)) ** (1 / (1 + alpha + beta))
    optimal_N_billions = optimal_N / 1e9
    
    # Optimal dataset size in tokens
    optimal_D = (compute_budget_flops / (6 * 2 * optimal_N)) 
    optimal_D_billions = optimal_D / 1e9
    
    return optimal_N_billions, optimal_D_billions

# Example: What's optimal for different compute budgets?
compute_budgets = [1e20, 1e21, 1e22, 1e23, 1e24]  # FLOPs
print("\\nOptimal Model Sizing:")
print("=" * 40)
for budget in compute_budgets:
    n_params, n_tokens = optimal_model_size(budget)
    print(f"Compute: {budget:.0e} FLOPs → "
          f"Model: {n_params:.1f}B params, "
          f"Data: {n_tokens:.1f}B tokens")

# Emergent abilities analysis
def analyze_emergent_abilities():
    """Analyze when emergent abilities appear in LLMs"""
    
    # Approximate model sizes where abilities emerge
    emergent_thresholds = {
        'Few-shot learning': 1.3,      # Billion parameters
        'Chain-of-thought reasoning': 10,
        'Code generation': 6.7,
        'Mathematical reasoning': 60,
        'Complex instruction following': 100,
        'Theory of mind': 175,
    }
    
    print("\\nEmergent Abilities by Model Size:")
    print("=" * 50)
    for ability, threshold in emergent_thresholds.items():
        print(f"{ability:30} emerges at ~{threshold:5.1f}B parameters")
    
    return emergent_thresholds`}
            </code>
          </pre>
          <p>
            The scaling analysis shows how model size, compute, and data interact to determine performance. The Chinchilla optimal frontier provides a guideline for balancing these factors.
          </p>
          {/* SVG Suggestion 7: Scaling Laws Visualization */}
          <div className="figure-container">
            <svg width="700" height="700" xmlns="http://www.w3.org/2000/svg" fontFamily="Arial, sans-serif" aria-labelledby="svgTitleScaling" role="img">
              <title id="svgTitleScaling">LLM Scaling Laws and Emergent Abilities Visualization</title>
              <desc>Conceptual illustration of LLM scaling laws, showing Loss vs. Model Size and Compute vs. Model Size, with emergent abilities and the Chinchilla optimal frontier indicated.</desc>
              <style>{`
                .scaling-main-title-svg { font-size: 20px; font-weight: bold; fill: #2c3e50; text-anchor: middle; }
                .scaling-chart-title-svg { font-size: 16px; font-weight: bold; fill: #1a237e; text-anchor: middle; }
                .scaling-axis-label-svg { font-size: 12px; fill: #333; text-anchor: middle; }
                .scaling-tick-label-svg { font-size: 10px; fill: #555; text-anchor: middle; }
                .scaling-line-svg { stroke-width: 2.5; fill: none; }
                .loss-line-svg { stroke: #d32f2f; } /* Red for loss */
                .compute-line-svg { stroke: #1976d2; } /* Blue for compute */
                .chinchilla-line-svg { stroke: #388e3c; stroke-dasharray: 5,3; } /* Green dashed for Chinchilla */
                .emergence-marker-svg { stroke: #7b1fa2; stroke-width: 1; stroke-dasharray: 2,2; }
                .emergence-text-svg { font-size: 9px; fill: #7b1fa2; text-anchor: middle; }
                .legend-text-svg { font-size: 11px; fill: #333; }
                .slider-track-svg { fill: #e0e0e0; rx:3; ry:3; }
                .slider-thumb-svg { fill: #00796b; }
                .control-label-svg { font-size: 12px; fill: #444; }
              `}</style>
              <defs>
                <marker id="arrowhead-scaling" viewBox="0 0 10 10" refX="8" refY="5"
                    markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#555" />
                </marker>
              </defs>

              <text x="350" y="35" className="scaling-main-title-svg">LLM Scaling Laws & Emergent Abilities</text>

              {/* --- Chart 1: Loss vs. Model Size --- */}
              <g id="loss-chart" transform="translate(0, 70)">
                <text x="350" y="20" className="scaling-chart-title-svg">Performance (Loss) vs. Model Size</text>
                
                {/* Axes */}
                <line x1="80" y1="230" x2="620" y2="230" stroke="#555" markerEnd="url(#arrowhead-scaling)" /> {/* X-axis */}
                <text x="350" y="250" className="scaling-axis-label-svg">Model Size (Parameters) - Log Scale</text>
                <line x1="80" y1="230" x2="80" y2="50" stroke="#555" markerEnd="url(#arrowhead-scaling)" /> {/* Y-axis */}
                <text x="50" y="140" className="scaling-axis-label-svg" transform="rotate(-90, 50, 140)">Loss / Perplexity (Log Scale)</text>

                {/* X-axis Ticks (Conceptual Log) */}
                {[{val: "1B", x: 120}, {val: "10B", x: 250}, {val: "100B", x: 400}, {val: "500B+", x: 550}].map(t => (
                  <text key={`lx-${t.val}`} x={t.x} y="240" className="scaling-tick-label-svg" dominantBaseline="hanging">{t.val}</text>
                ))}
                {/* Y-axis Ticks (Conceptual Log) */}
                {[{val: "High", y: 70}, {val: "Mid", y: 130}, {val: "Low", y: 200}].map(t => (
                  <text key={`ly-${t.val}`} x="70" y={t.y} className="scaling-tick-label-svg" textAnchor="end" dominantBaseline="middle">{t.val}</text>
                ))}

                {/* Loss Curve */}
                <path d="M 120 200 Q 250 100, 400 70 T 550 60" className="scaling-line-svg loss-line-svg" />

                {/* Chinchilla Optimal Path (Conceptual) */}
                <path d="M 120 180 Q 250 90, 400 60 T 550 50" className="scaling-line-svg chinchilla-line-svg" />
                <text x="480" y="45" className="legend-text-svg" fill="#388e3c" fontSize="10px">Chinchilla Optimal</text>

                {/* Emergent Abilities Markers */}
                {[
                  { name: "Few-shot", size: 1.3, x_approx: 130 }, // Approx position for 1.3B
                  { name: "CoT", size: 10, x_approx: 250 },      // Approx position for 10B
                  { name: "Math", size: 60, x_approx: 350 },    // Approx position for 60B
                  { name: "Instruction", size: 100, x_approx: 400 }, // Approx position for 100B
                  { name: "ToM", size: 175, x_approx: 450 },    // Approx position for 175B
                ].map(ability => (
                  <g key={ability.name}>
                    <line x1={ability.x_approx} y1="230" x2={ability.x_approx} y2="60" className="emergence-marker-svg" />
                    <text x={ability.x_approx} y="55" className="emergence-text-svg" transform={`rotate(-60, ${ability.x_approx}, 55)`}>{ability.name} ({ability.size}B)</text>
                  </g>
                ))}
              </g>

              {/* --- Chart 2: Compute vs. Model Size --- */}
              <g id="compute-chart" transform="translate(0, 330)">
                <text x="350" y="20" className="scaling-chart-title-svg">Training Compute vs. Model Size</text>

                {/* Axes */}
                <line x1="80" y1="230" x2="620" y2="230" stroke="#555" markerEnd="url(#arrowhead-scaling)" /> {/* X-axis */}
                <text x="350" y="250" className="scaling-axis-label-svg">Model Size (Parameters) - Log Scale</text>
                <line x1="80" y1="230" x2="80" y2="50" stroke="#555" markerEnd="url(#arrowhead-scaling)" /> {/* Y-axis */}
                <text x="50" y="140" className="scaling-axis-label-svg" transform="rotate(-90, 50, 140)">Compute (FLOPs) - Log Scale</text>

                {/* X-axis Ticks (Conceptual Log) - Same as above for consistency */}
                {[{val: "1B", x: 120}, {val: "10B", x: 250}, {val: "100B", x: 400}, {val: "500B+", x: 550}].map(t => (
                  <text key={`cx-${t.val}`} x={t.x} y="240" className="scaling-tick-label-svg" dominantBaseline="hanging">{t.val}</text>
                ))}
                {/* Y-axis Ticks (Conceptual Log) */}
                {[{val: "1E20", y: 200}, {val: "1E22", y: 120}, {val: "1E24", y: 60}].map(t => (
                  <text key={`cy-${t.val}`} x="70" y={t.y} className="scaling-tick-label-svg" textAnchor="end" dominantBaseline="middle">{t.val}</text>
                ))}

                {/* Compute Curve (e.g., C ~ N^2 or N*D) */}
                <path d="M 120 210 Q 250 150, 400 80 T 550 60" className="scaling-line-svg compute-line-svg" />
                
                {/* Chinchilla Optimal Path (Conceptual) */}
                <path d="M 120 220 Q 250 170, 400 100 T 550 80" className="scaling-line-svg chinchilla-line-svg" />
                 <text x="480" y="75" className="legend-text-svg" fill="#388e3c" fontSize="10px">Chinchilla Optimal</text>
              </g>

              {/* --- Conceptual Controls --- */}
              <g id="conceptual-controls" transform="translate(50, 600)">
                <text x="0" y="15" className="control-label-svg" fontWeight="bold">Conceptual Controls:</text>
                
                <text x="0" y="40" className="control-label-svg">Compute Budget:</text>
                <rect x="100" y="30" width="150" height="10" className="slider-track-svg"/>
                <circle cx="100 + 150*0.6" cy="35" r="6" className="slider-thumb-svg"/>
                <text x="260" y="40" className="control-label-svg">1E23 FLOPs</text>

                <text x="0" y="70" className="control-label-svg">Dataset Size:</text>
                <rect x="100" y="60" width="150" height="10" className="slider-track-svg"/>
                <circle cx="100 + 150*0.75" cy="65" r="6" className="slider-thumb-svg"/>
                <text x="260" y="70" className="control-label-svg">10T Tokens</text>
              </g>

              {/* --- Legend --- */}
              <g id="scaling-legend" transform="translate(400, 600)">
                <text x="0" y="15" className="legend-text-svg" fontWeight="bold">Legend:</text>
                
                <line x1="0" y1="30" x2="20" y2="30" className="scaling-line-svg loss-line-svg"/>
                <text x="25" y="34" className="legend-text-svg">Loss Trend</text>
                
                <line x1="0" y1="50" x2="20" y2="50" className="scaling-line-svg compute-line-svg"/>
                <text x="25" y="54" className="legend-text-svg">Compute Cost</text>
                
                <line x1="120" y1="30" x2="140" y2="30" className="scaling-line-svg chinchilla-line-svg"/>
                <text x="145" y="34" className="legend-text-svg">Chinchilla Optimal Path</text>
                
                <line x1="120" y1="50" x2="140" y2="50" className="emergence-marker-svg"/>
                <text x="145" y="54" className="legend-text-svg">Emergent Ability Threshold</text>
              </g>
            </svg>
            <p className="figure-caption">Figure 7: Scaling laws showing the relationship between model size, compute, and performance</p>
          </div>

          <h2>Mathematical Deep Dive: Information Theory and LLMs</h2>

          <p>
            Understanding LLMs through the lens of information theory provides insights into their fundamental capabilities and limitations.
          </p>

          <h3>Cross-Entropy Loss and Information Content</h3>
          <p>
            The cross-entropy loss used in training LLMs is deeply connected to information theory. It measures the "surprise" or information content of predictions:
          </p>

            <div className="highlight">
              <p>
                {"\\[H(p, q) = -\\sum_{i} p_i \\log q_i\\]"}
              </p>
              <p>
                {"\\[\\text{where } I(x) = -\\log p(x) \\text{ is the information content}\\]"}
              </p>
              <p style={{textAlign: 'center', fontSize: '0.9em', color: '#666'}}>
                Cross-entropy between true distribution p and predicted distribution q
              </p>
            </div>

          <pre>
            <code className="language-python">
{`# Information theory analysis of LLM predictions
import torch
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt

class InformationAnalyzer:
    def __init__(self, model, tokenizer):
        self.model = model
        self.tokenizer = tokenizer
    
    def calculate_entropy(self, logits):
        """Calculate entropy of probability distribution"""
        probs = torch.softmax(logits, dim=-1)
        # Avoid log(0) by adding small epsilon
        log_probs = torch.log(probs + 1e-12)
        entropy = -torch.sum(probs * log_probs, dim=-1)
        return entropy
    
    def analyze_prediction_confidence(self, text):
        """Analyze model confidence across different positions"""
        self.model.eval()
        
        tokens = self.tokenizer.encode(text, return_tensors="pt")
        confidences = []
        entropies = []
        surprisals = []
        
        with torch.no_grad():
            for i in range(1, len(tokens[0])):
                # Get predictions for tokens up to position i
                input_tokens = tokens[:, :i]
                outputs = self.model(input_tokens)
                logits = outputs.logits[0, -1, :]  # Last position logits
                
                # Calculate metrics
                probs = torch.softmax(logits, dim=-1)
                entropy = self.calculate_entropy(logits.unsqueeze(0))[0]
                
                # Actual next token
                actual_token = tokens[0, i]
                actual_prob = probs[actual_token]
                surprisal = -torch.log(actual_prob)  # Information content
                confidence = torch.max(probs)
                
                confidences.append(confidence.item())
                entropies.append(entropy.item())
                surprisals.append(surprisal.item())
        
        return {
            'tokens': [self.tokenizer.decode([t]) for t in tokens[0][1:]],
            'confidences': confidences,
            'entropies': entropies,
            'surprisals': surprisals
        }
    
    def calculate_perplexity_breakdown(self, text):
        """Calculate per-token perplexity contributions"""
        self.model.eval()
        
        tokens = self.tokenizer.encode(text, return_tensors="pt")
        total_log_likelihood = 0
        token_contributions = []
        
        with torch.no_grad():
            outputs = self.model(tokens)
            logits = outputs.logits[0]  # Remove batch dimension
            
            for i in range(len(tokens[0]) - 1):
                # Logits for position i predict token at position i+1
                token_logits = logits[i]
                target_token = tokens[0, i + 1]
                
                # Calculate log probability of target token
                log_probs = torch.log_softmax(token_logits, dim=-1)
                token_log_prob = log_probs[target_token]
                
                total_log_likelihood += token_log_prob
                token_contributions.append({
                    'token': self.tokenizer.decode([target_token]),
                    'log_prob': token_log_prob.item(),
                    'prob': torch.exp(token_log_prob).item(),
                    'surprisal': -token_log_prob.item()
                })
        
        # Overall perplexity
        avg_log_likelihood = total_log_likelihood / (len(tokens[0]) - 1)
        perplexity = torch.exp(-avg_log_likelihood)
        
        return {
            'perplexity': perplexity.item(),
            'avg_log_likelihood': avg_log_likelihood.item(),
            'token_contributions': token_contributions
        }
    
    def mutual_information_analysis(self, context, continuations):
        """Analyze mutual information between context and continuations"""
        context_tokens = self.tokenizer.encode(context, return_tensors="pt")
        
        results = []
        for continuation in continuations:
            full_text = context + continuation
            full_tokens = self.tokenizer.encode(full_text, return_tensors="pt")
            
            # Calculate P(continuation | context)
            continuation_start = len(context_tokens[0])
            continuation_tokens = full_tokens[0, continuation_start:]
            
            with torch.no_grad():
                # Get logits for the full sequence
                outputs = self.model(full_tokens)
                logits = outputs.logits[0]
                
                # Calculate log probability of continuation
                log_prob_continuation = 0
                for i, token in enumerate(continuation_tokens):
                    if continuation_start + i - 1 >= 0:
                        token_logits = logits[continuation_start + i - 1]
                        log_probs = torch.log_softmax(token_logits, dim=-1)
                        log_prob_continuation += log_probs[token]
                
                prob_continuation = torch.exp(log_prob_continuation)
            
            results.append({
                'continuation': continuation,
                'log_probability': log_prob_continuation.item(),
                'probability': prob_continuation.item(),
                'length': len(continuation_tokens)
            })
        
        return results

# Example analysis
def run_information_analysis():
    """Run comprehensive information-theoretic analysis"""
    analyzer = InformationAnalyzer(model, tokenizer)
    
    # Test text
    text = "The capital of France is Paris, which is known for its beautiful architecture."
    
    # Confidence analysis
    confidence_analysis = analyzer.analyze_prediction_confidence(text)
    
    print("Per-token Analysis:")
    print("=" * 60)
    for i, (token, conf, ent, surp) in enumerate(zip(
        confidence_analysis['tokens'],
        confidence_analysis['confidences'],
        confidence_analysis['entropies'],
        confidence_analysis['surprisals']
    )):
        print(f"{i+1:2d}. {token:15} | "
              f"Confidence: {conf:.3f} | "
              f"Entropy: {ent:.3f} | "
              f"Surprisal: {surp:.3f}")
    
    # Perplexity breakdown
    perplexity_analysis = analyzer.calculate_perplexity_breakdown(text)
    print(f"\\nOverall Perplexity: {perplexity_analysis['perplexity']:.2f}")
    print(f"Average Log-Likelihood: {perplexity_analysis['avg_log_likelihood']:.3f}")
    
    # Mutual information between context and continuations
    context = "The weather today is"
    continuations = [" sunny", " rainy", " cloudy", " unpredictable"]
    
    mi_analysis = analyzer.mutual_information_analysis(context, continuations)
    
    print("\\nContext-Continuation Analysis:")
    print("=" * 40)
    for result in sorted(mi_analysis, key=lambda x: x['probability'], reverse=True):
        print(f"'{result['continuation']}' → "
              f"P = {result['probability']:.4f}, "
              f"Log P = {result['log_probability']:.3f}")

# Uncomment to run analysis:
# run_information_analysis()`}
            </code>
          </pre>
          <h2>Conclusion</h2>
          <p>
            We've covered the core components that make LLMs work - from tokenization and embeddings to attention mechanisms and generation strategies. Key takeaways:
          </p>
          <ul>
            <li>LLMs are built on the Transformer architecture which uses attention to process text in parallel</li>
            <li>Training involves minimizing cross-entropy loss over massive datasets</li>
            <li>Generation uses sampling strategies to balance coherence and creativity</li>
            <li>Model performance follows predictable scaling laws</li>
          </ul>

          <h2>References</h2>
          <ol>
            <li>Vaswani et al. "Attention Is All You Need" (2017)</li>
            <li>Brown et al. "Language Models are Few-Shot Learners" (2020)</li>
            <li>Hoffmann et al. "Training Compute-Optimal Large Language Models" (2022)</li>
          </ol>

          <h2>Further Reading</h2>
          <ul>
            <li>The Illustrated Transformer by Jay Alammar</li>
            <li>LLM Visualization Tools and Techniques</li>
            <li>Advanced Topics in Language Model Training</li>
          </ul>
      </section>
    </div>
    </BlogPostLayout>
  );
};

export default LLMTechnicalDeepDive;