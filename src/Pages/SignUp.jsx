import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabase';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignInRedirect = () => {
    navigate("/login");
  }

  const handleSignUp = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/login');
    }
  };

  return (
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
        <button style={{ backgroundColor: '#757352' }} className='webComponent-button'  type="submit">მზად არის</button>
        <button style={{ backgroundColor: '#2d5972' }} className='webComponent-button' onClick={handleSignInRedirect}>ანგარიშზე შესვლა</button>
      </form>
    </div>
  );
};

export default SignUp;
