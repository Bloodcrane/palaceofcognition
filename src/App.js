import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { client, account } from './appwrite';
import LoaderLayout from './Layouts/Loader';
import HeaderLayout from './Layouts/Header';
import './App.css';
import PageTransition from './Components/PageTransition';

const Login = lazy(() => import('./Pages/Login'));
const SignUp = lazy(() => import('./Pages/SignUp'));

const AboutPage = lazy(() => import('./Pages/AboutPage'));
const ArticlePage = lazy(() => import('./Pages/ArticlePage'));
const HomePage = lazy(() => import('./Pages/HomePage'));
const MoviePage = lazy(() => import('./Pages/MoviePage'));
const BookPage = lazy(() => import('./Pages/BookPage'));
const SingleArticlePage = lazy(() => import('./Pages/SingleArticlePage'));
const UserPage = lazy(() => import('./Pages/UserPage'));

const AnimatedRoutes = () => {
  const location = useLocation();
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
    <div className="content-container">
      <HeaderLayout />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/login" element={<PageTransition>{user ? <Navigate to="/user" /> : <Login />}</PageTransition>} />
          <Route path="/signup" element={<PageTransition>{user ? <Navigate to="/user" /> : <SignUp />}</PageTransition>} />
          <Route path="/user" element={<PageTransition>{user ? <UserPage user={user} /> : <Navigate to="/login" />}</PageTransition>} />
          <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
          <Route path="/articles" element={<PageTransition><ArticlePage /></PageTransition>} />
          <Route path="/books" element={<PageTransition><BookPage /></PageTransition>} />
          <Route path="/movies" element={<PageTransition><MoviePage /></PageTransition>} />
          <Route path="/article/:title" element={<PageTransition><SingleArticlePage /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Suspense fallback={<LoaderLayout />}>
        <AnimatedRoutes />
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
