'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/appwrite';
import { ID } from 'appwrite';
import '@/Pages/LogInUp.css';

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
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

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await account.create(ID.unique(), email, password, name);
            router.push('/login');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <div className="loginPage">
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
                    <button style={{ backgroundColor: '#757352' }} className="webComponent-button-2" type="submit">მზად არის</button>
                    <button style={{ backgroundColor: '#2d5972' }} className="webComponent-button-2" type="button" onClick={() => router.push('/login')}>ანგარიშზე შესვლა</button>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
