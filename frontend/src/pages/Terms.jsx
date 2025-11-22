import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Mail, Phone } from 'lucide-react';


const Terms = () => {
    return (
        <>
            <div className='min-h-screen bg-black text-white py-20 px-4'>
                <div className='max-w-4xl mx-auto'>
                    {/* Header */}
                    <div className='text-center mb-12'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4'>
                            <FileText className='text-blue-400' size={32} />
                        </div>
                        <h1 className='text-4xl md:text-5xl font-bold mb-4'>Terms of Service</h1>
                        <p className='text-gray-400 text-lg'>Last updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    {/* Content */}
                    <div className='bg-gray-900 rounded-2xl p-8 md:p-12 border border-gray-800 space-y-8'>
                        <section>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Acceptance of Terms</h2>
                            <p className='text-gray-300 leading-relaxed'>
                                By accessing and using Autohire's car rental platform, you accept and agree to be bound by
                                these Terms of Service. If you do not agree to these terms, please do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Eligibility</h2>
                            <p className='text-gray-300 leading-relaxed mb-4'>To use our services, you must:</p>
                            <ul className='list-disc list-inside space-y-2 text-gray-300 ml-4'>
                                <li>Be at least 18 years of age</li>
                                <li>Hold a valid driver's license</li>
                                <li>Have the legal capacity to enter into a binding contract</li>
                                <li>Provide accurate and complete information</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Account Registration</h2>
                            <p className='text-gray-300 leading-relaxed mb-4'>
                                When creating an account, you agree to:
                            </p>
                            <ul className='list-disc list-inside space-y-2 text-gray-300 ml-4'>
                                <li>Provide truthful and accurate information</li>
                                <li>Maintain the security of your account credentials</li>
                                <li>Notify us immediately of unauthorized access</li>
                                <li>Be responsible for all activities under your account</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Rental Terms</h2>
                            <div className='space-y-4 text-gray-300'>
                                <div>
                                    <h3 className='text-lg font-semibold text-white mb-2'>Booking and Payment</h3>
                                    <ul className='list-disc list-inside space-y-2 ml-4'>
                                        <li>All bookings must be paid in advance through our secure payment system</li>
                                        <li>Prices are subject to change without notice until booking is confirmed</li>
                                        <li>Additional fees may apply for late returns, damages, or violations</li>
                                        <li>Security deposits may be required for certain vehicle categories</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className='text-lg font-semibold text-white mb-2'>Vehicle Use</h3>
                                    <ul className='list-disc list-inside space-y-2 ml-4'>
                                        <li>Vehicles must be used legally and responsibly</li>
                                        <li>No smoking, pets, or illegal activities in vehicles</li>
                                        <li>Vehicles may not be subleased or used for commercial purposes</li>
                                        <li>Mileage limits may apply based on rental agreement</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className='text-lg font-semibold text-white mb-2'>Insurance and Liability</h3>
                                    <ul className='list-disc list-inside space-y-2 ml-4'>
                                        <li>Basic insurance is included in all rentals</li>
                                        <li>Renters are liable for damages not covered by insurance</li>
                                        <li>Additional coverage options are available</li>
                                        <li>Traffic violations are the responsibility of the renter</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Cancellation Policy</h2>
                            <ul className='list-disc list-inside space-y-2 text-gray-300 ml-4'>
                                <li><strong>Free cancellation:</strong> Up to 24 hours before pickup</li>
                                <li><strong>50% refund:</strong> 12-24 hours before pickup</li>
                                <li><strong>No refund:</strong> Less than 12 hours before pickup</li>
                                <li>Cancellations must be made through your account dashboard</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Prohibited Activities</h2>
                            <p className='text-gray-300 leading-relaxed mb-4'>You may not:</p>
                            <ul className='list-disc list-inside space-y-2 text-gray-300 ml-4'>
                                <li>Use false or misleading information</li>
                                <li>Engage in fraudulent activities</li>
                                <li>Violate any laws or regulations</li>
                                <li>Interfere with platform operations</li>
                                <li>Reverse engineer or copy our software</li>
                                <li>Use vehicles for racing, testing, or training</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Intellectual Property</h2>
                            <p className='text-gray-300 leading-relaxed'>
                                All content on the Autohire platform, including text, graphics, logos, and software, is the
                                property of Autohire and protected by copyright and trademark laws. You may not reproduce or
                                distribute our content without permission.
                            </p>
                        </section>

                        <section>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Limitation of Liability</h2>
                            <p className='text-gray-300 leading-relaxed'>
                                Autohire is not liable for indirect, incidental, special, or consequential damages arising
                                from your use of our services. Our total liability shall not exceed the amount paid by you
                                for the rental in question.
                            </p>
                        </section>

                        <section>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Dispute Resolution</h2>
                            <p className='text-gray-300 leading-relaxed'>
                                Any disputes arising from these terms shall be resolved through binding arbitration in
                                accordance with the laws of Nigeria. You waive your right to participate in class action
                                lawsuits.
                            </p>
                        </section>

                        <section>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Modifications</h2>
                            <p className='text-gray-300 leading-relaxed'>
                                We reserve the right to modify these Terms of Service at any time. Changes will be effective
                                immediately upon posting. Your continued use of the platform constitutes acceptance of
                                modified terms.
                            </p>
                        </section>

                        <section>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Termination</h2>
                            <p className='text-gray-300 leading-relaxed'>
                                We may suspend or terminate your account at any time for violations of these terms or for
                                any other reason. Upon termination, your right to use the platform ceases immediately.
                            </p>
                        </section>

                        <section className='bg-gray-800/50 p-6 rounded-xl border border-gray-700'>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Contact Information</h2>
                            <p className='text-gray-300 mb-4'>
                                For questions about these Terms of Service, please contact us:
                            </p>
                            <div className='space-y-3'>
                                <div className='flex items-center gap-3 text-gray-300'>
                                    <Mail size={20} className='text-blue-400' />
                                    <a href='mailto:legal@autohire.com' className='hover:text-blue-400 transition-colors'>
                                        legal@autohire.com
                                    </a>
                                </div>
                                <div className='flex items-center gap-3 text-gray-300'>
                                    <Phone size={20} className='text-blue-400' />
                                    <span>+234 (0) 123 456 7890</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Related Links */}
                    <div className='mt-8 text-center'>
                        <p className='text-gray-500 mb-4'>See also:</p>
                        <div className='flex gap-4 justify-center'>
                            <Link to='/privacy' className='text-blue-400 hover:text-blue-300 transition-colors'>
                                Privacy Policy
                            </Link>
                            <span className='text-gray-700'>•</span>
                            <Link to='/contact' className='text-blue-400 hover:text-blue-300 transition-colors'>
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Terms;