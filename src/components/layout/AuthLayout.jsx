import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mic } from 'lucide-react';

const AuthLayout = ({ children, illustration: Illustration }) => {
    return (
        <div className="min-h-screen w-full bg-[#FDFCFB] relative flex items-center justify-center overflow-hidden font-sans">
            {/* Soft ambient blobs matching landing page palette */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-teal-100/40 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-50/50 blur-[100px] rounded-full" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-slate-100/30 blur-[80px] rounded-full" />
            </div>

            {/* Navbar-style brand header */}
            <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
                <div className="flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-full shadow-sm">
                    <motion.div
                        whileHover={{ rotate: 180 }}
                        className="w-8 h-8 bg-[#0D9488] rounded-full flex items-center justify-center shadow-md shadow-teal-900/20"
                    >
                        <Mic className="text-white w-4 h-4" />
                    </motion.div>
                    <Link to="/" className="flex flex-col -gap-1">
                        <span className="text-base font-black text-[#0F172A] tracking-tighter leading-none">
                            VOICE<span className="text-[#0D9488]">CAST</span>
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Narrator AI</span>
                    </Link>
                </div>
            </div>

            <div className="relative z-10 w-full mx-auto px-6 lg:px-12 py-24 flex items-center justify-center min-h-screen">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full max-w-6xl">

                    {/* Left Side: Illustration (Desktop only) */}
                    <div className="hidden lg:flex flex-col flex-1 space-y-8 min-w-0">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Brand badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200/60 text-[#0D9488] text-xs font-bold tracking-widest uppercase mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0D9488] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0D9488]"></span>
                                </span>
                                VoiceCast AI
                            </div>
                            <h2 className="text-4xl xl:text-5xl font-black text-[#0F172A] leading-[1.1] tracking-tight">
                                Transform Blogs into{' '}
                                <span className="text-[#0D9488]">
                                    Podcasts
                                </span>
                            </h2>
                            <p className="text-slate-500 text-base max-w-md mt-5 leading-relaxed font-medium">
                                Your content deserves to be heard. Use AI to generate scripts, studio-quality voices, and 3D avatars in minutes.
                            </p>
                        </motion.div>

                        {Illustration && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="relative"
                            >
                                <Illustration />
                            </motion.div>
                        )}
                    </div>

                    {/* Right Side: Form */}
                    <div className="w-full lg:w-auto flex justify-center">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
