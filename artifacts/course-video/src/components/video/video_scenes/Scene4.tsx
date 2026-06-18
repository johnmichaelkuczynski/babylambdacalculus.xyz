import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center p-16"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-full h-full flex flex-col items-center justify-center relative">
        <motion.div 
          className="w-[85%] h-[85%] relative rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 bg-[#111]"
          initial={{ y: 40 }}
          animate={{ y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img 
            src={`${import.meta.env.BASE_URL}screens/practice.jpg`}
            className="w-full h-auto origin-top"
            initial={{ scale: 1.05, y: 0 }}
            animate={{ scale: 1, y: "-15%" }}
            transition={{ duration: 5, ease: "easeOut" }}
          />
        </motion.div>

        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1A2B3D]/95 backdrop-blur-xl border border-white/20 p-10 rounded-2xl text-center shadow-2xl w-max"
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          animate={phase >= 1 ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-[#E76E50]/20 flex items-center justify-center border border-[#E76E50]/50 mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E76E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Adaptive Practice</h2>
          <p className="text-xl text-white/70 max-w-sm mx-auto leading-relaxed">
            Starts at easy, but the difficulty adapts as you go. Master each topic progressively.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
