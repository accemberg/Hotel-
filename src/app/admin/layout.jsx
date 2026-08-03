"use client";

// Force all admin pages to be rendered dynamically (never pre-rendered at build time).
// This prevents Firestore/Auth "service unavailable" errors during `next build`.
export const dynamic = 'force-dynamic';

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
      <div className="fixed top-0 left-0 z-50 flex h-14 w-full items-center justify-between bg-[var(--color-onyx-warm)] px-4 border-b border-[var(--color-warm-stone)]/30 md:hidden">
        <span className="text-base font-bold tracking-wide" style={{ fontFamily: "var(--font-tt-ramillas-variable)", textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Admin Panel</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-[var(--color-parchment)]" aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}>
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-[var(--color-onyx-warm)] border-r border-[var(--color-warm-stone)]/20 transition-transform duration-200 ease-in-out md:static md:translate-x-0 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center border-b border-[var(--color-warm-stone)]/30 p-6 bg-[var(--color-midnight-roast)]">
          <div className="border-2 border-[var(--color-saffron-glow)] px-6 py-4" style={{ borderRadius: 0 }}>
            <h1 className="text-2xl font-light tracking-[0.25em] leading-snug text-[var(--color-saffron-glow)] uppercase text-center" style={{ fontFamily: "var(--font-tt-ramillas-variable)", fontWeight: 300 }}>
              Moksh<br/>Haveli<br/>Inn
            </h1>
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
          <Link href="/admin" className={`flex items-center gap-3 rounded px-4 py-3 text-sm font-medium transition-all border ${
            pathname === '/admin'
              ? 'bg-[var(--color-saffron-glow)]/10 text-[var(--color-saffron-glow)] border-[var(--color-saffron-glow)]/40'
              : 'text-[var(--color-parchment)]/70 border-transparent hover:bg-[var(--color-parchment)]/5 hover:text-[var(--color-parchment)]'
          }`} style={{ fontFamily: 'var(--font-satoshi)', textTransform: 'uppercase', letterSpacing: '-0.01em', borderRadius: '0.1875rem' }}>
            <LayoutDashboard className="h-4 w-4 shrink-0" /> Dashboard
          </Link>
          <Link href="/admin/rooms" className={`flex items-center gap-3 rounded px-4 py-3 text-sm font-medium transition-all border ${
            pathname === '/admin/rooms'
              ? 'bg-[var(--color-saffron-glow)]/10 text-[var(--color-saffron-glow)] border-[var(--color-saffron-glow)]/40'
              : 'text-[var(--color-parchment)]/70 border-transparent hover:bg-[var(--color-parchment)]/5 hover:text-[var(--color-parchment)]'
          }`} style={{ fontFamily: 'var(--font-satoshi)', textTransform: 'uppercase', letterSpacing: '-0.01em', borderRadius: '0.1875rem' }}>
            <BedDouble className="h-4 w-4 shrink-0" /> Rooms
          </Link>
          <Link href="/admin/amenities" className={`flex items-center gap-3 rounded px-4 py-3 text-sm font-medium transition-all border ${
            pathname === '/admin/amenities'
              ? 'bg-[var(--color-saffron-glow)]/10 text-[var(--color-saffron-glow)] border-[var(--color-saffron-glow)]/40'
              : 'text-[var(--color-parchment)]/70 border-transparent hover:bg-[var(--color-parchment)]/5 hover:text-[var(--color-parchment)]'
          }`} style={{ fontFamily: 'var(--font-satoshi)', textTransform: 'uppercase', letterSpacing: '-0.01em', borderRadius: '0.1875rem' }}>
            <Coffee className="h-4 w-4 shrink-0" /> Amenities
          </Link>
          <Link href="/admin/gallery" className={`flex items-center gap-3 rounded px-4 py-3 text-sm font-medium transition-all border ${
            pathname === '/admin/gallery'
              ? 'bg-[var(--color-saffron-glow)]/10 text-[var(--color-saffron-glow)] border-[var(--color-saffron-glow)]/40'
              : 'text-[var(--color-parchment)]/70 border-transparent hover:bg-[var(--color-parchment)]/5 hover:text-[var(--color-parchment)]'
          }`} style={{ fontFamily: 'var(--font-satoshi)', textTransform: 'uppercase', letterSpacing: '-0.01em', borderRadius: '0.1875rem' }}>
            <ImageIcon className="h-4 w-4 shrink-0" /> Gallery
          </Link>
          <Link href="/admin/enquiries" className={`flex items-center gap-3 rounded px-4 py-3 text-sm font-medium transition-all border ${
            pathname === '/admin/enquiries'
              ? 'bg-[var(--color-saffron-glow)]/10 text-[var(--color-saffron-glow)] border-[var(--color-saffron-glow)]/40'
              : 'text-[var(--color-parchment)]/70 border-transparent hover:bg-[var(--color-parchment)]/5 hover:text-[var(--color-parchment)]'
          }`} style={{ fontFamily: 'var(--font-satoshi)', textTransform: 'uppercase', letterSpacing: '-0.01em', borderRadius: '0.1875rem' }}>
            <MessageSquare className="h-4 w-4 shrink-0" /> Enquiries
          </Link>
          <Link href="/admin/ota" className={`flex items-center gap-3 rounded px-4 py-3 text-sm font-medium transition-all border ${
            pathname === '/admin/ota'
              ? 'bg-[var(--color-saffron-glow)]/10 text-[var(--color-saffron-glow)] border-[var(--color-saffron-glow)]/40'
              : 'text-[var(--color-parchment)]/70 border-transparent hover:bg-[var(--color-parchment)]/5 hover:text-[var(--color-parchment)]'
          }`} style={{ fontFamily: 'var(--font-satoshi)', textTransform: 'uppercase', letterSpacing: '-0.01em', borderRadius: '0.1875rem' }}>
            <Link2 className="h-4 w-4 shrink-0" /> OTA Links
          </Link>
          <Link href="/admin/settings" className={`flex items-center gap-3 rounded px-4 py-3 text-sm font-medium transition-all border ${
            pathname === '/admin/settings'
              ? 'bg-[var(--color-saffron-glow)]/10 text-[var(--color-saffron-glow)] border-[var(--color-saffron-glow)]/40'
              : 'text-[var(--color-parchment)]/70 border-transparent hover:bg-[var(--color-parchment)]/5 hover:text-[var(--color-parchment)]'
          }`} style={{ fontFamily: 'var(--font-satoshi)', textTransform: 'uppercase', letterSpacing: '-0.01em', borderRadius: '0.1875rem' }}>
            <Settings className="h-4 w-4 shrink-0" /> Settings
          </Link>
        </nav>
        
        <div className="border-t border-[var(--color-warm-stone)]/30 p-4 bg-[var(--color-midnight-roast)]">
          <button 
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-[var(--color-parchment)]/30 text-[var(--color-parchment)]/70 font-medium text-sm transition-colors hover:bg-[var(--color-parchment)]/5 hover:text-[var(--color-parchment)] hover:border-[var(--color-parchment)]/50"
            style={{ fontFamily: 'var(--font-satoshi)', textTransform: 'uppercase', letterSpacing: '-0.01em', borderRadius: '0.1875rem' }}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto mt-14 md:mt-0 p-4 md:p-8">
        <div className="w-full mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
