import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { databases } from '../appwrite';
import { Query } from 'appwrite';
import movies from '../Movies.json';

const VOTES_DATABASE_ID = '697e6e0200022dd882b7';
const MOVIES_COLLECTION_ID = 'movies';
const moviesPerPage = 3;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0 }
};

const MovieList = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const currentPage = parseInt(params.get('page')) || 1;

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const response = await databases.listDocuments(
          VOTES_DATABASE_ID,
          MOVIES_COLLECTION_ID,
          [Query.orderDesc('$createdAt')]
        );

        const dynamicMapped = response.documents.map(doc => ({
          id: doc.$id,
          title: doc.title,
          description: doc.description,
          imageUrl: doc.imageUrl,
          author: doc.author,
          isDynamic: true
        }));

        setAllMovies([...dynamicMapped, ...movies]);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setAllMovies(movies);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const totalPages = Math.ceil(allMovies.length / moviesPerPage);
  const startIndex = (currentPage - 1) * moviesPerPage;
  const currentMovies = useMemo(() => {
    return allMovies.slice(startIndex, startIndex + moviesPerPage);
  }, [allMovies, startIndex]);

  const handlePageChange = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      style={{ width: '100%', minHeight: '500px' }}
    >
      <div style={{ marginBottom: '100px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'mainFont' }}>იტვირთება...</div>
        ) : (
          currentMovies.map((movie) => (
            <motion.div
              key={movie.id}
              variants={item}
              className="webComponent"
              whileHover={{ scale: 1.01, border: `1px solid rgba(255,255,255,0.4)` }}
            >
              <img src={movie.imageUrl} className="webComponent-bg-img" alt="" />
              <div className="webComponent-overlay">
                <h2 className="webComponent-title">{movie.title}</h2>
                <div className="webComponent-meta">
                  <span className="webComponent-author">{movie.author}</span>
                </div>
                <p className="webComponent-description">{movie.description}</p>
              </div>
              <img src={movie.imageUrl} className="webComponent-img" alt="" />
            </motion.div>
          ))
        )}
      </div>

      <div className="pagination-container-compact">
        <Link to={`?page=${currentPage > 1 ? currentPage - 1 : 1}`} className="comp-nav-btn" disabled={currentPage === 1} onClick={handlePageChange}>←</Link>
        <span className="page-indicator">{currentPage} / {totalPages}</span>
        <Link to={`?page=${currentPage < totalPages ? currentPage + 1 : totalPages}`} className="comp-nav-btn" disabled={currentPage === totalPages} onClick={handlePageChange}>→</Link>
      </div>
    </motion.div>
  );
};

export default MovieList;
