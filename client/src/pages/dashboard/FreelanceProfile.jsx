import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiPlus, FiX } from 'react-icons/fi';
import ProfileImport from '../../components/profile/ProfileImport';
import WorkExperience from '../../components/profile/WorkExperience';
import CoreAPI from '../../api/CoreAPI';

import { useSelector, useDispatch } from 'react-redux';
import { setProfileData, setExperiencesData, setIsRawSubmitted } from '../../redux/slices/ProfileSlice';

const FreelanceProfile = () => {
  // State to control which view to show (import or form)
  const [showImport, setShowImport] = useState(true);
  const [rawProfileData, setRawProfileData] = useState('');

  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);

  const [profile, setProfile] = useState({
    name: '',
    title: '',
    email: user.email ? user.email : '',
   
    rate: 75,
    about: '',
    skills: [],
    experience: [], // Initialize as empty array
    portfolioURI: '', // Separate portfolio URI field

    socialLinks: [
    ]
  });


  // Get profile and experiences data from Redux store
  const { profile_data, experiences_data, last_updated, is_raw_submitted } = useSelector((state) => state.profile);
  
  // Get Profile Data from API or Redux store
  useEffect(() => {
    const shouldFetchData = !profile_data || !last_updated;
    
    // Only fetch from API if we don't have data in Redux or it's been more than 1 hour
    if (shouldFetchData) {
      CoreAPI.get_freelancer_profile()
      .then((response) => {
        console.log('Profile fetched successfully from API:', response);
        
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
          location: exp.location || '',
          startDate: exp.start_date,
          endDate: exp.end_date || 'Present',
          description: exp.description || ''
        }));
        
        // Save profile data to Redux
        dispatch(setProfileData(profileData));
        
        // Save experiences data to Redux
        dispatch(setExperiencesData(formattedExperience));
        
        // Update local state
        setProfile({
          name: profileData.full_name || '',
          title: profileData.tagline || '',
          email: user.email || profileData.user.email || '',
          rate: profileData.rate || 75,
          about: profileData.about || '',
          skills: skillsArray,
          experience: formattedExperience,
          portfolioURI: portfolioURI,
          socialLinks: socialLinks,
          projects: projectsData
        });
      })
      .catch((error) => {
        console.error('Failed to fetch profile:', error);
      });
    } else {
      console.log('Using cached profile data from Redux');
      
      // Parse the skills array (handle both string and array formats)
      let skillsArray = [];
      if (profile_data.skills) {
        skillsArray = Array.isArray(profile_data.skills) 
          ? profile_data.skills 
          : typeof profile_data.skills === 'string' 
            ? JSON.parse(profile_data.skills) 
            : [];
      }
      
      // Parse social links if they exist
      let socialLinks = [];
      if (profile_data.social_links) {
        try {
          const socialData = typeof profile_data.social_links === 'string' 
            ? JSON.parse(profile_data.social_links) 
            : profile_data.social_links;
            
          // Convert to array format expected by the UI
          if (Array.isArray(socialData)) {
            socialLinks = socialData.map(link => ({
              title: link.title || link.platform || '',
              url: link.url || ''
            }));
          }
        } catch (e) {
          console.error('Error parsing social links:', e);
        }
      }
      
      // Ensure we have at least 3 empty social link slots
      while (socialLinks.length < 3) {
        socialLinks.push({ title: '', url: '' });
      }
      
      // Use data from Redux store
      setProfile({
        name: profile_data.full_name || '',
        title: profile_data.tagline || '',
        email: user.email || (profile_data.user ? profile_data.user.email : ''),
        rate: profile_data.rate || 75,
        about: profile_data.about || '',
        skills: skillsArray,
        experience: experiences_data || [],
        portfolioURI: profile_data.portfolio || '',
        socialLinks: socialLinks,
        projects: profile_data.projects || []
      });
    }
  }, [dispatch, user.email]); // Add dispatch and user.email as dependencies





  

  // State for new skill input
  const [newSkill, setNewSkill] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // State for new social link
  const [newSocialLink, setNewSocialLink] = useState({ title: '', url: '' });
  const [showSocialLinkForm, setShowSocialLinkForm] = useState(false);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      // Filter valid social links
      const validSocialLinks = profile.socialLinks.filter(link => link.title && link.url).map(link => ({
        title: link.title,
        url: link.url
      }));
      
      // Format the data for the API
      const profileData = {
        full_name: profile.name,
        email: profile.email,
        tagline: profile.title,
        about: profile.about,
        skills: profile.skills,
        portfolio: profile.portfolioURI,
        social_links: profile.socialLinks.filter(link => link.title && link.url)
      };
      
      // Call the API to update the profile
      const response = await CoreAPI.update_freelancer_profile(profileData);
      console.log('Profile updated successfully:', response);
      
      // The response structure from the API is:
      // {
      //   status: "success",
      //   message: "Freelancer profile updated successfully",
      //   data: { /* profile data */ }
      // }
      
      if (response && response.status === 'success' && response.data) {
        // Dispatch the profile data to Redux
        dispatch(setProfileData(response.data));
        
        // Show success message
        setShowSuccessMessage(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      } else {
        console.error('Unexpected API response structure:', response);
      }
      
      // Success message is handled in the API response block
      
    } catch (error) {
      console.error('Failed to update profile:', error);
      // TODO: Show error message
    }
  };
  
  // Handle experience updates (create, update, delete)
  const handleExperienceUpdates = async () => {
    try {
      // Get the current experiences from the API
      const response = await CoreAPI.get_experiences();
      const serverExperiences = response.data || [];
      
      // Find experiences to create, update, or delete
      const localExperiences = [...profile.experience];
      
      // Experiences to create (those with temporary IDs or not on the server)
      const experiencesToCreate = localExperiences.filter(exp => 
        exp.id.toString().includes('temp_') || 
        !serverExperiences.some(sExp => sExp.id === exp.id)
      );
      
      // Experiences to update (those that exist on both client and server)
      const experiencesToUpdate = localExperiences.filter(exp => 
        !exp.id.toString().includes('temp_') && 
        serverExperiences.some(sExp => sExp.id === exp.id)
      );
      
      // Experiences to delete (those on the server but not in local state)
      const experiencesToDelete = serverExperiences.filter(sExp => 
        !localExperiences.some(exp => exp.id === sExp.id)
      );
      
      // Process creates
      for (const exp of experiencesToCreate) {
        const expData = {
          title: exp.title,
          company: exp.company,
          start_date: exp.startDate,
          end_date: exp.endDate === 'Present' ? null : exp.endDate,
          description: exp.description || ''
        };
        await CoreAPI.create_experience(expData);
      }
      
      // Process updates
      for (const exp of experiencesToUpdate) {
        const expData = {
          title: exp.title,
          company: exp.company,
          start_date: exp.startDate,
          end_date: exp.endDate === 'Present' ? null : exp.endDate,
          description: exp.description || ''
        };
        await CoreAPI.update_experience(exp.id, expData);
      }
      
      // Process deletes
      for (const exp of experiencesToDelete) {
        await CoreAPI.delete_experience(exp.id);
      }
      
      // Refresh experiences after all operations
      const updatedResponse = await CoreAPI.get_experiences();
      const updatedExperiences = updatedResponse.data || [];
      
      // Format and update local state
      const formattedExperiences = updatedExperiences.map(exp => ({
        id: exp.id,
        title: exp.title,
        company: exp.company,
        location: exp.location || '',
        startDate: exp.start_date,
        endDate: exp.end_date || 'Present',
        description: exp.description || ''
      }));
      
      // Update Redux store with the new experiences data
      dispatch(setExperiencesData(formattedExperiences));
      
      // Update local state
      setProfile(prev => ({
        ...prev,
        experience: formattedExperiences
      }));
      
    } catch (error) {
      console.error('Failed to update experiences:', error);
    }
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
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };
  
  // Handle experience change
  const handleExperienceChange = (updatedExperiences) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      experience: updatedExperiences
    }));
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

      {/* Work Experience Section */}
      <WorkExperience 
            experiences={profile.experience} 
            onExperienceChange={handleExperienceChange} 
          />

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
