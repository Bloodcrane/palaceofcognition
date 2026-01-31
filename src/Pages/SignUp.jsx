import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../appwrite';
import { ID } from 'appwrite';
import HeaderLayout from '../Layouts/Header';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await account.get();
        if (user) navigate('/user');
      } catch (error) {
        // Not logged in
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignInRedirect = () => {
    navigate('/login');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await account.create(ID.unique(), email, password);
      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <HeaderLayout />
      <div className='loginPage'>
        <h2>ახალი ანგარიშის შექმნა</h2>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <form onSubmit={handleSignUp}>
          <input
            type="email"
            placeholder="იმეილი"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="პაროლი"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button style={{ backgroundColor: '#757352' }} className='webComponent-button' type="submit">მზად არის</button>
          <button style={{ backgroundColor: '#2d5972' }} className='webComponent-button' onClick={handleSignInRedirect}>ანგარიშზე შესვლა</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
