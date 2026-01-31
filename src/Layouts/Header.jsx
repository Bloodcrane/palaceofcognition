import { Link, useLocation } from "react-router-dom";
import { React, useState } from "react";
import { useMediaQuery } from 'react-responsive';
import { motion } from 'framer-motion';

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

    const navItemVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                type: "spring",
                stiffness: 100
            }
        })
    };

    const MotionLink = motion(Link);

    return (
        <div>
            {/* Desktop Structure */}
            {isDesktopOrLaptop && (
                <motion.header
                    className='layoutDiv'
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2>Palace Of Cognition</h2>
                    {!isHome && <MotionLink custom={0} variants={navItemVariants} initial="hidden" animate="visible" onClick={handlePageChange} className="layoutButton" to={'/'} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>მთავარი</MotionLink>}
                    <MotionLink custom={1} variants={navItemVariants} initial="hidden" animate="visible" onClick={handlePageChange} className="layoutButton" to={'/books'} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>წიგნები</MotionLink>
                    <MotionLink custom={2} variants={navItemVariants} initial="hidden" animate="visible" onClick={handlePageChange} className="layoutButton" to={'/movies'} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>ფილმები</MotionLink>
                    <MotionLink custom={3} variants={navItemVariants} initial="hidden" animate="visible" onClick={handlePageChange} className="layoutButton" to={'/articles'} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>რეცენზიები</MotionLink>
                    <MotionLink custom={4} variants={navItemVariants} initial="hidden" animate="visible" onClick={handlePageChange} style={{ borderColor: '#598eff', color: '#598eff' }} className="layoutButton" to={'/signup'} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>ანგარიში</MotionLink>
                </motion.header>
            )}

            {/* Mobile Structure */}
            {isTabletOrMobile && (
                <header className='layoutDiv'>
                    <button className="mobileShowButton" onClick={toggleMobileNav}>მენიუ</button>
                    <div className={showMobileNav ? 'mobile-nav show' : 'mobile-nav'}>
                        <button className="mobileShowButton" onClick={toggleMobileNav}>მენიუ</button>
                        {!isHome && <MotionLink onClick={handlePageChange} className="layoutButton-mobile" to={'/'} whileTap={{ scale: 0.95 }}>მთავარი</MotionLink>}
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

