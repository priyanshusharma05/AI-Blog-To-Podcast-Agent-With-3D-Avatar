import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic } from 'lucide-react';
import Button from './Button';

const AboutModal = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="relative w-full max-w-lg bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-teal-900/20 z-10"
                    >
                        {/* Header Image/Gradient */}
                        <div className="h-32 bg-gradient-to-br from-teal-500 to-emerald-600 relative overflow-hidden flex items-center justify-center">
                            {/* Abstract Shapes */}
                            <div className="absolute top-0 right-0 p-8 opacity-20">
                                <Mic size={120} className="text-white" />
                            </div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 text-white z-10 shadow-xl"
                            >
                                <Mic size={32} />
                            </motion.div>

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all hover:rotate-90"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="p-8 md:p-10">
                            <div className="mb-8 text-center">
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">VoiceCast AI</h3>
                                <p className="text-slate-500 font-medium">The narrative layer for the modern web.</p>
                            </div>

                            <div className="space-y-6 text-slate-600 text-sm font-medium leading-relaxed">
                                <p>
                                    VoiceCast was created to bridge the gap between written content and immersive audio-visual experiences.
                                    By leveraging state-of-the-art AI, we enable creators to effortlessly turn long-form articles into dynamic,
                                    conversational podcast episodes featuring realistic 3D avatars.
                                </p>
                                <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl">
                                    <p className="font-bold text-teal-900 mb-1">Built by</p>
                                    <p className="text-teal-700 text-base">Mohammad Afzal Malik</p>
                                    <p className="text-teal-600/80 text-xs mt-1">Creator & Lead Developer</p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <Button
                                    onClick={onClose}
                                    variant="primary"
                                    className="w-full justify-center bg-slate-900 text-white py-4 rounded-xl"
                                >
                                    Close Window
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AboutModal;
