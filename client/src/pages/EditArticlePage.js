import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import RichTextEditor from '../components/RichTextEditor';
import './EditArticlePage.css';

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

    if (!category.trim()) {
      toast.error('❌ Article category is required');
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
      toast.success('✨ Article updated successfully!');
      navigate(`/article/${id}`);
    } catch (err) {
      console.error('Error updating article:', err);
      const errorCode = err.response?.data?.code;
      const errorMsg = err.response?.data?.message || 'Error updating article';

      if (err.response?.status === 404) {
        toast.error('❌ Article not found. It may have been deleted.');
      } else if (err.response?.status === 403) {
        toast.error('❌ Permission denied. Only admins can edit articles.');
      } else if (errorCode === 'TITLE_REQUIRED') {
        toast.error('❌ ' + errorMsg);
      } else if (errorCode === 'CONTENT_REQUIRED') {
        toast.error('❌ ' + errorMsg);
      } else if (errorCode === 'SERVER_ERROR') {
        toast.error('❌ ' + errorMsg);
      } else {
        toast.error('❌ Failed to update article: ' + errorMsg);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="editor-panel" style={{ margin: '2rem auto', textAlign: 'center' }}>
        <h2>Loading article...</h2>
      </div>
    );
  }

  return (
    <div className="editor-panel" style={{ margin: '2rem auto', maxWidth: '900px' }}>
      <h2>✎ Edit Article</h2>
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

        {/* Rich Content Editor */}
        <div className="form-group">
          <label htmlFor="content">Full Article Content *</label>
          <p className="editor-hint">💡 Use the toolbar to format text, insert images, and embed videos</p>
          <RichTextEditor 
            value={content}
            onChange={onContentChange}
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
          disabled={isSaving}
        >
          {isSaving ? '⏳ Updating...' : '💾 Update Article'}
        </button>
      </form>
    </div>
  );
};

export default EditArticlePage;