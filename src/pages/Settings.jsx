import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    PlusCircle,
    AudioLines,
    Settings as SettingsIcon,
    LogOut,
    Mic,
    User,
    Mail,
    Lock,
    Bell,
    Moon,
    Sun,
    Trash2,
    Shield,
    ChevronRight,
    Sparkles,
    BarChart3,
    Database,
    Globe,
    Zap
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

/* ─── Settings Card ──────────────────────────────── */
const SettingsCard = ({ title, children, icon: Icon }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
    >
        <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-[#0D9488]">
                <Icon size={20} />
            </div>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">{title}</h3>
        </div>
        <div className="p-8">
            {children}
        </div>
    </motion.div>
);

const Settings = () => {
    const navigate = useNavigate();
    const [activeNav] = useState('settings');
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
    
    // Read user from localStorage
    const stored = localStorage.getItem('vc_user');
    const initialUser = stored ? JSON.parse(stored) : { name: 'Guest User', email: 'guest@example.com' };
    
    const [user, setUser] = useState(initialUser);
    const [notifications, setNotifications] = useState(true);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('vc_theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('vc_theme', 'light');
        }
    }, [isDark]);

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        localStorage.setItem('vc_user', JSON.stringify(user));
        // Show success toast or similar (mock)
        alert('Profile updated successfully!');
    };

    const initials = user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

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
                    <SideLink icon={LayoutDashboard} label="Dashboard" active={false} onClick={() => navigate('/dashboard')} />
                    <SideLink icon={PlusCircle} label="Create Episode" active={false} onClick={() => navigate('/create-episode')} />
                    <SideLink icon={AudioLines} label="My Episodes" active={false} onClick={() => navigate('/episodes')} />
                    <SideLink icon={BarChart3} label="Analytics" active={false} onClick={() => navigate('/analytics')} />

                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                        <SideLink icon={SettingsIcon} label="Settings" active={true} onClick={() => {}} />
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
                        <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">Settings</h1>
                        <p className="text-xs text-slate-400 font-medium">Manage your account and preferences</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsDark(!isDark)} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                        <button className="relative w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <Bell size={16} />
                        </button>
                    </div>
                </header>

                <div className="flex-1 px-6 md:px-10 py-8 space-y-8 max-w-4xl">
                    
                    <div className="grid grid-cols-1 gap-8">
                        
                        {/* Profile Settings */}
                        <SettingsCard title="Profile Settings" icon={User}>
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input 
                                                type="text" 
                                                value={user.name}
                                                onChange={(e) => setUser({...user, name: e.target.value})}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0D9488] transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input 
                                                type="email" 
                                                value={user.email}
                                                onChange={(e) => setUser({...user, email: e.target.value})}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0D9488] transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="bg-[#0D9488] text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-colors"
                                    >
                                        Save Changes
                                    </motion.button>
                                </div>
                            </form>
                        </SettingsCard>

                        {/* App Preferences */}
                        <SettingsCard title="App Preferences" icon={Sparkles}>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 shadow-sm">
                                            {isDark ? <Moon size={18} /> : <Sun size={18} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800 dark:text-slate-100">Dark Mode</p>
                                            <p className="text-xs font-medium text-slate-400">Switch between light and dark themes</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setIsDark(!isDark)}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-[#0D9488]' : 'bg-slate-200'}`}
                                    >
                                        <motion.div 
                                            animate={{ x: isDark ? 26 : 4 }}
                                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 shadow-sm">
                                            <Bell size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800 dark:text-slate-100">Push Notifications</p>
                                            <p className="text-xs font-medium text-slate-400">Get notified when your podcast is ready</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setNotifications(!notifications)}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-[#0D9488]' : 'bg-slate-200'}`}
                                    >
                                        <motion.div 
                                            animate={{ x: notifications ? 26 : 4 }}
                                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                        />
                                    </button>
                                </div>
                            </div>
                        </SettingsCard>

                        {/* Usage & Credits */}
                        <SettingsCard title="Usage & Credits" icon={Database}>
                            <div className="space-y-6">
                                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[24px] border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488]">
                                                <Zap size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 dark:text-slate-100">Podcast Generations</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Free Plan</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-black text-slate-800 dark:text-slate-100">12 / 20</p>
                                    </div>
                                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: '60%' }}
                                            className="h-full bg-[#0D9488] rounded-full"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium mt-3">Resetting in <span className="text-slate-600 dark:text-slate-200 font-bold">14 days</span></p>
                                </div>

                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0D9488] to-teal-400 text-white font-black text-sm shadow-lg shadow-teal-500/20"
                                >
                                    Upgrade to Pro
                                </motion.button>
                            </div>
                        </SettingsCard>

                        {/* Language & Account */}
                        <SettingsCard title="Language & Region" icon={Globe}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">App Language</label>
                                    <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0D9488] transition-colors appearance-none">
                                        <option>English (US)</option>
                                        <option>Spanish</option>
                                        <option>French</option>
                                        <option>Hindi</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Timezone</label>
                                    <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0D9488] transition-colors appearance-none">
                                        <option>(GMT+05:30) India Standard Time</option>
                                        <option>(GMT-08:00) Pacific Time</option>
                                        <option>(GMT+00:00) UTC</option>
                                    </select>
                                </div>
                            </div>
                        </SettingsCard>

                        {/* Security */}
                        <SettingsCard title="Security" icon={Shield}>
                            <div className="space-y-4">
                                <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                            <Lock size={18} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-black text-slate-800 dark:text-slate-100">Change Password</p>
                                            <p className="text-xs font-medium text-slate-400">Update your account password</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-300 group-hover:text-[#0D9488] transition-colors" />
                                </button>
                                
                                <div className="h-px bg-slate-50 dark:bg-slate-800 mx-4" />

                                <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                            <Shield size={18} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-black text-slate-800 dark:text-slate-100">Two-Factor Authentication</p>
                                            <p className="text-xs font-medium text-rose-500">Currently disabled</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-300 group-hover:text-[#0D9488] transition-colors" />
                                </button>
                            </div>
                        </SettingsCard>

                        {/* Danger Zone */}
                        <div className="bg-rose-50/50 dark:bg-rose-950/10 rounded-[32px] border border-rose-100 dark:border-rose-900/30 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4 text-center md:text-left">
                                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 shrink-0">
                                    <Trash2 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-rose-900 dark:text-rose-400">Delete Account</h3>
                                    <p className="text-sm font-medium text-rose-600/70">Once you delete your account, there is no going back. Please be certain.</p>
                                </div>
                            </div>
                            <button className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-rose-600/20 transition-colors whitespace-nowrap">
                                Delete Permanently
                            </button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;
