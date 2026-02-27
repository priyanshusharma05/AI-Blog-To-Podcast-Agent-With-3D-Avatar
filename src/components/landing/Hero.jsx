import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import Button from '../ui/Button';

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-violet-600/20 blur-[100px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Hero Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 hover:bg-white/10 transition-colors cursor-default"
                >
                    <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                    <span className="text-sm font-medium text-slate-300">Over 2,000+ happy creators</span>
                    <div className="w-px h-3 bg-white/20 mx-1" />
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-slate-400 font-medium">4.9/5 on G2</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
                >
                    All-in-one <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">AI audio</span> <br className="hidden md:block" /> platform for creators
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Create studio-quality podcasts with AI avatars and voiceovers in 160+ languages.
                    Save up to 90% of time and cost on audio production.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                >
                    <Button
                        variant="primary"
                        className="w-full sm:w-auto px-8 py-4 text-lg bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-2xl shadow-indigo-600/30 group"
                    >
                        Get started for FREE
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                        variant="secondary"
                        className="w-full sm:w-auto px-8 py-4 text-lg bg-white/5 hover:bg-white/10 text-white border-white/10 rounded-xl backdrop-blur-sm group"
                    >
                        <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                        Watch Demo
                    </Button>
                </motion.div>

                {/* Social Proof / Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-slate-500 font-medium"
                >
                    <span className="text-sm opacity-60">No credit card required</span>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-indigo-500" />
                        <span className="text-sm">Instant Setup</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-indigo-500" />
                        <span className="text-sm">Secure & Private</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap size={16} className="text-indigo-500" />
                        <span className="text-sm">AI-Powered</span>
                    </div>
                </motion.div>

                {/* Visual Preview Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    className="mt-20 relative px-4"
                >
                    <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/10 bg-slate-900 group">
                        {/* Mockup Top Bar */}
                        <div className="h-8 bg-slate-800/50 flex items-center px-4 gap-1.5 border-b border-white/5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                        </div>
                        {/* Mockup Content */}
                        <div className="aspect-[16/9] md:aspect-[21/9] bg-gradient-to-br from-indigo-900/40 to-slate-900 flex items-center justify-center relative group-hover:from-indigo-900/50 transition-colors">
                            <div className="absolute inset-0 bg-grid opacity-20" />
                            <div className="flex flex-col items-center gap-4 relative z-10">
                                <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/40 cursor-pointer hover:scale-110 transition-transform">
                                    <Play size={32} className="text-white fill-white ml-1" />
                                </div>
                                <span className="text-slate-400 font-medium tracking-wide">See VoiceCast in action</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
