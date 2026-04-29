import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, PlusCircle, AudioLines, Settings, LogOut,
    Mic, Sparkles, TrendingUp, Users, Target, Play, Clock, ChevronRight,
    Bell, BarChart3, Headphones, MoreHorizontal, ArrowUpRight,
    CheckCircle2, Zap, FileText, Loader2, Sun, Moon, Menu, X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authFetch } from '../utils/authFetch';

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

/* ─── Status Badge ───────────────────────────────── */
const StatusBadge = ({ status }) => {
    const map = {
        ready: { label: 'Ready', bg: 'bg-emerald-50 dark:bg-emerald-400/10', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
        draft: { label: 'Draft', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', dot: 'bg-slate-400' },
        generating: { label: 'Generating', bg: 'bg-amber-50 dark:bg-amber-400/10', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
    };
    const s = map[status] || map.draft;
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${s.bg} ${s.text} border-current/10`}>
            <span className={`w-1 h-1 rounded-full ${s.dot}`} />
            {s.label}
        </span>
    );
};

/* ─── Stats config ───────────────────────────────── */

/* ─── Color map ──────────────────────────────────── */
const COLORS = {
    teal: 'from-emerald-400 to-teal-500',
    violet: 'from-violet-400 to-indigo-500',
    amber: 'from-amber-400 to-orange-500',
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeNav, setActiveNav] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

    // Read user from localStorage (saved on login / signup)
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

    const [episodes, setEpisodes] = useState([]);
    const [episodesLoading, setEpisodesLoading] = useState(true);

    useEffect(() => {
        const fetchEpisodes = async () => {
            setEpisodesLoading(true);
            try {
                const res = await authFetch('/api/episodes/');
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                const data = await res.json();
                setEpisodes(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Failed to load episodes:', err);
                setEpisodes([]);
            } finally {
                setEpisodesLoading(false);
            }
        };
        fetchEpisodes();
    }, []);

    const handlePlayEpisode = (id) => {
        const ep = episodes.find(e => e.id === id);
        if (ep && (ep.status === 'ready' || ep.id === id)) {
            navigate(`/episode/${id}`);
        } else {
            alert("This episode is still generating. We'll notify you when it's ready!");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFB] dark:bg-slate-950 flex font-sans transition-colors duration-300 overflow-x-hidden">

            {/* ─── MOBILE SIDEBAR (DRAWER) ─── */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <React.Fragment key="mobile-sidebar">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[40] lg:hidden"
                        />
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
                                <SideLink icon={LayoutDashboard} label="Dashboard" active={activeNav === 'dashboard'} onClick={() => { setActiveNav('dashboard'); setIsMobileMenuOpen(false); }} />
                                <SideLink icon={PlusCircle} label="Create Episode" active={activeNav === 'create'} onClick={() => { navigate('/create-episode'); setIsMobileMenuOpen(false); }} />
                                <SideLink icon={AudioLines} label="My Episodes" active={activeNav === 'episodes'} onClick={() => { navigate('/episodes'); setIsMobileMenuOpen(false); }} />
                                <SideLink icon={BarChart3} label="Analytics" active={activeNav === 'analytics'} onClick={() => { navigate('/analytics'); setIsMobileMenuOpen(false); }} />

                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                                    <SideLink icon={Settings} label="Settings" active={false} onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }} />
                                    <SideLink icon={LogOut} label="Logout" active={false} onClick={() => { localStorage.removeItem('vc_user'); localStorage.removeItem('vc_token'); navigate('/'); }} />
                                </div>
                            </nav>
                        </motion.aside>
                    </React.Fragment>
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
                    <SideLink icon={LayoutDashboard} label="Dashboard" active={activeNav === 'dashboard'} onClick={() => setActiveNav('dashboard')} />
                    <SideLink icon={PlusCircle} label="Create Episode" active={activeNav === 'create'} onClick={() => navigate('/create-episode')} />
                    <SideLink icon={AudioLines} label="My Episodes" active={activeNav === 'episodes'} onClick={() => navigate('/episodes')} />
                    <SideLink icon={BarChart3} label="Analytics" active={activeNav === 'analytics'} onClick={() => navigate('/analytics')} />

                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                        <SideLink icon={Settings} label="Settings" active={false} onClick={() => navigate('/settings')} />
                        <SideLink icon={LogOut} label="Logout" active={false} onClick={() => { localStorage.removeItem('vc_user'); localStorage.removeItem('vc_token'); navigate('/'); }} />
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
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{(user.name || 'Guest').split(' ')[0]}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email || ''}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
                </div>
            </aside>

            {/* ─── MAIN CONTENT ─── */}
            <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">

                {/* Top bar */}
                <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-6 md:px-10 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500"
                        >
                            <Menu size={20} />
                        </button>
                        <div>
                            <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">Welcome back, {userName.split(' ')[0]}!</h1>
                            <p className="text-xs text-slate-400 font-medium">Here's your podcasting overview for today.</p>
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

                <div className="flex-1 px-6 md:px-10 py-8 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 overflow-hidden rounded-[32px] border border-slate-200/60 bg-gradient-to-br from-[#0f172a] via-[#132338] to-[#0D9488] p-6 text-white shadow-[0_35px_90px_-50px_rgba(15,23,42,0.85)]"
                    >
                        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-teal-100">
                                    <Sparkles size={12} />
                                    Studio overview
                                </div>
                                <h2 className="mt-4 text-2xl md:text-3xl font-black tracking-tight">
                                    Your podcast workspace is ready for the next move.
                                </h2>
                                <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-slate-200">
                                    Track what is live, what is still rendering, and where to jump next without digging through separate screens.
                                </p>
                                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                    <button
                                        onClick={() => navigate('/create-episode')}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-900"
                                    >
                                        <PlusCircle size={15} />
                                        Create Episode
                                    </button>
                                    <button
                                        onClick={() => navigate('/episodes')}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur"
                                    >
                                        Open Library
                                        <ArrowUpRight size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {[
                                    { label: 'Ready now', value: (episodes || []).filter((ep) => ep.status === 'ready').length, sub: 'episodes available to play' },
                                    { label: 'In progress', value: (episodes || []).filter((ep) => ep.status === 'generating').length, sub: 'rendering in the background' },
                                    { label: 'Total listens', value: (episodes || []).reduce((acc, ep) => acc + (ep.views || 0), 0), sub: 'audience engagement tracked' },
                                    { label: 'Library size', value: (episodes || []).length, sub: 'episodes in your workspace' },
                                ].map((item) => (
                                    <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/10 p-4 backdrop-blur">
                                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-100/80">{item.label}</p>
                                        <p className="mt-2 text-3xl font-black text-white">{item.value}</p>
                                        <p className="mt-2 text-xs font-medium text-slate-200">{item.sub}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Stats Row ── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {[
                            { label: 'Total Episodes', value: (episodes || []).length, icon: AudioLines, trend: '+2 this week', color: 'teal' },
                            { label: 'Total Listens', value: (episodes || []).reduce((acc, ep) => acc + (ep.views || 0), 0), icon: Headphones, trend: '+12.5%', color: 'violet' },
                            { label: 'AI Generative time', value: '42m', icon: Zap, trend: '-3m faster', color: 'amber' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-slate-900 rounded-[28px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group"
                            >
                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                                        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{stat.value}</h3>
                                        <div className="flex items-center gap-1 mt-2">
                                            <span className="text-[10px] font-bold text-emerald-500">{stat.trend}</span>
                                        </div>
                                    </div>
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${COLORS[stat.color]} flex items-center justify-center text-white shadow-lg`}>
                                        <stat.icon size={20} />
                                    </div>
                                </div>
                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 dark:bg-slate-800/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            </motion.div>
                        ))}
                    </div>

                    {/* ── Episodes Table + Quick Actions ── */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                        {/* Recent Episodes */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
                        >
                            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="text-base font-black text-slate-800 dark:text-slate-100">Recent Episodes</h3>
                                <button 
                                    onClick={() => navigate('/episodes')}
                                    className="text-xs font-bold text-[#0D9488] hover:underline flex items-center gap-1"
                                >
                                    View all <ChevronRight size={12} />
                                </button>
                            </div>

                            <div>
                                {(episodes || []).length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                                        <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 flex items-center justify-center mb-4">
                                            <AudioLines size={24} className="text-[#0D9488]" />
                                        </div>
                                        <p className="text-sm font-black text-slate-700 dark:text-slate-200 mb-1">No episodes yet</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium max-w-[220px]">Create your first episode to see it appear here.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                        {(episodes || []).slice(0, 5).map((ep, i) => (
                                            <motion.div
                                                key={ep.id}
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 + i * 0.08 }}
                                                onClick={() => handlePlayEpisode(ep.id)}
                                                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 flex items-center justify-center shrink-0 group-hover:bg-[#0D9488] transition-colors">
                                                    <Play size={14} className="text-[#0D9488] group-hover:text-white transition-colors" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{ep.title || 'Untitled'}</p>
                                                    <div className="flex items-center gap-3 mt-0.5">
                                                        <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1"><Clock size={10} /> {ep.duration || '--'}</span>
                                                        <span className="text-xs text-slate-400 dark:text-slate-500">{ep.date || ''}</span>
                                                    </div>
                                                    <div className="mt-3 flex items-end gap-1 h-8">
                                                        {[0.35, 0.6, 0.45, 0.78, 0.55, 0.82, 0.48, 0.66].map((bar, index) => (
                                                            <motion.div
                                                                key={index}
                                                                animate={ep.status === 'generating'
                                                                    ? { height: [`${bar * 40}%`, `${bar * 100}%`, `${bar * 40}%`] }
                                                                    : { height: `${bar * 100}%` }
                                                                }
                                                                transition={{ duration: 1.2 + index * 0.07, repeat: ep.status === 'generating' ? Infinity : 0, ease: 'easeInOut' }}
                                                                className={`flex-1 rounded-full ${ep.status === 'ready' ? 'bg-gradient-to-t from-[#0D9488] to-teal-300' : 'bg-gradient-to-t from-amber-500 to-amber-300'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <StatusBadge status={ep.status} />
                                                    {(ep.views || 0) > 0 && (
                                                        <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium"><Headphones size={11} /> {ep.views}</span>
                                                    )}
                                                    <button className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                                        <MoreHorizontal size={14} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Create CTA footer */}
                            <div className="px-6 py-4 border-t border-slate-50 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/20">
                                <button
                                    onClick={() => navigate('/create-episode')}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 text-sm font-bold hover:border-[#0D9488] dark:hover:border-teal-500 hover:text-[#0D9488] dark:hover:text-teal-500 transition-all"
                                >
                                    <PlusCircle size={15} />
                                    New Episode
                                </button>
                            </div>
                        </motion.div>

                        {/* Quick Actions panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            className="flex flex-col gap-4"
                        >
                            <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-4">Quick Actions</h3>
                                <div className="flex flex-col gap-2.5">
                                    {[
                                        { icon: PlusCircle, label: 'Create Episode', desc: 'From URL or text', accent: true, path: '/create-episode', color: 'teal' },
                                        { icon: AudioLines, label: 'My Episodes', desc: 'Manage library', path: '/episodes', color: 'slate' },
                                        { icon: BarChart3, label: 'Analytics', desc: 'Views & listens', path: '/analytics', color: 'slate' },
                                    ].map((action) => (
                                        <motion.button
                                            key={action.label}
                                            whileHover={{ x: 4 }}
                                            onClick={() => navigate(action.path)}
                                            className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all group ${action.accent
                                                ? 'bg-teal-50 dark:bg-teal-500/10 border-teal-100 dark:border-teal-500/20 hover:bg-[#0D9488] hover:border-[#0D9488]'
                                                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${action.accent ? 'bg-[#0D9488]/10 group-hover:bg-white/20' : 'bg-white dark:bg-slate-800'}`}>
                                                <action.icon size={15} className={action.accent ? 'text-[#0D9488] group-hover:text-white' : 'text-slate-400 dark:text-slate-500'} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs font-black ${action.accent ? 'text-[#0D9488] group-hover:text-white' : 'text-slate-800 dark:text-slate-100'}`}>{action.label}</p>
                                                <p className={`text-[10px] font-medium ${action.accent ? 'text-[#0D9488]/60 group-hover:text-white/70' : 'text-slate-400'}`}>{action.desc}</p>
                                            </div>
                                            <ArrowUpRight size={14} className={action.accent ? 'text-[#0D9488]/40 group-hover:text-white' : 'text-slate-300 group-hover:text-slate-500'} />
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm p-6 relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-1">PRO Plan</h3>
                                    <p className="text-xs text-slate-400 font-medium mb-4">Unlimited AI voices & clones</p>
                                    <button className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
                                        Upgrade Now
                                    </button>
                                </div>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
