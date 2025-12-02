import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Eye, Shield, CheckCircle } from 'lucide-react';

const PrivacyPage = () => {
  const ctaButtonClasses = 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-xl border bg-white/95 !text-black border-white/70 backdrop-blur hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-200 dark:bg-slate-900 dark:!text-white dark:border-white/40 dark:hover:bg-slate-800 dark:focus-visible:ring-white/70';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
            <Lock size={32} className="text-primary-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Your privacy and data security are our top priorities
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Data Collection */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-4">
            <div className="flex items-start gap-4">
              <Eye size={28} className="text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Data Collection</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We collect minimal personal information necessary for you to use our platform. This includes your name, email address, 
                  and preferences. We do not collect more data than needed to provide our services effectively.
                </p>
              </div>
            </div>
          </div>

          {/* Data Usage */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-4">
            <div className="flex items-start gap-4">
              <Shield size={28} className="text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">How We Use Your Data</h2>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>To provide and maintain our news portal services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>To personalize your experience and show relevant content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>To send you updates about new articles and features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>To improve and optimize our platform</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-4">
            <div className="flex items-start gap-4">
              <Lock size={28} className="text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Data Security</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We implement industry-standard security measures to protect your data. Your passwords are encrypted, 
                  and all communications with our servers are secured using HTTPS. We regularly audit our security 
                  practices to ensure your information remains safe.
                </p>
              </div>
            </div>
          </div>

          {/* No Third-Party Sharing */}
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-4">
              Third-Party Sharing
            </h2>
            <p className="text-green-800 dark:text-green-200 leading-relaxed text-lg">
              ✓ We do NOT share your personal information with any third parties without your explicit consent. 
              Your data remains confidential and is used only to improve your experience on our platform.
            </p>
          </div>

          {/* Your Rights */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Rights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Access Your Data</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">You can request and view all personal data we have about you</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Delete Your Data</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Request complete deletion of your account and data</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Update Information</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Modify your personal information at any time</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Opt-Out</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unsubscribe from marketing communications</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl shadow-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-3">Questions About Our Privacy Policy?</h2>
            <p className="mb-6">Contact us at privacy@newsportal.com for any concerns or inquiries.</p>
            <Link to="/contact" className={ctaButtonClasses}>
              Get in Touch
            </Link>
          </div>

          {/* Last Updated */}
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>Last updated: January 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;