import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, FileText, Headphones } from 'lucide-react';
import Button from '../ui/Button';

// Text lines widths (blog content feel)
const textLines = [1, 0.85, 1, 0.7, 0.9, 1, 0.6, 0.8];

// Waveform heights (podcast audio feel)
const waveHeights = [0.4, 0.65, 0.5, 0.9, 0.6, 1, 0.55, 0.75, 0.45, 0.85, 0.6, 0.95, 0.5, 0.7, 0.4, 0.8];

const Hero = () => {
    return (
        <section className="relative pt-20 pb-6 lg:pt-28 lg:pb-10 overflow-hidden bg-[#FDFCFB]">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-teal-100/30 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-50/40 blur-[100px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

                    {/* LEFT CONTENT — Just the heading */}
                    <div className="lg:col-span-7 text-left">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-6xl md:text-8xl font-black text-[#0F172A] leading-[0.9] tracking-tight"
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
                    </div>

                    {/* RIGHT — Thematic illustration + Action Buttons */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center gap-10">
                        {/* Illustration Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative w-full max-w-sm"
                        >
                            <div className="bg-white rounded-[2.5rem] border border-slate-200/80 shadow-xl shadow-slate-200/60 p-8 overflow-hidden">
                                {/* Header labels */}
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
                                            <FileText size={12} className="text-slate-500" />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blog</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="h-px w-8 bg-gradient-to-r from-slate-200 to-[#0D9488]/50" />
                                        <div className="px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/60">
                                            <span className="text-[9px] font-black text-[#0D9488] uppercase tracking-wider">AI</span>
                                        </div>
                                        <div className="h-px w-8 bg-gradient-to-r from-[#0D9488]/50 to-slate-200" />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-[#0D9488] uppercase tracking-widest">Podcast</span>
                                        <div className="w-6 h-6 rounded-lg bg-teal-50 flex items-center justify-center">
                                            <Headphones size={12} className="text-[#0D9488]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content split: Text lines | Waveform */}
                                <div className="flex gap-6 items-end h-40">
                                    <div className="flex-1 flex flex-col justify-center gap-3">
                                        {textLines.map((w, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * i }}
                                                className="flex items-center gap-1.5"
                                            >
                                                {i === 0 && <div className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />}
                                                <motion.div
                                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                                    transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                                                    style={{ width: `${w * 100}%` }}
                                                    className={`h-2 rounded-full ${i === 0 ? 'bg-slate-800' : i < 3 ? 'bg-slate-300' : 'bg-slate-200'}`}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="w-px self-stretch bg-gradient-to-b from-transparent via-slate-200 to-transparent" />

                                    <div className="flex-1 flex items-end justify-center gap-[4px] h-full">
                                        {waveHeights.map((h, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ height: [`${h * 40}%`, `${h * 100}%`, `${h * 40}%`] }}
                                                transition={{
                                                    duration: 1.2 + i * 0.07,
                                                    repeat: Infinity,
                                                    ease: 'easeInOut',
                                                    delay: i * 0.05,
                                                }}
                                                style={{
                                                    height: `${h * 100}%`,
                                                    background: `linear-gradient(to top, #0D9488, #5eead4)`,
                                                    opacity: 0.7 + h * 0.3,
                                                    borderRadius: '9999px',
                                                    flex: 1,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-[10px] text-slate-400 font-medium">Every word becomes a voice</span>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse" />
                                        <span className="text-[10px] font-bold text-[#0D9488]">Live</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 left-10 right-10 h-12 bg-teal-200/30 blur-2xl rounded-full -z-10" />
                        </motion.div>

                        {/* Buttons framed together */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="inline-flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50"
                        >
                            <Button className="bg-[#0F172A] hover:bg-[#0D9488] text-white px-8 py-4 rounded-2xl text-base font-bold shadow-lg shadow-slate-900/10 group whitespace-nowrap">
                                🚀 Get Started
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button variant="secondary" className="bg-transparent hover:bg-slate-50 border-0 shadow-none px-6 py-4 rounded-2xl text-base font-bold text-slate-600 whitespace-nowrap">
                                <Play className="mr-2 w-4 h-4 fill-[#0D9488] text-[#0D9488]" />
                                Watch Demo
                            </Button>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
