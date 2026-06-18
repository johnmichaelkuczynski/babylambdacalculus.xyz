import { motion } from 'framer-motion';

export function Scene5() {
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center p-16 overflow-hidden"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <motion.div 
          className="w-[120%] h-auto"
          initial={{ rotate: -5, scale: 1.1, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <img 
            src={`${import.meta.env.BASE_URL}screens/assignments.jpg`}
            className="w-full h-full object-cover"
            style={{ filter: 'blur(8px)' }}
          />
        </motion.div>
      </div>
      
      <div className="absolute inset-0 bg-black/50 z-0" />

      <div className="relative z-10 w-full flex gap-12 items-center justify-center">
        <motion.div 
          className="w-[55%] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/20"
          initial={{ x: -60, rotateY: 20, opacity: 0 }}
          animate={{ x: 0, rotateY: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ perspective: 1000 }}
        >
          <img 
            src={`${import.meta.env.BASE_URL}screens/assignments.jpg`}
            className="w-full h-auto"
          />
        </motion.div>

        <motion.div 
          className="max-w-md"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            Practice First.<br/>Grade Later.
          </h2>
          <p className="text-xl text-white/70 leading-relaxed">
            Unlimited, never-graded practice versions to build confidence before you take the AI-graded assignments.
          </p>
          <div className="mt-8 flex gap-4">
            <div className="bg-[#10B981]/20 border border-[#10B981]/50 text-[#10B981] px-4 py-2 rounded-lg font-bold text-sm">Homework</div>
            <div className="bg-[#FBBF24]/20 border border-[#FBBF24]/50 text-[#FBBF24] px-4 py-2 rounded-lg font-bold text-sm">Unit Test</div>
            <div className="bg-[#E76E50]/20 border border-[#E76E50]/50 text-[#E76E50] px-4 py-2 rounded-lg font-bold text-sm">Final</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
