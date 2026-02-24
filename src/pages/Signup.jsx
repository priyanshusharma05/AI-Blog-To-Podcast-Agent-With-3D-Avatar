import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, Github } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import AuthCard from '../components/auth/AuthCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Signup = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    const Illustration = () => (
        <div className="relative w-full h-[500px] flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-violet-600/10 blur-[120px] rounded-full animate-pulse" />

            <div className="relative z-10 w-full max-w-lg p-10 glass rounded-[3rem] glow-purple flex flex-col items-center justify-center space-y-8 border border-white/10 backdrop-blur-3xl">
                {/* Blog to Podcast Visual */}
                <div className="relative flex items-center justify-center w-full gap-8">
                    {/* Document Icon */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-24 h-32 rounded-xl bg-slate-800/80 border border-white/10 p-4 space-y-3 shadow-2xl"
                    >
                        <div className="h-2 w-full bg-teal-500/40 rounded-full" />
                        <div className="h-2 w-3/4 bg-teal-500/20 rounded-full" />
                        <div className="h-2 w-full bg-teal-500/10 rounded-full" />
                        <div className="h-2 w-5/6 bg-teal-500/10 rounded-full" />
                    </motion.div>

                    {/* Transition Arrow/Waves */}
                    <div className="flex flex-col items-center gap-2">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-teal-400"
                        >
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </motion.div>
                    </div>

                    {/* Waveform Icon */}
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                        className="w-24 h-32 rounded-xl bg-gradient-to-br from-violet-600 to-teal-500 p-1 shadow-2xl"
                    >
                        <div className="w-full h-full bg-slate-900/90 rounded-[calc(0.75rem-1px)] flex items-center justify-center">
                            <div className="flex gap-1 h-12">
                                {[1, 2, 3, 4].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: ['40%', '100%', '40%'] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                        className="w-1.5 bg-teal-400 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="text-center space-y-3">
                    <h3 className="text-xl font-bold text-white">AI Processing Engine</h3>
                    <p className="text-slate-400 text-sm max-w-[250px]">Converting text narratives into immersive auditory experiences automatically.</p>
                </div>

                {/* Status Chips */}
                <div className="flex gap-3">
                    <div className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-[10px] font-bold text-teal-400 uppercase tracking-tighter">Script Gen</div>
                    <div className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-bold text-violet-400 uppercase tracking-tighter">Voice Synth</div>
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-teal-500/5 blur-[60px] rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-violet-500/5 blur-[60px] rounded-full" />
        </div>
    );

    return (
        <AuthLayout illustration={Illustration}>
            <AuthCard
                title="Create Account"
                subtitle="Start transforming your content today"
            >
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            icon={User}
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </motion.div>
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
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
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
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            icon={Lock}
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="md:col-span-2 pt-4"
                    >
                        <Button
                            type="submit"
                            className="w-full py-4 text-lg font-bold"
                            loading={loading}
                            icon={UserPlus}
                        >
                            Get Started Instantly
                        </Button>
                    </motion.div>

                    <div className="md:col-span-2 relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                            <span className="bg-[#0f172a]/0 px-3 text-slate-500">Fast Enrollment</span>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="md:col-span-2 flex justify-center"
                    >
                        <Button variant="secondary" className="w-full py-3.5 border-white/5">
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
                            Sign up with Google
                        </Button>
                    </motion.div>
                </motion.form>

                <p className="mt-10 text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-teal-400 font-bold hover:text-teal-300 transition-all border-b border-teal-500/20 hover:border-teal-500">
                        Sign in instead
                    </Link>
                </p>
            </AuthCard>
        </AuthLayout>
    );
};

export default Signup;
