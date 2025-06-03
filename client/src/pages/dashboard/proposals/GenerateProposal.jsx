import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiDownload, FiRefreshCw, FiSave, FiSend, FiMessageSquare, FiUser, FiSettings } from 'react-icons/fi';

const GenerateProposal = () => {
  // Chat messages state
  const [messages, setMessages] = useState([]);
  
  // Form states
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  
  // Ref for auto-scrolling chat
  const messagesEndRef = useRef(null);

  // Sample tone options
  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'confident', label: 'Confident' },
    { value: 'enthusiastic', label: 'Enthusiastic' },
    { value: 'formal', label: 'Formal' }
  ];

  // Sample length options
  const lengthOptions = [
    { value: 'short', label: 'Short (150-200 words)' },
    { value: 'medium', label: 'Medium (250-350 words)' },
    { value: 'long', label: 'Long (400-500 words)' }
  ];

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!jobDescription.trim()) {
      return; // Don't proceed if job description is empty
    }
    
    // Set conversation as started if this is the first message
    if (!conversationStarted) {
      setConversationStarted(true);
      
      // Add initial system message
      const systemMessage = {
        id: 1,
        role: 'system',
        content: 'Hello! I can help you generate a proposal for your job application. I\'ll create a customized proposal based on the job description you provide.'
      };
      
      setMessages(prev => [...prev, systemMessage]);
    }
    
    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: jobDescription
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);
    
    // Add a loading message
    const loadingMessage = {
      id: messages.length + 2,
      role: 'assistant',
      content: 'Generating your proposal...',
      isLoading: true
    };
    
    setMessages(prev => [...prev, loadingMessage]);
    
    // Simulate API call with progressive loading
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(progressInterval);
        
        // Generate a more personalized proposal based on the job description
        const customProposal = generateCustomProposal(jobDescription, tone, length);
        setGeneratedProposal(customProposal);
        
        // Replace loading message with generated proposal
        const assistantMessage = {
          id: messages.length + 2,
          role: 'assistant',
          content: customProposal
        };
        
        setMessages(prev => prev.map(msg => 
          msg.isLoading ? assistantMessage : msg
        ));
        
        setIsGenerating(false);
        setJobDescription(''); // Clear input for next message
      }
    }, 200); // Update progress every 200ms for a total of ~2 seconds
  };
  
  // Generate a custom proposal based on job description and settings
  const generateCustomProposal = (description, toneStyle, lengthStyle) => {
    // Extract keywords from job description
    const techKeywords = ['React', 'JavaScript', 'TypeScript', 'Node.js', 'API', 'Redux', 'CSS', 'HTML', 'frontend', 'backend', 'full-stack', 'UI/UX', 'responsive', 'mobile', 'web'];
    const extractedKeywords = techKeywords.filter(keyword => 
      description.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // Determine job type
    let jobType = 'web development';
    if (description.toLowerCase().includes('design')) jobType = 'web design';
    if (description.toLowerCase().includes('mobile')) jobType = 'mobile app development';
    if (description.toLowerCase().includes('backend') || description.toLowerCase().includes('api')) jobType = 'backend development';
    
    // Adjust tone based on selection
    let greeting = 'Dear Hiring Manager,';
    let closingLine = 'I look forward to discussing this opportunity further.';
    
    switch(toneStyle) {
      case 'friendly':
        greeting = 'Hi there!';
        closingLine = `I'd love to chat more about how I can help with your project!`;
        break;
      case 'confident':
        greeting = 'Dear Hiring Team,';
        closingLine = `I'm confident I can deliver exceptional results for your project.`;
        break;
      case 'enthusiastic':
        greeting = 'Hello!';
        closingLine = `I'm incredibly excited about this opportunity and can't wait to potentially work together!`;
        break;
      case 'formal':
        greeting = 'To Whom It May Concern,';
        closingLine = 'I appreciate your consideration and look forward to your response.';
        break;
      default: // professional
        break;
    }
    
    // Adjust length based on selection
    let detailLevel = '';
    let experienceSection = 'I have over 5 years of experience building modern web applications using ' + 
      (extractedKeywords.length > 0 ? extractedKeywords.join(', ') : 'various frontend and backend technologies') + 
      '.';
    
    switch(lengthStyle) {
      case 'short':
        detailLevel = 'brief';
        break;
      case 'long':
        detailLevel = 'comprehensive';
        experienceSection += ' My expertise includes:\n\n' +
          '- Building responsive, user-friendly interfaces that enhance user experience\n' +
          '- Developing scalable backend solutions with secure API endpoints\n' +
          '- Implementing state management solutions for complex applications\n' +
          '- Optimizing application performance and load times\n' +
          '- Writing clean, maintainable code with comprehensive test coverage';
        break;
      default: // medium
        detailLevel = 'detailed';
        break;
    }
    
    // Construct the proposal
    return `${greeting}\n\nI'm writing to express my strong interest in your ${jobType} position. ${experienceSection}\n\nBased on your job description, I understand you're looking for someone with expertise in ${extractedKeywords.length > 0 ? extractedKeywords.join(', ') : 'web development technologies'}. I've successfully delivered similar projects, including:\n\n- A ${detailLevel} e-commerce platform with advanced filtering that increased conversion by 32%\n- Custom API integration with third-party services that streamlined operations\n- Responsive designs that work flawlessly across all devices\n\nMy approach combines clean, maintainable code with performance optimization techniques to ensure fast loading times and smooth user experiences.\n\n${closingLine}\n\nBest regards,\n[Your Name]`;
  };

  // Handle copy to clipboard
  const handleCopy = (text = generatedProposal) => {
    navigator.clipboard.writeText(text);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };
  
  // Handle save proposal
  const handleSave = () => {
    // In a real app, this would save to a database
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };
  
  // Handle regenerate proposal
  const handleRegenerate = () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    // Add a system message about regenerating
    const systemMessage = {
      id: messages.length + 1,
      role: 'system',
      content: 'Regenerating proposal with the same parameters...'
    };
    
    setMessages(prev => [...prev, systemMessage]);
    
    // Add a loading message
    const loadingMessage = {
      id: messages.length + 2,
      role: 'assistant',
      content: 'Generating your proposal...',
      isLoading: true
    };
    
    setMessages(prev => [...prev, loadingMessage]);
    
    setTimeout(() => {
      // Generate a slightly different proposal
      const customProposal = generateCustomProposal(
        messages.find(m => m.role === 'user')?.content || '', 
        tone, 
        length
      );
      setGeneratedProposal(customProposal);
      
      // Replace loading message with generated proposal
      const assistantMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: customProposal
      };
      
      setMessages(prev => prev.map(msg => 
        msg.isLoading ? assistantMessage : msg
      ));
      
      setIsGenerating(false);
    }, 2000);
  };
  
  // Toggle settings panel
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Add an effect to prevent body scrolling and add custom scrollbar styles
  useEffect(() => {
    // Disable scrolling on body
    document.body.style.overflow = 'hidden';
    
    // Add custom scrollbar style to hide scrollbars while maintaining functionality
    const style = document.createElement('style');
    style.textContent = `
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden relative">
      <div className="max-w-3xl mx-auto w-full h-full flex flex-col">
        {/* No header */}

        {/* Settings panel will be moved below */}

        {/* Main content - takes full height */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Chat messages area - only this part scrolls */}
          <div className="flex-1 overflow-y-auto pb-32 no-scrollbar"> {/* Added padding to bottom to ensure messages aren't hidden behind input */}
          {conversationStarted ? (
            /* Messages when conversation has started */
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-3/4 rounded-lg p-3 ${message.role === 'user' 
                      ? 'bg-emerald-600 text-white' 
                      : message.role === 'system' 
                        ? 'bg-gray-200 text-gray-700' 
                        : 'bg-white border border-gray-200 text-gray-800 shadow-sm'}`}
                  >
                    {message.isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300"></div>
                        <span className="text-gray-500 ml-1">{message.content}</span>
                      </div>
                    ) : (
                      <div className="whitespace-pre-line">{message.content}</div>
                    )}
                    
                    {message.role === 'assistant' && !message.isLoading && (
                      <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end space-x-2">
                        <button 
                          onClick={() => handleCopy(message.content)}
                          className="text-xs text-gray-500 hover:text-emerald-600"
                        >
                          <FiCopy className="inline mr-1" size={12} />
                          Copy
                        </button>
                        <button 
                          onClick={handleSave}
                          className="text-xs text-gray-500 hover:text-emerald-600"
                        >
                          <FiSave className="inline mr-1" size={12} />
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            /* Empty space when no conversation */
            <div className="flex-1"></div>
          )}
        </div>
        
        {/* Input area - sticky at the bottom, centered initially */}
        <div className={`w-full ${conversationStarted ? 'sticky bottom-0 left-0 right-0' : 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'} z-10 bg-gray-50`}>
          <div className="max-w-2xl mx-auto px-4">
            {!conversationStarted && (
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Generate Your Proposal</h2>
                <p className="text-gray-600 mb-6">
                  Paste a job description below and let AI create a personalized proposal for you.
                </p>
              </div>
            )}
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="flex items-center p-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-3 border-0 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-0"
                    placeholder={conversationStarted ? "Ask a follow-up question..." : "Paste job description here..."}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    disabled={isGenerating}
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                    disabled={isGenerating || !jobDescription.trim()}
                  >
                    {isGenerating ? (
                      <FiRefreshCw className="animate-spin h-5 w-5" />
                    ) : (
                      <FiSend className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                {/* Settings buttons below input */}
                <div className="px-3 py-2 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                  <div className="flex space-x-4">
                    <button 
                      type="button"
                      onClick={toggleSettings}
                      className="flex items-center hover:text-emerald-600"
                    >
                      <FiSettings className="mr-1" size={14} />
                      {showSettings ? 'Hide settings' : 'Settings'}
                    </button>
                    <button 
                      type="button"
                      onClick={handleRegenerate}
                      className="flex items-center hover:text-emerald-600"
                      disabled={!conversationStarted || isGenerating}
                    >
                      <FiRefreshCw className="mr-1" size={14} />
                      Regenerate
                    </button>
                  </div>
                  <div className="text-xs text-gray-400">
                    AI-powered proposal generator
                  </div>
                </div>
                
                {/* Settings panel */}
                {showSettings && (
                  <motion.div 
                    className="border-t border-gray-100 bg-gray-50"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="chat-tone" className="block text-sm font-medium text-gray-700 mb-1">
                          Tone
                        </label>
                        <select
                          id="chat-tone"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                          value={tone}
                          onChange={(e) => setTone(e.target.value)}
                        >
                          {toneOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="chat-length" className="block text-sm font-medium text-gray-700 mb-1">
                          Length
                        </label>
                        <select
                          id="chat-length"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                        >
                          {lengthOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
      
      {/* Success message */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-md shadow-lg">
          Action completed successfully!
        </div>
      )}
      </div>
    </div>
  );
};

export default GenerateProposal;
