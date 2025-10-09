import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pages/AdminDashboard.css'; // Reusing the CSS

const ContentManager = () => {
  // State for the editor form
  const [formData, setFormData] = useState({
    title: '', summary: '', imageUrl: '', source: '', category: '',
  });
  // State for the inbox
  const [rawArticles, setRawArticles] = useState([]);
  // State to track which raw article is being edited
  const [selectedRawArticleId, setSelectedRawArticleId] = useState(null);

  const fetchRawArticles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/raw-articles');
      setRawArticles(res.data);
    } catch (err) {
      console.error('Error fetching raw articles:', err.response ? err.response.data : err.message);
    }
  };

  useEffect(() => {
    fetchRawArticles();
  }, []);

  const { title, summary, imageUrl, source, category } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCurate = (rawArticle) => {
    setFormData({
      title: rawArticle.title || '',
      summary: '',
      imageUrl: '',
      source: rawArticle.source || '',
      category: ''
    });
    setSelectedRawArticleId(rawArticle._id);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const newArticle = { title, summary, imageUrl, source, category };
      await axios.post('http://localhost:5000/api/articles', newArticle);
      
      if (selectedRawArticleId) {
        await axios.put(`http://localhost:5000/api/raw-articles/${selectedRawArticleId}`);
      }
      
      alert('Article published successfully!');
      
      setFormData({ title: '', summary: '', imageUrl: '', source: '', category: '' });
      setSelectedRawArticleId(null);
      fetchRawArticles();

    } catch (err) {
      console.error(err.response.data);
      alert('Error publishing article.');
    }
  };

  return (
    <div className="main-panels">
      <div className="inbox-panel">
        <h2>Inbox ({rawArticles.length} pending)</h2>
        <div className="inbox-list">
          {rawArticles.length > 0 ? (
            rawArticles.map(raw => (
              <div key={raw._id} className="inbox-item">
                <p>{raw.title}</p>
                <button onClick={() => handleCurate(raw)}>Curate</button>
              </div>
            ))
          ) : (
            <p>No pending articles.</p>
          )}
        </div>
      </div>
      <div className="editor-panel">
        <h2>Editor</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input type="text" name="title" value={title} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Summary (ELI10)</label>
            <textarea rows="5" name="summary" value={summary} onChange={onChange} required></textarea>
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input type="text" name="imageUrl" value={imageUrl} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Source</label>
            <input type="text" name="source" value={source} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Category / Tag</label>
            <input type="text" name="category" value={category} onChange={onChange} placeholder="e.g., #ExamAlert" required />
          </div>
          <button type="submit" className="publish-button">Publish</button>
        </form>
      </div>
    </div>
  );
};

export default ContentManager;