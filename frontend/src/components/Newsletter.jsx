import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { newsletterApi } from '../store/api';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await newsletterApi.subscribe(email);
      setMessage(response.data.message);
      setMessageType('success');
      setEmail('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to subscribe. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div className="bg-gray-900 py-12 px-4 border-t border-gray-800 mb-8">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-500 p-3 rounded-full">
            <Mail className="w-6 h-6" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-2">
          Subscribe to Our Newsletter
        </h3>
        <p className="text-gray-400 mb-6">
          Get the latest updates on new cars, special offers, and exclusive deals!
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>

          {message && (
            <div
              className={`mt-4 px-4 py-3 rounded-lg text-sm ${
                messageType === 'success'
                  ? 'bg-green-500/10 border border-green-500 text-green-500'
                  : 'bg-red-500/10 border border-red-500 text-red-500'
              }`}
            >
              {message}
            </div>
          )}
        </form>

        <p className="text-gray-500 text-sm mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};

export default Newsletter;