import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene9() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 4, ease: "easeOut" }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}screens/landing.jpg`} 
          className="w-full h-full object-cover object-center blur-md"
        />
      </motion.div>

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={phase >= 1 ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        >
          <h1 className="text-[7vw] font-black text-white tracking-tighter leading-none mb-6">
            Baby Lambda<br />Calculus
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <p className="text-2xl text-white/80 font-medium tracking-wide">
            The curriculum, the tutor, and the grader.
          </p>
          <div className="inline-block px-6 py-2 rounded-full bg-[#E76E50]/20 border border-[#E76E50]/50 text-[#E76E50] text-xl font-bold">
            All in one room.
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
