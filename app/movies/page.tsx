import type { Metadata } from 'next';
import { Suspense } from 'react';
import MovieList from '@/components/MovieList';

export const metadata: Metadata = {
    title: 'კინოკლუბი | Palace of Cognition',
};

const MoviesPage = () => {
    return (
        <div>
            <main>
                <h1 style={{ marginTop: '95px' }}>კინოკლუბი</h1>
                <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '100px' }}>იტვირთება...</div>}>
                    <MovieList />
                </Suspense>
            </main>
        </div>
    );
};

export default MoviesPage;
