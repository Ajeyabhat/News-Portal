import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import RichTextEditor from '../components/RichTextEditor';
import { useAuth } from '../context/AuthContext';
import { FileText, Check, AlertCircle } from 'lucide-react';

const axiosInstance = axios;

const InstitutionDashboard = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    imageUrl: '',
    videoUrl: '',
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
      toast.error('Article title is required');
      return;
    }

    if (title.trim().length < 5) {
      toast.error('Title must be at least 5 characters');
      return;
    }

    if (!summary.trim()) {
      toast.error('Article summary is required');
      return;
    }

    if (summary.trim().length < 20) {
      toast.error('Summary should be at least 20 characters');
      return;
    }

    if (!content.trim() || content === '<p><br></p>') {
      toast.error('Article content cannot be empty');
      return;
    }

    const contentWordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word).length;
    if (contentWordCount < 50) {
      toast.error(`Article content too short (${contentWordCount} words, minimum 50 needed)`);
      return;
    }

    if (!imageUrl.trim()) {
      toast.error('Featured image URL is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim(),
        videoUrl: videoUrl.trim() || undefined,
        contentLanguage,
      };

      const response = await axiosInstance.post('/api/submissions', submissionData);

      toast.success('Article submitted for review!');

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
        toast.error('Only institutions can submit articles');
      } else if (errorCode === 'TITLE_REQUIRED') {
        toast.error(errorMsg);
      } else if (errorCode === 'TITLE_TOO_SHORT') {
        toast.error(errorMsg);
      } else if (errorCode === 'SUMMARY_REQUIRED') {
        toast.error(errorMsg);
      } else if (errorCode === 'SUMMARY_TOO_SHORT') {
        toast.error(errorMsg);
      } else if (errorCode === 'CONTENT_REQUIRED') {
        toast.error(errorMsg);
      } else if (errorCode === 'IMAGE_REQUIRED') {
        toast.error(errorMsg);
      } else if (errorCode === 'SERVER_ERROR') {
        toast.error(errorMsg);
      } else {
        toast.error('Failed to submit article: ' + errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <FileText size={32} className="text-primary-600" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
              Submit Article
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Institution: <strong>{user?.username}</strong>
          </p>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-700 rounded-2xl p-6 mb-8 flex items-start gap-3">
          <AlertCircle size={24} className="text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-1">Submission Process</h3>
            <p className="text-blue-800 dark:text-blue-200">
              Your article will be reviewed by our admin team and published if approved.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-8">
          {/* Title */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 space-y-3">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Article Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={onChange}
              placeholder="Enter article title"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-600 transition-all duration-300"
            />
          </div>

          {/* Summary */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 space-y-3">
            <label htmlFor="summary" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Article Summary *
            </label>
            <textarea
              id="summary"
              name="summary"
              value={summary}
              onChange={onChange}
              placeholder="Brief summary of the article"
              rows="3"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-600 transition-all duration-300 resize-none"
            />
          </div>

          {/* Featured Image URL */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 space-y-3">
            <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Featured Image URL *
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={imageUrl}
              onChange={onChange}
              placeholder="https://example.com/image.jpg"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-600 transition-all duration-300"
            />
            {imageUrl && (
              <div className="mt-4 rounded-lg overflow-hidden shadow-md max-h-64">
                <img src={imageUrl} alt="Preview" className="w-full h-64 object-cover" loading="lazy" decoding="async" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>

          {/* Video URL */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 space-y-3">
            <label htmlFor="videoUrl" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Video URL (Optional)
            </label>
            <input
              type="url"
              id="videoUrl"
              name="videoUrl"
              value={videoUrl}
              onChange={onChange}
              placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-600 transition-all duration-300"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">📹 Add YouTube link or direct video URL (optional)</p>
          </div>

          {/* Language */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 space-y-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Language</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="contentLanguage"
                  value="en"
                  checked={contentLanguage === 'en'}
                  onChange={onChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">English</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="contentLanguage"
                  value="kn"
                  checked={contentLanguage === 'kn'}
                  onChange={onChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">ಕನ್ನಡ</span>
              </label>
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 space-y-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Article Content *
            </label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your article content here..."
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Check size={20} />
            {isSubmitting ? 'Submitting...' : 'Submit for Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InstitutionDashboard;
