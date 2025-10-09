import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';
import '../App.css';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        // This is the correct API endpoint
        const res = await axios.get('http://localhost:5000/api/users/bookmarks');
         console.log('RAW API RESPONSE:', res.data);

        setBookmarks(res.data);
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
        setError('Could not fetch your bookmarks. Please try logging in again.');
      }
      setLoading(false);
    };

    fetchBookmarks();
  }, []);

  if (loading) {
    return <h2>Loading your bookmarks...</h2>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h1>My Bookmarks</h1>
      <div className="article-grid">
        {bookmarks.length > 0 ? (
          bookmarks.map((article) => (
            <Link to={`/article/${article._id}`} key={article._id} className="card-link">
              <ArticleCard article={article} />
            </Link>
          ))
        ) : (
          <p>You have no saved articles yet.</p>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;