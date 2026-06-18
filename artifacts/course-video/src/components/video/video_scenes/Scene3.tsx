import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1200),
      setTimeout(() => setPhase(2), 2800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center p-12 overflow-hidden"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        className="w-[110%] h-[110%] absolute z-0"
        initial={{ scale: 1 }}
        animate={{ scale: 1.1, x: "-5%" }}
        transition={{ duration: 6, ease: "easeOut" }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}screens/lecture.jpg`}
          className="w-full h-full object-cover object-left-top opacity-50"
          style={{ filter: 'contrast(1.1) brightness(0.8)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl flex flex-col justify-center h-full">
        <motion.div
          className="max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-white font-bold text-sm tracking-wider uppercase mb-4">
            Interactive Lectures
          </div>
          <h2 className="text-[4vw] font-black text-white leading-[1.1] mb-6 tracking-tight">
            Three-Depth<br />Lessons
          </h2>
          <p className="text-xl text-white/70 leading-relaxed mb-8">
            Toggle between Short, Medium, and Long explanations on the fly. 8 plain-language topics to master.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4 mt-4">
          <motion.div 
            className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-xl w-max shadow-2xl"
            initial={{ opacity: 0, x: -30 }}
            animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <div>
              <div className="text-sm font-bold text-white/50 uppercase tracking-widest">Built-in</div>
              <div className="text-white font-semibold text-lg">Streaming section-scoped AI Tutor</div>
            </div>
          </motion.div>

          <motion.div 
            className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-xl w-max shadow-2xl"
            initial={{ opacity: 0, x: -30 }}
            animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            </div>
            <div>
              <div className="text-sm font-bold text-white/50 uppercase tracking-widest">Tools</div>
              <div className="text-white font-semibold text-lg">Specialized math keyboard</div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
