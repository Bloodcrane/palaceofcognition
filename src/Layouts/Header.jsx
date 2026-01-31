import { Link, useLocation } from "react-router-dom";
import { React, useState } from "react";
import { useMediaQuery } from 'react-responsive';
import { motion, AnimatePresence } from 'framer-motion';

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

    const containerVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const navItemVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const MotionLink = motion(Link);

    return (
        <div>
            {/* Desktop Structure */}
            {isDesktopOrLaptop && (
                <motion.header
                    className='layoutDiv'
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <h2>Palace Of Cognition</h2>
                    <div className="headerButtons">
                        <AnimatePresence mode="popLayout">
                            {!isHome && (
                                <MotionLink
                                    layout
                                    key="home-link"
                                    variants={navItemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={handlePageChange}
                                    className="layoutButton"
                                    to={'/'}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    მთავარი
                                </MotionLink>
                            )}
                        </AnimatePresence>
                        <MotionLink variants={navItemVariants} onClick={handlePageChange} className="layoutButton" to={'/books'} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>წიგნები</MotionLink>
                        <MotionLink variants={navItemVariants} onClick={handlePageChange} className="layoutButton" to={'/movies'} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>ფილმები</MotionLink>
                        <MotionLink variants={navItemVariants} onClick={handlePageChange} className="layoutButton" to={'/articles'} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>რეცენზიები</MotionLink>
                        <MotionLink variants={navItemVariants} onClick={handlePageChange} style={{ borderColor: '#598eff', color: '#598eff' }} className="layoutButton" to={'/signup'} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>ანგარიში</MotionLink>
                    </div>
                </motion.header>
            )}

            {/* Mobile Structure */}
            {isTabletOrMobile && (
                <header className='layoutDiv'>
                    <button className="mobileShowButton" onClick={toggleMobileNav}>მენიუ</button>
                    <div className={showMobileNav ? 'mobile-nav show' : 'mobile-nav'}>
                        <button className="mobileShowButton" onClick={toggleMobileNav}>მენიუ</button>
                        <AnimatePresence>
                            {!isHome && <MotionLink layout onClick={handlePageChange} className="layoutButton-mobile" to={'/'} whileTap={{ scale: 0.95 }}>მთავარი</MotionLink>}
                        </AnimatePresence>
                        <MotionLink onClick={handlePageChange} className="layoutButton-mobile" to={'/books'} whileTap={{ scale: 0.95 }}>წიგნები</MotionLink>
                        <MotionLink onClick={handlePageChange} className="layoutButton-mobile" to={'/movies'} whileTap={{ scale: 0.95 }}>ფილმები</MotionLink>
                        <MotionLink onClick={handlePageChange} className="layoutButton-mobile" to={'/articles'} whileTap={{ scale: 0.95 }}>რეცენზიები</MotionLink>
                        <MotionLink onClick={handlePageChange} style={{ borderColor: '#598eff', color: '#598eff' }} className="layoutButton-mobile" to={'/signup'} whileTap={{ scale: 0.95 }}>ანგარიში</MotionLink>
                    </div>
                </header>
            )}
        </div>
    );
};

export default HeaderLayout;

