import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/landing/Hero';

const Landing = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-[0.03]" />
                <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-[0.2]" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                <Navbar />
                <main>
                    <Hero />

                    {/* Add more sections here later (Features, Pricing, etc.) */}
                    <section className="py-20 lg:py-32">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                                Ready to transform your blogs?
                            </h2>
                            <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
                                Join thousands of creators who are already using VoiceCast to reach a global audience.
                            </p>
                            <div className="flex justify-center">
                                <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                                    Get Started for Free
                                </button>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-white/5 py-12 bg-slate-900/50 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">V</span>
                            </div>
                            <span className="text-lg font-bold text-white">VoiceCast</span>
                        </div>
                        <div className="flex gap-8 text-sm text-slate-500">
                            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
                        </div>
                        <p className="text-sm text-slate-600">
                            © 2026 VoiceCast AI. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Landing;
