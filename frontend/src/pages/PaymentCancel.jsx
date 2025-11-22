import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { XCircle } from 'lucide-react';



const PaymentCancel = () => {
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get('booking_id');

    return (
        <>
            <div className='min-h-screen bg-black flex items-center justify-center px-4'>
                <div className='text-center max-w-md'>
                    <XCircle className='text-yellow-500 mx-auto mb-8' size={80} />
                    <h1 className='text-4xl font-bold text-white mb-4'>Payment Cancelled</h1>
                    <p className='text-gray-400 text-lg mb-8'>
                        Your payment was cancelled. Your booking is still pending and hasn't been confirmed.
                    </p>
                    
                    <div className='flex flex-col gap-4'>
                        {bookingId && (
                            <Link to={`/dashboard`}>
                                <button className='w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold'>
                                    Return to Dashboard
                                </button>
                            </Link>
                        )}
                        <Link to='/cars'>
                            <button className='w-full px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-semibold'>
                                Browse Cars
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentCancel;