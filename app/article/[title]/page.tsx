'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';
import { databases } from '@/appwrite';
import articles from '@/Articles.json';

const VOTES_DATABASE_ID = '697e6e0200022dd882b7';
const ARTICLES_COLLECTION_ID = 'articles';

const SingleArticlePage = () => {
    const params = useParams();
    const articleId = params.title as string;

    const [article, setArticle] = useState<any>(null);
    const [fullText, setFullText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1224px)' });

    useEffect(() => {
        const loadArticle = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const staticArticle = (articles as any[]).find((a) => a.id.toString() === articleId);

                if (staticArticle) {
                    setArticle(staticArticle);
                    if (staticArticle.fullText) {
                        const response = await fetch(staticArticle.fullText);
                        if (!response.ok) throw new Error("Failed to fetch static text");
                        const text = await response.text();
                        setFullText(text);
                    }
                } else {
                    const dynamicArticle = await databases.getDocument(
                        VOTES_DATABASE_ID,
                        ARTICLES_COLLECTION_ID,
                        articleId
                    );

                    if (dynamicArticle) {
                        setArticle({
                            title: dynamicArticle.title,
                            author: dynamicArticle.author,
                            imageUrl: dynamicArticle.imageUrl,
                            description: dynamicArticle.description,
                            user_id: dynamicArticle.user_id,
                            isDynamic: true
                        });
                        setFullText(dynamicArticle.fullText);
                    }
                }
            } catch (err) {
                console.error("Error loading article:", err);
                setError("სტატიის ჩატვირთვა ვერ მოხერხდა.");
            } finally {
                setIsLoading(false);
            }
        };

        if (articleId) loadArticle();
    }, [articleId]);

    useEffect(() => {
        if (article) {
            document.title = `${article.title} | Palace of Cognition`;
        }
    }, [article]);

    if (isLoading) return <div className="loading-container">იტვირთება...</div>;
    if (error || !article) return <div className="error-container">{error || "სტატია ვერ მოიძებნა"}</div>;

    return (
        <div>
            <div>
                <div
                    className="article-container"
                    style={{ display: 'flex', backgroundSize: 'cover', backgroundPosition: 'center', width: 'auto', height: 'auto' }}
                >
                    <div
                        style={{
                            backdropFilter: 'blur(50px)',
                            marginTop: '60px',
                            backgroundImage: 'linear-gradient(#131313, #0c0c0c)',
                            textAlign: 'center',
                            width: '100%',
                            borderBottom: '1px solid #333'
                        }}
                    >
                        <h1>{article.title}</h1>
                        <p>
                            ავტორი: {article.isDynamic && article.user_id ? (
                                <Link href={`/profile/${article.user_id}`} style={{ color: '#598eff', textDecoration: 'none' }}>
                                    {article.author}
                                </Link>
                            ) : (
                                article.author
                            )}
                        </p>
                        <div style={{ position: 'relative', width: '90%', maxWidth: '90%', margin: '0 auto', height: isDesktopOrLaptop ? '400px' : '250px' }}>
                            <Image
                                src={article.imageUrl}
                                fill
                                alt=""
                                style={{ objectFit: 'contain', borderRadius: '10px', border: '1px solid #444' }}
                                sizes="(min-width: 1224px) 900px, 90vw"
                            />
                        </div>
                        <div
                            className="fullText"
                            style={{
                                maxWidth: isDesktopOrLaptop ? '900px' : '90%',
                                margin: '40px auto',
                                fontSize: isDesktopOrLaptop ? '21px' : '18px',
                                lineHeight: '1.6',
                                textAlign: 'left',
                                padding: '0 20px',
                                whiteSpace: 'pre-wrap'
                            }}
                        >
                            {fullText}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleArticlePage;
