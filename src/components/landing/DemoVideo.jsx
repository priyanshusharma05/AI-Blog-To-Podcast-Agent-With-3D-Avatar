import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Video, Zap } from 'lucide-react';
import demoVideoSrc from '../../../HomeDemo.mp4';

const DemoVideo = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    return (
        <section id="demo-section" className="py-24 bg-[#FDFCFB] relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-100 rounded-full text-teal-700 text-sm font-bold mb-6"
                    >
                        <Play size={16} fill="currentColor" />
                        <span>Experience the Magic</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black tracking-tight mb-6"
                    >
                        Watch VoiceCast <span className="text-[#0D9488]">in Action</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-lg font-medium max-w-2xl mx-auto"
                    >
                        See how we transform a simple blog post into a high-fidelity,
                        3D-rendered podcast with artificial intelligence.
                    </motion.p>
                </div>

                {/* Video Player Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative group mb-24"
                >
                    <div className="absolute -inset-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-[48px] opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-700" />

                    <div className="relative aspect-[21/9] md:aspect-video bg-slate-900 rounded-[32px] md:rounded-[48px] overflow-hidden border border-slate-200/50 shadow-2xl shadow-teal-900/10 group-hover:shadow-teal-900/20 transition-all duration-700">
                        <video
                            ref={videoRef}
                            className="absolute inset-0 h-full w-full object-cover"
                            controls={isPlaying}
                            preload="metadata"
                            playsInline
                            onPlay={() => setIsPlaying(true)}
                            onPause={(event) => {
                                if (event.currentTarget.ended) {
                                    setIsPlaying(false);
                                }
                            }}
                            onEnded={() => setIsPlaying(false)}
                        >
                            <source src={demoVideoSrc} type="video/mp4" />
                            Your browser does not support the demo video.
                        </video>

                        {!isPlaying && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (videoRef.current) {
                                            videoRef.current.play();
                                        }
                                        setIsPlaying(true);
                                    }}
                                    className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-800/50 backdrop-blur-sm z-10 transition-colors group-hover:bg-slate-800/30"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-20 h-20 md:w-24 md:h-24 bg-teal-500 rounded-full flex items-center justify-center cursor-pointer mb-6 shadow-2xl shadow-teal-500/40"
                                    >
                                        <Play size={36} fill="white" className="ml-2" />
                                    </motion.div>
                                    <h3 className="text-2xl md:text-3xl font-black mb-3 tracking-tight">Click to Play Demo</h3>
                                    <p className="text-teal-400 font-bold uppercase tracking-widest text-xs">Full HD Experience • 2:45 Mins</p>
                                </button>

                                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+PHBhdGggZD0iTTAgMGg4MHY4MEgwem00MCA0MGMxMS0xMSAyOS0xMSA0MCAwVjBjLTExIDExLTI5IDExLTQwIDBTMC0xMS0xMS0xMSAwIDB6IiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] pointer-events-none" />

                                <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 flex gap-1 z-20">
                                    {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.3, 0.6].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [`${h * 100}%`, `${h * 40}%`, `${h * 100}%`] }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                                            className="w-1 md:w-1.5 bg-teal-400 rounded-full opacity-80"
                                            style={{ height: '32px' }}
                                        />
                                    ))}
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-700 z-20">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        whileInView={{ width: "35%" }}
                                        transition={{ duration: 2, delay: 1 }}
                                        className="h-full bg-teal-500 rounded-r-full relative"
                                    >
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow" />
                                    </motion.div>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Feature Highlights from Video */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-shadow"
                    >
                        <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#0D9488] mb-6 border border-teal-100">
                            <Sparkles size={24} />
                        </div>
                        <h4 className="text-xl font-black mb-3">AI Scripting in Action</h4>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed">Watch the AI analyze article structure to build a compelling conversational flow between virtual hosts.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-shadow"
                    >
                        <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#0D9488] mb-6 border border-teal-100">
                            <Video size={24} />
                        </div>
                        <h4 className="text-xl font-black mb-3">Real-time Avatar Sync</h4>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed">Observe precise lip-syncing and expressive gestures dynamically rendered by our 3D engine.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-shadow"
                    >
                        <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#0D9488] mb-6 border border-teal-100">
                            <Zap size={24} />
                        </div>
                        <h4 className="text-xl font-black mb-3">Lightning Fast Export</h4>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed">See how the final rendered 4K video is ready for download in just a matter of minutes.</p>
                    </motion.div>
                </div>

            </div>
        </section>
    );
};

export default DemoVideo;
