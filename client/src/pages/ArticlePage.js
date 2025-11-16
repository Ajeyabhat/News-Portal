import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import ConfirmModal from '../components/ConfirmModal';
import './ArticlePage.css';

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, loadUser } = useContext(AuthContext);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user && article) {
      setIsBookmarked(user.bookmarks.includes(article._id));
    }
  }, [user, article]);

  const handleBookmark = async () => {
    try {
      await axios.post(`/api/articles/${id}/bookmark`);
      loadUser(); 
      toast.success('Bookmark status updated!');
    } catch (err) {
      console.error(err);
      toast.error('Error updating bookmarks. Please make sure you are logged in.');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/articles/${id}`);
      toast.success('Article deleted successfully.');
      setShowDeleteModal(false);
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Error deleting article.');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`/api/articles/${id}`);
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
          <button onClick={() => setShowDeleteModal(true)} className="delete-btn">Delete</button>
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
      
      {/* This is the critical fix. 
        We are now rendering the full 'content' from the rich text editor,
        not the short 'summary'.
      */}
      <div 
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default ArticlePage;