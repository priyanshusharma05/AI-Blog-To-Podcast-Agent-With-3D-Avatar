import React from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    AudioLines,
    FileText,
    Headphones,
    Play,
    Sparkles,
    Wand2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const textStrips = [1, 0.86, 0.74, 0.92, 0.62, 0.78];
const waveformBars = [0.35, 0.65, 0.48, 0.88, 0.72, 0.96, 0.54, 0.76, 0.44, 0.83];

const Hero = () => {
    return (
        <section className="relative overflow-hidden bg-[#f6f6f1] pt-24 pb-12 lg:pt-32 lg:pb-20">
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-[-8%] top-16 h-72 w-72 rounded-full bg-[#0D9488]/10 blur-3xl" />
                <div className="absolute right-[-4%] top-24 h-[26rem] w-[26rem] rounded-full bg-[#f59e0b]/10 blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(13,148,136,0.12),_transparent_60%)]" />
                <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:44px_44px]" />
            </div>

            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-8">
                <div className="lg:col-span-7">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55 }}
                        className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#0D9488]/15 bg-white/80 px-4 py-2 text-sm font-bold text-[#0D9488] shadow-sm shadow-teal-900/5 backdrop-blur"
                    >
                        <Sparkles size={15} />
                        Blog to podcast, now with a sharper studio feel
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.05 }}
                        className="max-w-4xl text-[3.4rem] font-black leading-[0.92] tracking-[-0.05em] text-[#0F172A] sm:text-[4.4rem] lg:text-[5.75rem]"
                    >
                        Turn static blogs into
                        <span className="block text-[#0D9488]">cinematic AI podcasts</span>
                        <span className="block font-serif text-[0.42em] font-normal italic tracking-normal text-slate-500">
                            with scripts, voice, and host-ready output in one flow
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.14 }}
                        className="mt-7 max-w-2xl text-lg font-medium leading-8 text-slate-600"
                    >
                        VoiceCast turns article links, pasted text, and uploaded files into polished podcast episodes.
                        Generate the script, produce the narration, and move from source content to publishable media without
                        bouncing across tools.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.22 }}
                        className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
                    >
                        <Link to="/signup">
                            <Button className="group rounded-2xl bg-[#0F172A] px-8 py-4 text-base font-bold text-white shadow-xl shadow-slate-900/15 transition-all hover:bg-[#0D9488]">
                                Start Creating
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>

                        <Button
                            onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
                            variant="secondary"
                            className="rounded-2xl border border-slate-200 bg-white/80 px-7 py-4 text-base font-bold text-slate-700 shadow-sm backdrop-blur hover:bg-white"
                        >
                            <Play className="mr-2 h-4 w-4 fill-[#0D9488] text-[#0D9488]" />
                            Watch Demo
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.3 }}
                        className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3"
                    >
                        {[
                            { value: '3 inputs', label: 'URL, text, or .txt upload' },
                            { value: '1 flow', label: 'Script to audio pipeline' },
                            { value: 'FastAPI + React', label: 'Built for product expansion' },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="rounded-2xl border border-white/80 bg-white/75 px-5 py-4 shadow-sm shadow-slate-900/5 backdrop-blur"
                            >
                                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">{item.value}</p>
                                <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{item.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.75, delay: 0.15 }}
                    className="relative lg:col-span-5"
                >
                    <div className="absolute -right-6 top-4 h-28 w-28 rounded-[2rem] bg-[#0D9488]/10 blur-2xl" />
                    <div className="absolute -left-4 bottom-8 h-32 w-32 rounded-full bg-amber-200/30 blur-3xl" />

                    <div className="relative rounded-[2rem] border border-slate-200/70 bg-white/85 p-4 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.28)] backdrop-blur">
                        <div className="rounded-[1.6rem] bg-[#0f172a] p-5 text-white">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-teal-300">Live Studio</p>
                                    <h3 className="mt-2 text-2xl font-black tracking-tight">Episode Assembly</h3>
                                </div>
                                <div className="rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-teal-200">
                                    In progress
                                </div>
                            </div>

                            <div className="mt-5 grid gap-4">
                                <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                                            <FileText size={16} className="text-teal-300" />
                                            Source article
                                        </div>
                                        <span className="text-xs font-bold text-slate-400">Parsed</span>
                                    </div>
                                    <div className="space-y-2.5">
                                        {textStrips.map((width, index) => (
                                            <motion.div
                                                key={index}
                                                animate={{ opacity: [0.45, 1, 0.45] }}
                                                transition={{ duration: 2.4 + index * 0.22, repeat: Infinity, ease: 'easeInOut' }}
                                                className="h-2.5 rounded-full bg-white/10"
                                                style={{ width: `${width * 100}%` }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-[1.2fr_0.8fr] gap-4">
                                    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                                        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-200">
                                            <Wand2 size={16} className="text-teal-300" />
                                            AI narration draft
                                        </div>
                                        <div className="rounded-2xl bg-[#111c31] p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Tone</span>
                                                <span className="text-sm font-black text-white">Conversational</span>
                                            </div>
                                            <div className="mt-4 space-y-3">
                                                {['Hook', 'Context', 'Narrative flow'].map((label, index) => (
                                                    <div key={label} className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-slate-300">{label}</span>
                                                        <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${65 + index * 12}%` }}
                                                                transition={{ duration: 1.2, delay: 0.25 + index * 0.14 }}
                                                                className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-300"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                                        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-200">
                                            <Headphones size={16} className="text-teal-300" />
                                            Voice render
                                        </div>
                                        <div className="flex h-[10.5rem] items-end justify-between gap-1 rounded-2xl bg-[#111c31] px-3 py-4">
                                            {waveformBars.map((bar, index) => (
                                                <motion.div
                                                    key={index}
                                                    animate={{ height: [`${bar * 35}%`, `${bar * 100}%`, `${bar * 35}%`] }}
                                                    transition={{
                                                        duration: 1.4 + index * 0.06,
                                                        repeat: Infinity,
                                                        ease: 'easeInOut',
                                                        delay: index * 0.04,
                                                    }}
                                                    className="w-full rounded-full bg-gradient-to-t from-[#0D9488] to-teal-300"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 flex items-center justify-between rounded-[1.3rem] border border-white/10 bg-white/5 px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-teal-400/10 p-2 text-teal-300">
                                        <AudioLines size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Publishing-ready output</p>
                                        <p className="text-xs font-medium text-slate-400">Script, audio, and episode metadata prepared</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Status</p>
                                    <p className="text-sm font-black text-teal-300">Ready next</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-[1.3rem] border border-slate-200 bg-slate-50 px-4 py-4">
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Input flexibility</p>
                                <p className="mt-2 text-sm font-bold text-slate-800">Blog URL, pasted text, or uploaded transcript</p>
                            </div>
                            <div className="rounded-[1.3rem] border border-slate-200 bg-slate-50 px-4 py-4">
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Output feel</p>
                                <p className="mt-2 text-sm font-bold text-slate-800">Podcast-ready script with audio generation built in</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
