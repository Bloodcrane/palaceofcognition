import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { databases, storage } from '../appwrite';
import { Query, ID } from 'appwrite';
import './UserPage.css';
import articles from '../Articles.json';
import { motion, AnimatePresence } from 'framer-motion';

const VOTES_DATABASE_ID = '697e6e0200022dd882b7';
const VOTES_COLLECTION_ID = 'user_votes';
const ARTICLES_COLLECTION_ID = 'articles'; // Matches the collection the user created
const IMAGES_BUCKET_ID = '697e88ae002f9e02cadb'; // Matches the bucket the user created
const PROFILES_COLLECTION_ID = 'user_profiles';

const UserPage = ({ user }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [isUploadingProfilePic, setIsUploadingProfilePic] = useState(false);
  const [profileDescription, setProfileDescription] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [votedArticles, setVotedArticles] = useState([]);
  const [myArticles, setMyArticles] = useState([]);

  // Upload Form State
  const [showUpload, setShowUpload] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fullText, setFullText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [postLimitReached, setPostLimitReached] = useState(false);

  // Captcha State
  const [captchaChallenge, setCaptchaChallenge] = useState({ a: 0, b: 0, result: 0 });
  const [captchaInput, setCaptchaInput] = useState('');

  // Editing State
  const [editingArticle, setEditingArticle] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editFullText, setEditFullText] = useState('');

  const generateCaptcha = useCallback(() => {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    setCaptchaChallenge({ a, b, result: a + b });
    setCaptchaInput('');
  }, []);

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      // 0. Fetch/Sync user profile
      try {
        const profileRes = await databases.listDocuments(
          VOTES_DATABASE_ID,
          PROFILES_COLLECTION_ID,
          [Query.equal('user_id', user.$id)]
        );

        if (profileRes.documents.length > 0) {
          setUserProfile(profileRes.documents[0]);
          setProfileDescription(profileRes.documents[0].description || '');
        } else {
          // Create initial profile
          const newProfile = await databases.createDocument(
            VOTES_DATABASE_ID,
            PROFILES_COLLECTION_ID,
            ID.unique(),
            {
              user_id: user.$id,
              name: user.name || "Anonymous",
              profile_img_url: "",
              description: ""
            }
          );
          setUserProfile(newProfile);
          setProfileDescription('');
        }
      } catch (profileErr) {
        console.error("Error syncing profile:", profileErr);
      }

      try {
        const votesResponse = await databases.listDocuments(
          VOTES_DATABASE_ID,
          VOTES_COLLECTION_ID,
          [
            Query.equal('user_id', user.$id),
            Query.orderDesc('$createdAt')
          ]
        );

        // Fetch details for each voted article
        const mappedVotes = await Promise.all(votesResponse.documents.map(async (vote) => {
          // 1. Try finding in local JSON
          let article = articles.find(a => a.id.toString() === vote.post_id);

          if (!article) {
            // 2. Try fetching from Appwrite articles collection
            try {
              const dynamicDoc = await databases.getDocument(
                VOTES_DATABASE_ID,
                ARTICLES_COLLECTION_ID,
                vote.post_id
              );
              article = {
                id: dynamicDoc.$id,
                title: dynamicDoc.title,
                description: dynamicDoc.description,
                imageUrl: dynamicDoc.imageUrl,
                author: dynamicDoc.author,
                isDynamic: true
              };
            } catch (err) {
              if (err.code === 404) {
                // Auto-cleanup: if the article no longer exists, delete the vote record
                // not using await here to not block the current loop, but it's fine
                databases.deleteDocument(VOTES_DATABASE_ID, VOTES_COLLECTION_ID, vote.$id)
                  .catch(e => console.error("Failed to cleanup orphaned vote:", e));
              } else {
                console.warn(`Could not fetch dynamic article ${vote.post_id}:`, err);
              }
            }
          }

          if (article) {
            return {
              ...article,
              voteId: vote.$id,
              voteType: vote.vote_type,
              votedAt: vote.$createdAt
            };
          }
          return null;
        }));

        setVotedArticles(mappedVotes.filter(item => item !== null));
      } catch (voteError) {
        console.error("Error fetching user votes:", voteError);
      }

      // 2. Fetch user's own articles
      try {
        const articlesResponse = await databases.listDocuments(
          VOTES_DATABASE_ID,
          ARTICLES_COLLECTION_ID,
          [
            Query.equal('user_id', user.$id),
            Query.orderDesc('$createdAt')
          ]
        );
        setMyArticles(articlesResponse.documents);

        // 3. Check post limit
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const recentPosts = articlesResponse.documents.filter(doc => doc.$createdAt > oneDayAgo);
        setPostLimitReached(recentPosts.length >= 3);
      } catch (articleError) {
        console.error("Error fetching user articles:", articleError);
      }

    } catch (error) {
      console.error("General data fetching error:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
    generateCaptcha();
  }, [fetchData, generateCaptcha]);

  const handleRemoveVote = async (voteId) => {
    try {
      await databases.deleteDocument(VOTES_DATABASE_ID, VOTES_COLLECTION_ID, voteId);
      setVotedArticles(prev => prev.filter(article => article.voteId !== voteId));
    } catch (error) {
      console.error("Error removing vote:", error);
      alert("Failed to remove vote.");
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setEditTitle(article.title);
    setEditDescription(article.description);
    setEditFullText(article.fullText);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateArticle = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      await databases.updateDocument(
        VOTES_DATABASE_ID,
        ARTICLES_COLLECTION_ID,
        editingArticle.$id,
        {
          title: editTitle,
          description: editDescription,
          fullText: editFullText
        }
      );
      alert("სტატია განახლდა!");
      setEditingArticle(null);
      fetchData();
    } catch (error) {
      console.error("Update error:", error);
      alert("განახლება ვერ მოხერხდა.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (parseInt(captchaInput) !== captchaChallenge.result) {
      alert("Captcha verification failed. Please try again.");
      generateCaptcha();
      return;
    }

    if (postLimitReached) {
      alert("You have reached your daily upload limit (3 articles per 24h).");
      return;
    }

    if (!imageFile) {
      alert("გთხოვთ აირჩიოთ სურათი.");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Upload image
      const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), imageFile);
      console.log("Appwrite file object:", file);

      // Use toString() as it works for both URL objects and strings
      const imageUrl = storage.getFileView(IMAGES_BUCKET_ID, file.$id).toString();
      console.log("Generated Image URL:", imageUrl);

      if (!imageUrl || imageUrl === "undefined") {
        throw new Error("Failed to generate a valid image URL.");
      }

      // 2. Create article document
      await databases.createDocument(
        VOTES_DATABASE_ID,
        ARTICLES_COLLECTION_ID,
        ID.unique(),
        {
          title,
          description,
          author: user.name || user.email || "Anonymous",
          imageUrl,
          fullText,
          user_id: user.$id
        }
      );

      alert("სტატია წარმატებით აიტვირთა!");
      setShowUpload(false);
      // Reset form
      setTitle('');
      setDescription('');
      setFullText('');
      setImageFile(null);
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Upload error detail:", error);
      alert("დაფიქსირდა შეცდომა ატვირთვისას. შეამოწმეთ კონსოლი.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteArticle = async (articleId, imageId) => {
    if (!window.confirm("დარწმუნებული ხართ, რომ გსურთ სტატიის წაშლა?")) return;

    try {
      await databases.deleteDocument(VOTES_DATABASE_ID, ARTICLES_COLLECTION_ID, articleId);
      // Note: If you store $id of image in document, you could delete it too
      // For simplicity, we just delete the document here
      setMyArticles(prev => prev.filter(a => a.$id !== articleId));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete article.");
    }
  };

  const handleSaveDescription = async () => {
    if (!userProfile) return;

    try {
      const updated = await databases.updateDocument(
        VOTES_DATABASE_ID,
        PROFILES_COLLECTION_ID,
        userProfile.$id,
        { description: profileDescription }
      );
      setUserProfile(updated);
      setIsEditingDescription(false);
      alert("აღწერა განახლდა!");
    } catch (error) {
      console.error("Description update error:", error);
      alert("აღწერის განახლება ვერ მოხერხდა.");
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingProfilePic(true);
    try {
      // 1. Upload to storage
      const uploadedFile = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), file);
      const imageUrl = storage.getFileView(IMAGES_BUCKET_ID, uploadedFile.$id).toString();

      // 2. Update profile document
      if (userProfile) {
        const updated = await databases.updateDocument(
          VOTES_DATABASE_ID,
          PROFILES_COLLECTION_ID,
          userProfile.$id,
          { profile_img_url: imageUrl }
        );
        setUserProfile(updated);
      }
      alert("პროფილის სურათი განახლდა!");
    } catch (error) {
      console.error("Profile pic upload error:", error);
      alert("სურათის ატვირთვა ვერ მოხერხდა.");
    } finally {
      setIsUploadingProfilePic(false);
    }
  };

  return (
    <div className="userPage">
      {user ? (
        <div className="user-container">
          <div className="profileContainer">
            <div className="profile-img-wrapper">
              <div
                className="profileIcon"
                style={userProfile?.profile_img_url ? { backgroundImage: `url(${userProfile.profile_img_url})` } : {}}
              >
                {isUploadingProfilePic && <div className="img-loading-overlay">...</div>}
              </div>
              <label className="change-img-btn">
                📸
                <input type="file" accept="image/*" onChange={handleProfilePicUpload} hidden disabled={isUploadingProfilePic} />
              </label>
            </div>
            <h2>{userProfile?.name || user.name || 'Anonymous'}</h2>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '10px', marginTop: '5px' }}>{user.email}</p>

            {isEditingDescription ? (
              <div style={{ marginTop: '15px', width: '100%' }}>
                <textarea
                  value={profileDescription}
                  onChange={(e) => setProfileDescription(e.target.value)}
                  placeholder="დაამატეთ თქვენი აღწერა..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '10px',
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #444',
                    borderRadius: '5px',
                    color: 'white',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem',
                    resize: 'vertical'
                  }}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={handleSaveDescription} className="post-toggle-btn" style={{ flex: 1, background: '#5b744d' }}>
                    შენახვა
                  </button>
                  <button onClick={() => {
                    setIsEditingDescription(false);
                    setProfileDescription(userProfile?.description || '');
                  }} className="post-toggle-btn" style={{ flex: 1, background: '#3d2929' }}>
                    გაუქმება
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '10px' }}>
                <p style={{ fontSize: '0.9rem', fontStyle: 'italic', opacity: 0.8, marginBottom: '8px' }}>
                  {profileDescription || 'აღწერა არ არის დამატებული'}
                </p>
                <button
                  onClick={() => setIsEditingDescription(true)}
                  className="post-toggle-btn"
                  style={{ fontSize: '0.85rem', padding: '6px 12px', background: '#333' }}
                >
                  ✏️ აღწერის რედაქტირება
                </button>
              </div>
            )}
            <div className="profile-actions-vertical">
              <button
                className="post-toggle-btn"
                onClick={() => {
                  setShowUpload(!showUpload);
                  setEditingArticle(null);
                }}
              >
                {showUpload || editingArticle ? 'გაუქმება' : 'სტატიის დამატება +'}
              </button>
              <Link to={`/profile/${user.$id}`} className="post-toggle-btn" style={{ textDecoration: 'none', background: '#333' }}>
                საჯარო პროფილი
              </Link>
            </div>
          </div>

          <AnimatePresence>
            {(showUpload || editingArticle) && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="upload-section"
              >
                <h3>{editingArticle ? 'სტატიის რედაქტირება' : 'ახალი სტატიის გამოქვეყნება'}</h3>
                <form
                  onSubmit={editingArticle ? handleUpdateArticle : handleUpload}
                  className="upload-form"
                >
                  <input
                    type="text"
                    placeholder="სათაური"
                    value={editingArticle ? editTitle : title}
                    onChange={e => editingArticle ? setEditTitle(e.target.value) : setTitle(e.target.value)}
                    required
                  />
                  <textarea
                    placeholder="მოკლე აღწერა"
                    value={editingArticle ? editDescription : description}
                    onChange={e => editingArticle ? setEditDescription(e.target.value) : setDescription(e.target.value)}
                    required
                  />
                  <textarea
                    placeholder="სრული ტექსტი"
                    value={editingArticle ? editFullText : fullText}
                    onChange={e => editingArticle ? setEditFullText(e.target.value) : setFullText(e.target.value)}
                    className="full-text-input"
                    required
                  />

                  {!editingArticle && (
                    <div className="file-input-container">
                      <label>სურათის ატვირთვა:</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => setImageFile(e.target.files[0])}
                        required
                      />
                    </div>
                  )}

                  {!editingArticle && (
                    <div className="captcha-container">
                      <p>დაადასტურეთ რომ ადამიანი ხართ: {captchaChallenge.a} + {captchaChallenge.b} = ?</p>
                      <input
                        type="number"
                        placeholder="პასუხი"
                        value={captchaInput}
                        onChange={e => setCaptchaInput(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <div className="form-actions">
                    <button type="submit" disabled={isUploading || (!editingArticle && postLimitReached)} className="submit-article-btn">
                      {isUploading ? 'იტვირთება...' : (editingArticle ? 'შენახვა' : (postLimitReached ? 'ლიმიტი ამოიწურა' : 'გამოქვეყნება'))}
                    </button>
                    {editingArticle && (
                      <button type="button" className="cancel-btn" onClick={() => setEditingArticle(null)}>
                        გაუქმება
                      </button>
                    )}
                  </div>
                  {!editingArticle && postLimitReached && <p className="limit-warning">დღიური ლიმიტი (3 პოსტი) ამოწურულია.</p>}
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* My Articles Management */}
          <div className="management-section">
            <h3>ჩემი გამოქვეყნებული სტატიები</h3>
            {myArticles.length === 0 ? (
              <p className="empty-msg">თქვენ ჯერ არ გამოგიქვეყნებიათ სტატია.</p>
            ) : (
              <div className="articles-manage-grid">
                {myArticles.map(article => (
                  <div key={article.$id} className="manage-card">
                    <div className="manage-card-img" style={{ backgroundImage: `url(${article.imageUrl})` }}></div>
                    <div className="manage-card-info">
                      <h4>{article.title}</h4>
                      <div className="manage-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(article)}
                        >
                          რედაქტირება
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteArticle(article.$id)}
                        >
                          წაშლა
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="history-section">
            <h3 className="section-title">ხმის მიცემის ისტორია</h3>
            {votedArticles.length === 0 ? (
              <p className="empty-msg">თქვენ ჯერ არ მიგიციათ ხმა არცერთი სტატიისთვის.</p>
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
                      <Link to={`/article/${article.id}`} className="vote-card-link">
                        <div className="vote-card-image" style={{ backgroundImage: `url(${article.imageUrl})` }}>
                          <div className="vote-badge" style={{ backgroundColor: article.voteType === 1 ? '#5b744d' : '#3d2929' }}>
                            {article.voteType === 1 ? '💚 მოწონებული' : '💔 დაწუნებული'}
                          </div>
                        </div>
                        <div className="vote-card-content">
                          <h4>{article.title}</h4>
                        </div>
                      </Link>
                      <div className="vote-card-actions">
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
        </div>
      ) : (
        <p>იტვირთება...</p>
      )}
    </div>
  );
};

export default UserPage;

