import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import './ArticlePage.css';

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, loadUser } = useContext(AuthContext);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (user && article) {
      setIsBookmarked(user.bookmarks.includes(article._id));
    }
  }, [user, article]);

  const handleBookmark = async () => {
    try {
      await axios.post(`http://localhost:5000/api/articles/${id}/bookmark`);
      // After successfully changing the bookmark, reload the user data
      loadUser(); 
      alert('Bookmark status updated!');
    } catch (err) {
      console.error(err);
      alert('Error updating bookmarks. Please make sure you are logged in.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await axios.delete(`http://localhost:5000/api/articles/${id}`);
        alert('Article deleted successfully.');
        navigate('/'); // Redirect to homepage after deletion
      } catch (err) {
        console.error(err);
        alert('Error deleting article.');
      }
    }
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/articles/${id}`);
        setArticle(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchArticle();
  }, [id]);

  if (loading) return <h2>Loading...</h2>;
  if (!article) return <h2>Article not found.</h2>;

  return (
    <div className="article-page-container">
      {user && user.role === 'Admin' && (
        <div className="admin-controls">
          <Link to={`/edit-article/${article._id}`} className="edit-link-btn">
            Edit
          </Link>
          <button onClick={handleDelete} className="delete-btn">Delete</button>
        </div>
      )}

      <div className="article-header">
        <h1 className="article-title">{article.title}</h1>
        {isAuthenticated && (
          <button onClick={handleBookmark} className="bookmark-icon-btn">
            {isBookmarked ? <FaBookmark size={24} /> : <FaRegBookmark size={24} />}
          </button>
        )}
      </div>

      <div className="article-meta">
        <span>Published by: <strong>{article.author ? article.author.username : 'Admin'}</strong></span>
        <span>Category: <strong>{article.category}</strong></span>
        <span>Source: <strong>{article.source}</strong></span>
      </div>

      <img src={article.imageUrl} alt={article.title} className="article-image" />
      <p className="article-content">{article.summary}</p>
    </div>
  );
};

export default ArticlePage;