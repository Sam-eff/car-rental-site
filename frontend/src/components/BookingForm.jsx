import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { bookingApi, paymentApi, carApi } from '../store/api';
import { Calendar, DollarSign, Clock, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookingForm = ({ car }) => {
    if (!car) {
        return (
            <div className='bg-gray-900 p-6 rounded-xl border border-gray-800'>
                <div className='text-white text-center'>Loading booking form...</div>
            </div>
        );
    }

    const { user } = useContext(AuthContext);
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Availability checking state
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [availabilityMessage, setAvailabilityMessage] = useState('');
    const [isAvailable, setIsAvailable] = useState(null);

    useEffect(() => {
        setPickupDate('');
        setReturnDate('');
        setError('');
        setAvailabilityMessage('');
        setIsAvailable(null);
    }, [car]);

    // Check availability when both dates are selected
    useEffect(() => {
        if (pickupDate && returnDate) {
            checkAvailability();
        } else {
            setAvailabilityMessage('');
            setIsAvailable(null);
        }
    }, [pickupDate, returnDate]);

    const checkAvailability = async () => {
        setCheckingAvailability(true);
        setAvailabilityMessage('');
        setIsAvailable(null);

        try {
            const response = await carApi.checkAvailability(car.id, pickupDate, returnDate);
            
            if (response.data.available) {
                setIsAvailable(true);
                setAvailabilityMessage('✓ Car is available for selected dates');
            } else {
                setIsAvailable(false);
                setAvailabilityMessage(response.data.message || 'Car is not available');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Unable to check availability';
            setIsAvailable(false);
            setAvailabilityMessage(errorMsg);
        } finally {
            setCheckingAvailability(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    const rentalDays = () => {
        if (!pickupDate || !returnDate) return 0;
        
        const date1 = new Date(pickupDate);
        const date2 = new Date(returnDate);
        const timeDiff = date2 - date1;
        
        if (timeDiff < 0) {
            return 0;
        }
        
        const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return diffDays || 1;
    };

    const totalCost = () => {
        const days = rentalDays();
        if (days === 0) return 0;
        return days * car.price_per_day;
    };

    const validateDates = () => {
        if (!pickupDate) {
            setError('Please select a pickup date');
            return false;
        }
        if (!returnDate) {
            setError('Please select a return date');
            return false;
        }
        if (new Date(returnDate) <= new Date(pickupDate)) {
            setError('Return date must be after pickup date');
            return false;
        }
        if (!isAvailable) {
            setError('Car is not available for selected dates');
            return false;
        }
        setError('');
        return true;
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        
        if (!validateDates()) return;
    
        if (!user) {
            setError('Please login to book a car');
            return;
        }
        
        setLoading(true);
        
        try {
            // Final availability check before booking
            const availCheck = await carApi.checkAvailability(car.id, pickupDate, returnDate);
            
            if (!availCheck.data.available) {
                setError('Car is no longer available for these dates. Please select different dates.');
                setLoading(false);
                return;
            }
    
            // Create booking
            const bookingData = {
                car_id: car.id,
                pickup_date: pickupDate,
                return_date: returnDate,
                total_days: rentalDays(),
                total_cost: totalCost()
            };
            
            const bookingResponse = await bookingApi.createBooking(bookingData);
            const bookingId = bookingResponse.data.id;
            
            // Create Stripe checkout session
            const paymentResponse = await paymentApi.createCheckoutSession(
                bookingId,
                window.location.origin
            );
            
            // NEW WAY: Direct redirect to Stripe checkout URL
            window.location.href = paymentResponse.data.url;
            
        } catch (error) {
            console.error('Booking error:', error);
            setError(error.response?.data?.detail || error.response?.data?.error || 'Failed to create booking. Please try again.');
            setLoading(false);
        }
    };

    const days = rentalDays();
    const total = totalCost();

    return (
        <div className='bg-gray-900 p-6 rounded-xl border border-gray-800 sticky top-4'>
            <h2 className='text-2xl font-semibold text-white mb-6'>
                Book Your Premium Car Today
            </h2>
            
            <form onSubmit={handleBooking} className='space-y-4'>
                {/* Pickup Date */}
                <div>
                    <label className='text-white block mb-2 font-medium'>
                        <Calendar className='inline w-4 h-4 mr-2' />
                        Pickup Date
                    </label>
                    <input
                        type='date'
                        value={pickupDate}
                        onChange={(e) => {
                            setPickupDate(e.target.value);
                            setError('');
                        }}
                        min={today}
                        required
                        className='w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors'
                    />
                </div>

                {/* Return Date */}
                <div>
                    <label className='text-white block mb-2 font-medium'>
                        <Calendar className='inline w-4 h-4 mr-2' />
                        Return Date
                    </label>
                    <input
                        type='date'
                        value={returnDate}
                        onChange={(e) => {
                            setReturnDate(e.target.value);
                            setError('');
                        }}
                        min={pickupDate || today}
                        required
                        className='w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors'
                    />
                </div>

                {/* Availability Status */}
                {checkingAvailability && (
                    <div className='bg-blue-500/10 border border-blue-500 text-blue-400 px-4 py-3 rounded-lg flex items-center gap-2'>
                        <Loader className='animate-spin' size={20} />
                        <span>Checking availability...</span>
                    </div>
                )}

                {!checkingAvailability && availabilityMessage && (
                    <div className={`px-4 py-3 rounded-lg flex items-center gap-2 ${
                        isAvailable 
                            ? 'bg-green-500/10 border border-green-500 text-green-500'
                            : 'bg-red-500/10 border border-red-500 text-red-500'
                    }`}>
                        {isAvailable ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span className='text-sm'>{availabilityMessage}</span>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className='bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg text-sm'>
                        {error}
                    </div>
                )}

                {/* Rental Summary */}
                {days > 0 && isAvailable && (
                    <div className='bg-gray-800 p-4 rounded-lg space-y-2'>
                        <div className='flex justify-between text-gray-300'>
                            <span className='flex items-center'>
                                <Clock className='w-4 h-4 mr-2' />
                                Rental Days:
                            </span>
                            <span className='font-semibold'>{days} {days === 1 ? 'day' : 'days'}</span>
                        </div>
                        <div className='flex justify-between text-gray-300'>
                            <span className='flex items-center'>
                                <DollarSign className='w-4 h-4 mr-2' />
                                Price per day:
                            </span>
                            <span className='font-semibold'>${car.price_per_day}</span>
                        </div>
                        <div className='border-t border-gray-700 pt-2 mt-2'>
                            <div className='flex justify-between text-white text-lg'>
                                <span className='font-bold'>Total Cost:</span>
                                <span className='font-bold text-blue-400'>${total}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Book Button */}
                <button
                    type='submit'
                    disabled={!car.is_available || loading || checkingAvailability || !isAvailable || !days}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                        car.is_available && !loading && !checkingAvailability && isAvailable && days
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {loading ? 'Processing...' : 
                     checkingAvailability ? 'Checking...' :
                     !car.is_available ? 'Not Available' : 
                     !isAvailable && days ? 'Not Available' :
                     'Proceed to Payment'}
                </button>

                {/* Login prompt */}
                {!user && (
                    <p className='text-xs text-gray-500 text-center'>
                        Please <Link to='/login' className='text-blue-400 underline'>login</Link> to book this car
                    </p>
                )}

                {/* Cancellation Policy */}
                <p className='text-xs text-gray-500 text-center'>
                    Free cancellation up to 24 hours before pickup
                </p>
            </form>
        </div>
    );
};

export default BookingForm;

