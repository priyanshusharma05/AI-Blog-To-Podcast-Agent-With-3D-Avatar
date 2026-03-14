import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, PlusCircle, AudioLines, Settings as SettingsIcon, LogOut,
    Mic, Bell, Moon, Sun, ChevronRight, Menu, X, User, Shield, CreditCard,
    Smartphone, Globe, Info, Save, BarChart3
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

/* ─── Sidebar link ─────────────────────────────── */
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

/* ─── Setting Item ─────────────────────────────── */
const SettingItem = ({ icon: Icon, label, desc, action, danger }) => (
    <div className="flex items-center justify-between py-6 group">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${danger ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-[#0D9488] dark:group-hover:text-teal-400 transition-colors'}`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-sm font-black text-slate-800 dark:text-slate-100">{label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{desc}</p>
            </div>
        </div>
        <div>
            {action || (
                <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-300 hover:text-slate-500 transition-colors">
                    <ChevronRight size={18} />
                </button>
            )}
        </div>
    </div>
);

const Settings = () => {
    const navigate = useNavigate();
    const [activeNav, setActiveNav] = useState('settings');
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
    const email = user.email || '';
    const initials = userName
        .split(' ')
        .map((w) => w ? w[0] : '')
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="min-h-screen bg-[#F8FAFB] dark:bg-slate-950 flex font-sans transition-colors duration-300">

            {/* ─── MOBILE SIDEBAR ─── */}
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
                                <SideLink icon={BarChart3} label="Analytics" active={activeNav === 'analytics'} onClick={() => { navigate('/analytics'); setIsMobileMenuOpen(false); }} />

                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                                    <SideLink icon={SettingsIcon} label="Settings" active={activeNav === 'settings'} onClick={() => { setActiveNav('settings'); setIsMobileMenuOpen(false); }} />
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
                    <SideLink icon={BarChart3} label="Analytics" active={activeNav === 'analytics'} onClick={() => navigate('/analytics')} />

                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                        <SideLink icon={SettingsIcon} label="Settings" active={activeNav === 'settings'} onClick={() => setActiveNav('settings')} />
                        <SideLink icon={LogOut} label="Logout" active={false} onClick={() => { localStorage.removeItem('vc_user'); navigate('/'); }} />
                    </div>
                </nav>

                <div className="mt-6 flex items-center gap-3 px-3 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0D9488] to-teal-300 flex items-center justify-center text-white text-xs font-black shrink-0">
                        {initials}
                    </div>
                    <div className="overflow-hidden flex-1">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{(user.name || 'Guest').split(' ')[0]}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email || ''}</p>
                    </div>
                </div>
            </aside>

            {/* ─── MAIN CONTENT ─── */}
            <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">

                {/* Top bar */}
                <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-6 md:px-10 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500"><Menu size={20} /></button>
                        <div>
                            <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">Account Settings</h1>
                            <p className="text-xs text-slate-400 font-medium">Manage your profile, preferences and plan</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={toggleTheme} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0D9488] to-teal-300 flex items-center justify-center text-white text-xs font-black cursor-pointer">{initials}</div>
                    </div>
                </header>

                <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-12 p-10 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-[#0D9488] to-teal-300 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-teal-200/50">
                                {initials}
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-slate-900 dark:bg-slate-800 border-4 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-xl">
                                <PlusCircle size={18} />
                            </button>
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-1">{userName}</h2>
                            <p className="text-sm text-slate-400 dark:text-slate-500 font-bold mb-6 tracking-wide uppercase">{email}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <button className="bg-[#0D9488] text-white px-6 py-2.5 rounded-2xl font-black text-xs shadow-lg shadow-teal-200/50 hover:bg-teal-700 transition-colors flex items-center gap-2">
                                    <Save size={14} /> Update Profile
                                </button>
                                <button className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-6 py-2.5 rounded-2xl font-black text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Settings Groups */}
                    <div className="space-y-12">
                        {/* Section: Account */}
                        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-[0.2em]">Personal Details</h3>
                            </div>
                            <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                <SettingItem icon={User} label="Display Name" desc={userName} />
                                <SettingItem icon={Globe} label="Email Address" desc={email} />
                                <SettingItem icon={Smartphone} label="Connected Phone" desc="Not connected" />
                            </div>
                        </div>

                        {/* Section: App Preferences */}
                        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-[0.2em]">Application Preferences</h3>
                            </div>
                            <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                <SettingItem 
                                    icon={isDark ? Moon : Sun} 
                                    label="Dark Mode" 
                                    desc="Experience a focused dark interface" 
                                    action={
                                        <button 
                                            onClick={toggleTheme}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-[#0D9488]' : 'bg-slate-200'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isDark ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    } 
                                />
                                <SettingItem icon={Bell} label="Notifications" desc="Push and email updates" />
                                <SettingItem icon={Shield} label="Privacy & Security" desc="Manage data and access" />
                            </div>
                        </div>

                        {/* Section: Billing */}
                        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-[0.2em]">Billing & Plan</h3>
                            </div>
                            <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                <SettingItem icon={CreditCard} label="Current Plan" desc="Free Tier" action={<span className="text-[10px] font-black text-[#0D9488] bg-teal-50 dark:bg-teal-500/10 px-3 py-1.5 rounded-xl uppercase">Active</span>} />
                                <SettingItem icon={Target} label="Upgrade to Pro" desc="Unlock unlimited AI clones" action={<button className="text-[10px] font-black text-[#0D9488] hover:underline uppercase">View Plans</button>} />
                            </div>
                        </div>

                        {/* Support & Logout */}
                        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
                            <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                <SettingItem icon={Info} label="About VOICECAST" desc="Version 1.0.4" />
                                <SettingItem 
                                    icon={LogOut} 
                                    label="Sign Out" 
                                    desc="Securely log out of your account" 
                                    danger 
                                    action={
                                        <button 
                                            onClick={() => { localStorage.removeItem('vc_user'); navigate('/'); }}
                                            className="text-[10px] font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-2 rounded-xl border border-red-100 dark:border-red-500/20 uppercase transition-all"
                                        >
                                            Log Out
                                        </button>
                                    } 
                                />
                            </div>
                        </div>
                    </div>

                    <footer className="mt-20 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">VOICECAST © 2026 • Made with AI</p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default Settings;
