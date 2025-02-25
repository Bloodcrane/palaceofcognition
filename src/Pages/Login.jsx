import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabase';
import "./LogInUp.css"

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUpRedirect = () => {
    navigate("/signup");
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }
  };

  return (
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
  );
};

export default Login;
