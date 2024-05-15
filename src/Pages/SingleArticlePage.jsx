import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import articles from '../Articles.json';
import { Helmet } from 'react-helmet';
import HeaderLayout from '../Layouts/Header';

const SingleArticlePage = () => {
  const { id } = useParams();
  console.log("ID from URL:", id);
  const article = articles.find((article) => article.id === id);
  const [fullText, setFullText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
            backgroundImage: `url(${article.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: 'auto',
            height: 'auto',
          }}
        >
          <div style={{ backdropFilter: 'blur(15px)', marginTop: "60px", textShadow: '2px 2px 5px black', backgroundColor: '#2e2e2e8b', textAlign: 'center' }}>
            <h1>{article.title}</h1>
            <p>ავტორი: {article.author}</p>
            {isLoading ? 'Loading full text...' : error ? 'Error loading full text' : (
              <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '20px' }}>{fullText}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleArticlePage;
