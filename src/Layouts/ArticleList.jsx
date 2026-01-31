import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { account, databases } from '../appwrite';
import { ID, Query } from 'appwrite';
import articles from '../Articles.json';

const colors = ['#6b7a6f', '#775a5a', '#634875', '#647d94'];
const articlesPerPage = 3;

// Placeholder Database ID - Replace with actual ID from Appwrite Console
const VOTES_DATABASE_ID = '697e6e0200022dd882b7';
const VOTES_COLLECTION_ID = 'user_votes';
const ARTICLES_COLLECTION_ID = 'articles';

function getColorIndex(str) {
  let hash = 0;
  if (!str) return 0;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
  }
  return hash % colors.length;
}

const ArticleList = () => {
  const [allArticles, setAllArticles] = useState([]);
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const currentPage = parseInt(params.get('page')) || 1;

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch user
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (e) { }

      try {
        // 2. Fetch dynamic articles from Appwrite
        const response = await databases.listDocuments(
          VOTES_DATABASE_ID,
          ARTICLES_COLLECTION_ID,
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

        // 3. Merge with static JSON articles
        setAllArticles([...dynamicMapped, ...articles]);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setAllArticles(articles); // Fallback to static
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const totalPages = Math.ceil(allArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = allArticles.slice(startIndex, startIndex + articlesPerPage);

  const handlePageChange = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  // Fetch votes for current articles
  useEffect(() => {
    const fetchVotes = async () => {
      if (currentArticles.length === 0) return;

      const likesMap = {};
      const dislikesMap = {};

      try {
        const promises = currentArticles.map(async (article) => {
          const articleId = article.id.toString();

          const [likesData, dislikesData] = await Promise.all([
            databases.listDocuments(VOTES_DATABASE_ID, VOTES_COLLECTION_ID, [
              Query.equal('post_id', articleId),
              Query.equal('vote_type', 1),
              Query.limit(1)
            ]),
            databases.listDocuments(VOTES_DATABASE_ID, VOTES_COLLECTION_ID, [
              Query.equal('post_id', articleId),
              Query.equal('vote_type', -1),
              Query.limit(1)
            ])
          ]);

          likesMap[articleId] = likesData.total;
          dislikesMap[articleId] = dislikesData.total;
        });

        await Promise.all(promises);
        setLikes(likesMap);
        setDislikes(dislikesMap);
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    };

    fetchVotes();
  }, [currentArticles.map(a => a.id).join(',')]); // Stable dependency

  const handleVote = async (articleId, type) => {
    if (!user) {
      alert('გთხოვთ შეიყვანეთ ან შექმენით ანგარიში ხმის მისაცემად!');
      return;
    }

    const voteValue = type === 'like' ? 1 : -1;

    try {
      const existing = await databases.listDocuments(VOTES_DATABASE_ID, VOTES_COLLECTION_ID, [
        Query.equal('post_id', articleId.toString()),
        Query.equal('user_id', user.$id)
      ]);

      if (existing.total > 0) {
        const docId = existing.documents[0].$id;
        const currentVoteType = existing.documents[0].vote_type;

        if (currentVoteType === voteValue) {
          await databases.deleteDocument(VOTES_DATABASE_ID, VOTES_COLLECTION_ID, docId);
          if (voteValue === 1) {
            setLikes(prev => ({ ...prev, [articleId]: Math.max(0, (prev[articleId] || 0) - 1) }));
          } else {
            setDislikes(prev => ({ ...prev, [articleId]: Math.max(0, (prev[articleId] || 0) - 1) }));
          }
        } else {
          await databases.updateDocument(VOTES_DATABASE_ID, VOTES_COLLECTION_ID, docId, { vote_type: voteValue });
          if (voteValue === 1) {
            setLikes(prev => ({ ...prev, [articleId]: (prev[articleId] || 0) + 1 }));
            setDislikes(prev => ({ ...prev, [articleId]: Math.max(0, (prev[articleId] || 0) - 1) }));
          } else {
            setLikes(prev => ({ ...prev, [articleId]: Math.max(0, (prev[articleId] || 0) - 1) }));
            setDislikes(prev => ({ ...prev, [articleId]: (prev[articleId] || 0) + 1 }));
          }
        }
      } else {
        await databases.createDocument(VOTES_DATABASE_ID, VOTES_COLLECTION_ID, ID.unique(), {
          post_id: articleId.toString(),
          user_id: user.$id,
          vote_type: voteValue
        });
        if (voteValue === 1) {
          setLikes(prev => ({ ...prev, [articleId]: (prev[articleId] || 0) + 1 }));
        } else {
          setDislikes(prev => ({ ...prev, [articleId]: (prev[articleId] || 0) + 1 }));
        }
      }
    } catch (error) {
      console.error("Voting failed", error);
      alert("Vote failed.");
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>იტვირთება...</div>;

  return (
    <div>
      <motion.div
        style={{ marginBottom: '100px' }}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {currentArticles.map((article) => {
          const articleId = article.id.toString();
          const colorIndex = getColorIndex(articleId);
          return (
            <motion.div
              key={articleId}
              variants={item}
              className="webComponent"
              style={{
                backgroundColor: colors[colorIndex],
                border: `2px solid ${colors[colorIndex]}`,
                boxShadow: `0px 0px 30px ${colors[colorIndex]}`,
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: `0px 0px 50px ${colors[colorIndex]}`,
                transition: { duration: 0.3 }
              }}
            >
              <div className="webComponent-inside-container">
                <img src={article.imageUrl} alt={article.title} className="webComponent-image" />
                <h2 className="webComponent-title">{article.title}</h2>
                <label className="webComponent-author">{article.author}</label>
                <p className="webComponent-description">{article.description}</p>
                <div className="btnMargin">
                  <Link to={`/article/${articleId}`} className="webComponent-button">
                    🗞️ View More
                  </Link>
                  <button
                    style={{ backgroundColor: '#5b744d', borderColor: '#86947e' }}
                    className="webComponent-button"
                    onClick={() => handleVote(articleId, 'like')}
                  >
                    💚 Like {likes[articleId] || 0}
                  </button>
                  <button
                    style={{ backgroundColor: '#3d2929', borderColor: '#856161' }}
                    className="webComponent-button"
                    onClick={() => handleVote(articleId, 'dislike')}
                  >
                    💔 Dislike {dislikes[articleId] || 0}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

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
        <div style={{ marginTop: '10px', textAlign: 'center', opacity: 0.6 }}>
          Page {currentPage} of {totalPages}
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
