import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { PanicButton } from '@/components/PanicButton';
import { api } from '@/lib/api-client';
import type { Job, GuardProfile } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Shield, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
export function DashboardPage() {
  const queryClient = useQueryClient();
  const { data: jobs, isLoading } = useQuery<{ items: Job[] }>({
    queryKey: ['jobs'],
    queryFn: () => api('/api/jobs')
  });
  const activeJob = jobs?.items?.find(j => j.status === 'active' || j.status === 'emergency');
  const { data: guards } = useQuery<{ items: GuardProfile[] }>({
    queryKey: ['guards'],
    queryFn: () => api('/api/guards'),
    enabled: !!activeJob?.guardId
  });
  const assignedGuard = guards?.items?.find(g => g.id === activeJob?.guardId);
  const panicMutation = useMutation({
    mutationFn: (id: string) => api(`/api/jobs/${id}/panic`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.error('EMERGENCY SIGNAL SENT TO COMMAND CENTER', {
        description: 'Elite response teams have been dispatched to your location.'
      });
    }
  });
  if (isLoading) return <AppLayout><div className="p-8">Syncing with encrypted servers...</div></AppLayout>;
  return (
    <AppLayout container>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Status Column */}
        <div className="lg:col-span-2 space-y-8">
          {activeJob ? (
            <>
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/10 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-white uppercase">Mission Status</h2>
                    <p className="text-slate-400 text-sm">Active deployment: {activeJob.id.slice(0, 8)}</p>
                  </div>
                  <Badge className={activeJob.status === 'emergency' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}>
                    {activeJob.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Risk Score', value: `${activeJob.riskScore}%`, color: 'text-amber-500' },
                    { label: 'Distance', value: '4.2 km', color: 'text-white' },
                    { label: 'ETA', value: '12 mins', color: 'text-white' },
                    { label: 'Route Status', value: 'Optimal', color: 'text-emerald-500' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className={cn("text-lg font-black", stat.color)}>{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col md:flex-row gap-8 items-center justify-center p-8 bg-black/40 rounded-3xl border border-red-500/20">
                  <PanicButton onTrigger={() => panicMutation.mutate(activeJob.id)} />
                  <div className="max-w-xs text-center md:text-left">
                    <h3 className="text-red-500 font-bold text-lg mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Tactical Warning
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Triggering the panic button initiates immediate escalation to local law enforcement 
                      and Sentinel Elite tactical units.
                    </p>
                  </div>
                </div>
              </div>
              <Card className="bg-slate-900 border-white/10">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Assigned Professional</CardTitle>
                </CardHeader>
                <CardContent>
                  {assignedGuard ? (
                    <div className="flex items-center gap-6">
                      <Avatar className="h-20 w-20 border-2 border-amber-500/20">
                        <AvatarImage src={assignedGuard.avatarUrl} />
                        <AvatarFallback>{assignedGuard.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-xl font-bold text-white">{assignedGuard.name}</h4>
                          <Badge variant="outline" className="text-amber-500 border-amber-500/20">{assignedGuard.tier.toUpperCase()}</Badge>
                        </div>
                        <p className="text-slate-400 text-sm mb-3">{assignedGuard.bio}</p>
                        <div className="flex gap-2">
                          {assignedGuard.skills.map(s => (
                            <Badge key={s} className="bg-white/5 text-slate-400 text-[10px] uppercase">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-500 italic py-4">Locating nearest available asset...</div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="h-96 rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center p-8">
              <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Shield className="h-10 w-10 text-slate-700" />
              </div>
              <h2 className="text-2xl font-bold text-slate-300 mb-2">No Active Deployment</h2>
              <p className="text-slate-500 max-w-sm">Secure your perimeter. Book an elite escort or protection service to start your session.</p>
            </div>
          )}
        </div>
        {/* Sidebar Column */}
        <div className="space-y-8">
          <Card className="bg-slate-900 border-white/10 overflow-hidden">
            <CardHeader className="bg-white/5 border-b border-white/10">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-amber-500">Security Feed</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {[
                { time: '14:20', event: 'System diagnostic passed', icon: Shield },
                { time: '12:05', event: 'New Elite Guard available', icon: AlertTriangle },
                { time: 'Yesterday', event: 'Mission j923 completed', icon: MapPin },
              ].map((log, i) => (
                <div key={i} className="p-4 border-b border-white/5 last:border-0 flex gap-3">
                  <log.icon className="h-4 w-4 text-slate-500 mt-1" />
                  <div>
                    <p className="text-sm text-slate-300 font-medium">{log.event}</p>
                    <p className="text-[10px] text-slate-600 font-bold">{log.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="p-6 rounded-3xl bg-amber-500 text-slate-950">
            <h3 className="font-black text-lg mb-2">Upgrade to Elite</h3>
            <p className="text-sm font-medium opacity-80 mb-4 text-pretty">Get guaranteed 5-minute response times and ex-military personnel for all missions.</p>
            <button className="w-full py-3 bg-slate-950 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
              View Tier Pricing
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}