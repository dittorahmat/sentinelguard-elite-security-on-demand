import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Shield, Radar, Users, LayoutDashboard, LifeBuoy, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
type AppLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
};
export function AppLayout({ children, container = false }: AppLayoutProps): JSX.Element {
  const location = useLocation();
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-slate-950 text-slate-50 overflow-hidden font-sans">
        <Sidebar className="border-r border-white/10 bg-slate-900/60 backdrop-blur-2xl">
          <SidebarHeader className="border-b border-white/10 p-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-slate-950" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-white uppercase">SENTINEL</span>
                <span className="text-[10px] font-black tracking-[0.2em] text-amber-500/80 uppercase">GUARD</span>
              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-4 py-8">
            <SidebarMenu className="space-y-1.5">
              {[
                { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
                { name: "Book Escort", icon: Radar, path: "/book" },
                { name: "Personnel", icon: Users, path: "/personnel" },
                { name: "Command Center", icon: Bell, path: "/command-center" },
              ].map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300",
                      location.pathname === item.path
                        ? "bg-amber-500/15 text-amber-500 shadow-[inset_0_0_10px_rgba(245,158,11,0.1)]"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    )}
                  >
                    <Link to={item.path}>
                      <item.icon className={cn("h-5 w-5", location.pathname === item.path ? "text-amber-500" : "group-hover:text-amber-500/70 transition-colors")} />
                      <span className="font-black text-xs uppercase tracking-wider">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <div className="mt-auto p-6 border-t border-white/10">
            <SidebarMenuButton className="w-full justify-start text-slate-500 hover:text-white transition-colors">
              <LifeBuoy className="mr-3 h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Tactical Support</span>
            </SidebarMenuButton>
          </div>
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col bg-slate-950 relative overflow-y-auto">
          <header className="flex h-20 items-center justify-between border-b border-white/5 px-8 sticky top-0 bg-slate-950/80 backdrop-blur-md z-40">
            <div className="flex items-center gap-6">
              <SidebarTrigger className="text-slate-500 hover:text-white transition-colors" />
              <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
              <h1 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">
                {location.pathname === "/dashboard" && "Mission Briefing"}
                {location.pathname === "/book" && "Strategic Deployment"}
                {location.pathname === "/personnel" && "Operational Assets"}
                {location.pathname === "/command-center" && "Tactical Overview"}
                {location.pathname === "/" && "Portal Overview"}
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.1em]">GRID SECURE</span>
              </div>
              <ThemeToggle className="static" />
            </div>
          </header>
          <main className={cn("flex-1", container && "max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12")}>
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}