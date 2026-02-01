import React from 'react';

const LatestNewsComponent = ({ imageUrl, title, description }) => {
    return (
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
    )
}

export default LatestNewsComponent