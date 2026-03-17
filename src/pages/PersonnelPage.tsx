import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { api } from '@/lib/api-client';
import type { GuardProfile } from '@shared/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star, Shield, Award, MapPin } from 'lucide-react';
export function PersonnelPage() {
  const { data: guards, isLoading } = useQuery<{ items: GuardProfile[] }>({
    queryKey: ['guards'],
    queryFn: () => api('/api/guards')
  });
  return (
    <AppLayout container>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-white uppercase">Operational Assets</h2>
            <p className="text-slate-400 text-sm mt-2 max-w-lg">
              Every Sentinel professional is vetted through a multi-stage background check, 
              physical testing, and tactical proficiency evaluation.
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-white/10 text-slate-300">Filter: Elite</Button>
            <Button variant="outline" className="border-white/10 text-slate-300">Specialization</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-white/5 animate-pulse" />
            ))
          ) : (
            guards?.items?.map((guard) => (
              <Card key={guard.id} className="bg-slate-900 border-white/10 overflow-hidden group hover:border-amber-500/40 transition-all duration-300 rounded-3xl">
                <CardHeader className="p-0 relative">
                  <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center relative overflow-hidden">
                    <Avatar className="h-32 w-32 border-4 border-slate-950/50 shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-500">
                      <AvatarImage src={guard.avatarUrl} className="object-cover" />
                      <AvatarFallback className="text-4xl font-black bg-slate-800 text-slate-500">{guard.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors" />
                    {guard.tier === 'elite' && (
                      <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl">
                        <Award className="h-3 w-3" />
                        Elite Class
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">{guard.name}</h3>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-bold">{guard.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                    {guard.bio}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {guard.skills.slice(0, 3).map(skill => (
                      <Badge key={skill} variant="secondary" className="bg-white/5 text-slate-400 text-[9px] uppercase hover:bg-white/10">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 pt-2 border-t border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Active
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {guard.experienceYears}Y EXP
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button className="w-full bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-slate-950 font-bold transition-all rounded-xl">
                    Request Placement
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}