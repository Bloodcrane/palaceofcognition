import React, { useState, useEffect } from 'react';
import { account, databases } from '../appwrite';
import { Query } from 'appwrite';
import './UserPage.css';
import articles from '../Articles.json';
import { motion, AnimatePresence } from 'framer-motion';

const VOTES_DATABASE_ID = '697e6e0200022dd882b7';
const VOTES_COLLECTION_ID = 'user_votes';

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [votedArticles, setVotedArticles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);

        // Fetch user votes
        const votesResponse = await databases.listDocuments(
          VOTES_DATABASE_ID,
          VOTES_COLLECTION_ID,
          [
            Query.equal('user_id', currentUser.$id),
            Query.orderDesc('$createdAt')
          ]
        );

        // Map votes to articles
        const mappedArticles = votesResponse.documents.map(vote => {
          // Find the article that matches the vote's post_id
          const article = articles.find(a => a.id.toString() === vote.post_id);
          if (article) {
            return {
              ...article,
              voteId: vote.$id,
              voteType: vote.vote_type,
              votedAt: vote.$createdAt
            };
          }
          return null;
        }).filter(item => item !== null);

        setVotedArticles(mappedArticles);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Redirect if fetching user fails
        window.location.href = '/login';
      }
    };

    fetchData();
  }, []);

  const handleRemoveVote = async (voteId) => {
    try {
      await databases.deleteDocument(VOTES_DATABASE_ID, VOTES_COLLECTION_ID, voteId);
      setVotedArticles(prev => prev.filter(article => article.voteId !== voteId));
    } catch (error) {
      console.error("Error removing vote:", error);
      alert("Failed to remove vote. Please try again.");
    }
  };

  return (
    <div>
      <div className="userPage">
        {user ? (
          <>
            <div className="profileContainer">
              <div className="profileIcon"></div>
              <h2>{user.email}</h2>
              <p>თქვენი პროფილის გვერდი</p>
            </div>

            <div style={{ marginTop: '50px', width: '90%', maxWidth: '1200px' }}>
              <h3 style={{ textAlign: 'left', marginLeft: '20px', borderBottom: '1px solid #ffffff33', paddingBottom: '10px' }}>
                ხმის მიცემის ისტორია
              </h3>

              {votedArticles.length === 0 ? (
                <p style={{ opacity: 0.6, marginTop: '20px' }}>თქვენ ჯერ არ მიგიციათ ხმა არცერთი სტატიისთვის.</p>
              ) : (
                <motion.div layout className="votes-grid">
                  <AnimatePresence>
                    {votedArticles.map((article) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={article.voteId}
                        className="vote-card"
                      >
                        <div className="vote-card-image" style={{ backgroundImage: `url(${article.imageUrl})` }}>
                          <div className="vote-badge" style={{ backgroundColor: article.voteType === 1 ? '#5b744d' : '#3d2929' }}>
                            {article.voteType === 1 ? '💚 მოწონებული' : '💔 დაწუნებული'}
                          </div>
                        </div>
                        <div className="vote-card-content">
                          <h4>{article.title}</h4>
                          <button onClick={() => handleRemoveVote(article.voteId)} className="remove-vote-btn">
                            ისტორიიდან წაშლა
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </>
        ) : (
          <p>იტვირთება...</p>
        )}
      </div>
    </div>
  );
};

export default UserPage;

