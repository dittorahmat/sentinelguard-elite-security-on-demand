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
      <div className="flex h-screen w-full bg-slate-950 text-slate-50 overflow-hidden">
        <Sidebar className="border-r border-white/10 bg-slate-900/50 backdrop-blur-xl">
          <SidebarHeader className="border-b border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                <Shield className="h-6 w-6 text-slate-950" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-white">SENTINEL</span>
                <span className="text-[10px] font-medium tracking-[0.2em] text-amber-500/80">GUARD</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <SidebarMenu className="space-y-2">
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
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                      location.pathname === item.path 
                        ? "bg-amber-500/10 text-amber-500" 
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Link to={item.path}>
                      <item.icon className={cn("h-5 w-5", location.pathname === item.path ? "text-amber-500" : "group-hover:text-white")} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <div className="mt-auto p-4 border-t border-white/10">
            <SidebarMenuButton className="w-full justify-start text-slate-400 hover:text-white">
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Support</span>
            </SidebarMenuButton>
          </div>
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col bg-slate-950 relative overflow-y-auto">
          <header className="flex h-16 items-center justify-between border-b border-white/5 px-6 sticky top-0 bg-slate-950/80 backdrop-blur-md z-30">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-slate-400 hover:text-white" />
              <h1 className="text-sm font-semibold text-slate-200">
                {location.pathname === "/dashboard" && "Mission Briefing"}
                {location.pathname === "/book" && "Strategic Deployment"}
                {location.pathname === "/personnel" && "Operational Assets"}
                {location.pathname === "/command-center" && "Tactical Overview"}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">System Live</span>
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