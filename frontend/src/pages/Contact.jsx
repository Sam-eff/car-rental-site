import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, User, AlertCircle, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import { contactApi } from '../store/api';


const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
    
        // Validate
        if (!formData.name || !formData.email || !formData.message) {
            setError('Please fill in all required fields');
            return;
        }
    
        if (!formData.email.includes('@') || !formData.email.includes('.')) {
            setError('Please enter a valid email address');
            return;
        }
    
        if (formData.message.length < 10) {
            setError('Message must be at least 10 characters');
            return;
        }
    
        setLoading(true);
    
        try {
            const response = await contactApi.sendMessage(formData);
            setSuccess(true);
            // Reset form
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
            
            // Hide success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message. Please try again.');
            console.log('Full error:', err);
            console.log('Response:', err.response);
            console.log('Status:', err.response?.status);
            console.log('Data:', err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: Mail,
            label: 'Email',
            value: 'info@autohire.com',
            link: 'mailto:info@autohire.com'
        },
        {
            icon: Phone,
            label: 'Phone',
            value: '+234 (0) 123 456 7890',
            link: 'tel:+2340123456789'
        },
        {
            icon: MapPin,
            label: 'Address',
            value: '123 Main Street, Lagos, Nigeria',
            link: 'https://maps.google.com'
        },
        {
            icon: Clock,
            label: 'Business Hours',
            value: 'Mon - Fri: 8AM - 6PM',
            link: null
        }
    ];

    return (
        <>
            <div className='min-h-screen bg-black text-white py-20 px-4'>
                <div className='max-w-7xl mx-auto'>
                    {/* Header */}
                    <div className='text-center mb-16'>
                        <h1 className='text-4xl md:text-5xl font-bold mb-4'>Get in Touch</h1>
                        <p className='text-gray-400 text-lg'>
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    {/* Two Column Layout */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
                        {/* Contact Form */}
                        <div className='bg-gray-900 rounded-2xl p-8 border border-gray-800'>
                            <h2 className='text-2xl font-bold mb-6'>Send us a Message</h2>

                            <form onSubmit={handleSubmit} className='space-y-5'>
                                {/* Success Message */}
                                {success && (
                                    <div className='bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg flex items-center gap-2'>
                                        <AlertCircle size={20} />
                                        <span>Message sent successfully! We'll get back to you soon.</span>
                                    </div>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <div className='bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg flex items-center gap-2'>
                                        <AlertCircle size={20} />
                                        <span className='text-sm'>{error}</span>
                                    </div>
                                )}

                                {/* Name Field */}
                                <div>
                                    <label htmlFor='name' className='block text-white font-medium mb-2'>
                                        Name <span className='text-red-500'>*</span>
                                    </label>
                                    <div className='relative'>
                                        <User className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500' size={20} />
                                        <input
                                            type='text'
                                            id='name'
                                            name='name'
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder='Your name'
                                            className='w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors'
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor='email' className='block text-white font-medium mb-2'>
                                        Email <span className='text-red-500'>*</span>
                                    </label>
                                    <div className='relative'>
                                        <Mail className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500' size={20} />
                                        <input
                                            type='email'
                                            id='email'
                                            name='email'
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder='your.email@example.com'
                                            className='w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors'
                                        />
                                    </div>
                                </div>

                                {/* Subject Field */}
                                <div>
                                    <label htmlFor='subject' className='block text-white font-medium mb-2'>
                                        Subject
                                    </label>
                                    <div className='relative'>
                                        <MessageSquare className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500' size={20} />
                                        <input
                                            type='text'
                                            id='subject'
                                            name='subject'
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder='What is this about?'
                                            className='w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors'
                                        />
                                    </div>
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label htmlFor='message' className='block text-white font-medium mb-2'>
                                        Message <span className='text-red-500'>*</span>
                                    </label>
                                    <textarea
                                        id='message'
                                        name='message'
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        placeholder='Tell us more about your inquiry...'
                                        className='w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none'
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type='submit'
                                    disabled={loading}
                                    className='w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2'
                                >
                                    <Send size={20} />
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div className='space-y-8'>
                            <div>
                                <h2 className='text-2xl font-bold mb-6'>Contact Information</h2>
                                <p className='text-gray-400 mb-8'>
                                    Feel free to reach out to us through any of the following methods. Our team is ready to assist you.
                                </p>
                            </div>

                            <div className='space-y-6'>
                                {contactInfo.map((info, index) => {
                                    const Icon = info.icon;
                                    return (
                                        <div 
                                            key={index}
                                            className='bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-blue-500 transition-all duration-300'
                                        >
                                            <div className='flex items-start gap-4'>
                                                <div className='w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0'>
                                                    <Icon size={24} />
                                                </div>
                                                <div>
                                                    <p className='text-gray-500 text-sm mb-1'>{info.label}</p>
                                                    {info.link ? (
                                                        <a 
                                                            href={info.link}
                                                            className='text-white font-medium hover:text-blue-400 transition-colors'
                                                            target={info.link.startsWith('http') ? '_blank' : undefined}
                                                            rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                        >
                                                            {info.value}
                                                        </a>
                                                    ) : (
                                                        <p className='text-white font-medium'>{info.value}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Map or Additional Info */}
                            <div className='bg-gray-900 p-6 rounded-xl border border-gray-800'>
                                <h3 className='text-xl font-bold mb-4'>Visit Our Office</h3>
                                <p className='text-gray-400 mb-4'>
                                    Come visit us at our office location. We're open Monday through Friday during business hours.
                                </p>
                                {/* Placeholder for map */}
                                <div className='w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center'>
                                    <p className='text-gray-500'>Map Coming Soon</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;