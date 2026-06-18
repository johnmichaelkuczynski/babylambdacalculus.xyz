import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Scene8() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center p-12 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 z-0">
        <motion.img 
          src={`${import.meta.env.BASE_URL}screens/diagnostics.jpg`}
          className="w-full h-full object-cover opacity-20"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 6, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-[#0B131E]/80 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-white tracking-tight mb-4">Unprecedented Insight</h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            One-click operator diagnostics and synthetic students to verify the grader's accuracy.
          </p>
        </motion.div>

        <div className="flex gap-8 items-center justify-center">
          <motion.div 
            className="w-1/2 rounded-xl overflow-hidden shadow-2xl border border-white/20"
            initial={{ rotateY: -15, x: -30, opacity: 0 }}
            animate={{ rotateY: 0, x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: 1000 }}
          >
            <img 
              src={`${import.meta.env.BASE_URL}screens/diagnostics.jpg`}
              className="w-full h-auto"
            />
          </motion.div>

          <AnimatePresence>
            {phase >= 1 && (
              <motion.div 
                className="w-1/2 rounded-xl overflow-hidden shadow-2xl border border-[#10B981]/50 relative"
                initial={{ rotateY: 15, x: 30, opacity: 0 }}
                animate={{ rotateY: 0, x: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{ perspective: 1000 }}
              >
                <div className="absolute inset-0 bg-[#10B981]/10 mix-blend-overlay pointer-events-none" />
                <img 
                  src={`${import.meta.env.BASE_URL}screens/reasoning.jpg`}
                  className="w-full h-auto"
                />
                
                <motion.div 
                  className="absolute bottom-6 right-6 bg-[#10B981] text-white px-4 py-2 rounded-lg font-bold shadow-lg"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.2, type: 'spring', damping: 15 }}
                >
                  Two-Layer AI Detection
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
