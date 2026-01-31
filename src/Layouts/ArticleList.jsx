import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { account, databases } from '../appwrite';
import { ID, Query } from 'appwrite';
import { v5 as uuidv5 } from 'uuid';
import articles from '../Articles.json';

const colors = ['#6b7a6f', '#775a5a', '#634875', '#647d94'];
const articlesPerPage = 3;

// Placeholder Database ID - Replace with actual ID from Appwrite Console
const VOTES_DATABASE_ID = '697e6e0200022dd882b7';
const VOTES_COLLECTION_ID = 'user_votes';
const ARTICLE_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

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
      try {
        const user = await account.get();
        setUser(user);
      } catch (error) {
        // Not logged in
      }
    };
    fetchUser();
  }, []);

  // Fetch votes for current articles
  useEffect(() => {
    const fetchVotes = async () => {
      if (currentArticles.length === 0) return;

      const likesMap = {};
      const dislikesMap = {};

      try {
        // We need to fetch votes for EACH article. 
        // Ideally, we'd use a single query with OR logic, but for simplicity/limitations, we'll iterate.
        // Optimally: databases.listDocuments(DB, COL, [Query.equal('post_id', [id1, id2...])]) if supported or multiple requests.

        const promises = currentArticles.map(async (article) => {
          const articleUUID = isValidUUID(article.id) ? article.id : uuidv5(article.id.toString(), ARTICLE_NAMESPACE);

          // Get all votes for this article
          // Note: This matches the user's logic request to "count documents"
          // For a production app with many votes, aggregation is better, but this follows the instruction:
          // "Total Likes: Count documents where post_id == 'XYZ' and vote_type == 1"

          // Fetching all votes might be heavy. We will limit. 
          // BUT: Appwrite listDocuments returns 'total'. We can filter by post_id and vote_type.

          const [likesData, dislikesData] = await Promise.all([
            databases.listDocuments(VOTES_DATABASE_ID, VOTES_COLLECTION_ID, [
              Query.equal('post_id', articleUUID),
              Query.equal('vote_type', 1),
              Query.limit(1) // We only need the 'total' count
            ]),
            databases.listDocuments(VOTES_DATABASE_ID, VOTES_COLLECTION_ID, [
              Query.equal('post_id', articleUUID),
              Query.equal('vote_type', -1),
              Query.limit(1)
            ])
          ]);

          likesMap[articleUUID] = likesData.total;
          dislikesMap[articleUUID] = dislikesData.total;
        });

        await Promise.all(promises);

        setLikes(likesMap);
        setDislikes(dislikesMap);

      } catch (error) {
        // Fail silently or log if needed, as placeholder ID will cause errors initially
        console.error("Error fetching votes:", error);
      }
    };

    fetchVotes();
  }, [currentArticles]);


  const handleVote = async (articleUUID, type) => {
    if (!user) {
      alert('გთხოვთ შეიყვანეთ ან შექმენით ანგარიში ხმის მისაცემად!');
      return;
    }

    // Optimistic UI Update (Optional, simpler to wait for refresh or just increment local state temporarily)
    // For now, let's implement the logic and refetch or manually adjust state.

    const voteValue = type === 'like' ? 1 : -1;

    try {
      // 1. Check if user already voted
      const existing = await databases.listDocuments(VOTES_DATABASE_ID, VOTES_COLLECTION_ID, [
        Query.equal('post_id', articleUUID),
        Query.equal('user_id', user.$id)
      ]);

      if (existing.total > 0) {
        const docId = existing.documents[0].$id;
        const currentVoteType = existing.documents[0].vote_type;

        if (currentVoteType === voteValue) {
          // Remove vote if clicking the same button again
          await databases.deleteDocument(VOTES_DATABASE_ID, VOTES_COLLECTION_ID, docId);

          // Update State Locally
          if (voteValue === 1) {
            setLikes(prev => ({ ...prev, [articleUUID]: Math.max(0, (prev[articleUUID] || 0) - 1) }));
          } else {
            setDislikes(prev => ({ ...prev, [articleUUID]: Math.max(0, (prev[articleUUID] || 0) - 1) }));
          }

        } else {
          // Update vote if switching from like to dislike or vice versa
          await databases.updateDocument(VOTES_DATABASE_ID, VOTES_COLLECTION_ID, docId, { vote_type: voteValue });

          // Update State Locally
          if (voteValue === 1) {
            setLikes(prev => ({ ...prev, [articleUUID]: (prev[articleUUID] || 0) + 1 }));
            setDislikes(prev => ({ ...prev, [articleUUID]: Math.max(0, (prev[articleUUID] || 0) - 1) }));
          } else {
            setLikes(prev => ({ ...prev, [articleUUID]: Math.max(0, (prev[articleUUID] || 0) - 1) }));
            setDislikes(prev => ({ ...prev, [articleUUID]: (prev[articleUUID] || 0) + 1 }));
          }
        }
      } else {
        // 2. Create new vote
        await databases.createDocument(VOTES_DATABASE_ID, VOTES_COLLECTION_ID, ID.unique(), {
          post_id: articleUUID,
          user_id: user.$id,
          vote_type: voteValue
        });

        // Update State Locally
        if (voteValue === 1) {
          setLikes(prev => ({ ...prev, [articleUUID]: (prev[articleUUID] || 0) + 1 }));
        } else {
          setDislikes(prev => ({ ...prev, [articleUUID]: (prev[articleUUID] || 0) + 1 }));
        }
      }
    } catch (error) {
      console.error("Voting failed", error);
      alert("Vote failed. Please check console (Database ID might be missing).");
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
