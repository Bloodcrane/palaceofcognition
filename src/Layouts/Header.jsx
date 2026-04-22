import { Link, useLocation } from "react-router-dom";
import { React, useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive';

const HeaderLayout = ({ user }) => {
    const location = useLocation();

    const [showMobileNav, setShowMobileNav] = useState(false);
    const isAdmin = user && user.labels && user.labels.includes('admin');

    const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1224px)' });
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

    const toggleMobileNav = () => {
        setShowMobileNav(!showMobileNav);
    };

    const closeMobileNav = () => {
        setShowMobileNav(false);
    };

    const handlePageChange = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        closeMobileNav();
    };

    // Close menu when route changes
    useEffect(() => {
        closeMobileNav();
    }, [location]);

    return (
        <nav>
            {/* Desktop Dock */}
            {isDesktopOrLaptop && (
                <header className="layoutDiv">
                    <Link to="/" className="layoutButton" onClick={handlePageChange}>მთავარი</Link>
                    <Link to="/articles" className="layoutButton" onClick={handlePageChange}>სტატიები</Link>
                    <Link to="/books" className="layoutButton" onClick={handlePageChange}>წიგნები</Link>
                    <Link to="/movies" className="layoutButton" onClick={handlePageChange}>ფილმები</Link>
                    <Link to="/user" className="layoutButton" onClick={handlePageChange}>პროფილი</Link>
                    {isAdmin && <Link to="/admin" className="layoutButton" onClick={handlePageChange}>ადმინი</Link>}
                </header>
            )}

            {/* Mobile Dock */}
            {isTabletOrMobile && (
                <>
                    <header className="layoutDiv mobileHeader">
                        <button className="layoutButton" onClick={toggleMobileNav}>
                            {showMobileNav ? "დახურვა" : "მენიუ"}
                        </button>
                    </header>

                    <div className={showMobileNav ? "mobile-nav show" : "mobile-nav"}>
                        <Link to="/" className="layoutButton-mobile" onClick={handlePageChange}>მთავარი</Link>
                        <Link to="/articles" className="layoutButton-mobile" onClick={handlePageChange}>სტატიები</Link>
                        <Link to="/books" className="layoutButton-mobile" onClick={handlePageChange}>წიგნები</Link>
                        <Link to="/movies" className="layoutButton-mobile" onClick={handlePageChange}>ფილმები</Link>
                        <Link to="/user" className="layoutButton-mobile" onClick={handlePageChange}>პროფილი</Link>
                        {isAdmin && <Link to="/admin" className="layoutButton-mobile" onClick={handlePageChange}>ადმინი</Link>}
                    </div>
                </>
            )}
        </nav>
    );
};

export default HeaderLayout;

