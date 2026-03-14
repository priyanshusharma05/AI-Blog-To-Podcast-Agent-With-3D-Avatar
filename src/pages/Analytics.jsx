import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, PlusCircle, AudioLines, Settings, LogOut,
    Mic, BarChart3, Video, Play, TrendingUp, Sparkles, Trophy,
    Sun, Moon, Bell, ChevronRight, Menu, X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

/* ─── Sidebar link ───────────────────────────────── */
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

/* ─── Metric Card ────────────────────────────────── */
const MetricCard = ({ label, value, trend, icon: Icon, color, delay = 0 }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const colorClasses = {
        teal: {
            bg: 'bg-teal-50/50 dark:bg-teal-500/5',
            text: 'text-[#0D9488]',
            ring: 'ring-teal-100/50 dark:ring-teal-500/20',
            accent: 'bg-[#0D9488]',
            glow: 'rgba(13, 148, 136, 0.15)'
        },
        blue: {
            bg: 'bg-blue-50/50 dark:bg-blue-500/5',
            text: 'text-blue-600',
            ring: 'ring-blue-100/50 dark:ring-blue-500/20',
            accent: 'bg-blue-600',
            glow: 'rgba(37, 99, 235, 0.15)'
        },
    };
    
    const c = colorClasses[color];
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -12 }}
            className="relative group h-full"
        >
            {/* Background Glow Effect */}
            <motion.div 
                animate={{ 
                    scale: isHovered ? 1.2 : 1,
                    opacity: isHovered ? 0.6 : 0.4
                }}
                className={`absolute -inset-2 rounded-[48px] blur-2xl -z-10 transition-colors duration-500 ${isHovered ? c.bg : 'bg-transparent'}`}
            />

            <div className="h-full bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl p-10 rounded-[40px] border border-white dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none flex flex-col items-center justify-center text-center relative overflow-hidden ring-1 ring-slate-100 dark:ring-slate-800/50">
                {/* Border Gradient Accent */}
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${c.text}`} />
                
                <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center ring-8 mb-8 relative z-10 transition-all duration-700 group-hover:scale-110 group-hover:rotate-3 ${c.bg} ${c.text} ${c.ring}`}>
                    {/* Progress Circle Decoration */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90 opacity-20 group-hover:opacity-40 transition-opacity">
                        <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="276" strokeDashoffset="60" />
                    </svg>
                    <Icon size={40} className="relative z-10" />
                </div>
                
                <div className="relative z-10 space-y-3">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">{label}</p>
                    
                    <div className="flex flex-col items-center">
                        <motion.h3 
                            className="text-6xl font-black text-slate-800 dark:text-slate-100 tracking-tighter"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                        >
                            {value}
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

const Analytics = () => {
    const navigate = useNavigate();
    const [activeNav, setActiveNav] = useState('analytics');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

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
    const initials = (user.name || 'Guest')
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
                                <SideLink icon={PlusCircle} label="Create Episode" active={activeNav === 'create'} onClick={() => { navigate('/create-episode'); setIsMobileMenuOpen(false); }} />
                                <SideLink icon={AudioLines} label="My Episodes" active={activeNav === 'episodes'} onClick={() => { navigate('/episodes'); setIsMobileMenuOpen(false); }} />
                                <SideLink icon={BarChart3} label="Analytics" active={activeNav === 'analytics'} onClick={() => { setActiveNav('analytics'); setIsMobileMenuOpen(false); }} />

                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                                    <SideLink icon={Settings} label="Settings" active={false} onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }} />
                                    <SideLink icon={LogOut} label="Logout" active={false} onClick={() => { localStorage.removeItem('vc_user'); navigate('/'); }} />
                                </div>
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
            {/* SIDEBAR */}
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
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user.name.split(' ')[0]}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
                </div>
            </aside>

            {/* MAIN CONTENT */}
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
                            <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">Analytics</h1>
                            <p className="text-xs text-slate-400 font-medium">Performance insights and audience engagement</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={toggleTheme} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                        <button className="relative w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <Bell size={16} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0D9488]" />
                        </button>
                    </div>
                </header>

                <div className="flex-1 px-6 md:px-10 py-12 space-y-16 max-w-6xl mx-auto relative">
                    {/* Decorative Background Mesh */}
                    <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-gradient-to-br from-teal-500/5 via-blue-500/5 to-purple-500/5 dark:from-teal-500/10 dark:via-blue-500/10 dark:to-purple-500/10 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse" />

                    {/* Motivational Milestone Banner */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 dark:bg-slate-800 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                            <Trophy size={80} />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                                <Sparkles className="text-teal-400" size={32} />
                            </div>
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl font-black tracking-tight mb-1">You're crushing your content goals!</h2>
                                <p className="text-slate-400 text-sm font-medium">Your channel reach has improved by <span className="text-teal-400 font-bold">12.5%</span> compared to last month. Keep creating!</p>
                            </div>
                            <button className="md:ml-auto bg-white text-slate-900 px-8 py-3 rounded-2xl font-black text-sm hover:bg-teal-50 transition-colors">
                                View History
                            </button>
                        </div>
                    </motion.div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <MetricCard 
                            label="Total Videos Created" 
                            value="42" 
                            trend="+5 this week"
                            icon={Video} 
                            color="teal" 
                            delay={0.1}
                        />
                        <MetricCard 
                            label="Total Videos Watched" 
                            value="1.2k" 
                            trend="+12% growth"
                            icon={Play} 
                            color="blue" 
                            delay={0.2}
                        />
                    </div>

                    <div className="pt-10 flex flex-col items-center gap-6">
                        <div className="flex items-center gap-4 text-slate-300 dark:text-slate-700">
                            <div className="h-px w-12 bg-current opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.5em]">Real-time Insights Active</p>
                            <div className="h-px w-12 bg-current opacity-20" />
                        </div>
                        <div className="flex gap-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <motion.div 
                                    key={i} 
                                    animate={{ 
                                        scale: [1, 1.5, 1],
                                        opacity: [0.2, 0.5, 0.2]
                                    }}
                                    transition={{ 
                                        duration: 2, 
                                        repeat: Infinity,
                                        delay: i * 0.4
                                    }}
                                    className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" 
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
