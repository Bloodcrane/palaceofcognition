'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive';
import { account } from '@/appwrite';

const HeaderLayout = () => {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [showMobileNav, setShowMobileNav] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await account.get();
                setUser(user);
            } catch (error) {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

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
    }, [pathname]);

    return (
        <nav>
            {/* Desktop Dock */}
            {isDesktopOrLaptop && (
                <header className="layoutDiv">
                    <Link href="/" className="layoutButton" onClick={handlePageChange}>მთავარი</Link>
                    <Link href="/articles" className="layoutButton" onClick={handlePageChange}>სტატიები</Link>
                    <Link href="/books" className="layoutButton" onClick={handlePageChange}>წიგნები</Link>
                    <Link href="/movies" className="layoutButton" onClick={handlePageChange}>ფილმები</Link>
                    <Link href="/user" className="layoutButton" onClick={handlePageChange}>პროფილი</Link>
                    {isAdmin && <Link href="/admin" className="layoutButton" onClick={handlePageChange}>ადმინი</Link>}
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
                        <Link href="/" className="layoutButton-mobile" onClick={handlePageChange}>მთავარი</Link>
                        <Link href="/articles" className="layoutButton-mobile" onClick={handlePageChange}>სტატიები</Link>
                        <Link href="/books" className="layoutButton-mobile" onClick={handlePageChange}>წიგნები</Link>
                        <Link href="/movies" className="layoutButton-mobile" onClick={handlePageChange}>ფილმები</Link>
                        <Link href="/user" className="layoutButton-mobile" onClick={handlePageChange}>პროფილი</Link>
                        {isAdmin && <Link href="/admin" className="layoutButton-mobile" onClick={handlePageChange}>ადმინი</Link>}
                    </div>
                </>
            )}
        </nav>
    );
};

export default HeaderLayout;
