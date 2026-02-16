import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({
    children,
    className,
    variant = 'primary',
    loading = false,
    icon: Icon,
    ...props
}) => {
    const variants = {
        primary: 'bg-teal-500 hover:bg-teal-400 text-slate-900 shadow-lg shadow-teal-500/20',
        secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10',
        outline: 'bg-transparent border border-teal-500/50 text-teal-400 hover:bg-teal-500/10',
        ghost: 'bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200',
    };

    return (
        <button
            className={twMerge(
                'relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]',
                variants[variant],
                className
            )}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                <>
                    {Icon && <Icon className="w-5 h-5" />}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
