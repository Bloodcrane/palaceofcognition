'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { databases } from '@/appwrite';
import { Query } from 'appwrite';
import books from '@/Books.json';

const VOTES_DATABASE_ID = '697e6e0200022dd882b7';
const BOOKS_COLLECTION_ID = 'books';
const booksPerPage = 3;

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 }
};

const BookList = () => {
    const [allBooks, setAllBooks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const searchParams = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1');

    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            try {
                const response = await databases.listDocuments(
                    VOTES_DATABASE_ID,
                    BOOKS_COLLECTION_ID,
                    [Query.orderDesc('$createdAt')]
                );

                const dynamicMapped = response.documents.map(doc => ({
                    id: doc.$id,
                    title: doc.title,
                    description: doc.description,
                    imageUrl: doc.imageUrl,
                    author: doc.author,
                    isDynamic: true
                }));

                setAllBooks([...dynamicMapped, ...books]);
            } catch (error) {
                console.error("Error fetching books:", error);
                setAllBooks(books);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const totalPages = Math.ceil(allBooks.length / booksPerPage);
    const startIndex = (currentPage - 1) * booksPerPage;
    const currentBooks = useMemo(() => allBooks.slice(startIndex, startIndex + booksPerPage), [allBooks, startIndex]);

    const handlePageChange = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ textAlign: 'center', marginTop: '100px', width: '100%', minHeight: '500px' }}
                    >
                        იტვირთება...
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        variants={container}
                        initial="hidden"
                        animate="show"
                        style={{ width: '100%', minHeight: '500px' }}
                    >
                        <div style={{ marginBottom: '100px' }}>
                            {currentBooks.map((book) => (
                                <motion.div
                                    key={book.id}
                                    variants={item}
                                    className="webComponent"
                                    whileHover={{ scale: 1.01, border: '1px solid rgba(255,255,255,0.4)' }}
                                >
                                    <div style={{ position: 'relative', gridRow: '1 / 5', gridColumn: '1' }}>
                                        <Image
                                            src={book.imageUrl}
                                            fill
                                            alt=""
                                            sizes="480px"
                                            style={{ objectFit: 'cover', opacity: 0.4, filter: 'blur(8px)' }}
                                        />
                                    </div>
                                    <div className="webComponent-overlay">
                                        <h2 className="webComponent-title">{book.title}</h2>
                                        <div className="webComponent-meta">
                                            <span className="webComponent-author">{book.author}</span>
                                        </div>
                                        <p className="webComponent-description">{book.description}</p>
                                    </div>
                                    <div style={{ position: 'relative', gridRow: '2', gridColumn: '1', width: '100%', height: '250px' }}>
                                        <Image
                                            src={book.imageUrl}
                                            fill
                                            alt={book.title}
                                            sizes="480px"
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="pagination-container-compact">
                <Link href={`?page=${currentPage > 1 ? currentPage - 1 : 1}`} className="comp-nav-btn" onClick={handlePageChange} aria-disabled={currentPage === 1}>←</Link>
                <span className="page-indicator">{currentPage} / {totalPages}</span>
                <Link href={`?page=${currentPage < totalPages ? currentPage + 1 : totalPages}`} className="comp-nav-btn" onClick={handlePageChange} aria-disabled={currentPage === totalPages}>→</Link>
            </div>
        </>
    );
};

export default BookList;
