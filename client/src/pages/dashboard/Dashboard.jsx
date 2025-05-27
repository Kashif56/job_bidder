import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiPlus, FiTrendingUp, FiClock, FiAward, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Dashboard = () => {
  // Sample data for dashboard stats
  const stats = [
    { 
      title: 'Credits Remaining', 
      value: '25', 
      icon: <FiFileText className="h-6 w-6 text-emerald-500" />,
      change: '+5 this week',
      positive: true
    },
    { 
      title: 'Proposals Generated', 
      value: '12', 
      icon: <FiTrendingUp className="h-6 w-6 text-emerald-500" />,
      change: '+3 this week',
      positive: true
    },
    { 
      title: 'Success Rate', 
      value: '42%', 
      icon: <FiAward className="h-6 w-6 text-emerald-500" />,
      change: '+5% this month',
      positive: true
    },
    { 
      title: 'Revenue Generated', 
      value: '$4,250', 
      icon: <FiDollarSign className="h-6 w-6 text-emerald-500" />,
      change: '+$750 this month',
      positive: true
    }
  ];

  // Sample data for recent proposals
  const recentProposals = [
    {
      id: 'prop-001',
      title: 'React Developer for E-commerce Project',
      platform: 'Upwork',
      date: '2 days ago',
      status: 'Submitted',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'prop-002',
      title: 'UX/UI Designer for Mobile App',
      platform: 'Freelancer',
      date: '3 days ago',
      status: 'Won',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 'prop-003',
      title: 'WordPress Website Development',
      platform: 'Fiverr',
      date: '5 days ago',
      status: 'Rejected',
      statusColor: 'bg-red-100 text-red-800'
    }
  ];

  // Sample data for job opportunities
  const jobOpportunities = [
    {
      id: 'job-001',
      title: 'Frontend Developer with React Experience',
      budget: '$2,000 - $3,000',
      platform: 'Upwork',
      postedDate: '2 hours ago',
      relevanceScore: 95
    },
    {
      id: 'job-002',
      title: 'Full Stack Developer for SaaS Project',
      budget: '$4,000 - $6,000',
      platform: 'Freelancer',
      postedDate: '5 hours ago',
      relevanceScore: 87
    },
    {
      id: 'job-003',
      title: 'React Native Mobile App Developer',
      budget: '$3,500 - $5,000',
      platform: 'Upwork',
      postedDate: '1 day ago',
      relevanceScore: 82
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome back, User!</h1>
            <p className="mt-1 text-gray-600">Here's what's happening with your proposals today.</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link
              to="/dashboard/proposals/generate"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <FiPlus className="-ml-1 mr-2 h-5 w-5" />
              New Proposal
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg p-6 border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</p>
                <div className="mt-1 flex items-center">
                  <span className={`text-xs font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-emerald-50">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Proposals */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800">Recent Proposals</h2>
            <Link
              to="/dashboard/proposals/all"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentProposals.map((proposal) => (
              <div key={proposal.id} className="px-6 py-4 hover:bg-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/dashboard/proposals/${proposal.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-emerald-600"
                    >
                      {proposal.title}
                    </Link>
                    <div className="mt-1 flex items-center">
                      <span className="text-xs text-gray-500">{proposal.platform}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{proposal.date}</span>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${proposal.statusColor}`}>
                      {proposal.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Link
              to="/dashboard/proposals/generate"
              className="flex items-center justify-center text-sm font-medium text-emerald-600 hover:text-emerald-500"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Generate New Proposal
            </Link>
          </div>
        </div>

        {/* Job Opportunities */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800">Recommended Job Opportunities</h2>
            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
              Refresh
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {jobOpportunities.map((job) => (
              <div key={job.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{job.title}</p>
                    <div className="mt-1 flex items-center">
                      <span className="text-xs text-gray-500">{job.platform}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{job.postedDate}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{job.budget}</p>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-emerald-800">{job.relevanceScore}%</span>
                      </div>
                      <span className="ml-2 text-xs text-gray-500">Match</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex">
                  <button className="text-xs font-medium text-emerald-600 hover:text-emerald-500 mr-4">
                    View Details
                  </button>
                  <Link
                    to={`/dashboard/proposals/generate?job=${job.id}`}
                    className="text-xs font-medium text-emerald-600 hover:text-emerald-500"
                  >
                    Generate Proposal
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button className="flex items-center justify-center text-sm font-medium text-emerald-600 hover:text-emerald-500">
              View More Job Opportunities
            </button>
          </div>
        </div>
      </div>

      {/* Tips & Insights */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Tips & Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h3 className="font-medium text-gray-900">Proposal Writing Tips</h3>
            <p className="mt-1 text-sm text-gray-500">Learn how to create proposals that stand out and win more clients.</p>
            <a href="#" className="mt-2 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-500">
              Read more
            </a>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h3 className="font-medium text-gray-900">Pricing Strategies</h3>
            <p className="mt-1 text-sm text-gray-500">Discover effective pricing strategies to maximize your freelance income.</p>
            <a href="#" className="mt-2 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-500">
              Read more
            </a>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h3 className="font-medium text-gray-900">Client Communication</h3>
            <p className="mt-1 text-sm text-gray-500">Tips for maintaining clear and effective communication with clients.</p>
            <a href="#" className="mt-2 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-500">
              Read more
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
