import React from 'react'
import { DollarSign, Car, Headphones, Clock, Shield, Wrench } from 'lucide-react'

const features = [
    {
        icon: <DollarSign />,
        title: 'Affordable Prices',
        description: 'We offer competitive pricing for our services, ensuring that you get the best value for your money.',
    },
    {
        icon: <Car />,
        title: 'Wide Range of Vehicles',
        description: 'We have a diverse selection of cars to choose from, including luxury, sports, and utility vehicles.',
    },
    {
        icon: <Headphones />,
        title: 'Friendly Customer Service',
        description: 'Our friendly customer service team is available to assist you with any questions or concerns you may have.',
    },
    {
        icon: <Clock />,
        title: 'Flexible Rental Options',
        description: 'We offer a range of flexible rental options, such as daily, weekly, or monthly rentals, to suit your needs.',
    },
    {
        icon: <Shield />,
        title: 'Secure Payment Options',
        description: 'We accept a wide range of secure payment options, including credit cards, debit cards, and stripe.',
    },
    {
        icon: <Wrench />,
        title: 'Quality Maintenance Services',
        description: 'We offer quality maintenance services to ensure that your vehicle is in good condition and ready for your next adventure.',
    }
]

const Features = () => {
    return (
      <div className='py-20 px-4 md:px-16 bg-black'>
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-white mb-4'>Why Choose Autohire?</h2>
          <p className='text-gray-400'>Experience the best car rental service with our premium features</p>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {features.map((feature) => (
            <div 
              key={feature.title} 
              className='bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-blue-500 transition-all duration-300 hover:scale-105'
            >
              <div className='flex items-center gap-3 mb-4'>
                <div className='p-3 bg-blue-500 rounded-lg'>
                  {feature.icon}
                </div>
                <h3 className='text-xl font-semibold text-white'>{feature.title}</h3>
              </div>
              <p className='text-gray-400 leading-relaxed'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

export default Features