import type { Metadata } from 'next';
import { Suspense } from 'react';
import ArticleList from '@/components/ArticleList';

export const metadata: Metadata = {
    title: 'სტატიები | Palace of Cognition',
    description: 'View more articles',
};

const ArticlesPage = () => {
    return (
        <div>
            <h1 style={{ marginTop: '95px' }}>სტატიები</h1>
            <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '100px' }}>იტვირთება...</div>}>
                <ArticleList />
            </Suspense>
        </div>
    );
};

export default ArticlesPage;
