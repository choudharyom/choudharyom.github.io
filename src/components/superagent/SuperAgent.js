import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'; // Import react-markdown
import styles from '@/styles/SuperAgent.module.css';
import axios from 'axios'; // Import axios
import { FaPaperPlane, FaMicrophone, FaCog, FaTimes } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import ToolSelector from './ToolSelector';
 
const SuperAgent = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your Super Agent. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput === '') return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      type: 'user',
      content: trimmedInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');

    // Simulate AI thinking
    setIsTyping(true);

    // --- Call Gemini API ---
    // Ensure you have set up the environment variable (e.g., VITE_GEMINI_API_KEY or REACT_APP_GEMINI_API_KEY)
    // --- Debugging Line ---
    console.log('Available Next.js Env Vars:', process.env); // Changed for Next.js
    // --- End Debugging Line ---
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY; // Changed for Next.js
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    if (!apiKey) {
      console.error("Gemini API key is missing. Please set it up in your environment variables.");
      const errorResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: "Configuration error: API key not found.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
      setIsTyping(false);
      return;
    }

    try {
      // Using axios.post
      const response = await axios.post(apiUrl, {
        contents: [{ parts: [{ text: trimmedInput }] }],
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Extract the text from the response - check Gemini API docs for the exact structure
      // Axios puts the response data directly in `response.data`
      const aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't get a valid response.";

      const aiResponse = {
        id: messages.length + 2, // Note: ID generation might need adjustment with async calls
        type: 'ai',
        content: aiText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      // --- End API Call ---

    } catch (error) {
      // Axios errors often have more structure
      console.error("Error fetching Gemini response:", error.response ? error.response.data : error.message);
      const errorResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: `Sorry, something went wrong: ${error.response?.data?.error?.message || error.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false); // Stop typing indicator regardless of success or failure
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <div className={styles.agentInfo}>
          <div className={styles.agentAvatar}>OM</div>
          <div className={styles.agentName}>Super Agent</div>
        </div>
        <div className={styles.headerControls}>
          <button 
            className={styles.settingsButton}
            onClick={() => setShowSettings(!showSettings)}
          >
            <FaCog />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className={styles.settingsPanel}>
          <div className={styles.settingsHeader}>
            <h3>Agent Settings</h3>
            <button onClick={() => setShowSettings(false)}><FaTimes /></button>
          </div>
          <div className={styles.settingsContent}>
            <ToolSelector />
          </div>
        </div>
      )}

      <div className={styles.messageContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${message.type === 'user' ? styles.userMessage : styles.aiMessage}`}
          >
            <div className={styles.messageContent}>
              {message.type === 'ai' ? (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              ) : (
                message.content // Keep user messages as plain text
              )}
            </div>
            <div className={styles.messageTime}>{formatTime(message.timestamp)}</div>
          </div>
        ))}
        
        {isTyping && (
          <div className={`${styles.message} ${styles.aiMessage}`}>
            <div className={styles.typingIndicator}>
              <span><BsThreeDots /></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className={styles.inputContainer} onSubmit={handleSubmit}>
        <input
          type="text"
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className={styles.inputField}
        />
        <button type="button" className={styles.micButton}>
          <FaMicrophone />
        </button>
        <button type="submit" className={styles.sendButton}>
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default SuperAgent;