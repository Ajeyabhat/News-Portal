import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';
import '../App.css';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        setLoading(true); // Set loading to true before fetching
        try {
          const res = await axios.get(`http://localhost:5000/api/search?q=${query}`);
          setArticles(res.data);
        } catch (err) {
          console.error('Error fetching search results:', err);
        }
        setLoading(false);
      };
      fetchResults();
    } else {
      setArticles([]); // Clear articles if there is no query
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return <h2>Searching...</h2>;
  }

  return (
    <div>
      <h1>Search Results for: "{query}"</h1>
      <div className="article-grid">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Link to={`/article/${article._id}`} key={article._id} className="card-link">
              <ArticleCard article={article} />
            </Link>
          ))
        ) : (
          <p>No articles found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;