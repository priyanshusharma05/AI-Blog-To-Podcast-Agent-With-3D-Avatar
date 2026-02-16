import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children, illustration: Illustration }) => {
    return (
        <div className="min-h-screen w-full bg-[#020617] relative flex items-center justify-center overflow-hidden font-sans">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full animate-pulse-slow" />

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-noise opacity-[0.03] brightness-100 contrast-150" />
                <div className="absolute inset-0 bg-grid mask-radial opacity-20" />
            </div>

            <div className="container relative z-10 mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-16 w-full max-w-6xl">
                    {/* Left Side: Hero content (Desktop) */}
                    <div className="hidden lg:flex flex-col flex-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-teal/10 border border-accent-teal/20 text-accent-teal text-xs font-semibold tracking-wider uppercase mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-teal"></span>
                                </span>
                                VoiceCast AI
                            </div>
                            <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                                Transform Blogs into <span className="text-teal-500">Podcasts</span>
                            </h2>
                            <p className="text-slate-400 text-lg max-w-md mt-6">
                                Your content deserves to be heard. Use AI to generate scripts, voices, and 3D avatars in minutes.
                            </p>
                        </motion.div>

                        {Illustration && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative"
                            >
                                <Illustration />
                            </motion.div>
                        )}
                    </div>

                    {/* Right Side: Form content */}
                    <div className="w-full flex justify-center lg:flex-initial">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
