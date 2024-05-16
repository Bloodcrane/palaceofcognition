import { Link, Outlet } from "react-router-dom";
import {React, useState} from "react";
import { useMediaQuery } from 'react-responsive';

const HeaderLayout = ({ showMain = true, showBooks = true, showMovies = true, showArticles = true }) => {

    const handlePageChange = () => {
        window.scrollTo({top: 0, left: 0, behavior: 'smooth' });
    };

    const [showMobileNav, setShowMobileNav] = useState(false);

    const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1224px)' });
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

    const toggleMobileNav = () => {
        setShowMobileNav(!showMobileNav);
    };

    return (
        <div>
            {/* Desktop Structure */}
            {isDesktopOrLaptop && (
            <header className='layoutDiv'>
                <h2>Palace Of Cognition</h2>
                {<Link onClick={handlePageChange()} className="layoutButton" to={'/'}>მთავარი</Link>}
                {<Link onClick={handlePageChange()} className="layoutButton" to={'/books'}>წიგნები</Link>}
                {<Link onClick={handlePageChange()} className="layoutButton" to={'/movies'}>ფილმები</Link>}
                {<Link onClick={handlePageChange()} className="layoutButton" to={'/articles'}>რეცენზიები</Link>}

                <Outlet />
            </header>
            )}

            {/* Mobile Structure */}
            {isTabletOrMobile && (
            <header className='layoutDiv'>
                    <button className="mobileShowButton" onClick={toggleMobileNav}>მენიუ</button>
                    <div className={showMobileNav ? 'mobile-nav show' : 'mobile-nav'}>
                    <button className="mobileShowButton" onClick={toggleMobileNav}>მენიუ</button>
                    {<Link onClick={handlePageChange()} className="layoutButton-mobile" to={'/'}>მთავარი</Link>}
                    {<Link onClick={handlePageChange()} className="layoutButton-mobile" to={'/books'}>წიგნები</Link>}
                    {<Link onClick={handlePageChange()} className="layoutButton-mobile" to={'/movies'}>ფილმები</Link>}
                    {<Link onClick={handlePageChange()} className="layoutButton-mobile" to={'/articles'}>რეცენზიები</Link>}
                    </div>
                <Outlet />
            </header>
            )}
        </div>
    );
};

export default HeaderLayout;
