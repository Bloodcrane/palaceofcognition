import { Link, useLocation } from 'react-router-dom';
import articles from '../Articles.json';

const colors = ['#6b7a6f', '#775a5a', '#634875', '#647d94'];
const articlesPerPage = 3;

const ArticleList = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const currentPage = parseInt(params.get('page')) || 1;

  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const handlePageChange = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div style={{ marginBottom: '100px' }}>
        {currentArticles.map((article) => (
          <div key={article.id} className="webComponent" style={{ backgroundColor: colors[article.id % colors.length], border: `2px solid`, boxShadow: `0px 0px 30px ${colors[article.id % colors.length]}`, borderColor: `${colors[article.id % colors.length]}`}}>
            <div className="webComponent-inside-container">
              <img src={article.imageUrl} alt={article.title} className="webComponent-image" />
              <h2 className="webComponent-title">{article.title}</h2>
              <label className='webComponent-author'>{article.author}</label>
              <p className="webComponent-description">{article.description}</p>
              <div className="btnMargin">
                <Link
                  to={`/article/${article.id}`}  // Use article.id in the URL path
                  className="webComponent-button"
                >
                  View More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

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

export default ArticleList;
