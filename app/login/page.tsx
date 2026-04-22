'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/appwrite';
import '@/Pages/LogInUp.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            try {
                await account.get();
                router.push('/user');
            } catch {
                // Not logged in, stay on page
            }
        };
        checkUser();
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await account.createEmailPasswordSession(email, password);
            router.push('/');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <div className="loginPage">
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
                    <button style={{ backgroundColor: '#5baa51' }} className="webComponent-button-2" type="submit">შესვლა</button>
                    <button style={{ backgroundColor: '#2d5972' }} className="webComponent-button-2" type="button" onClick={() => router.push('/signup')}>ანგარიშის შექმნა</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
