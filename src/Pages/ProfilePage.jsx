import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { databases } from '../appwrite';
import { Query, ID } from 'appwrite';
import { motion, AnimatePresence } from 'framer-motion';
import './UserPage.css'; // Reuse UserPage styles

const VOTES_DATABASE_ID = '697e6e0200022dd882b7';
const ARTICLES_COLLECTION_ID = 'articles';
const PROFILES_COLLECTION_ID = 'user_profiles';
const FOLLOWS_COLLECTION_ID = 'user_follows';

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

const ProfilePage = ({ user }) => {
    const { id: userId } = useParams();
    const navigate = useNavigate();
    const [userArticles, setUserArticles] = useState([]);
    const [authorName, setAuthorName] = useState('');
    const [profileImgUrl, setProfileImgUrl] = useState('');
    const [profileDescription, setProfileDescription] = useState('');
    const [followerCount, setFollowerCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followDocId, setFollowDocId] = useState(null);
    const [isLoadingFollow, setIsLoadingFollow] = useState(false);
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

        const fetchFollowData = async () => {
            try {
                // 1. Count followers
                const followersRes = await databases.listDocuments(
                    VOTES_DATABASE_ID,
                    FOLLOWS_COLLECTION_ID,
                    [Query.equal('following_id', userId)]
                );
                setFollowerCount(followersRes.total);

                // 2. Check if current user is following (only if logged in)
                if (user) {
                    const myFollowRes = await databases.listDocuments(
                        VOTES_DATABASE_ID,
                        FOLLOWS_COLLECTION_ID,
                        [
                            Query.equal('follower_id', user.$id),
                            Query.equal('following_id', userId)
                        ]
                    );
                    if (myFollowRes.documents.length > 0) {
                        setIsFollowing(true);
                        setFollowDocId(myFollowRes.documents[0].$id);
                    }
                }
            } catch (error) {
                console.error("Error fetching follow data:", error);
            }
        };

        fetchUserProfile();
        fetchFollowData();
    }, [userId, user]);

    const handleFollowToggle = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setIsLoadingFollow(true);
        try {
            if (isFollowing) {
                // Unfollow
                await databases.deleteDocument(
                    VOTES_DATABASE_ID,
                    FOLLOWS_COLLECTION_ID,
                    followDocId
                );
                setIsFollowing(false);
                setFollowDocId(null);
                setFollowerCount(prev => prev - 1);
            } else {
                // Follow
                const newFollow = await databases.createDocument(
                    VOTES_DATABASE_ID,
                    FOLLOWS_COLLECTION_ID,
                    ID.unique(),
                    {
                        follower_id: user.$id,
                        following_id: userId
                    }
                );
                setIsFollowing(true);
                setFollowDocId(newFollow.$id);
                setFollowerCount(prev => prev + 1);
            }
        } catch (error) {
            console.error("Follow toggle error:", error);
            alert("მოქმედება ვერ შესრულდა.");
        } finally {
            setIsLoadingFollow(false);
        }
    };

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

                    {/* Follower Count */}
                    <p style={{ fontSize: '0.95rem', color: '#888', marginTop: '8px' }}>
                        👥 {followerCount} ფოლოვერი
                    </p>

                    {/* Follow Button - only show if not viewing own profile */}
                    {user && user.$id !== userId && (
                        <button
                            onClick={handleFollowToggle}
                            disabled={isLoadingFollow}
                            className="post-toggle-btn"
                            style={{
                                marginTop: '15px',
                                background: isFollowing ? '#3d2929' : '#598eff',
                                cursor: isLoadingFollow ? 'not-allowed' : 'pointer',
                                opacity: isLoadingFollow ? 0.6 : 1
                            }}
                        >
                            {isLoadingFollow ? '...' : (isFollowing ? '✓ აფოლოვებ' : '+ დააფოლოვე')}
                        </button>
                    )}

                    {!user && (
                        <button
                            onClick={() => navigate('/login')}
                            className="post-toggle-btn"
                            style={{ marginTop: '15px', background: '#598eff' }}
                        >
                            + დააფოლოვე
                        </button>
                    )}
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
