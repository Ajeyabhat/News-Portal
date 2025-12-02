import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Home, LogIn } from 'lucide-react';

const VerifyPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 space-y-6 text-center">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center">
              <Mail size={32} className="text-accent-600" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Check Your Email</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              A verification link has been sent to your email address.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Please click the link in that email to verify your account and log in.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 pt-2">
              Didn't receive the email? Check your spam folder or try registering again.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link 
              to="/login" 
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 active:scale-95 transition-all duration-300"
            >
              <LogIn size={18} />
              <span>Go to Login</span>
            </Link>
            <Link 
              to="/" 
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95 transition-all duration-300"
            >
              <Home size={18} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;