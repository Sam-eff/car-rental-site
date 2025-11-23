import React from 'react'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'
import Newsletter from './Newsletter'


const Footer = () => {
  return (
    <footer className='bg-slate-950 text-white pt-16 pb-8 border-t border-gray-800'>
        <Newsletter />
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