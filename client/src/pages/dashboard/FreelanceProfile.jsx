import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiPlus, FiX } from 'react-icons/fi';

const FreelanceProfile = () => {
  // Sample profile data
  const [profile, setProfile] = useState({
    name: 'John Doe',
    title: 'Full Stack Developer',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    rate: 75,
    about: 'Experienced full-stack developer with 5+ years of experience building web applications using React, Node.js, and various databases. Passionate about creating clean, efficient, and user-friendly applications.',
    skills: ['React', 'JavaScript', 'Node.js', 'TypeScript', 'MongoDB', 'Express', 'HTML/CSS', 'Tailwind CSS', 'Redux'],
    experience: [
      {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'Tech Solutions Inc.',
        location: 'San Francisco, CA',
        startDate: '2021-06',
        endDate: 'Present',
        description: 'Lead frontend development for multiple client projects using React, Redux, and TypeScript. Implemented CI/CD pipelines and improved performance by 40%.'
      },
      {
        id: 2,
        title: 'Full Stack Developer',
        company: 'WebDev Agency',
        location: 'Los Angeles, CA',
        startDate: '2019-03',
        endDate: '2021-05',
        description: 'Developed and maintained web applications for clients in various industries. Worked with React, Node.js, and MongoDB.'
      }
    ],
    education: [
      {
        id: 1,
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of California',
        location: 'Berkeley, CA',
        startDate: '2015-09',
        endDate: '2019-05'
      }
    ],
    languages: [
      { language: 'English', proficiency: 'Native' },
      { language: 'Spanish', proficiency: 'Intermediate' }
    ],
    portfolioLinks: [
      { title: 'Personal Website', url: 'https://johndoe.dev' },
      { title: 'GitHub', url: 'https://github.com/johndoe' },
      { title: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' }
    ]
  });

  // State for new skill input
  const [newSkill, setNewSkill] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Handle profile update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // In a real app, this would send data to the server
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Add new skill
  const addSkill = () => {
    if (newSkill.trim() !== '' && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  // Remove skill
  const removeSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    });
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Freelance Profile</h1>
            <p className="mt-1 text-gray-600">
              Update your profile information to improve proposal matching
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={handleProfileUpdate}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <FiSave className="-ml-1 mr-2 h-5 w-5" />
              Save Profile
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleProfileUpdate}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Personal Information */}
          <motion.div 
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Personal Information</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={profile.title}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">
                    Hourly Rate (USD)
                  </label>
                  <input
                    type="number"
                    id="rate"
                    name="rate"
                    value={profile.rate}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
                  About Me
                </label>
                <textarea
                  id="about"
                  name="about"
                  rows={4}
                  value={profile.about}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm"
                  placeholder="Write a short bio about yourself..."
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  This will be used in your proposals to introduce yourself to clients.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Skills & Languages */}
          <motion.div 
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Skills & Languages</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.skills.map((skill, index) => (
                    <div 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800"
                    >
                      {skill}
                      <button 
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 text-emerald-600 hover:text-emerald-800 focus:outline-none"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="Add a skill..."
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <FiPlus className="h-5 w-5" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Add skills that are relevant to the projects you want to work on.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Languages
                </label>
                <div className="space-y-3">
                  {profile.languages.map((lang, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-800">{lang.language}</div>
                      <div className="text-sm text-gray-600">{lang.proficiency}</div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                  Add Language
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Portfolio & Social Links
                </label>
                <div className="space-y-3">
                  {profile.portfolioLinks.map((link, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-800">{link.title}</div>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-600 hover:text-emerald-800"
                      >
                        {link.url}
                      </a>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                  Add Link
                </button>
              </div>
            </div>
          </motion.div>

          {/* Experience */}
          <motion.div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-800">Work Experience</h2>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <FiPlus className="-ml-0.5 mr-2 h-4 w-4" />
                Add Experience
              </button>
            </div>
            <div className="p-6 space-y-6">
              {profile.experience.map((exp, index) => (
                <div key={exp.id} className={`${index > 0 ? 'pt-6 border-t border-gray-200' : ''}`}>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{exp.title}</h3>
                      <div className="mt-1 flex items-center text-sm text-gray-600">
                        <span>{exp.company}</span>
                        <span className="mx-2">•</span>
                        <span>{exp.location}</span>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0 text-sm text-gray-500">
                      {exp.startDate} — {exp.endDate}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    {exp.description}
                  </p>
                  <div className="mt-3 flex space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Education */}
          <motion.div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-800">Education</h2>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <FiPlus className="-ml-0.5 mr-2 h-4 w-4" />
                Add Education
              </button>
            </div>
            <div className="p-6 space-y-6">
              {profile.education.map((edu, index) => (
                <div key={edu.id} className={`${index > 0 ? 'pt-6 border-t border-gray-200' : ''}`}>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{edu.degree}</h3>
                      <div className="mt-1 flex items-center text-sm text-gray-600">
                        <span>{edu.institution}</span>
                        <span className="mx-2">•</span>
                        <span>{edu.location}</span>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0 text-sm text-gray-500">
                      {edu.startDate} — {edu.endDate}
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <FiSave className="-ml-1 mr-2 h-5 w-5" />
            Save Profile
          </button>
        </div>
      </form>

      {/* Success message */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-md shadow-lg">
          Profile updated successfully!
        </div>
      )}
    </div>
  );
};

export default FreelanceProfile;
