import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import RichTextEditor from '../../components/RichTextEditor';
import CopyButton from '../../components/CopyButton';
import { FileText, Check, AlertCircle, Inbox } from 'lucide-react';

const AdminContentPage = () => {
  // State for the editor form
  const [formData, setFormData] = useState({
    title: '', summary: '', imageUrl: '', videoUrl: '', source: '', category: '', language: 'en',
  });
  const [content, setContent] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [selectedSubmissionType, setSelectedSubmissionType] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState('school');

  const fetchSubmissions = async () => {
    try {
      const [submissionsRes, rawArticlesRes] = await Promise.all([
        axios.get('/api/submissions'),
        axios.get('/api/submissions/raw-articles')
      ]);

      const combined = [
        ...submissionsRes.data.map(s => ({ ...s, type: 'submission' })),
        ...rawArticlesRes.data.map(r => ({ ...r, type: 'raw' }))
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setSubmissions(combined);
    } catch (err) {
      console.error('Error fetching submissions:', err.response ? err.response.data : err.message);
      toast.error('Failed to fetch articles');
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const { title, summary, imageUrl, videoUrl, source, category, language } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCurate = (item) => {
    const isInstitutionSubmission = item.type === 'submission';
    
    setFormData({
      title: item.title || '',
      summary: isInstitutionSubmission ? (item.summary || '') : '',
      imageUrl: isInstitutionSubmission ? (item.imageUrl || '') : '',
      videoUrl: item.videoUrl || '',
      source: item.source || '',
      category: '',
      language: isInstitutionSubmission ? (item.contentLanguage || 'en') : 'en',
    });
    setContent(isInstitutionSubmission ? (item.content || '') : '');
    setSelectedSubmissionId(item._id);
    setSelectedSubmissionType(item.type);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Article title is required');
      return;
    }

    if (title.trim().length < 5) {
      toast.error('Title must be at least 5 characters');
      return;
    }

    if (!summary.trim()) {
      toast.error('Article summary is required for preview cards');
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

    setIsPublishing(true);

    try {
      const newArticle = {
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim(),
        videoUrl: videoUrl.trim() || undefined,
        source: source.trim(),
        category: category.trim(),
        language,
      };

      await axios.post('/api/articles', newArticle);
      
      if (selectedSubmissionId && selectedSubmissionType) {
        try {
          if (selectedSubmissionType === 'submission') {
            await axios.put(`/api/submissions/${selectedSubmissionId}`);
          } else if (selectedSubmissionType === 'raw') {
            await axios.put(`/api/submissions/raw-articles/${selectedSubmissionId}`);
          }
        } catch (err) {
          console.error('Error marking submission as used:', err);
        }
      }
      
      toast.success('Article published successfully!');
      
      setFormData({ title: '', summary: '', imageUrl: '', videoUrl: '', source: '', category: '', language: 'en' });
      setContent('');
      setSelectedSubmissionId(null);
      setSelectedSubmissionType(null);
      fetchSubmissions();

    } catch (err) {
      console.error('Error publishing article:', err);
      const errorCode = err.response?.data?.code;
      const errorMsg = err.response?.data?.message || 'Error publishing article';

      if (errorCode === 'TITLE_REQUIRED' || errorCode === 'TITLE_TOO_SHORT') {
        toast.error(errorMsg);
      } else if (errorCode === 'SUMMARY_REQUIRED' || errorCode === 'SUMMARY_TOO_SHORT') {
        toast.error(errorMsg);
      } else if (errorCode === 'CONTENT_REQUIRED') {
        toast.error(errorMsg);
      } else if (errorCode === 'IMAGE_REQUIRED') {
        toast.error(errorMsg + ' (Make sure it\'s a valid URL)');
      } else if (errorCode === 'CATEGORY_REQUIRED' || errorCode === 'PERMISSION_DENIED') {
        toast.error(errorMsg);
      } else {
        toast.error('Failed to publish: ' + errorMsg);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const schoolSubmissions = submissions.filter(s => s.type === 'submission');
  const externalSubmissions = submissions.filter(s => s.type === 'raw');
  const activeSubmissions = activeTab === 'school' ? schoolSubmissions : externalSubmissions;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Inbox Panel */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Inbox size={28} className="text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inbox</h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('school')}
            className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-all duration-300 ${
              activeTab === 'school'
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            🏫 Institution ({schoolSubmissions.length})
          </button>
          <button 
            onClick={() => setActiveTab('external')}
            className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-all duration-300 ${
              activeTab === 'external'
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            📰 External ({externalSubmissions.length})
          </button>
        </div>

        {/* Submissions List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {activeSubmissions.length > 0 ? (
            activeSubmissions.map(item => (
              <div key={item._id} className="bg-white dark:bg-slate-800 rounded-lg p-3 hover:shadow-md transition-shadow">
                <p className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                  {item.title}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  From: <strong>{item.source}</strong>
                </p>
                {item.summary && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2 mb-2">
                    {item.summary.substring(0, 80)}...
                  </p>
                )}
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:text-primary-700 mb-2 inline-block">
                    🔗 View Source
                  </a>
                )}
                <button 
                  onClick={() => handleCurate(item)}
                  className="w-full px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded hover:bg-primary-700 transition-colors"
                >
                  Curate
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-500 py-4">No pending articles</p>
          )}
        </div>
      </div>

      {/* Editor Panel */}
      <div className="lg:col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <FileText size={28} className="text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rich Text Editor</h2>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 space-y-2">
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
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-all"
            />
          </div>

          {/* Language */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 space-y-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Language *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value="en"
                  checked={language === 'en'}
                  onChange={onChange}
                />
                <span className="text-gray-700 dark:text-gray-300">English</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value="kn"
                  checked={language === 'kn'}
                  onChange={onChange}
                />
                <span className="text-gray-700 dark:text-gray-300">ಕನ್ನಡ</span>
              </label>
            </div>
          </div>

          {/* Featured Image URL */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 space-y-2">
            <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Featured Image URL *
            </label>
            <div className="flex gap-2">
              <input 
                id="imageUrl"
                type="text" 
                name="imageUrl" 
                value={imageUrl} 
                onChange={onChange}
                placeholder="https://example.com/image.jpg"
                required 
                className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-all"
              />
              {imageUrl && <CopyButton text={imageUrl} label="Copy URL" />}
            </div>
            {imageUrl && (
              <div className="mt-3 rounded-lg overflow-hidden shadow-md max-h-48">
                <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover" loading="lazy" decoding="async" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>

          {/* Video URL */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 space-y-2">
            <label htmlFor="videoUrl" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Video URL (Optional)
            </label>
            <input 
              id="videoUrl"
              type="url" 
              name="videoUrl" 
              value={videoUrl} 
              onChange={onChange}
              placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4"
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-all"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400">Add YouTube link or direct video URL (optional)</p>
          </div>

          {/* Summary */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 space-y-2">
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
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-all resize-none"
            ></textarea>
          </div>

          {/* Content Editor */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 space-y-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Full Article Content *
            </label>
            <p className="text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg">
              Use the toolbar to format text, insert images, and embed videos
            </p>
            <RichTextEditor 
              value={content}
              onChange={setContent}
              placeholder="Write your article content..."
            />
          </div>

          {/* Source */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 space-y-2">
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
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-all"
            />
          </div>

          {/* Category */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 space-y-2">
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
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            disabled={isPublishing}
          >
            <Check size={20} />
            {isPublishing ? 'Publishing...' : 'Publish Article'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminContentPage;