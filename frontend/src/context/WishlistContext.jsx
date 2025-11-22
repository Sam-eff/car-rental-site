import React, { createContext, useState, useEffect, useContext } from 'react';
import { wishlistApi } from '../store/api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load wishlist when user logs in
    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await wishlistApi.getWishlist();
            const wishlistData = response.data.results || response.data;
            setWishlist(wishlistData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            setLoading(false);
        }
    };

    const addToWishlist = async (car) => {
        if (!user) {
            return { success: false, message: 'Please login to add to wishlist' };
        }

        if (isInWishlist(car.id)) {
            return { success: false, message: 'Already in wishlist' };
        }

        try {
            await wishlistApi.addToWishlist(car.id);
            await fetchWishlist(); // Refresh list
            return { success: true, message: 'Added to wishlist' };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.error || 'Failed to add to wishlist' 
            };
        }
    };

    const removeFromWishlist = async (carId) => {
        try {
            await wishlistApi.removeByCarId(carId);
            await fetchWishlist(); // Refresh list
            return { success: true, message: 'Removed from wishlist' };
        } catch (error) {
            return { 
                success: false, 
                message: 'Failed to remove from wishlist' 
            };
        }
    };

    const isInWishlist = (carId) => {
        return wishlist.some(item => item.car.id === carId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            loading,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            fetchWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};