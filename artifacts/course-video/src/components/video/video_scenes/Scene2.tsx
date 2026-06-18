import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene2() {
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center p-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="w-full h-[85%] relative rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-white/10 bg-[#0B131E]"
        initial={{ y: 40, rotateX: 10, scale: 0.95 }}
        animate={{ y: 0, rotateX: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: 1200 }}
      >
        <motion.img 
          src={`${import.meta.env.BASE_URL}screens/dashboard.jpg`}
          className="w-full h-auto origin-top"
          initial={{ y: 0 }}
          animate={{ y: "-15%" }}
          transition={{ duration: 5, ease: "linear" }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </motion.div>

      <motion.div 
        className="absolute bottom-24 left-32 bg-[#1A2B3D]/80 backdrop-blur-xl border border-white/20 p-8 rounded-2xl max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        initial={{ opacity: 0, x: -40, filter: 'blur(10px)' }}
        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-10 h-10 rounded-full bg-[#E76E50] mb-4 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Student Dashboard</h2>
        <p className="text-lg text-white/70 leading-relaxed">
          Track KPIs, view course schedules, and jump into optional diagnostic warm-ups.
        </p>
      </motion.div>
    </motion.div>
  );
}
