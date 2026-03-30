import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, PlusCircle, AudioLines, Settings, LogOut,
    Mic, Sparkles, Link2, FileText, Zap, ChevronRight,
    Bell, BarChart3, ArrowRight, CheckCircle2, Loader2, Sun, Moon, Menu, X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

/* ─── Sidebar link (shared style) ───────────────── */
const SideLink = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 group
        ${active
                ? 'bg-[#0D9488] text-white shadow-lg shadow-teal-200/50'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
            }`}
    >
        <Icon size={18} className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} />
        {label}
    </button>
);

/* ─── Animated AI Avatar ─────────────────────────── */
const AIAvatar = ({ status }) => (
    <div className="flex flex-col items-center gap-4">
        <div className="relative">
            {/* glow */}
            <div className="absolute inset-0 bg-teal-200/40 blur-3xl rounded-full scale-150 pointer-events-none" />

            {/* avatar body */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-36 h-44 flex flex-col items-center"
            >
                {/* head */}
                <div className="relative w-24 h-24 bg-gradient-to-br from-[#0D9488] to-teal-300 rounded-[40%] flex items-center justify-center shadow-xl shadow-teal-200">
                    {/* eyes */}
                    <div className="flex gap-3 mt-2">
                        <motion.div
                            animate={{ scaleY: [1, 0.1, 1] }}
                            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                            className="w-3 h-3 bg-white rounded-full"
                        />
                        <motion.div
                            animate={{ scaleY: [1, 0.1, 1] }}
                            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, delay: 0.05 }}
                            className="w-3 h-3 bg-white rounded-full"
                        />
                    </div>
                    {/* smile */}
                    <div className="absolute bottom-5 w-8 h-3 border-b-2 border-white/60 rounded-full" />
                </div>

                {/* neck + body */}
                <div className="w-3 h-4 bg-teal-400/60 rounded-full" />
                <div className="w-16 h-14 bg-gradient-to-b from-[#0D9488]/80 to-teal-400/50 rounded-[30%] flex items-center justify-center">
                    <Mic size={20} className="text-white/80" />
                </div>

                {/* orbit ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 border-2 border-teal-300/30 border-dashed rounded-full pointer-events-none"
                    style={{ borderRadius: '50%', top: '10%', left: '5%', right: '5%', bottom: '5%' }}
                />
            </motion.div>
        </div>

        {/* status label */}
        <div className="text-center">
            <p className="text-sm font-black text-slate-700 dark:text-slate-100">AI Podcast Host</p>
            <div className="flex items-center justify-center gap-1.5 mt-1">
                {status === 'generating' ? (
                    <Loader2 size={11} className="text-[#0D9488] animate-spin" />
                ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
                <p className="text-xs text-slate-400 font-medium">
                    {status === 'generating' ? 'Generating script...' : 'Ready to generate'}
                </p>
            </div>
        </div>

        {/* waveform bars (only animate when generating) */}
        <div className="flex items-end gap-1 h-8">
            {[0.5, 0.8, 0.6, 1, 0.7, 0.9, 0.5, 0.8, 0.6].map((h, i) => (
                <motion.div
                    key={i}
                    animate={status === 'generating'
                        ? { height: [`${h * 30}%`, `${h * 100}%`, `${h * 30}%`] }
                        : { height: '20%' }
                    }
                    transition={{ duration: 1.2 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-[#0D9488] to-teal-300 opacity-70"
                />
            ))}
        </div>
    </div>
);

/* ─── Main Page ──────────────────────────────────── */
const CreateEpisode = () => {
    const navigate = useNavigate();
    const [activeNav, setActiveNav] = useState('create');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [inputMode, setInputMode] = useState('url'); // 'url' | 'text'
    const [title, setTitle] = useState('');
    const [blogUrl, setBlogUrl] = useState('');
    const [pasteText, setPasteText] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle' | 'generating' | 'done' | 'error'
    const [generatedScript, setGeneratedScript] = useState('');
    const [apiError, setApiError] = useState('');
    const [selectedTone, setSelectedTone] = useState('Conversational');
    const [isDark, setIsDark] = useState(() => {
        return document.documentElement.classList.contains('dark');
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('vc_theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('vc_theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    const getUserSafely = () => {
        try {
            const stored = localStorage.getItem('vc_user');
            if (stored && stored !== 'undefined' && stored !== 'null') {
                return JSON.parse(stored);
            }
        } catch (err) {
            console.error('Failed to parse user data:', err);
        }
        return { name: 'Guest', email: '' };
    };

    const user = getUserSafely();
    const userName = user.name || 'Guest';
    const initials = userName
        .split(' ')
        .map((w) => w ? w[0] : '')
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const canGenerate = inputMode === 'url' ? blogUrl.trim() !== '' : pasteText.trim() !== '';

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!canGenerate) return;
        setStatus('generating');
        setApiError('');
        setGeneratedScript('');

        const payload = {
            title: title.trim() || undefined,
            voice_tone: selectedTone,
        };
        if (inputMode === 'url') {
            payload.url = blogUrl.trim();
        } else {
            payload.text = pasteText.trim();
        }

        try {
            const res = await fetch('/api/podcast/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (!res.ok) {
                setApiError(data.detail || 'Generation failed. Please try again.');
                setStatus('error');
                return;
            }

            setGeneratedScript(data.script);
            setStatus('done');
        } catch (err) {
            setApiError('Network error. Is the backend running on port 8000?');
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFB] dark:bg-slate-950 flex font-sans transition-colors duration-300">

            {/* ─── MOBILE SIDEBAR (DRAWER) ─── */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[40] lg:hidden"
                        />
                        
                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 z-[50] lg:hidden flex flex-col px-4 py-6 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8 px-2">
                                <Link to="/" className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 bg-[#0D9488] rounded-lg flex items-center justify-center">
                                        <Mic size={14} className="text-white" />
                                    </div>
                                    <span className="text-base font-black tracking-tight text-slate-800 dark:text-slate-100">
                                        VOICE<span className="text-[#0D9488]">CAST</span>
                                    </span>
                                </Link>
                                <button 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-1 flex-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 mb-2">Menu</p>
                                <SideLink icon={LayoutDashboard} label="Dashboard" active={activeNav === 'dashboard'} onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }} />
                                <SideLink icon={PlusCircle} label="Create Episode" active={activeNav === 'create'} onClick={() => { setActiveNav('create'); setIsMobileMenuOpen(false); }} />
                                <SideLink icon={AudioLines} label="My Episodes" active={activeNav === 'episodes'} onClick={() => { navigate('/episodes'); setIsMobileMenuOpen(false); }} />
                                <SideLink icon={BarChart3} label="Analytics" active={activeNav === 'analytics'} onClick={() => { navigate('/analytics'); setIsMobileMenuOpen(false); }} />

                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                                    <SideLink icon={Settings} label="Settings" active={false} onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }} />
                                    <SideLink icon={LogOut} label="Logout" active={false} onClick={() => { localStorage.removeItem('vc_user'); navigate('/'); }} />
                                </div>
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ─── SIDEBAR ─── */}
            <aside className="w-64 shrink-0 hidden lg:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 min-h-screen fixed left-0 top-0 bottom-0 z-30 px-4 py-6">
                <Link to="/" className="flex items-center gap-2.5 px-2 mb-8 group">
                    <div className="w-9 h-9 bg-[#0D9488] rounded-xl flex items-center justify-center shadow-md shadow-teal-200">
                        <Mic size={16} className="text-white" />
                    </div>
                    <div>
                        <span className="text-base font-black tracking-tight text-slate-800 dark:text-slate-100">
                            VOICE<span className="text-[#0D9488]">CAST</span>
                        </span>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest -mt-0.5">Narrator AI</p>
                    </div>
                </Link>

                <nav className="flex flex-col gap-1 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 mb-2">Menu</p>
                    <SideLink icon={LayoutDashboard} label="Dashboard" active={activeNav === 'dashboard'} onClick={() => navigate('/dashboard')} />
                    <SideLink icon={PlusCircle} label="Create Episode" active={activeNav === 'create'} onClick={() => setActiveNav('create')} />
                    <SideLink icon={AudioLines} label="My Episodes" active={activeNav === 'episodes'} onClick={() => navigate('/episodes')} />
                    <SideLink icon={BarChart3} label="Analytics" active={activeNav === 'analytics'} onClick={() => navigate('/analytics')} />

                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                        <SideLink icon={Settings} label="Settings" active={false} onClick={() => navigate('/settings')} />
                        <SideLink icon={LogOut} label="Logout" active={false} onClick={() => { localStorage.removeItem('vc_user'); navigate('/'); }} />
                    </div>
                </nav>

                <div 
                    onClick={() => navigate('/settings')}
                    className="mt-6 flex items-center gap-3 px-3 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0D9488] to-teal-300 flex items-center justify-center text-white text-xs font-black shrink-0">
                        {initials}
                    </div>
                    <div className="overflow-hidden flex-1">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{userName.split(' ')[0]}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
                </div>
            </aside>

            {/* ─── MAIN CONTENT ─── */}
            <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">

                {/* Top bar */}
                <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-6 md:px-10 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        >
                            <Menu size={20} />
                        </button>
                        <div>
                            <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">Create Episode</h1>
                            <p className="text-xs text-slate-400 font-medium">Transform a blog into a podcast script</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                        <button className="relative w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <Bell size={16} />
                        </button>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0D9488] to-teal-300 flex items-center justify-center text-white text-xs font-black cursor-pointer">
                            {initials}
                        </div>
                    </div>
                </header>

                {/* Body */}
                <div className="flex-1 px-6 md:px-10 py-10 max-w-6xl w-full">
                    <div className="flex flex-col xl:flex-row gap-10 items-start">

                        {/* ── Form ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex-1 w-full"
                        >
                            <form onSubmit={handleGenerate} className="space-y-6">

                                {/* Step 1 — Title */}
                                <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4">
                                    <div className="flex items-center gap-2.5 mb-1">
                                        <div className="w-6 h-6 rounded-lg bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 flex items-center justify-center text-[10px] font-black text-[#0D9488]">1</div>
                                        <p className="text-sm font-black text-slate-700 dark:text-slate-200">Episode Title <span className="text-slate-400 dark:text-slate-500 font-medium">(optional)</span></p>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="e.g. The Future of AI in Healthcare"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-[#0D9488]/50 focus:ring-4 focus:ring-teal-500/10 transition-all"
                                    />
                                </div>

                                {/* Step 2 — Source */}
                                <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4">
                                    <div className="flex items-center gap-2.5 mb-1">
                                        <div className="w-6 h-6 rounded-lg bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 flex items-center justify-center text-[10px] font-black text-[#0D9488]">2</div>
                                        <p className="text-sm font-black text-slate-700 dark:text-slate-200">Blog Content Source</p>
                                    </div>

                                    {/* Mode tabs */}
                                    <div className="inline-flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setInputMode('url')}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${inputMode === 'url'
                                                ? 'bg-[#0D9488] text-white shadow-md'
                                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                                }`}
                                        >
                                            <Link2 size={14} /> Blog URL
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setInputMode('text')}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${inputMode === 'text'
                                                ? 'bg-[#0D9488] text-white shadow-md'
                                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                                }`}
                                        >
                                            <FileText size={14} /> Write
                                        </button>
                                    </div>

                                    {/* Input area */}
                                    <AnimatePresence mode="wait">
                                        {inputMode === 'url' ? (
                                            <motion.div
                                                key="url"
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -6 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                        <Link2 size={16} />
                                                    </div>
                                                    <input
                                                        type="url"
                                                        placeholder="https://example.com/blog-post"
                                                        value={blogUrl}
                                                        onChange={(e) => setBlogUrl(e.target.value)}
                                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-[#0D9488]/50 focus:ring-4 focus:ring-teal-500/10 transition-all"
                                                    />
                                                </div>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-2 ml-1">Paste a public blog URL and we'll fetch the content automatically.</p>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="text"
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -6 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <textarea
                                                    rows={6}
                                                    placeholder="Write or paste your content here..."
                                                    value={pasteText}
                                                    onChange={(e) => setPasteText(e.target.value)}
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-[#0D9488]/50 focus:ring-4 focus:ring-teal-500/10 transition-all resize-none"
                                                />
                                                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-2 ml-1">{pasteText.length} characters · Recommended: 500–5000 characters</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Step 3 — Voice & Tone */}
                                <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                                    <div className="flex items-center gap-2.5 mb-4">
                                        <div className="w-6 h-6 rounded-lg bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 flex items-center justify-center text-[10px] font-black text-[#0D9488]">3</div>
                                        <p className="text-sm font-black text-slate-700 dark:text-slate-200">Voice Tone</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: 'Conversational', emoji: '💬', desc: 'Warm & engaging' },
                                            { label: 'Professional', emoji: '🎙️', desc: 'Formal & clear' },
                                            { label: 'Energetic', emoji: '⚡', desc: 'Lively & upbeat' },
                                        ].map(({ label, emoji, desc }) => (
                                            <VoiceToneCard key={label} label={label} emoji={emoji} desc={desc} isDark={isDark} selected={selectedTone === label} onSelect={setSelectedTone} />
                                        ))}
                                    </div>
                                </div>

                                {/* Generate button */}
                                <motion.button
                                    type="submit"
                                    disabled={!canGenerate || status === 'generating'}
                                    whileHover={canGenerate ? { scale: 1.02 } : {}}
                                    whileTap={canGenerate ? { scale: 0.98 } : {}}
                                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-base transition-all shadow-lg ${canGenerate && status !== 'generating'
                                        ? 'bg-[#0D9488] text-white shadow-teal-200/50 dark:shadow-teal-900/40 hover:shadow-teal-300 dark:hover:shadow-teal-800/60'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                                        }`}
                                >
                                    {status === 'generating' ? (
                                        <><Loader2 size={18} className="animate-spin" /> Generating Script...</>
                                    ) : status === 'done' ? (
                                        <><CheckCircle2 size={18} /> Script Ready!</>
                                    ) : (
                                        <><Sparkles size={18} /> Generate Podcast Script</>
                                    )}
                                </motion.button>

                                {/* Error state */}
                                <AnimatePresence>
                                    {status === 'error' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4"
                                        >
                                            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                                                <Zap size={18} className="text-red-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-red-800">Generation failed</p>
                                                <p className="text-xs text-red-600 font-medium mt-0.5">{apiError}</p>
                                                <button
                                                    type="button"
                                                    onClick={() => setStatus('idle')}
                                                    className="mt-3 text-xs font-black text-red-700 hover:text-red-900 transition-colors"
                                                >
                                                    Try Again
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Success state */}
                                <AnimatePresence>
                                    {status === 'done' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-3"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                                                    <CheckCircle2 size={18} className="text-emerald-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-emerald-800">Script generated successfully!</p>
                                                    <p className="text-xs text-emerald-600 font-medium mt-0.5">Your episode has been saved to MongoDB. Check My Episodes.</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate('/episodes')}
                                                        className="mt-3 flex items-center gap-1.5 text-xs font-black text-emerald-700 hover:text-emerald-900 transition-colors"
                                                    >
                                                        View in My Episodes <ArrowRight size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Script preview */}
                                            {generatedScript && (
                                                <div className="bg-white/60 rounded-xl p-4 border border-emerald-100">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-2">Script Preview</p>
                                                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-6 whitespace-pre-wrap">
                                                        {generatedScript.slice(0, 600)}{generatedScript.length > 600 ? '...' : ''}
                                                    </p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </motion.div>

                        {/* ── AI Avatar Panel ── */}
                        <motion.div
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="xl:w-72 w-full"
                        >
                            <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm p-8 flex flex-col items-center gap-6 sticky top-24">
                                <AIAvatar status={status} />

                                {/* Tips */}
                                <div className="w-full space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Tips</p>
                                    {[
                                        'Use a publicly accessible blog URL.',
                                        'Longer content = richer podcast script.',
                                        '"Conversational" tone works best for most blogs.',
                                    ].map((tip, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <ChevronRight size={12} className="text-[#0D9488] mt-0.5 shrink-0" />
                                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

/* ─── Voice Tone Card ────────────────────────────── */
const VoiceToneCard = ({ label, emoji, desc, isDark, selected, onSelect }) => {
    return (
        <button
            type="button"
            onClick={() => onSelect(label)}
            className={`flex flex-col items-center gap-1.5 p-3.5 rounded-2xl border text-center transition-all ${selected
                ? 'bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/30 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-teal-200 hover:bg-teal-50/40 dark:hover:bg-teal-500/5'
                }`}
        >
            <span className="text-xl">{emoji}</span>
            <p className={`text-xs font-black ${selected ? 'text-[#0D9488]' : 'text-slate-700 dark:text-slate-200'}`}>{label}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{desc}</p>
        </button>
    );
};

export default CreateEpisode;
