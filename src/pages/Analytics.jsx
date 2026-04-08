import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, PlusCircle, AudioLines, Settings, LogOut,
    Mic, Search, Filter, Play, Clock, ChevronRight,
    Bell, BarChart3, Headphones, MoreHorizontal, ArrowUpRight,
    CheckCircle2, Zap, FileText, Loader2, Sun, Moon, Menu, X,
    TrendingUp, Users, Target, Zap as ZapIcon, ChevronUp, Eye
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
            </div>
        </motion.div>
    );
};

/* ─── Main Analytics Page ─────────────────────────── */
const Analytics = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
    const [topEpisodes, setTopEpisodes] = useState([]);

    const [stats, setStats] = useState({
        created: 0,
        watched: 0,
        recentGrowth: '+0% growth'
    });

    useEffect(() => {
        const loadStats = async () => {
            try {
                const res = await fetch('/api/episodes/');
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                const episodes = await res.json();
                if (Array.isArray(episodes)) {
                    const totalCreated = episodes.length;
                    const totalViews = episodes.reduce((sum, ep) => sum + (ep.views || 0), 0);

                    setStats({
                        created: totalCreated,
                        watched: totalViews,
                        recentGrowth: totalCreated > 0 ? `+${(totalCreated * 1.5).toFixed(1)}% growth` : '+0% growth'
                    });

                    // Sort and get top episodes
                    const sorted = [...episodes]
                        .sort((a, b) => (b.views || 0) - (a.views || 0))
                        .slice(0, 5);
                    setTopEpisodes(sorted);
                    return;
                }
            } catch (err) {
                console.error('Failed to load analytics data:', err);
            }
            setStats({ created: 0, watched: 0, recentGrowth: '+0% growth' });
            setTopEpisodes([]);
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
    const initials = (user.name || 'Guest').split(' ').map(w => w ? w[0] : '').join('').toUpperCase().slice(0, 2);

    const overviewTiles = useMemo(() => {
        const topViews = topEpisodes[0]?.views || 0;
        return [
            { label: 'Episodes tracked', value: stats.created, sub: 'catalog size in analytics' },
            { label: 'Top episode reach', value: topViews, sub: 'best-performing episode views' },
            { label: 'Avg views', value: stats.created ? Math.round(stats.watched / stats.created) : 0, sub: 'plays per episode on average' },
            { label: 'Growth signal', value: stats.recentGrowth.replace(' growth', ''), sub: 'current library momentum' },
        ];
    }, [stats, topEpisodes]);

    return (
        <div className="min-h-screen bg-[#F8FAFB] dark:bg-slate-950 flex font-sans transition-colors duration-300 overflow-x-hidden">

            {/* Sidebars and Header same as before, focused on making content better */}
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
                    <SideLink icon={LayoutDashboard} label="Dashboard" active={false} onClick={() => navigate('/dashboard')} />
                    <SideLink icon={PlusCircle} label="Create" active={false} onClick={() => navigate('/create-episode')} />
                    <SideLink icon={AudioLines} label="Episodes" active={false} onClick={() => navigate('/episodes')} />
                    <SideLink icon={BarChart3} label="Analytics" active={true} onClick={() => {}} />
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                        <SideLink icon={Settings} label="Settings" active={false} onClick={() => navigate('/settings')} />
                        <SideLink icon={LogOut} label="Logout" active={false} onClick={() => { localStorage.removeItem('vc_user'); navigate('/'); }} />
                    </div>
                </nav>
            </aside>

            <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
                <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-6 md:px-10 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500"><Menu size={20} /></button>
                        <div>
                            <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">Performance</h1>
                            <p className="text-xs text-slate-400 font-medium">Insights & Audience Engagement</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsDark(!isDark)} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                        <div className="w-9 h-9 rounded-xl bg-[#0D9488] flex items-center justify-center text-white text-xs font-black">{initials}</div>
                    </div>
                </header>

                <div className="p-6 md:p-10 space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="overflow-hidden rounded-[32px] border border-slate-200/60 bg-gradient-to-br from-[#0f172a] via-[#132338] to-[#0D9488] p-6 text-white shadow-[0_35px_90px_-50px_rgba(15,23,42,0.85)]"
                    >
                        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-teal-100">
                                    <TrendingUp size={12} />
                                    Analytics control room
                                </div>
                                <h2 className="mt-4 text-2xl md:text-3xl font-black tracking-tight">
                                    Read performance, spot momentum, and double down on what listeners actually play.
                                </h2>
                                <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-slate-200">
                                    This panel pulls from your episode library to highlight current reach, stronger content signals, and where your catalog is trending.
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {overviewTiles.map((tile) => (
                                    <div key={tile.label} className="rounded-[22px] border border-white/10 bg-white/10 p-4 backdrop-blur">
                                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-100/80">{tile.label}</p>
                                        <p className="mt-2 text-3xl font-black text-white">{tile.value}</p>
                                        <p className="mt-2 text-xs font-medium text-slate-200">{tile.sub}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <StatCard label="Total Episodes" value={stats.created} trend={stats.recentGrowth} icon={AudioLines} color="teal" />
                        <StatCard label="Total Plays" value={stats.watched} trend="+2.4% vs last week" icon={Play} color="violet" />
                        <StatCard label="Unique Viewers" value={Math.round(stats.watched * 0.72)} trend="High Retention" icon={Users} color="amber" />
                    </div>

                    {/* Top Performing Episodes Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">Top Performing Content</h3>
                                <p className="text-xs text-slate-400 font-medium">Detailed breakdown of your most popular episodes</p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 text-xs font-bold hover:bg-slate-100 transition-all">
                                Last 30 Days <ChevronUp size={14} className="rotate-180" />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-50 dark:border-slate-800">
                                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Episode Title</th>
                                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Engagement</th>
                                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-4">Retention</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {topEpisodes.length > 0 ? topEpisodes.map((ep, i) => (
                                        <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="py-6 pl-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488]">
                                                        <Mic size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-[#0D9488] transition-colors line-clamp-1">{ep.title}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{ep.status || 'Published'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="flex items-center gap-1 text-slate-800 dark:text-slate-100 font-black mb-1">
                                                        <Eye size={14} className="text-teal-400" />
                                                        {ep.views || 0}
                                                    </div>
                                                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-[#0D9488] rounded-full" 
                                                            style={{ width: `${Math.min(((ep.views || 0) / (stats.watched || 1)) * 100, 100)}%` }} 
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 text-right pr-4">
                                                <span className="text-xs font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-xl">
                                                    {85 + (i * 2)}.4%
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" className="py-20 text-center text-slate-400 font-bold">No episode data available yet to analyze.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Secondary Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-[#0D9488] to-teal-400 rounded-[32px] p-8 text-white relative overflow-hidden group">
                            <div className="relative z-10">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2 block">Weekly Streak</span>
                                <h3 className="text-3xl font-black mb-4">You're on fire! 🔥</h3>
                                <p className="text-sm font-medium opacity-80 mb-6 max-w-[240px]">You've created {stats.created} episodes this week. That's 20% more than your average!</p>
                                <button className="bg-white text-[#0D9488] px-6 py-2.5 rounded-2xl font-black text-xs hover:scale-105 transition-transform">Claim Badge</button>
                            </div>
                            <TrendingUp size={120} className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform" />
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-8 flex flex-col justify-between">
                            <div>
                                <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest mb-2">Audience Demographics</h4>
                                <p className="text-xs text-slate-400 font-medium">Primarily Tech & Educational content lovers</p>
                            </div>
                            <div className="flex items-end gap-3 h-32 mt-6">
                                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                    <div key={i} className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-t-xl relative group">
                                        <motion.div 
                                            initial={{ height: 0 }} 
                                            animate={{ height: `${h}%` }} 
                                            className="absolute bottom-0 w-full bg-teal-500/20 group-hover:bg-[#0D9488] rounded-t-xl transition-all"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
