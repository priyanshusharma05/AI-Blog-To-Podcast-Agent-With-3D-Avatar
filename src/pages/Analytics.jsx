import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, PlusCircle, AudioLines, Settings, LogOut,
    Mic, Search, Filter, Play, Clock, ChevronRight,
    Bell, BarChart3, Headphones, MoreHorizontal, ArrowUpRight,
    CheckCircle2, Zap, FileText, Loader2, Sun, Moon, Menu, X,
    TrendingUp, Users, Target, Zap as ZapIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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

/* ─── Stat Card Component ─────────────────────────── */
const StatCard = ({ label, value, trend, icon: Icon, color }) => {
    const colors = {
        teal: { bg: 'bg-teal-50 dark:bg-teal-500/10', text: 'text-[#0D9488]', border: 'border-teal-100 dark:border-teal-500/20', glow: 'rgba(13,148,136,0.1)' },
        violet: { bg: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-600', border: 'border-violet-100 dark:border-violet-500/20', glow: 'rgba(124,58,237,0.1)' },
        amber: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-100 dark:border-amber-500/20', glow: 'rgba(217,119,6,0.1)' },
    };
    const c = colors[color] || colors.teal;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative"
        >
            <div className={`h-full bg-white dark:bg-slate-900 rounded-[32px] border ${c.border} p-8 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/5 hover:-translate-y-1 overflow-hidden group`}>
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className={`w-14 h-14 rounded-2xl ${c.bg} flex items-center justify-center mb-6`}>
                        <Icon size={24} className={c.text} />
                    </div>
                    
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">{label || 'Metric'}</p>
                    
                    <div className="flex flex-col items-center">
                        <motion.h3 
                            className="text-6xl font-black text-slate-800 dark:text-slate-100 tracking-tighter"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                        >
                            {value || 0}
                        </motion.h3>
                        
                        {trend && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-4 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/10"
                            >
                                <TrendingUp size={14} />
                                {trend}
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Mouse interaction light */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),${c.glow},transparent_70%)]`} />
            </div>
        </motion.div>
    );
};

/* ─── Main Analytics Page ─────────────────────────── */
const Analytics = () => {
    const navigate = useNavigate();
    const [activeNav, setActiveNav] = useState('analytics');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        return document.documentElement.classList.contains('dark');
    });

    // Real data state
    const [stats, setStats] = useState({
        created: 0,
        watched: 0,
        recentGrowth: '+0% growth'
    });

    useEffect(() => {
        const loadStats = () => {
            try {
                const stored = localStorage.getItem('vc_episodes');
                if (stored && stored !== 'undefined' && stored !== 'null') {
                    const episodes = JSON.parse(stored);
                    if (Array.isArray(episodes)) {
                        const totalCreated = episodes.length;
                        const totalViews = episodes.reduce((sum, ep) => sum + (ep.views || 0), 0);
                        
                        setStats({
                            created: totalCreated,
                            watched: totalViews,
                            recentGrowth: totalCreated > 0 ? '+12.5% growth' : '+0% growth'
                        });
                        return;
                    }
                }
            } catch (err) {
                console.error('Failed to parse analytics data:', err);
            }
            setStats({ created: 0, watched: 0, recentGrowth: '+0% growth' });
        };
        loadStats();
    }, []);
    
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

    return (
        <div className="min-h-screen bg-[#F8FAFB] dark:bg-slate-950 flex font-sans transition-colors duration-300">

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
                                <SideLink icon={LayoutDashboard} label="Dashboard" active={activeNav === 'dashboard'} onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }} />
                                <SideLink icon={PlusCircle} label="Create Episode" active={activeNav === 'create'} onClick={() => { navigate('/create-episode'); setIsMobileMenuOpen(false); }} />
                                <SideLink icon={AudioLines} label="My Episodes" active={activeNav === 'episodes'} onClick={() => { navigate('/episodes'); setIsMobileMenuOpen(false); }} />
                                <SideLink icon={BarChart3} label="Analytics" active={activeNav === 'analytics'} onClick={() => { setActiveNav('analytics'); setIsMobileMenuOpen(false); }} />

                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                                    <SideLink icon={Settings} label="Settings" active={false} onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }} />
                                    <SideLink icon={LogOut} label="Logout" active={false} onClick={() => { localStorage.removeItem('vc_user'); navigate('/'); }} />
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
                    <SideLink icon={LayoutDashboard} label="Dashboard" active={activeNav === 'dashboard'} onClick={() => navigate('/dashboard')} />
                    <SideLink icon={PlusCircle} label="Create Episode" active={activeNav === 'create'} onClick={() => navigate('/create-episode')} />
                    <SideLink icon={AudioLines} label="My Episodes" active={activeNav === 'episodes'} onClick={() => navigate('/episodes')} />
                    <SideLink icon={BarChart3} label="Analytics" active={activeNav === 'analytics'} onClick={() => setActiveNav('analytics')} />

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
                            <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">Performance Analytics</h1>
                            <p className="text-xs text-slate-400 font-medium">Track your content growth and engagement</p>
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

                {/* Insights Banner */}
                <div className="px-6 md:px-10 pt-8">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-teal-500 dark:bg-teal-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-teal-500/20"
                    >
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="max-w-md">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Engagement Insight</p>
                                <h2 className="text-2xl font-black tracking-tight mb-2">Your AI Narrations are gaining momentum!</h2>
                                <p className="text-sm text-white/80 font-medium leading-relaxed">
                                    You've reached over <span className="text-white font-black underline decoration-teal-300 underline-offset-4">{stats.watched} listeners</span> this month. Keep generating diverse content to maintain this growth.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => navigate('/create-episode')}
                                    className="bg-white text-teal-600 px-6 py-3 rounded-2xl font-black text-xs hover:bg-teal-50 transition-colors flex items-center gap-2"
                                >
                                    <PlusCircle size={14} /> Create More
                                </button>
                                <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-2xl font-black text-xs hover:bg-white/20 transition-colors">
                                    Export PDF
                                </button>
                            </div>
                        </div>
                        {/* Decorative background shape */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    </motion.div>
                </div>

                {/* Main Stats Grid */}
                <div className="flex-1 px-6 md:px-10 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <StatCard 
                            label="Total Videos Created" 
                            value={stats.created} 
                            trend={stats.recentGrowth} 
                            icon={AudioLines} 
                            color="teal" 
                        />
                        <StatCard 
                            label="Total Videos Watched" 
                            value={stats.watched} 
                            trend="+4.2% engagement" 
                            icon={Play} 
                            color="violet" 
                        />
                        <StatCard 
                            label="Active Listeners" 
                            value={Math.round(stats.watched * 0.8)} 
                            trend="High retention" 
                            icon={Users} 
                            color="amber" 
                        />
                    </div>

                    {/* Secondary Metrics */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">
                        {/* Platform Distribution */}
                        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Platform Distribution</h3>
                                <button className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400">
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                {[
                                    { name: 'Apple Podcasts', share: 45, color: 'bg-teal-500' },
                                    { name: 'Spotify', share: 35, color: 'bg-violet-500' },
                                    { name: 'Google Podcasts', share: 20, color: 'bg-amber-500' },
                                ].map((p) => (
                                    <div key={p.name} className="space-y-2">
                                        <div className="flex justify-between text-xs font-black">
                                            <span className="text-slate-600 dark:text-slate-200 uppercase tracking-wider">{p.name}</span>
                                            <span className="text-slate-400">{p.share}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${p.share}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className={`h-full ${p.color}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity Mini-Feed */}
                        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Growth Targets</h3>
                                <Target size={16} className="text-slate-300" />
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: 'Reach 10 Episodes', progress: 80, icon: ZapIcon },
                                    { label: '500 Combined Views', progress: 45, icon: Target },
                                    { label: 'Weekly Consistent Post', progress: 100, icon: CheckCircle2 },
                                ].map((target, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${target.progress === 100 ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-[#0D9488]'}`}>
                                            <target.icon size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-black text-slate-800 dark:text-slate-100">{target.label}</p>
                                            <div className="mt-2 h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#0D9488]" style={{ width: `${target.progress}%` }} />
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-[#0D9488]">{target.progress}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Hidden script for mouse glow tracking */}
            <script dangerouslySetInnerHTML={{ __html: `
                document.addEventListener('mousemove', (e) => {
                    const cards = document.querySelectorAll('.group');
                    cards.forEach(card => {
                        const rect = card.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / card.clientWidth) * 100;
                        const y = ((e.clientY - rect.top) / card.clientHeight) * 100;
                        card.style.setProperty('--mouse-x', \`\${x}%\`);
                        card.style.setProperty('--mouse-y', \`\${y}%\`);
                    });
                });
            `}} />
        </div>
    );
};

export default Analytics;
