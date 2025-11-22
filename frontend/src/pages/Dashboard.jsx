import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { bookingApi } from '../store/api';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Car, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getImageUrl } from '../utils/Imagehelper';



const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { user } = useContext(AuthContext);

    useEffect(() => {
        bookingApi.getUserBookings()
            .then(response => {
                // Extract the results array from paginated response
                const bookingsData = response.data.results || response.data;
                setBookings(bookingsData);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            await bookingApi.cancelBooking(bookingId);
            // Update the booking status locally instead of removing
            setBookings(bookings.map(booking => 
                booking.id === bookingId 
                    ? { ...booking, status: 'cancelled' }
                    : booking
            ));
        } catch (error) {
            setError('Failed to cancel booking');
        }
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500', icon: Clock, text: 'Pending' },
            confirmed: { color: 'bg-green-500/20 text-green-500 border-green-500', icon: CheckCircle, text: 'Confirmed' },
            cancelled: { color: 'bg-red-500/20 text-red-500 border-red-500', icon: XCircle, text: 'Cancelled' },
            completed: { color: 'bg-blue-500/20 text-blue-500 border-blue-500', icon: CheckCircle, text: 'Completed' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${config.color}`}>
                <Icon size={16} />
                {config.text}
            </span>
        );
    };

    if (loading) {
        return (
            <>
                <div className='flex justify-center items-center min-h-screen bg-black'>
                    <div className='text-white text-xl'>Loading your bookings...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className='min-h-screen bg-black text-white py-20 px-4'>
                <div className='container mx-auto max-w-7xl'>
                    {/* Header */}
                    <div className='mb-12'>
                        <div className='mt-8 flex flex-col md:flex-row items-center md:justify-between'>
                            <h1 className='text-4xl md:text-5xl font-bold mb-4'>
                                Welcome back, {user?.username}!
                            </h1>
                        </div>
                        <p className='text-gray-400 text-lg'>
                            Manage your car rental bookings
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className='mb-6 bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-xl flex items-center gap-3'>
                            <AlertCircle size={24} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Bookings Section */}
                    <div className='bg-gray-900 rounded-2xl p-8 border border-gray-800'>
                        <h2 className='text-2xl font-bold mb-6'>My Bookings</h2>

                        {bookings.length === 0 ? (
                            <div className='text-center py-12'>
                                <Car className='mx-auto mb-4 text-gray-600' size={64} />
                                <p className='text-gray-400 text-lg mb-6'>
                                    You haven't made any bookings yet
                                </p>
                                <Link to='/cars'>
                                    <button className='px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors'>
                                        Browse Cars
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className='space-y-6'>
                                {bookings.map(booking => (
                                    <div 
                                        key={booking.id}
                                        className='bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors'
                                    >
                                        <div className='flex flex-col md:flex-row gap-6'>
                                            {/* Car Image */}
                                            <div className='md:w-1/3'>
                                                <img
                                                    src={getImageUrl(booking.car.image)}
                                                    alt={booking.car.name}
                                                    className='w-full h-48 object-cover rounded-lg'
                                                />
                                            </div>

                                            {/* Booking Details */}
                                            <div className='flex-1'>
                                                <div className='flex items-start justify-between mb-4'>
                                                    <div>
                                                        <h3 className='text-2xl font-bold mb-2'>
                                                            {booking.car.name}
                                                        </h3>
                                                        <StatusBadge status={booking.status} />
                                                    </div>
                                                    <Link 
                                                        to={`/cars/${booking.car.id}`}
                                                        className='text-blue-400 hover:text-blue-300 text-sm'
                                                    >
                                                        View Car →
                                                    </Link>
                                                </div>

                                                {/* Booking Info Grid */}
                                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                                                    <div className='flex items-center gap-3'>
                                                        <Calendar className='text-blue-400' size={20} />
                                                        <div>
                                                            <p className='text-gray-500 text-sm'>Pickup</p>
                                                            <p className='font-semibold'>
                                                                {new Date(booking.pickup_date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className='flex items-center gap-3'>
                                                        <Calendar className='text-blue-400' size={20} />
                                                        <div>
                                                            <p className='text-gray-500 text-sm'>Return</p>
                                                            <p className='font-semibold'>
                                                                {new Date(booking.return_date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className='flex items-center gap-3'>
                                                        <DollarSign className='text-green-400' size={20} />
                                                        <div>
                                                            <p className='text-gray-500 text-sm'>Total Cost</p>
                                                            <p className='font-semibold text-green-400 text-xl'>
                                                                ${booking.total_cost}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='flex items-center justify-between pt-4 border-t border-gray-700'>
                                                    <p className='text-gray-400 text-sm'>
                                                        {booking.total_days} {booking.total_days === 1 ? 'day' : 'days'} rental
                                                    </p>

                                                    {booking.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleCancel(booking.id)}
                                                            className='px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors text-sm font-semibold'
                                                        >
                                                            Cancel Booking
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;