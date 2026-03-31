import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, PlusCircle, AudioLines, Settings, LogOut,
    Mic, ChevronRight, Bell, BarChart3, Sun, Moon, Menu, X,
    Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward,
    ThumbsUp, ThumbsDown, Share2, Bookmark, MoreHorizontal,
    Send, MessageCircle, Clock, Eye, ArrowLeft, Headphones, 
    Sparkles, Info, ListMusic
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

/* ─── Sidebar link (shared style) ───────────────── */
const SideLink = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 group
        ${active
                ? 'bg-[#0D9488] text-white shadow-lg shadow-teal-200/50'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
            }`}
    >
        <Icon size={18} className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} />
        {label}
    </button>
);

/* ─── Chat Message Bubble ─────────────────────────── */
const ChatBubble = ({ message, isOwn }) => (
    <motion.div
        initial={{ opacity: 0, x: isOwn ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
    >
        <div className={`max-w-[85%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black ${isOwn
                        ? 'bg-[#0D9488] text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}>
                    {message.avatar}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{message.user}</span>
                <span className="text-[9px] text-slate-300 dark:text-slate-600 font-bold">{message.time}</span>
            </div>
            <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${isOwn
                    ? 'bg-[#0D9488] text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 border border-slate-100 dark:border-slate-700/50 rounded-tl-none'
                }`}>
                {message.text}
            </div>
        </div>
    </motion.div>
);

/* ─── WebGL-style Animated Waveform ────────────────── */
const AnimatedWaveform = ({ isPlaying }) => {
    return (
        <div className="flex items-center justify-center gap-1 h-20 w-full px-10">
            {Array.from({ length: 48 }).map((_, i) => {
                const height = 20 + Math.random() * 80;
                return (
                    <motion.div
                        key={i}
                        animate={isPlaying 
                            ? { height: [`${height * 0.4}%`, `${height}%`, `${height * 0.4}%`] } 
                            : { height: '10%' }
                        }
                        transition={{ 
                            duration: 0.6 + (i % 5) * 0.2, 
                            repeat: Infinity, 
                            ease: 'easeInOut',
                            delay: i * 0.02
                        }}
                        className={`w-1 rounded-full ${i % 2 === 0 ? 'bg-teal-500' : 'bg-teal-300'} opacity-60`}
                    />
                );
            })}
        </div>
    );
};

const VideoPlayer = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const chatEndRef = useRef(null);
    const playerRef = useRef(null);
    const utteranceRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
    const [chatOpen, setChatOpen] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Player states
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(80);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    // Episode data
    const [episode, setEpisode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Chat state
    const [chatMessages, setChatMessages] = useState([
        { id: 1, user: 'System', avatar: '🎙️', text: 'Welcome to the Live Experience! Ask the AI anything about this episode.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isOwn: false },
    ]);
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isChatLoading, setIsChatLoading] = useState(false);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('vc_theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('vc_theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    const getUserSafely = () => {
        try {
            const stored = localStorage.getItem('vc_user');
            if (stored && stored !== 'undefined' && stored !== 'null') return JSON.parse(stored);
        } catch (err) {}
        return { name: 'Guest', email: '' };
    };

    const user = getUserSafely();
    const userName = user.name || 'Guest';
    const initials = userName.split(' ').map(w => w ? w[0] : '').join('').toUpperCase().slice(0, 2);

    useEffect(() => {
        const fetchEpisode = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/episodes/');
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                const data = await res.json();
                const ep = (Array.isArray(data) ? data : []).find(e => String(e.id) === String(id));
                if (ep) setEpisode(ep);
                else setError('Episode not found.');
            } catch (err) {
                setError('Could not load episode. Is the backend running?');
            } finally {
                setLoading(false);
            }
        };
        fetchEpisode();
    }, [id]);

    // ── TTS: Load available voices ──────────────────────────────────────────
    const [ttsVoice, setTtsVoice] = useState(null);
    const ttsQueueRef = useRef([]);     // queue of utterance texts
    const ttsIndexRef = useRef(0);      // current position in the queue
    const ttsActiveRef = useRef(false); // whether we are in a play session

    useEffect(() => {
        const synth = window.speechSynthesis;
        const pickVoice = () => {
            const voices = synth.getVoices();
            if (!voices.length) return;
            const preferred =
                voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('google')) ||
                voices.find(v => v.lang.startsWith('en') && !v.localService) ||
                voices.find(v => v.lang.startsWith('en')) ||
                voices[0];
            setTtsVoice(preferred);
        };
        pickVoice();
        synth.addEventListener('voiceschanged', pickVoice);
        return () => synth.removeEventListener('voiceschanged', pickVoice);
    }, []);

    // ── TTS: Split script into speakable chunks ──────────────────────────────
    const buildTtsQueue = (text) => {
        if (!text) return [];
        // Split on sentence-ending punctuation followed by whitespace
        const sentences = text.match(/[^.!?]+[.!?]+[\s]*/g) || [text];
        // Group sentences into chunks of ~300 chars so the queue isn't too long
        const chunks = [];
        let current = '';
        for (const s of sentences) {
            if (current.length + s.length > 300 && current.length > 0) {
                chunks.push(current.trim());
                current = s;
            } else {
                current += s;
            }
        }
        if (current.trim()) chunks.push(current.trim());
        return chunks;
    };

    // ── TTS: Speak the next chunk in the queue ───────────────────────────────
    const speakNext = () => {
        const synth = window.speechSynthesis;
        if (!ttsActiveRef.current) return;
        if (ttsIndexRef.current >= ttsQueueRef.current.length) {
            // finished all chunks
            ttsActiveRef.current = false;
            setIsPlaying(false);
            setProgress(100);
            return;
        }

        const text = ttsQueueRef.current[ttsIndexRef.current];
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 1;
        utt.pitch = 1;
        utt.volume = isMuted ? 0 : volume / 100;
        if (ttsVoice) utt.voice = ttsVoice;

        utt.onend = () => {
            ttsIndexRef.current += 1;
            speakNext();
        };
        utt.onerror = (e) => {
            if (e.error !== 'interrupted' && e.error !== 'canceled') {
                console.warn('TTS error:', e.error);
                ttsIndexRef.current += 1;
                speakNext();
            }
        };

        utteranceRef.current = utt;
        synth.speak(utt);
    };

    // ── TTS: Play / Pause / Resume ───────────────────────────────────────────
    useEffect(() => {
        if (!episode?.script) return;
        const synth = window.speechSynthesis;

        if (isPlaying) {
            if (synth.paused) {
                synth.resume();
            } else if (!synth.speaking) {
                // Start fresh
                synth.cancel();
                ttsQueueRef.current = buildTtsQueue(episode.script);
                ttsIndexRef.current = 0;
                ttsActiveRef.current = true;
                speakNext();
            }
        } else {
            if (synth.speaking && !synth.paused) {
                synth.pause();
            }
        }
    }, [isPlaying]);

    // ── TTS: cleanup on unmount ──────────────────────────────────────────────
    useEffect(() => {
        return () => {
            ttsActiveRef.current = false;
            window.speechSynthesis.cancel();
        };
    }, []);

    // ── Fake progress timer while playing ─────────────────────────────────
    useEffect(() => {
        let interval;
        if (isPlaying && episode) {
            interval = setInterval(() => {
                setProgress(prev => (prev >= 100 ? 100 : prev + 0.1));
                setCurrentTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, episode]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // ── Chat: send message to /api/chat/ backend ─────────────────────────
    const handleSendMessage = async () => {
        if (!chatInput.trim() || isChatLoading) return;
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMsg = chatInput.trim();

        setChatMessages(prev => [...prev, {
            id: Date.now(),
            user: userName,
            avatar: initials,
            text: userMsg,
            time: timeStr,
            isOwn: true,
        }]);
        setChatInput('');
        setIsChatLoading(true);

        try {
            const res = await fetch('/api/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    episode_id: id || null,
                    history: chatHistory.map(h => ({ role: h.role, content: h.content })),
                }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.detail || `Server error: ${res.status}`);
            }

            const data = await res.json();

            setChatMessages(prev => [...prev, {
                id: Date.now() + 1,
                user: 'AI Narrator',
                avatar: '🤖',
                text: data.reply,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOwn: false,
            }]);

            setChatHistory(data.history || []);
        } catch (err) {
            setChatMessages(prev => [...prev, {
                id: Date.now() + 1,
                user: 'System',
                avatar: '⚠️',
                text: `Error: ${err.message}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOwn: false,
            }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const totalDuration = episode ? (parseInt(episode.duration) || 5) * 60 : 300;

    const toggleFullscreen = () => {
        if (!playerRef.current) return;
        if (!document.fullscreenElement) {
            playerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return (
        <div className="min-h-screen bg-[#FDFDFE] dark:bg-[#08090A] flex font-sans transition-colors duration-500 overflow-x-hidden">

            {/* ─── SIDEBAR ─── */}
            <aside className="w-64 shrink-0 hidden lg:flex flex-col bg-white dark:bg-[#0D0F11] border-r border-slate-100 dark:border-white/5 min-h-screen fixed left-0 top-0 bottom-0 z-40 px-5 py-8">
                <Link to="/" className="flex items-center gap-3 px-2 mb-10 group">
                    <div className="w-10 h-10 bg-[#0D9488] rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/20">
                        <Mic size={20} className="text-white" />
                    </div>
                    <div>
                        <span className="text-lg font-black tracking-tighter text-slate-800 dark:text-white uppercase">
                            Voice<span className="text-[#0D9488]">Cast</span>
                        </span>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-1">Narrator AI</p>
                    </div>
                </Link>
                <nav className="flex flex-col gap-1.5 flex-1">
                    <SideLink icon={LayoutDashboard} label="Dashboard" active={false} onClick={() => navigate('/dashboard')} />
                    <SideLink icon={PlusCircle} label="Create Episode" active={false} onClick={() => navigate('/create-episode')} />
                    <SideLink icon={AudioLines} label="My Episodes" active={true} onClick={() => navigate('/episodes')} />
                    <SideLink icon={BarChart3} label="Analytics" active={false} onClick={() => navigate('/analytics')} />
                    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col gap-1.5">
                        <SideLink icon={Settings} label="Settings" active={false} onClick={() => navigate('/settings')} />
                        <SideLink icon={LogOut} label="Logout" active={false} onClick={() => { localStorage.removeItem('vc_user'); navigate('/'); }} />
                    </div>
                </nav>
            </aside>

            {/* ─── MAIN CONTAINER ─── */}
            <main className="flex-1 lg:ml-64 flex flex-col min-w-0">
                
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/70 dark:bg-[#08090A]/70 backdrop-blur-2xl border-b border-slate-100 dark:border-white/5 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/episodes')} className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-[#0D9488] transition-all">
                            <ArrowLeft size={18} />
                        </button>
                        <div className="hidden md:block">
                            <h1 className="text-sm font-black text-slate-800 dark:text-white tracking-tight truncate max-w-[400px]">
                                {episode ? episode.title : 'Loading Episode...'}
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setChatOpen(!chatOpen)} 
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${chatOpen 
                                ? 'bg-teal-50 dark:bg-teal-500/10 text-[#0D9488]' 
                                : 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}
                            title={chatOpen ? "Close Chat" : "Open Chat"}
                        >
                            <MessageCircle size={18} />
                        </button>
                        <button onClick={toggleTheme} className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0D9488] to-teal-300 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-teal-500/20">
                            {initials}
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className={`flex-1 flex flex-col xl:flex-row items-start overflow-hidden p-6 gap-6 ${isFullscreen ? 'p-0' : ''}`}>
                    
                    {/* LEFT: Video Player + Info */}
                    <div className={`flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar ${isFullscreen ? 'pr-0' : ''}`}>
                        
                        {/* Cinema Player */}
                        <section className={`relative group transition-all duration-500 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-0' : 'rounded-[32px]'}`} ref={playerRef}>
                            <div className={`relative bg-[#000] overflow-hidden transition-all duration-500 ${isFullscreen ? 'w-full h-full' : 'aspect-video rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/5'}`}>
                                {/* Ambient Glow */}
                                <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent pointer-events-none" />
                                
                                {/* Animated Visual Content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
                                    <motion.div 
                                        animate={isPlaying ? { 
                                            scale: [1, 1.05, 1],
                                            rotate: [0, 2, -2, 0]
                                        } : {}}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="relative"
                                    >
                                        <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-[#0D9488] to-teal-400 p-[2px] shadow-[0_0_50px_rgba(13,148,136,0.3)]">
                                            <div className="w-full h-full bg-[#0D0F11] rounded-[38px] flex items-center justify-center">
                                                <Mic size={48} className="text-[#0D9488] group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                        </div>
                                        {isPlaying && (
                                            <motion.div 
                                                initial={{ scale: 1, opacity: 0.5 }}
                                                animate={{ scale: 1.8, opacity: 0 }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute inset-0 border-2 border-teal-500/30 rounded-[40px]"
                                            />
                                        )}
                                    </motion.div>

                                    <AnimatedWaveform isPlaying={isPlaying} />

                                    <div className="text-center px-10">
                                        <h3 className="text-white text-xl font-black tracking-tight mb-2 opacity-90">{episode?.title}</h3>
                                        <p className="text-teal-500/60 text-xs font-black uppercase tracking-[0.2em]">VoiceCast AI Premium Narrative</p>
                                    </div>
                                </div>

                                {/* Modern Controls Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-8 pt-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    {/* Progress Bar */}
                                    <div className="mb-6 group/progress">
                                        <div className="h-1.5 w-full bg-white/10 rounded-full cursor-pointer relative overflow-hidden group-hover/progress:h-2 transition-all"
                                            onClick={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                const pct = ((e.clientX - rect.left) / rect.width) * 100;
                                                setProgress(pct);
                                                setCurrentTime(Math.floor((pct/100) * totalDuration));
                                            }}
                                        >
                                            <motion.div 
                                                className="absolute inset-y-0 left-0 bg-[#0D9488] shadow-[0_0_15px_rgba(13,148,136,0.8)]" 
                                                style={{ width: `${progress}%` }} 
                                            />
                                        </div>
                                        <div className="flex justify-between mt-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
                                            <span>{formatTime(currentTime)}</span>
                                            <span>{formatTime(totalDuration)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <button onClick={() => { setProgress(Math.max(0, progress-5)); setCurrentTime(Math.max(0, currentTime-10)); }} className="text-white/50 hover:text-white transition-colors">
                                                <SkipBack size={24} />
                                            </button>
                                            <motion.button 
                                                whileHover={{ scale: 1.15 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setIsPlaying(!isPlaying)}
                                                className="w-14 h-14 rounded-2xl bg-[#0D9488] text-white flex items-center justify-center shadow-2xl shadow-teal-500/40"
                                            >
                                                {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                                            </motion.button>
                                            <button onClick={() => { setProgress(Math.min(100, progress+5)); setCurrentTime(Math.min(totalDuration, currentTime+10)); }} className="text-white/50 hover:text-white transition-colors">
                                                <SkipForward size={24} />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-5">
                                            <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-2 border border-white/5">
                                                <button onClick={() => setIsMuted(!isMuted)} className="text-white/70">
                                                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                                </button>
                                                <input 
                                                    type="range" 
                                                    value={isMuted ? 0 : volume} 
                                                    onChange={(e) => setVolume(Number(e.target.value))} 
                                                    className="w-16 accent-[#0D9488] opacity-50 hover:opacity-100 transition-opacity" 
                                                />
                                            </div>
                                            <button onClick={toggleFullscreen} className="text-white/50 hover:text-white transition-colors">
                                                <Maximize size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Info Section */}
                        <section className="space-y-6">
                            <div className="bg-white dark:bg-[#0D0F11] rounded-[32px] p-8 border border-slate-100 dark:border-white/5 shadow-sm">
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{episode?.title}</h2>
                                    
                                    <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                                        <h4 className="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest mb-4">
                                            <Info size={14} className="text-[#0D9488]" /> Description
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                            {episode?.desc ? (
                                                <div className="relative">
                                                    <div className={`text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium ${!isExpanded ? 'line-clamp-2' : ''}`}>
                                                        {episode.desc}
                                                        {isExpanded && episode.script && (
                                                            <div className="mt-4 whitespace-pre-wrap">
                                                                {episode.script}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {(episode.desc.length > 120 || episode.script) && (
                                                        <button 
                                                            onClick={() => setIsExpanded(!isExpanded)}
                                                            className="mt-3 text-sm font-black text-slate-800 dark:text-white hover:text-[#0D9488] transition-colors focus:outline-none flex items-center gap-1 group"
                                                        >
                                                            {isExpanded ? 'Show Less' : '...more'}
                                                            <ChevronRight size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                "Exploring the intricate details of the blog post and transforming core concepts into an engaging narrative experience. Relax and enjoy the deep dive into this topic."
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT: Live Chat Section */}
                    {chatOpen && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`xl:w-[400px] w-full flex flex-col bg-white dark:bg-[#0D0F11] rounded-[32px] border border-slate-100 dark:border-white/5 shadow-xl overflow-hidden transition-all duration-500 sticky top-0 ${isFullscreen ? 'z-50 h-full' : 'max-h-[calc(100vh-120px)] self-start'}`}
                        >
                            {/* Chat Header */}
                            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-gradient-to-b from-teal-50/20 to-transparent dark:from-teal-500/5">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0D9488] to-teal-300 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                                            <MessageCircle size={18} />
                                        </div>
                                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#0D0F11] rounded-full" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-800 dark:text-white leading-none">Live Discussion</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">24 Active Listeners</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setChatOpen(false)}
                                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-rose-500 transition-all hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Messages List */}
                                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar space-y-2">
                                    <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 mb-6 border border-slate-100 dark:border-white/5">
                                        <p className="text-[10px] font-black text-[#0D9488] uppercase tracking-[0.2em] mb-1">Community Guidelines</p>
                                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Join the live discussion! Keep it friendly and respectful as we explore this episode together.</p>
                                    </div>
                                    
                                    {chatMessages.map(msg => (
                                        <ChatBubble key={msg.id} message={msg} isOwn={msg.isOwn} />
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Message Input */}
                                <div className="p-6 bg-slate-50/50 dark:bg-white/2 border-t border-slate-100 dark:border-white/5">
                                    <div className="relative">
                                        <textarea 
                                            rows={1}
                                            placeholder="Write a message..."
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                                            className="w-full bg-white dark:bg-[#08090A] border border-slate-200 dark:border-white/10 rounded-[20px] pl-5 pr-14 py-3.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0D9488] focus:ring-4 focus:ring-teal-500/10 transition-all resize-none shadow-sm"
                                        />
                                        <button 
                                            onClick={handleSendMessage}
                                            disabled={!chatInput.trim() || isChatLoading}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl bg-[#0D9488] text-white flex items-center justify-center shadow-lg shadow-teal-500/20 hover:bg-teal-600 disabled:opacity-30 disabled:shadow-none transition-all"
                                        >
                                            {isChatLoading ? (
                                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                                    <Sparkles size={18} />
                                                </motion.div>
                                            ) : (
                                                <Send size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </main>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #0D9488; }
            `}} />
        </div>
    );
};

export default VideoPlayer;
