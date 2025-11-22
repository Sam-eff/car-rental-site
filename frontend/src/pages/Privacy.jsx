import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone } from 'lucide-react';


const Privacy = () => {
    return (
        <>
            <div className='min-h-screen bg-black text-white py-20 px-4'>
                <div className='max-w-4xl mx-auto'>
                    {/* Header */}
                    <div className='text-center mb-12'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4'>
                            <Shield className='text-blue-400' size={32} />
                        </div>
                        <h1 className='text-4xl md:text-5xl font-bold mb-4'>Privacy Policy</h1>
                        <p className='text-gray-400 text-lg'>Last updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    {/* Content */}
                    <div className='bg-gray-900 rounded-2xl p-8 md:p-12 border border-gray-800 space-y-8'>
                        <section>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Introduction</h2>
                            <p className='text-gray-300 leading-relaxed'>
                                At Autohire, we take your privacy seriously. This Privacy Policy explains how we collect,
                                use, disclose, and safeguard your information when you use our car rental platform. Please
                                read this policy carefully.
                            </p>
                        </section>

                        <section>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Information We Collect</h2>
                            <div className='space-y-4 text-gray-300'>
                                <div>
                                    <h3 className='text-lg font-semibold text-white mb-2'>Personal Information</h3>
                                    <ul className='list-disc list-inside space-y-2 ml-4'>
                                        <li>Name, email address, and phone number</li>
                                        <li>Billing and payment information</li>
                                        <li>Driver's license information</li>
                                        <li>Account credentials</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className='text-lg font-semibold text-white mb-2'>Usage Information</h3>
                                    <ul className='list-disc list-inside space-y-2 ml-4'>
                                        <li>Booking history and preferences</li>
                                        <li>Search queries and interactions</li>
                                        <li>Device information and IP address</li>
                                        <li>Cookies and tracking technologies</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>How We Use Your Information</h2>
                            <ul className='list-disc list-inside space-y-2 text-gray-300 ml-4'>
                                <li>Process your car rental bookings and payments</li>
                                <li>Communicate with you about your reservations</li>
                                <li>Improve our services and user experience</li>
                                <li>Send promotional offers and updates (with your consent)</li>
                                <li>Prevent fraud and ensure platform security</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Information Sharing</h2>
                            <p className='text-gray-300 leading-relaxed mb-4'>
                                We do not sell your personal information. We may share your information with:
                            </p>
                            <ul className='list-disc list-inside space-y-2 text-gray-300 ml-4'>
                                <li><strong>Service Providers:</strong> Payment processors, hosting services, and analytics providers</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                                <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Data Security</h2>
                            <p className='text-gray-300 leading-relaxed'>
                                We implement industry-standard security measures to protect your personal information,
                                including encryption, secure servers, and regular security audits. However, no method of
                                transmission over the internet is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Your Rights</h2>
                            <p className='text-gray-300 leading-relaxed mb-4'>You have the right to:</p>
                            <ul className='list-disc list-inside space-y-2 text-gray-300 ml-4'>
                                <li>Access and receive a copy of your personal data</li>
                                <li>Correct inaccurate information</li>
                                <li>Request deletion of your data</li>
                                <li>Opt-out of marketing communications</li>
                                <li>Lodge a complaint with a supervisory authority</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Cookies</h2>
                            <p className='text-gray-300 leading-relaxed'>
                                We use cookies and similar tracking technologies to enhance your experience, analyze usage,
                                and personalize content. You can control cookies through your browser settings.
                            </p>
                        </section>

                        <section>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Third-Party Links</h2>
                            <p className='text-gray-300 leading-relaxed'>
                                Our platform may contain links to third-party websites. We are not responsible for the
                                privacy practices of these external sites. We encourage you to read their privacy policies.
                            </p>
                        </section>

                        <section>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Children's Privacy</h2>
                            <p className='text-gray-300 leading-relaxed'>
                                Our services are not intended for individuals under 18 years of age. We do not knowingly
                                collect personal information from children.
                            </p>
                        </section>

                        <section>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Changes to This Policy</h2>
                            <p className='text-gray-300 leading-relaxed'>
                                We may update this Privacy Policy from time to time. We will notify you of any changes by
                                posting the new policy on this page and updating the "Last updated" date.
                            </p>
                        </section>

                        <section className='bg-gray-800/50 p-6 rounded-xl border border-gray-700'>
                            <h2 className='text-2xl font-bold mb-4 text-blue-400'>Contact Us</h2>
                            <p className='text-gray-300 mb-4'>
                                If you have questions about this Privacy Policy, please contact us:
                            </p>
                            <div className='space-y-3'>
                                <div className='flex items-center gap-3 text-gray-300'>
                                    <Mail size={20} className='text-blue-400' />
                                    <a href='mailto:privacy@autohire.com' className='hover:text-blue-400 transition-colors'>
                                        privacy@autohire.com
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
                            <Link to='/terms' className='text-blue-400 hover:text-blue-300 transition-colors'>
                                Terms of Service
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

export default Privacy;