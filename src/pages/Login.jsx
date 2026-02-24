import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Github } from 'lucide-react';
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
        <div className="relative w-full h-[500px] flex items-center justify-center">
            {/* Main Ambient Glow */}
            <div className="absolute inset-0 bg-teal-500/10 blur-[120px] rounded-full animate-pulse" />

            <div className="relative z-10 w-full max-w-lg p-12 glass rounded-[3rem] glow-teal flex flex-col items-center justify-center space-y-10 border border-white/10 backdrop-blur-3xl">
                {/* Central Mic Icon with Pulse */}
                <div className="relative">
                    <div className="absolute inset-0 bg-teal-500/30 blur-2xl rounded-full animate-ping" />
                    <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-teal-400 to-violet-500 flex items-center justify-center shadow-2xl">
                        <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 013 3v5a3 3 0 01-6 0V5a3 3 0 013-3z" />
                        </svg>
                    </div>
                </div>

                {/* Animated Waveforms */}
                <div className="flex items-end justify-center gap-1.5 h-20 w-full px-4">
                    {[0.6, 0.8, 0.5, 0.9, 0.7, 1.0, 0.8, 0.6, 0.9, 0.7].map((h, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                height: [`${h * 40}%`, `${h * 100}%`, `${h * 40}%`],
                            }}
                            transition={{
                                duration: 1.5 + i * 0.1,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="w-2 rounded-full bg-gradient-to-t from-teal-500 to-violet-400 opacity-60"
                        />
                    ))}
                </div>

                {/* Processing Indicators */}
                <div className="grid grid-cols-2 gap-6 w-full">
                    <div className="h-2.5 bg-slate-800/50 rounded-full overflow-hidden">
                        <motion.div
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="h-full w-1/3 bg-teal-500/40"
                        />
                    </div>
                    <div className="h-2.5 bg-slate-800/50 rounded-full overflow-hidden">
                        <motion.div
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
                            className="h-full w-1/2 bg-violet-500/40"
                        />
                    </div>
                </div>
            </div>

            {/* Floating Sound Particles */}
            <motion.div
                animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-10 right-20 w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center backdrop-blur-md"
            >
                <div className="w-2 h-6 bg-teal-500/30 rounded-full" />
            </motion.div>
            <motion.div
                animate={{ y: [0, 25, 0], opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-10 left-20 w-16 h-16 rounded-3xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center backdrop-blur-md"
            >
                <div className="w-8 h-2 bg-violet-500/30 rounded-full" />
            </motion.div>
        </div>
    );

    return (
        <AuthLayout illustration={Illustration}>
            <AuthCard
                title="Welcome Back"
                subtitle="Sign in to your VoiceCast AI account"
            >
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
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

                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-1"
                    >
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
                            <a href="#" className="text-sm text-teal-500 hover:text-teal-400 font-medium transition-all">
                                Forgot password?
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-3"
                    >
                        <input
                            type="checkbox"
                            id="remember"
                            className="w-5 h-5 rounded-lg border-white/10 bg-slate-900/50 text-teal-500 focus:ring-teal-500/20 transition-all cursor-pointer"
                        />
                        <label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer select-none">Remember for 30 days</label>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Button
                            type="submit"
                            className="w-full text-lg py-4 font-bold tracking-tight"
                            loading={loading}
                            icon={LogIn}
                        >
                            Sign In to Dashboard
                        </Button>
                    </motion.div>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest">
                            <span className="bg-[#0f172a]/0 px-4 text-slate-500 backdrop-blur-sm">Secure Social Login</span>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="flex justify-center"
                    >
                        <Button variant="secondary" className="w-full py-3.5 border-white/5 hover:border-white/10 transition-all">
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </Button>
                    </motion.div>
                </motion.form>

                <p className="mt-10 text-center text-sm text-slate-500">
                    New to VoiceCast?{' '}
                    <Link to="/signup" className="text-teal-400 font-bold hover:text-teal-300 transition-all border-b border-teal-500/20 hover:border-teal-500">
                        Create free account
                    </Link>
                </p>
            </AuthCard>
        </AuthLayout>
    );
};

export default Login;
