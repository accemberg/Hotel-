"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { 
  LayoutDashboard, 
  BedDouble, 
  Wifi, 
  Image as ImageIcon, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  Coffee,
  Link2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Rooms", href: "/admin/rooms", icon: BedDouble },
  { name: "Amenities", href: "/admin/amenities", icon: Wifi },
  { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <div className="flex h-screen w-full items-center justify-center bg-[var(--color-midnight-roast)]">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-saffron-glow)] border-t-transparent"></div>
          <p className="text-sm font-medium text-[var(--color-parchment)]">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  // If not logged in and on the login page, just render the login page without the sidebar
  if (!user && pathname === "/admin/login") {
    return <div className="min-h-screen bg-[var(--color-midnight-roast)] text-[var(--color-parchment)]">{children}</div>;
  }

  // If not logged in and not on login page (should be caught by useEffect, but just in case)
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[var(--color-midnight-roast)] text-[var(--color-parchment)] font-sans">
      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between bg-[var(--color-onyx-warm)] px-4 border-b border-[var(--color-warm-stone)]/30 md:hidden">
        <span className="text-lg font-bold" style={{ fontFamily: "var(--font-tt-ramillas-variable)" }}>Admin Panel</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-[var(--color-parchment)]">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-[var(--color-onyx-warm)] border-r border-[var(--color-warm-stone)]/20 transition-transform duration-200 ease-in-out md:static md:translate-x-0 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center border-b border-[var(--color-warm-stone)]/30 p-8 bg-[var(--color-midnight-roast)]">
          <div className="border-4 border-[var(--color-saffron-glow)] px-8 py-6 rounded-2xl shadow-[0_0_30px_rgba(227,168,105,0.6)] bg-[var(--color-onyx-warm)]">
            <h1 className="text-4xl font-bold tracking-[0.3em] leading-loose text-[var(--color-saffron-glow)] uppercase drop-shadow-[0_0_15px_rgba(227,168,105,0.9)] text-center" style={{ fontFamily: "var(--font-tt-ramillas-variable)" }}>
              Moksh<br/>Haveli<br/>Inn
            </h1>
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-6 p-8 overflow-y-auto">
          <Link href="/admin" className={`flex items-center gap-6 rounded-2xl px-6 py-6 text-2xl font-bold transition-all border-2 shadow-lg ${pathname === '/admin' ? 'bg-[var(--color-saffron-glow)] text-[var(--color-midnight-roast)] border-[var(--color-saffron-glow)]' : 'bg-[var(--color-midnight-roast)] text-[var(--color-parchment)] border-[var(--color-warm-stone)]/50 hover:border-[var(--color-saffron-glow)] hover:text-[var(--color-saffron-glow)]'}`}>
            <LayoutDashboard className="h-8 w-8" /> Dashboard
          </Link>
          <Link href="/admin/rooms" className={`flex items-center gap-6 rounded-2xl px-6 py-6 text-2xl font-bold transition-all border-2 shadow-lg ${pathname === '/admin/rooms' ? 'bg-[var(--color-saffron-glow)] text-[var(--color-midnight-roast)] border-[var(--color-saffron-glow)]' : 'bg-[var(--color-midnight-roast)] text-[var(--color-parchment)] border-[var(--color-warm-stone)]/50 hover:border-[var(--color-saffron-glow)] hover:text-[var(--color-saffron-glow)]'}`}>
            <BedDouble className="h-8 w-8" /> Rooms
          </Link>
          <Link href="/admin/amenities" className={`flex items-center gap-6 rounded-2xl px-6 py-6 text-2xl font-bold transition-all border-2 shadow-lg ${pathname === '/admin/amenities' ? 'bg-[var(--color-saffron-glow)] text-[var(--color-midnight-roast)] border-[var(--color-saffron-glow)]' : 'bg-[var(--color-midnight-roast)] text-[var(--color-parchment)] border-[var(--color-warm-stone)]/50 hover:border-[var(--color-saffron-glow)] hover:text-[var(--color-saffron-glow)]'}`}>
            <Coffee className="h-8 w-8" /> Amenities
          </Link>
          <Link href="/admin/gallery" className={`flex items-center gap-6 rounded-2xl px-6 py-6 text-2xl font-bold transition-all border-2 shadow-lg ${pathname === '/admin/gallery' ? 'bg-[var(--color-saffron-glow)] text-[var(--color-midnight-roast)] border-[var(--color-saffron-glow)]' : 'bg-[var(--color-midnight-roast)] text-[var(--color-parchment)] border-[var(--color-warm-stone)]/50 hover:border-[var(--color-saffron-glow)] hover:text-[var(--color-saffron-glow)]'}`}>
            <ImageIcon className="h-8 w-8" /> Gallery
          </Link>
          <Link href="/admin/enquiries" className={`flex items-center gap-6 rounded-2xl px-6 py-6 text-2xl font-bold transition-all border-2 shadow-lg ${pathname === '/admin/enquiries' ? 'bg-[var(--color-saffron-glow)] text-[var(--color-midnight-roast)] border-[var(--color-saffron-glow)]' : 'bg-[var(--color-midnight-roast)] text-[var(--color-parchment)] border-[var(--color-warm-stone)]/50 hover:border-[var(--color-saffron-glow)] hover:text-[var(--color-saffron-glow)]'}`}>
            <MessageSquare className="h-8 w-8" /> Enquiries
          </Link>
          <Link href="/admin/ota" className={`flex items-center gap-6 rounded-2xl px-6 py-6 text-2xl font-bold transition-all border-2 shadow-lg ${pathname === '/admin/ota' ? 'bg-[var(--color-saffron-glow)] text-[var(--color-midnight-roast)] border-[var(--color-saffron-glow)]' : 'bg-[var(--color-midnight-roast)] text-[var(--color-parchment)] border-[var(--color-warm-stone)]/50 hover:border-[var(--color-saffron-glow)] hover:text-[var(--color-saffron-glow)]'}`}>
            <Link2 className="h-8 w-8" /> OTA Links
          </Link>
          <Link href="/admin/settings" className={`flex items-center gap-6 rounded-2xl px-6 py-6 text-2xl font-bold transition-all border-2 shadow-lg ${pathname === '/admin/settings' ? 'bg-[var(--color-saffron-glow)] text-[var(--color-midnight-roast)] border-[var(--color-saffron-glow)]' : 'bg-[var(--color-midnight-roast)] text-[var(--color-parchment)] border-[var(--color-warm-stone)]/50 hover:border-[var(--color-saffron-glow)] hover:text-[var(--color-saffron-glow)]'}`}>
            <Settings className="h-8 w-8" /> Settings
          </Link>
        </nav>
        
        <div className="border-t border-[var(--color-warm-stone)]/30 p-6 bg-[var(--color-midnight-roast)]">
          <button 
            className="w-full flex items-center justify-center gap-3 py-4 px-6 border-2 border-[var(--color-parchment)]/50 text-[var(--color-parchment)] font-bold text-lg rounded-xl hover:bg-[var(--color-parchment)] hover:text-[var(--color-midnight-roast)] transition-colors shadow-sm"
            onClick={handleLogout}
          >
            <LogOut className="h-6 w-6" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto mt-16 md:mt-0 p-6 md:p-12">
        <div className="w-full mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/80 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
