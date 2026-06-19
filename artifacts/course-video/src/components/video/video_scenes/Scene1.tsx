import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.22 }}
        transition={{ duration: 5, ease: "easeOut" }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}screens/landing.jpg`} 
          alt="Landing" 
          className="w-full h-full object-cover object-top blur-sm"
          style={{ maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0.1) 100%)', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0.1) 100%)' }}
        />
      </motion.div>

      {/* Contrast vignette so the hero wordmark reads cleanly over the screenshot */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(11,19,30,0.78) 0%, rgba(11,19,30,0.35) 55%, rgba(11,19,30,0) 100%)' }}
      />

      <div className="relative z-10 text-center px-12 mt-32">
        <motion.div
          className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#E76E50] font-bold text-sm tracking-widest uppercase mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          A New Kind of Course
        </motion.div>
        
        <motion.h1 
          className="text-[6.5vw] font-black text-white tracking-tighter leading-[0.9]"
          initial={{ y: 40, opacity: 0, filter: 'blur(10px)' }}
          animate={phase >= 1 ? { y: 0, opacity: 1, filter: 'blur(0px)' } : { y: 40, opacity: 0, filter: 'blur(10px)' }}
          transition={{ type: 'spring', damping: 24, stiffness: 100 }}
        >
          Basic Lambda<br />Calculus
        </motion.h1>
        
        <motion.p 
          className="text-[2.2vw] text-white/70 mt-8 max-w-4xl mx-auto font-medium"
          initial={{ y: 20, opacity: 0 }}
          animate={phase >= 2 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          The tiny language of functions behind all of computing.<br />
          <span className="text-white/90">Taught, tutored, and graded entirely by AI.</span>
        </motion.p>
      </div>
    </motion.div>
  );
}
