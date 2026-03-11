import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Mic, Globe, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    const navLinks = [
        { name: 'Features', href: '/#features', id: 'features' },
        { name: 'How It Works', href: '/#how-it-works', id: 'how-it-works' },
        { name: 'Use Cases', href: '/#use-cases', id: 'use-cases' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Scrollspy logic
            const sections = navLinks.map(link => document.getElementById(link.id)).filter(Boolean);
            let currentActive = '';

            // Find the section that is currently most visible at the top of the screen
            for (const section of sections) {
                const rect = section.getBoundingClientRect();
                // If the top of the section is above the middle of the screen (or close to top)
                if (rect.top <= window.innerHeight * 0.3 && rect.bottom >= 0) {
                    currentActive = section.id;
                }
            }
            setActiveSection(currentActive);
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e, id) => {
        if (window.location.pathname === '/') {
            e.preventDefault();
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                setIsOpen(false);
            }
        }
    };

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`flex items-center justify-between gap-8 px-6 py-3 rounded-full transition-all duration-500 border ${scrolled
                    ? 'bg-white/80 backdrop-blur-xl border-teal-900/10 shadow-2xl shadow-teal-900/10 w-full max-w-5xl'
                    : 'bg-white/40 backdrop-blur-md border-teal-900/5 w-full max-w-6xl'
                    }`}
            >
                {/* Brand / Logo */}
                <Link to="/" className="flex items-center gap-2 group shrink-0">
                    <motion.div
                        whileHover={{ rotate: 180 }}
                        className="w-10 h-10 bg-[#0D9488] rounded-full flex items-center justify-center shadow-lg shadow-teal-900/20"
                    >
                        <Mic className="text-white w-5 h-5" />
                    </motion.div>
                    <div className="flex flex-col -gap-1">
                        <span className="text-lg font-black text-[#0F172A] tracking-tighter leading-none">
                            VOICE<span className="text-[#0D9488]">CAST</span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Narrator AI</span>
                    </div>
                </Link>

                {/* Desktop Nav Links - Centered */}
                <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50 relative">
                    {navLinks.map((link) => {
                        const isActive = activeSection === link.id;
                        return link.href.startsWith('/') ? (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={(e) => handleNavClick(e, link.id)}
                                className={`relative px-5 py-2 text-sm font-bold transition-all rounded-full z-10 ${isActive ? 'text-white' : 'text-slate-600 hover:text-[#0D9488] hover:bg-white active:scale-95'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNavBackground"
                                        className="absolute inset-0 bg-[#0D9488] rounded-full -z-10 shadow-md shadow-teal-900/10"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                {link.name}
                            </Link>
                        ) : (
                            <a
                                key={link.name}
                                href={link.href}
                                className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-[#0D9488] transition-all rounded-full hover:bg-white active:scale-95"
                            >
                                {link.name}
                            </a>
                        );
                    })}
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <Link to="/signup">
                        <button className="text-sm font-bold text-slate-500 hover:text-[#0F172A] px-4 transition-colors">
                            Sign Up
                        </button>
                    </Link>
                    <Link to="/login">
                        <Button
                            variant="primary"
                            className="bg-[#0D9488] hover:bg-[#0F172A] text-white rounded-full px-6 py-2.5 text-sm font-bold shadow-lg shadow-teal-900/10 group"
                        >
                            <span>Login</span>
                            <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 text-slate-600 hover:text-[#0D9488]"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute top-20 left-4 right-4 bg-white rounded-3xl p-6 shadow-2xl border border-teal-900/10 md:hidden"
                    >
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => {
                                const isActive = activeSection === link.id;
                                return link.href.startsWith('/') ? (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        onClick={(e) => handleNavClick(e, link.id)}
                                        className={`p-4 text-lg font-bold rounded-2xl transition-all ${isActive ? 'bg-[#0D9488] text-white' : 'text-slate-600 hover:text-[#0D9488] hover:bg-teal-50'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                ) : (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className="p-4 text-lg font-bold text-slate-600 hover:text-[#0D9488] hover:bg-teal-50 rounded-2xl transition-all"
                                    >
                                        {link.name}
                                    </a>
                                );
                            })}
                            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
                                <Link to="/login">
                                    <Button variant="ghost" className="w-full justify-center text-slate-600 text-lg">
                                        Log in
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button variant="primary" className="w-full justify-center bg-[#0D9488] text-white text-lg rounded-2xl py-4">
                                        Get started
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Navbar;
