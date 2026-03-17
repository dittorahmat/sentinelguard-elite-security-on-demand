import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { RiskHeatmap } from '@/components/RiskHeatmap';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, MapPin, Search, ChevronRight, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
export function BookingPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickup: '',
    destination: '',
    type: 'escort'
  });
  const nextStep = () => setStep(s => s + 1);
  const handleFinalize = () => {
    toast.success('Mission Briefing Transmitted', {
      description: 'Your deployment request has been logged and a guard is being assigned.'
    });
    setTimeout(() => navigate('/dashboard'), 1500);
  };
  return (
    <AppLayout container>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center font-bold transition-all",
                step >= s ? "bg-amber-500 text-slate-950" : "bg-white/5 text-slate-500 border border-white/10"
              )}>
                {s}
              </div>
              <span className={cn(
                "hidden sm:inline text-xs font-bold uppercase tracking-widest",
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
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="text-3xl font-black text-white tracking-tight">MISSION LOGISTICS</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-xs uppercase tracking-widest font-bold">Extraction Point</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input 
                          placeholder="Address, Landmark, or Coordinates" 
                          className="bg-white/5 border-white/10 pl-10 h-12"
                          value={formData.pickup}
                          onChange={e => setFormData({ ...formData, pickup: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-xs uppercase tracking-widest font-bold">Target Destination</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input 
                          placeholder="Final Secure Location" 
                          className="bg-white/5 border-white/10 pl-10 h-12"
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
                        "p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4",
                        formData.type === type ? "border-amber-500 bg-amber-500/5" : "border-white/5 bg-white/5 hover:border-white/10"
                      )}
                    >
                      <div className={cn("p-3 rounded-lg", formData.type === type ? "bg-amber-500 text-slate-950" : "bg-white/5 text-slate-400")}>
                        <Shield className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white capitalize">{type} Protection</h4>
                        <p className="text-xs text-slate-500">Tier 1 and Tier 2 availability</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold" onClick={nextStep}>
                Generate Intelligence Profile <ChevronRight className="ml-2 h-4 w-4" />
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
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight mb-4">RMP INTELLIGENCE</h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    Our Risk Mitigation & Prevention engine has processed your route. 
                    Visualizing threat heatmaps and identifying safe-points along the extraction path.
                  </p>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                      <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Alert: High Footfall Area</p>
                      <p className="text-[10px] text-slate-400">Increased surveillance recommended at 4.2km mark.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Safe Point identified</p>
                      <p className="text-[10px] text-slate-400">Police Precinct 4 is 3 minutes from target route.</p>
                    </div>
                  </div>
                </div>
                <RiskHeatmap />
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 border-white/10 text-white" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-[2] bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold" onClick={nextStep}>Finalize Tactical Plan</Button>
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8 text-center"
            >
              <div className="max-w-md mx-auto space-y-6">
                <div className="h-24 w-24 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto border-4 border-amber-500/10">
                  <UserCheck className="h-10 w-10 text-amber-500" />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">READY FOR DEPLOYMENT</h2>
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-4 text-left">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Asset Category</span>
                    <span className="text-white font-bold">Elite Tier Specialist</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Est. Risk Score</span>
                    <span className="text-amber-500 font-bold">65/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Priority Code</span>
                    <span className="text-emerald-500 font-bold">ALFA-X</span>
                  </div>
                </div>
                <Button size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black h-14 text-lg rounded-2xl" onClick={handleFinalize}>
                  CONFIRM & DEPLOY
                </Button>
                <p className="text-[10px] text-slate-500 font-medium italic">
                  By clicking confirm, you authorize the engagement of professional security services. 
                  Location tracking will begin immediately upon acceptance.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}