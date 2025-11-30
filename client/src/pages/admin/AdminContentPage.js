import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import RichTextEditor from '../../components/RichTextEditor';
import './AdminContentPage.css';

const AdminContentPage = () => {
  // State for the editor form
  const [formData, setFormData] = useState({
    title: '', summary: '', imageUrl: '', videoUrl: '', source: '', category: '', language: 'en',
  });
  const [content, setContent] = useState('');
  const [submissions, setSubmissions] = useState([]); // Combined submissions + raw articles
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [selectedSubmissionType, setSelectedSubmissionType] = useState(null); // 'submission' or 'raw'
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState('school'); // 'school' or 'external'

  const fetchSubmissions = async () => {
    try {
      // Fetch both Institution Submissions and External Raw Articles
      const [submissionsRes, rawArticlesRes] = await Promise.all([
        axios.get('/api/submissions'),
        axios.get('/api/submissions/raw-articles')
      ]);

      // Combine both, mark type, sort by date
      const combined = [
        ...submissionsRes.data.map(s => ({ ...s, type: 'submission' })),
        ...rawArticlesRes.data.map(r => ({ ...r, type: 'raw' }))
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setSubmissions(combined);
      
      // Scroll inbox to top to show recently added articles
      const inboxList = document.querySelector('.inbox-list');
      if (inboxList) {
        setTimeout(() => {
          inboxList.scrollTop = 0;
        }, 0);
      }
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
    // Check type: 'submission' = Institution article (has all fields)
    // or 'raw' = External article (only title, source, url)
    const isInstitutionSubmission = item.type === 'submission';
    
    setFormData({
      title: item.title || '',
      summary: isInstitutionSubmission ? (item.summary || '') : '',
      imageUrl: isInstitutionSubmission ? (item.imageUrl || '') : '',
      videoUrl: item.videoUrl || '', // Include videoUrl from both types
      source: item.source || '',
      category: '',
      language: isInstitutionSubmission ? (item.contentLanguage || 'en') : 'en',
    });
    setContent(isInstitutionSubmission ? (item.content || '') : '');
    setSelectedSubmissionId(item._id);
    setSelectedSubmissionType(item.type);
    
    // Auto-scroll to form
    const editorPanel = document.querySelector('.editor-panel');
    if (editorPanel) {
      editorPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      toast.error('❌ Article summary is required for preview cards');
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

    if (!category.trim()) {
      toast.error('❌ Article category is required');
      return;
    }

    setIsPublishing(true);

    try {
      const newArticle = {
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim(),
        videoUrl: videoUrl.trim() || undefined, // Optional video
        source: source.trim(),
        category: category.trim(),
        language,
      };

      await axios.post('/api/articles', newArticle);
      
      // Mark the source as used based on type
      if (selectedSubmissionId && selectedSubmissionType) {
        try {
          if (selectedSubmissionType === 'submission') {
            // Mark Submission as published
            await axios.put(`/api/submissions/${selectedSubmissionId}`);
          } else if (selectedSubmissionType === 'raw') {
            // Mark RawArticle as published
            await axios.put(`/api/submissions/raw-articles/${selectedSubmissionId}`);
          }
        } catch (err) {
          console.error('Error marking submission as used:', err);
        }
      }
      
      toast.success('✨ Article published successfully!');
      
      // Reset form
      setFormData({ title: '', summary: '', imageUrl: '', videoUrl: '', source: '', category: '', language: 'en' });
      setContent('');
      setSelectedSubmissionId(null);
      setSelectedSubmissionType(null);
      fetchSubmissions();

    } catch (err) {
      console.error('Error publishing article:', err);
      const errorCode = err.response?.data?.code;
      const errorMsg = err.response?.data?.message || 'Error publishing article';

      if (errorCode === 'TITLE_REQUIRED') {
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
        toast.error('❌ ' + errorMsg + ' (Make sure it\'s a valid URL)');
      } else if (errorCode === 'CATEGORY_REQUIRED') {
        toast.error('❌ ' + errorMsg);
      } else if (errorCode === 'PERMISSION_DENIED') {
        toast.error('❌ ' + errorMsg);
      } else if (errorCode === 'SERVER_ERROR') {
        toast.error('❌ ' + errorMsg);
      } else {
        toast.error('❌ Failed to publish: ' + errorMsg);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="main-panels">
      <div className="inbox-panel">
        <h2>📥 Inbox</h2>
        
        {/* Tabs */}
        <div className="inbox-tabs">
          <button 
            className={`inbox-tab ${activeTab === 'school' ? 'active' : ''}`}
            onClick={() => setActiveTab('school')}
          >
            🏫 School Submissions ({submissions.filter(s => s.type === 'submission').length})
          </button>
          <button 
            className={`inbox-tab ${activeTab === 'external' ? 'active' : ''}`}
            onClick={() => setActiveTab('external')}
          >
            🔗 External Articles ({submissions.filter(s => s.type === 'raw').length})
          </button>
        </div>

        <div className="inbox-list">
          {(() => {
            const filtered = activeTab === 'school' 
              ? submissions.filter(s => s.type === 'submission')
              : submissions.filter(s => s.type === 'raw');
              
            return filtered.length > 0 ? (
              filtered.map(item => (
              <div key={item._id} className="inbox-item">
                <div className="inbox-item-content">
                  <p className="inbox-item-title">
                    {item.title}
                  </p>
                  <p className="inbox-item-source">From: <strong>{item.source}</strong></p>
                  {item.summary && <p className="inbox-item-preview">{item.summary.substring(0, 80)}...</p>}
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="view-source-link">
                      🔗 View Source
                    </a>
                  )}
                </div>
                <button 
                  onClick={() => handleCurate(item)}
                  className="curate-button"
                >
                  ✎ Curate
                </button>
              </div>
            ))
            ) : (
              <p className="empty-inbox">No pending articles. ✓</p>
            );
          })()}
        </div>
      </div>

      <div className="editor-panel">
        <h2>📝 Rich Text Editor</h2>
        <form onSubmit={onSubmit}>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Article Title *</label>
            <input 
              id="title"
              type="text" 
              name="title" 
              value={title} 
              onChange={onChange} 
              placeholder="Enter article title..."
              required 
            />
          </div>

          {/* Language */}
          <div className="form-group">
            <label>Language *</label>
            <div className="language-options">
              <label className={language === 'en' ? 'selected' : ''}>
                <input
                  type="radio"
                  name="language"
                  value="en"
                  checked={language === 'en'}
                  onChange={onChange}
                />
                English
              </label>
              <label className={language === 'kn' ? 'selected' : ''}>
                <input
                  type="radio"
                  name="language"
                  value="kn"
                  checked={language === 'kn'}
                  onChange={onChange}
                />
                ಕನ್ನಡ
              </label>
            </div>
          </div>

          {/* Featured Image URL */}
          <div className="form-group">
            <label htmlFor="imageUrl">Featured Image URL *</label>
            <input 
              id="imageUrl"
              type="text" 
              name="imageUrl" 
              value={imageUrl} 
              onChange={onChange}
              placeholder="https://example.com/image.jpg"
              required 
            />
            {imageUrl && (
              <div className="image-preview">
                <img src={imageUrl} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>

          {/* Optional Video URL */}
          <div className="form-group">
            <label htmlFor="videoUrl">Video URL (Optional)</label>
            <input 
              id="videoUrl"
              type="url" 
              name="videoUrl" 
              value={videoUrl} 
              onChange={onChange}
              placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4"
            />
            <small>📹 Add YouTube link or direct video URL (optional)</small>
          </div>

          {/* Short Summary */}
          <div className="form-group">
            <label htmlFor="summary">Short Summary (for Card) *</label>
            <textarea 
              id="summary"
              rows="3" 
              name="summary" 
              value={summary} 
              onChange={onChange}
              placeholder="Write a brief summary for article cards..."
              required
            ></textarea>
          </div>

          {/* Rich Content Editor */}
          <div className="form-group">
            <label htmlFor="content">Full Article Content *</label>
            <p className="editor-hint">💡 Use the toolbar to format text, insert images, and embed videos</p>
            <RichTextEditor 
              value={content}
              onChange={setContent}
              placeholder="Write your article content... Include text, images, and YouTube videos!"
            />
          </div>

          {/* Source */}
          <div className="form-group">
            <label htmlFor="source">Source</label>
            <input 
              id="source"
              type="text" 
              name="source" 
              value={source} 
              onChange={onChange}
              placeholder="e.g., BBC News, Reuters"
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category / Tag *</label>
            <input 
              id="category"
              type="text" 
              name="category" 
              value={category} 
              onChange={onChange} 
              placeholder="e.g., ExamAlert, BreakingNews"
              required 
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="publish-button"
            disabled={isPublishing}
          >
            {isPublishing ? '⏳ Publishing...' : '🚀 Publish Article'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminContentPage;