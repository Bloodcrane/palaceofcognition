import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import supabase from '../supabase';
import { v5 as uuidv5 } from 'uuid';
import articles from '../Articles.json';

const colors = ['#6b7a6f', '#775a5a', '#634875', '#647d94'];
const articlesPerPage = 3;

// Helper: Check if a string is a valid UUID
function isValidUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

// Helper: Compute a simple hash from a string (for selecting a color)
function getColorIndex(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
  }
  return hash % colors.length;
}

// Use a fixed namespace for UUIDv5 (this can be any valid UUID; here we use the DNS namespace)
const ARTICLE_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

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

  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // On mount, check if user is logged in
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  // Fetch vote counts for current articles from Supabase
  useEffect(() => {
    const fetchVotes = async () => {
      // Compute an array of articleUUIDs for the current articles
      const articleUUIDs = currentArticles.map((article) =>
        isValidUUID(article.id) ? article.id : uuidv5(article.id.toString(), ARTICLE_NAMESPACE)
      );

      const { data, error } = await supabase
        .from('likes')
        .select('article_id, likes, dislikes')
        .in('article_id', articleUUIDs);

      if (error) {
        console.error('Error fetching votes:', error.message);
      } else if (data) {
        const likesMap = {};
        const dislikesMap = {};
        data.forEach((record) => {
          likesMap[record.article_id] = record.likes;
          dislikesMap[record.article_id] = record.dislikes;
        });
        setLikes(likesMap);
        setDislikes(dislikesMap);
      }
    };

    fetchVotes();
  }, [currentArticles]);

  const handleVote = async (articleUUID, type) => {
    if (!user) {
      console.error('User not logged in');
      return;
    }
    
    // First, check if the user has already voted for this article.
    const { data: existingVote, error: selectError } = await supabase
      .from('likes')
      .select('*')
      .eq('article_id', articleUUID)
      .eq('user_id', user.id)
      .maybeSingle();  // maybeSingle() returns null if no record exists
    
    if (selectError) {
      console.error('Error checking for existing vote:', selectError.message);
      return;
    }
    
    if (existingVote) {
      // The user has already voted on this article.
      console.log('User has already voted on this article.');
      return;
    }
    
    // If no vote exists, create a new record.
    // Each user can only vote once per article so we use 1 for the selected vote type.
    const newLikeCount = type === 'like' ? 1 : 0;
    const newDislikeCount = type === 'dislike' ? 1 : 0;
    
    const { error } = await supabase
      .from('likes')
      .insert({
        article_id: articleUUID,
        user_id: user.id,
        likes: newLikeCount,
        dislikes: newDislikeCount,
      });
    
    if (error) {
      console.error('Error while inserting vote:', error.message);
    } else {
      // Optionally update local state to reflect that the user has voted.
      if (type === 'like') {
        setLikes({ ...likes, [articleUUID]: 1 });
      } else {
        setDislikes({ ...dislikes, [articleUUID]: 1 });
      }
      console.log('Vote recorded.');
    }
  };
  

  return (
    <div>
      <div style={{ marginBottom: '100px' }}>
        {currentArticles.map((article) => {
          // Compute a stable UUID for each article.
          const articleUUID = isValidUUID(article.id) ? article.id : uuidv5(article.id.toString(), ARTICLE_NAMESPACE);
          const colorIndex = getColorIndex(articleUUID);
          return (
            <div
              key={articleUUID}
              className="webComponent"
              style={{
                backgroundColor: colors[colorIndex],
                border: `2px solid ${colors[colorIndex]}`,
                boxShadow: `0px 0px 30px ${colors[colorIndex]}`,
              }}
            >
              <div className="webComponent-inside-container">
                <img src={article.imageUrl} alt={article.title} className="webComponent-image" />
                <h2 className="webComponent-title">{article.title}</h2>
                <label className="webComponent-author">{article.author}</label>
                <p className="webComponent-description">{article.description}</p>
                <div className="btnMargin">
                  <Link to={`/article/${articleUUID}`} className="webComponent-button">
                    🗞️ იხილეთ მეტი
                  </Link>
                  <button style={{ backgroundColor: '#5b744d', borderColor: '#86947e' }} className="webComponent-button" onClick={() => handleVote(articleUUID, 'like')}>
                    💚 მომწონს {likes[articleUUID] || 0}
                  </button>
                  <button style={{ backgroundColor: '#3d2929', borderColor: '#856161' }} className="webComponent-button" onClick={() => handleVote(articleUUID, 'dislike')}>
                    💔 არ მომწონს {dislikes[articleUUID] || 0}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="pagination-container"
        style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: '999' }}
      >
        <Link
          to={`?page=${currentPage > 1 ? currentPage - 1 : 1}`}
          className="layoutButton"
          disabled={currentPage === 1}
          onClick={handlePageChange}
        >
          Previous
        </Link>
        <Link
          to={`?page=${currentPage < totalPages ? currentPage + 1 : totalPages}`}
          className="layoutButton"
          disabled={currentPage === totalPages}
          onClick={handlePageChange}
        >
          Next
        </Link>
        <br />
        <br />
        <br />
        <span style={{ textAlign: 'center' }}>
          Page {currentPage} of {totalPages}
        </span>
      </div>
    </div>
  );
};

export default ArticleList;
