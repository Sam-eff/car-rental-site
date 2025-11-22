import React, { useContext } from 'react';
import { ComparisonContext } from '../context/ComparisonContext';
import { useNavigate } from 'react-router-dom';
import { X, GitCompare } from 'lucide-react';

const ComparisonBar = () => {
    const { comparisonList, removeFromComparison, clearComparison } = useContext(ComparisonContext);
    const navigate = useNavigate();

    if (comparisonList.length === 0) return null;

    return (
        <div className='fixed bottom-0 left-0 right-0 bg-gray-900 border-t-2 border-blue-500 shadow-2xl z-50 animate-slideUp'>
            <div className='container mx-auto px-4 py-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-2'>
                            <GitCompare className='text-blue-400' size={24} />
                            <span className='text-white font-semibold'>
                                Compare Cars ({comparisonList.length}/3)
                            </span>
                        </div>

                        <div className='flex gap-3'>
                            {comparisonList.map((car) => (
                                <div
                                    key={car.id}
                                    className='relative bg-gray-800 rounded-lg p-2 flex items-center gap-2 border border-gray-700'
                                >
                                    <img
                                        src={
                                            car.image?.startsWith('http')
                                                ? car.image
                                                : `http://127.0.0.1:8000${car.image}`
                                        }
                                        alt={car.name}
                                        className='w-16 h-12 object-cover rounded'
                                    />
                                    <span className='text-white text-sm font-medium max-w-[100px] truncate'>
                                        {car.name}
                                    </span>
                                    <button
                                        onClick={() => removeFromComparison(car.id)}
                                        className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors'
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='flex items-center gap-3'>
                        <button
                            onClick={clearComparison}
                            className='px-4 py-2 text-gray-400 hover:text-white transition-colors'
                        >
                            Clear All
                        </button>
                        <button
                            onClick={() => navigate('/compare')}
                            disabled={comparisonList.length < 2}
                            className='px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors'
                        >
                            Compare Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComparisonBar;