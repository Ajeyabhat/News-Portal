import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Error Info:', errorInfo);

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // You could also log to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    // Optionally reload the page
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorCount } = this.state;
      const isDevelopment = import.meta.env.DEV;

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 flex items-center justify-center px-4 py-8">
          <div className="max-w-2xl w-full">
            {/* Error Header */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 space-y-6">
              {/* Error Icon */}
              <div className="flex justify-center">
                <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertCircle size={64} className="text-red-600 dark:text-red-400" />
                </div>
              </div>

              {/* Error Message */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Oops! Something Went Wrong
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  We're sorry, but the app encountered an unexpected error.
                </p>
              </div>

              {/* Error Details (Development Only) */}
              {isDevelopment && error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 space-y-2">
                  <p className="font-semibold text-red-900 dark:text-red-200">
                    Error Details (Development Mode):
                  </p>
                  <p className="text-sm text-red-800 dark:text-red-300 font-mono break-words">
                    {error.toString()}
                  </p>
                  {errorInfo && (
                    <details className="text-sm text-red-800 dark:text-red-300 font-mono">
                      <summary className="cursor-pointer font-semibold mb-2">Stack Trace</summary>
                      <pre className="overflow-auto bg-white dark:bg-slate-900 p-3 rounded text-xs">
                        {errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Production Message */}
              {!isDevelopment && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    Our team has been notified of this issue and we're working on a fix.
                    {errorCount > 1 && ` (This error has occurred ${errorCount} times)`}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={this.handleReset}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <RefreshCw size={20} />
                  Try Again
                </button>
                <Link
                  to="/"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
                >
                  <Home size={20} />
                  Go Home
                </Link>
              </div>

              {/* Help Text */}
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                <p>
                  If the problem persists, please{' '}
                  <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-semibold">
                    contact support
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
