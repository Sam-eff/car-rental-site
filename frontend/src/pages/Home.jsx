import React from 'react'
import Navbar from '../components/Navbar'
import Carlist from '../components/Carlist'
import { Link } from 'react-router-dom'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Brand from '../components/Brand'


const Home = () => {
  return (
    <>
      <div className='justify-center items-center h-screen' style={{backgroundImage:"url('car-bg.jpg')",backgroundSize:"cover"}}>

        <div className='p-6 md:px-16 text-white '>
            <div className='pt-20'>
            <h3 className='text-2xl font-bold animate-easeInOut pt-4 font-serif'>Welcome to Autohire</h3>
            </div>
            <div className='pt-40'>
              <h1 className='text-4xl md:text-6xl pb-4 font-bold font-oxanium md:w-1/2'>Premium Car Rental at Your Fingertips</h1>
              <div className='pb-6 text-gray-400 font-serif'>
              <p>Book your dream car with ease and convenience.</p>
              <p>We offer a wide range of high-quality vehicles for your next adventure.</p>
              </div>
            </div>
            <Link to="/cars" className=' flex justify-center md:justify-start'><button className='bg-white  text-black px-4 py-2 rounded hover:bg-gray-200'>Explore Our Cars</button></Link>
        </div>
    </div>
    <div>
      {/* Featured Cars */}
      <Carlist />

      {/* Brands */}
      <Brand />

      {/* Features Section */}
      <Features />

      {/* How It Works */}
      <HowItWorks />
    </div>
    </>
  )
}

export default Home