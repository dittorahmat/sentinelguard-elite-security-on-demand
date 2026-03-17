import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { IncidentDetailModal } from '@/components/IncidentDetailModal';
import { api } from '@/lib/api-client';
import type { Job, IncidentLog } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Activity, Globe, ShieldAlert, Wifi, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
export function CommandCenterPage() {
  const [selectedIncident, setSelectedIncident] = useState<IncidentLog | null>(null);
  const { data: jobs } = useQuery<{ items: Job[] }>({
    queryKey: ['jobs'],
    queryFn: () => api('/api/jobs'),
    refetchInterval: 5000
  });
  const { data: incidents } = useQuery<{ items: IncidentLog[] }>({
    queryKey: ['incidents'],
    queryFn: () => api('/api/incidents'),
    refetchInterval: 5000
  });
  const emergencyJobs = jobs?.items?.filter(j => j.status === 'emergency') || [];
  const activeDeployments = jobs?.items?.filter(j => j.status === 'active').length || 0;
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Deployments', value: activeDeployments, icon: Activity, color: 'text-emerald-500' },
            { label: 'Panic Signals', value: emergencyJobs.length, icon: ShieldAlert, color: emergencyJobs.length > 0 ? 'text-red-500' : 'text-slate-500' },
            { label: 'System Load', value: '14%', icon: Globe, color: 'text-blue-500' },
            { label: 'Satellite Uplink', value: 'Active', icon: Wifi, color: 'text-amber-500' },
          ].map((stat, i) => (
            <Card key={i} className="bg-slate-900 border-white/10">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{stat.label}</p>
                  <p className={cn("text-2xl font-black", stat.color)}>{stat.value}</p>
                </div>
                <stat.icon className={cn("h-8 w-8 opacity-20", stat.color)} />
              </CardContent>
            </Card>
          ))}
        </div>
        {emergencyJobs.length > 0 && (
          <div className="bg-red-500/10 border-2 border-red-500 rounded-3xl p-6 animate-pulse shadow-[0_0_50px_rgba(239,68,68,0.3)]">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                <ShieldAlert className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Emergency Escalation Active</h3>
                <p className="text-red-500/80 text-xs font-bold uppercase tracking-widest">Immediate Tactical Response Required</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyJobs.map(job => (
                <div key={job.id} className="bg-slate-900 p-4 rounded-xl border border-red-500/30 flex justify-between items-center group hover:border-red-500/60 transition-colors">
                  <div>
                    <p className="text-white font-bold">JOB ID: {job.id.slice(0, 8)}</p>
                    <p className="text-slate-400 text-xs">{job.pickupLocation} → {job.destination}</p>
                  </div>
                  <Badge className="bg-red-500 text-white font-black px-4">PANIC SIGNAL</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-slate-900 border-white/10">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Live Mission Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-slate-500 uppercase text-[10px] font-black">ID</TableHead>
                    <TableHead className="text-slate-500 uppercase text-[10px] font-black">Route</TableHead>
                    <TableHead className="text-slate-500 uppercase text-[10px] font-black">Status</TableHead>
                    <TableHead className="text-slate-500 uppercase text-[10px] font-black text-right">Risk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs?.items?.map(job => (
                    <TableRow key={job.id} className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="font-mono text-[10px] text-amber-500">{job.id.slice(0, 8)}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-slate-300 text-xs">{job.destination}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "text-[9px] uppercase tracking-widest font-black",
                          job.status === 'active' && "text-emerald-500 border-emerald-500/20",
                          job.status === 'emergency' && "text-red-500 border-red-500/20",
                          job.status === 'pending' && "text-slate-500 border-white/10"
                        )}>
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-black text-slate-300">{job.riskScore}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-white/10">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Incident Log
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {incidents?.items?.length === 0 ? (
                  <div className="p-8 text-center text-slate-600 text-xs italic">No critical incidents recorded.</div>
                ) : (
                  incidents?.items?.map(incident => (
                    <div 
                      key={incident.id} 
                      className="p-4 space-y-2 hover:bg-white/5 cursor-pointer transition-colors"
                      onClick={() => setSelectedIncident(incident)}
                    >
                      <div className="flex justify-between items-center">
                        <Badge variant="destructive" className="text-[8px] px-1.5 h-4 uppercase">{incident.severity}</Badge>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500/50" />
                          <span className="text-[10px] font-mono text-slate-600">{new Date(incident.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-white uppercase tracking-tight line-clamp-1">{incident.description}</p>
                      <p className="text-[10px] text-slate-500">Mission: {incident.jobId.slice(0, 8)}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <IncidentDetailModal 
        incident={selectedIncident} 
        isOpen={!!selectedIncident} 
        onClose={() => setSelectedIncident(null)} 
      />
    </AppLayout>
  );
}