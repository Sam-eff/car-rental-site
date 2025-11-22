
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authApi, bookingApi } from '../store/api';
import { User, Lock, Mail, Calendar, Car, AlertCircle, CheckCircle } from 'lucide-react';


const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ total: 0, active: 0, cancelled: 0 });
    
    // Profile form
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: ''
    });
    const [profileSuccess, setProfileSuccess] = useState('');
    const [profileError, setProfileError] = useState('');
    
    // Password form
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Fetch user profile and stats
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get profile
                const profileResponse = await authApi.getProfile();
                setProfileData({
                    username: profileResponse.data.username || '',
                    email: profileResponse.data.email || '',
                    first_name: profileResponse.data.first_name || '',
                    last_name: profileResponse.data.last_name || ''
                });

                // Get booking stats
                const bookingsResponse = await bookingApi.getUserBookings();
                const bookings = bookingsResponse.data.results || bookingsResponse.data;
                const total = bookings.length;
                const active = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length;
                const cancelled = bookings.filter(b => b.status === 'cancelled').length;
                setStats({ total, active, cancelled });
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchData();
    }, []);

    // Handle profile update
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileError('');
        setProfileSuccess('');
        setLoading(true);

        try {
            const response = await authApi.updateProfile(profileData);
            setProfileSuccess('Profile updated successfully!');
            
            // Update context
            if (setUser) {
                setUser(response.data.user);
            }

            setTimeout(() => setProfileSuccess(''), 3000);
        } catch (error) {
            setProfileError(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    // Handle password change
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        // Validate
        if (passwordData.new_password !== passwordData.confirm_password) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordData.new_password.length < 8) {
            setPasswordError('New password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            await authApi.changePassword({
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            });
            
            setPasswordSuccess('Password changed successfully!');
            setPasswordData({
                old_password: '',
                new_password: '',
                confirm_password: ''
            });

            setTimeout(() => setPasswordSuccess(''), 3000);
        } catch (error) {
            setPasswordError(error.response?.data?.error || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='min-h-screen bg-black text-white py-20 px-4'>
                <div className='container mx-auto max-w-7xl'>
                    {/* Header */}
                    <div className='mb-12 mt-12'>
                        <h1 className='text-4xl md:text-5xl font-bold mb-4'>Profile Settings</h1>
                        <p className='text-gray-400 text-lg'>Manage your account information</p>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        {/* Left Column - Stats */}
                        <div className='space-y-6'>
                            {/* User Info Card */}
                            <div className='bg-gray-900 p-6 rounded-xl border border-gray-800'>
                                <div className='flex items-center gap-4 mb-4'>
                                    <div className='w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center'>
                                        <User size={32} />
                                    </div>
                                    <div>
                                        <h3 className='text-xl font-bold'>{user?.username}</h3>
                                        <p className='text-gray-400 text-sm'>{user?.email}</p>
                                    </div>
                                </div>
                                <div className='pt-4 border-t border-gray-800'>
                                    <div className='flex items-center gap-2 text-gray-400 text-sm'>
                                        <Calendar size={16} />
                                        <span>Member since {new Date(user?.date_joined || Date.now()).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className='bg-gray-900 p-6 rounded-xl border border-gray-800'>
                                <h3 className='text-lg font-bold mb-4'>Booking Statistics</h3>
                                <div className='space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <span className='text-gray-400'>Total Bookings</span>
                                        <span className='text-2xl font-bold text-blue-400'>{stats.total}</span>
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <span className='text-gray-400'>Active Rentals</span>
                                        <span className='text-2xl font-bold text-green-400'>{stats.active}</span>
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <span className='text-gray-400'>Cancelled</span>
                                        <span className='text-2xl font-bold text-red-400'>{stats.cancelled}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Forms */}
                        <div className='lg:col-span-2 space-y-8'>
                            {/* Profile Information */}
                            <div className='bg-gray-900 p-8 rounded-xl border border-gray-800'>
                                <h2 className='text-2xl font-bold mb-6'>Profile Information</h2>

                                {profileSuccess && (
                                    <div className='mb-4 bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg flex items-center gap-2'>
                                        <CheckCircle size={20} />
                                        <span>{profileSuccess}</span>
                                    </div>
                                )}

                                {profileError && (
                                    <div className='mb-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg flex items-center gap-2'>
                                        <AlertCircle size={20} />
                                        <span>{profileError}</span>
                                    </div>
                                )}

                                <form onSubmit={handleProfileSubmit} className='space-y-6'>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <div>
                                            <label className='block text-white font-medium mb-2'>
                                                Username
                                            </label>
                                            <input
                                                type='text'
                                                value={profileData.username}
                                                disabled
                                                className='w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed'
                                            />
                                            <p className='text-xs text-gray-500 mt-1'>Username cannot be changed</p>
                                        </div>

                                        <div>
                                            <label className='block text-white font-medium mb-2'>
                                                Email
                                            </label>
                                            <input
                                                type='email'
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                className='w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500'
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-white font-medium mb-2'>
                                                First Name
                                            </label>
                                            <input
                                                type='text'
                                                value={profileData.first_name}
                                                onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                                                className='w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500'
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-white font-medium mb-2'>
                                                Last Name
                                            </label>
                                            <input
                                                type='text'
                                                value={profileData.last_name}
                                                onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                                                className='w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500'
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type='submit'
                                        disabled={loading}
                                        className='px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 rounded-lg font-semibold transition-colors'
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </form>
                            </div>

                            {/* Change Password */}
                            <div className='bg-gray-900 p-8 rounded-xl border border-gray-800'>
                                <h2 className='text-2xl font-bold mb-6'>Change Password</h2>

                                {passwordSuccess && (
                                    <div className='mb-4 bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg flex items-center gap-2'>
                                        <CheckCircle size={20} />
                                        <span>{passwordSuccess}</span>
                                    </div>
                                )}

                                {passwordError && (
                                    <div className='mb-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg flex items-center gap-2'>
                                        <AlertCircle size={20} />
                                        <span>{passwordError}</span>
                                    </div>
                                )}

                                <form onSubmit={handlePasswordSubmit} className='space-y-6'>
                                    <div>
                                        <label className='block text-white font-medium mb-2'>
                                            Current Password
                                        </label>
                                        <div className='relative'>
                                            <Lock className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500' size={20} />
                                            <input
                                                type='password'
                                                value={passwordData.old_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                                required
                                                className='w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500'
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className='block text-white font-medium mb-2'>
                                            New Password
                                        </label>
                                        <div className='relative'>
                                            <Lock className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500' size={20} />
                                            <input
                                                type='password'
                                                value={passwordData.new_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                                required
                                                minLength={8}
                                                className='w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500'
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className='block text-white font-medium mb-2'>
                                            Confirm New Password
                                        </label>
                                        <div className='relative'>
                                            <Lock className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500' size={20} />
                                            <input
                                                type='password'
                                                value={passwordData.confirm_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                                required
                                                className='w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500'
                                            />
                                        </div>
                                        {passwordData.new_password && passwordData.confirm_password && (
                                            <p className={`text-sm mt-1 ${passwordData.new_password === passwordData.confirm_password ? 'text-green-500' : 'text-red-500'}`}>
                                                {passwordData.new_password === passwordData.confirm_password ? '✓ Passwords match' : '✗ Passwords do not match'}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type='submit'
                                        disabled={loading}
                                        className='px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-700 rounded-lg font-semibold transition-colors'
                                    >
                                        {loading ? 'Changing...' : 'Change Password'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;