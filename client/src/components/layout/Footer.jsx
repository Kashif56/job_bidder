import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTwitter, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
      className="bg-gray-50 border-t border-gray-200"
    >
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-emerald-600 flex items-center">
                <span className="text-3xl mr-1">✍️</span>
                Proposly
              </span>
            </Link>
            <p className="text-gray-600 mb-4">
              AI-powered proposals that win more clients. Save time and land more freelance work.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-emerald-600"
              >
                <FiTwitter className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-emerald-600"
              >
                <FiGithub className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-emerald-600"
              >
                <FiLinkedin className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Product Column */}
          <motion.div variants={itemVariants} className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/features" className="text-gray-600 hover:text-emerald-600">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-600 hover:text-emerald-600">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-emerald-600">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-emerald-600">
                  FAQ
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Company Column */}
          <motion.div variants={itemVariants} className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-emerald-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-emerald-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-emerald-600">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-emerald-600">
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Legal Column */}
          <motion.div variants={itemVariants} className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-emerald-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-emerald-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-600 hover:text-emerald-600">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:support@proposly.com" 
                  className="text-gray-600 hover:text-emerald-600 flex items-center"
                >
                  <FiMail className="mr-2 h-4 w-4" />
                  Contact Support
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div 
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm"
        >
          <p>© {currentYear} Proposly. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
