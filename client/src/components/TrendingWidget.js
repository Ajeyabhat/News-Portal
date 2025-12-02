import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Flame } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TrendingWidget = () => {
  const [trending, setTrending] = useState([]);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(`/api/articles/trending?language=${language}`);
        setTrending(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrending();
  }, [language]);

  return (
    <div className="bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-slate-700 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-slate-600">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-slate-600">
        <div className="p-2 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg shadow-lg animate-pulse">
          <Flame className="text-white" size={20} />
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-orange-700 to-red-600 bg-clip-text text-transparent">Trending Articles</h3>
      </div>
      <ol className="space-y-3">
        {trending.slice(0, 10).map((article, index) => (
          <li key={article._id} className="flex gap-3 group hover:bg-orange-50 dark:hover:bg-slate-700/50 rounded-lg p-2 -m-2 transition-all duration-300">
            <span className={`flex-shrink-0 w-8 h-8 rounded-full font-bold flex items-center justify-center text-sm shadow-md ${
              index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
              index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
              index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
              'bg-gradient-to-br from-blue-500 to-teal-500 text-white'
            }`}>
              {index + 1}
            </span>
            <Link 
              to={`/article/${article._id}`} 
              className="flex-1 text-sm text-gray-800 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 line-clamp-2 group-hover:underline transition-colors font-medium"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default TrendingWidget;