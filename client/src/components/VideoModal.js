import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { X, Film } from 'lucide-react';

const VideoModal = ({ isOpen, onClose, onSubmit }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!url.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }
    setIsLoading(true);
    try {
      onSubmit(url);
      setUrl('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUrl('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Film size={24} className="text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add YouTube Video</h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X size={24} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Paste your YouTube URL below. We support these formats:
          </p>
          <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1 bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
            <li>• https://www.youtube.com/watch?v=dQw4w9WgXcQ</li>
            <li>• https://youtu.be/dQw4w9WgXcQ</li>
            <li>• https://www.youtube.com/embed/dQw4w9WgXcQ</li>
          </ul>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            disabled={isLoading}
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(e);
              }
            }}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-600 transition-all duration-300"
          />
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-all duration-300"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex-1 px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 active:scale-95 transition-all duration-300"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Video'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
