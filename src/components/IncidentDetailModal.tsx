import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { IncidentLog } from '@shared/types';
import { AlertCircle, Clock, Database, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface IncidentDetailModalProps {
  incident: IncidentLog | null;
  isOpen: boolean;
  onClose: () => void;
}
export function IncidentDetailModal({ incident, isOpen, onClose }: IncidentDetailModalProps) {
  if (!incident) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-950 border-white/10 text-white max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="destructive" className="uppercase font-black tracking-widest text-[10px]">
              {incident.severity} SEVERITY
            </Badge>
            <span className="text-slate-500 font-mono text-xs">ID: {incident.id.slice(0, 12)}</span>
          </div>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-500" />
            {incident.type} Event Detected
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Description</h4>
            <p className="text-slate-200 text-sm leading-relaxed font-bold">
              {incident.description}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Clock className="h-3 w-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Timestamp</span>
              </div>
              <p className="text-sm font-mono text-white">{new Date(incident.timestamp).toLocaleString()}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Database className="h-3 w-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Job Link</span>
              </div>
              <p className="text-sm font-mono text-amber-500">#{incident.jobId.slice(0, 8)}</p>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Sensor Data Snapshots</h4>
            <div className="grid grid-cols-3 gap-2 h-24">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-slate-900 rounded-xl border border-white/5 flex items-center justify-center relative group overflow-hidden">
                  <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
                  <FileText className="h-6 w-6 text-slate-700" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-4 pt-4 border-t border-white/10">
            <Button variant="outline" className="flex-1 border-white/10 text-white" onClick={onClose}>
              Dismiss
            </Button>
            <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black">
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}