import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import RichTextEditor from '../components/RichTextEditor';
import { useAuth } from '../context/AuthContext';
import { FileText, Check, AlertCircle, Upload } from 'lucide-react';
import CopyButton from '../components/CopyButton';

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
  const [imageUploading, setImageUploading] = useState(false);
  const [wordUploading, setWordUploading] = useState(false);
  const [showWordUpload, setShowWordUpload] = useState(false);
  const [selectedWordFile, setSelectedWordFile] = useState(null);
  const [submissionMethod, setSubmissionMethod] = useState(null); // 'word' or 'editor'

  const { title, summary, imageUrl, videoUrl, contentLanguage } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    setImageUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await axios.post('/api/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const imageUrl = response.data.imageUrl;
      setFormData({ ...formData, imageUrl });
      toast.success('Image uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const handleWordFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
      toast.error('Please select a .docx or .doc file');
      e.target.value = '';
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Document size must be less than 5MB');
      e.target.value = '';
      return;
    }

    // Store file for confirmation
    setSelectedWordFile(file);
  };

  const handleWordUploadConfirm = async () => {
    if (!selectedWordFile) return;

    setWordUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('document', selectedWordFile);

      await axios.post('/api/submissions/word', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('✅ Word document submitted! Admin will review and publish it.');
      setShowWordUpload(false);
      setSelectedWordFile(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"][accept=".docx,.doc"]');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Word upload error:', err);
      toast.error(err.response?.data?.error || 'Failed to submit Word document');
    } finally {
      setWordUploading(false);
    }
  };

  const handleWordUploadCancel = () => {
    setSelectedWordFile(null);
    const fileInput = document.querySelector('input[type="file"][accept=".docx,.doc"]');
    if (fileInput) fileInput.value = '';
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
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-1">ℹ️ Choose Your Submission Method</h3>
            <p className="text-blue-800 dark:text-blue-200">
              Pick one option below: upload a Word document OR fill in the article form directly. Your article will be reviewed by our admin team and published if approved.
            </p>
          </div>
        </div>

        {/* Submission Method Selection */}
        {!submissionMethod && (
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Option 1: Word Upload */}
            <div 
              onClick={() => setSubmissionMethod('word')}
              className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 border-3 border-green-300 dark:border-green-600 rounded-2xl p-8 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="text-5xl mb-4">📄</div>
              <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">Upload Word Document</h3>
              <p className="text-green-800 dark:text-green-200 mb-4">
                Already have your article in a Word file? Simply upload it and our admin team will handle the review and publishing.
              </p>
              <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <p>✓ .docx or .doc format</p>
                <p>✓ Admin reviews & edits</p>
                <p>✓ Quick submission</p>
              </div>
            </div>

            {/* Option 2: Editor */}
            <div 
              onClick={() => setSubmissionMethod('editor')}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-3 border-blue-300 dark:border-blue-600 rounded-2xl p-8 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="text-5xl mb-4">✍️</div>
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">Fill Article Form</h3>
              <p className="text-blue-800 dark:text-blue-200 mb-4">
                Use our online editor to create and format your article directly. You have full control over the content.
              </p>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <p>✓ Rich text editor</p>
                <p>✓ Add images & videos</p>
                <p>✓ Full formatting control</p>
              </div>
            </div>
          </div>
        )}

        {/* Word Upload Path */}
        {submissionMethod === 'word' && (
          <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-2 border-green-300 dark:border-green-700 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div>
                <h3 className="font-bold text-green-900 dark:text-green-100 text-xl mb-1">📄 Upload Your Word Document</h3>
                <p className="text-green-800 dark:text-green-200">
                  Select your .docx or .doc file to submit
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubmissionMethod(null);
                  setSelectedWordFile(null);
                  const fileInput = document.querySelector('input[type="file"][accept=".docx,.doc"]');
                  if (fileInput) fileInput.value = '';
                }}
                className="px-6 py-2 bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-bold rounded-lg transition-all whitespace-nowrap"
              >
                ← Back
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <input
                  type="file"
                  accept=".docx,.doc"
                  onChange={handleWordFileSelect}
                  disabled={wordUploading}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-600 file:text-white
                    hover:file:bg-green-700
                    disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </label>

              {/* File preview and confirmation */}
              {selectedWordFile && (
                <div className="bg-white dark:bg-slate-700 border-2 border-green-400 dark:border-green-600 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">📋 Selected File:</p>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded p-3 mb-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-green-100">{selectedWordFile.name}</p>
                    <p className="text-xs text-gray-600 dark:text-green-200">
                      Size: {(selectedWordFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleWordUploadConfirm}
                      disabled={wordUploading}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-lg transition-all active:scale-95"
                    >
                      {wordUploading ? '⏳ Uploading...' : '✓ Confirm Upload'}
                    </button>
                    <button
                      type="button"
                      onClick={handleWordUploadCancel}
                      disabled={wordUploading}
                      className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-slate-600 dark:hover:bg-slate-500 disabled:opacity-50 text-gray-900 dark:text-white font-bold rounded-lg transition-all active:scale-95"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                </div>
              )}

              {!selectedWordFile && (
                <p className="text-xs text-green-700 dark:text-green-300">
                  Max file size: 5 MB • Supported formats: .docx, .doc
                </p>
              )}
            </div>
          </div>
        )}

        {/* Editor Path */}
        {submissionMethod === 'editor' && (
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button
                type="button"
                onClick={() => setSubmissionMethod(null)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-bold rounded-lg transition-all"
              >
                ← Back
              </button>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">✍️ Fill Article Form</h3>
            </div>
          </div>
        )}

        {/* Form - Only show when editor method is selected */}
        {submissionMethod === 'editor' && (
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
            <div className="flex gap-3">
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={imageUrl}
                onChange={onChange}
                placeholder="https://example.com/image.jpg"
                required
                className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-600 transition-all duration-300"
              />
              <label className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold cursor-pointer transition-all duration-300 active:scale-95">
                <Upload size={18} />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={imageUploading}
                  className="hidden"
                />
              </label>
            </div>
            {imageUrl && (
              <div className="mt-4 rounded-lg overflow-hidden shadow-md max-h-64 flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3">
                <img src={imageUrl} alt="Featured" className="h-full max-h-64 object-cover rounded" />
                <CopyButton text={imageUrl} />
              </div>
            )}
          </div>

          {/* Video URL */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 space-y-3">
            <label htmlFor="videoUrl" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Video URL (Optional - Google Drive)
            </label>
            <input
              type="url"
              id="videoUrl"
              name="videoUrl"
              value={videoUrl}
              onChange={onChange}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-600 transition-all duration-300"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">📹 Paste Google Drive shareable link (optional)</p>
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
        )}
      </div>
    </div>
  );
};

export default InstitutionDashboard;
