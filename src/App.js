import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { client, account } from './appwrite';
import LoaderLayout from './Layouts/Loader';
import './App.css';

const Login = lazy(() => import('./Pages/Login'));
const SignUp = lazy(() => import('./Pages/SignUp'));

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
    client.ping();
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
