'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { account, databases } from '@/appwrite';
import { Query, ID } from 'appwrite';
import { motion, AnimatePresence } from 'framer-motion';
import '@/Pages/UserPage.css';

const VOTES_DATABASE_ID = '697e6e0200022dd882b7';
const ARTICLES_COLLECTION_ID = 'articles';
const PROFILES_COLLECTION_ID = 'user_profiles';
const FOLLOWS_COLLECTION_ID = 'user_follows';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 }
};

const ProfilePage = () => {
    const params = useParams();
    const userId = params.id as string;
    const router = useRouter();

    const [currentUser, setCurrentUser] = useState<any>(null);
    const [userArticles, setUserArticles] = useState<any[]>([]);
    const [authorName, setAuthorName] = useState('');
    const [profileImgUrl, setProfileImgUrl] = useState('');
    const [profileDescription, setProfileDescription] = useState('');
    const [followerCount, setFollowerCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followDocId, setFollowDocId] = useState<string | null>(null);
    const [isLoadingFollow, setIsLoadingFollow] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const u = await account.get();
                setCurrentUser(u);
            } catch {
                // Not logged in
            }
        };
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const fetchUserProfile = async () => {
            setIsLoading(true);
            let detectedName = '';
            try {
                try {
                    const profileRes = await databases.listDocuments(VOTES_DATABASE_ID, PROFILES_COLLECTION_ID, [Query.equal('user_id', userId)]);
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

                const response = await databases.listDocuments(VOTES_DATABASE_ID, ARTICLES_COLLECTION_ID, [Query.equal('user_id', userId), Query.orderDesc('$createdAt')]);
                setUserArticles(response.documents);

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
                const followersRes = await databases.listDocuments(VOTES_DATABASE_ID, FOLLOWS_COLLECTION_ID, [Query.equal('following_id', userId)]);
                setFollowerCount(followersRes.total);
            } catch (error) {
                console.error("Error fetching follow data:", error);
            }
        };

        fetchUserProfile();
        fetchFollowData();
    }, [userId]);

    useEffect(() => {
        if (!currentUser || !userId) return;

        const checkFollowing = async () => {
            try {
                const myFollowRes = await databases.listDocuments(VOTES_DATABASE_ID, FOLLOWS_COLLECTION_ID, [
                    Query.equal('follower_id', currentUser.$id),
                    Query.equal('following_id', userId)
                ]);
                if (myFollowRes.documents.length > 0) {
                    setIsFollowing(true);
                    setFollowDocId(myFollowRes.documents[0].$id);
                }
            } catch (error) {
                console.error("Error checking follow status:", error);
            }
        };
        checkFollowing();
    }, [currentUser, userId]);

    const handleFollowToggle = async () => {
        if (!currentUser) { router.push('/login'); return; }

        setIsLoadingFollow(true);
        try {
            if (isFollowing && followDocId) {
                await databases.deleteDocument(VOTES_DATABASE_ID, FOLLOWS_COLLECTION_ID, followDocId);
                setIsFollowing(false);
                setFollowDocId(null);
                setFollowerCount(prev => prev - 1);
            } else {
                const newFollow = await databases.createDocument(VOTES_DATABASE_ID, FOLLOWS_COLLECTION_ID, ID.unique(), {
                    follower_id: currentUser.$id, following_id: userId
                });
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
                <motion.div className="profileContainer" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="profileIcon" style={profileImgUrl ? { backgroundImage: `url(${profileImgUrl})` } : {}}></div>
                    <h2>{authorName}</h2>
                    {profileDescription && (
                        <p style={{ fontSize: '0.9rem', fontStyle: 'italic', opacity: 0.8, marginTop: '10px', maxWidth: '300px' }}>{profileDescription}</p>
                    )}
                    <p style={{ marginTop: profileDescription ? '5px' : '0' }}>ავტორის პროფილი</p>
                    <p style={{ fontSize: '0.95rem', color: '#888', marginTop: '8px' }}>👥 {followerCount} ფოლოვერი</p>

                    {currentUser && currentUser.$id !== userId && (
                        <button onClick={handleFollowToggle} disabled={isLoadingFollow} className="post-toggle-btn" style={{ marginTop: '15px', background: isFollowing ? '#3d2929' : '#598eff', cursor: isLoadingFollow ? 'not-allowed' : 'pointer', opacity: isLoadingFollow ? 0.6 : 1 }}>
                            {isLoadingFollow ? '...' : (isFollowing ? '✓ აფოლოვებ' : '+ დააფოლოვე')}
                        </button>
                    )}

                    {!currentUser && (
                        <button onClick={() => router.push('/login')} className="post-toggle-btn" style={{ marginTop: '15px', background: '#598eff' }}>+ დააფოლოვე</button>
                    )}
                </motion.div>

                <div className="management-section" style={{ marginTop: '50px' }}>
                    <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>გამოქვეყნებული სტატიები</h3>

                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', marginTop: '50px' }}>
                                იტვირთება...
                            </motion.div>
                        ) : userArticles.length > 0 ? (
                            <motion.div key="content" variants={container} initial="hidden" animate="show" style={{ width: '100%' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', width: '100%' }}>
                                    {userArticles.map((article) => (
                                        <motion.div key={article.$id} variants={item} className="webComponent" style={{ margin: '0' }} whileHover={{ scale: 1.02, border: '1px solid rgba(255,255,255,0.3)' }}>
                                            <div style={{ position: 'relative', gridRow: '1 / 5', gridColumn: '1' }}>
                                                <Image src={article.imageUrl} fill alt="" sizes="320px" style={{ objectFit: 'cover', opacity: 0.4, filter: 'blur(8px)' }} />
                                            </div>
                                            <div className="webComponent-overlay" style={{ height: 'auto' }}>
                                                <h2 className="webComponent-title">{article.title}</h2>
                                                <p className="webComponent-description">{article.description}</p>
                                            </div>
                                            <div style={{ position: 'relative', gridRow: '2', gridColumn: '1', width: '100%', height: '200px' }}>
                                                <Image src={article.imageUrl} fill alt={article.title} sizes="320px" style={{ objectFit: 'contain' }} />
                                            </div>
                                            <div className="compact-button-row">
                                                <Link href={`/article/${article.$id}`} className="compact-button" style={{ width: '100%', textAlign: 'center' }}>🗞️ ნახვა</Link>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', marginTop: '50px', opacity: 0.6 }}>
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
