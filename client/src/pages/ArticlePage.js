import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Bookmark, User, Clock, Calendar, Folder, Edit2, Trash2, AlertCircle, RotateCcw, Home } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { formatRelativeTime, calculateReadingTime, getAuthorName } from '../utils/helpers';
import ConfirmModal from '../components/ConfirmModal';
import Skeleton from '../components/Skeleton';

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

  const fetchArticle = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/articles/${id}`);
      setArticle(res.data);
    } catch (err) {
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

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const retryFetch = () => {
    fetchArticle();
  };

  if (loading) return <Skeleton type="article" count={1} />;
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-12 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-red-300 dark:border-red-900 space-y-6">
          <AlertCircle size={56} className="text-red-600" />
          <p className="text-xl text-gray-600 dark:text-gray-400 text-center">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={retryFetch}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              <RotateCcw size={18} />
              Try Again
            </button>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <Home size={18} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!article) return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="text-gray-600 dark:text-gray-400 text-xl">Article not found.</div>
    </div>
  );

  const authorName = getAuthorName(article);
  const relativeTime = formatRelativeTime(article.createdAt);
  const readingTime = calculateReadingTime(article.content);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Articles</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-semibold truncate max-w-xs">{article?.title}</span>
        </div>

        {/* Admin Controls */}
        {user && user.role === 'Admin' && (
          <div className="flex gap-2 mb-8">
            <Link 
              to={`/edit-article/${article._id}`} 
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <Edit2 size={18} />
              Edit
            </Link>
            <button 
              onClick={() => setShowDeleteModal(true)} 
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        )}

        {/* Article Content */}
        <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header with Title and Bookmark */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight flex-1">
                {article.title}
              </h1>
              {isAuthenticated && (
                <button 
                  onClick={handleBookmark}
                  className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-600 transition-colors flex-shrink-0"
                  title={isBookmarked ? 'Remove bookmark' : 'Save article'}
                >
                  <Bookmark size={24} fill={isBookmarked ? 'currentColor' : 'none'} />
                </button>
              )}
            </div>
          </div>

          {/* Article Metadata */}
          <div className="px-8 py-6 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-4 text-sm md:text-base text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <User size={18} className="text-primary-600" />
                <span><strong>{authorName}</strong></span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-primary-600" />
                <span>{relativeTime}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-primary-600" />
                <span>{readingTime}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Folder size={18} className="text-primary-600" />
                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full font-semibold text-xs">
                  {article.category}
                </span>
              </div>
            </div>
          </div>

          {/* Article Summary */}
          {article.summary && (
            <div className="px-8 py-6 bg-primary-50 dark:bg-primary-900/20 border-b border-gray-200 dark:border-gray-700">
              <p className="text-lg text-primary-900 dark:text-primary-100 italic leading-relaxed">
                {article.summary}
              </p>
            </div>
          )}

          {/* Featured Image */}
          {article.imageUrl && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-auto object-contain"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect fill="%23ddd" width="800" height="400"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          )}

          {/* Article Video */}
          {article.videoUrl && (
            <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
              <div className="rounded-lg overflow-hidden shadow-md">
                {article.videoUrl.includes('youtube.com') || article.videoUrl.includes('youtu.be') ? (
                  <iframe
                    width="100%"
                    height="500"
                    src={article.videoUrl.replace('watch?v=', 'embed/')}
                    title="Article Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                ) : (
                  <video width="100%" height="500" controls className="rounded-lg w-full">
                    <source src={article.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          )}
          
          {/* Article Content */}
          <div className="px-8 py-8 prose prose-sm dark:prose-invert max-w-none">
            <div 
              className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>
      </div>

      {/* Delete Confirmation Modal */}
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
