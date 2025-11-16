import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import RichTextEditor from '../../components/RichTextEditor';
import './AdminContentPage.css';

const AdminContentPage = () => {
  // State for the editor form
  const [formData, setFormData] = useState({
    title: '', summary: '', imageUrl: '', source: '', category: '', language: 'en',
  });
  const [content, setContent] = useState('');
  const [rawArticles, setRawArticles] = useState([]);
  const [selectedRawArticleId, setSelectedRawArticleId] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const fetchRawArticles = async () => {
    try {
      const res = await axios.get('/api/raw-articles');
      setRawArticles(res.data);
      // Scroll inbox to top to show recently added articles
      const inboxList = document.querySelector('.inbox-list');
      if (inboxList) {
        setTimeout(() => {
          inboxList.scrollTop = 0;
        }, 0);
      }
    } catch (err) {
      console.error('Error fetching raw articles:', err.response ? err.response.data : err.message);
      toast.error('Failed to fetch articles');
    }
  };

  useEffect(() => {
    fetchRawArticles();
  }, []);

  const { title, summary, imageUrl, source, category, language } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCurate = (rawArticle) => {
    setFormData({
      title: rawArticle.title || '',
      summary: '',
      imageUrl: '',
      source: rawArticle.source || '',
      category: '',
      language: 'en',
    });
    setContent('');
    setSelectedRawArticleId(rawArticle._id);
    
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
      toast.error('Title is required');
      return;
    }
    if (!summary.trim()) {
      toast.error('Summary is required');
      return;
    }
    if (!content.trim() || content === '<p><br></p>') {
      toast.error('Article content is required');
      return;
    }
    if (!imageUrl.trim()) {
      toast.error('Featured image URL is required');
      return;
    }
    if (!category.trim()) {
      toast.error('Category is required');
      return;
    }

    setIsPublishing(true);

    try {
      const newArticle = {
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim(),
        source: source.trim(),
        category: category.trim(),
        language,
      };

      await axios.post('/api/articles', newArticle);
      
      if (selectedRawArticleId) {
        try {
          await axios.put(`/api/raw-articles/${selectedRawArticleId}`);
        } catch (err) {
          console.error('Error marking raw article as used:', err);
        }
      }
      
      toast.success('✨ Article published successfully!');
      
      // Reset form
  setFormData({ title: '', summary: '', imageUrl: '', source: '', category: '', language: 'en' });
      setContent('');
      setSelectedRawArticleId(null);
      fetchRawArticles();

    } catch (err) {
      console.error('Error publishing article:', err);
      const errorMsg = err.response?.data?.message || 'Error publishing article';
      toast.error(errorMsg);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="main-panels">
      <div className="inbox-panel">
        <h2>📥 Inbox ({rawArticles.length} pending)</h2>
        <div className="inbox-list">
          {rawArticles.length > 0 ? (
            rawArticles.map(raw => (
              <div key={raw._id} className="inbox-item">
                <div className="inbox-item-content">
                  <p className="inbox-item-title">{raw.title}</p>
                  <a href={raw.url} target="_blank" rel="noopener noreferrer" className="view-source-link">
                    🔗 View Source
                  </a>
                </div>
                <button 
                  onClick={() => handleCurate(raw)}
                  className="curate-button"
                >
                  ✎ Curate
                </button>
              </div>
            ))
          ) : (
            <p className="empty-inbox">No pending articles. ✓</p>
          )}
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