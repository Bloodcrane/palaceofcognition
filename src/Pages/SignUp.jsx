import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../appwrite';
import { ID } from 'appwrite';
import './LogInUp.css';

const SignUp = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await account.get();
        if (user) {
          if (onLogin) onLogin(user);
          navigate('/user');
        }
      } catch (error) {
        // Not logged in
      }
    };
    checkUser();
  }, [navigate, onLogin]);

  const handleSignInRedirect = () => {
    navigate('/login');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await account.create(ID.unique(), email, password, name);
      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <div className='loginPage'>
        <h2>ახალი ანგარიშის შექმნა</h2>
        {error && <div style={{ color: 'red', marginTop: '5rem', position: 'absolute', top: 0 }}>{error}</div>}
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="სახელი"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="იმეილი"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="პაროლი"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button style={{ backgroundColor: '#757352' }} className='webComponent-button-2' type="submit">მზად არის</button>
          <button style={{ backgroundColor: '#2d5972' }} className='webComponent-button-2' onClick={handleSignInRedirect}>ანგარიშზე შესვლა</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
