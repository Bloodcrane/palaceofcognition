import React from 'react';

const colors = ['#927d7d', '#8a7c74', '#877692', '#6e7b88'];

const BookComponent = ({ imageUrl, title, description, author}) => {

  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const Style = {
    backgroundColor: randomColor,
    border: `2px solid ${randomColor}`, // Specify the border color
    boxShadow: `0px 0px 30px ${randomColor}`,
  };

  return (
    <div className="webComponent" style={Style}>
      <div className='webComponent-inside-container'>
        <img src={imageUrl} alt={title} className="webComponent-image" />
        <h2 className="webComponent-title">{title}</h2>
        <label className='webComponent-author'>{author}</label>
        <p className="webComponent-description">{description}</p>
      </div>
    </div>
  );
};

export default BookComponent;