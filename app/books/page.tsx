import type { Metadata } from 'next';
import { Suspense } from 'react';
import BookList from '@/components/BookList';

export const metadata: Metadata = {
    title: 'წიგნის წრე | Palace of Cognition',
};

const BooksPage = () => {
    return (
        <div>
            <main>
                <h1 style={{ marginTop: '95px' }}>წიგნის წრე</h1>
                <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '100px' }}>იტვირთება...</div>}>
                    <BookList />
                </Suspense>
            </main>
        </div>
    );
};

export default BooksPage;
