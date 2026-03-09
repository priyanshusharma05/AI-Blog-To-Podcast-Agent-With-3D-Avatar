import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Globe, Mic, Headphones, ArrowRight, MessageSquare, AudioLines, Share2, UserCheck, Video, Layout } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/landing/Hero';
import DemoVideo from '../components/landing/DemoVideo';

const Landing = () => {
    const steps = [
        { id: "1️⃣", title: "Upload Blog URL or Text", desc: "Start by pasting your content link or raw text." },
        { id: "2️⃣", title: "AI Generates Script", desc: "Our agent creates a conversational podcast script." },
        { id: "3️⃣", title: "Voice Synthesis", desc: "AI generates expressive and realistic narration." },
        { id: "4️⃣", title: "Avatar Rendering", desc: "Render a podcast video with a 3D virtual host." },
        { id: "5️⃣", title: "Download Final Podcast", desc: "Get your high-quality audio and video files." },
    ];

    const audiences = [
        "Bloggers", "Marketing Teams", "Educators", "Influencers", "Content Agencies"
    ];

    return (
        <div className="min-h-screen bg-[#FDFCFB] text-[#0F172A] selection:bg-teal-100 selection:text-teal-900">
            <Navbar />

            <main>
                <Hero />
                <DemoVideo />

                {/* BENTO FEATURE GRID */}
                <section className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                            Powerful AI <span className="text-slate-400">Features.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 grid-rows-2 gap-6 h-auto md:h-[600px]">

                        {/* FEATURE 1: AI Script Generation */}
                        <div className="md:col-span-2 lg:col-span-3 bg-white border border-slate-200 rounded-[40px] p-10 flex flex-col justify-between group hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                <Layout size={120} />
                            </div>
                            <div>
                                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 border border-teal-100">
                                    <Sparkles className="text-[#0D9488]" size={24} />
                                </div>
                                <h3 className="text-3xl font-black mb-4 tracking-tight">🎙 AI Script Generation</h3>
                                <p className="text-slate-500 font-medium">Automatically converts blogs into natural conversational podcast scripts.</p>
                            </div>
                        </div>

                        {/* FEATURE 2: Voice Synthesis */}
                        <div className="md:col-span-2 lg:col-span-3 bg-[#0F172A] rounded-[40px] p-10 flex flex-col justify-between group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent" />
                            <div>
                                <AudioLines className="text-teal-400 mb-6" size={32} />
                                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">🔊 Human-Like Voice</h3>
                                <p className="text-slate-400 font-medium">Generate expressive and realistic AI voice narration with full emotion.</p>
                            </div>
                        </div>

                        {/* FEATURE 3: 3D Avatars */}
                        <div className="md:col-span-2 lg:col-span-2 bg-teal-50 border border-teal-100 rounded-[40px] p-10 flex flex-col items-center justify-center text-center group transition-all duration-500">
                            <Video className="text-[#0D9488] mb-6 animate-pulse" size={40} />
                            <h3 className="text-2xl font-black mb-2 tracking-tight">🧑💻 3D Virtual Hosts</h3>
                            <p className="text-slate-500 text-sm font-bold">Present your podcast through customizable digital influencers.</p>
                        </div>

                        {/* FEATURE 4: Speed */}
                        <div className="md:col-span-2 lg:col-span-2 bg-white border border-slate-200 rounded-[40px] p-8 flex items-center gap-6 group transition-all duration-500">
                            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center shrink-0">
                                <Zap className="text-slate-400 group-hover:text-[#0D9488] transition-colors" size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight">⚡ Fast Processing</h3>
                                <p className="text-slate-500 text-xs font-bold leading-none mt-1">Convert blog to podcast in under 10 minutes.</p>
                            </div>
                        </div>

                        {/* FEATURE 5: Multi-Platform Export */}
                        <div className="md:col-span-2 lg:col-span-2 bg-white border border-slate-200 rounded-[40px] p-8 flex items-center gap-6 group transition-all duration-500">
                            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center shrink-0">
                                <Share2 className="text-slate-400" size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight">📤 Multi-Platform Export</h3>
                                <p className="text-slate-500 text-xs font-bold leading-none mt-1">Download audio and video podcast files instantly.</p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* HOW IT WORKS SECTION */}
                <section className="py-32 bg-slate-50 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-20">
                            <span className="text-[10px] font-black text-[#0D9488] uppercase tracking-[0.3em] mb-4 block">The Process</span>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tight">How It Works</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl transition-all group"
                                >
                                    <div className="text-3xl mb-6">{step.id}</div>
                                    <h4 className="text-lg font-black mb-3 leading-tight tracking-tight">{step.title}</h4>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* USE CASES SECTION */}
                <section className="py-32 bg-[#FDFCFB]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="md:w-1/2">
                                <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">Who Is It For?</h2>
                                <p className="text-slate-500 text-xl font-medium mb-10 max-w-lg">Our platform is designed to help creatives and teams scale their narrative content effortlessly.</p>
                                <div className="flex flex-wrap gap-3">
                                    {audiences.map((audience) => (
                                        <div key={audience} className="px-6 py-3 bg-white border border-slate-200 rounded-full text-sm font-bold text-[#0F172A] shadow-sm">
                                            {audience}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="md:w-1/2 relative">
                                <div className="w-full aspect-video bg-teal-900/5 rounded-3xl border border-teal-900/10 flex items-center justify-center overflow-hidden">
                                    <UserCheck size={80} className="text-[#0D9488] opacity-20" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA SECTION */}
                <section className="py-32 relative overflow-hidden bg-white">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="bg-[#0D9488] p-16 md:p-24 rounded-[60px] shadow-3xl shadow-teal-900/40 relative overflow-hidden"
                        >
                            <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none">
                                Ready to Transform Your Content?
                            </h2>
                            <button className="px-12 py-6 bg-white text-[#0D9488] font-black rounded-full text-xl shadow-xl hover:scale-105 transition-transform active:scale-95">
                                🚀 Start Creating Podcasts
                            </button>
                        </motion.div>
                    </div>
                </section>
            </main>

            <footer className="py-20 bg-[#FDFCFB] border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-[#0D9488] rounded-full flex items-center justify-center">
                                <Mic size={16} className="text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tighter uppercase">VoiceCast</span>
                        </div>
                        <p className="text-slate-400 max-w-sm font-medium">The narrative layer for the modern web. Built for creators who value depth and reach.</p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase text-xs tracking-widest mb-6">Product</h4>
                        <ul className="space-y-4 text-sm font-bold text-slate-500">
                            <li>Studio</li>
                            <li>Voices</li>
                            <li>Pricing</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black uppercase text-xs tracking-widest mb-6">Company</h4>
                        <ul className="space-y-4 text-sm font-bold text-slate-500">
                            <li>About</li>
                            <li>Blog</li>
                            <li>Security</li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
