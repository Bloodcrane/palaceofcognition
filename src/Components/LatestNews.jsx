import React from 'react';
import { Link } from 'react-router-dom';

const LatestNewsComponent = ({ imageUrl, title, description, articleId }) => {
    const cardContent = (
        <div className="latestNews">
            <img src={imageUrl} className="webComponent-bg-img" alt="" />
            <div className="webComponent-overlay">
                <h1 className="webComponent-title">{title}</h1>
                <label className="webComponent-description">{description}</label>
            </div>
            <img src={imageUrl} className="webComponent-img" alt="" />
            <div className="compact-button-row">
                <span className="compact-button">🗞️ ნახვა</span>
            </div>
        </div>
    );

    if (articleId) {
        return (
            <Link to={`/article/${articleId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {cardContent}
            </Link>
        );
    }

    return cardContent;
}

export default LatestNewsComponent;