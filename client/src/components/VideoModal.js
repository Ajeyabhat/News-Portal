import React, { useState } from 'react';
import toast from 'react-hot-toast';
import './VideoModal.css';

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
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🎬 Add YouTube Video</h2>
          <button className="modal-close" onClick={handleClose} title="Close">×</button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            Paste your YouTube URL below. We support these formats:
          </p>
          <ul className="url-formats">
            <li>https://www.youtube.com/watch?v=dQw4w9WgXcQ</li>
            <li>https://youtu.be/dQw4w9WgXcQ</li>
            <li>https://www.youtube.com/embed/dQw4w9WgXcQ</li>
          </ul>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="modal-input"
            disabled={isLoading}
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(e);
              }
            }}
          />
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="modal-btn modal-btn-cancel"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="modal-btn modal-btn-submit"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Adding...' : '✓ Add Video'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
