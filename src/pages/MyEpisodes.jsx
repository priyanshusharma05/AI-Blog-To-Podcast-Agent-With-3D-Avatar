import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, PlusCircle, AudioLines, Settings, LogOut,
    Mic, Search, Filter, Play, Clock, ChevronRight,
    Bell, BarChart3, Headphones, MoreHorizontal, ArrowUpRight,
    CheckCircle2, Zap, FileText, Loader2, Sun, Moon
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

/* ─── Status Badge (refactored for grid cards) ─── */
const StatusBadge = ({ status }) => {
    const map = {
        ready: { label: 'Ready', bg: 'bg-emerald-500/10', text: 'text-emerald-500', dot: 'bg-emerald-500' },
        draft: { label: 'Draft', bg: 'bg-slate-500/10', text: 'text-slate-400', dot: 'bg-slate-400' },
        generating: { label: 'Generating', bg: 'bg-teal-500/10', text: 'text-teal-400', dot: 'bg-teal-500' },
    };
    const s = map[status] || map.draft;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${s.bg} ${s.text}`}>
            <span className={`w-1 h-1 rounded-full ${s.dot} ${status === 'generating' ? 'animate-pulse' : ''}`} />
            {s.label}
        </span>
    );
};

const DUMMY_EPISODES = [
    {
        id: 1,
        title: 'The Future of AI in Creative Industries',
        desc: 'Exploring how AI is transforming creative industries from art and design to music and writing.',
        status: 'ready',
        date: 'Mar 11, 2026',
        duration: '4 min',
        views: 0,
        tags: ['AI', 'Creativity', 'Technology']
    },
    {
        id: 2,
        title: 'Remote Work Revolution: What We Learned',
        desc: 'A deep dive into the lessons learned from the global shift to remote work and what comes next.',
        status: 'ready',
        date: 'Mar 11, 2026',
        duration: '3 min',
        views: 0,
        tags: ['Remote Work', 'Productivity', 'Future of Work']
    },
    {
        id: 3,
        title: 'Understanding Blockchain Beyond Crypto',
        desc: 'Exploring the vast potential of blockchain technology beyond cryptocurrency applications.',
        status: 'draft',
        date: 'Mar 11, 2026',
        duration: '4 min',
        views: 0,
        tags: ['Blockchain', 'Technology', 'Innovation']
    },
    {
        id: 4,
        title: 'Sustainable Living: Simple Daily Habits',
        desc: 'Small changes you can make today to live a more eco-friendly and sustainable lifestyle.',
        status: 'generating',
        date: 'Mar 12, 2026',
        duration: '--',
        views: 0,
        tags: ['Sustainability', 'Lifestyle']
    },
    {
        id: 5,
        title: 'The Rise of Personal Branding',
        desc: 'Why personal branding is more important than ever in the digital age.',
        status: 'ready',
        date: 'Mar 10, 2026',
        duration: '5 min',
        views: 0,
        tags: ['Marketing', 'Career']
    },
    {
        id: 6,
        title: 'Mental Health in the Tech Industry',
        desc: 'Addressing the unique challenges and importance of mental wellness in fast-paced tech roles.',
        status: 'ready',
        date: 'Mar 09, 2026',
        duration: '4 min',
        views: 0,
        tags: ['Mental Health', 'Wellness']
    },
    {
        id: 7,
        title: 'AI Ethics: Navigating the New Frontier',
        desc: 'Discussing the responsibility of AI developers and common ethical dilemmas in the field.',
        status: 'draft',
        date: 'Mar 12, 2026',
        duration: '6 min',
        views: 0,
        tags: ['AI Ethics', 'Future']
    },
    {
        id: 8,
        title: 'The Evolution of E-commerce',
        desc: 'How digital shopping experiences have changed over the last decade.',
        status: 'ready',
        date: 'Mar 08, 2026',
        duration: '7 min',
        views: 0,
        tags: ['Ecommerce', 'Tech']
    }
];

const MyEpisodes = () => {
    const navigate = useNavigate();
    const [activeNav, setActiveNav] = useState('episodes');
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
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

    const stored = localStorage.getItem('vc_user');
    const user = stored ? JSON.parse(stored) : { name: 'Guest', email: '' };
    const initials = user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

    const filteredEpisodes = DUMMY_EPISODES.filter(ep => {
        const matchesFilter = filter === 'All' || ep.status.toLowerCase() === filter.toLowerCase();
        const matchesSearch = ep.title.toLowerCase().includes(search.toLowerCase()) ||
            ep.desc.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#F8FAFB] dark:bg-slate-950 flex font-sans transition-colors duration-300">

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
                    <SideLink icon={PlusCircle} label="Create Episode" active={activeNav === 'create'} onClick={() => navigate('/create-episode')} />
                    <SideLink icon={AudioLines} label="My Episodes" active={activeNav === 'episodes'} onClick={() => setActiveNav('episodes')} />
                    <SideLink icon={BarChart3} label="Analytics" active={activeNav === 'analytics'} onClick={() => navigate('/analytics')} />

                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                        <SideLink icon={Settings} label="Settings" active={false} onClick={() => navigate('/settings')} />
                        <SideLink icon={LogOut} label="Logout" active={false} onClick={() => { localStorage.removeItem('vc_user'); navigate('/'); }} />
                    </div>
                </nav>

                <div className="mt-6 flex items-center gap-3 px-3 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0D9488] to-teal-300 flex items-center justify-center text-white text-xs font-black shrink-0">
                        {initials}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user.name.split(' ')[0]}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                </div>
            </aside>

            {/* ─── MAIN CONTENT ─── */}
            <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">

                {/* Top bar */}
                <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-6 md:px-10 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">Episodes</h1>
                        <p className="text-xs text-slate-400 font-medium">Browse and manage all your podcast episodes</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/create-episode')}
                            className="hidden sm:flex items-center gap-2 bg-[#0D9488] text-white px-4 py-2 rounded-xl font-black text-xs shadow-md shadow-teal-200/50 hover:bg-teal-700 transition-colors"
                        >
                            <PlusCircle size={14} /> New Episode
                        </button>
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

                {/* Filters & Search */}
                <div className="px-6 md:px-10 pt-8 pb-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        {/* Search */}
                        <div className="relative w-full md:w-96">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Search size={16} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search episodes..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0D9488]/50 focus:ring-4 focus:ring-teal-500/5 transition-all shadow-sm"
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl gap-1">
                            {['All', 'Draft', 'Generating', 'Ready'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${filter === tab
                                        ? 'bg-[#0D9488] text-white shadow-md'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Episodes Grid */}
                <div className="flex-1 px-6 md:px-10 py-6 max-w-[1400px]">
                    <AnimatePresence mode="popLayout">
                        {filteredEpisodes.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col items-center justify-center py-24 text-center"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 flex items-center justify-center mb-6">
                                    <AudioLines size={40} className="text-[#0D9488]" />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">No episodes found</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[300px] mb-8">
                                    {search
                                        ? `We couldn't find any episodes matching "${search}"`
                                        : "You haven't created any episodes yet. Start your first one today!"}
                                </p>
                                <button
                                    onClick={() => navigate('/create-episode')}
                                    className="flex items-center gap-2 bg-[#0D9488] text-white px-6 py-3 rounded-2xl font-black text-sm shadow-lg shadow-teal-200/50 hover:bg-teal-700"
                                >
                                    <PlusCircle size={18} /> Create Episode
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                            >
                                {filteredEpisodes.map((ep) => (
                                    <motion.div
                                        key={ep.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="group relative bg-teal-50/30 dark:bg-slate-900 rounded-[24px] overflow-hidden flex flex-col border border-teal-100/50 dark:border-slate-800 hover:border-teal-500/30 transition-all shadow-xl"
                                    >
                                        {/* Visual/Image Area */}
                                        <div className="relative h-48 bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-[#1A1D29] dark:to-[#0A0B12] flex items-center justify-center overflow-hidden">
                                            {/* decorative glowing circle */}
                                            <div className="absolute inset-0 bg-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="relative z-10 w-16 h-16 rounded-3xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center backdrop-blur-md">
                                                <Mic size={24} className="text-[#0D9488] dark:text-teal-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                                            </div>

                                            {/* Audio Visualization Lines (decorative) */}
                                            <div className="absolute bottom-6 flex items-end gap-1 px-4 w-full justify-center">
                                                {[3, 6, 4, 8, 5, 7, 3, 5, 4, 6].map((h, i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{ height: [`${h * 2}px`, `${h * 4}px`, `${h * 2}px`] }}
                                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                                                        className="w-1 bg-teal-500/40 rounded-full"
                                                    />
                                                ))}
                                            </div>

                                            <div className="absolute top-4 right-4">
                                                <StatusBadge status={ep.status} />
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="text-lg font-black text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-tight mb-2 truncate">
                                                {ep.title}
                                            </h3>
                                            <p className="text-slate-400 text-sm font-medium line-clamp-2 mb-6">
                                                {ep.desc}
                                            </p>

                                            <div className="mt-auto space-y-4">
                                                {/* Meta */}
                                                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-tighter text-slate-500">
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex items-center gap-1"><Clock size={12} /> {ep.duration}</span>
                                                        <span>{ep.date}</span>
                                                    </div>
                                                    {ep.views > 0 && (
                                                        <span className="flex items-center gap-1"><Headphones size={12} /> {ep.views}</span>
                                                    )}
                                                </div>

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-1.5">
                                                    {ep.tags.map(tag => (
                                                        <span
                                                            key={tag}
                                                            className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-400"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Overlay Button */}
                                        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity border-r-0">
                                            <button className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-teal-500 hover:border-teal-500 transition-all">
                                                <MoreHorizontal size={14} />
                                            </button>
                                        </div>

                                        <div className="absolute top-[170px] right-6 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                                            <button className="w-10 h-10 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/40">
                                                <Play size={18} fill="currentColor" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default MyEpisodes;
