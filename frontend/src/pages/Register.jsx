import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');  // Own state
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { register } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password length
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        // Validate email format if provided
        if (email && !email.includes('@') || !email.includes('.')) {
            setError('Please enter a valid email address (e.g., user@example.com)');
            return;
        }

        setLoading(true);

        // Don't send confirmPassword to backend
        const result = await register({ username, email, password });
        
        if (result.success) {
            navigate('/');
        } else {
            // Better error handling
            const errorMsg = result.error?.username?.[0] || 
                           result.error?.password?.[0] || 
                           result.error?.detail || 
                           'Registration failed. Please try again.';
            setError(errorMsg);
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-black flex items-center justify-center px-4 py-12'>
            <div className='max-w-md w-full'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <h1 className='text-4xl font-bold text-white mb-2'>Create Account</h1>
                    <p className='text-gray-400'>Join Autohire today</p>
                </div>

                {/* Register Form */}
                <div className='bg-gray-900 rounded-2xl p-8 border border-gray-800'>
                    <form onSubmit={handleSubmit} className='space-y-5'>
                        {/* Error Message */}
                        {error && (
                            <div className='bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg flex items-center gap-2'>
                                <AlertCircle size={20} />
                                <span className='text-sm'>{error}</span>
                            </div>
                        )}

                        {/* Username Field */}
                        <div>
                            <label htmlFor='username' className='block text-white font-medium mb-2'>
                                Username
                            </label>
                            <div className='relative'>
                                <User className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500' size={20} />
                                <input
                                    type='text'
                                    id='username'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder='Choose a username'
                                    className='w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors'
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor='email' className='block text-white font-medium mb-2'>
                                Email
                            </label>
                            <div className='relative'>
                                <Mail className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500' size={20} />
                                <input
                                    type='email'
                                    id='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Enter your email'
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
                                    minLength={8}
                                    placeholder='At least 8 characters'
                                    className='w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors'
                                />
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor='confirmPassword' className='block text-white font-medium mb-2'>
                                Confirm Password
                            </label>
                            <div className='relative'>
                                <Lock className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500' size={20} />
                                <input
                                    type='password'
                                    id='confirmPassword'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder='Re-enter your password'
                                    className='w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors'
                                />
                            </div>
                            {/* Password match indicator */}
                            {password && confirmPassword && (
                                <p className={`text-sm mt-1 ${password === confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                                    {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors mt-6'
                        >
                            {loading ? 'Creating Account...' : 'Register'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className='mt-6 text-center'>
                        <p className='text-gray-400'>
                            Already have an account?{' '}
                            <Link to='/login' className='text-blue-400 hover:text-blue-300 font-semibold'>
                                Login here
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

export default Register;