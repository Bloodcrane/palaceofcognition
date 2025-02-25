import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import articles from '../Articles.json';
import { useMediaQuery } from 'react-responsive';
import { Helmet } from 'react-helmet';
import HeaderLayout from '../Layouts/Header';
import { v5 as uuidv5 } from 'uuid';

// Use the same namespace as in your article list component
const ARTICLE_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

// Helper to check if a string is a valid UUID
function isValidUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

const SingleArticlePage = () => {
  // The URL parameter now holds the computed UUID from the article list.
  const { title: articleUUID } = useParams();
  console.log('Article UUID from URL:', articleUUID);

  // Find the matching article by computing its stable UUID.
  const article = articles.find((article) => {
    // If article.id is already a valid UUID, use it; otherwise, compute a UUID using uuidv5.
    const computedUUID = isValidUUID(article.id.toString())
      ? article.id.toString()
      : uuidv5(article.id.toString(), ARTICLE_NAMESPACE);
    return computedUUID === articleUUID;
  });

  const [fullText, setFullText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1224px)' });

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

  useEffect(() => {
    if (article && article.fullText) {
      setIsLoading(true);
      const fetchFullText = async () => {
        try {
          const response = await fetch(article.fullText);
          if (!response.ok) {
            throw new Error(`Error fetching full text: ${response.statusText}`);
          }
          const text = await response.text();
          setFullText(text);
        } catch (error) {
          console.error('Error fetching full text:', error);
          setError(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchFullText();
    }
  }, [article]);

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div>
      {generateMetaTags()}
      <div>
        <header>
          <HeaderLayout showMain={false} showBooks={true} showMovies={true} showArticles={true} />
        </header>
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
              textShadow: '2px 2px 5px black',
              backgroundImage: 'linear-gradient(#131313, #0c0c0c)',
              textAlign: 'center'
            }}
          >
            <h1>{article.title}</h1>
            <p>ავტორი: {article.author}</p>
            <img
              src={article.imageUrl}
              alt=""
              style={{
                width: "auto",
                height: "300px",
                borderRadius: "10px",
                boxShadow: "0px 5px 5px #00000099"
              }}
            />
            {isLoading
              ? 'Loading full text...'
              : error
              ? 'Error loading full text'
              : (
                <p
                  className="fullText"
                  style={{
                    maxWidth: isDesktopOrLaptop ? '800px' : '400px',
                    margin: '0 auto',
                    fontSize: '23px'
                  }}
                >
                  {fullText}
                </p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleArticlePage;
