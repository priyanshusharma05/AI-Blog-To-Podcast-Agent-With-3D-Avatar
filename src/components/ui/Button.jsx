import React from 'react';
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
        primary: 'bg-[#0D9488] hover:bg-[#0F172A] text-white shadow-lg shadow-teal-900/20',
        secondary: 'bg-white hover:bg-slate-50 text-[#0F172A] border border-slate-200 hover:border-slate-300 shadow-sm',
        outline: 'bg-transparent border border-[#0D9488]/60 text-[#0D9488] hover:bg-teal-50',
        ghost: 'bg-transparent hover:bg-slate-100 text-slate-500 hover:text-[#0F172A]',
    };

    return (
        <button
            className={twMerge(
                'relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
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
