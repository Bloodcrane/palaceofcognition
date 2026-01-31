// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { account } from './appwrite';

const ProtectedRoute = ({ element }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setUser(user);
      } catch (error) {
        // Not logged in
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;
