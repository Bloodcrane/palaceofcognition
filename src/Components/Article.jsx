import React from 'react';
import { Link } from 'react-router-dom';

const ArticleComponent = ({ imageUrl, title, description }) => {


  return (
    <div className="webComponent">
      <div className='webComponent-inside-container'>
        <img src={imageUrl} alt={title} className="webComponent-image" />
        <h2 className="webComponent-title">{title}</h2>
        <p className="webComponent-description">{description}</p>
        <div className='btnMargin'>
        <Link to={`/article/${encodeURIComponent(title)}`} className="webComponent-button">View More</Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleComponent;
