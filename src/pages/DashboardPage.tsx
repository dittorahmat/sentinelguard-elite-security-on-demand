import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { PanicButton } from '@/components/PanicButton';
import { api } from '@/lib/api-client';
import type { Job, GuardProfile } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, Shield, Clock, AlertTriangle, Play } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
export function DashboardPage() {
  const queryClient = useQueryClient();
  const [simLocation, setSimLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { data: jobs, isLoading } = useQuery<{ items: Job[] }>({
    queryKey: ['jobs'],
    queryFn: () => api('/api/jobs'),
    refetchInterval: 10000,
  });
  const activeJob = jobs?.items?.find(j => j.status === 'active' || j.status === 'emergency');
  const pendingJob = jobs?.items?.find(j => j.status === 'pending');
  const { data: guards } = useQuery<{ items: GuardProfile[] }>({
    queryKey: ['guards'],
    queryFn: () => api('/api/guards'),
    enabled: !!activeJob?.guardId
  });
  const assignedGuard = guards?.items?.find(g => g.id === activeJob?.guardId);
  const startMissionMutation = useMutation({
    mutationFn: (id: string) => api(`/api/jobs/${id}/status`, { 
      method: 'PATCH', 
      body: JSON.stringify({ status: 'active' }) 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('MISSION ACTIVATED', { description: 'Personnel is now on-site and tracking is live.' });
    }
  });
  const panicMutation = useMutation({
    mutationFn: (id: string) => api(`/api/jobs/${id}/panic`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.error('EMERGENCY SIGNAL SENT', { description: 'Tactical units dispatched.' });
    }
  });
  // Simulation Engine
  useEffect(() => {
    if (activeJob && activeJob.status === 'active') {
      const interval = setInterval(() => {
        setSimLocation(prev => {
          const base = prev || activeJob.currentLocation || { lat: 40.7128, lng: -74.0060 };
          return {
            lat: base.lat + (Math.random() - 0.5) * 0.001,
            lng: base.lng + (Math.random() - 0.5) * 0.001,
          };
        });
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setSimLocation(null);
    }
  }, [activeJob?.id, activeJob?.status]);
  if (isLoading) return <AppLayout><div className="p-8 text-slate-400 animate-pulse">Establishing secure uplink...</div></AppLayout>;
  return (
    <AppLayout container>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeJob ? (
            <>
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/10 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-white uppercase">Live Deployment</h2>
                    <p className="text-slate-400 text-sm font-mono">ID: {activeJob.id.slice(0, 8)}</p>
                  </div>
                  <Badge className={activeJob.status === 'emergency' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}>
                    {activeJob.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Risk Score', value: `${activeJob.riskScore}%`, color: 'text-amber-500' },
                    { label: 'Movement', value: simLocation ? 'Detecting' : 'Stationary', color: simLocation ? 'text-emerald-500' : 'text-slate-500' },
                    { label: 'Signal', value: 'Encrypted', color: 'text-white' },
                    { label: 'Ops Mode', value: 'Tactical', color: 'text-orange-500' },
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
                      Duress Protocol
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      This signal is monitored by high-tier response centers. Do not activate unless in immediate physical danger.
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
              <h2 className="text-2xl font-bold text-slate-300 mb-2">System Ready</h2>
              {pendingJob ? (
                <div className="space-y-4">
                  <p className="text-slate-500 max-w-sm">Deployment scheduled for {pendingJob.pickupLocation}. Confirm to proceed.</p>
                  <Button 
                    onClick={() => startMissionMutation.mutate(pendingJob.id)}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                  >
                    <Play className="mr-2 h-4 w-4" /> Start Mission
                  </Button>
                </div>
              ) : (
                <p className="text-slate-500 max-w-sm">Secure your perimeter. Book an elite escort or protection service to start your session.</p>
              )}
            </div>
          )}
        </div>
        <div className="space-y-8">
          <Card className="bg-slate-900 border-white/10 overflow-hidden">
            <CardHeader className="bg-white/5 border-b border-white/10">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-amber-500">Security Feed</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {[
                { time: 'Active', event: simLocation ? `Tracking at ${simLocation.lat.toFixed(4)}, ${simLocation.lng.toFixed(4)}` : 'System idle', icon: MapPin },
                { time: 'System', event: 'End-to-end encryption verified', icon: Shield },
                { time: 'Status', event: activeJob ? `Mission ${activeJob.status}` : 'No active mission', icon: Clock },
              ].map((log, i) => (
                <div key={i} className="p-4 border-b border-white/5 last:border-0 flex gap-3">
                  <log.icon className="h-4 w-4 text-slate-500 mt-1" />
                  <div>
                    <p className="text-sm text-slate-300 font-medium">{log.event}</p>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">{log.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}