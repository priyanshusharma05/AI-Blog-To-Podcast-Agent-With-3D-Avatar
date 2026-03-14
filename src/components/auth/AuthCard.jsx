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
                'relative bg-white rounded-[2rem] border border-slate-200/80 shadow-xl shadow-slate-200/60 w-full max-w-md overflow-hidden',
                className
            )}
        >
            {/* Subtle teal top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0D9488] via-teal-300 to-[#0D9488] opacity-60" />

            {/* Soft inner ambient glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-teal-50/60 blur-[60px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-orange-50/40 blur-[60px] rounded-full pointer-events-none" />

            <div className="relative p-8 md:p-10 flex flex-col">
                {(title || subtitle) && (
                    <div className="mb-8 text-center">
                        {title && (
                            <h1 className="text-3xl font-black text-[#0F172A] mb-2 tracking-tight">
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p className="text-slate-500 text-sm font-medium">
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}
                {children}
            </div>
        </motion.div>
    );
};

export default AuthCard;
