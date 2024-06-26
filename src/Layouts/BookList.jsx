import { Link, useLocation } from 'react-router-dom';
import books from '../Books.json'; // Rename the file to Books.json

const colors = ['#6b7a6f', '#775a5a', '#634875', '#647d94'];
const booksPerPage = 3;

const BookList = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const currentPage = parseInt(params.get('page')) || 1;

  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = books.slice(startIndex, endIndex);

  const totalPages = Math.ceil(books.length / booksPerPage);

  const handlePageChange = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div style={{ marginBottom: '100px' }}>
        {currentBooks.map((book) => (
          <div key={book.id} className="webComponent" style={{ backgroundColor: colors[book.id % colors.length], border: `2px solid`, boxShadow: `0px 0px 30px ${colors[book.id % colors.length]}`, borderColor: `${colors[book.id % colors.length]}`}}>
            <div className="webComponent-inside-container">
              <img src={book.imageUrl} alt={book.title} className="webComponent-image" />
              <h2 className="webComponent-title">{book.title}</h2>
              <label className='webComponent-author'>{book.author}</label>
              <p className="webComponent-description">{book.description}</p>
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

export default BookList;
