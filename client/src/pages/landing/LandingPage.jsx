import { motion } from 'framer-motion';
import BaseLayout from '../../components/layout/BaseLayout';
import Hero from '../../components/landing/Hero';
import HowItWorks from '../../components/landing/HowItWorks';
import Features from '../../components/landing/Features';
import Testimonials from '../../components/landing/Testimonials';
import PricingPlans from '../../components/landing/PricingPlans';
import FAQ from '../../components/landing/FAQ';

const LandingPage = () => {
  return (
    <BaseLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Hero />
        <HowItWorks />
        <Features />
        <Testimonials />
        <PricingPlans />
        <FAQ />
      </motion.div>
    </BaseLayout>
  );
};

export default LandingPage;
