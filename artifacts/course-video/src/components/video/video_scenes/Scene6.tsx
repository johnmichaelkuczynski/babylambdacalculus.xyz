import { motion } from 'framer-motion';

export function Scene6() {
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center p-16"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-full h-full flex flex-col justify-center relative z-10">
        <motion.div 
          className="w-[75%] mx-auto relative rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <img 
            src={`${import.meta.env.BASE_URL}screens/grades.jpg`}
            className="w-full h-auto"
          />
        </motion.div>

        <motion.div 
          className="absolute -bottom-10 right-20 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl max-w-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="text-6xl font-black text-[#10B981] mb-2 font-mono">100%</div>
          <h3 className="text-2xl font-bold text-white mb-2">AI-Graded Feedback</h3>
          <p className="text-white/70">
            Every submission gets detailed, written rationale from the AI grader.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
