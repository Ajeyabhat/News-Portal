import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, CheckCircle2, XCircle, LogIn, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('input'); // 'input', 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  // Get email from navigation state
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      setStatus('error');
      setMessage('Email not found. Please register again.');
    }
  }, [location]);

  // Countdown timer
  useEffect(() => {
    if (status === 'input' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && status === 'input') {
      setStatus('error');
      setMessage('OTP expired. Please register again.');
    }
  }, [timeLeft, status]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    setStatus('verifying');
    setMessage('');

    try {
      const baseUrl = axios.defaults.baseURL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/users/verify-email-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode })
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.msg || 'Verification failed');
        return;
      }

      setStatus('success');
      setMessage(data.msg || 'Email verified successfully!');
      toast.success('Email verified! Redirecting to login...');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('❌ Verification error:', err);
      setStatus('error');
      setMessage(err.message || 'Network error. Please try again.');
      toast.error('Verification failed');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderStatusIcon = () => {
    if (status === 'input' || status === 'verifying') {
      return (
        <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-slate-800 flex items-center justify-center">
          <Loader2 className={`w-10 h-10 text-primary-600 dark:text-primary-400 ${status === 'verifying' ? 'animate-spin' : ''}`} aria-hidden="true" />
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-950 dark:to-gray-900 px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-2xl p-8 sm:p-10 text-center space-y-6">
          <div className="flex justify-center">{renderStatusIcon()}</div>

          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {status === 'input' || status === 'verifying' ? 'Verify Your Email' : status === 'success' ? 'Email Verified!' : 'Verification Failed'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {status === 'input' && `Enter the 6-digit code sent to ${email}`}
              {status === 'verifying' && 'Verifying your code...'}
              {status === 'success' && 'Your email has been verified successfully!'}
              {status === 'error' && message}
            </p>
          </div>

          {(status === 'input' || status === 'verifying') && (
            <div className="space-y-4 pt-4">
              {/* OTP Input Fields */}
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    disabled={status === 'verifying'}
                    className="w-12 h-12 text-2xl font-bold text-center rounded-lg border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 transition-all disabled:opacity-50"
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="text-sm">
                <span className={`font-semibold ${timeLeft < 120 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  Time remaining: {formatTime(timeLeft)}
                </span>
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyOtp}
                disabled={status === 'verifying' || otp.join('').length !== 6}
                className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                {status === 'verifying' && <Loader2 size={18} className="animate-spin" />}
                Verify Code
              </button>

              {/* Resend Link */}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Didn't receive the code?{' '}
                <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                  Register again
                </Link>
              </p>
            </div>
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
              <Link 
                to="/register" 
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-300 shadow-lg"
              >
                Register Again
              </Link>
              <Link 
                to="/" 
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300"
              >
                <ArrowLeft size={18} />
                Back Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
