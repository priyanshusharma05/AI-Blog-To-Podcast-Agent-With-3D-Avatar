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
                'glass rounded-2xl p-8 w-full max-w-md glow-purple relative overflow-hidden',
                className
            )}
        >
            {/* Decorative Blur Object */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/20 blur-[80px] rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/20 blur-[80px] rounded-full" />

            <div className="relative z-10">
                {(title || subtitle) && (
                    <div className="mb-8 text-center">
                        {title && (
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p className="text-slate-400 text-sm">
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
