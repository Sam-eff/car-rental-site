import React, { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { getImageUrl } from '../utils/Imagehelper';


const Wishlist = () => {
    const { wishlist, loading, removeFromWishlist } = useContext(WishlistContext);

    const handleRemove = async (carId) => {
        if (window.confirm('Remove this car from your wishlist?')) {
            await removeFromWishlist(carId);
        }
    };

    if (loading) {
        return (
            <>
                <div className='min-h-screen bg-black flex items-center justify-center'>
                    <div className='text-white text-xl'>Loading wishlist...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className='min-h-screen bg-black text-white py-20 px-4'>
                <div className='container mx-auto max-w-7xl'>
                    {/* Header */}
                    <div className='mb-12 mt-8'>
                        <h1 className='text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3'>
                            <Heart className='text-red-500 fill-current' size={40} />
                            My Wishlist
                        </h1>
                        <p className='text-gray-400 text-lg'>
                            {wishlist.length} {wishlist.length === 1 ? 'car' : 'cars'} saved for later
                        </p>
                    </div>

                    {wishlist.length === 0 ? (
                        <div className='text-center py-20'>
                            <Heart className='mx-auto text-gray-600 mb-6' size={80} />
                            <h2 className='text-2xl font-bold mb-4'>Your wishlist is empty</h2>
                            <p className='text-gray-400 mb-8'>
                                Start adding cars you love to keep track of them!
                            </p>
                            <Link to='/cars'>
                                <button className='px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors'>
                                    Browse Cars
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {wishlist.map((item) => (
                                <div
                                    key={item.id}
                                    className='bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-red-500 transition-all duration-300 group'
                                >
                                    <div className='relative h-[200px]'>
                                        <Link to={`/cars/${item.car.id}`}>
                                            <img
                                                src={getImageUrl(item.car.image)}
                                                alt={item.car.name}
                                                className='w-full h-full object-cover group-hover:opacity-80 transition-opacity'
                                            />
                                        </Link>
                                        <button
                                            onClick={() => handleRemove(item.car.id)}
                                            className='absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'
                                            title='Remove from wishlist'
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className='p-5'>
                                        <Link to={`/cars/${item.car.id}`}>
                                            <h3 className='text-xl font-bold mb-2 hover:text-blue-400 transition-colors'>
                                                {item.car.name}
                                            </h3>
                                        </Link>
                                        <p className='text-gray-400 text-sm mb-4'>{item.car.car_type}</p>

                                        <div className='flex items-center justify-between mb-4'>
                                            <div>
                                                <p className='text-2xl font-bold text-blue-400'>
                                                    ${item.car.price_per_day}
                                                </p>
                                                <p className='text-xs text-gray-500'>per day</p>
                                            </div>
                                            <div className='flex gap-2 text-sm text-gray-400'>
                                                <span>{item.car.transmission}</span>
                                                <span>•</span>
                                                <span>{item.car.fuel_type}</span>
                                            </div>
                                        </div>

                                        <Link to={`/cars/${item.car.id}`}>
                                            <button className='w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2'>
                                                <ShoppingCart size={18} />
                                                Book Now
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Wishlist;