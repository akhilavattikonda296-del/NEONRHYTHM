import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  cover: string;
  color: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Pulse",
    artist: "Synthwave AI",
    cover: "https://picsum.photos/seed/neon1/400/400",
    color: "var(--color-neon-pink)"
  },
  {
    id: 2,
    title: "Cyber City Drift",
    artist: "Glitch Mob AI",
    cover: "https://picsum.photos/seed/neon2/400/400",
    color: "var(--color-neon-blue)"
  },
  {
    id: 3,
    title: "Midnight Data",
    artist: "Binary Beats",
    cover: "https://picsum.photos/seed/neon3/400/400",
    color: "var(--color-neon-green)"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const currentTrack = TRACKS[currentTrackIndex];
  
  // Ref to simulate progress
  const progressInterval = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = window.setInterval(() => {
        setProgress(p => (p + 0.5) % 100);
      }, 100);
    } else {
      if (progressInterval.current) clearInterval(progressInterval.current);
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentTrackIndex((i) => (i + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl rounded-3xl p-6 neon-border-pink relative overflow-hidden group">
      {/* Background Glow */}
      <div 
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-20 transition-colors duration-1000"
        style={{ backgroundColor: currentTrack.color }}
      />
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Cover Art */}
        <div className="relative w-full aspect-square mb-6 group-hover:scale-105 transition-transform duration-500">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentTrack.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          
          {/* Audio Visualizer Mock */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-center gap-1 h-12">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  height: isPlaying ? [10, 40, 20, 35, 10] : 4 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 0.8 + Math.random(),
                  delay: i * 0.1 
                }}
                className="w-1 rounded-full opacity-60"
                style={{ backgroundColor: currentTrack.color }}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="w-full text-center mb-6">
          <h3 className="text-xl font-bold text-white truncate">{currentTrack.title}</h3>
          <p className="text-sm text-white/50 uppercase tracking-widest">{currentTrack.artist}</p>
        </div>

        {/* Progress */}
        <div className="w-full mb-6">
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-300 ease-linear"
              style={{ 
                width: `${progress}%`,
                backgroundColor: currentTrack.color,
                boxShadow: `0 0 10px ${currentTrack.color}`
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-mono text-white/30 uppercase">
            <span>0:{Math.floor(progress * 0.6).toString().padStart(2, '0')}</span>
            <span>0:60</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between w-full px-4">
          <button onClick={handlePrev} className="text-white/60 hover:text-white hover:scale-110 transition-all">
            <SkipBack size={24} fill="currentColor" />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            style={{ 
              backgroundColor: isPlaying ? 'white' : 'transparent',
              border: '1px solid white',
              color: isPlaying ? 'black' : 'white'
            }}
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="translate-x-0.5" />}
          </button>

          <button onClick={handleNext} className="text-white/60 hover:text-white hover:scale-110 transition-all">
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>

        {/* Sub-controls */}
        <div className="flex justify-center gap-8 mt-6 text-white/30">
          <Volume2 size={16} className="cursor-pointer hover:text-white" />
          <Music2 size={16} className={`${isPlaying ? 'animate-bounce text-neon-pink' : ''}`} />
        </div>
      </div>
    </div>
  );
}
