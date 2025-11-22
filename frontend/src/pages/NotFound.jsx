import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, Car } from 'lucide-react';


const NotFound = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className='min-h-screen bg-black flex items-center justify-center px-4'>
                <div className='text-center max-w-2xl'>
                    {/* 404 Animation */}
                    <div className='mb-8'>
                        <h1 className='text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 leading-none'>
                            404
                        </h1>
                        <div className='relative -mt-8'>
                            <Car className='mx-auto text-gray-700 animate-bounce' size={60} />
                        </div>
                    </div>

                    {/* Message */}
                    <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
                        Oops! Page Not Found
                    </h2>
                    <p className='text-gray-400 text-lg mb-8'>
                        The page you're looking for doesn't exist or has been moved.
                        Let's get you back on track!
                    </p>

                    {/* Actions */}
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <button
                            onClick={() => navigate(-1)}
                            className='flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors'
                        >
                            <ArrowLeft size={20} />
                            Go Back
                        </button>
                        <Link to='/'>
                            <button className='flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors w-full sm:w-auto'>
                                <Home size={20} />
                                Home Page
                            </button>
                        </Link>
                        <Link to='/cars'>
                            <button className='flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-colors w-full sm:w-auto'>
                                <Search size={20} />
                                Browse Cars
                            </button>
                        </Link>
                    </div>

                    {/* Popular Links */}
                    <div className='mt-12 pt-8 border-t border-gray-800'>
                        <p className='text-gray-500 text-sm mb-4'>Popular Pages:</p>
                        <div className='flex flex-wrap gap-3 justify-center'>
                            <Link to='/cars' className='text-blue-400 hover:text-blue-300 text-sm transition-colors'>
                                Browse Cars
                            </Link>
                            <span className='text-gray-700'>•</span>
                            <Link to='/about' className='text-blue-400 hover:text-blue-300 text-sm transition-colors'>
                                About Us
                            </Link>
                            <span className='text-gray-700'>•</span>
                            <Link to='/contact' className='text-blue-400 hover:text-blue-300 text-sm transition-colors'>
                                Contact
                            </Link>
                            <span className='text-gray-700'>•</span>
                            <Link to='/dashboard' className='text-blue-400 hover:text-blue-300 text-sm transition-colors'>
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotFound;