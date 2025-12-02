import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Globe, Zap } from 'lucide-react';

const AboutPage = () => {
  const ctaButtonClasses = 'inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-xl border bg-white/95 !text-black border-white/70 backdrop-blur hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-200 dark:bg-slate-900 dark:!text-white dark:border-white/40 dark:hover:bg-slate-800 dark:focus-visible:ring-white/70';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
            About Us
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            Your trusted source for educational news and updates
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 md:p-12 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              This News Portal is designed to provide a centralized, user-friendly platform for all educational news, 
              updates, scholarships, exam alerts, and internship opportunities. We believe that staying informed is 
              crucial for academic and professional success.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What We Offer</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Zap className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-700 dark:text-gray-300"><strong>Breaking News</strong> - Latest updates from educational institutions</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-700 dark:text-gray-300"><strong>Exam Alerts</strong> - Timely notifications about upcoming exams</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-700 dark:text-gray-300"><strong>Scholarships</strong> - Information about available scholarship opportunities</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-700 dark:text-gray-300"><strong>Internships</strong> - Career development opportunities</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Users size={24} className="text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Community-Driven</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Built for students and institutions</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Globe size={24} className="text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Multilingual</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Available in English & Kannada</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl shadow-lg p-8 md:p-12 text-white text-center">
          <Building2 size={40} className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg mb-6">Have questions or feedback? We'd love to hear from you!</p>
          <Link to="/contact" className={ctaButtonClasses}>
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;