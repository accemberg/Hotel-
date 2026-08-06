"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { 
  Users, 
  Mail, 
  CheckCircle, 
  PlusCircle, 
  Image as ImageIcon, 
  Settings, 
  MessageSquare,
  TrendingUp,
  CalendarDays,
  DoorOpen,
  Building,
  Layers,
  DoorClosed,
  AlertTriangle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { AdminCard } from "@/components/admin/AdminCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SkeletonLoader } from "@/components/admin/SkeletonLoader";
import { AdminTable, AdminTableRow, AdminTableCell } from "@/components/admin/AdminTable";

export default function AdminDashboard() {
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [occupants, setOccupants] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [housekeeping, setHousekeeping] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);

  // Today's date formatted for welcome header
  const todayLabel = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  // Today's date string YYYY-MM-DD for comparisons
  const getLocalDateStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const todayStr = getLocalDateStr();

  // ─── Live Refresh on Firestore changes ───────────────────────────────────
  useEffect(() => {
    let activeSnapshots = 0;
    const checkLoading = () => {
      activeSnapshots++;
      if (activeSnapshots >= 6) {
        setLoading(false);
      }
    };

    const handleStreamError = (name, err) => {
      console.warn(`${name} stream warning:`, err?.message || err);
      if (err?.code === "permission-denied" || (err?.message && err.message.includes("permission"))) {
        setPermissionError(true);
      }
      checkLoading();
    };

    const unsubFloors = onSnapshot(collection(db, "floors"), (snap) => {
      setFloors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      checkLoading();
    }, (err) => handleStreamError("Floors", err));

    const unsubRooms = onSnapshot(collection(db, "rooms"), (snap) => {
      setRooms(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      checkLoading();
    }, (err) => handleStreamError("Rooms", err));

    const unsubOccupants = onSnapshot(collection(db, "occupants"), (snap) => {
      setOccupants(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      checkLoading();
    }, (err) => handleStreamError("Occupants", err));

    const unsubEnquiries = onSnapshot(collection(db, "enquiries"), (snap) => {
      setEnquiries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      checkLoading();
    }, (err) => handleStreamError("Enquiries", err));

    const unsubBookings = onSnapshot(collection(db, "bookings"), (snap) => {
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      checkLoading();
    }, (err) => handleStreamError("Bookings", err));

    const unsubHousekeeping = onSnapshot(collection(db, "housekeeping"), (snap) => {
      setHousekeeping(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      checkLoading();
    }, (err) => handleStreamError("Housekeeping", err));

    return () => {
      unsubFloors();
      unsubRooms();
      unsubOccupants();
      unsubEnquiries();
      unsubBookings();
      unsubHousekeeping();
    };
  }, []);

  // ─── PMS Calculation logic ───────────────────────────────────────────────
  const activeCheckedInOccs = occupants.filter(o => o.status === "Checked In");

  // Sum checked-in guest counts per room (adults + children)
  const roomOccupancyMap = {};
  activeCheckedInOccs.forEach(o => {
    if (o.roomId) {
      roomOccupancyMap[o.roomId] = (roomOccupancyMap[o.roomId] || 0) + Number(o.adults || 0) + Number(o.children || 0);
    }
  });

  // Categorize rooms
  let vacantRoomsCount = 0;
  let occupiedRoomsCount = 0;
  let fullRoomsCount = 0;

  rooms.forEach(r => {
    const currentGuests = roomOccupancyMap[r.id] || 0;
    const maxCapacity = Number(r.guests || 2);

    if (currentGuests === 0) {
      vacantRoomsCount++;
    } else if (currentGuests >= maxCapacity) {
      fullRoomsCount++;
    } else {
      occupiedRoomsCount++;
    }
  });

  // Sum total checked-in occupants
  const currentOccupantsCount = activeCheckedInOccs.reduce(
    (sum, o) => sum + Number(o.adults || 0) + Number(o.children || 0), 0
  );

  // CRM Pending Enquiries
  const pendingEnquiriesCount = enquiries.filter(
    e => e.status === "New" || !e.status
  ).length;

  // ─── Arrivals Today ──────────────────────────────────────────────────────
  const arrivalsToday = [
    ...occupants.filter(o => o.checkIn === todayStr && o.status !== "Cancelled" && o.status !== "Checked Out"),
    ...bookings.filter(b => b.checkIn === todayStr && (b.status === "Reserved" || b.status === "Confirmed"))
  ];

  // ─── Departures Today ────────────────────────────────────────────────────
  const departuresToday = [
    ...occupants.filter(o => o.checkOut === todayStr && o.status === "Checked In"),
    ...bookings.filter(b => b.checkOut === todayStr && b.status === "Checked In")
  ];

  // ─── Upcoming Reservations (Step 8) ──────────────────────────────────────
  const upcomingReservations = [...bookings]
    .filter(b => (b.status === "Reserved" || b.status === "Confirmed") && (b.checkIn || "") >= todayStr)
    .sort((a, b) => (a.checkIn || "").localeCompare(b.checkIn || ""))
    .slice(0, 5);

  // ─── Recent Occupants (Latest 5) ─────────────────────────────────────────
  const recentOccupants = [...occupants]
    .sort((a, b) => (b.checkIn || "").localeCompare(a.checkIn || ""))
    .slice(0, 5);

  // ─── Recent Enquiries (Latest 4) ─────────────────────────────────────────
  const recentEnquiries = [...enquiries]
    .sort((a, b) => (b.createdAt?.toDate?.() || b.createdAt || 0) - (a.createdAt?.toDate?.() || a.createdAt || 0))
    .slice(0, 4);

  // ─── Warnings Generation ─────────────────────────────────────────────────
  const roomsWithoutFloor = rooms.filter(r => !r.floorId);
  const roomsWithoutNumber = rooms.filter(r => !r.roomNumber);
  const inactiveFloors = floors.filter(f => f.active === false);
  const vacantRooms = rooms.filter(r => (roomOccupancyMap[r.id] || 0) === 0);

  const hasWarnings = roomsWithoutFloor.length > 0 || 
                      roomsWithoutNumber.length > 0 || 
                      inactiveFloors.length > 0 || 
                      vacantRooms.length > 0;

  // ─── Quick Links ──────────────────────────────────────────────────────────
  const quickActions = [
    { title: "Add New Floor", icon: PlusCircle, href: "/admin/floors", color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Add New Room", icon: PlusCircle, href: "/admin/rooms", color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Register Occupant", icon: PlusCircle, href: "/admin/occupants", color: "text-amber-600", bg: "bg-amber-50" },
    { title: "View Enquiries", icon: MessageSquare, href: "/admin/enquiries", color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Manage Gallery", icon: ImageIcon, href: "/admin/gallery", color: "text-slate-600", bg: "bg-slate-100" },
    { title: "Site Settings", icon: Settings, href: "/admin/settings", color: "text-slate-600", bg: "bg-slate-100" },
  ];

  return (
    <div className="flex flex-col gap-8">
      
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-[54px] font-bold text-slate-900 tracking-tight">
            Good Morning, Moksh Haveli Inn
          </h2>
          <p className="text-[28px] text-slate-500 mt-2 font-medium flex items-center gap-2">
            <CalendarDays className="w-8 h-8 text-slate-400" />
            {todayLabel}
          </p>
        </div>
      </div>

      {permissionError && (
        <div className="p-8 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-amber-800 text-base">
            <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
            <span>Firestore Permission Warning: Missing or Insufficient Permissions</span>
          </div>
          <p className="text-xl text-amber-700 leading-relaxed">
            Cloud Firestore is blocking database queries. Please make sure your Firestore Security Rules are set up in <strong>Firebase Console → Firestore Database → Rules</strong> (or publish the rules from <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-lg text-amber-900">firestore.rules</code>) and that you are logged in.
          </p>
        </div>
      )}

      {/* Warnings Banner (If misconfigurations exist) */}
      {hasWarnings && (
        <div className="flex flex-col gap-6">
          <h3 className="text-[28px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            Operations Alerts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {roomsWithoutFloor.length > 0 && (
              <AdminCard padding="p-4" className="border-red-200 bg-red-50/50 flex items-start gap-3 rounded-xl">
                <AlertCircle className="w-8 h-8 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 text-xl">Rooms Missing Floor ({roomsWithoutFloor.length})</h4>
                  <p className="text-lg text-slate-500 mt-1">Some rooms have not been assigned to a floor. Fix in rooms list.</p>
                  <Link href="/admin/rooms" className="text-lg text-red-600 font-semibold block mt-2 hover:underline">Fix Rooms →</Link>
                </div>
              </AdminCard>
            )}

            {roomsWithoutNumber.length > 0 && (
              <AdminCard padding="p-4" className="border-red-200 bg-red-50/50 flex items-start gap-3 rounded-xl">
                <AlertCircle className="w-8 h-8 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 text-xl">Missing Room Numbers ({roomsWithoutNumber.length})</h4>
                  <p className="text-lg text-slate-500 mt-1">Some room profiles are missing unique room numbers.</p>
                  <Link href="/admin/rooms" className="text-lg text-red-600 font-semibold block mt-2 hover:underline">Fix Rooms →</Link>
                </div>
              </AdminCard>
            )}

            {inactiveFloors.length > 0 && (
              <AdminCard padding="p-4" className="border-amber-200 bg-amber-50/50 flex items-start gap-3 rounded-xl">
                <AlertCircle className="w-8 h-8 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 text-xl">Inactive Floors ({inactiveFloors.length})</h4>
                  <p className="text-lg text-slate-500 mt-1">Operational floors currently marked under configuration status.</p>
                  <Link href="/admin/floors" className="text-lg text-amber-700 font-semibold block mt-2 hover:underline">Manage Floors →</Link>
                </div>
              </AdminCard>
            )}

            {vacantRooms.length > 0 && (
              <AdminCard padding="p-4" className="border-slate-200 bg-slate-50/50 flex items-start gap-3 rounded-xl">
                <AlertCircle className="w-8 h-8 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 text-xl">Vacant Rooms ({vacantRooms.length})</h4>
                  <p className="text-lg text-slate-500 mt-1">Clean and vacant rooms ready for occupant check-ins.</p>
                  <Link href="/admin/rooms" className="text-lg text-slate-600 font-semibold block mt-2 hover:underline">View Rooms →</Link>
                </div>
              </AdminCard>
            )}

          </div>
        </div>
      )}

      {/* Primary PMS Statistics Grid (7 Cards) */}
      <div>
        <h3 className="text-[28px] font-bold text-slate-400 uppercase tracking-widest mb-5">Today's Overview</h3>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <SkeletonLoader type="card" count={4} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6">
            
            {/* Total Floors */}
            <AdminCard padding="p-8" hover className="border border-slate-200 bg-white rounded-xl">
              <div className="flex justify-between items-start mb-3">
                <span className="text-lg font-bold text-slate-400 uppercase tracking-wider block">Floors</span>
                <div className="p-3 bg-slate-50 rounded-lg"><Building className="w-8 h-8 text-slate-500" /></div>
              </div>
              <div className="text-[56px] font-bold text-slate-900 tracking-tight">{floors.length}</div>
            </AdminCard>

            {/* Total Rooms */}
            <AdminCard padding="p-8" hover className="border border-slate-200 bg-white rounded-xl">
              <div className="flex justify-between items-start mb-3">
                <span className="text-lg font-bold text-slate-400 uppercase tracking-wider block">Rooms</span>
                <div className="p-3 bg-slate-50 rounded-lg"><Layers className="w-8 h-8 text-slate-500" /></div>
              </div>
              <div className="text-[56px] font-bold text-slate-900 tracking-tight">{rooms.length}</div>
            </AdminCard>

            {/* Available Rooms */}
            <AdminCard padding="p-8" hover className="border border-slate-200 bg-white rounded-xl">
              <div className="flex justify-between items-start mb-3">
                <span className="text-lg font-bold text-slate-400 uppercase tracking-wider block">Available</span>
                <div className="p-3 bg-emerald-50 rounded-lg"><DoorOpen className="w-8 h-8 text-emerald-600" /></div>
              </div>
              <div className="text-[56px] font-bold text-emerald-600 tracking-tight">{vacantRoomsCount}</div>
            </AdminCard>

            {/* Occupied Rooms */}
            <AdminCard padding="p-8" hover className="border border-slate-200 bg-white rounded-xl">
              <div className="flex justify-between items-start mb-3">
                <span className="text-lg font-bold text-slate-400 uppercase tracking-wider block">Occupied</span>
                <div className="p-3 bg-amber-50 rounded-lg"><DoorClosed className="w-8 h-8 text-amber-600" /></div>
              </div>
              <div className="text-[56px] font-bold text-amber-600 tracking-tight">{occupiedRoomsCount}</div>
            </AdminCard>

            {/* Full Rooms */}
            <AdminCard padding="p-8" hover className="border border-slate-200 bg-white rounded-xl">
              <div className="flex justify-between items-start mb-3">
                <span className="text-lg font-bold text-slate-400 uppercase tracking-wider block">Full</span>
                <div className="p-3 bg-red-50 rounded-lg"><DoorClosed className="w-8 h-8 text-red-600" /></div>
              </div>
              <div className="text-[56px] font-bold text-red-600 tracking-tight">{fullRoomsCount}</div>
            </AdminCard>

            {/* Current Occupants */}
            <AdminCard padding="p-8" hover className="border border-slate-200 bg-white rounded-xl">
              <div className="flex justify-between items-start mb-3">
                <span className="text-lg font-bold text-slate-400 uppercase tracking-wider block">Occupants</span>
                <div className="p-3 bg-blue-50 rounded-lg"><Users className="w-8 h-8 text-blue-600" /></div>
              </div>
              <div className="text-[56px] font-bold text-blue-600 tracking-tight">{currentOccupantsCount}</div>
            </AdminCard>

            {/* CRM Pending Enquiries */}
            <AdminCard padding="p-8" hover className="border border-slate-200 bg-white rounded-xl">
              <div className="flex justify-between items-start mb-3">
                <span className="text-lg font-bold text-slate-400 uppercase tracking-wider block">Pending Leads</span>
                <div className="p-3 bg-indigo-50 rounded-lg"><Mail className="w-8 h-8 text-indigo-600" /></div>
              </div>
              <div className="text-[56px] font-bold text-indigo-600 tracking-tight">{pendingEnquiriesCount}</div>
            </AdminCard>

          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle Column (Today's arrivals, Today's departures, Recent occupants) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Section 2: Today's Check-ins */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[28px] font-bold text-slate-400 uppercase tracking-widest">Today's Arrivals</h3>
              <Link href="/admin/occupants" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Manage Occupants →
              </Link>
            </div>
            
            <AdminCard padding="p-0" className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-xl">
              {loading ? (
                <div className="p-6"><SkeletonLoader type="table" count={2} /></div>
              ) : arrivalsToday.length === 0 ? (
                <div className="p-8 text-center text-xl text-slate-400 italic">No arrivals scheduled for today.</div>
              ) : (
                <AdminTable headers={["Guest", "Room", "Floor", "Adults", "Children", "Status"]}>
                  {arrivalsToday.map(occ => (
                    <AdminTableRow key={occ.id}>
                      <AdminTableCell>
                        <span className="font-semibold text-slate-900 block">{occ.name}</span>
                        {occ.phone && <span className="text-lg text-slate-400 block">{occ.phone}</span>}
                      </AdminTableCell>
                      <AdminTableCell>
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded bg-blue-50 text-blue-700 font-bold text-lg">{occ.roomNumber || "—"}</span>
                      </AdminTableCell>
                      <AdminTableCell>{occ.floorName || "Unassigned"}</AdminTableCell>
                      <AdminTableCell>{occ.adults || 1}</AdminTableCell>
                      <AdminTableCell>{occ.children || 0}</AdminTableCell>
                      <AdminTableCell><StatusBadge status={occ.status} /></AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTable>
              )}
            </AdminCard>
          </div>

          {/* Section 3: Today's Check-outs */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[28px] font-bold text-slate-400 uppercase tracking-widest">Today's Check-outs</h3>
              <Link href="/admin/occupants" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Manage Occupants →
              </Link>
            </div>
            
            <AdminCard padding="p-0" className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-xl">
              {loading ? (
                <div className="p-6"><SkeletonLoader type="table" count={2} /></div>
              ) : departuresToday.length === 0 ? (
                <div className="p-8 text-center text-xl text-slate-400 italic">No check-outs scheduled for today.</div>
              ) : (
                <AdminTable headers={["Guest", "Room", "Floor", "Checkout Date"]}>
                  {departuresToday.map(occ => (
                    <AdminTableRow key={occ.id}>
                      <AdminTableCell>
                        <span className="font-semibold text-slate-900 block">{occ.name}</span>
                        {occ.phone && <span className="text-lg text-slate-400 block">{occ.phone}</span>}
                      </AdminTableCell>
                      <AdminTableCell>
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded bg-blue-50 text-blue-700 font-bold text-lg">{occ.roomNumber || "—"}</span>
                      </AdminTableCell>
                      <AdminTableCell>{occ.floorName || "Unassigned"}</AdminTableCell>
                      <AdminTableCell><span className="font-mono text-lg text-slate-600">{occ.checkOut || "—"}</span></AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTable>
              )}
            </AdminCard>
          </div>

          {/* Section 3b: Upcoming Reservations (Step 8) */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[28px] font-bold text-slate-400 uppercase tracking-widest">Upcoming Reservations</h3>
              <Link href="/admin/bookings" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Manage Bookings →
              </Link>
            </div>
            
            <AdminCard padding="p-0" className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-xl">
              {loading ? (
                <div className="p-6"><SkeletonLoader type="table" count={2} /></div>
              ) : upcomingReservations.length === 0 ? (
                <div className="p-8 text-center text-xl text-slate-400 italic">No upcoming reservations found.</div>
              ) : (
                <AdminTable headers={["Guest", "Room", "Floor", "Check-in / Check-out", "Source", "Status"]}>
                  {upcomingReservations.map(res => (
                    <AdminTableRow key={res.id}>
                      <AdminTableCell>
                        <span className="font-semibold text-slate-900 block">{res.guestName}</span>
                        {res.phone && <span className="text-lg text-slate-400 block">{res.phone}</span>}
                      </AdminTableCell>
                      <AdminTableCell>
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded bg-blue-50 text-blue-700 font-bold text-lg">{res.roomNumber || "—"}</span>
                      </AdminTableCell>
                      <AdminTableCell>{res.floorName || "Unassigned"}</AdminTableCell>
                      <AdminTableCell>
                        <span className="font-mono text-lg text-slate-600 block">In: {res.checkIn || "—"}</span>
                        <span className="font-mono text-lg text-slate-400 block">Out: {res.checkOut || "—"}</span>
                      </AdminTableCell>
                      <AdminTableCell>
                        <span className="text-lg font-semibold text-slate-600">{res.bookingSource || "Direct"}</span>
                      </AdminTableCell>
                      <AdminTableCell><StatusBadge status={res.status} /></AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTable>
              )}
            </AdminCard>
          </div>

          {/* Section 4: Recent Occupants */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[28px] font-bold text-slate-400 uppercase tracking-widest">Recent Occupants</h3>
              <Link href="/admin/occupants" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                View All Occupants →
              </Link>
            </div>
            
            <AdminCard padding="p-0" className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-xl">
              {loading ? (
                <div className="p-6"><SkeletonLoader type="table" count={3} /></div>
              ) : recentOccupants.length === 0 ? (
                <div className="p-8 text-center text-xl text-slate-400 italic">No occupants registered in the system.</div>
              ) : (
                <AdminTable headers={["Guest", "Room", "Floor", "Check-in", "Status"]}>
                  {recentOccupants.map(occ => (
                    <AdminTableRow key={occ.id}>
                      <AdminTableCell>
                        <span className="font-semibold text-slate-900 block">{occ.name}</span>
                        {occ.phone && <span className="text-lg text-slate-400 block">{occ.phone}</span>}
                      </AdminTableCell>
                      <AdminTableCell>
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded bg-blue-50 text-blue-700 font-bold text-lg">{occ.roomNumber || "—"}</span>
                      </AdminTableCell>
                      <AdminTableCell>{occ.floorName || "Unassigned"}</AdminTableCell>
                      <AdminTableCell><span className="font-mono text-lg text-slate-600">{occ.checkIn || "—"}</span></AdminTableCell>
                      <AdminTableCell><StatusBadge status={occ.status} /></AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTable>
              )}
            </AdminCard>
          </div>

          {/* Section 5: Recent Activity (CRM Enquiries) */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[28px] font-bold text-slate-400 uppercase tracking-widest">Recent CRM Enquiries</h3>
              <Link href="/admin/enquiries" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                View All Enquiries →
              </Link>
            </div>
            
            <AdminCard padding="p-0" className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-xl">
              {loading ? (
                <div className="p-6">
                  <SkeletonLoader type="table" count={3} />
                </div>
              ) : recentEnquiries.length === 0 ? (
                <div className="p-12 text-center text-xl text-slate-400 italic">No recent enquiries.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentEnquiries.map(enq => (
                    <div key={enq.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-8 hover:bg-slate-50/50 transition-colors gap-6">
                      <div className="flex items-center gap-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                          <Users className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 text-xl">{enq.name || 'Unknown Guest'}</h4>
                          <p className="text-lg text-slate-500 mt-0.5">{enq.phone || enq.email || 'No contact info'}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                        <span className="text-lg text-slate-400 font-medium">
                          {enq.createdAt?.toDate ? enq.createdAt.toDate().toLocaleDateString() : 'Recent'}
                        </span>
                        <StatusBadge status={enq.status || 'New'} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AdminCard>
          </div>

        </div>

        {/* Right Column (Quick actions / links) */}
        <div className="flex flex-col gap-6">
          <h3 className="text-[28px] font-bold text-slate-400 uppercase tracking-widest">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link key={idx} href={action.href}>
                  <AdminCard padding="p-4" hover className="flex items-center gap-6 border-slate-200 hover:border-slate-300 shadow-sm cursor-pointer transition-all rounded-xl">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center border border-slate-200/40 ${action.bg}`}>
                      <Icon className={`w-5 h-5 ${action.color}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-[24px]">{action.title}</h4>
                    </div>
                  </AdminCard>
                </Link>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
