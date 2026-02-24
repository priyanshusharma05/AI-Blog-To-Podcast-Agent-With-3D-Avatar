import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children, illustration: Illustration }) => {
    return (
        <div className="min-h-screen w-full bg-[#020617] relative flex items-center justify-center overflow-hidden font-sans">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                {/* Floating Spheres */}
                <motion.div
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        x: [0, -40, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/5 blur-[100px] rounded-full"
                />

                {/* Subtle Grid Pattern with stronger presence */}
                <div className="absolute inset-0 bg-noise opacity-[0.05] brightness-100 contrast-150" />
                <div className="absolute inset-0 bg-grid mask-radial opacity-30 shadow-inner" />
            </div>

            <div className="relative z-10 w-full mx-auto px-6 lg:px-12 py-8 flex items-center justify-center min-h-screen">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10 w-full max-w-6xl">
                    {/* Left Side: Hero content (Desktop) */}
                    <div className="hidden lg:flex flex-col flex-1 space-y-8 min-w-0">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
                                </span>
                                VoiceCast AI
                            </div>
                            <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.15] tracking-tight">
                                Transform Blogs into{' '}
                                <span className="bg-gradient-to-r from-teal-400 to-violet-400 bg-clip-text text-transparent">
                                    Podcasts
                                </span>
                            </h2>
                            <p className="text-slate-400 text-base max-w-md mt-5 leading-relaxed">
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

                    {/* Right Side: Form content */}
                    <div className="w-full lg:w-auto flex justify-center">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
