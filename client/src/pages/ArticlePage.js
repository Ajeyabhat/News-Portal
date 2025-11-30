import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaBookmark, FaRegBookmark, FaUser, FaClock, FaCalendarAlt, FaFolder } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { formatRelativeTime, calculateReadingTime, getAuthorName } from '../utils/helpers';
import ConfirmModal from '../components/ConfirmModal';
import Skeleton from '../components/Skeleton';
import './ArticlePage.css';

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, loadUser } = useContext(AuthContext);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user && article) {
      setIsBookmarked(user.bookmarks.includes(article._id));
    }
  }, [user, article]);

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to bookmark articles.');
      return;
    }

    try {
      if (isBookmarked) {
        await axios.delete(`/api/bookmarks/${article._id}`);
        setIsBookmarked(false);
        toast.success('Bookmark removed.');
      } else {
        await axios.post(`/api/bookmarks`, { articleId: article._id });
        setIsBookmarked(true);
        toast.success('Article bookmarked!');
      }
      await loadUser();
    } catch (err) {
      console.error(err);
      toast.error('Error updating bookmark.');
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
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/articles/${id}`);
        setArticle(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 404) {
          setError('Article not found.');
        } else if (err.response?.status === 400) {
          setError('Invalid article ID.');
        } else {
          setError('Failed to load article. Please try again.');
        }
      }
      setLoading(false);
    };
    fetchArticle();
  }, [id]);

  const retryFetch = () => {
    setError(null);
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/articles/${id}`);
        setArticle(res.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load article. Please try again.');
      }
      setLoading(false);
    };
    fetchArticle();
  };

  if (loading) return <Skeleton type="article" count={1} />;
  
  if (error) {
    return (
      <div className="article-page-container">
        <div className="error-state">
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={retryFetch}>
            Try Again
          </button>
          <Link to="/" className="back-home-link">← Back to Home</Link>
        </div>
      </div>
    );
  }
  
  if (!article) return <div className="article-not-found">📭 Article not found.</div>;

  const authorName = getAuthorName(article);
  const relativeTime = formatRelativeTime(article.createdAt);
  const readingTime = calculateReadingTime(article.content);

  return (
    <div className="article-page-container">
      {user && user.role === 'Admin' && (
        <div className="admin-controls">
          <Link to={`/edit-article/${article._id}`} className="edit-link-btn">
            ✏️ Edit
          </Link>
          <button onClick={() => setShowDeleteModal(true)} className="delete-btn">🗑️ Delete</button>
        </div>
      )}

      <div className="article-header">
        <div className="article-title-section">
          <h1 className="article-title">{article.title}</h1>
        </div>
        {isAuthenticated && (
          <button onClick={handleBookmark} className="bookmark-icon-btn" title={isBookmarked ? 'Remove bookmark' : 'Save article'}>
            {isBookmarked ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
          </button>
        )}
      </div>

      <div className="article-meta">
        <span className="article-meta-item">
          <FaUser className="article-meta-icon" />
          <strong>{authorName}</strong>
        </span>
        <span className="article-meta-divider">•</span>
        <span className="article-meta-item">
          <FaCalendarAlt className="article-meta-icon" />
          {relativeTime}
        </span>
        <span className="article-meta-divider">•</span>
        <span className="article-meta-item">
          <FaClock className="article-meta-icon" />
          {readingTime}
        </span>
        <span className="article-meta-divider">•</span>
        <span className="article-meta-item">
          <FaFolder className="article-meta-icon" />
          <strong>{article.category}</strong>
        </span>
      </div>

      {article.summary && (
        <div className="article-summary">
          <p>{article.summary}</p>
        </div>
      )}

      <img src={article.imageUrl} alt={article.title} className="article-image" />
      
      {article.videoUrl && (
        <div className="article-video">
          {article.videoUrl.includes('youtube.com') || article.videoUrl.includes('youtu.be') ? (
            <iframe
              width="100%"
              height="500"
              src={article.videoUrl.replace('watch?v=', 'embed/')}
              title="Article Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <video width="100%" height="500" controls className="video-player">
              <source src={article.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}
      
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