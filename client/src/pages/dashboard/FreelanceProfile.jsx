import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiPlus, FiX } from 'react-icons/fi';
import ProfileImport from '../../components/profile/ProfileImport';
import CoreAPI from '../../api/CoreAPI';

import { useSelector, useDispatch } from 'react-redux';
import { setProfileData, setIsRawSubmitted } from '../../redux/slices/ProfileSlice';

const FreelanceProfile = () => {
  // State to control which view to show (import or form)
  const [showImport, setShowImport] = useState(true);
  const [rawProfileData, setRawProfileData] = useState('');

  const dispatch = useDispatch();
  const { profile_data, is_raw_submitted } = useSelector((state) => state.profile);
  const {user} = useSelector((state) => state.auth);

  console.log(user);
  
  // Sample profile data
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    email: user.email ? user.email : 'Not Set',
   
    rate: 75,
    about: '',
    skills: [],
    experience: [],
    portfolioURI: '', // Separate portfolio URI field

    socialLinks: [
    ]
  });


  // Get Profile Data from API
  useEffect(() => {
    CoreAPI.get_freelancer_profile()
    .then((response) => {
      console.log('Profile fetched successfully:', response);
      
      // Extract data from the response
      const profileData = response.data.freelance_profile;
      const experienceData = response.data.experience || [];
      const projectsData = response.data.projects || [];
      
      // Parse the skills array (handle both string and array formats)
      let skillsArray = [];
      if (profileData.skills) {
        skillsArray = Array.isArray(profileData.skills) 
          ? profileData.skills 
          : typeof profileData.skills === 'string' 
            ? JSON.parse(profileData.skills) 
            : [];
      }
      
      // Parse portfolio URI
      let portfolioURI = '';
      if (profileData.portfolio) {
        portfolioURI = profileData.portfolio;
      }
      
      // Parse social links if they exist
      let socialLinks = [];
      if (profileData.social_links) {
        try {
          const socialData = typeof profileData.social_links === 'string' 
            ? JSON.parse(profileData.social_links) 
            : profileData.social_links;
            
          // Convert to array format expected by the UI
          if (Array.isArray(socialData)) {
            socialLinks = socialData.map(link => ({
              title: link.title || link.platform || '',
              url: link.url || ''
            }));
          }
          console.log('Parsed social links:', socialLinks);
        } catch (e) {
          console.error('Error parsing social links:', e);
        }
      }
      
      // Ensure we have at least 3 empty social link slots
      while (socialLinks.length < 3) {
        socialLinks.push({ title: '', url: '' });
      }
      
      // Format experience data for the UI
      const formattedExperience = experienceData.map(exp => ({
        id: exp.id,
        title: exp.title,
        company: exp.company,
        location: '',  // Add location if your model has it
        startDate: exp.start_date,
        endDate: exp.end_date || 'Present',
        description: ''
      }));
      
      setProfile({
        name: profileData.full_name || '',
        title: profileData.tagline || '',
        email: user.email || 'Not Set',
        rate: profileData.rate || 75,
        about: profileData.about || '',
        skills: skillsArray,
        experience: formattedExperience,
        portfolioURI: portfolioURI,
        socialLinks: socialLinks,
        projects: projectsData
      });
      
      console.log('Formatted profile data:', profile);
    })
    .catch((error) => {
      console.error('Failed to fetch profile:', error);
    });
  }, [user.email]); // Add user.email as dependency





  

  // State for new skill input
  const [newSkill, setNewSkill] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // State for new social link
  const [newSocialLink, setNewSocialLink] = useState({ title: '', url: '' });
  const [showSocialLinkForm, setShowSocialLinkForm] = useState(false);

  // Handle profile update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    
    // Filter valid social links
    const validSocialLinks = profile.socialLinks.filter(link => link.title && link.url).map(link => ({
      title: link.title,
      url: link.url
    }));
    
    console.log('Sending social links to API:', validSocialLinks);
    
    // Prepare data for API
    const profileData = {
      full_name: profile.name,
      tagline: profile.title,
      about: profile.about,
      skills: profile.skills,
      portfolio: profile.portfolioURI, // Use the dedicated portfolioURI field
      social_links: validSocialLinks // Send properly formatted social links
    };
    
    // Call the API to update the profile
    CoreAPI.update_freelancer_profile(profileData)
      .then((response) => {
        console.log('Profile updated successfully:', response);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      })
      .catch((error) => {
        console.error('Failed to update profile:', error);
        // You could add error state handling here
      });
  };
  
  // Handle profile data submission from the import component
  const handleProfileDataSubmit = (textData) => {
    CoreAPI.create_freelancer_profile(textData)
    .then((response) => {
      console.log('Profile created successfully:', response);
      setRawProfileData(textData);
      dispatch(setIsRawSubmitted(true));
      setShowImport(false);
    })
    .catch((error) => {
      console.error('Failed to create profile:', error);
    });
    
  };

  // Add new skill
  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
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

  // Handle toggling social link form
  const handleToggleSocialLinkForm = () => {
    setShowSocialLinkForm(!showSocialLinkForm);
  };
  
  // Handle saving a new social link
  const handleSaveSocialLink = () => {
    if (newSocialLink.title && newSocialLink.url) {
      setProfile(prev => ({
        ...prev,
        socialLinks: [...prev.socialLinks, { ...newSocialLink }]
      }));
      setNewSocialLink({ title: '', url: '' });
      setShowSocialLinkForm(false);
    }
  };

  // Handle social link input changes
  const handleSocialLinkChange = (e) => {
    setNewSocialLink({
      ...newSocialLink,
      [e.target.name]: e.target.value
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
    <>
    {!is_raw_submitted ? (
      <ProfileImport onProfileDataSubmit={handleProfileDataSubmit} />
    ) : (
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
              <div>
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
               
              </div>



              <div>
                <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
                  About Me
                </label>
                <textarea
                  id="about"
                  name="about"
                  rows={10}
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

             
              {/* Portfolio URI */}
              <div>
                <label htmlFor="portfolioURI" className="block text-sm font-medium text-gray-700 mb-1">
                  Portfolio Website
                </label>
                <input
                  type="url"
                  id="portfolioURI"
                  name="portfolioURI"
                  value={profile.portfolioURI}
                  onChange={handleChange}
                  placeholder="https://your-portfolio.com"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Add your main portfolio website or personal site URL
                </p>
              </div>
              
              {/* Social Links */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Social Links
                </label>
                <div className="space-y-3">
                  {profile.socialLinks && profile.socialLinks.filter(link => link.title && link.url).length > 0 ? (
                    profile.socialLinks.map((link, index) => (
                      link.title && link.url ? (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                          <div className="text-sm font-medium text-gray-800">
                            <span className="inline-block bg-emerald-100 text-emerald-800 px-2 py-1 rounded mr-2">
                              {link.title}
                            </span>
                          </div>
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-emerald-600 hover:text-emerald-800 underline"
                          >
                            {link.url.length > 30 ? `${link.url.substring(0, 30)}...` : link.url}
                          </a>
                        </div>
                      ) : null
                    ))
                  ) : (
                    <div className="py-4 text-center text-gray-500 bg-gray-50 rounded-md">
                      <p>No social links added yet</p>
                      <p className="text-sm mt-1">Add links to your social profiles (LinkedIn, GitHub, etc.)</p>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleToggleSocialLinkForm}
                  className="mt-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                  {showSocialLinkForm ? 'Cancel' : 'Add Social Link'}
                </button>
                
                {/* Inline Social Link Form */}
                {showSocialLinkForm && (
                  <div className="mt-3 p-4 border border-gray-200 rounded-md bg-gray-50">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="socialLinkTitle" className="block text-sm font-medium text-gray-700 mb-1">
                          Platform
                        </label>
                        <input
                          type="text"
                          id="socialLinkTitle"
                          name="title"
                          value={newSocialLink.title}
                          onChange={handleSocialLinkChange}
                          placeholder="LinkedIn, GitHub, etc."
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label htmlFor="socialLinkUrl" className="block text-sm font-medium text-gray-700 mb-1">
                          URL
                        </label>
                        <input
                          type="url"
                          id="socialLinkUrl"
                          name="url"
                          value={newSocialLink.url}
                          onChange={handleSocialLinkChange}
                          placeholder="https://..."
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={handleSaveSocialLink}
                        disabled={!newSocialLink.title || !newSocialLink.url}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${!newSocialLink.title || !newSocialLink.url ? 'bg-emerald-300' : 'bg-emerald-600 hover:bg-emerald-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`}
                      >
                        Add Link
                      </button>
                    </div>
                  </div>
                )}
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
              {profile.experience && profile.experience.length > 0 ? (
                profile.experience.map((exp, index) => (
                  <div key={exp.id || index} className={`${index > 0 ? 'pt-6 border-t border-gray-200' : ''}`}>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{exp.title}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-600">
                          <span>{exp.company}</span>
                          {exp.location && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{exp.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 md:mt-0 text-sm text-gray-500">
                        {exp.startDate} — {exp.endDate}
                      </div>
                    </div>
                    {exp.description && (
                      <p className="mt-3 text-sm text-gray-600">
                        {exp.description}
                      </p>
                    )}
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
                ))
              ) : (
                <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-md">
                  <p className="font-medium">No work experience added yet</p>
                  <p className="text-sm mt-1">Add your work history to showcase your professional background</p>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <FiPlus className="-ml-1 mr-2 h-4 w-4" />
                    Add First Experience
                  </button>
                </div>
              )}
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
    )}
    
    {/* Success message is now below */}
    
    {/* Success Message */}
    {showSuccessMessage && (
      <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 shadow-md rounded-md">
        <div className="flex items-center">
          <div className="py-1">
            <svg className="fill-current h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z"/>
            </svg>
          </div>
          <div>
            <p className="font-bold">Profile Updated</p>
            <p className="text-sm">Your profile has been updated successfully.</p>
          </div>
        </div>
      </div>
    )}
    </>
    
  );
};

export default FreelanceProfile;
