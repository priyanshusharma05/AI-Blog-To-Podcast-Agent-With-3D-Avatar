import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Mic, FileText, Cpu, Headphones, Sparkles, Zap, AudioLines } from 'lucide-react';
import Button from '../ui/Button';

const Hero = () => {
    return (
        <section className="relative pt-28 pb-20 lg:pt-44 lg:pb-32 overflow-hidden bg-[#FDFCFB]">
            {/* Unique Background Texture: Narrative Path */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] text-[#0D9488]" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,0 Q50,50 100,0 V100 Q50,50 0,100 Z" fill="currentColor" />
                </svg>
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-teal-100/30 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-50/40 blur-[100px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

                    {/* LEFT CONTENT: 60% */}
                    <div className="lg:col-span-7 text-left">
                        {/* Process Breadcrumb Indicator */}
                        {/* Unified Process Ribbon */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-6 p-2 mb-10 bg-white/40 backdrop-blur-md border border-slate-200/50 rounded-2xl shadow-sm relative overflow-hidden group"
                        >
                            {/* Animated Background Flow */}
                            <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                                className="absolute inset-0 w-1/2 h-[1px] top-0 bg-gradient-to-r from-transparent via-[#0D9488]/30 to-transparent"
                            />

                            <div className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/60 rounded-xl transition-colors cursor-default">
                                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <FileText size={12} className="text-slate-500" />
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Blog</span>
                            </div>

                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#0D9488]/20 rounded-xl shadow-sm"
                            >
                                <div className="w-6 h-6 rounded-lg bg-teal-50 flex items-center justify-center">
                                    <Cpu size={12} className="text-[#0D9488]" />
                                </div>
                                <span className="text-[10px] font-black text-[#0D9488] uppercase tracking-widest">AI Nano</span>
                            </motion.div>

                            <div className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/60 rounded-xl transition-colors cursor-default">
                                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Headphones size={12} className="text-slate-500" />
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cast</span>
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-6xl md:text-8xl font-black text-[#0F172A] leading-[0.9] tracking-tight mb-8"
                        >
                            Turn Your Blogs <br />
                            Into Engaging <span className="text-[#0D9488] relative">
                                AI-Powered
                                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 100 12" preserveAspectRatio="none">
                                    <path d="M0,10 Q25,0 50,10 Q75,20 100,10" stroke="#0D9488" strokeWidth="4" fill="none" opacity="0.3" />
                                </svg>
                            </span> <br />
                            Podcasts <span className="italic font-serif font-light text-slate-400">in Minutes</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-slate-600 max-w-xl mb-12 leading-relaxed"
                        >
                            Transform written content into natural-sounding podcast audio and avatar-based videos using advanced AI technology.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Button
                                className="bg-[#0F172A] hover:bg-[#0D9488] text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl shadow-slate-900/20 group"
                            >
                                🚀 Get Started
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                variant="secondary"
                                className="bg-white hover:bg-slate-100 border-slate-300 px-8 py-5 rounded-2xl text-lg font-bold shadow-md text-slate-700"
                            >
                                <Play className="mr-2 fill-[#0D9488] text-[#0D9488]" size={20} />
                                ▶ Watch Demo
                            </Button>
                        </motion.div>
                    </div>

                    {/* RIGHT CONTENT: "AGENT CLOUD" (40%) */}
                    <div className="lg:col-span-5 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative aspect-square flex items-center justify-center"
                        >
                            {/* Central Core */}
                            <div className="absolute w-48 h-48 bg-white rounded-[40px] shadow-2xl shadow-teal-900/10 border border-teal-50 flex items-center justify-center z-20 overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10 flex flex-col items-center">
                                    <Mic size={48} className="text-[#0D9488] mb-2" />
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <motion.div
                                                key={i}
                                                animate={{ height: [8, 16, 8] }}
                                                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                                                className="w-1 bg-[#0D9488] rounded-full"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Floating "Shards" / Interaction Cards */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute -top-10 -right-5 w-40 p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 z-30"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles size={16} className="text-orange-400" />
                                    <span className="text-[10px] font-black text-slate-800 uppercase">Analysis</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="h-1 w-full bg-teal-100 rounded-full" />
                                    <div className="h-1 w-2/3 bg-teal-100 rounded-full" />
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ x: [0, 15, 0], y: [0, 15, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
                                className="absolute bottom-5 -left-10 w-48 p-4 bg-[#0F172A] rounded-2xl shadow-2xl z-30 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-2 opacity-20">
                                    <Zap className="text-white" size={24} />
                                </div>
                                <span className="text-[10px] font-bold text-teal-400 uppercase mb-2 block">Audio Engine</span>
                                <AudioLines className="text-white opacity-40 mb-2 w-full" size={20} />
                                <div className="flex items-center justify-between text-[8px] text-slate-400 font-mono">
                                    <span>24-bit PCM</span>
                                    <span>96kHz</span>
                                </div>
                            </motion.div>

                            {/* Background Circles / Orbs */}
                            <div className="absolute inset-0 border-[2px] border-dashed border-teal-200/50 rounded-full animate-[spin_20s_linear_infinite]" />
                            <div className="absolute inset-16 border-[1px] border-slate-200/50 rounded-full animate-[spin_30s_linear_infinite_reverse]" />

                            {/* Decorative Orbitals */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                                className="absolute w-full h-full"
                            >
                                <div className="absolute top-0 left-1/2 -ml-2 w-4 h-4 bg-orange-400 rounded-full shadow-lg shadow-orange-400/50" />
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
