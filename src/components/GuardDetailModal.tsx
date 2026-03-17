import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { GuardProfile } from '@shared/types';
import { Shield, Award, Star, History, Target, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
interface GuardDetailModalProps {
  guard: GuardProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onAssign?: (id: string) => void;
}
const MOCK_PERFORMANCE = [
  { metric: 'Tactical', value: 98 },
  { metric: 'Medic', value: 85 },
  { metric: 'Driving', value: 92 },
  { metric: 'Escort', value: 95 },
];
export function GuardDetailModal({ guard, isOpen, onClose, onAssign }: GuardDetailModalProps) {
  if (!guard) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-slate-950 border-white/10 text-white p-0 overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-amber-600/20 to-slate-950">
          <div className="absolute inset-0 bg-[url('https://api.dicebear.com/7.x/identicon/svg?seed=tactical')] opacity-5 mix-blend-overlay" />
          <div className="absolute -bottom-12 left-8">
            <Avatar className="h-32 w-32 border-8 border-slate-950 shadow-2xl">
              <AvatarImage src={guard.avatarUrl} />
              <AvatarFallback>{guard.name[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="absolute top-4 right-12">
            <Badge className="bg-amber-500 text-slate-950 font-black uppercase tracking-widest px-4 py-1">
              {guard.tier} OPERATIVE
            </Badge>
          </div>
        </div>
        <div className="px-8 pt-16 pb-8 space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-3xl font-black tracking-tight">{guard.name}</DialogTitle>
              <DialogDescription className="text-slate-400 mt-1 flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest">
                <Target className="h-4 w-4 text-amber-500" />
                Security Specialist • {guard.experienceYears} Years Active Duty
              </DialogDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-amber-500 justify-end">
                <Star className="h-5 w-5 fill-current" />
                <span className="text-xl font-bold">{guard.rating}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Efficiency Rating</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <History className="h-3 w-3" /> Tactical Dossier
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-amber-500/50 pl-4">
                  "{guard.bio}"
                </p>
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3" /> Certified Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {guard.skills.map(skill => (
                    <Badge key={skill} className="bg-white/5 border-white/10 text-slate-400 text-[10px] uppercase px-2 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Shield className="h-3 w-3" /> Performance Metrics
              </h4>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_PERFORMANCE} layout="vertical">
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis
                      dataKey="metric"
                      type="category"
                      width={60}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'black' }}
                    />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '12px' }}
                    />
                    <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-4 border-t border-white/10">
            <Button variant="outline" className="flex-1 border-white/10 text-white rounded-xl" onClick={onClose}>
              Dismiss
            </Button>
            <Button 
              onClick={() => onAssign?.(guard.id)}
              className="flex-[2] bg-amber-500 hover:bg-amber-600 text-slate-950 font-black h-12 rounded-xl"
            >
              Assign to Mission
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}