import axios from "axios";

// Use environment variable for API URL
const API_URL = process.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const carApi = {
    getCars: () => api.get("/cars/"),
    getCarById: (id) => api.get(`/cars/${id}/`),
    getFeaturedCars: () => api.get("/cars/featured/"),
    getCarsByBrand: (brandId) => api.get(`/brands/by_brand/?brand_id=${brandId}`),
    getBrand: () => api.get("/brands/"),
    checkAvailability: (carId, pickupDate, returnDate) => 
        api.post(`/cars/${carId}/check_availability/`, {
            pickup_date: pickupDate,
            return_date: returnDate
        }),
};

// Auth API
export const authApi = {
    register: (userData) => api.post("/users/register/", userData),
    login: (credentials) => api.post("/token/", credentials),
    getProfile: () => api.get("/users/profile/"),
    updateProfile: (userData) => api.patch("/users/profile/update/", userData),
    changePassword: (passwordData) => api.post("/users/profile/change-password/", passwordData),
};

export const bookingApi = {
    createBooking: (bookingData) => api.post("/bookings/", bookingData),
    getUserBookings: () => api.get("/bookings/"),
    getBooking: (id) => api.get(`/bookings/${id}/`),
    cancelBooking: (id) => api.patch(`/bookings/${id}/`, { status: 'cancelled' }),
};

export const reviewApi = {
    getCarReviews: (carId) => api.get(`/reviews/?car_id=${carId}`),
    createReview: (reviewData) => api.post("/reviews/", reviewData),
    updateReview: (id, reviewData) => api.patch(`/reviews/${id}/`, reviewData),
    deleteReview: (id) => api.delete(`/reviews/${id}/`),
};

export const paymentApi = {
    createCheckoutSession: (bookingId, frontendUrl) => 
        api.post("/payments/create-checkout-session/", { booking_id: bookingId, frontend_url: frontendUrl }),
    verifyPayment: (sessionId) => 
        api.post("/payments/verify/", { session_id: sessionId }),
    getPublicKey: () => 
        api.get("/payments/public-key/"),
};

export const wishlistApi = {
    getWishlist: () => api.get("/wishlist/"),
    addToWishlist: (carId) => api.post("/wishlist/", { car_id: carId }),
    removeFromWishlist: (wishlistId) => api.delete(`/wishlist/${wishlistId}/`),
    removeByCarId: (carId) => api.delete(`/wishlist/remove_by_car/?car_id=${carId}`),
};

export const adminApi = {
    getStats: () => api.get("/admin/stats/"),
    getAllBookings: (filters) => api.get("/admin/bookings/", { params: filters }),
    updateBookingStatus: (bookingId, status) => 
        api.patch(`/admin/bookings/${bookingId}/status/`, { status }),
    getAllUsers: () => api.get("/admin/users/"),
    getRevenueChart: () => api.get("/admin/revenue/"),
};

// Export API_URL for use in components (e.g., for image URLs)
export { API_URL };

export default api;