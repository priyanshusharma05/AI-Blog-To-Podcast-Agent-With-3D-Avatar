import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, PlusCircle, AudioLines, Settings, LogOut,
    Mic, BarChart3, TrendingUp, Users, Clock, Headphones,
    ArrowUpRight, ArrowDownRight, Zap, Target, MousePointer2,
    Sun, Moon, Bell, ChevronRight
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
const MetricCard = ({ label, value, trend, trendValue, icon: Icon, color }) => {
    const isPositive = trend === 'up';
    const colorClasses = {
        teal: 'bg-teal-50 dark:bg-teal-500/10 text-[#0D9488] ring-teal-100 dark:ring-teal-500/20',
        blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 ring-blue-100 dark:ring-blue-500/20',
        violet: 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 ring-violet-100 dark:ring-violet-500/20',
        amber: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 ring-amber-100 dark:ring-amber-500/20',
    };
    
    return (
        <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ring-4 ${colorClasses[color]}`}>
                    <Icon size={18} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-black ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {trendValue}%
                </div>
            </div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{value}</h3>
        </motion.div>
    );
};

/* ─── Mini Trend Chart ───────────────────────────── */
const TrendChart = () => {
    const data = [30, 45, 35, 60, 55, 80, 75, 90, 85, 100];
    const points = data.map((val, i) => `${(i * 100) / (data.length - 1)},${100 - val}`).join(' ');

    return (
        <div className="h-48 w-full relative mt-4">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0D9488" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* Area */}
                <motion.polyline
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    fill="url(#chartGradient)"
                    points={`0,100 ${points} 100,100`}
                />
                {/* Line */}
                <motion.polyline
                    fill="none"
                    stroke="#0D9488"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                {/* Points */}
                {data.map((val, i) => (
                    <motion.circle
                        key={i}
                        cx={(i * 100) / (data.length - 1)}
                        cy={100 - val}
                        r="1.5"
                        fill="white"
                        stroke="#0D9488"
                        strokeWidth="1"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + i * 0.05 }}
                    />
                ))}
            </svg>
            
            {/* Legend */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] font-bold text-slate-400 px-1 pt-2">
                <span>Mar 08</span>
                <span>Mar 10</span>
                <span>Mar 12</span>
                <span>Mar 14</span>
            </div>
        </div>
    );
};

const Analytics = () => {
    const navigate = useNavigate();
    const [activeNav, setActiveNav] = useState('analytics');
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
    const initials = user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="min-h-screen bg-[#F8FAFB] dark:bg-slate-950 flex font-sans transition-colors duration-300">
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
                        <SideLink icon={Settings} label="Settings" active={false} onClick={() => {}} />
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

            {/* MAIN CONTENT */}
            <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
                <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-6 md:px-10 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">Analytics</h1>
                        <p className="text-xs text-slate-400 font-medium">Performance insights and audience engagement</p>
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

                <div className="flex-1 px-6 md:px-10 py-8 space-y-8 max-w-7xl">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard label="Total Listens" value="2,842" trend="up" trendValue="12.5" icon={Headphones} color="teal" />
                        <MetricCard label="Avg. Listen Time" value="4:22" trend="up" trendValue="5.2" icon={Clock} color="blue" />
                        <MetricCard label="Conversion Rate" value="38.4%" trend="down" trendValue="2.1" icon={Target} color="violet" />
                        <MetricCard label="Total Shares" value="428" trend="up" trendValue="18.7" icon={Users} color="amber" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Trend Chart Card */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">Listen Trends</h3>
                                    <p className="text-xs text-slate-400 font-medium">Daily listens across all episodes</p>
                                </div>
                                <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 px-3 py-2 outline-none">
                                    <option>Last 7 Days</option>
                                    <option>Last 30 Days</option>
                                </select>
                            </div>
                            <TrendChart />
                        </div>

                        {/* Engagement Stats */}
                        <div className="bg-[#0D9488] rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-teal-100/60 mb-1">Most Engaging</p>
                                <h4 className="text-lg font-black leading-tight">The Future of AI in Creative Industries</h4>
                                <div className="mt-6 flex items-center gap-6">
                                    <div>
                                        <p className="text-2xl font-black">92%</p>
                                        <p className="text-[10px] font-bold text-teal-100/60 uppercase">Retention</p>
                                    </div>
                                    <div className="w-px h-8 bg-white/20" />
                                    <div>
                                        <p className="text-2xl font-black">1.2k</p>
                                        <p className="text-[10px] font-bold text-teal-100/60 uppercase">Listens</p>
                                    </div>
                                </div>
                            </div>
                            
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="mt-8 w-full bg-white text-[#0D9488] py-4 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2"
                            >
                                <TrendingUp size={16} />
                                View Details
                            </motion.button>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Conversion Analytics */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
                            <h3 className="text-base font-black text-slate-800 dark:text-slate-100 mb-6">Pipeline Conversion</h3>
                            <div className="space-y-6">
                                {[
                                    { label: 'Blog URLs pasted', value: '1,240', percent: 100, icon: MousePointer2, color: 'text-blue-500' },
                                    { label: 'Drafts generated', value: '842', percent: 68, icon: Zap, color: 'text-amber-500' },
                                    { label: 'Podcasts published', value: '428', percent: 34, icon: Mic, color: 'text-[#0D9488]' }
                                ].map((step, i) => (
                                    <div key={i} className="relative">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <step.icon size={16} className={step.color} />
                                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{step.label}</span>
                                            </div>
                                            <span className="text-sm font-black text-slate-800 dark:text-slate-100">{step.value}</span>
                                        </div>
                                        <div className="h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${step.percent}%` }}
                                                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                                className={`h-full bg-gradient-to-r from-teal-500 to-teal-300 rounded-full`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Channels/Referrers */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
                            <h3 className="text-base font-black text-slate-800 dark:text-slate-100 mb-6">Audience Origins</h3>
                            <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                {[
                                    { origin: 'Direct Link', count: '1,420', trend: '+12%' },
                                    { origin: 'LinkedIn', count: '840', trend: '+24%' },
                                    { origin: 'Twitter / X', count: '320', trend: '-2%' },
                                    { origin: 'Newsletter', count: '262', trend: '+8%' }
                                ].map((item, i) => (
                                    <div key={i} className="py-4 flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-[#0D9488] transition-colors">
                                                <ArrowUpRight size={14} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.origin}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-slate-800 dark:text-slate-100">{item.count}</p>
                                            <p className={`text-[10px] font-bold ${item.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{item.trend}</p>
                                        </div>
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
