import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import supabase from '../supabase';
import { v5 as uuidv5 } from 'uuid';
import articles from '../Articles.json';

const colors = ['#6b7a6f', '#775a5a', '#634875', '#647d94'];
const articlesPerPage = 3;

function isValidUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

function getColorIndex(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
  }
  return hash % colors.length;
}

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

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };
    fetchUser();
  }, []);

useEffect(() => {
  const fetchVotes = async () => {
    const articleUUIDs = currentArticles.map((article) =>
      isValidUUID(article.id) ? article.id : uuidv5(article.id.toString(), ARTICLE_NAMESPACE)
    );

    const { data, error } = await supabase
      .from('likes')
      .select('article_id, likes, dislikes')
      .in('article_id', articleUUIDs);

    if (error) {
      console.error('Error fetching votes:', error.message);
      return;
    }

    const likesMap = {};
    const dislikesMap = {};

    data.forEach(({ article_id, likes, dislikes }) => {
      likesMap[article_id] = (likesMap[article_id] || 0) + likes;
      dislikesMap[article_id] = (dislikesMap[article_id] || 0) + dislikes;
    });

    setLikes(likesMap);
    setDislikes(dislikesMap);
  };

  fetchVotes();
}, [currentArticles]);


const handleVote = async (articleUUID, type) => {
  if (!user) {
    alert('გთხოვთ შეიყვანეთ ან შექმენით ანგარიში ხმის მისაცემად!');
    return;
  }

  const { data: existingVote, error: selectError } = await supabase
    .from('likes')
    .select('*')
    .eq('article_id', articleUUID)
    .eq('user_id', user.id)
    .maybeSingle();

  if (selectError) {
    console.error('Error checking for existing vote:', selectError.message);
    return;
  }

  if (existingVote) {
    console.log('User has already voted on this article.');
    return;
  }

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
    setLikes((prev) => ({ ...prev, [articleUUID]: (prev[articleUUID] || 0) + newLikeCount }));
    setDislikes((prev) => ({ ...prev, [articleUUID]: (prev[articleUUID] || 0) + newDislikeCount }));
    console.log('Vote recorded.');
  }
};


  return (
    <div>
      <div style={{ marginBottom: '100px' }}>
        {currentArticles.map((article) => {
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
                    🗞️ View More
                  </Link>
                  <button style={{ backgroundColor: '#5b744d', borderColor: '#86947e' }} className="webComponent-button" onClick={() => handleVote(articleUUID, 'like')}>
                    💚 Like {likes[articleUUID] || 0}
                  </button>
                  <button style={{ backgroundColor: '#3d2929', borderColor: '#856161' }} className="webComponent-button" onClick={() => handleVote(articleUUID, 'dislike')}>
                    💔 Dislike {dislikes[articleUUID] || 0}
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
