import React, { useContext } from 'react';
import { ComparisonContext } from '../context/ComparisonContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, X, Check, Star, DollarSign, Calendar, 
    Gauge, Fuel, Settings, Users, Package 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StarRating from '../components/StarRating';
import { getImageUrl } from '../utils/Imagehelper';


const Compare = () => {
    const { comparisonList, removeFromComparison, clearComparison } = useContext(ComparisonContext);
    const navigate = useNavigate();

    if (comparisonList.length === 0) {
        return (
            <>
                <Navbar />
                <div className='min-h-screen bg-black flex items-center justify-center px-4'>
                    <div className='text-center'>
                        <Package className='mx-auto text-gray-600 mb-4' size={64} />
                        <h1 className='text-3xl font-bold text-white mb-4'>No Cars to Compare</h1>
                        <p className='text-gray-400 mb-8'>
                            Add cars from the browse page to compare them side-by-side
                        </p>
                        <Link to='/cars'>
                            <button className='px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold'>
                                Browse Cars
                            </button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const comparisonFeatures = [
        { key: 'price_per_day', label: 'Price per Day', icon: DollarSign, format: (val) => `$${val}` },
        { key: 'year', label: 'Year', icon: Calendar, format: (val) => val },
        { key: 'car_type', label: 'Car Type', icon: Package, format: (val) => val },
        { key: 'transmission', label: 'Transmission', icon: Settings, format: (val) => val },
        { key: 'fuel_type', label: 'Fuel Type', icon: Fuel, format: (val) => val },
        { key: 'horsepower', label: 'Horsepower', icon: Gauge, format: (val) => `${val} hp` },
        { key: 'speed', label: 'Top Speed', icon: Gauge, format: (val) => `${val} km/h` },
        { key: 'time', label: '0-60 mph', icon: Gauge, format: (val) => `${val}s` },
        { key: 'average_rating', label: 'Rating', icon: Star, format: (val) => val?.toFixed(1) || 'N/A' },
        { key: 'review_count', label: 'Reviews', icon: Star, format: (val) => val || 0 },
    ];

    return (
        <>
            <Navbar />
            <div className='min-h-screen bg-black text-white py-20 px-4'>
                <div className='container mx-auto max-w-7xl'>
                    {/* Header */}
                    <div className='flex items-center justify-between mb-12'>
                        <div>
                            <button
                                onClick={() => navigate('/cars')}
                                className='flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors'
                            >
                                <ArrowLeft size={20} />
                                Back to Cars
                            </button>
                            <h1 className='text-4xl md:text-5xl font-bold mb-2'>Compare Cars</h1>
                            <p className='text-gray-400'>Side-by-side comparison of selected vehicles</p>
                        </div>
                        <button
                            onClick={() => {
                                clearComparison();
                                navigate('/cars');
                            }}
                            className='px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors'
                        >
                            Clear All
                        </button>
                    </div>

                    {/* Comparison Table */}
                    <div className='bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden'>
                        <div className='overflow-x-auto'>
                            <table className='w-full'>
                                <thead>
                                    <tr className='border-b border-gray-800'>
                                        <th className='p-6 text-left bg-gray-800/50 sticky left-0 z-10'>
                                            <span className='text-gray-400'>Feature</span>
                                        </th>
                                        {comparisonList.map((car) => (
                                            <th key={car.id} className='p-6 min-w-[300px]'>
                                                <div className='relative'>
                                                    <button
                                                        onClick={() => removeFromComparison(car.id)}
                                                        className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-20'
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                    <Link to={`/cars/${car.id}`}>
                                                        <img
                                                            src={getImageUrl(car.image)}
                                                            alt={car.name}
                                                            className='w-full h-40 object-cover rounded-lg mb-4 hover:opacity-80 transition-opacity'
                                                        />
                                                    </Link>
                                                    <h3 className='text-xl font-bold mb-2'>{car.name}</h3>
                                                    <p className='text-gray-400 text-sm'>{car.brand?.name}</p>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonFeatures.map((feature, index) => {
                                        const Icon = feature.icon;
                                        return (
                                            <tr
                                                key={feature.key}
                                                className={`border-b border-gray-800 ${
                                                    index % 2 === 0 ? 'bg-gray-800/30' : ''
                                                }`}
                                            >
                                                <td className='p-6 font-semibold bg-gray-800/50 sticky left-0 z-10'>
                                                    <div className='flex items-center gap-2'>
                                                        <Icon size={18} className='text-blue-400' />
                                                        <span>{feature.label}</span>
                                                    </div>
                                                </td>
                                                {comparisonList.map((car) => {
                                                    const value = car[feature.key];
                                                    const formattedValue = feature.format(value);

                                                    // Find best value for highlighting
                                                    let isBest = false;
                                                    if (feature.key === 'price_per_day') {
                                                        const prices = comparisonList.map(c => c.price_per_day);
                                                        isBest = value === Math.min(...prices);
                                                    } else if (['horsepower', 'speed', 'average_rating'].includes(feature.key)) {
                                                        const values = comparisonList.map(c => c[feature.key] || 0);
                                                        isBest = value === Math.max(...values);
                                                    } else if (feature.key === 'time') {
                                                        const times = comparisonList.map(c => c.time || 999);
                                                        isBest = value === Math.min(...times);
                                                    }

                                                    return (
                                                        <td
                                                            key={car.id}
                                                            className={`p-6 text-center ${
                                                                isBest ? 'bg-green-500/10 text-green-400 font-bold' : ''
                                                            }`}
                                                        >
                                                            {feature.key === 'average_rating' ? (
                                                                <div className='flex justify-center'>
                                                                    <StarRating rating={value || 0} readonly size={18} />
                                                                </div>
                                                            ) : (
                                                                <span>{formattedValue}</span>
                                                            )}
                                                            {isBest && (
                                                                <div className='text-xs mt-1'>
                                                                    <Check size={16} className='inline' /> Best
                                                                </div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}

                                    {/* Features Row */}
                                    <tr className='border-b border-gray-800'>
                                        <td className='p-6 font-semibold bg-gray-800/50 sticky left-0 z-10'>
                                            Features
                                        </td>
                                        {comparisonList.map((car) => (
                                            <td key={car.id} className='p-6'>
                                                <div className='space-y-2 text-sm'>
                                                    {car.features && car.features.length > 0 ? (
                                                        car.features.slice(0, 5).map((feature, idx) => (
                                                            <div key={idx} className='flex items-center gap-2'>
                                                                <Check size={14} className='text-green-400' />
                                                                <span>{feature.name || feature}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className='text-gray-500'>No features listed</span>
                                                    )}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Action Row */}
                                    <tr>
                                        <td className='p-6 bg-gray-800/50 sticky left-0 z-10'></td>
                                        {comparisonList.map((car) => (
                                            <td key={car.id} className='p-6'>
                                                <div className='space-y-3'>
                                                    <Link to={`/cars/${car.id}`}>
                                                        <button className='w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors'>
                                                            View Details
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => removeFromComparison(car.id)}
                                                        className='w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors'
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Add More Cars */}
                    {comparisonList.length < 3 && (
                        <div className='mt-8 text-center'>
                            <p className='text-gray-400 mb-4'>
                                You can compare up to 3 cars. Add more to compare.
                            </p>
                            <Link to='/cars'>
                                <button className='px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors'>
                                    Add More Cars
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Compare;