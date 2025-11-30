import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import RichTextEditor from '../components/RichTextEditor';
import { useAuth } from '../context/AuthContext';
import './InstitutionDashboard.css';

// Use the global axios instance with auth header already configured
const axiosInstance = axios;

const InstitutionDashboard = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    imageUrl: '',
    videoUrl: '', // Optional video URL
    contentLanguage: 'en',
  });
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { title, summary, imageUrl, videoUrl, contentLanguage } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error('❌ Article title is required');
      return;
    }

    if (title.trim().length < 5) {
      toast.error('❌ Title must be at least 5 characters');
      return;
    }

    if (!summary.trim()) {
      toast.error('❌ Article summary is required');
      return;
    }

    if (summary.trim().length < 20) {
      toast.error('❌ Summary should be at least 20 characters');
      return;
    }

    if (!content.trim() || content === '<p><br></p>') {
      toast.error('❌ Article content cannot be empty');
      return;
    }

    const contentWordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word).length;
    if (contentWordCount < 50) {
      toast.error(`❌ Article content too short (${contentWordCount} words, minimum 50 needed)`);
      return;
    }

    if (!imageUrl.trim()) {
      toast.error('❌ Featured image URL is required');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create submission for Institution article
      const submissionData = {
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim(),
        videoUrl: videoUrl.trim() || undefined, // Optional
        contentLanguage,
      };

      const response = await axiosInstance.post('/api/submissions', submissionData);

      toast.success('✨ Article submitted for review!');

      // Reset form
      setFormData({
        title: '',
        summary: '',
        imageUrl: '',
        videoUrl: '',
        contentLanguage: 'en',
      });
      setContent('');
    } catch (err) {
      console.error('Submission error:', err);
      const errorCode = err.response?.data?.code;
      const errorMsg = err.response?.data?.message || 'Failed to submit article';

      if (errorCode === 'PERMISSION_DENIED') {
        toast.error('❌ Only institutions can submit articles');
      } else if (errorCode === 'TITLE_REQUIRED') {
        toast.error('❌ ' + errorMsg);
      } else if (errorCode === 'TITLE_TOO_SHORT') {
        toast.error('❌ ' + errorMsg);
      } else if (errorCode === 'SUMMARY_REQUIRED') {
        toast.error('❌ ' + errorMsg);
      } else if (errorCode === 'SUMMARY_TOO_SHORT') {
        toast.error('❌ ' + errorMsg);
      } else if (errorCode === 'CONTENT_REQUIRED') {
        toast.error('❌ ' + errorMsg);
      } else if (errorCode === 'IMAGE_REQUIRED') {
        toast.error('❌ ' + errorMsg);
      } else if (errorCode === 'SERVER_ERROR') {
        toast.error('❌ ' + errorMsg);
      } else {
        toast.error('❌ Failed to submit article: ' + errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="institution-dashboard">
      <div className="dashboard-header">
        <h1>📝 Submit Article for Review</h1>
        <p>Your institution: <strong>{user?.username}</strong></p>
      </div>

      <form onSubmit={onSubmit} className="submission-form">
        <div className="form-group">
          <label>Article Title *</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={onChange}
            placeholder="Enter article title"
            required
          />
        </div>

        <div className="form-group">
          <label>Article Summary *</label>
          <textarea
            name="summary"
            value={summary}
            onChange={onChange}
            placeholder="Brief summary of the article"
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label>Featured Image URL *</label>
          <input
            type="url"
            name="imageUrl"
            value={imageUrl}
            onChange={onChange}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        <div className="form-group">
          <label>Video URL (Optional)</label>
          <input
            type="url"
            name="videoUrl"
            value={videoUrl}
            onChange={onChange}
            placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4"
          />
          <small>📹 Add YouTube link or direct video URL (optional)</small>
        </div>

        <div className="form-group">
          <label>Language</label>
          <div className="language-options">
            <label className="radio-label">
              <input
                type="radio"
                name="contentLanguage"
                value="en"
                checked={contentLanguage === 'en'}
                onChange={onChange}
              />
              English
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="contentLanguage"
                value="kn"
                checked={contentLanguage === 'kn'}
                onChange={onChange}
              />
              ಕನ್ನಡ
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Article Content *</label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Write your article content here..."
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? '⏳ Submitting...' : '✓ Submit for Review'}
        </button>

        <p className="help-text">
          💡 Your article will be reviewed by our admin team and published if approved.
        </p>
      </form>
    </div>
  );
};

export default InstitutionDashboard;
