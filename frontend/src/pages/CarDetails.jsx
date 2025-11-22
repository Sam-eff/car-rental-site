import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { carApi } from '../store/api';
import { reviewApi } from '../store/api';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, CheckCheckIcon, User, Edit2, Trash2 } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import BookingForm from '../components/BookingForm';
import StarRating from '../components/StarRating'
import { getImageUrl } from '../utils/Imagehelper';



const CarDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext)
  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [similarCars, setSimilarCars] = useState([]);

  // Review state
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  useEffect(() => {
    // Fetch car details
    const fetchCarDetails = async () => {
      try {
        const response = await carApi.getCarById(id);
        const carData = response.data;
        setCar(carData);

        // Fetch all cars
        const allCarsResponse = await carApi.getCars();
        
        // Handle different response structures
      let allCars;
      if (Array.isArray(allCarsResponse.data)) {
        allCars = allCarsResponse.data; // It's already an array
      } else if (allCarsResponse.data.results) {
        allCars = allCarsResponse.data.results; // Django pagination format
      } else {
        console.error('Unexpected response format:', allCarsResponse.data);
        allCars = [];
      }

      // console.log('All cars array:', allCars);

      // Filter for similar cars
      const similar = allCars.filter(c => 
        c.id !== parseInt(id) && 
        (c.brand?.id === carData.brand?.id || c.car_type === carData.car_type)
      ).slice(0, 4);
      // console.log('Similar cars:', similar);
      setSimilarCars(similar);

      // Fetch reviews
      const reviewsResponse = await reviewApi.getCarReviews(id);
      const reviewsData = reviewsResponse.data.results || reviewsResponse.data;
      setReviews(reviewsData);

      // Check if current user has already reviewed
      if (user) {
        const hasReviewed = reviewsData.some(review => review.user === user.id);
        setUserHasReviewed(hasReviewed);
    }


      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching car details:', error);
      setIsLoading(false);
    }
  };

    fetchCarDetails();
  }, [id, user]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!user) {
        setReviewError('Please login to leave a review');
        return;
    }

    if (!newReview.comment.trim()) {
        setReviewError('Please write a comment');
        return;
    }

    try {
        const reviewData = {
            car: parseInt(id),
            rating: newReview.rating,
            comment: newReview.comment
        };

        await reviewApi.createReview(reviewData);
        
        // Refresh reviews
        const reviewsResponse = await reviewApi.getCarReviews(id);
        const reviewsData = reviewsResponse.data.results || reviewsResponse.data;
        setReviews(reviewsData);
        
        setReviewSuccess('Review submitted successfully!');
        setNewReview({ rating: 5, comment: '' });
        setUserHasReviewed(true);

        setTimeout(() => setReviewSuccess(''), 3000);
    } catch (error) {
        setReviewError(error.response?.data?.detail || 'Failed to submit review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
        return;
    }

    try {
        await reviewApi.deleteReview(reviewId);
        
        // Refresh reviews
        const reviewsResponse = await reviewApi.getCarReviews(id);
        const reviewsData = reviewsResponse.data.results || reviewsResponse.data;
        setReviews(reviewsData);
        setUserHasReviewed(false);
    } catch (error) {
        console.error('Error deleting review:', error);
    }
  };

  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-white text-xl">Loading car details...</div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-red-500 text-xl">Car not found</div>
      </div>
    );
  }


  const settings = {
    dots: true,
    infinite: car.images && car.images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: car.images && car.images.length > 1,
    centerMode: false,
    adaptiveHeight: true,
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Back Button */}
          <div className="mb-8 mt-8">
            <Link to="/cars">
              <button className="text-white text-sm flex items-center hover:text-blue-400 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2 md:block" /> Back to Cars
              </button>
            </Link>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Car Info + Images (2 columns) */}
            <div className="lg:col-span-2 space-y-10">
              {/* Car Images Carousel */}
              <div className="relative">
                {(() => {
                  // Gather all images
                  const images = [];
                  
                  if (car.images && Array.isArray(car.images) && car.images.length > 0) {
                    car.images.forEach(imgObj => {
                      const img = typeof imgObj === 'string' ? imgObj : imgObj?.image;
                      if (img) images.push(img);
                    });
                  }
                  
                  // Fallback to main image if no related images
                  if (images.length === 0 && car.image) {
                    images.push(car.image);
                  }
                  
                  // No images available
                  if (images.length === 0) {
                    return (
                      <div className="flex items-center justify-center h-[400px] bg-gray-800 rounded-3xl">
                        <p className="text-gray-400">No images available</p>
                      </div>
                    );
                  }
                  
                  // Single image - no carousel needed
                  if (images.length === 1) {
                    return (
                      <img
                        src={getImageUrl(images[0])}
                        alt={car.name}
                        className="w-full h-[400px] object-cover rounded-3xl"
                      />
                    );
                  }
                  
                  // Multiple images - show carousel
                  return (
                    <div className="carousel-container">
                      <Slider {...settings}>
                        {images.map((img, index) => (
                          <div key={index} className="px-2">
                            <img
                              src={getImageUrl(img)}
                              alt={`${car.name} - Image ${index + 1}`}
                              className="w-full h-[400px] object-cover rounded-3xl"
                            />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  );
                })()}

                {/* Performance Badges */}
                <div className="absolute top-6 left-6 flex gap-2 flex-wrap z-10">
                  {car.time && (
                    <span className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                      0-60: {car.time}s
                    </span>
                  )}
                  {car.speed && (
                    <span className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                      {car.speed} km/h
                    </span>
                  )}
                  {car.horsepower && (
                    <span className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                      {car.horsepower} hp
                    </span>
                  )}
                </div>
              </div>

              {/* Car Details */}
              <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
                <h1 className="text-4xl font-bold mb-4">{car.name}</h1>
                <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                  {car.description}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Brand</p>
                    <p className="text-white font-semibold">{car.brand?.name}</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Year</p>
                    <p className="text-white font-semibold">{car.year}</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Transmission</p>
                    <p className="text-white font-semibold">{car.transmission}</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Fuel Type</p>
                    <p className="text-white font-semibold">{car.fuel_type}</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Color</p>
                    <p className="text-white font-semibold">{car.color}</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Car Type</p>
                    <p className="text-white font-semibold">{car.car_type}</p>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center gap-3 mb-6 p-4 bg-gray-800 rounded-lg">
                  {car.is_available ? (
                    <>
                      <CheckCheckIcon className="w-6 h-6 text-green-500" />
                      <span className="text-green-500 font-semibold">Available for Rent</span>
                    </>
                  ) : (
                    <>
                      <span className="text-red-500 font-semibold">Currently Unavailable</span>
                    </>
                  )}
                </div>

                {/* Features */}
                {car.features && car.features.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {car.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-300">
                          <CheckCheckIcon className="w-4 h-4 text-blue-400" />
                          <span>{feature.name || feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Booking Form (1 column) */}
            <div>
              <BookingForm car={car} />
            </div>
          </div>

          {/* Reviews Section */}
          <div className='container mx-auto max-w-7xl mt-20'>
                    <div className='bg-gray-900 rounded-2xl p-8 border border-gray-800'>
                        <div className='flex items-center justify-between mb-8'>
                            <div>
                                <h2 className='text-3xl font-bold mb-2'>Customer Reviews</h2>
                                {car && (
                                    <div className='flex items-center gap-4'>
                                        <StarRating rating={car.average_rating} readonly size={24} />
                                        <span className='text-gray-400'>
                                            {car.average_rating.toFixed(1)} out of 5 ({car.review_count} {car.review_count === 1 ? 'review' : 'reviews'})
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Write Review Form */}
                        {user && !userHasReviewed ? (
                            <div className='mb-8 bg-gray-800 p-6 rounded-xl'>
                                <h3 className='text-xl font-bold mb-4'>Write a Review</h3>
                                
                                {reviewSuccess && (
                                    <div className='mb-4 bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg'>
                                        {reviewSuccess}
                                    </div>
                                )}

                                {reviewError && (
                                    <div className='mb-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg'>
                                        {reviewError}
                                    </div>
                                )}

                                <form onSubmit={handleReviewSubmit} className='space-y-4'>
                                    <div>
                                        <label className='block text-white font-medium mb-2'>
                                            Your Rating
                                        </label>
                                        <StarRating 
                                            rating={newReview.rating} 
                                            onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                                            size={32}
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-white font-medium mb-2'>
                                            Your Review
                                        </label>
                                        <textarea
                                            value={newReview.comment}
                                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                            rows={4}
                                            placeholder='Share your experience with this car...'
                                            className='w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500'
                                            required
                                        />
                                    </div>

                                    <button
                                        type='submit'
                                        className='px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors'
                                    >
                                        Submit Review
                                    </button>
                                </form>
                            </div>
                        ) : !user ? (
                            <div className='mb-8 bg-yellow-500/10 border border-yellow-500 text-yellow-500 px-6 py-4 rounded-lg'>
                                Please <Link to='/login' className='underline font-semibold'>login</Link> to leave a review
                            </div>
                        ) : (
                            <div className='mb-8 bg-blue-500/10 border border-blue-500 text-blue-400 px-6 py-4 rounded-lg'>
                                You have already reviewed this car
                            </div>
                        )}

                        {/* Display Reviews */}
                        <div className='space-y-6'>
                            {reviews.length === 0 ? (
                                <p className='text-gray-400 text-center py-8'>
                                    No reviews yet. Be the first to review this car!
                                </p>
                            ) : (
                                reviews.map((review) => (
                                    <div key={review.id} className='bg-gray-800 p-6 rounded-xl border border-gray-700'>
                                        <div className='flex items-start justify-between mb-4'>
                                            <div className='flex items-center gap-4'>
                                                <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center'>
                                                    <User size={24} />
                                                </div>
                                                <div>
                                                    <p className='font-semibold'>{review.user_username}</p>
                                                    <p className='text-gray-500 text-sm'>
                                                        {new Date(review.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className='flex items-center gap-4'>
                                                <StarRating rating={review.rating} readonly size={20} />
                                                {user && user.id === review.user && (
                                                    <button
                                                        onClick={() => handleDeleteReview(review.id)}
                                                        className='text-red-500 hover:text-red-400 transition-colors'
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p className='text-gray-300 leading-relaxed'>{review.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

          {/* Similar Cars Section */}
          {similarCars.length > 0 && (
            <div className="mt-20">
              <h3 className="text-3xl font-bold mb-8">You May Also Like</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarCars.map((similarCar) => (
                  <Link
                    to={`/cars/${similarCar.id}`}
                    key={similarCar.id}
                    className="group"
                  >
                    <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden hover:border-blue-500 transform hover:scale-105 transition-all duration-300">
                      {/* Car Image */}
                      <div className="relative h-[200px] overflow-hidden">
                        <img
                          src={getImageUrl(similarCar.image)} 
                          alt={similarCar.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Car Info */}
                      <div className="p-4">
                        <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                          {similarCar.name}
                        </h4>
                        <p className="text-sm text-gray-500 mb-3">{similarCar.car_type}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xl font-bold text-blue-400">
                              ${similarCar.price_per_day}
                            </p>
                            <p className="text-xs text-gray-500">per day</p>
                          </div>
                          <span className="text-sm text-blue-400 group-hover:underline">
                            View →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CarDetails;
