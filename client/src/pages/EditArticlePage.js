import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import RichTextEditor from '../components/RichTextEditor';
import { calculateReadingTime } from '../utils/helpers';
import CopyButton from '../components/CopyButton';
import { Loader2, Edit2, Save, Upload } from 'lucide-react';

const EditArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    imageUrl: '',
    source: '',
    category: '',
    language: 'en',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`/api/articles/${id}`);
        const data = res.data;
        setFormData({
          title: data.title || '',
          summary: data.summary || '',
          content: data.content || '',
          imageUrl: data.imageUrl || '',
          source: data.source || '',
          category: data.category || '',
          language: data.language || 'en',
        });
      } catch (err) {
        console.error('Error fetching article:', err);
        toast.error('Failed to load article');
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const { title, summary, content, imageUrl, source, category, language } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onContentChange = (newContent) => {
    setFormData({ ...formData, content: newContent });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('File size:', file.size, 'bytes');

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      toast.error('Only JPEG, PNG, and WebP images are allowed');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    setImageUploading(true);
    try {
      const res = await axios.post('/api/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFormData({ ...formData, imageUrl: res.data.imageUrl });
      toast.success('Image uploaded successfully!');
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setImageUploading(false);
    }
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

    if (!category.trim()) {
      toast.error('Article category is required');
      return;
    }

    setIsSaving(true);

    try {
      const updatedArticle = {
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim(),
        source: source.trim(),
        category: category.trim(),
        language,
      };

      await axios.put(`/api/articles/${id}`, updatedArticle);
      toast.success('Article updated successfully!');
      navigate(`/article/${id}`);
    } catch (err) {
      console.error('Error updating article:', err);
      const errorCode = err.response?.data?.code;
      const errorMsg = err.response?.data?.message || 'Error updating article';

      if (err.response?.status === 404) {
        toast.error('Article not found. It may have been deleted.');
      } else if (err.response?.status === 403) {
        toast.error('Permission denied. Only admins can edit articles.');
      } else if (errorCode === 'TITLE_REQUIRED') {
        toast.error(errorMsg);
      } else if (errorCode === 'CONTENT_REQUIRED') {
        toast.error(errorMsg);
      } else if (errorCode === 'SERVER_ERROR') {
        toast.error(errorMsg);
      } else {
        toast.error('Failed to update article: ' + errorMsg);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={40} className="text-primary-600 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Edit2 size={32} className="text-primary-600" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            Edit Article
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-8">
          {/* Title */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 space-y-3">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Article Title *
            </label>
            <input 
              id="title"
              type="text" 
              name="title" 
              value={title} 
              onChange={onChange} 
              placeholder="Enter article title..."
              required
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-600 transition-all duration-300"
            />
          </div>

          {/* Featured Image URL */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 space-y-3">
            <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Featured Image URL *
            </label>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 items-stretch">
                <input 
                  id="imageUrl"
                  type="text" 
                  name="imageUrl" 
                  value={imageUrl} 
                  onChange={onChange}
                  placeholder="https://example.com/image.jpg"
                  required
                  className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-600 transition-all duration-300"
                />
                <label 
                  htmlFor="imageUpload"
                  className={`px-5 py-3 bg-green-600 text-white font-bold rounded-lg cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-lg hover:shadow-xl transition-all ${
                    imageUploading 
                      ? 'opacity-60 cursor-not-allowed bg-green-700' 
                      : 'hover:bg-green-700 active:scale-95'
                  }`}
                >
                  <Upload size={20} />
                  <span className="hidden sm:inline">Upload</span>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                    className="hidden"
                  />
                </label>
                {imageUrl && <CopyButton text={imageUrl} label="Copy" />}
              </div>
              {imageUploading && (
                <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold animate-pulse">
                  ⏳ Uploading image...
                </div>
              )}
            </div>
            {imageUrl && (
              <div className="mt-4 rounded-lg overflow-hidden shadow-md max-h-64">
                <img src={imageUrl} alt="Preview" className="w-full h-64 object-cover" loading="lazy" decoding="async" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>

          {/* Short Summary */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 space-y-3">
            <label htmlFor="summary" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Short Summary (for Card) *
            </label>
            <textarea 
              id="summary"
              rows="3" 
              name="summary" 
              value={summary} 
              onChange={onChange}
              placeholder="Write a brief summary for article cards..."
              required
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-600 transition-all duration-300 resize-none"
            ></textarea>
          </div>

          {/* Language */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 space-y-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Language *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value="en"
                  checked={language === 'en'}
                  onChange={onChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">English</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value="kn"
                  checked={language === 'kn'}
                  onChange={onChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">ಕನ್ನಡ</span>
              </label>
            </div>
          </div>

          {/* Rich Content Editor */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Full Article Content *
              </label>
              <div className="text-xs font-semibold bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full">
                📖 {calculateReadingTime(content)}
              </div>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
              💡 Use the toolbar to format text, insert images, and embed videos
            </p>
            <RichTextEditor 
              value={content}
              onChange={onContentChange}
              placeholder="Write your article content... Include text, images, and YouTube videos!"
            />
          </div>

          {/* Source */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 space-y-3">
            <label htmlFor="source" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Source
            </label>
            <input 
              id="source"
              type="text" 
              name="source" 
              value={source} 
              onChange={onChange}
              placeholder="e.g., BBC News, Reuters"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-600 transition-all duration-300"
            />
          </div>

          {/* Category */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 space-y-3">
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Category / Tag *
            </label>
            <input 
              id="category"
              type="text" 
              name="category" 
              value={category} 
              onChange={onChange} 
              placeholder="e.g., ExamAlert, BreakingNews"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-600 transition-all duration-300"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {isSaving ? 'Updating...' : 'Update Article'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditArticlePage;