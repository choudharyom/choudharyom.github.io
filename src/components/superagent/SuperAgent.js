import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'; // Import react-markdown
import styles from '@/styles/SuperAgent.module.css';
import axios from 'axios'; // Import axios
import { FaPaperPlane, FaMicrophone, FaCog, FaTimes } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import ToolSelector, { availableTools } from './ToolSelector'; // Import availableTools
 
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
  // State for enabled tools, initialized here
  const [enabledTools, setEnabledTools] = useState(
    availableTools.reduce((acc, tool) => ({ ...acc, [tool.id]: true }), {})
  );


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

  // Handler to toggle a specific tool's state
  const handleToggleTool = (id, forceState = null) => {
    setEnabledTools((prev) => {
      const current = prev[id];
      const newState = forceState !== null ? forceState : !current; // Allow forcing state for toggleAll
      return {
        ...prev,
        [id]: newState,
      };
    });
  };

  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput === '') return;

    // Prepare user message (using a temporary ID, real ID assigned during state update)
    const newUserMessage = {
      // id will be assigned based on previous state length
      type: 'user',
      content: trimmedInput,
      timestamp: new Date(),
    };

    // Update state with user message first
    setMessages((prev) => [...prev, { ...newUserMessage, id: prev.length + 1 }]);
    setInput('');
    // Start AI thinking indicator
    setIsTyping(true);

    // --- Call Gemini API ---
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY; // Changed for Next.js
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    if (!apiKey) {
      console.error("Gemini API key is missing. Please set it up in your environment variables.");
      const errorMsg = {
        // id will be assigned based on previous state length
        type: 'ai',
        content: "Configuration error: API key not found.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, { ...errorMsg, id: prev.length + 1 }]);
      setIsTyping(false);
      return;
    }

    // --- Get Enabled Tool Names ---
    const activeToolIds = Object.entries(enabledTools)
      .filter(([id, isEnabled]) => isEnabled)
      .map(([id]) => id);
    
    // --- Prepare Prompt with Tool Context ---
    const toolContext = activeToolIds.length > 0 
      ? `[Enabled Tools: ${activeToolIds.join(', ')}] ` 
      : '';
    const promptWithContext = `${toolContext}${trimmedInput}`;
    console.log("Active tools for this request:", activeToolIds); // Log which tools are active

    try {
      // Using axios.post
      const response = await axios.post(apiUrl, {
        contents: [{ parts: [{ text: trimmedInput }] }],
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
        // NOTE: Standard Gemini generateContent doesn't directly accept a 'tools' array like this.
        // True tool integration requires using the 'tools' and 'functionDeclarations' fields
        // in the request and handling 'functionCall' responses.
        // For now, we've logged the active tools above.
        // If you have a backend proxy, you would send `activeToolIds` to it.
      });

      // Extract the text from the response - check Gemini API docs for the exact structure
      // Axios puts the response data directly in `response.data`
      const aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't get a valid response.";

      const aiMsg = {
        // id will be assigned based on previous state length
        type: 'ai',
        content: aiText,
        timestamp: new Date(),
      };
      // Update state with AI response
      setMessages((prev) => [...prev, { ...aiMsg, id: prev.length + 1 }]);
      // --- End API Call ---

    } catch (error) {
      // Axios errors often have more structure
      console.error("Error fetching AI response:", error.response ? error.response.data : error.message);
      const errorMsg = {
        // id will be assigned based on previous state length
        type: 'ai',
        content: `Sorry, something went wrong: ${error.response?.data?.error?.message || error.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, { ...errorMsg, id: prev.length + 1 }]);
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
            {/* Pass state and handler down to ToolSelector */}
            <ToolSelector
              enabledTools={enabledTools}
              onToggleTool={handleToggleTool}
            />
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