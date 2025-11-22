import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, DollarSign, Clock, Users, Award, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  const stats = [
    { icon: Car, label: 'Premium Cars', value: '50+' },
    { icon: Users, label: 'Happy Customers', value: '10,000+' },
    { icon: Award, label: 'Years Experience', value: '15+' },
    { icon: Shield, label: 'Safety Rating', value: '5-Star' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'All our vehicles undergo rigorous safety checks and maintenance to ensure your peace of mind.'
    },
    {
      icon: DollarSign,
      title: 'Best Prices',
      description: 'Competitive rates with no hidden fees. What you see is what you pay.'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Our customer service team is always available to assist you, anytime, anywhere.'
    },
    {
      icon: CheckCircle,
      title: 'Quality Guarantee',
      description: 'Premium vehicles maintained to the highest standards for your comfort.'
    }
  ];

  const team = [
    { name: 'Sam Effiong', role: 'CEO & Founder', image: 'sam.jpg' },
    { name: 'Jane Smith', role: 'Operations Manager', image: 'jane.jpg' },
    { name: 'Mike Johnson', role: 'Customer Relations', image: 'mike.jpg' }
  ];

  return (
    <>
      <div className='min-h-screen bg-black text-white'>
        {/* Hero Section */}
        <div className='relative h-[60vh] flex items-center justify-center overflow-hidden'>
          <div 
            className='absolute inset-0 bg-cover bg-center'
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200')",
              filter: 'brightness(0.3)'
            }}
          />
          <div className='relative z-10 text-center px-4'>
            <h1 className='text-5xl md:text-7xl font-bold mb-4'>About Autohire</h1>
            <p className='text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto'>
              Your trusted partner in premium car rentals since 2010
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className='py-20 px-4 bg-gradient-to-b from-black to-gray-900'>
          <div className='max-w-7xl mx-auto'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className='text-center'>
                    <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4'>
                      <Icon size={32} />
                    </div>
                    <h3 className='text-4xl font-bold text-blue-400 mb-2'>{stat.value}</h3>
                    <p className='text-gray-400'>{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Our Story Section */}
        <div className='py-20 px-4'>
          <div className='max-w-7xl mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              <div>
                <h2 className='text-4xl font-bold mb-6'>Our Story</h2>
                <div className='space-y-4 text-gray-300 leading-relaxed'>
                  <p>
                    Founded in 2010, Autohire began with a simple mission: to make premium car rentals 
                    accessible, affordable, and hassle-free for everyone.
                  </p>
                  <p>
                    What started as a small fleet of 10 vehicles has grown into one of the most trusted 
                    car rental services, with over 50 premium vehicles and thousands of satisfied customers.
                  </p>
                  <p>
                    We believe that renting a car should be as easy as booking a hotel room. That's why 
                    we've invested heavily in technology, customer service, and maintaining the highest 
                    quality standards for our fleet.
                  </p>
                </div>
              </div>
              <div>
                <img 
                  src='splash.jpg' 
                  alt='Our Fleet' 
                  className='rounded-2xl shadow-2xl'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className='py-20 px-4 bg-gray-900'>
          <div className='max-w-7xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl font-bold mb-4'>Why Choose Autohire</h2>
              <p className='text-gray-400 text-lg'>
                We're committed to providing the best car rental experience
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div 
                    key={index}
                    className='bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300'
                  >
                    <div className='w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4'>
                      <Icon size={24} />
                    </div>
                    <h3 className='text-xl font-bold mb-3'>{value.title}</h3>
                    <p className='text-gray-400'>{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className='py-20 px-4'>
          <div className='max-w-7xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl font-bold mb-4'>Meet Our Team</h2>
              <p className='text-gray-400 text-lg'>
                The people behind your perfect rental experience
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {team.map((member, index) => (
                <div 
                  key={index}
                  className='bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500 transition-all duration-300'
                >
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className='w-full h-45 object-cover'
                  />
                  <div className='p-6 text-center'>
                    <h3 className='text-xl font-bold mb-2'>{member.name}</h3>
                    <p className='text-gray-400'>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className='py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800'>
          <div className='max-w-4xl mx-auto text-center'>
            <h2 className='text-4xl font-bold mb-6'>Ready to Hit the Road?</h2>
            <p className='text-xl mb-8 text-gray-100'>
              Browse our fleet of premium vehicles and book your next adventure today
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link to='/cars'>
                <button className='px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors'>
                  Browse Cars
                </button>
              </Link>
              <Link to='/contact'>
                <button className='px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition-colors'>
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;