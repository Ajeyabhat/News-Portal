import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ShieldCheck, FileText, ClipboardCheck } from 'lucide-react';

const TermsPage = () => {
  const ctaButtonClasses = 'inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-xl border bg-white/95 !text-black border-white/70 backdrop-blur hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-200 dark:bg-slate-900 dark:!text-white dark:border-white/40 dark:hover:bg-slate-800 dark:focus-visible:ring-white/70';

  const policyPoints = [
    {
      title: 'Acceptance of Terms',
      description: 'By accessing or using our platform, you agree to comply with these terms and any applicable laws.'
    },
    {
      title: 'Use of Content',
      description: 'Content is provided for informational purposes. Republishing or redistribution requires prior written consent.'
    },
    {
      title: 'User Responsibilities',
      description: 'Users must provide accurate information, respect intellectual property, and avoid disruptive behavior.'
    },
    {
      title: 'Service Updates',
      description: 'We may update, suspend, or discontinue features. We will communicate material changes in advance whenever possible.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
            <Scale size={32} className="text-primary-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Clear guidance on using the News Portal platform responsibly
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 space-y-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-primary-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Integrity</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              We protect intellectual property and require respectful use of all published material, whether sourced internally or from partners.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 space-y-3">
            <div className="flex items-center gap-3">
              <FileText className="text-primary-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transparency</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              Any updates to these terms will be posted on this page with an effective date so you can stay informed.
            </p>
          </div>
        </div>

        {/* Terms List */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Key Policies</h2>
          <div className="space-y-4">
            {policyPoints.map(({ title, description }) => (
              <div key={title} className="flex items-start gap-3">
                <ClipboardCheck className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Need clarification?</h2>
          <p className="mb-6">Our support team can walk you through any contractual or compliance questions.</p>
          <Link to="/contact" className={ctaButtonClasses}>
            Contact Legal Team
          </Link>
        </div>

        <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>Last updated: January 2024</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
