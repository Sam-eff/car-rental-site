import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { carApi } from '../store/api'
import { getImageUrl } from '../utils/Imagehelper'


const Brand = () => {
    const [brands, setBrands] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        carApi.getBrand()
            .then((response) => {
                setBrands(response.data.results || response.data)
                setIsLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching brands:', error)
                setIsLoading(false)
            })
    }, [])

    if (isLoading) {
        return <div className='flex justify-center items-center h-64'>Loading brands...</div>
    }

    return (
        <div className='py-14 px-4 md:px-16'>
            {/* Section Header */}
            <div className='text-center mb-16'>
                <h2 className='text-4xl font-bold text-white mb-4'>Choose by Brand</h2>
                <p className='text-gray-400'>Browse our premium collection by manufacturer</p>
            </div>

            {/* Brands Grid */}
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-7xl mx-auto'>
                {brands.map((brand) => (
                    <Link 
                        to={`/cars?brand=${brand.id}`} 
                        key={brand.id}
                        className='group'
                    >
                        {/* Brand Card */}
                        <div className='bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-blue-500 transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center aspect-square'>
                            {/* Brand Logo */}
                            {brand.image ? (
                                <img 
                                    src={getImageUrl(brand.image)} 
                                    alt={brand.name}
                                    className='w-20 h-20 object-contain mb-4 filter grayscale group-hover:grayscale-0 transition-all duration-300'
                                />
                            ) : (
                                <div className='w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4'>
                                    <span className='text-3xl font-bold text-blue-500'>
                                        {brand.name.charAt(0)}
                                    </span>
                                </div>
                            )}
                            
                            {/* Brand Name */}
                            <h3 className='text-white font-semibold text-center group-hover:text-blue-400 transition-colors'>
                                {brand.name}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Brand