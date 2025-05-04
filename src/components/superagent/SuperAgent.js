import React, { useState, useRef, useEffect } from 'react';
import styles from './SuperAgent.module.css';
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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      type: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    
    // Simulate AI thinking
    setIsTyping(true);
    
    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: getAIResponse(input),
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Mock AI response function (replace with actual API)
  const getAIResponse = (userInput) => {
    const responses = [
      "I'm analyzing your request...",
      "That's an interesting question. Here's what I found...",
      "Based on my knowledge, I can tell you that...",
      "I've processed your request and here's the information you need...",
      "Let me help you with that request...",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
      " This is a simulated response to: " + userInput;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <div className={styles.agentInfo}>
          <div className={styles.agentAvatar}>GS</div>
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
              {message.content}
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