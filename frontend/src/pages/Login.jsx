import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');  // Changed from email
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(username, password);
        
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error.detail || 'Invalid username or password');
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-black flex items-center justify-center px-4'>
            <div className='max-w-md w-full'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <h1 className='text-4xl font-bold text-white mb-2'>Welcome Back</h1>
                    <p className='text-gray-400'>Login to access your account</p>
                </div>

                {/* Login Form */}
                <div className='bg-gray-900 rounded-2xl p-8 border border-gray-800'>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {/* Error Message */}
                        {error && (
                            <div className='bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg flex items-center gap-2'>
                                <AlertCircle size={20} />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Username Field */}
                        <div>
                            <label htmlFor='username' className='block text-white font-medium mb-2'>
                                Username
                            </label>
                            <div className='relative'>
                                <Mail className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500' size={20} />
                                <input
                                    type='text'
                                    id='username'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder='Enter your username'
                                    className='w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors'
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor='password' className='block text-white font-medium mb-2'>
                                Password
                            </label>
                            <div className='relative'>
                                <Lock className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500' size={20} />
                                <input
                                    type='password'
                                    id='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder='Enter your password'
                                    className='w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors'
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors'
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className='mt-6 text-center'>
                        <p className='text-gray-400'>
                            Don't have an account?{' '}
                            <Link to='/register' className='text-blue-400 hover:text-blue-300 font-semibold'>
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className='text-center mt-6'>
                    <Link to='/' className='text-gray-400 hover:text-white transition-colors'>
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;