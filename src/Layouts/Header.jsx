import { Link, useLocation } from "react-router-dom";
import { React, useState } from "react";
import { useMediaQuery } from 'react-responsive';

const HeaderLayout = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    const handlePageChange = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
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
                    <div className="headerButtons">
                        {!isHome && (
                            <Link
                                layout
                                key="home-link"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={handlePageChange}
                                className="layoutButton"
                                to={'/'}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                მთავარი
                            </Link>
                        )}
                        <Link onClick={handlePageChange} className="layoutButton" to={'/books'} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>წიგნები</Link>
                        <Link onClick={handlePageChange} className="layoutButton" to={'/movies'} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>ფილმები</Link>
                        <Link onClick={handlePageChange} className="layoutButton" to={'/articles'} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>სტატიები</Link>
                        <Link onClick={handlePageChange} style={{ borderColor: '#598eff', color: '#598eff' }} className="layoutButton" to={'/signup'} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>ანგარიში</Link>
                    </div>
                </header>
            )}

            {/* Mobile Structure */}
            {isTabletOrMobile && (
                <header className='layoutDiv'>
                    <button className="mobileShowButton" onClick={toggleMobileNav}>მენიუ</button>
                    <div className={showMobileNav ? 'mobile-nav show' : 'mobile-nav'}>
                        <button className="mobileShowButton" onClick={toggleMobileNav}>მენიუ</button>
                        {!isHome && (
                            <Link
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={handlePageChange}
                                className="layoutButton-mobile"
                                to={'/'}
                                whileTap={{ scale: 0.95 }}
                            >
                                მთავარი
                            </Link>
                        )}
                        <Link onClick={handlePageChange} className="layoutButton-mobile" to={'/books'} whileTap={{ scale: 0.95 }}>წიგნები</Link>
                        <Link onClick={handlePageChange} className="layoutButton-mobile" to={'/movies'} whileTap={{ scale: 0.95 }}>ფილმები</Link>
                        <Link onClick={handlePageChange} className="layoutButton-mobile" to={'/articles'} whileTap={{ scale: 0.95 }}>სტატიები</Link>
                        <Link onClick={handlePageChange} style={{ borderColor: '#598eff', color: '#598eff' }} className="layoutButton-mobile" to={'/signup'} whileTap={{ scale: 0.95 }}>ანგარიში</Link>
                    </div>
                </header>
            )}
        </div>
    );
};

export default HeaderLayout;

