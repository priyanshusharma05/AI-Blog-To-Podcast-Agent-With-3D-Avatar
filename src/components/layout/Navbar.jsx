import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Mic, Globe } from 'lucide-react';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Platform', href: '#' },
        { name: 'Solutions', href: '#' },
        { name: 'Resources', href: '#' },
        { name: 'Pricing', href: '#' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:bg-indigo-500 transition-colors">
                            <Mic className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            VoiceCast
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <div key={link.name} className="relative group">
                                <a
                                    href={link.href}
                                    className="text-slate-300 hover:text-white font-medium flex items-center gap-1 transition-colors"
                                >
                                    {link.name}
                                    <ChevronDown className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </a>
                                {/* Dropdown indicator (just for visuals) */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-12 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-x-0 group-hover:scale-x-100" />
                            </div>
                        ))}
                    </div>

                    {/* Right side Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button className="text-slate-400 hover:text-white transition-colors">
                            <Globe size={20} />
                        </button>
                        <Link to="/login">
                            <Button variant="ghost" className="text-slate-300 hover:text-white">
                                Log in
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button
                                variant="primary"
                                className="bg-indigo-600 hover:bg-indigo-500 text-white border-none shadow-indigo-500/20"
                            >
                                Get started free
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-slate-300 hover:text-white transition-colors"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-slate-900 border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="block px-3 py-4 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="pt-4 flex flex-col gap-3">
                                <Link to="/login" className="w-full">
                                    <Button variant="ghost" className="w-full justify-center">
                                        Log in
                                    </Button>
                                </Link>
                                <Link to="/signup" className="w-full">
                                    <Button variant="primary" className="w-full justify-center bg-indigo-600">
                                        Get started
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
