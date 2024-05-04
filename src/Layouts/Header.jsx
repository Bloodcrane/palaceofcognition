import { Link, Outlet } from "react-router-dom";
import React from "react";

// const colors = ['#383431', '#523553', '#34405f', '#375239', '#6e5d39'];

const HeaderLayout = ({ showMain = true, showBooks = true, showMovies = true, showArticles = true }) => {

    const handlePageChange = () => {
        window.scrollTo({top: 0, left: 0, behavior: 'smooth' });
    };

    // const randomColor = colors[Math.floor(Math.random() * colors.length)];

    // const Style = {
    //     backgroundColor: randomColor,
    // };

    return (
        <div className='layoutDiv'>
            {showMain && <Link onClick={handlePageChange()} className="layoutButton" to={'/'}>მთავარი</Link>}
            {showBooks && <Link onClick={handlePageChange()} className="layoutButton" to={'/books'}>წიგნები</Link>}
            {showMovies && <Link onClick={handlePageChange()} className="layoutButton" to={'/movies'}>ფილმები</Link>}
            {showArticles && <Link onClick={handlePageChange()} className="layoutButton" to={'/articles'}>რეცენზიები</Link>}

            <Outlet />
        </div>
    );
};

export default HeaderLayout;
