import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const ProfileImport = ({ onProfileDataSubmit }) => {
  const [profileText, setProfileText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!profileText.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In the future, this will process the text with an LLM
      // For now, we'll just pass the raw text to the parent component
      onProfileDataSubmit(profileText);
    } catch (error) {
      console.error('Error processing profile data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Import Your Profile</h1>
            <p className="mt-1 text-gray-600">
              Enter your professional details in the text area below
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Profile Information</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="profileText" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Your Complete Profile Details
                </label>
                <textarea
                  id="profileText"
                  rows={15}
                  value={profileText}
                  onChange={(e) => setProfileText(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm"
                  placeholder="Include your personal information, skills, work experience, education, languages, and any portfolio links. For example:

Name: John Doe
Title: Full Stack Developer
Email: john.doe@example.com
Phone: +1 (555) 123-4567
Location: San Francisco, CA
Hourly Rate: $75

About Me:
Experienced full-stack developer with 5+ years of experience building web applications using React, Node.js, and various databases.

Skills:
React, JavaScript, Node.js, TypeScript, MongoDB, Express, HTML/CSS, Tailwind CSS, Redux

Work Experience:
1. Senior Frontend Developer at Tech Solutions Inc., San Francisco, CA (2021-Present)
   Lead frontend development for multiple client projects using React, Redux, and TypeScript.

2. Full Stack Developer at WebDev Agency, Los Angeles, CA (2019-2021)
   Developed and maintained web applications for clients in various industries.

Education:
Bachelor of Science in Computer Science, University of California, Berkeley, CA (2015-2019)

Languages:
English (Native), Spanish (Intermediate)

Portfolio Links:
Personal Website: https://johndoe.dev
GitHub: https://github.com/johndoe
LinkedIn: https://linkedin.com/in/johndoe"
                ></textarea>
                <p className="mt-2 text-sm text-gray-500">
                  Include as much detail as possible. This information will be used to pre-fill your profile form.
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !profileText.trim()}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSubmitting || !profileText.trim() 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                  }`}
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      Continue <FiArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileImport;
