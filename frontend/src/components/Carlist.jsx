import React from 'react'
import { useState, useEffect } from 'react'
import { carApi } from '../store/api'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../utils/Imagehelper'

const Carlist = () => {
    const [featuredCars, setFeaturedCars] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        carApi.getFeaturedCars()
        .then((response) => {
            setFeaturedCars(response.data.results || response.data)
            setIsLoading(false)
        })
        .catch((error) => {
            console.error('Error fetching featured cars:', error)
            setIsLoading(false)
        })
    }, [])


  return (
    <div className='py-20 px-4 text-white'>
        <div className='mb-10'>
            <h2 className='text-4xl font-medium font-poppins'>Select a Car</h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {featuredCars.map((car) => (
                 <div key={car.id} className='relative'>
                  <Link to={`/cars/${car.id}`}>
                  <div className='rounded-[40px] border border-gray-700 mb-2 transform hover:scale-105 transition-transform duration-200'>
                 <img src={getImageUrl(car.image)} alt={car.name}  className='w-full rounded-[40px] h-[300px] object-cover'/>
                 <div className='absolute top-4 left-4 flex gap-2'>
                     <span className='bg-white text-black px-2 py-1 rounded-lg'>{car.time} sec</span>
                     <span className='bg-white text-black px-2 py-1 rounded-lg'>{car.speed} km/h</span>
                     <span className='bg-white text-black px-2 py-1 rounded-lg'>{car.horsepower} hp</span>
                 </div>
                 </div>
                  </Link>
                 <h3 className=' font-poppins'>{car.name}</h3>
                 <p className='font-montserrat text-sm text-gray-500'>from ${car.price_per_day} /day</p>
             </div>
            ))}
        </div>
        <div className='flex justify-center mt-10'>
            <Link to="/cars">
            <button className=' text-white px-4 py-2 rounded hover:underline hover:text-gray-200'>Load More</button>
            </Link>
        </div>
    </div>
  )
}

export default Carlist