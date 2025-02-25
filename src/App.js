import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import supabase from './supabase';
import LoaderLayout from './Layouts/Loader';
import './App.css';

import Login from './Pages/Login';
import SignUp from './Pages/SignUp';

const AboutPage = lazy(() => import('./Pages/AboutPage'));
const ArticlePage = lazy(() => import('./Pages/ArticlePage'));
const HomePage = lazy(() => import('./Pages/HomePage'));
const MoviePage = lazy(() => import('./Pages/MoviePage'));
const BookPage = lazy(() => import('./Pages/BookPage'));
const SingleArticlePage = lazy(() => import('./Pages/SingleArticlePage'));
const UserPage = lazy(() => import('./Pages/UserPage'));

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Suspense fallback={<LoaderLayout />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={user ? <Navigate to="/user" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/user" /> : <SignUp />} />
          <Route path="/user" element={user ? <UserPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/articles" element={<ArticlePage />} />
          <Route path="/books" element={<BookPage />} />
          <Route path="/movies" element={<MoviePage />} />
          <Route path="/article/:title" element={<SingleArticlePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
