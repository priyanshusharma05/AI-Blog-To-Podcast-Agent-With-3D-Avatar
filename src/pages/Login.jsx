import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
        <div className="relative w-full h-[400px] flex items-center justify-center">
            <div className="absolute inset-0 bg-teal-500/5 blur-3xl rounded-full" />
            <div className="relative z-10 w-full max-w-md p-8 glass rounded-3xl glow-teal flex flex-col items-center justify-center space-y-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-violet-500 flex items-center justify-center animate-bounce-slow">
                    <Mail className="text-white w-12 h-12" />
                </div>
                <div className="space-y-3 w-full">
                    <div className="h-4 w-3/4 bg-slate-800 rounded-full animate-pulse" />
                    <div className="h-4 w-1/2 bg-slate-800 rounded-full animate-pulse" />
                    <div className="h-4 w-5/6 bg-slate-800 rounded-full animate-pulse" />
                </div>
                <div className="flex gap-4 w-full">
                    <div className="h-10 flex-1 bg-slate-800 rounded-lg animate-pulse" />
                    <div className="h-10 w-10 bg-slate-800 rounded-lg animate-pulse" />
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-10 right-10 w-12 h-12 glass rounded-xl flex items-center justify-center animate-bounce-slow" style={{ animationDelay: '1s' }}>
                <div className="w-6 h-6 rounded-full bg-teal-500/40" />
            </div>
            <div className="absolute bottom-10 left-10 w-16 h-16 glass rounded-2xl flex items-center justify-center animate-bounce-slow" style={{ animationDelay: '2s' }}>
                <div className="w-8 h-8 rounded-full bg-violet-500/40" />
            </div>
        </div>
    );

    return (
        <AuthLayout illustration={Illustration}>
            <AuthCard
                title="Welcome Back"
                subtitle="Sign in to your VoiceCast AI account"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="name@company.com"
                        icon={Mail}
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <div className="space-y-1">
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
                            <a href="#" className="text-xs text-teal-500 hover:underline transition-all">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="remember"
                            className="w-4 h-4 rounded border-white/10 bg-slate-900 text-teal-500 focus:ring-teal-500/20"
                        />
                        <label htmlFor="remember" className="text-sm text-slate-400">Remember me</label>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        loading={loading}
                        icon={LogIn}
                    >
                        Sign In
                    </Button>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#0f172a] px-2 text-slate-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="flex justify-center social-login">
                        <Button variant="secondary" className="w-full">
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
                            Google
                        </Button>
                    </div>
                </form>

                <p className="mt-8 text-center text-sm text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-teal-500 font-semibold hover:underline transition-all">
                        Sign up for free
                    </Link>
                </p>
            </AuthCard>
        </AuthLayout>
    );
};

export default Login;
