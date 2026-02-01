import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const WebAnnoucement = ({ imageUrl, title, description, author }) => {
  const navigate = useNavigate();

  const handleSignInRedirect = () => {
    navigate("/signup");
  }

  return (
    <div className="latestNews">
      {imageUrl && <img src={imageUrl} className="webComponent-bg-img" alt="" />}
      <div className="webComponent-overlay">
        <h1 className="webComponent-title">{title}</h1>
        <Link to={`/profile/697e9164002cfe5d9083`} className="webComponent-author" style={{ textDecoration: 'none', color: '#598eff' }}>
          {author}
        </Link>
        <label className="webComponent-description">{description}</label>
      </div>
      {imageUrl && <img src={imageUrl} className="webComponent-img" alt="" />}
      <div className="compact-button-row" style={{ justifyContent: 'center' }}>
        <button className='compact-button' onClick={handleSignInRedirect}>
          ახალი ანგარიშის შექმნა
        </button>
      </div>
    </div>
  )
}

export default WebAnnoucement