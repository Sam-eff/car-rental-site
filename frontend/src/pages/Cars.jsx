import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Filter, ChevronDown, GitCompare, Heart } from 'lucide-react'
import { carApi } from '../store/api'
import { ComparisonContext } from '../context/ComparisonContext';
import { WishlistContext } from '../context/WishlistContext';
import { getImageUrl } from '../utils/Imagehelper'


const STORAGE_KEY = 'autohire_filters';

// save filters to local storage
const saveFiltersToStorage = (filters) => {
  try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
      console.error('Error saving filters:', error);
  }
};

const loadFiltersFromStorage = () => {
  try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
  } catch (error) {
      console.error('Error loading filters:', error);
      return null;
  }
};


const Cars = () => {

    const { addToComparison, isInComparison } = useContext(ComparisonContext);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext); 

    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams()
    const brandId = searchParams.get('brand')

    // filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCarType, setSelectedCarType] = useState('');
    const [selectedTransmission, setSelectedTransmission] = useState('');
    const [selectedFuelType, setSelectedFuelType] = useState('');
    const [priceRange, setPriceRange] = useState({
        min: 0,
        max: 0});
    const [showFilters, setShowFilters] = useState(false);

    // Load filters from localStorage on mount
    useEffect(() => {
      const savedFilters = loadFiltersFromStorage();
      
      if (savedFilters) {
          setSearchTerm(savedFilters.searchTerm || '');
          setSelectedBrand(savedFilters.selectedBrand || '');
          setSelectedCarType(savedFilters.selectedCarType || '');
          setSelectedTransmission(savedFilters.selectedTransmission || '');
          setSelectedFuelType(savedFilters.selectedFuelType || '');
          setPriceRange(savedFilters.priceRange || { min: 0, max: 500 });
      }
    }, []);

    // Save filters to localStorage whenever they change
    useEffect(() => {
      const filters = {
          searchTerm,
          selectedBrand,
          selectedCarType,
          selectedTransmission,
          selectedFuelType,
          priceRange
      };
      
      saveFiltersToStorage(filters);
    }, [searchTerm, selectedBrand, selectedCarType, selectedTransmission, selectedFuelType, priceRange]);

    // Fetch cars and brands
    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);

          // Fetch brands for filter dropdown
          const brandResponse = await carApi.getBrand();
          setBrands(brandResponse.data.results || brandResponse.data);

          // Fetch cars (filtered by brand if URL param exists)
          let carsResponse;
          if (brandId) {
            carsResponse = await carApi.getCarsByBrand(brandId);
            setSelectedBrand(brandId);
          } else {
            carsResponse = await carApi.getCars();
          }

          setCars(carsResponse.data.results || carsResponse.data);
          console.log("Cars by brand:", carsResponse.data);

          setFilteredCars(carsResponse.data.results || carsResponse.data);
          setIsLoading(false);
        } catch (error) {
          setError(error);
          setIsLoading(false);
        }
      };

      fetchData();
    }, [brandId])

    // ========== APPLY FILTERS ==========
    useEffect (() => {
      let result = [...cars]

      // console.log("Cars state:", cars);
      // console.log("Filtered cars state:", filteredCars);

      // Search by name
      if (searchTerm) {
        result = result.filter((car) => car.name.toLowerCase().includes(searchTerm.toLowerCase()))
      }

      // Filter by brand
      if (selectedBrand) {
        result = result.filter((car) => car.brand.id === parseInt(selectedBrand))
      }

      // Filter by car type
      if (selectedCarType) {
        result = result.filter((car) => car.type === selectedCarType)
      }

      // Filter by transmission
      if (selectedTransmission) {
        result = result.filter((car) => car.transmission === selectedTransmission)
      }

      // Filter by fuel type
      if (selectedFuelType) {
        result = result.filter((car) => car.fuel_type === selectedFuelType)
      }

      // Filter by price range (only if max > 0)
      if (priceRange.max > 0) {
        result = result.filter(
          (car) =>
            car.price_per_day >= priceRange.min &&
            car.price_per_day <= priceRange.max
        );
      }


      setFilteredCars(result)
    }, [searchTerm, selectedBrand, selectedCarType, selectedTransmission, selectedFuelType, priceRange, cars])

    // ========== CLEAR ALL FILTERS ==========
    const clearFilters = () => {
      setSearchTerm('');
      setSelectedBrand('');
      setSelectedCarType('');
      setSelectedTransmission('');
      setSelectedFuelType('');
      setPriceRange({ min: 0, max: 0 });
      setSearchParams({})
    };

    // Clear from localStorage
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing filters:', error);
    }

    // ========== LOADING & ERROR STATES ==========
    if (isLoading) {
      return (
        <div className='flex justify-center items-center min-h-screen bg-black'>
          <div className='text-white text-xl'>Loading cars...</div>
        </div>
      )
    }

    if (error) {
      return (
        <div className='flex justify-center items-center min-h-screen bg-black'>
          <div className='text-red-500 text-xl'>Error loading cars. Please try again.</div>
        </div>
      )
    }


  // ========== RENDER ==========
  return (
    <div className='min-h-screen bg-black text-white'>
      {/* Header Section */}
      <div className='bg-gradient-to-b from-gray-900 to-black py-16 px-4 md:px-16'>
        <div className='max-w-7xl mx-auto mt-12'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>Browse Our Fleet</h1>
          <p className='text-gray-400 text-lg mb-8'>
            {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} available
          </p>
          
          {/* Search Bar */}
          <div className='relative max-w-2xl'>
            <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Search by car name...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors'
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 md:px-16 py-12'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar Filters - Desktop */}
          <div className='hidden lg:block lg:w-1/4'>
            <div className='bg-gray-900 rounded-xl p-6 border border-gray-800 sticky top-4'>
              <div className='flex justify-between items-center mb-6'>
                <h3 className='text-xl font-bold'>Filters</h3>
                <button
                  onClick={clearFilters}
                  className='text-sm text-blue-400 hover:text-blue-300'
                >
                  Clear All
                </button>
              </div>
              
              <FilterSection
                brands={brands}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
                selectedCarType={selectedCarType}
                setSelectedCarType={setSelectedCarType}
                selectedTransmission={selectedTransmission}
                setSelectedTransmission={setSelectedTransmission}
                selectedFuelType={selectedFuelType}
                setSelectedFuelType={setSelectedFuelType}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className='lg:hidden mb-4'>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='w-full flex items-center justify-center gap-2 bg-gray-900 py-3 rounded-xl border border-gray-800 hover:border-blue-500 transition-colors'
            >
              <Filter size={20} />
              <span>Filters</span>
              <ChevronDown className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} size={20} />
            </button>
            
            {showFilters && (
              <div className='mt-4 bg-gray-900 rounded-xl p-6 border border-gray-800'>
                <FilterSection
                  brands={brands}
                  selectedBrand={selectedBrand}
                  setSelectedBrand={setSelectedBrand}
                  selectedCarType={selectedCarType}
                  setSelectedCarType={setSelectedCarType}
                  selectedTransmission={selectedTransmission}
                  setSelectedTransmission={setSelectedTransmission}
                  selectedFuelType={selectedFuelType}
                  setSelectedFuelType={setSelectedFuelType}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                />
              </div>
            )}
          </div>

          {/* Cars Grid */}
          <div className='flex-1'>
            {filteredCars.length === 0 ? (
              <div className='text-center py-20'>
                <p className='text-gray-400 text-xl'>No cars found matching your criteria</p>
                <button
                  onClick={clearFilters}
                  className='mt-4 px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors'
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {filteredCars.map((car) => (
                    <div className='bg-gray-900 rounded-[40px] border border-gray-800 overflow-hidden hover:border-blue-500 transform hover:scale-105 transition-all duration-300'>
                      {/* Car Image */}
                      <div className='relative h-[250px] overflow-hidden'>
                        <Link
                          to={`/cars/${car.id}`}
                          key={car.id}
                          className='group'
                        >
                          <img
                            src={getImageUrl(car.image)}
                            alt={car.name}
                            className='w-full h-full object-cover'
                          />
                        </Link>

                        {/* Wishlist & Compare Buttons  */}
                        <div className='absolute top-4 right-4 flex gap-2'>
                            {/* Wishlist Button */}
                            <button
                                onClick={() => {
                                    if (isInWishlist(car.id)) {
                                        removeFromWishlist(car.id);
                                    } else {
                                        const result = addToWishlist(car);
                                        if (!result.success) {
                                            // alert(result.message);
                                        }
                                    }
                                }}
                                className={`p-2 rounded-lg transition-colors ${
                                    isInWishlist(car.id)
                                        ? 'bg-red-500 text-white'
                                        : 'bg-white/90 text-red-500 hover:bg-white'
                                }`}
                                title={isInWishlist(car.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                            >
                                <Heart 
                                    size={20} 
                                    className={isInWishlist(car.id) ? 'fill-current' : ''}
                                />
                            </button>

                            {/* Compare Button (your existing one) */}
                            <button
                                onClick={() => {
                                    const result = addToComparison(car);
                                    if (!result.success) {
                                        alert(result.message);
                                    }
                                }}
                                disabled={isInComparison(car.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                    isInComparison(car.id)
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white/90 text-black hover:bg-white'
                                }`}
                                title={isInComparison(car.id) ? 'In comparison' : 'Add to compare'}
                            >
                                <GitCompare size={20} />
                            </button>
                        </div>
                        
                        {/* Specs Badges */}
                        <div className='absolute top-4 left-4 flex gap-2 flex-wrap'>
                          <span className='bg-white text-black px-3 py-1 rounded-lg text-sm font-semibold'>
                            {car.time}s
                          </span>
                          <span className='bg-white text-black px-3 py-1 rounded-lg text-sm font-semibold'>
                            {car.speed} km/h
                          </span>
                          <span className='bg-white text-black px-3 py-1 rounded-lg text-sm font-semibold'>
                            {car.horsepower} hp
                          </span>
                        </div>
                      </div>
                      
                      {/* Car Info */}
                      <div className='p-6'>
                        <div className='flex items-center justify-between mb-2'>
                          <h3 className='text-xl font-bold group-hover:text-blue-400 transition-colors'>
                            {car.name}
                          </h3>
                          <span className='text-sm text-gray-500'>{car.car_type}</span>
                        </div>
                        
                        <div className='flex items-center gap-2 text-sm text-gray-400 mb-3'>
                          <span>{car.transmission}</span>
                          <span>•</span>
                          <span>{car.fuel_type}</span>
                        </div>
                        
                        <div className='flex items-center justify-between'>
                          <div>
                            <p className='text-2xl font-bold text-blue-400'>
                              ${car.price_per_day}
                            </p>
                            <p className='text-sm text-gray-500'>per day</p>
                          </div>
                          <Link to={`/cars/${car.id}`}>
                          <button className='px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors'>
                            View Details
                          </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== FILTER SECTION COMPONENT ==========
const FilterSection = ({
  brands,
  selectedBrand,
  setSelectedBrand,
  selectedCarType,
  setSelectedCarType,
  selectedTransmission,
  setSelectedTransmission,
  selectedFuelType,
  setSelectedFuelType,
  priceRange,
  setPriceRange,
}) => {
  return (
    <div className='space-y-6'>
      {/* Brand Filter */}
      <div>
        <label className='block text-sm font-semibold mb-2'>Brand</label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className='w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500'
        >
          <option value=''>All Brands</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      {/* Car Type Filter */}
      <div>
        <label className='block text-sm font-semibold mb-2'>Car Type</label>
        <select
          value={selectedCarType}
          onChange={(e) => setSelectedCarType(e.target.value)}
          className='w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500'
        >
          <option value=''>All Types</option>
          <option value='SUV'>SUV</option>
          <option value='Sedan'>Sedan</option>
          <option value='Hatchback'>Hatchback</option>
        </select>
      </div>

      {/* Transmission Filter */}
      <div>
        <label className='block text-sm font-semibold mb-2'>Transmission</label>
        <select
          value={selectedTransmission}
          onChange={(e) => setSelectedTransmission(e.target.value)}
          className='w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500'
        >
          <option value=''>All</option>
          <option value='Automatic'>Automatic</option>
          <option value='Manual'>Manual</option>
        </select>
      </div>

      {/* Fuel Type Filter */}
      <div>
        <label className='block text-sm font-semibold mb-2'>Fuel Type</label>
        <select
          value={selectedFuelType}
          onChange={(e) => setSelectedFuelType(e.target.value)}
          className='w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500'
        >
          <option value=''>All</option>
          <option value='Petrol'>Petrol</option>
          <option value='Diesel'>Diesel</option>
          <option value='Electric'>Electric</option>
        </select>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className='block text-sm font-semibold mb-2'>
          Price Range: ${priceRange.min} - ${priceRange.max}
        </label>
        <div className='space-y-2'>
          <input
            type='range'
            min='0'
            max='5000'
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
            className='w-full'
          />
        </div>
      </div>
    </div>
  );
};


export default Cars