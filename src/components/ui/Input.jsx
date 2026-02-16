import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = ({
    label,
    error,
    icon: Icon,
    className,
    ...props
}) => {
    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-400 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-500 transition-colors duration-300">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={twMerge(
                        'w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all duration-300 text-slate-200',
                        Icon && 'pl-10',
                        error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-xs text-red-400 mt-1 ml-1">{error}</p>
            )}
        </div>
    );
};

export default Input;
