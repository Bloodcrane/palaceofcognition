import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { databases, storage } from '../appwrite';
import { ID, Query } from 'appwrite';
import './UserPage.css'; // Reuse UserPage styles

const VOTES_DATABASE_ID = '697e6e0200022dd882b7';
const BOOKS_COLLECTION_ID = 'books';
const MOVIES_COLLECTION_ID = 'movies';
const IMAGES_BUCKET_ID = '697e88ae002f9e02cadb';

const AdminPage = ({ user }) => {
    const [type, setType] = useState('book'); // 'book' or 'movie'
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [recentUploads, setRecentUploads] = useState([]);

    const isAdmin = user && user.labels && user.labels.includes('admin');

    const fetchRecent = useCallback(async () => {
        if (!isAdmin) return;
        try {
            const collectionId = type === 'book' ? BOOKS_COLLECTION_ID : MOVIES_COLLECTION_ID;
            const response = await databases.listDocuments(
                VOTES_DATABASE_ID,
                collectionId,
                [Query.orderDesc('$createdAt'), Query.limit(5)]
            );
            setRecentUploads(response.documents);
        } catch (error) {
            console.error("Error fetching recent uploads:", error);
        }
    }, [isAdmin, type]);

    useEffect(() => {
        fetchRecent();
    }, [fetchRecent]);

    if (!user) return <Navigate to="/login" />;
    if (!isAdmin) return (
        <div style={{ marginTop: '150px', textAlign: 'center' }}>
            <h1>წვდომა უარყოფილია</h1>
            <p>ამ გვერდის სანახავად საჭიროა ადმინისტრატორის უფლებები.</p>
        </div>
    );

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            alert("გთხოვთ აირჩიოთ სურათი.");
            return;
        }

        setIsUploading(true);
        try {
            // 1. Upload image
            const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), imageFile);
            const imageUrl = storage.getFileView(IMAGES_BUCKET_ID, file.$id).toString();

            // 2. Create document
            const collectionId = type === 'book' ? BOOKS_COLLECTION_ID : MOVIES_COLLECTION_ID;
            await databases.createDocument(
                VOTES_DATABASE_ID,
                collectionId,
                ID.unique(),
                {
                    title,
                    author,
                    description,
                    imageUrl
                }
            );

            alert(`${type === 'book' ? 'წიგნი' : 'ფილმი'} წარმატებით აიტვირთა!`);
            // Reset form
            setTitle('');
            setAuthor('');
            setDescription('');
            setImageFile(null);
            fetchRecent();
        } catch (error) {
            console.error("Upload error:", error);
            alert("ატვირთვა ვერ მოხერხდა. შეამოწმეთ კონსოლი.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (docId) => {
        if (!window.confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა?")) return;
        try {
            const collectionId = type === 'book' ? BOOKS_COLLECTION_ID : MOVIES_COLLECTION_ID;
            await databases.deleteDocument(VOTES_DATABASE_ID, collectionId, docId);
            fetchRecent();
        } catch (error) {
            console.error("Delete error:", error);
            alert("წაშლა ვერ მოხერხდა.");
        }
    };

    return (
        <div className="userPage adminPage">
            <div className="user-container">
                <div className="profileContainer">
                    <h2>ადმინ პანელი</h2>
                    <p>კონტენტის მართვა (წიგნები და ფილმები)</p>
                    <div className="profile-actions" style={{ marginTop: '20px' }}>
                        <button
                            className={`post-toggle-btn ${type === 'book' ? 'active' : ''}`}
                            onClick={() => setType('book')}
                            style={{ marginRight: '10px', background: type === 'book' ? '#5b744d' : '' }}
                        >
                            წიგნები
                        </button>
                        <button
                            className={`post-toggle-btn ${type === 'movie' ? 'active' : ''}`}
                            onClick={() => setType('movie')}
                            style={{ background: type === 'movie' ? '#5b744d' : '' }}
                        >
                            ფილმები
                        </button>
                    </div>
                </div>

                <div className="upload-section" style={{ display: 'block', opacity: 1 }}>
                    <h3>ახალი {type === 'book' ? 'წიგნის' : 'ფილმის'} დამატება</h3>
                    <form onSubmit={handleUpload} className="upload-form">
                        <input
                            type="text"
                            placeholder="სათაური"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="ავტორი / რეჟისორი"
                            value={author}
                            onChange={e => setAuthor(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="აღწერა"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        />
                        <div className="file-input-container">
                            <label>სურათი:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setImageFile(e.target.files[0])}
                                required
                            />
                        </div>
                        <button type="submit" disabled={isUploading} className="submit-article-btn">
                            {isUploading ? 'იტვირთება...' : 'გამოქვეყნება'}
                        </button>
                    </form>
                </div>

                <div className="management-section">
                    <h3>ბოლო ატვირთვები ({type === 'book' ? 'წიგნები' : 'ფილმები'})</h3>
                    <div className="articles-manage-grid">
                        {recentUploads.map(doc => (
                            <div key={doc.$id} className="manage-card">
                                <div className="manage-card-img" style={{ backgroundImage: `url(${doc.imageUrl})` }}></div>
                                <div className="manage-card-info">
                                    <h4>{doc.title}</h4>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{doc.author}</p>
                                    <div className="manage-actions">
                                        <button className="delete-btn" onClick={() => handleDelete(doc.$id)}>წაშლა</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
