import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Zap, Radio } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-[#050505] overflow-hidden text-white font-sans">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neon-pink blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-blue blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-20 w-full pt-8 px-8 flex justify-between items-end border-b border-white/5 pb-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neon-pink/10 rounded-lg border border-neon-pink/30">
            <Activity className="text-neon-pink w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">
              Neon<span className="text-neon-pink">Rhythm</span>
            </h1>
            <p className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase">Phase_01 // Prototype</p>
          </div>
        </div>

        <div className="flex gap-12 font-mono">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-white/30 uppercase block">Terminal_ID</span>
            <span className="text-sm">#AIS-0422</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-neon-blue uppercase block">High_Record</span>
            <span className="text-sm neon-glow-blue">{highScore.toString().padStart(6, '0')}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full h-[calc(100vh-140px)] flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-24 px-8 py-4">
        
        {/* Left Side: Stats/Visuals (Desktop Only) */}
        <div className="hidden xl:flex flex-col gap-6 w-64">
           <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-3 text-neon-green">
                <Zap size={14} />
                <span className="text-xs font-mono uppercase tracking-widest">System Load</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: ['20%', '80%', '40%', '90%', '60%'] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="h-full bg-neon-green shadow-[0_0_10px_#39ff14]"
                />
              </div>
           </div>

           <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-3 text-neon-blue">
                <Radio size={14} />
                <span className="text-xs font-mono uppercase tracking-widest">Sync Quality</span>
              </div>
              <div className="flex gap-1 items-end h-8">
                {[...Array(20)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [10, 30, 15, 25, 10] }}
                    transition={{ duration: 0.5 + Math.random(), repeat: Infinity }}
                    className="w-1 bg-neon-blue/40 rounded-t-sm"
                  />
                ))}
              </div>
           </div>
        </div>

        {/* Center: Snake Game */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex-shrink-0"
        >
          <SnakeGame onScoreChange={handleScoreChange} />
        </motion.div>

        {/* Right Side: Music Player */}
        <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 0.6, delay: 0.3 }}
        >
          <MusicPlayer />
        </motion.div>

      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full py-4 px-8 flex justify-between items-center bg-black/40 backdrop-blur-md border-t border-white/5">
        <div className="text-[10px] font-mono text-white/30 uppercase flex gap-4">
          <span>Enc_RSA-2048</span>
          <span className="text-neon-pink">Status: Active</span>
        </div>
        <div className="text-[10px] font-mono text-white/30 uppercase animate-pulse">
           Control: [W][A][S][D] / [SPACE] to pause
        </div>
      </footer>
    </div>
  );
}
