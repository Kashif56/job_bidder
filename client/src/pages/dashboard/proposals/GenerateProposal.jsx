import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiDownload, FiRefreshCw, FiSave, FiSend } from 'react-icons/fi';

const GenerateProposal = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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

  // Sample generated proposal (in a real app, this would come from the API)
  const sampleProposal = `
Dear Hiring Manager,

I'm writing to express my strong interest in your React Developer position for your e-commerce project. With over 5 years of experience building modern, responsive web applications using React, Redux, and related technologies, I believe I'm well-positioned to help you achieve your project goals.

Based on your job description, you're looking for someone who can build a seamless shopping experience with advanced filtering, cart functionality, and payment integration. I've successfully delivered similar features for clients including:

- A custom e-commerce platform with advanced filtering and search capabilities that increased conversion by 32%
- Shopping cart and checkout flows with Stripe integration that improved completion rates by 24%
- Responsive designs that work flawlessly across all devices

My approach combines clean, maintainable code with performance optimization techniques to ensure fast loading times and smooth user experiences. I'm particularly skilled at component architecture that allows for scalability and easy maintenance.

I'd love to discuss your project requirements in more detail and share how my experience can directly benefit your e-commerce goals. I'm available for a call this week to explore how we might work together.

Thank you for considering my application. I look forward to potentially collaborating on your project.

Best regards,
[Your Name]
  `;

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!jobDescription.trim()) {
      return; // Don't proceed if job description is empty
    }
    
    setIsGenerating(true);
    
    // Simulate API call with progressive loading
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(progressInterval);
        
        // Generate a more personalized proposal based on the job description
        const customProposal = generateCustomProposal(jobDescription, tone, length);
        setGeneratedProposal(customProposal);
        setIsGenerating(false);
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
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedProposal);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  // Handle save proposal
  const handleSave = () => {
    // In a real app, this would save to the database
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Generate Proposal</h1>
        <p className="mt-1 text-gray-600">
          Paste a job description and let AI create a personalized proposal for you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input form */}
        <div className="lg:col-span-2">
          <motion.div 
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Job Details</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  id="jobDescription"
                  rows={10}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => {
                    setJobDescription(e.target.value);
                    // Clear generated proposal when job description changes
                    if (generatedProposal) setGeneratedProposal('');
                  }}
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-1">
                    Tone
                  </label>
                  <select
                    id="tone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white"
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
                  <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
                    Length
                  </label>
                  <select
                    id="length"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white"
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

              <div className="pt-4">
                {isGenerating && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                      <span>Generating proposal...</span>
                      <span>Processing job description</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  disabled={isGenerating || !jobDescription}
                >
                  {isGenerating ? (
                    <>
                      <FiRefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Generating...
                    </>
                  ) : (
                    'Generate Proposal'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Settings and tips */}
        <div>
          <motion.div 
            className="bg-white rounded-lg border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Credits</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Remaining</span>
                <span className="text-lg font-semibold text-emerald-600">25</span>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: '62.5%' }}></div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Each proposal generation uses 1 credit. You can generate 25 more proposals with your current plan.
                </p>
              </div>
              <div className="mt-4">
                <button className="w-full flex justify-center items-center px-4 py-2 border border-emerald-600 rounded-md shadow-sm text-sm font-medium text-emerald-600 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                  Upgrade Plan
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Tips</h2>
            </div>
            <div className="p-6">
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 text-xs font-bold mr-2">
                    1
                  </span>
                  <span>Include the complete job description for better results</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 text-xs font-bold mr-2">
                    2
                  </span>
                  <span>Choose a tone that matches the client's industry and style</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 text-xs font-bold mr-2">
                    3
                  </span>
                  <span>Always review and personalize the generated proposal</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 text-xs font-bold mr-2">
                    4
                  </span>
                  <span>Add specific examples of your work to strengthen your proposal</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Generated proposal */}
      {generatedProposal && (
        <motion.div 
          className="bg-white rounded-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800">Generated Proposal</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <FiCopy className="-ml-0.5 mr-2 h-4 w-4" />
                Copy
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <FiSave className="-ml-0.5 mr-2 h-4 w-4" />
                Save
              </button>
              <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <FiDownload className="-ml-0.5 mr-2 h-4 w-4" />
                Download
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-6 whitespace-pre-line">
              {generatedProposal}
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => {
                  setIsGenerating(true);
                  setTimeout(() => {
                    setIsGenerating(false);
                  }, 2000);
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <FiRefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <FiRefreshCw className="-ml-1 mr-2 h-5 w-5" />
                    Regenerate
                  </>
                )}
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <FiSend className="-ml-1 mr-2 h-5 w-5" />
                Apply with this Proposal
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Success message */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-md shadow-lg">
          Action completed successfully!
        </div>
      )}
    </div>
  );
};

export default GenerateProposal;
