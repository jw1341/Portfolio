import { useState, useRef, useEffect, useCallback } from 'react';
import { loginUser, unloadUserData } from '../services/authService';
import './Login.css';
import { Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const loginFields = useRef(null);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const loginData = { username, password };
        try {
            await loginUser(loginData);
        } catch (err) {
            console.error('Login error:', err);
            setError('Login failed. Please check your credentials.');
        }
    }, [username, password]);
    
    useEffect(() => {
        unloadUserData();

        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                handleSubmit(e);
            }
        };

        const element = loginFields.current;
        if (element) {
            element.addEventListener('keypress', handleKeyPress);
        }

        return () => {
            if (element) {
                element.removeEventListener('keypress', handleKeyPress);
            }
        };
    }, [username, password, handleSubmit]);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>

                <form onSubmit={handleSubmit} ref={loginFields} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-red-500">{error}</p>}

                    <button type="submit" className="login-button">
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
