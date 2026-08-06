"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BedDouble, 
  Layers,
  Users,
  CalendarCheck,
  Sparkles,
  Leaf,
  Image as ImageIcon, 
  Mail, 
  Link2,
  FileText,
  BarChart2,
  CreditCard,
  Settings, 
  LogOut,
  PanelLeftClose,
  Menu,
  Bell,
  HelpCircle,
  User
} from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Rooms", href: "/admin/rooms", icon: BedDouble },
  { name: "Floors", href: "/admin/floors", icon: Layers },
  { name: "Occupants", href: "/admin/occupants", icon: Users },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { name: "Housekeeping", href: "/admin/housekeeping", icon: Sparkles },
  { name: "Amenities", href: "/admin/amenities", icon: Leaf },
  { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { name: "Enquiries", href: "/admin/enquiries", icon: Mail },
  { name: "OTA Links", href: "/admin/ota", icon: Link2, isFuture: true },
  { name: "Reports", href: "/admin/reports", icon: FileText, isFuture: true },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart2, isFuture: true },
  { name: "Payments", href: "/admin/payments", icon: CreditCard, isFuture: true },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (!currentUser && pathname !== "/admin/login") {
        router.push("/admin/login");
      } else if (currentUser && pathname === "/admin/login") {
        router.push("/admin");
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c99a2c] border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!user && pathname === "/admin/login") {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }
  if (!user) return null;

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 inset-x-0 h-16 bg-white border-b border-slate-200 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="p-2 -ml-2 text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-serif font-bold text-[#c99a2c] text-lg uppercase tracking-wide">Hotel Moksh Haveli Inn</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
          <User className="w-4 h-4 text-slate-600" />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col bg-[#0b1329] border-r border-[#1e2a3f] shrink-0 w-[320px] shadow-2xl relative z-20 h-full">
        {/* Branding Header */}
        <div className="flex flex-col py-10 px-8 border-b border-white/5">
          <h1 className="font-serif text-[34px] font-bold text-[#c99a2c] leading-[1.2] uppercase tracking-wider">
            Hotel Moksh<br/>Haveli Inn
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 space-y-4 custom-scrollbar overflow-y-auto overflow-x-hidden px-4">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            
            return (
              <Link 
                key={link.name}
                href={link.isFuture ? "#" : link.href} 
                className={cn(
                  "flex items-center gap-4 px-6 py-4 text-[26px] font-medium transition-all duration-200 rounded-xl group relative",
                  isActive 
                    ? "bg-[#1e293b]/90 text-[#c99a2c]" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white",
                  link.isFuture && "opacity-50 hover:opacity-50 cursor-not-allowed"
                )}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2/3 w-[4px] bg-[#c99a2c] rounded-r-full" />
                )}
                
                <Icon className={cn(
                  "h-[28px] w-[28px] shrink-0 transition-colors",
                  isActive ? "text-[#c99a2c]" : "text-slate-400 group-hover:text-slate-300"
                )} />
                <span className="leading-none mt-1 whitespace-nowrap">{link.name}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Footer (Logout) */}
        <div className="shrink-0 p-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-6 py-4 text-[26px] font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-white rounded-xl w-full group"
          >
            <LogOut className="h-[28px] w-[28px] shrink-0 text-slate-400 group-hover:text-slate-300" />
            <span className="mt-1">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar overlay */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[320px] max-w-[85vw] flex flex-col bg-[#0b1329] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden border-r border-[#1e2a3f] h-full",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col py-10 px-8 border-b border-white/5 relative">
          <h1 className="font-serif text-[34px] font-bold text-[#c99a2c] leading-[1.2] uppercase tracking-wider">
            Hotel Moksh<br/>Haveli Inn
          </h1>
          <button 
            onClick={() => setMobileOpen(false)}
            className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white"
          >
            <PanelLeftClose className="w-8 h-8" />
          </button>
        </div>

        <nav className="flex-1 py-6 space-y-4 custom-scrollbar overflow-y-auto overflow-x-hidden px-4">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            
            return (
              <Link 
                key={link.name}
                href={link.isFuture ? "#" : link.href} 
                onClick={() => !link.isFuture && setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 text-[26px] font-medium transition-all duration-200 rounded-xl group relative",
                  isActive 
                    ? "bg-[#1e293b]/90 text-[#c99a2c]" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white",
                  link.isFuture && "opacity-50 hover:opacity-50 cursor-not-allowed"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2/3 w-[4px] bg-[#c99a2c] rounded-r-full" />
                )}
                <Icon className={cn(
                  "h-[28px] w-[28px] shrink-0",
                  isActive ? "text-[#c99a2c]" : "text-slate-400"
                )} />
                <span className="leading-none mt-1 whitespace-nowrap">{link.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="shrink-0 p-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-6 py-4 text-[26px] font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-white rounded-xl w-full group"
          >
            <LogOut className="h-[28px] w-[28px] shrink-0" />
            <span className="mt-1">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative pt-16 md:pt-0 bg-slate-50/50">
        
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex h-24 border-b border-slate-200 bg-white items-center justify-between px-10 shrink-0 relative z-10">
          <div className="flex items-center flex-1 max-w-2xl">
             <div className="relative w-full max-w-xl hidden sm:block">
               <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                 <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                 </svg>
               </div>
               <input 
                 type="text" 
                 placeholder="Search..." 
                 className="block w-full pl-14 pr-6 py-4 border border-slate-200 rounded-xl text-xl bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c99a2c]/50 focus:border-[#c99a2c] transition-colors"
               />
             </div>
          </div>
          <div className="flex items-center gap-6 border-l border-slate-200 pl-6 ml-6">
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-7 h-7" />
            </button>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <HelpCircle className="w-7 h-7" />
            </button>
            <div className="w-12 h-12 rounded-full bg-slate-200 border border-slate-300 overflow-hidden ml-2 flex items-center justify-center">
               <User className="w-6 h-6 text-slate-500" />
            </div>
          </div>
        </header>

        {/* Main Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 relative">
          <div className="w-full max-w-[1400px] mx-auto pb-12">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}
