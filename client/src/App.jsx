
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import EmailVerification from './pages/auth/EmailVerification';

// Landing Page
import LandingPage from './pages/landing/LandingPage';

// Dashboard Layout
import DashboardLayout from './components/dashboard/DashboardLayout';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import FreelanceProfile from './pages/dashboard/FreelanceProfile';
import Projects from './pages/dashboard/Projects';

// Proposal Pages
import GenerateProposal from './pages/dashboard/proposals/GenerateProposal';
import AllProposals from './pages/dashboard/proposals/AllProposals';

function App() {
  // Simple auth check - in a real app, this would check JWT or session
  const isAuthenticated = () => {
    // For demo purposes, always return true
    // In production, check localStorage for token or use a proper auth state
    return true;
  };

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<FreelanceProfile />} />
            <Route path="projects" element={<Projects />} />
            <Route path="proposals">
              <Route index element={<Navigate to="/dashboard/proposals/all" replace />} />
              <Route path="generate" element={<GenerateProposal />} />
              <Route path="all" element={<AllProposals />} />
            </Route>
          </Route>
          
          {/* Catch all - 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
