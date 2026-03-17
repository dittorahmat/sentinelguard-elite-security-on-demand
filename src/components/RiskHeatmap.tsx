import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
interface Point {
  id: string;
  x: number;
  y: number;
  level: 'safe' | 'warning' | 'danger';
}
export function RiskHeatmap() {
  const [points, setPoints] = useState<Point[]>([]);
  useEffect(() => {
    const generated: Point[] = Array.from({ length: 15 }).map((_, i) => ({
      id: `p-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      level: Math.random() > 0.7 ? 'danger' : Math.random() > 0.4 ? 'warning' : 'safe'
    }));
    setPoints(generated);
  }, []);
  return (
    <div className="relative aspect-square w-full max-w-md mx-auto rounded-2xl border border-white/10 bg-slate-900 overflow-hidden shadow-2xl">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      {/* Sweep Animation */}
      <motion.div 
        className="absolute top-1/2 left-1/2 w-full h-[2px] bg-amber-500/40 origin-left"
        style={{ transformOrigin: '0% 50%' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      {/* Center Marker */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="h-4 w-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse" />
      </div>
      {/* Threat Points */}
      <AnimatePresence>
        {points.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.8, scale: 1 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <div className={cn(
              "h-3 w-3 rounded-full blur-[2px]",
              p.level === 'danger' && "bg-red-500 shadow-[0_0_10px_#ef4444]",
              p.level === 'warning' && "bg-amber-500 shadow-[0_0_10px_#f59e0b]",
              p.level === 'safe' && "bg-emerald-500 shadow-[0_0_10px_#10b981]"
            )} />
          </motion.div>
        ))}
      </AnimatePresence>
      {/* Overlay UI */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            Threats Detected
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            Safe Zones
          </div>
        </div>
        <div className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          RMP ANALYSIS ACTIVE
        </div>
      </div>
    </div>
  );
}