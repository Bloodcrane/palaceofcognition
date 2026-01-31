import React, { useState, useEffect } from 'react';
import { account } from '../appwrite';
import './UserPage.css';
import HeaderLayout from '../Layouts/Header';

const UserPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        if (user) {
          setUser(user);
        }
      } catch (error) {
        window.location.href = '/login';
      }
    };
    fetchUser();
  }, []);

  return (
    <div>
      <HeaderLayout />
      <div className="userPage">
        {user ? (
          <div className="profileContainer">
            <div className="profileIcon">
            </div>
            <h2>{user.email}</h2>
            <p>თქვენი პროფილის გვერდი</p>
          </div>
        ) : (
          <p>იტვირთება...</p>
        )}
      </div>
    </div>
  );
};

export default UserPage;
