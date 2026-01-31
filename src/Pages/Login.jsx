import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../appwrite';
import './LogInUp.css';
import HeaderLayout from '../Layouts/Header';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await account.get();
        if (user) {
          navigate('/user');
        }
      } catch (error) {
        // Not logged in
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignUpRedirect = () => {
    navigate('/signup');
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await account.createEmailPasswordSession(email, password);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <HeaderLayout />
      <div className='loginPage'>
        <h2>გთხოვთ, შეიყვანეთ თქვენი ანგარიში.</h2>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <form onSubmit={handleLogin}>
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
          <button style={{ backgroundColor: '#5baa51' }} className='webComponent-button-2' type="submit">შესვლა</button>
          <button style={{ backgroundColor: '#2d5972' }} className='webComponent-button-2' onClick={handleSignUpRedirect}>ანგარიშის შექმნა</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
