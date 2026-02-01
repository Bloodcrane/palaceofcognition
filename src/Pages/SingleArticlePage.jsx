import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import articles from '../Articles.json';
import { useMediaQuery } from 'react-responsive';
import { Helmet } from 'react-helmet';
import { databases } from '../appwrite';

const VOTES_DATABASE_ID = '697e6e0200022dd882b7';
const ARTICLES_COLLECTION_ID = 'articles';

const SingleArticlePage = () => {
  const { title: articleId } = useParams();

  const [article, setArticle] = useState(null);
  const [fullText, setFullText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1224px)' });

  useEffect(() => {
    const loadArticle = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Try finding in local JSON
        const staticArticle = articles.find((a) => a.id.toString() === articleId);

        if (staticArticle) {
          setArticle(staticArticle);
          // Fetch full text for static article (it's usually a URL/path)
          if (staticArticle.fullText) {
            const response = await fetch(staticArticle.fullText);
            if (!response.ok) throw new Error("Failed to fetch static text");
            const text = await response.text();
            setFullText(text);
          }
        } else {
          // 2. Try fetching from Appwrite
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
              description: dynamicArticle.description
            });
            // For dynamic articles, fullText is stored directly in the DB
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

    loadArticle();
  }, [articleId]);

  const generateMetaTags = () => {
    if (article) {
      return (
        <Helmet>
          <title>{article.title}</title>
          <meta name="description" content={article.description || 'No description provided'} />
          <meta property="og:title" content={article.title} />
          <meta property="og:description" content={article.description || 'No description provided'} />
          <meta property="og:image" content={article.imageUrl} />
        </Helmet>
      );
    }
    return null;
  };

  if (isLoading) {
    return <div className="loading-container">იტვირთება...</div>;
  }

  if (error || !article) {
    return <div className="error-container">{error || "სტატია ვერ მოიძებნა"}</div>;
  }

  return (
    <div>
      {generateMetaTags()}
      <div>
        <div
          className="article-container"
          style={{
            display: 'flex',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: 'auto',
            height: 'auto',
          }}
        >
          <div
            style={{
              backdropFilter: 'blur(50px)',
              marginTop: "60px",
              backgroundImage: 'linear-gradient(#131313, #0c0c0c)',
              textAlign: 'center',
              width: '100%',
              borderBottom: '1px solid #333'
            }}
          >
            <h1>{article.title}</h1>
            <p>ავტორი: {article.author}</p>
            <img
              src={article.imageUrl}
              alt=""
              style={{
                width: "auto",
                height: isDesktopOrLaptop ? "400px" : "250px",
                borderRadius: "10px",
                border: '1px solid #444',
                maxWidth: '90%'
              }}
            />
            <div
              className="fullText"
              style={{
                maxWidth: isDesktopOrLaptop ? '900px' : '90%',
                margin: '40px auto',
                fontSize: isDesktopOrLaptop ? '21px' : '18px',
                lineHeight: '1.6',
                textAlign: 'left',
                padding: '0 20px',
                whiteSpace: 'pre-wrap' // Important for dynamic text layout
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
