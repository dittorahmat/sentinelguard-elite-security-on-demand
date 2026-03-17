import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronRight, Lock, Eye, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
export function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500 selection:text-slate-950 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[150px]" />
      </div>
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-amber-500" />
          <span className="text-xl font-bold tracking-tighter uppercase">SENTINEL<span className="text-amber-500">GUARD</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#elite" className="hover:text-white transition-colors">Elite Vetting</a>
          <a href="#network" className="hover:text-white transition-colors">Network</a>
        </div>
        <Link to="/dashboard">
          <Button variant="outline" className="border-white/10 hover:bg-white/5 bg-transparent text-white">Client Login</Button>
        </Link>
      </nav>
      <main className="relative z-10 pt-20 pb-32 px-6 md:px-12 text-center max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-amber-500">
            <Zap className="h-3 w-3" />
            24/7 Priority Protection Active
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-none uppercase">
            ELITE SECURITY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">ON DEMAND.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed text-pretty">
            Deployment of professional security assets for executive protection,
            high-risk escorts, and crisis mitigation. Vetted. Armed. Ready.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link to="/book">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 h-14 rounded-full text-lg shadow-[0_10px_30px_rgba(245,158,11,0.3)] border-none">
                Request Deployment <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/personnel">
              <Button variant="ghost" size="lg" className="text-slate-300 hover:text-white h-14 px-8 text-lg font-semibold bg-transparent">
                Browse Elite Assets
              </Button>
            </Link>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 text-left">
          {[
            { icon: Lock, title: "Proactive Risk Mitigation", desc: "Automated route diversion and safe-point mapping using real-time threat heatmaps." },
            { icon: Eye, title: "Live Mission Tracking", desc: "End-to-end encrypted GPS tracking with immediate Command Center escalation." },
            { icon: Shield, title: "Elite Tier Vetting", desc: "All professionals undergo rigorous background checks and tactical skill certification." },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className="p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm group hover:border-amber-500/50 transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 uppercase tracking-tight text-white">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
      <footer className="relative z-10 border-t border-white/5 py-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-900/50">
        <div className="flex items-center gap-2 opacity-50">
          <Shield className="h-5 w-5" />
          <span className="text-sm font-bold tracking-tighter uppercase">SentinelGuard Systems</span>
        </div>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">© 2024 SentinelGuard. Professional Grade Security.</p>
      </footer>
    </div>
  );
}