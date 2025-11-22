import React from 'react'
import { Search, Calendar, KeyRound } from 'lucide-react'

const steps = [
    {   
        step: "01",
        title: 'Choose Your Car',
        description: 'Browse our premium fleet and select the perfect vehicle for your journey',
        icon: Search,
    },
    {
        step: "02",
        title: 'Book Online',
        description: 'Complete our simple booking form and confirm your reservation instantly',
        icon: Calendar,
    },
    {
        step: "03",
        title: 'Pick Up & Go',
        description: 'Collect your car from our location and start your adventure',
        icon: KeyRound,
    },
]

const HowItWorks = () => {
  return (
    <div className='py-20 px-4 md:px-16 bg-gradient-to-b from-black to-gray-900'>
        <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-4'>How It Works</h2>
            <p className='text-gray-400 text-lg'>Get started in three simple steps</p>
        </div>

        <div className='relative max-w-5xl mx-auto'>
            {/* Connecting line - desktop only */}
            <div className='hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500'></div>
            
            <div className='grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8'>
                {steps.map((step, index) => {
                    const Icon = step.icon
                    return (
                        <div key={step.step} className='relative flex flex-col items-center text-center group'>
                            {/* Step number circle */}
                            <div className='relative z-10 w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform duration-300'>
                                <span className='text-2xl font-bold text-white'>{step.step}</span>
                            </div>
                            
                            {/* Icon */}
                            <div className='w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gray-700 transition-colors duration-300'>
                                <Icon className='w-8 h-8 text-blue-400' />
                            </div>
                            
                            {/* Content */}
                            <h3 className='text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300'>
                                {step.title}
                            </h3>
                            <p className='text-gray-400 leading-relaxed max-w-xs'>
                                {step.description}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  )
}

export default HowItWorks