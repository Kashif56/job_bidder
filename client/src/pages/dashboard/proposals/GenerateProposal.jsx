import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import ProposalAPI from "../../../api/ProposalAPI";
import { FiCheck, FiRefreshCw, FiChevronRight, FiLoader } from "react-icons/fi";
import { addProposal } from "../../../redux/slices/ProposalSlice";

const GenerateProposal = () => {
  const dispatch = useDispatch();
  const [jobDescription, setJobDescription] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  // State for each step result
  const [matchAnalysis, setMatchAnalysis] = useState(null);
  const [painPoints, setPainPoints] = useState(null);
  const [generatedProposal, setGeneratedProposal] = useState(null);
  const [humanizedProposal, setHumanizedProposal] = useState(null);
  
  // Refs for scrolling
  const resultsRef = useRef(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: { 
      repeat: Infinity, 
      duration: 1.5 
    }
  };

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetForm = () => {
    setCurrentStep(0);
    setMatchAnalysis(null);
    setPainPoints(null);
    setGeneratedProposal(null);
    setHumanizedProposal(null);
    setError(null);
  };

  // Step 1: Analyze job match
  const handleAnalyzeMatch = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description first");
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    try {
      const response = await ProposalAPI.analyze_job_match(jobDescription);
      console.log("Job match analysis response:", response); // Debug log
      
      // Extract data from the nested 'analysis' object in the response
      if (response && response.status === "success" && response.analysis) {
        const analysisData = response.analysis;
        
        // Set match analysis with proper data structure, mapping API fields to our component's expected fields
        setMatchAnalysis({
          match_percentage: analysisData.match_score || 0,
          strengths: analysisData.strengths || [],
          improvement_areas: analysisData.gaps || [],
          recommendation: analysisData.recommendation || "",
          strategy: analysisData.strategy || ""
        });
        
        setCurrentStep(1);
        scrollToResults();
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (err) {
      console.error("Match analysis error:", err);
      setError(err.message || "Failed to analyze job match");
    } finally {
      setProcessing(false);
    }
  };

  // Step 2-4: Continue with automated steps
  const handleContinue = async () => {
    setProcessing(true);
    setError(null);
    
    try {
      // Step 2: Analyze pain points
      setCurrentStep(2);
      const painPointsResponse = await ProposalAPI.analyze_pain_points(jobDescription);
      console.log("Pain points response:", painPointsResponse);
      
      // Properly structure pain points data
      const painPointsData = {
        pain_points: painPointsResponse.analysis.pain_points || []
      };
      setPainPoints(painPointsData);
      scrollToResults();
      
      // Step 3: Generate proposal
      setCurrentStep(3);
      // Ensure we have an array of pain points to send
      const painPointsArray = painPointsData.pain_points;
      console.log("Sending pain points to proposal generation:", painPointsArray);
      
      const proposalResult = await ProposalAPI.generate_targeted_proposal(
        jobDescription, 
        painPointsArray,
        matchAnalysis.strategy
      );
      console.log("Proposal generation response:", proposalResult);
      setGeneratedProposal(proposalResult);
      scrollToResults();
      
      // Step 4: Humanize proposal
      setCurrentStep(4);
      const humanizedResult = await ProposalAPI.humanize_proposal(
        proposalResult.proposal,
        jobDescription
      );
      console.log("Humanized proposal response:", humanizedResult);
      setHumanizedProposal(humanizedResult);
      
      // Create a new proposal object to add to Redux store
      const newProposal = {
        id: humanizedResult.proposal_id,
        job_description: jobDescription,
        proposal_text: proposalResult.proposal,
        humanized_text: humanizedResult.proposal,
        created_at: new Date().toISOString(),
        match_score: matchAnalysis?.match_score || 0
      };
      
      // Update Redux store with the new proposal
      dispatch(addProposal(newProposal));
      console.log("Added proposal to Redux store:", newProposal);
      
      scrollToResults();
      
    } catch (err) {
      console.error("Proposal generation error:", err);
      setError(err.message || "An error occurred during proposal generation");
    } finally {
      setProcessing(false);
    }
  };

  // Render the magic animation for the current processing step
  const renderMagicAnimation = () => {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center"
          animate={pulseAnimation}
        >
          <FiLoader className="text-white text-2xl animate-spin" />
        </motion.div>
        <motion.p 
          className="mt-4 text-lg text-gray-700 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.3 } }}
        >
          {currentStep === 1 ? "Analyzing job match..." :
           currentStep === 2 ? "Identifying pain points..." :
           currentStep === 3 ? "Crafting your proposal..." :
           "Adding human touch to your proposal..."}
        </motion.p>
      </motion.div>
    );
  };

  // Render the match analysis result
  const renderMatchAnalysis = () => {
    if (!matchAnalysis) return null;
    
    return (
      <motion.div 
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
        variants={itemVariants}
      >
        <h3 className="text-xl font-semibold mb-3 text-gray-800">Job Match Analysis</h3>
        <div className="flex items-center mb-4">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <motion.div 
              className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${matchAnalysis.match_percentage || 0}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <span className="ml-4 font-bold">{matchAnalysis.match_percentage || 0}%</span>
        </div>
        
        {matchAnalysis.recommendation && (
          <motion.div 
            className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-medium text-blue-800 mb-1">Recommendation:</h4>
            <p className="text-blue-700">{matchAnalysis.recommendation}</p>
          </motion.div>
        )}
        
        <div className="mt-4">
          <h4 className="font-medium text-gray-700 mb-2">Key Strengths:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {matchAnalysis.strengths?.map((strength, idx) => (
              <motion.li 
                key={idx} 
                className="text-gray-600"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                {strength}
              </motion.li>
            ))}
          </ul>
        </div>
        
        {matchAnalysis.improvement_areas?.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">Areas for Improvement:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {matchAnalysis.improvement_areas.map((area, idx) => (
                <motion.li 
                  key={idx} 
                  className="text-gray-600"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                >
                  {area}
                </motion.li>
              ))}
            </ul>
          </div>
        )}
        
        {matchAnalysis.strategy && (
          <motion.div 
            className="mt-6 p-3 bg-green-50 rounded-md border border-green-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="font-medium text-green-800 mb-1">Strategy:</h4>
            <p className="text-green-700">{matchAnalysis.strategy}</p>
          </motion.div>
        )}
        
        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleContinue}
            disabled={processing}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            Continue <FiChevronRight className="ml-2" />
          </button>
          
          <button
            onClick={resetForm}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset <FiRefreshCw className="ml-2 inline" />
          </button>
        </div>
      </motion.div>
    );
  };

  // Render pain points
  const renderPainPoints = () => {
    if (!painPoints) return null;
    
    return (
      <motion.div 
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
        variants={itemVariants}
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Identified Pain Points</h3>
        <ul className="space-y-3">
          {painPoints.pain_points?.map((point, idx) => (
            <motion.li 
              key={idx}
              className="p-3 bg-indigo-50 rounded-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
            >
              <div className="flex">
                <span className="text-indigo-600 mr-2">•</span>
                <span className="text-gray-700">{point}</span>
              </div>
            </motion.li>
          ))}
        </ul>
        <div className="mt-4 text-sm text-gray-500 italic">
          Addressing these pain points in your proposal will significantly increase your chances of winning this job.
        </div>
      </motion.div>
    );
  };

  // Render generated proposal
  const renderGeneratedProposal = () => {
    if (!generatedProposal) return null;
    
    return (
      <motion.div 
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
        variants={itemVariants}
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Generated Proposal</h3>
        <div className="prose prose-indigo max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-md border border-gray-200">
            {generatedProposal.proposal}
          </div>
        </div>
      </motion.div>
    );
  };

  // Render humanized proposal
  const renderHumanizedProposal = () => {
    if (!humanizedProposal) return null;
    
    return (
      <motion.div 
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
        variants={itemVariants}
      >
        <div className="flex items-center mb-4">
          <div className="bg-green-100 p-2 rounded-full">
            <FiCheck className="text-green-600 text-xl" />
          </div>
          <h3 className="text-xl font-semibold ml-3 text-gray-800">Final Humanized Proposal</h3>
        </div>
        
        <div className="prose prose-indigo max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-md border border-gray-200">
            {humanizedProposal.proposal}
          </div>
        </div>
        
        <div className="mt-6 flex justify-between">
          <button
            onClick={resetForm}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            New Proposal <FiRefreshCw className="ml-2 inline" />
          </button>
          
          <button
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Save Proposal <FiCheck className="ml-2" />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Generate Proposal</h1>
      <p className="text-gray-600 mb-8">
        Enter the job description to generate a targeted proposal that wins you clients
      </p>
      
      {/* Job description input */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <label className="block text-gray-700 font-medium mb-2">
          Job Description
        </label>
        <textarea
          className="w-full h-40 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={processing || currentStep > 0}
        />
        
        {error && (
          <div className="mt-2 text-red-600">{error}</div>
        )}
        
        <div className="mt-4">
          <button
            onClick={handleAnalyzeMatch}
            disabled={processing || !jobDescription.trim() || currentStep > 0}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {processing && currentStep === 0 ? (
              <>Analyzing... <FiLoader className="ml-2 animate-spin inline" /></>
            ) : (
              "Check Match Analysis"
            )}
          </button>
        </div>
      </div>
      
      {/* Results section */}
      <div ref={resultsRef}>
        <AnimatePresence>
          {processing && (
            renderMagicAnimation()
          )}
        </AnimatePresence>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Step 1: Match Analysis */}
          {currentStep >= 1 && !processing && renderMatchAnalysis()}
          
          {/* Step 2: Pain Points */}
          {currentStep >= 2 && !processing && renderPainPoints()}
          
          {/* Step 3: Generated Proposal */}
          {currentStep >= 3 && !processing && renderGeneratedProposal()}
          
          {/* Step 4: Humanized Proposal */}
          {currentStep >= 4 && !processing && renderHumanizedProposal()}
        </motion.div>
      </div>
    </div>
  );
};

export default GenerateProposal;
