import React, { useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
interface PanicButtonProps {
  onTrigger: () => void;
  className?: string;
}
export function PanicButton({ onTrigger, className }: PanicButtonProps) {
  const [isPressing, setIsPressing] = useState(false);
  const controls = useAnimation();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPress = () => {
    setIsPressing(true);
    controls.start({
      width: '100%',
      transition: { duration: 1.5, ease: "linear" }
    });
    timerRef.current = setTimeout(() => {
      onTrigger();
      setIsPressing(false);
    }, 1500);
  };
  const cancelPress = () => {
    setIsPressing(false);
    controls.set({ width: '0%' });
    if (timerRef.current) clearTimeout(timerRef.current);
  };
  return (
    <div className={cn("relative group", className)}>
      <button
        onMouseDown={startPress}
        onMouseUp={cancelPress}
        onMouseLeave={cancelPress}
        onTouchStart={startPress}
        onTouchEnd={cancelPress}
        className={cn(
          "relative flex flex-col items-center justify-center w-48 h-48 rounded-full border-4 border-red-500/30 transition-all duration-300",
          isPressing ? "bg-red-600 scale-95 shadow-[0_0_50px_rgba(239,68,68,0.6)]" : "bg-red-500/10 hover:bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
        )}
      >
        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-red-500 pointer-events-none" />
        <ShieldAlert className={cn("h-16 w-16 mb-2 transition-colors", isPressing ? "text-white" : "text-red-500")} />
        <span className={cn("text-xs font-black uppercase tracking-[0.2em]", isPressing ? "text-white" : "text-red-500")}>
          {isPressing ? "HOLDING..." : "PANIC"}
        </span>
        {/* Progress Bar Circle */}
        <div className="absolute bottom-6 w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={controls}
            className="h-full bg-white shadow-[0_0_10px_#fff]"
          />
        </div>
      </button>
      {!isPressing && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-4 text-[10px] text-red-400/60 font-bold uppercase tracking-widest"
        >
          Press and hold to deploy emergency response
        </motion.p>
      )}
    </div>
  );
}