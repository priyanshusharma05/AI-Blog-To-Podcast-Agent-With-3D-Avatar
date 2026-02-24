import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const AuthCard = ({ children, className, title, subtitle }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={twMerge(
                'relative p-[1px] rounded-3xl overflow-hidden group',
                className
            )}
        >
            {/* Animated Border Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/50 via-violet-500/50 to-teal-500/50 animate-gradient-xy opacity-40 group-hover:opacity-100 transition-opacity duration-500" />

            <div className={twMerge(
                'relative bg-[#020617]/80 backdrop-blur-2xl rounded-[calc(1.5rem-1px)] p-8 w-full glow-purple overflow-hidden flex flex-col',
                'border border-white/5'
            )}>
                {/* Decorative Blur Objects */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/10 blur-[80px] rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/10 blur-[80px] rounded-full" />

                <div className="relative z-10">
                    {(title || subtitle) && (
                        <div className="mb-10 text-center">
                            {title && (
                                <h1 className="text-4xl font-black bg-gradient-to-br from-white via-white/90 to-slate-500 bg-clip-text text-transparent mb-3 tracking-tight">
                                    {title}
                                </h1>
                            )}
                            {subtitle && (
                                <p className="text-slate-400 text-base font-medium">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </motion.div>
    );
};

export default AuthCard;
