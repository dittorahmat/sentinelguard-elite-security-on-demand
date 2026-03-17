import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, PhoneCall, Home, Info, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface SOPOverlayProps {
  onAcknowledge: () => void;
}
export function SOPOverlay({ onAcknowledge }: SOPOverlayProps) {
  const sopSteps = [
    { icon: Home, text: "Remain inside secure vehicle or safe zone" },
    { icon: Info, text: "Avoid primary exits; await tactical clearance" },
    { icon: PhoneCall, text: "Maintain open uplink with Command Center" },
  ];
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-red-950/40 backdrop-blur-xl border-8 border-red-600/20 animate-pulse">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-lg w-full bg-slate-950 border-2 border-red-500 shadow-[0_0_100px_rgba(239,68,68,0.4)] rounded-3xl overflow-hidden"
      >
        <div className="bg-red-600 p-6 flex items-center gap-4">
          <ShieldAlert className="h-10 w-10 text-white animate-bounce" />
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Emergency Protocol</h2>
            <p className="text-red-100 text-xs font-bold uppercase tracking-widest">Code Red Intervention Active</p>
          </div>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            {sopSteps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="text-slate-200 font-bold text-sm uppercase tracking-tight">{step.text}</span>
              </motion.div>
            ))}
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Estimated Tactical Arrival</p>
            <p className="text-3xl font-mono font-black text-amber-500">04:52</p>
          </div>
          <Button 
            onClick={onAcknowledge}
            className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-2xl shadow-lg shadow-red-600/20"
          >
            <CheckCircle className="mr-2 h-6 w-6" /> I AM SECURE
          </Button>
        </div>
      </motion.div>
    </div>
  );
}