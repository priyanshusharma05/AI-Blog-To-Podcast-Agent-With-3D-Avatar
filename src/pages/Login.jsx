import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import AuthCard from '../components/auth/AuthCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    const Illustration = () => (
        <div className="relative w-full h-[420px] flex items-center justify-center">
            {/* Light-theme card */}
            <div className="relative z-10 w-full max-w-lg p-10 bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/60 flex flex-col items-center justify-center space-y-8">
                {/* Central Mic Icon */}
                <div className="relative">
                    <div className="absolute inset-0 bg-teal-200/40 blur-2xl rounded-full animate-pulse" />
                    <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[#0D9488] to-teal-300 flex items-center justify-center shadow-xl shadow-teal-200">
                        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 013 3v5a3 3 0 01-6 0V5a3 3 0 013-3z" />
                        </svg>
                    </div>
                </div>

                {/* Waveform bars */}
                <div className="flex items-end justify-center gap-1.5 h-16 w-full px-6">
                    {[0.6, 0.8, 0.5, 0.9, 0.7, 1.0, 0.8, 0.6, 0.9, 0.7].map((h, i) => (
                        <motion.div
                            key={i}
                            animate={{ height: [`${h * 40}%`, `${h * 100}%`, `${h * 40}%`] }}
                            transition={{ duration: 1.5 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
                            className="w-2 rounded-full bg-gradient-to-t from-[#0D9488] to-teal-300 opacity-70"
                        />
                    ))}
                </div>

                {/* Progress indicators */}
                <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="h-full w-1/3 bg-[#0D9488]/50 rounded-full"
                        />
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
                            className="h-full w-1/2 bg-teal-400/50 rounded-full"
                        />
                    </div>
                </div>

                {/* Status chips */}
                <div className="flex gap-3">
                    <div className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[10px] font-bold text-[#0D9488] uppercase tracking-tighter">Script Gen</div>
                    <div className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Voice Synth</div>
                </div>
            </div>

            {/* Floating accent elements */}
            <motion.div
                animate={{ y: [0, -15, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-8 right-16 w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center"
            >
                <div className="w-1.5 h-5 bg-[#0D9488]/40 rounded-full" />
            </motion.div>
            <motion.div
                animate={{ y: [0, 20, 0], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-8 left-16 w-12 h-12 rounded-3xl bg-orange-50 border border-orange-100 flex items-center justify-center"
            >
                <div className="w-6 h-1.5 bg-orange-300/60 rounded-full" />
            </motion.div>
        </div>
    );

    return (
        <AuthLayout illustration={Illustration}>
            <AuthCard
                title="Welcome Back"
                subtitle="Login to continue creating AI-powered podcasts."
            >
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="name@company.com"
                            icon={Mail}
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="space-y-1">
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            icon={Lock}
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <div className="flex justify-end">
                            <a href="#" className="text-sm text-[#0D9488] hover:text-teal-700 font-bold transition-colors">
                                Forgot password?
                            </a>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="remember"
                            className="w-4 h-4 rounded border-slate-300 text-[#0D9488] focus:ring-teal-500/20 cursor-pointer"
                        />
                        <label htmlFor="remember" className="text-sm text-slate-500 cursor-pointer select-none font-medium">Remember for 30 days</label>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                        <Button type="submit" className="w-full text-base py-3.5 font-bold rounded-xl" loading={loading} icon={LogIn}>
                            Login
                        </Button>
                    </motion.div>

                    {/* Divider */}
                    <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest">
                            <span className="bg-white px-4 text-slate-400 font-bold">Or continue with</span>
                        </div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                        <Button variant="secondary" className="w-full py-3 rounded-xl">
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </Button>
                    </motion.div>
                </motion.form>

                <p className="mt-8 text-center text-sm text-slate-500">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-[#0D9488] font-bold hover:text-teal-700 transition-colors">
                        Sign Up
                    </Link>
                </p>
            </AuthCard>
        </AuthLayout>
    );
};

export default Login;
