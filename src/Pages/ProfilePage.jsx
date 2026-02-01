import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { databases } from '../appwrite';
import { Query } from 'appwrite';
import { motion, AnimatePresence } from 'framer-motion';
import './UserPage.css'; // Reuse UserPage styles

const VOTES_DATABASE_ID = '697e6e0200022dd882b7';
const ARTICLES_COLLECTION_ID = 'articles';
const PROFILES_COLLECTION_ID = 'user_profiles';

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

const ProfilePage = () => {
    const { id: userId } = useParams();
    const [userArticles, setUserArticles] = useState([]);
    const [authorName, setAuthorName] = useState('');
    const [profileImgUrl, setProfileImgUrl] = useState('');
    const [profileDescription, setProfileDescription] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            setIsLoading(true);
            let detectedName = '';
            try {
                // 1. Fetch public profile metadata
                try {
                    const profileRes = await databases.listDocuments(
                        VOTES_DATABASE_ID,
                        PROFILES_COLLECTION_ID,
                        [Query.equal('user_id', userId)]
                    );
                    if (profileRes.documents.length > 0) {
                        const prof = profileRes.documents[0];
                        detectedName = prof.name;
                        setAuthorName(prof.name);
                        setProfileImgUrl(prof.profile_img_url);
                        setProfileDescription(prof.description || '');
                    }
                } catch (profErr) {
                    console.error("Error fetching public profile:", profErr);
                }

                // 2. Fetch articles
                const response = await databases.listDocuments(
                    VOTES_DATABASE_ID,
                    ARTICLES_COLLECTION_ID,
                    [
                        Query.equal('user_id', userId),
                        Query.orderDesc('$createdAt')
                    ]
                );

                setUserArticles(response.documents);

                // If name still empty, try fallback from articles
                if (!detectedName && response.documents.length > 0) {
                    setAuthorName(response.documents[0].author);
                } else if (!detectedName) {
                    setAuthorName('მომხმარებელი');
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    return (
        <div className="userPage profilePage">
            <div className="user-container">
                <motion.div
                    className="profileContainer"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div
                        className="profileIcon"
                        style={profileImgUrl ? { backgroundImage: `url(${profileImgUrl})` } : {}}
                    ></div>
                    <h2>{authorName}</h2>
                    {profileDescription && (
                        <p style={{ fontSize: '0.9rem', fontStyle: 'italic', opacity: 0.8, marginTop: '10px', maxWidth: '300px' }}>
                            {profileDescription}
                        </p>
                    )}
                    <p style={{ marginTop: profileDescription ? '5px' : '0' }}>ავტორის პროფილი</p>
                </motion.div>

                <div className="management-section" style={{ marginTop: '50px' }}>
                    <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                        გამოქვეყნებული სტატიები
                    </h3>

                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'mainFont' }}
                            >
                                იტვირთება...
                            </motion.div>
                        ) : userArticles.length > 0 ? (
                            <motion.div
                                key="content"
                                variants={container}
                                initial="hidden"
                                animate="show"
                                style={{ width: '100%' }}
                            >
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', width: '100%' }}>
                                    {userArticles.map((article) => (
                                        <motion.div
                                            key={article.$id}
                                            variants={item}
                                            className="webComponent"
                                            style={{ margin: '0' }}
                                            whileHover={{ scale: 1.02, border: '1px solid rgba(255,255,255,0.3)' }}
                                        >
                                            <img src={article.imageUrl} className="webComponent-bg-img" alt="" />
                                            <div className="webComponent-overlay" style={{ height: 'auto' }}>
                                                <h2 className="webComponent-title">{article.title}</h2>
                                                <p className="webComponent-description">{article.description}</p>
                                            </div>
                                            <img src={article.imageUrl} className="webComponent-img" alt="" />
                                            <div className="compact-button-row">
                                                <Link to={`/article/${article.$id}`} className="compact-button" style={{ width: '100%', textAlign: 'center' }}>
                                                    🗞️ ნახვა
                                                </Link>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ textAlign: 'center', marginTop: '50px', opacity: 0.6 }}
                            >
                                სტატიები არ მოიძებნა.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
