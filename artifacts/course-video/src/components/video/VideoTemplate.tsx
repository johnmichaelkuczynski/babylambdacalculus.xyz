import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';
import { Scene7 } from './video_scenes/Scene7';
import { Scene8 } from './video_scenes/Scene8';
import { Scene9 } from './video_scenes/Scene9';

export const SCENE_DURATIONS = {
  landing: 5500,
  dashboard: 4500,
  lecture: 5000,
  practice: 4500,
  assignments: 4000,
  grades: 4000,
  analytics: 4500,
  diagnostics: 5000,
  outro: 4000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  landing: Scene1,
  dashboard: Scene2,
  lecture: Scene3,
  practice: Scene4,
  assignments: Scene5,
  grades: Scene6,
  analytics: Scene7,
  diagnostics: Scene8,
  outro: Scene9,
};

const SCENE_START_SEC: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  let cumulativeMs = 0;
  for (const [key, ms] of Object.entries(SCENE_DURATIONS)) {
    out[key] = cumulativeMs / 1000;
    cumulativeMs += ms;
  }
  return out;
})();

const AUDIO_SEEK_EPSILON_SEC = 0.18;

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  muted = false,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  muted?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentSceneKey, currentScene } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    const targetTime = SCENE_START_SEC[baseSceneKey] ?? 0;
    if (Math.abs(audio.currentTime - targetTime) > AUDIO_SEEK_EPSILON_SEC) {
      audio.currentTime = targetTime;
    }
    audio.play().catch(() => {});
  }, [currentSceneKey, baseSceneKey, muted]);

  return (
    <div
      className="w-full h-screen overflow-hidden relative"
      style={{ backgroundColor: '#050914' }}
    >
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-[#050914] via-[#0D1826] to-[#050914] opacity-80"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div 
          className="absolute w-[60vw] h-[60vw] rounded-full blur-[120px] bg-[#E76E50] opacity-[0.08]"
          animate={{ 
            x: currentScene % 2 === 0 ? '-10vw' : '40vw', 
            y: currentScene % 2 === 0 ? '10vh' : '40vh',
            scale: currentScene % 2 === 0 ? 1 : 1.2
          }}
          transition={{ duration: 6, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute w-[50vw] h-[50vw] rounded-full blur-[100px] bg-[#3B82F6] opacity-[0.05]"
          animate={{ 
            x: currentScene % 2 === 0 ? '50vw' : '0vw', 
            y: currentScene % 2 === 0 ? '50vh' : '10vh',
            scale: currentScene % 2 === 0 ? 1.2 : 1
          }}
          transition={{ duration: 7, ease: 'easeInOut' }}
        />
      </div>

      <AnimatePresence mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>

      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/bg_music.mp3`}
        preload="auto"
        autoPlay
        muted={muted}
      />
    </div>
  );
}