import React, { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { RiskHeatmap } from '@/components/RiskHeatmap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, MapPin, Search, ChevronRight, UserCheck, Zap, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import type { GuardProfile } from '@shared/types';
export function BookingPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedGuard, setSelectedGuard] = useState<GuardProfile | null>(null);
  const [formData, setFormData] = useState({
    pickup: '',
    destination: '',
    type: 'escort',
    riskScore: Math.floor(Math.random() * 40) + 30
  });
  const fetchGuard = useCallback(async (guardId: string) => {
    try {
      const res = await api<{ items: GuardProfile[] }>('/api/guards');
      const guard = res.items.find(g => g.id === guardId);
      if (guard) {
        setSelectedGuard(guard);
        setFormData(prev => ({ ...prev, type: guard.tier === 'elite' ? 'executive' : 'escort' }));
      }
    } catch (err) {
      console.error('[FETCH GUARD ERROR]', err);
    }
  }, []);
  useEffect(() => {
    const guardId = searchParams.get('guardId');
    if (guardId && !selectedGuard) {
      fetchGuard(guardId);
    }
  }, [searchParams, fetchGuard, selectedGuard]);
  const nextStep = () => {
    if (step === 1) {
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        setStep(2);
      }, 2000);
    } else {
      setStep(s => s + 1);
    }
  };
  const handleFinalize = async () => {
    setIsSubmitting(true);
    try {
      await api('/api/jobs', {
        method: 'POST',
        body: JSON.stringify({
          clientId: 'u1',
          serviceType: formData.type,
          pickupLocation: formData.pickup,
          destination: formData.destination,
          riskScore: formData.riskScore,
          guardId: selectedGuard?.id || undefined
        })
      });
      toast.success('Mission Briefing Transmitted', {
        description: 'Deployment request logged. Assets moving to extraction point.'
      });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      toast.error('Transmission Failed', { description: 'Could not connect to command center.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleResetGuard = () => {
    setSelectedGuard(null);
    setFormData(prev => ({ ...prev, type: 'escort' }));
  };
  return (
    <AppLayout container>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center font-bold transition-all",
                step >= s ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]" : "bg-white/5 text-slate-500 border border-white/10"
              )}>
                {s}
              </div>
              <span className={cn(
                "hidden sm:inline text-xs font-black uppercase tracking-[0.2em]",
                step >= s ? "text-amber-500" : "text-slate-600"
              )}>
                {s === 1 && "Logistics"}
                {s === 2 && "Intelligence"}
                {s === 3 && "Finalize"}
              </span>
              {s < 3 && <div className="h-[1px] w-12 bg-white/10 mx-2" />}
            </div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {isScanning ? (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 space-y-6"
            >
              <div className="relative">
                <Loader2 className="h-16 w-16 text-amber-500 animate-spin" />
                <Zap className="absolute inset-0 m-auto h-6 w-6 text-amber-500 animate-pulse" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Scanning Route Grid</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Cross-referencing global threat databases...</p>
              </div>
            </motion.div>
          ) : step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {selectedGuard && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-xs font-black text-amber-500 uppercase tracking-widest">Specialist Reserved</p>
                      <p className="text-sm font-bold text-white uppercase">{selectedGuard.name} ({selectedGuard.tier})</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white" onClick={handleResetGuard}>
                    <RefreshCw className="h-3 w-3 mr-1.5" /> Change
                  </Button>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="text-3xl font-black text-white tracking-tight uppercase">Mission Logistics</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-[10px] uppercase tracking-widest font-black">Extraction Point</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                        <Input
                          placeholder="Secure Pickup Address"
                          className="bg-white/5 border-white/10 pl-10 h-12 rounded-xl focus:ring-amber-500"
                          value={formData.pickup}
                          onChange={e => setFormData({ ...formData, pickup: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-[10px] uppercase tracking-widest font-black">Target Destination</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                        <Input
                          placeholder="Secure Drop-off Point"
                          className="bg-white/5 border-white/10 pl-10 h-12 rounded-xl focus:ring-amber-500"
                          value={formData.destination}
                          onChange={e => setFormData({ ...formData, destination: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {['escort', 'executive', 'event'].map((type) => (
                    <div
                      key={type}
                      onClick={() => setFormData({ ...formData, type })}
                      className={cn(
                        "p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 group",
                        formData.type === type ? "border-amber-500 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.1)]" : "border-white/5 bg-white/5 hover:border-white/10"
                      )}
                    >
                      <div className={cn("p-3 rounded-xl transition-colors", formData.type === type ? "bg-amber-500 text-slate-950" : "bg-white/5 text-slate-400 group-hover:text-white")}>
                        <Shield className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-white capitalize tracking-tight">{type} Protection</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tactical Asset Grade {type === 'executive' ? '1' : '2'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                size="lg"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black h-14 rounded-2xl shadow-xl shadow-amber-500/10"
                onClick={nextStep}
                disabled={!formData.pickup || !formData.destination}
              >
                INITIATE RMP ANALYSIS <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">Intelligence Brief</h2>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    Sentinel AI has mapped a tactical route between sectors. Dynamic diversion points established for {formData.destination || 'target area'}.
                  </p>
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Zap className="h-3 w-3" /> Risk Coefficient: {formData.riskScore}%
                      </p>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">Active anomalies detected in financial district.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Backup Uplink Verified</p>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">Satellite redundancy 100% active.</p>
                    </div>
                  </div>
                </div>
                <RiskHeatmap />
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 border-white/10 text-white rounded-2xl h-12 font-bold" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-[2] bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl h-12 text-lg" onClick={nextStep}>CONTINUE TO DEPLOYMENT</Button>
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 text-center"
            >
              <div className="max-w-md mx-auto space-y-8">
                <div className="relative mx-auto h-24 w-24">
                  <div className="absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-20" />
                  <div className="relative h-24 w-24 rounded-full bg-amber-500/10 flex items-center justify-center border-4 border-amber-500/20">
                    <UserCheck className="h-10 w-10 text-amber-500" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight uppercase mb-2">Ready for Insertion</h2>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">All mission parameters verified and encrypted.</p>
                </div>
                <div className="bg-white/5 rounded-[2rem] p-8 border border-white/5 space-y-4 text-left shadow-2xl">
                  <div className="flex justify-between border-b border-white/5 pb-3">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Specialist</span>
                    <span className="text-white font-black uppercase text-xs">{selectedGuard?.name || 'Standard Unit'}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-3">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Category</span>
                    <span className="text-white font-black uppercase text-xs">{formData.type} Protection</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Protocol</span>
                    <span className="text-emerald-500 font-black uppercase text-xs">STEALTH-X4</span>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black h-16 text-xl rounded-2xl shadow-2xl shadow-amber-500/20"
                  onClick={handleFinalize}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'TRANSMITTING...' : 'CONFIRM & DEPLOY'}
                </Button>
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">
                  End-to-end mission encryption active. No logs persist after 48h.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}