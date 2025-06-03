
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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


// Redux
import { useSelector } from 'react-redux';

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);



  return (
    <Router>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />
          <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
          <Route path="/reset-password" element={isAuthenticated ? <Navigate to="/dashboard" /> : <ResetPassword />} />
          <Route path="/verify-email" element={isAuthenticated ? <Navigate to="/dashboard" /> : <EmailVerification />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
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
          <Route path="*" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
