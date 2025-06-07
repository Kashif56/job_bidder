import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiPlus, FiX, FiTrash, FiEdit, FiBriefcase, FiCalendar } from 'react-icons/fi';
import CoreAPI from '../../api/CoreAPI';

const WorkExperience = ({ experiences = [], onExperienceChange }) => {
  // Initialize with empty array if experiences is undefined
  const safeExperiences = Array.isArray(experiences) ? experiences : [];
  
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [currentExperience, setCurrentExperience] = useState({
    id: null,
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    isCurrentPosition: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Debug logging
  useEffect(() => {
    console.log('WorkExperience component rendered with:', { 
      experiences: safeExperiences, 
      isAddingExperience, 
      isEditingExperience 
    });
  }, [safeExperiences, isAddingExperience, isEditingExperience]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentExperience(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // If "current position" is checked, clear the end date
      ...(name === 'isCurrentPosition' && checked ? { endDate: '' } : {})
    }));
  };

  const resetForm = () => {
    setCurrentExperience({
      id: null,
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      isCurrentPosition: false
    });
    setError('');
    // Don't reset the form visibility states here
    // This was causing the form to disappear immediately
  };

  const validateForm = () => {
    if (!currentExperience.title.trim()) {
      setError('Job title is required');
      return false;
    }
    if (!currentExperience.company.trim()) {
      setError('Company name is required');
      return false;
    }
    if (!currentExperience.startDate) {
      setError('Start date is required');
      return false;
    }
    if (!currentExperience.isCurrentPosition && !currentExperience.endDate) {
      setError('End date is required unless this is your current position');
      return false;
    }
    return true;
  };

  const handleAddExperience = () => {
    console.log('Add Experience button clicked');
    // First reset the form to clear any previous data
    setCurrentExperience({
      id: null,
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      isCurrentPosition: false
    });
    setError('');
    
    // Then set the visibility state
    setIsAddingExperience(true);
    setIsEditingExperience(false);
  };

  const handleEditExperience = (exp) => {
    setCurrentExperience({
      id: exp.id,
      title: exp.title,
      company: exp.company,
      location: exp.location || '',
      startDate: exp.startDate,
      endDate: exp.endDate === 'Present' ? '' : exp.endDate,
      description: exp.description || '',
      isCurrentPosition: exp.endDate === 'Present'
    });
    setIsEditingExperience(true);
    setIsAddingExperience(false);
    setError('');
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const experienceData = {
        ...currentExperience,
        endDate: currentExperience.isCurrentPosition ? null : currentExperience.endDate
      };
      
      let updatedExperiences;
      
      if (isEditingExperience) {
        // Update existing experience
        // This will be handled by the parent component through onExperienceChange
        updatedExperiences = experiences.map(exp => 
          exp.id === currentExperience.id ? experienceData : exp
        );

        await CoreAPI.update_experience(currentExperience.id, experienceData);

      
        
      } else {
        
        await CoreAPI.create_experience(experienceData);
      }
      
      // Call the parent component's handler to update the state
      onExperienceChange(updatedExperiences);
      resetForm();
      
    } catch (error) {
      console.error('Error saving experience:', error);
      setError('Failed to save experience. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExperience = (expId) => {
    // Filter out the experience to be deleted
    const updatedExperiences = experiences.filter(exp => exp.id !== expId);
    // Call the parent component's handler to update the state
    onExperienceChange(updatedExperiences);
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
            <h2 className="text-xl font-bold text-gray-800">Work Experience</h2>
            <p className="mt-1 text-gray-600">
              Add your professional work history
            </p>
          </div>
          {!isAddingExperience && !isEditingExperience && (
            <button
              type="button"
              onClick={handleAddExperience}
              className="mt-3 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <FiPlus className="-ml-1 mr-2 h-4 w-4" />
              Add Experience
            </button>
          )}
        </div>
      </div>
      
      {/* Debug info */}
      {/* <div className="bg-yellow-100 p-2 text-xs">
        isAddingExperience: {isAddingExperience ? 'true' : 'false'}, 
        isEditingExperience: {isEditingExperience ? 'true' : 'false'}
      </div> */}

      {/* Experience Form */}
      {(isAddingExperience || isEditingExperience) && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">
              {isEditingExperience ? 'Edit Experience' : 'Add New Experience'}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-500"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6">
            <form>
              {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiX className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={currentExperience.title}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm"
                    placeholder="e.g., Senior Developer"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company*
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={currentExperience.company}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm"
                    placeholder="e.g., Acme Inc."
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={currentExperience.location}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm"
                    placeholder="e.g., New York, NY"
                  />
                </div>
                
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date*
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={currentExperience.startDate}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm"
                    required
                  />
                </div>
                
                <div className="flex items-center mt-1">
                  <input
                    id="isCurrentPosition"
                    name="isCurrentPosition"
                    type="checkbox"
                    checked={currentExperience.isCurrentPosition}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isCurrentPosition" className="ml-2 block text-sm text-gray-700">
                    I currently work here
                  </label>
                </div>
                
                {!currentExperience.isCurrentPosition && (
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date*
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={currentExperience.endDate}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm"
                      required={!currentExperience.isCurrentPosition}
                      disabled={currentExperience.isCurrentPosition}
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={currentExperience.description}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm"
                  placeholder="Describe your responsibilities and achievements..."
                />
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    // Close the form when cancel is clicked
                    setIsAddingExperience(false);
                    setIsEditingExperience(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                  }`}
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <FiSave className="mr-2 h-4 w-4" />
                      {isEditingExperience ? 'Update Experience' : 'Add Experience'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Experience List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">Experience History</h3>
          {!isAddingExperience && !isEditingExperience && safeExperiences.length > 0 && (
            <button
              type="button"
              onClick={handleAddExperience}
              className="inline-flex items-center px-3 py-0 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <FiPlus className="-ml-1 mr-2 h-4 w-4" />
              Add Experience
            </button>
          )}
        </div>
        <div className="divide-y divide-gray-200">
          {safeExperiences.length > 0 ? (
            safeExperiences.map((exp) => (
              <div key={exp.id} className="p-6">
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{exp.title}</h4>
                    <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <FiBriefcase className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                        {exp.company}
                      </div>
                      {exp.location && (
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          {exp.location}
                        </div>
                      )}
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <FiCalendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEditExperience(exp)}
                      className="inline-flex items-center px-3 py-0 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                      <FiEdit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="inline-flex items-center px-3 py-0 border border-gray-300 rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <FiTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {exp.description && (
                  <p className="mt-3 text-sm text-gray-600">{exp.description}</p>
                )}
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-500 bg-gray-50">
              <div className="flex justify-center mb-4">
                <FiBriefcase className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-lg font-medium">No work experience added yet</p>
              <p className="text-sm mt-1 mb-6">Add your work history to showcase your professional background</p>
              <button
                type="button"
                onClick={handleAddExperience}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <FiPlus className="-ml-1 mr-2 h-4 w-4" />
                Add First Experience
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WorkExperience;
