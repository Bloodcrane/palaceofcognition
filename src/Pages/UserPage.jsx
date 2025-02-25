import React, { useState, useEffect } from 'react';
import supabase from '../supabase';
import './UserPage.css';
import HeaderLayout from '../Layouts/Header';

const UserPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        // Redirect to login if no user is found
        window.location.href = '/login';
      }
    };
    fetchUser();
  }, []);

  return (
    <div>
        <HeaderLayout/>
        <div className="userPage">
        {user ? (
            <div className="profileContainer">
            <div className="profileIcon">
            </div>
            <h2>{user.email}</h2>
            <p>თქვენ პროფილის გვერდი</p>
            </div>
        ) : (
            <p>იტვირთება...</p>
        )}
        </div>
    </div>
  );
};

export default UserPage;
