import React from 'react';
import { useNavigate } from 'react-router-dom';

const WebAnnoucement = ({imageUrl, title, description}) => {
    const navigate = useNavigate();

    const style = {
        backgroundImage: "url('./Images/Style/noise-dark.png'), linear-gradient(to top, #4d71d3, #db6946)",
        borderColor: '#919191',
      };

      const handleSignInRedirect = () => {
        navigate("/signup");
      }

    return (
        <div style={style} className="latestNews">
        <img src={imageUrl} className="latestNews-image" alt="" />
        <h1 className="latestNews-title">{title}</h1>
        <label className="latestNews-description">{description}</label>
        <button style={{ backgroundColor: '#6c6f79', borderColor: '#8d9fc5' }} className='webComponent-button' onClick={handleSignInRedirect}>ახალი ანგარიშის შექმნა</button>
        </div>
    )
}

export default WebAnnoucement