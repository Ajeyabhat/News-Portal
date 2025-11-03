import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';


const EditArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    imageUrl: '',
    source: '',
    category: '',
  });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/articles/${id}`);
        setFormData(res.data); // Populate the form with existing article data
      } catch (err) {
        console.error(err);
      }
    };
    fetchArticle();
  }, [id]);

  const { title, summary, imageUrl, source, category } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/articles/${id}`, formData);
      alert('Article updated successfully!');
      navigate(`/article/${id}`); // Redirect back to the article page
    } catch (err) {
      console.error(err.response.data);
      alert('Error updating article.');
    }
  };

  return (
    <div className="editor-panel" style={{ margin: '2rem auto' }}>
      <h2>Edit Article</h2>
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
          <input type="text" name="category" value={category} onChange={onChange} required />
        </div>
        <button type="submit" className="publish-button">Update Article</button>
      </form>
    </div>
  );
};

export default EditArticlePage;