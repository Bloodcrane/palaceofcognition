import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import movies from '../Movies.json';

const colors = ['#6b7a6f', '#775a5a', '#634875', '#647d94'];
const moviesPerPage = 3;

const MovieList = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const currentPage = parseInt(params.get('page')) || 1;

  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const currentMovies = movies.slice(startIndex, endIndex);

  const totalPages = Math.ceil(movies.length / moviesPerPage);

  const handlePageChange = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

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

  return (
    <div>
      <motion.div
        style={{ marginBottom: '100px' }}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {currentMovies.map((movie) => (
          <motion.div
            key={movie.id}
            variants={item}
            className="webComponent"
            style={{ backgroundColor: colors[movie.id % colors.length], border: `2px solid`, boxShadow: `0px 0px 30px ${colors[movie.id % colors.length]}`, borderColor: `${colors[movie.id % colors.length]}` }}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          >
            <div className="webComponent-inside-container">
              <img src={movie.imageUrl} alt={movie.title} className="webComponent-image" />
              <h2 className="webComponent-title">{movie.title}</h2>
              <label className='webComponent-author'>{movie.author}</label>
              <p className="webComponent-description">{movie.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className='pagination-container' style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: '999' }}>
        <Link to={`?page=${currentPage > 1 ? currentPage - 1 : 1}`} className="layoutButton" disabled={currentPage === 1} onClick={handlePageChange()}>Previous</Link>
        <Link to={`?page=${currentPage < totalPages ? currentPage + 1 : totalPages}`} className="layoutButton" disabled={currentPage === totalPages} onClick={handlePageChange()}>Next</Link>
        <br />
        <br />
        <br />
        <span style={{ textAlign: 'center' }}>Page {currentPage} of {totalPages}</span>
      </div>
    </div>
  );
};

export default MovieList;
