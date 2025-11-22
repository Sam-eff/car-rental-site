import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { adminApi, carApi, bookingApi } from '../store/api';
import { 
    Users, Car, DollarSign, Calendar, TrendingUp, 
    Package, Activity, Star, AlertCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        // Check if user is admin
        if (user && !user.is_staff && !user.is_superuser) {
            navigate('/');
            return;
        }

        fetchDashboardData();
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch stats
            const statsResponse = await adminApi.getStats();
            setStats(statsResponse.data);

            // Fetch recent bookings
            const bookingsResponse = await adminApi.getAllBookings({ limit: 10 });
            const bookingsData = bookingsResponse.data.results || bookingsResponse.data;
            setRecentBookings(bookingsData.slice(0, 10));

            setLoading(false);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            if (error.response?.status === 403) {
                navigate('/');
            }
            setLoading(false);
        }
    };

    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            await adminApi.updateBookingStatus(bookingId, newStatus);
            fetchDashboardData(); // Refresh data
        } catch (error) {
            console.error('Error updating booking status:', error);
        }
    };

    const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
        <div className='bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-blue-500 transition-all'>
            <div className='flex items-center justify-between mb-4'>
                <div className={`p-3 ${color} bg-opacity-20 rounded-lg`}>
                    <Icon className={color.replace('bg-', 'text-')} size={24} />
                </div>
            </div>
            <h3 className='text-3xl font-bold text-white mb-1'>{value}</h3>
            <p className='text-gray-400 text-sm font-medium'>{title}</p>
            {subtitle && <p className='text-xs text-gray-500 mt-1'>{subtitle}</p>}
        </div>
    );

    const StatusBadge = ({ status }) => {
        const colors = {
            pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500',
            confirmed: 'bg-green-500/20 text-green-500 border-green-500',
            cancelled: 'bg-red-500/20 text-red-500 border-red-500',
            completed: 'bg-blue-500/20 text-blue-500 border-blue-500'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[status] || colors.pending}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className='min-h-screen bg-black flex items-center justify-center'>
                    <div className='text-white text-xl'>Loading admin dashboard...</div>
                </div>
            </>
        );
    }

    if (!stats) {
        return (
            <>
                <Navbar />
                <div className='min-h-screen bg-black flex items-center justify-center'>
                    <div className='text-red-500 text-xl'>Error loading dashboard</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className='min-h-screen bg-black text-white py-20 px-4'>
                <div className='container mx-auto max-w-7xl'>
                    {/* Header */}
                    <div className='mb-12'>
                        <h1 className='text-4xl md:text-5xl font-bold mb-4'>Admin Dashboard</h1>
                        <p className='text-gray-400 text-lg'>Manage your car rental business</p>
                    </div>

                    {/* Tabs */}
                    <div className='mb-8 flex gap-4 border-b border-gray-800'>
                        {['overview', 'bookings', 'cars', 'users'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 font-semibold capitalize transition-colors ${
                                    activeTab === tab
                                        ? 'text-blue-400 border-b-2 border-blue-400'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className='space-y-8'>
                            {/* Stats Grid */}
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                                <StatCard
                                    icon={Car}
                                    title='Total Cars'
                                    value={stats.overview.total_cars}
                                    color='bg-blue-500'
                                />
                                <StatCard
                                    icon={Users}
                                    title='Total Users'
                                    value={stats.overview.total_users}
                                    color='bg-green-500'
                                />
                                <StatCard
                                    icon={Calendar}
                                    title='Total Bookings'
                                    value={stats.overview.total_bookings}
                                    subtitle={`${stats.overview.active_bookings} active`}
                                    color='bg-purple-500'
                                />
                                <StatCard
                                    icon={DollarSign}
                                    title='Total Revenue'
                                    value={`$${stats.overview.total_revenue.toFixed(2)}`}
                                    subtitle={`$${stats.overview.monthly_revenue.toFixed(2)} this month`}
                                    color='bg-yellow-500'
                                />
                            </div>

                            {/* Popular Cars */}
                            <div className='bg-gray-900 rounded-xl p-8 border border-gray-800'>
                                <h2 className='text-2xl font-bold mb-6'>Most Popular Cars</h2>
                                <div className='space-y-4'>
                                    {stats.popular_cars.map((car, index) => (
                                        <div key={car.id} className='flex items-center justify-between p-4 bg-gray-800 rounded-lg'>
                                            <div className='flex items-center gap-4'>
                                                <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold'>
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className='font-semibold'>{car.name}</p>
                                                    <p className='text-sm text-gray-400'>{car.bookings} bookings</p>
                                                </div>
                                            </div>
                                            <div className='text-right'>
                                                <p className='text-green-400 font-bold'>${car.revenue.toFixed(2)}</p>
                                                <p className='text-xs text-gray-500'>revenue</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Booking Status Breakdown */}
                            <div className='bg-gray-900 rounded-xl p-8 border border-gray-800'>
                                <h2 className='text-2xl font-bold mb-6'>Booking Status</h2>
                                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                                    {Object.entries(stats.status_breakdown).map(([status, count]) => (
                                        <div key={status} className='text-center p-4 bg-gray-800 rounded-lg'>
                                            <p className='text-3xl font-bold text-blue-400 mb-2'>{count}</p>
                                            <p className='text-sm text-gray-400 capitalize'>{status}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Reviews */}
                            <div className='bg-gray-900 rounded-xl p-8 border border-gray-800'>
                                <h2 className='text-2xl font-bold mb-6'>Recent Reviews</h2>
                                <div className='space-y-4'>
                                    {stats.recent_reviews.map((review) => (
                                        <div key={review.id} className='p-4 bg-gray-800 rounded-lg'>
                                            <div className='flex items-center justify-between mb-2'>
                                                <div className='flex items-center gap-2'>
                                                    <span className='font-semibold'>{review.user}</span>
                                                    <span className='text-gray-500'>•</span>
                                                    <span className='text-gray-400 text-sm'>{review.car}</span>
                                                </div>
                                                <div className='flex items-center gap-1'>
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} size={16} className='fill-yellow-400 text-yellow-400' />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className='text-gray-300 text-sm'>{review.comment}</p>
                                            <p className='text-xs text-gray-500 mt-2'>
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bookings Tab */}
                    {activeTab === 'bookings' && (
                        <div className='bg-gray-900 rounded-xl p-8 border border-gray-800'>
                            <h2 className='text-2xl font-bold mb-6'>Recent Bookings</h2>
                            <div className='overflow-x-auto'>
                                <table className='w-full'>
                                    <thead>
                                        <tr className='border-b border-gray-800'>
                                            <th className='text-left py-3 px-4'>ID</th>
                                            <th className='text-left py-3 px-4'>User</th>
                                            <th className='text-left py-3 px-4'>Car</th>
                                            <th className='text-left py-3 px-4'>Dates</th>
                                            <th className='text-left py-3 px-4'>Cost</th>
                                            <th className='text-left py-3 px-4'>Status</th>
                                            <th className='text-left py-3 px-4'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentBookings.map((booking) => (
                                            <tr key={booking.id} className='border-b border-gray-800 hover:bg-gray-800'>
                                                <td className='py-3 px-4'>#{booking.id}</td>
                                                <td className='py-3 px-4'>{booking.user_username}</td>
                                                <td className='py-3 px-4'>{booking.car.name}</td>
                                                <td className='py-3 px-4 text-sm'>
                                                    {new Date(booking.pickup_date).toLocaleDateString()} - {new Date(booking.return_date).toLocaleDateString()}
                                                </td>
                                                <td className='py-3 px-4 text-green-400 font-semibold'>${booking.total_cost}</td>
                                                <td className='py-3 px-4'>
                                                    <StatusBadge status={booking.status} />
                                                </td>
                                                <td className='py-3 px-4'>
                                                    <select
                                                        value={booking.status}
                                                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                                        className='bg-gray-700 text-white px-3 py-1 rounded text-sm'
                                                    >
                                                        <option value='pending'>Pending</option>
                                                        <option value='confirmed'>Confirmed</option>
                                                        <option value='cancelled'>Cancelled</option>
                                                        <option value='completed'>Completed</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Cars Tab */}
                    {activeTab === 'cars' && (
                        <div className='bg-gray-900 rounded-xl p-8 border border-gray-800'>
                            <h2 className='text-2xl font-bold mb-6'>Car Management</h2>
                            <p className='text-gray-400'>
                                Use the Django admin panel to manage cars: 
                                <a href={`${API_URL}/admin`} target='_blank' rel='noopener noreferrer' className='text-blue-400 hover:underline ml-2'>
                                    Open Admin Panel →
                                </a>
                            </p>
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className='bg-gray-900 rounded-xl p-8 border border-gray-800'>
                            <h2 className='text-2xl font-bold mb-6'>User Management</h2>
                            <p className='text-gray-400 mb-4'>Total registered users: {stats.overview.total_users}</p>
                            <p className='text-gray-400'>
                                Use the Django admin panel to manage users: 
                                <a href={`${API_URL}/admin`} target='_blank' rel='noopener noreferrer' className='text-blue-400 hover:underline ml-2'>
                                    Open Admin Panel →
                                </a>
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AdminDashboard;