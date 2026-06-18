import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene7() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center p-16"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-full h-full flex flex-col justify-center relative">
        <motion.div 
          className="absolute top-10 left-10 max-w-md z-20"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h2 className="text-5xl font-black text-white tracking-tight mb-4 leading-tight">Live<br/>Analytics</h2>
          <p className="text-xl text-white/70 leading-relaxed">
            Monitor course-wide KPIs, per-topic mastery tables, and recent activity in real time.
          </p>
        </motion.div>

        <motion.div 
          className="w-[85%] self-end relative rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 ml-auto mt-20"
          initial={{ x: 50, opacity: 0 }}
          animate={phase >= 1 ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 80 }}
        >
          <img 
            src={`${import.meta.env.BASE_URL}screens/analytics.jpg`}
            className="w-full h-auto"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
