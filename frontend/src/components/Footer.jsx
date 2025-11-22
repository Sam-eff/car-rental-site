import React from 'react'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800'>
        <div className='container mx-auto px-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12'>
                {/* Column 1: About */}
                <div className='space-y-4'>
                  <img src="logo.png" alt="Autohire"  className='w-24'/>
                    <p className='text-gray-400 text-sm leading-relaxed'>
                        Your trusted partner for premium car rentals. Experience quality service and competitive rates.
                    </p>
                </div>

                {/* Column 2: Quick Links */}
                <div className='space-y-4'>
                    <h3 className='font-poppins text-xl font-semibold mb-4'>Quick Links</h3>
                    <div className='flex flex-col space-y-2 text-gray-400'>
                        <Link to="/" className='hover:text-blue-400 transition-colors duration-200'>Home</Link>
                        <Link to="/cars" className='hover:text-blue-400 transition-colors duration-200'>Cars</Link>
                        <Link to="/about" className='hover:text-blue-400 transition-colors duration-200'>About</Link>
                        <Link to="/contact" className='hover:text-blue-400 transition-colors duration-200'>Contact</Link>
                        <Link to="/terms" className='hover:text-blue-400 transition-colors duration-200'>Terms & Conditions</Link>
                        <Link to="/privacy" className='hover:text-blue-400 transition-colors duration-200'>Privacy Policy</Link>
                    </div>
                </div>

                {/* Column 3: Contact */}
                <div className='space-y-4'>
                    <h3 className='font-poppins text-xl font-semibold mb-4'>Contact Us</h3>
                    <div className='flex items-center text-gray-400 hover:text-blue-400 transition-colors'>
                        <Mail className='mr-3 w-5 h-5' />
                        <a href='mailto:info@autohire.com'>info@autohire.com</a>
                    </div>
                    <div className='flex items-center text-gray-400 hover:text-blue-400 transition-colors'>
                        <Phone className='mr-3 w-5 h-5' />
                        <a href='tel:+1234567890'>+1 (234) 567-890</a>
                    </div>
                    <div className='flex items-start text-gray-400'>
                        <MapPin className='mr-3 w-5 h-5 mt-1' />
                        <p>123 Main Street<br />Lagos, Nigeria</p>
                    </div>
                </div>

                {/* Column 4: Newsletter */}
                <div className='space-y-4'>
                    <h3 className='font-poppins text-xl font-semibold mb-4'>Newsletter</h3>
                    <p className='text-gray-400 text-sm'>Stay updated with our latest offers and news</p>
                    <form className='space-y-3'>
                        <input 
                            type='email' 
                            placeholder='Your email' 
                            className='w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none'
                        />
                        <button 
                            type='submit'
                            className='w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300'
                        >
                            Subscribe
                        </button>
                    </form>
                    
                    {/* Social Media */}
                    <div className='pt-4'>
                        <p className='text-sm text-gray-400 mb-3'>Follow Us</p>
                        <div className='flex gap-4'>
                            <a href='https://facebook.com' target='_blank' rel='noopener noreferrer' 
                               className='p-2 bg-gray-800 rounded-full hover:bg-blue-500 transition-colors duration-300'>
                                <Facebook className='w-5 h-5' />
                            </a>
                            <a href='https://twitter.com' target='_blank' rel='noopener noreferrer'
                               className='p-2 bg-gray-800 rounded-full hover:bg-blue-400 transition-colors duration-300'>
                                <Twitter className='w-5 h-5' />
                            </a>
                            <a href='https://instagram.com' target='_blank' rel='noopener noreferrer'
                               className='p-2 bg-gray-800 rounded-full hover:bg-pink-500 transition-colors duration-300'>
                                <Instagram className='w-5 h-5' />
                            </a>
                            <a href='https://linkedin.com' target='_blank' rel='noopener noreferrer'
                               className='p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors duration-300'>
                                <Linkedin className='w-5 h-5' />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className='border-t border-gray-800 pt-8'>
                <div className='flex flex-col md:flex-row justify-between items-center text-sm text-gray-400'>
                    <p>&copy; 2024 Autohire. All rights reserved.</p>
                    <div className='flex gap-6 mt-4 md:mt-0'>
                        <Link to="/privacy" className='hover:text-blue-400 transition-colors'>Privacy Policy</Link>
                        <Link to="/terms" className='hover:text-blue-400 transition-colors'>Terms of Service</Link>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer