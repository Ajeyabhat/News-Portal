import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, LogIn, ArrowLeft } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const hasRunRef = useRef(false);
  const token = useMemo(() => searchParams.get('token'), [searchParams]);

  const verifyEmail = useCallback(async () => {
    setStatus('verifying');
    setMessage('');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token found.');
      return;
    }

    try {
      const url = `http://localhost:5000/api/users/verify-email/${token}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.msg || 'Verification failed. Please request a new link.');
        return;
      }

      setStatus('success');
      setMessage(data.msg || 'Email verified successfully!');

      // Redirect to login after a short delay so the user can read the message.
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setStatus('error');
      setMessage(err.message || 'Network error. Please try again.');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (hasRunRef.current) {
      return;
    }
    hasRunRef.current = true;
    verifyEmail();
  }, [verifyEmail]);

  const handleRetry = () => {
    verifyEmail();
  };

  const statusCopy = {
    verifying: {
      title: 'Verifying your email',
      helper: 'Please wait while we confirm your account details.',
    },
    success: {
      title: 'Email verified!',
      helper: 'You can now log in and start exploring the latest updates.',
    },
    error: {
      title: 'Verification failed',
      helper: 'The link may have expired or already been used. Try again or request a new one.',
    },
  };

  const renderStatusIcon = () => {
    if (status === 'verifying') {
      return (
        <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-slate-800 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary-600 dark:text-primary-400 animate-spin" aria-hidden="true" />
        </div>
      );
    }

    if (status === 'success') {
      return (
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
          <CheckCircle2 size={40} aria-hidden="true" />
        </div>
      );
    }

    return (
      <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
        <XCircle size={40} aria-hidden="true" />
      </div>
    );
  };

  const description = status === 'verifying' ? statusCopy[status].helper : message || statusCopy[status].helper;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-950 dark:to-gray-900 px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-2xl p-8 sm:p-10 text-center space-y-6">
          <div className="flex justify-center">{renderStatusIcon()}</div>

          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {statusCopy[status].title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300" role="status">
              {description}
            </p>
            {status !== 'verifying' && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {statusCopy[status].helper}
              </p>
            )}
          </div>

          {status === 'verifying' && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You will be redirected to the login page once verification finishes.
            </p>
          )}

          {status === 'success' && (
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link 
                to="/login" 
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-300 shadow-lg"
              >
                <LogIn size={18} />
                Go to Login
              </Link>
              <Link 
                to="/" 
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300"
              >
                <ArrowLeft size={18} />
                Back Home
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4 pt-2">
              <button 
                type="button" 
                onClick={handleRetry}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-300 shadow-lg"
              >
                <Loader2 size={18} className="animate-spin" />
                Try Again
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Need a new link?{' '}
                <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                  Register again
                </Link>{' '}
                to receive a fresh verification email.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
