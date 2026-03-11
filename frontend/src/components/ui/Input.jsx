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
                <label className="block text-sm font-bold text-[#0F172A] ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0D9488] transition-colors duration-300">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={twMerge(
                        'w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#0D9488]/60 focus:ring-4 focus:ring-teal-500/10 transition-all duration-300',
                        'hover:border-slate-300',
                        Icon && 'pl-11',
                        error && 'border-red-400 focus:border-red-400 focus:ring-red-500/10',
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>
            )}
        </div>
    );
};

export default Input;

