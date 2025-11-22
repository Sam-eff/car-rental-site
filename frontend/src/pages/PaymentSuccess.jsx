import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { paymentApi } from '../store/api';
import { CheckCircle, Loader } from 'lucide-react';


const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            const sessionId = searchParams.get('session_id');
            
            if (!sessionId) {
                setError('Invalid payment session');
                setLoading(false);
                return;
            }

            try {
                const response = await paymentApi.verifyPayment(sessionId);
                setBooking(response.data.booking);
                setLoading(false);
            } catch (err) {
                setError('Failed to verify payment');
                setLoading(false);
            }
        };

        verifyPayment();
    }, [searchParams]);

    if (loading) {
        return (
            <>
                <div className='min-h-screen bg-black flex items-center justify-center'>
                    <div className='text-center'>
                        <Loader className='animate-spin text-blue-500 mx-auto mb-4' size={48} />
                        <p className='text-white text-xl'>Verifying your payment...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <div className='min-h-screen bg-black flex items-center justify-center px-4'>
                    <div className='text-center max-w-md'>
                        <div className='text-red-500 text-6xl mb-4'>✗</div>
                        <h1 className='text-3xl font-bold text-white mb-4'>Payment Error</h1>
                        <p className='text-gray-400 mb-8'>{error}</p>
                        <Link to='/dashboard'>
                            <button className='px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold'>
                                Go to Dashboard
                            </button>
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className='min-h-screen bg-black flex items-center justify-center px-4'>
                <div className='text-center max-w-2xl'>
                    <div className='mb-8'>
                        <CheckCircle className='text-green-500 mx-auto' size={80} />
                    </div>
                    <h1 className='text-4xl font-bold text-white mb-4'>Payment Successful!</h1>
                    <p className='text-gray-400 text-lg mb-8'>
                        Your booking has been confirmed. You will receive a confirmation email shortly.
                    </p>
                    
                    {booking && (
                        <div className='bg-gray-900 p-8 rounded-xl border border-gray-800 mb-8'>
                            <h2 className='text-xl font-bold text-white mb-4'>Booking Details</h2>
                            <div className='text-left space-y-2 text-gray-300'>
                                <p><strong>Booking ID:</strong> #{booking.id}</p>
                                <p><strong>Status:</strong> <span className='text-green-500'>{booking.status}</span></p>
                                <p><strong>Payment Status:</strong> <span className='text-green-500'>{booking.payment_status}</span></p>
                            </div>
                        </div>
                    )}
                    
                    <div className='flex gap-4 justify-center'>
                        <Link to='/dashboard'>
                            <button className='px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold'>
                                View My Bookings
                            </button>
                        </Link>
                        <Link to='/cars'>
                            <button className='px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-semibold'>
                                Browse More Cars
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentSuccess;