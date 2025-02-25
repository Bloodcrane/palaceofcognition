import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabase';
import HeaderLayout from '../Layouts/Header';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/user'); // Redirect to user page if already logged in
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignInRedirect = () => {
    navigate('/login');
  };

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
    <div>
        <HeaderLayout/>
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
