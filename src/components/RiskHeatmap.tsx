import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
interface Point {
  id: string;
  x: number;
  y: number;
  level: 'safe' | 'warning' | 'danger' | 'hub';
}
export function RiskHeatmap() {
  const [points, setPoints] = useState<Point[]>([]);
  const [isDiversion, setIsDiversion] = useState(false);
  useEffect(() => {
    const generated: Point[] = Array.from({ length: 15 }).map((_, i) => ({
      id: `p-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      level: Math.random() > 0.8 ? 'danger' : Math.random() > 0.5 ? 'warning' : 'safe'
    }));
    // Add static Safe Hubs
    generated.push({ id: 'hub-1', x: 20, y: 30, level: 'hub' });
    generated.push({ id: 'hub-2', x: 80, y: 70, level: 'hub' });
    setPoints(generated);
    const interval = setInterval(() => {
      setIsDiversion(prev => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative aspect-square w-full max-w-md mx-auto rounded-3xl border border-white/10 bg-slate-900 overflow-hidden shadow-2xl">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20"
           style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      {/* Simulated Route Line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
        <motion.path
          d="M 20 180 Q 200 100 380 320"
          stroke="rgba(245, 158, 11, 0.5)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="8 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </svg>
      {/* Sweep Animation */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-full h-[2px] bg-amber-500/20 origin-left"
        style={{ transformOrigin: '0% 50%' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      {/* Center Marker */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="h-4 w-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse" />
      </div>
      {/* Threat Points & Hubs */}
      <AnimatePresence>
        {points.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.8, scale: 1 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            {p.level === 'hub' ? (
              <div className="relative">
                <Target className="h-5 w-5 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <div className="absolute -top-1 -right-1 h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
              </div>
            ) : (
              <div className={cn(
                "h-3 w-3 rounded-full blur-[2px]",
                p.level === 'danger' && "bg-red-500 shadow-[0_0_10px_#ef4444]",
                p.level === 'warning' && "bg-amber-500 shadow-[0_0_10px_#f59e0b]",
                p.level === 'safe' && "bg-emerald-500/40"
              )} />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      {/* Overlay UI */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Anomalies
          </div>
          <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
            <Target className="h-3 w-3 text-emerald-500" />
            Sentinel Hubs
          </div>
        </div>
        <motion.div 
          animate={{ scale: isDiversion ? 1.05 : 1 }}
          className={cn(
            "text-[9px] font-black px-2 py-0.5 rounded border flex items-center gap-1.5 transition-colors",
            isDiversion 
              ? "text-red-500 bg-red-500/10 border-red-500/30" 
              : "text-amber-500 bg-amber-500/10 border-amber-500/20"
          )}
        >
          {isDiversion && <Zap className="h-3 w-3 animate-pulse" />}
          {isDiversion ? "DIVERSION RECOMMENDED" : "RMP ANALYSIS ACTIVE"}
        </motion.div>
      </div>
    </div>
  );
}