import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    PlusCircle,
    AudioLines,
    Settings,
    LogOut,
    Mic,
    Sparkles,
    Play,
    Clock,
    CheckCircle2,
    FileText,
    ChevronRight,
    Bell,
    Zap,
    BarChart3,
    Headphones,
    MoreHorizontal,
    ArrowUpRight,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

/* ─── Stats config ───────────────────────────────── */
const STATS = [
    { label: 'Total Episodes', value: '0', icon: AudioLines, color: 'teal', change: 'No episodes yet' },
    { label: 'Published', value: '0', icon: CheckCircle2, color: 'emerald', change: 'Nothing live yet' },
    { label: 'Drafts', value: '0', icon: FileText, color: 'amber', change: 'No drafts' },
    { label: 'Ready', value: '0', icon: Zap, color: 'violet', change: 'Nothing ready' },
];

const EPISODES = [];

/* ─── Color map ──────────────────────────────────── */
const colorMap = {
    teal: { bg: 'bg-teal-50', icon: 'text-[#0D9488]', ring: 'ring-teal-100' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-500', ring: 'ring-emerald-100' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-500', ring: 'ring-amber-100' },
    violet: { bg: 'bg-violet-50', icon: 'text-violet-500', ring: 'ring-violet-100' },
};

/* ─── Status badge ───────────────────────────────── */
const StatusBadge = ({ status }) => {
    const map = {
        published: { label: 'Published', bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
        ready: { label: 'Ready', bg: 'bg-violet-50', text: 'text-violet-600', dot: 'bg-violet-500' },
        draft: { label: 'Draft', bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-400' },
    };
    const s = map[status] || map.draft;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
        </span>
    );
};

/* ─── Sidebar link ───────────────────────────────── */
const SideLink = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 group
        ${active
                ? 'bg-[#0D9488] text-white shadow-lg shadow-teal-200/50'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
    >
        <Icon size={18} className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
        {label}
    </button>
);

/* ─── Main Dashboard Component ───────────────────── */
const Dashboard = () => {
    const [activeNav, setActiveNav] = useState('dashboard');
    const navigate = useNavigate();

    // Read user from localStorage (saved on login / signup)
    const stored = localStorage.getItem('vc_user');
    const user = stored ? JSON.parse(stored) : { name: 'Guest', email: '' };
    const initials = user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="min-h-screen bg-[#F8FAFB] flex font-sans">

            {/* ─── SIDEBAR ─── */}
            <aside className="w-64 shrink-0 hidden lg:flex flex-col bg-white border-r border-slate-100 min-h-screen fixed left-0 top-0 bottom-0 z-30 px-4 py-6">

                {/* Brand */}
                <Link to="/" className="flex items-center gap-2.5 px-2 mb-8 group">
                    <div className="w-9 h-9 bg-[#0D9488] rounded-xl flex items-center justify-center shadow-md shadow-teal-200">
                        <Mic size={16} className="text-white" />
                    </div>
                    <div>
                        <span className="text-base font-black tracking-tight text-slate-800">
                            VOICE<span className="text-[#0D9488]">CAST</span>
                        </span>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest -mt-0.5">Narrator AI</p>
                    </div>
                </Link>

                {/* Nav */}
                <nav className="flex flex-col gap-1 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 mb-2">Menu</p>
                    <SideLink icon={LayoutDashboard} label="Dashboard" active={activeNav === 'dashboard'} onClick={() => setActiveNav('dashboard')} />
                    <SideLink icon={PlusCircle} label="Create Episode" active={activeNav === 'create'} onClick={() => navigate('/create-episode')} />
                    <SideLink icon={AudioLines} label="My Episodes" active={activeNav === 'episodes'} onClick={() => setActiveNav('episodes')} />
                    <SideLink icon={BarChart3} label="Analytics" active={activeNav === 'analytics'} onClick={() => setActiveNav('analytics')} />

                    <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-1">
                        <SideLink icon={Settings} label="Settings" active={activeNav === 'settings'} onClick={() => setActiveNav('settings')} />
                        <SideLink icon={LogOut} label="Logout" active={false} onClick={() => { localStorage.removeItem('vc_user'); navigate('/'); }} />
                    </div>
                </nav>

                {/* User chip */}
                <div className="mt-6 flex items-center gap-3 px-3 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0D9488] to-teal-300 flex items-center justify-center text-white text-xs font-black shrink-0">
                        {initials}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 truncate">{user.name.split(' ')[0]}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                </div>
            </aside>

            {/* ─── MAIN CONTENT ─── */}
            <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">

                {/* Top bar */}
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 md:px-10 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-black text-slate-800 tracking-tight">Dashboard</h1>
                        <p className="text-xs text-slate-400 font-medium">Welcome back, {user.name.split(' ')[0]} 👋</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                            <Bell size={16} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0D9488]" />
                        </button>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0D9488] to-teal-300 flex items-center justify-center text-white text-xs font-black cursor-pointer">
                            {initials}
                        </div>
                    </div>
                </header>

                {/* Page Body */}
                <div className="flex-1 px-6 md:px-10 py-8 space-y-8 max-w-6xl w-full">

                    {/* ── Hero Welcome Banner ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative overflow-hidden bg-[#0D9488] rounded-[28px] px-8 md:px-12 py-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                    >
                        {/* decorative rings */}
                        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full border border-white/10 pointer-events-none" />
                        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full border border-white/10 pointer-events-none" />
                        <div className="absolute right-24 bottom-0 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

                        {/* Animated avatar/icon */}
                        <div className="relative shrink-0 hidden sm:block">
                            <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className="relative w-20 h-20 rounded-3xl bg-white/15 border border-white/25 flex items-center justify-center backdrop-blur-sm"
                            >
                                <Mic size={36} className="text-white" />
                            </motion.div>
                        </div>

                        <div className="flex-1">
                            <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                                <Sparkles size={10} /> AI-Powered
                            </span>
                            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight mb-2">
                                Blog to Podcast<br />in Seconds
                            </h2>
                            <p className="text-teal-100 text-sm font-medium max-w-md">
                                Transform any blog post into an engaging podcast episode with our AI agent and interactive 3D avatar.
                            </p>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/create-episode')}
                            className="shrink-0 flex items-center gap-2 bg-white text-[#0D9488] px-6 py-3 rounded-2xl font-black text-sm shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <PlusCircle size={16} />
                            Create Your First Episode
                        </motion.button>
                    </motion.div>

                    {/* ── Stats Row ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {STATS.map((stat, i) => {
                            const c = colorMap[stat.color];
                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.07 }}
                                    className="bg-white rounded-[20px] border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow group"
                                >
                                    <div className={`w-10 h-10 ${c.bg} ring-4 ${c.ring} rounded-2xl flex items-center justify-center mb-4`}>
                                        <stat.icon size={18} className={c.icon} />
                                    </div>
                                    <p className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</p>
                                    <p className="text-sm font-bold text-slate-500 mt-0.5">{stat.label}</p>
                                    <p className="text-xs text-slate-400 font-medium mt-1">{stat.change}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* ── Episodes Table + Quick Actions ── */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                        {/* Recent Episodes */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="xl:col-span-2 bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden"
                        >
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-base font-black text-slate-800">Recent Episodes</h3>
                                <button className="text-xs font-bold text-[#0D9488] hover:underline flex items-center gap-1">
                                    View all <ChevronRight size={12} />
                                </button>
                            </div>

                            <div>
                                {EPISODES.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                                        <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-4">
                                            <AudioLines size={24} className="text-[#0D9488]" />
                                        </div>
                                        <p className="text-sm font-black text-slate-700 mb-1">No episodes yet</p>
                                        <p className="text-xs text-slate-400 font-medium max-w-[220px]">Create your first episode to see it appear here.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-50">
                                        {EPISODES.map((ep, i) => (
                                            <motion.div
                                                key={ep.id}
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 + i * 0.08 }}
                                                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors group cursor-pointer"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 group-hover:bg-[#0D9488] transition-colors">
                                                    <Play size={14} className="text-[#0D9488] group-hover:text-white transition-colors" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-800 truncate">{ep.title}</p>
                                                    <div className="flex items-center gap-3 mt-0.5">
                                                        <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={10} /> {ep.duration}</span>
                                                        <span className="text-xs text-slate-400">{ep.date}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <StatusBadge status={ep.status} />
                                                    {ep.views > 0 && (
                                                        <span className="text-xs text-slate-400 flex items-center gap-1 font-medium"><Headphones size={11} /> {ep.views}</span>
                                                    )}
                                                    <button className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-colors">
                                                        <MoreHorizontal size={14} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Create CTA footer */}
                            <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/60">
                                <button
                                    onClick={() => navigate('/create-episode')}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm font-bold hover:border-[#0D9488] hover:text-[#0D9488] transition-all"
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
                            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6">
                                <h3 className="text-sm font-black text-slate-800 mb-4">Quick Actions</h3>
                                <div className="flex flex-col gap-2.5">
                                    {[
                                        { icon: PlusCircle, label: 'Create Episode', desc: 'From URL or text', accent: true, path: '/create-episode' },
                                        { icon: AudioLines, label: 'My Episodes', desc: 'Manage library', path: '/dashboard' },
                                        { icon: BarChart3, label: 'Analytics', desc: 'Views & listens', path: '/dashboard' },
                                    ].map((action) => (
                                        <motion.button
                                            key={action.label}
                                            whileHover={{ x: 4 }}
                                            onClick={() => navigate(action.path)}
                                            className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all group ${action.accent
                                                ? 'bg-teal-50 border-teal-100 hover:bg-[#0D9488] hover:border-[#0D9488]'
                                                : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${action.accent ? 'bg-[#0D9488]/10 group-hover:bg-white/20' : 'bg-white'}`}>
                                                <action.icon size={15} className={action.accent ? 'text-[#0D9488] group-hover:text-white' : 'text-slate-400'} />
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold ${action.accent ? 'text-slate-800 group-hover:text-white' : 'text-slate-700'}`}>{action.label}</p>
                                                <p className={`text-xs font-medium ${action.accent ? 'text-teal-600 group-hover:text-teal-100' : 'text-slate-400'}`}>{action.desc}</p>
                                            </div>
                                            <ArrowUpRight size={13} className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${action.accent ? 'text-white' : 'text-slate-400'}`} />
                                        </motion.button>
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

export default Dashboard;
