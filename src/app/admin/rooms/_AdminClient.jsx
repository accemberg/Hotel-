"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit2, Trash2, Image as ImageIcon, Users, IndianRupee, DoorClosed, Wifi, Building, Layers, Eye } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { fetchFloors } from "@/lib/floors";

import { PageHeader } from "@/components/admin/PageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminButton } from "@/components/admin/AdminButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SkeletonLoader } from "@/components/admin/SkeletonLoader";
import { EmptyState } from "@/components/admin/EmptyState";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminInput, AdminSelect } from "@/components/admin/AdminInputs";

const EMPTY_FORM = { 
  name: "", price: "", guests: 2, imageUrl: "", isAvailable: true,
  roomNumber: "", floorId: "", floorName: ""
};

export default function RoomsManager() {
  const [rooms, setRooms] = useState([]);
  const [floors, setFloors] = useState([]);
  const [occupants, setOccupants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);

  // ─── Room Profile Details States ─────────────────────────────────────────
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedRoomForProfile, setSelectedRoomForProfile] = useState(null);
  const [profileOccupants, setProfileOccupants] = useState([]);
  const [profileBookings, setProfileBookings] = useState([]);
  const [loadingProfileOccupants, setLoadingProfileOccupants] = useState(false);

  const [housekeeping, setHousekeeping] = useState([]);

  // ─── Data Loading ────────────────────────────────────────────────────────
  const loadRooms = async () => {
    try {
      const snapshot = await getDocs(collection(db, "rooms"));
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setRooms(data);
      
      // Also load active occupants and housekeeping records
      const occSnapshot = await getDocs(
        query(collection(db, "occupants"), where("status", "==", "Checked In"))
      );
      const occData = occSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setOccupants(occData);

      const hkSnapshot = await getDocs(collection(db, "housekeeping"));
      const hkData = hkSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setHousekeeping(hkData);
    } catch (err) { 
      setError("Could not load rooms."); 
    } finally { 
      setLoading(false); 
    }
  };

  const loadFloors = async () => {
    try {
      const data = await fetchFloors();
      setFloors(data);
    } catch (err) {
      console.warn("RoomsManager: failed to load floors:", err?.message || err);
    }
  };

  useEffect(() => {
    loadRooms();
    loadFloors();
  }, []);

  // ─── Sorting ─────────────────────────────────────────────────────────────
  const sortedRooms = [...rooms].sort((a, b) => {
    const floorA = floors.find(f => f.id === a.floorId);
    const floorB = floors.find(f => f.id === b.floorId);
    const orderA = floorA?.displayOrder ?? 9999;
    const orderB = floorB?.displayOrder ?? 9999;
    if (orderA !== orderB) return orderA - orderB;
    return (a.roomNumber || "").localeCompare(b.roomNumber || "", undefined, { numeric: true });
  });

  // ─── Floor dropdown options ──────────────────────────────────────────────
  const floorOptions = [
    { value: "", label: "Select a floor…" },
    ...floors
      .filter(f => f.active !== false)
      .map(f => ({ value: f.id, label: f.name }))
  ];

  // ─── Modal helpers ────────────────────────────────────────────────────────
  const openAddModal = () => {
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (room) => {
    setFormData({ 
      name: room.name || room.title || '', 
      price: room.price || 0, 
      guests: room.guests || 2, 
      imageUrl: room.imageUrl || room.image || room.url || '', 
      isAvailable: room.isAvailable !== false,
      roomNumber: room.roomNumber || '',
      floorId: room.floorId || '',
      floorName: room.floorName || '',
    });
    setFormErrors({});
    setEditingId(room.id);
    setIsModalOpen(true);
  };

  const confirmDelete = (room) => {
    setRoomToDelete(room);
    setDeleteModalOpen(true);
  };

  // ─── Profile Modal Trigger ───────────────────────────────────────────────
  const openProfileModal = async (room) => {
    setSelectedRoomForProfile(room);
    setProfileModalOpen(true);
    setLoadingProfileOccupants(true);
    try {
      const occQuery = query(collection(db, "occupants"), where("roomId", "==", room.id));
      const bookQuery = query(collection(db, "bookings"), where("roomId", "==", room.id));
      
      const [occSnapshot, bookSnapshot] = await Promise.all([
        getDocs(occQuery),
        getDocs(bookQuery)
      ]);

      const occData = occSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const bookData = bookSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      setProfileOccupants(occData);
      setProfileBookings(bookData);
    } catch (err) {
      console.warn("RoomsManager: failed to fetch occupants or bookings for room profile:", err?.message || err);
    } finally {
      setLoadingProfileOccupants(false);
    }
  };

  const handleRemoveOccupantFromProfile = async (occId) => {
    if (!confirm("Are you sure you want to permanently remove this occupant?")) return;
    try {
      await deleteDoc(doc(db, "occupants", occId));
      setProfileOccupants(prev => prev.filter(o => o.id !== occId));
      await loadRooms(); // Refresh overall room stats on the main list
    } catch (err) {
      console.error("RoomsManager: failed to remove occupant:", err);
      alert("Failed to remove occupant.");
    }
  };

  // ─── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const errors = {};
    const trimmedRoomNumber = (formData.roomNumber || "").trim();

    if (!trimmedRoomNumber) {
      errors.roomNumber = "Room number is required.";
    } else {
      const duplicate = rooms.find(
        (r) =>
          (r.roomNumber || "").trim().toLowerCase() === trimmedRoomNumber.toLowerCase() &&
          r.id !== editingId
      );
      if (duplicate) {
        errors.roomNumber = `Room number "${trimmedRoomNumber}" is already assigned to another room.`;
      }
    }

    if (!formData.floorId) {
      errors.floorId = "Please select a floor.";
    }

    return errors;
  };

  // ─── Save ─────────────────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const selectedFloor = floors.find(f => f.id === formData.floorId);
      const payload = {
        name: formData.name, 
        price: Number(formData.price),
        guests: Number(formData.guests), 
        imageUrl: formData.imageUrl,
        isAvailable: formData.isAvailable,
        roomNumber: formData.roomNumber.trim(),
        floorId: formData.floorId,
        floorName: selectedFloor?.name || formData.floorName || '',
      };
      
      if (editingId) {
        await updateDoc(doc(db, "rooms", editingId), payload);
      } else {
        await addDoc(collection(db, "rooms"), { ...payload, createdAt: new Date() });
      }
      
      setIsModalOpen(false);
      setEditingId(null);
      setFormErrors({});
      await loadRooms();
    } catch (err) { 
      alert("Failed to save room."); 
    } finally { 
      setSaving(false); 
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────
  const executeDelete = async () => {
    if (!roomToDelete) return;
    setSaving(true);
    try { 
      await deleteDoc(doc(db, "rooms", roomToDelete.id)); 
      setRooms(rooms.filter(r => r.id !== roomToDelete.id)); 
      setDeleteModalOpen(false);
      setRoomToDelete(null);
    } catch (err) { 
      alert("Failed to delete."); 
    } finally {
      setSaving(false);
    }
  };

  // ─── Toggle Availability ──────────────────────────────────────────────────
  const toggleAvailability = async (id, currentVal) => {
    // Optimistic UI update
    setRooms(rooms.map(r => r.id === id ? { ...r, isAvailable: !currentVal } : r));
    try {
      await updateDoc(doc(db, "rooms", id), { isAvailable: !currentVal });
    } catch (err) {
      alert("Failed to update status.");
      // Revert on error
      setRooms(rooms.map(r => r.id === id ? { ...r, isAvailable: currentVal } : r));
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-8">
      
      <PageHeader 
        title="Rooms Manager" 
        subtitle="Manage hotel rooms, pricing, capacity, and availability."
        action={
          <AdminButton icon={Plus} onClick={openAddModal}>
            Add Room
          </AdminButton>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <SkeletonLoader type="card" count={4} />
        </div>
      ) : error ? (
        <EmptyState title="Error Loading Rooms" description={error} />
      ) : rooms.length === 0 ? (
        <EmptyState 
          icon={DoorClosed}
          title="No Rooms Available" 
          description="Your hotel currently has no rooms listed. Add your first room to get started."
          action={<AdminButton onClick={openAddModal} icon={Plus}>Add First Room</AdminButton>}
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {sortedRooms.map((room) => {
            const imgUrl = room.imageUrl || room.image || room.url || '';
            const isAvailable = room.isAvailable !== false;
            
            const displayRoomNumber = room.roomNumber || '—';
            const displayFloorName = room.floorName || 'Unassigned';
            
            const roomOccs = occupants.filter(o => o.roomId === room.id);
            const currentGuests = roomOccs.reduce(
              (sum, occ) => sum + Number(occ.adults || 0) + Number(occ.children || 0),
              0
            );
            const isOccupied = roomOccs.length > 0;
            const hkStatus = housekeeping.find(h => h.roomId === room.id)?.status || 'Clean';

            return (
              <AdminCard key={room.id} padding="p-0" hover className="overflow-hidden flex flex-col sm:flex-row group border border-slate-200 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                {/* Image Section */}
                <div 
                  onClick={() => openProfileModal(room)}
                  className="relative sm:w-2/5 aspect-video sm:aspect-auto sm:h-auto bg-slate-50 border-b sm:border-b-0 sm:border-r border-slate-200 overflow-hidden cursor-pointer shrink-0"
                >
                  {imgUrl ? (
                    <img 
                      src={imgUrl} 
                      alt={room.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out absolute inset-0" 
                      onError={e => { e.target.style.display = 'none'; }} 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 absolute inset-0">
                      <ImageIcon className="w-10 h-10 opacity-30 animate-pulse" />
                    </div>
                  )}
                  {/* Status Overlay for Hidden */}
                  {!isAvailable && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                      <span className="bg-slate-900/80 text-white text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-md backdrop-blur-sm">Hidden</span>
                    </div>
                  )}
                </div>

                {/* Body Section */}
                <div className="p-8 sm:p-10 flex-1 flex flex-col gap-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 
                        onClick={() => openProfileModal(room)}
                        className="font-bold text-slate-900 text-[32px] leading-snug hover:text-blue-600 transition-colors cursor-pointer" 
                      >
                        {room.name || 'Unnamed Room'}
                      </h3>
                      <div className="text-[20px] font-semibold text-slate-400 mt-2 uppercase tracking-wider">
                        Room {displayRoomNumber}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                      {isAvailable && <StatusBadge status="Available" />}
                      <StatusBadge status={hkStatus} />
                    </div>
                  </div>
                  
                  {/* Capacity & Amenities Count Grid */}
                  <div className="flex items-center gap-6 text-[22px] text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                      <Users className="w-6 h-6 text-slate-400 shrink-0 shrink-0" />
                      <span>{room.guests || 2} Guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DoorClosed className="w-6 h-6 text-slate-400 shrink-0 shrink-0" />
                      <span className={isOccupied ? "text-amber-600" : "text-slate-500"}>
                        {isOccupied ? "Occupied" : "Vacant"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-slate-100 my-4"></div>
                  
                  {/* Footer - Base Rate & Actions */}
                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <span className="text-[16px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Base Rate</span>
                      <p className="flex items-baseline gap-1 text-slate-900 font-bold text-4xl">
                        ₹{room.price || 0}
                        <span className="text-[20px] font-medium text-slate-500">/night</span>
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <AdminButton variant="outline" size="icon" className="h-14 w-14 text-slate-500 border-slate-200" onClick={() => openEditModal(room)} title="Edit Room">
                        <Edit2 className="w-6 h-6" />
                      </AdminButton>
                      <AdminButton variant="danger-ghost" size="icon" className="h-14 w-14 border border-red-100 bg-red-50 text-red-500 hover:bg-red-100" onClick={() => confirmDelete(room)} title="Delete Room">
                        <Trash2 className="w-6 h-6" />
                      </AdminButton>
                    </div>
                  </div>
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}

      {/* Add / Edit Room Modal */}
      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => { if (!saving) { setIsModalOpen(false); setFormErrors({}); } }}
        title={editingId ? 'Edit Room' : 'Add New Room'}
        maxWidth="max-w-2xl"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => { setIsModalOpen(false); setFormErrors({}); }} disabled={saving}>Cancel</AdminButton>
            <AdminButton onClick={handleSave} loading={saving}>Save Room</AdminButton>
          </>
        }
      >
        <form id="roomForm" onSubmit={handleSave} className="flex flex-col gap-6">
          {/* Room Number & Floor row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminInput 
              label="Room Number" 
              placeholder="e.g. 101, 201, 302" 
              required 
              value={formData.roomNumber} 
              onChange={e => {
                setFormData({...formData, roomNumber: e.target.value});
                if (formErrors.roomNumber) setFormErrors({...formErrors, roomNumber: undefined});
              }}
              error={formErrors.roomNumber}
              autoFocus
            />
            <AdminSelect
              label="Floor"
              required
              options={floorOptions}
              value={formData.floorId}
              onChange={e => {
                const selectedFloor = floors.find(f => f.id === e.target.value);
                setFormData({
                  ...formData,
                  floorId: e.target.value,
                  floorName: selectedFloor?.name || ""
                });
                if (formErrors.floorId) setFormErrors({...formErrors, floorId: undefined});
              }}
              error={formErrors.floorId}
            />
          </div>

          {/* Room Name, Price, Capacity, Visibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminInput 
              label="Room Name" 
              placeholder="e.g. Deluxe Heritage Suite" 
              required 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
            <AdminInput 
              label="Base Price (₹ per night)" 
              type="number" 
              min="0"
              placeholder="2500" 
              required 
              value={formData.price} 
              onChange={e => setFormData({...formData, price: e.target.value})} 
            />
            <AdminInput 
              label="Capacity (Guests)" 
              type="number" 
              min="1"
              placeholder="2" 
              required 
              value={formData.guests} 
              onChange={e => setFormData({...formData, guests: e.target.value})} 
            />
            
            <div className="flex flex-col justify-center">
              <label className="block text-sm font-medium text-slate-700 mb-2">Visibility</label>
              <div className="flex items-center gap-3">
                <Switch 
                  checked={formData.isAvailable} 
                  onCheckedChange={(val) => setFormData({...formData, isAvailable: val})} 
                />
                <span className="text-sm font-medium text-slate-700">
                  {formData.isAvailable ? 'Public (Available for booking)' : 'Hidden (Internal only)'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-6 mt-2">
            <AdminInput 
              label="Room Image URL" 
              type="url"
              placeholder="https://example.com/room-image.jpg" 
              value={formData.imageUrl} 
              onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
            />
            
            {formData.imageUrl && (
              <div className="mt-4 rounded-lg overflow-hidden border border-slate-200 aspect-video relative bg-slate-50">
                <img 
                  src={formData.imageUrl} 
                  alt="Room preview" 
                  className="w-full h-full object-cover" 
                  onError={e => { e.target.style.display = 'none'; }} 
                />
              </div>
            )}
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={deleteModalOpen}
        onClose={() => !saving && setDeleteModalOpen(false)}
        title="Delete Room"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setDeleteModalOpen(false)} disabled={saving}>Cancel</AdminButton>
            <AdminButton variant="danger" onClick={executeDelete} loading={saving}>Delete Permanently</AdminButton>
          </>
        }
      >
        <div className="py-4">
          <p className="text-slate-600">Are you sure you want to permanently delete <strong>{roomToDelete?.name}</strong>? This action cannot be undone.</p>
        </div>
      </AdminModal>

      {/* ── Room Profile Detail Modal ─────────────────────────────────────── */}
      <AdminModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="Room Profile & Occupancy"
        maxWidth="max-w-4xl"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => {
              setProfileModalOpen(false);
              openEditModal(selectedRoomForProfile);
            }}>
              Edit Room
            </AdminButton>
            <AdminButton onClick={() => {
              window.location.href = `/admin/occupants`;
            }}>
              Manage Occupants
            </AdminButton>
            <AdminButton variant="ghost" onClick={() => setProfileModalOpen(false)}>
              Close Profile
            </AdminButton>
          </>
        }
      >
        {selectedRoomForProfile && (() => {
          const room = selectedRoomForProfile;
          const roomOccs = profileOccupants;
          
          // Calculated Metrics
          const currentCheckedInGuests = roomOccs
            .filter(o => o.status === "Checked In")
            .reduce((sum, o) => sum + Number(o.adults || 0) + Number(o.children || 0), 0);
          
          const maxCapacity = Number(room.guests || 2);
          const remainingCapacity = Math.max(0, maxCapacity - currentCheckedInGuests);
          
          // calculated PMS status
          let pmsStatus = "Vacant";
          if (currentCheckedInGuests >= maxCapacity) {
            pmsStatus = "Full";
          } else if (currentCheckedInGuests > 0) {
            pmsStatus = "Occupied";
          }

          const imgUrl = room.imageUrl || room.image || room.url || '';

          return (
            <div className="flex flex-col gap-6 text-slate-700">
              
              {/* Top Section: Side-by-side Image & Header Specification details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image */}
                <div className="relative aspect-video w-full bg-slate-50 border border-slate-200 overflow-hidden rounded-xl">
                  {imgUrl ? (
                    <img 
                      src={imgUrl} 
                      alt={room.name} 
                      className="w-full h-full object-cover" 
                      onError={e => { e.target.style.display = 'none'; }} 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                      <ImageIcon className="w-12 h-12 opacity-30" />
                    </div>
                  )}
                </div>

                {/* Specs */}
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5" />
                      <span>Room {room.roomNumber || '—'} • {room.floorName || 'Unassigned'}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-2">
                      {room.name || 'Unnamed Room'}
                    </h2>
                    
                    <div className="flex items-center gap-2 flex-wrap mb-4">
                      <StatusBadge status={room.isAvailable !== false ? 'Available' : 'Hidden'} />
                      <StatusBadge status={pmsStatus} />
                      <StatusBadge status={housekeeping.find(h => h.roomId === room.id)?.status || 'Clean'} />
                    </div>

                    <p className="text-sm text-slate-500 leading-relaxed mb-4">
                      {room.description || "No description provided for this room."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block">Base Rate</span>
                      <span className="text-xl font-bold text-slate-900">₹{room.price || 0} <span className="text-xs text-slate-400 font-normal">/ night</span></span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block">Max Guests</span>
                      <span className="text-lg font-semibold text-slate-700">{maxCapacity} Capacity</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Occupancy Summary Card Row */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 text-center">
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Max Capacity</span>
                  <span className="text-lg font-bold text-slate-900 block mt-1">{maxCapacity} Guests</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Current Guests</span>
                  <span className="text-lg font-bold text-blue-600 block mt-1">{currentCheckedInGuests} Guests</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Available</span>
                  <span className={`text-lg font-bold block mt-1 ${remainingCapacity <= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {remainingCapacity} {remainingCapacity === 1 ? 'Guest' : 'Guests'}
                  </span>
                </div>
              </div>

              {/* Amenities block */}
              {room.amenities && room.amenities.length > 0 && (
                <div className="border-t border-slate-100 pt-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Amenities</span>
                  <div className="flex flex-wrap gap-1.5">
                    {room.amenities.map((amenity) => (
                      <span key={amenity} className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-600">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Occupants list */}
              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assigned Occupants ({roomOccs.length})</span>
                  <AdminButton 
                    variant="outline" 
                    size="xs" 
                    icon={Plus} 
                    onClick={() => {
                      window.location.href = `/admin/occupants`;
                    }}
                  >
                    Add Occupant
                  </AdminButton>
                </div>

                {loadingProfileOccupants ? (
                  <SkeletonLoader type="table" count={2} />
                ) : roomOccs.length === 0 ? (
                  <EmptyState 
                    icon={Users}
                    title="No occupants assigned"
                    description="There are currently no occupants registered in this room."
                  />
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <AdminTable
                      headers={["Guest Name", "Phone", "Status", "Adults / Children", "Check-in / Check-out", "ID Details", "Actions"]}
                    >
                      {roomOccs.map((occ) => (
                        <AdminTableRow key={occ.id}>
                          <AdminTableCell>
                            <span className="font-semibold text-slate-800">{occ.name}</span>
                            {occ.email && <span className="text-xs text-slate-400 block mt-0.5">{occ.email}</span>}
                          </AdminTableCell>
                          <AdminTableCell>
                            <span className="text-slate-600 font-mono text-[13px]">{occ.phone || "—"}</span>
                          </AdminTableCell>
                          <AdminTableCell>
                            <StatusBadge status={occ.status} />
                          </AdminTableCell>
                          <AdminTableCell>
                            <span className="text-slate-600 font-medium">{occ.adults || 1} A / {occ.children || 0} C</span>
                          </AdminTableCell>
                          <AdminTableCell>
                            <span className="text-slate-600 font-mono text-xs block">In: {occ.checkIn || "—"}</span>
                            <span className="text-slate-400 font-mono text-xs block">Out: {occ.checkOut || "—"}</span>
                          </AdminTableCell>
                          <AdminTableCell>
                            {occ.idType ? (
                              <span className="text-xs text-slate-500 block">
                                {occ.idType}: <strong className="text-slate-700 font-mono">{occ.idNumber || "—"}</strong>
                              </span>
                            ) : (
                              <span className="text-slate-300 italic text-xs">—</span>
                            )}
                          </AdminTableCell>
                          <AdminTableCell>
                            <div className="flex items-center gap-1.5">
                              <AdminButton
                                variant="outline"
                                size="xs"
                                icon={Eye}
                                onClick={() => {
                                  window.location.href = `/admin/occupants?search=${encodeURIComponent(occ.name || '')}`;
                                }}
                              >
                                View
                              </AdminButton>
                              <AdminButton
                                variant="danger-ghost"
                                size="xs"
                                onClick={() => handleRemoveOccupantFromProfile(occ.id)}
                              >
                                Remove
                              </AdminButton>
                            </div>
                          </AdminTableCell>
                        </AdminTableRow>
                      ))}
                    </AdminTable>
                  </div>
                )}
              </div>

              {/* Upcoming Bookings list (Step 9) */}
              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upcoming Reservations ({profileBookings.length})</span>
                  <AdminButton 
                    variant="outline" 
                    size="xs" 
                    icon={Plus} 
                    onClick={() => {
                      window.location.href = `/admin/bookings`;
                    }}
                  >
                    Add Booking
                  </AdminButton>
                </div>

                {loadingProfileOccupants ? (
                  <SkeletonLoader type="table" count={2} />
                ) : profileBookings.length === 0 ? (
                  <EmptyState 
                    icon={DoorClosed}
                    title="No upcoming bookings"
                    description="There are currently no upcoming reservations for this room."
                  />
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <AdminTable
                      headers={["Guest Name", "Phone", "Status", "Dates", "Source", "Actions"]}
                    >
                      {profileBookings.map((b) => (
                        <AdminTableRow key={b.id}>
                          <AdminTableCell>
                            <span className="font-semibold text-slate-800">{b.guestName}</span>
                            {b.email && <span className="text-xs text-slate-400 block mt-0.5">{b.email}</span>}
                          </AdminTableCell>
                          <AdminTableCell>
                            <span className="text-slate-600 font-mono text-[13px]">{b.phone || "—"}</span>
                          </AdminTableCell>
                          <AdminTableCell>
                            <StatusBadge status={b.status} />
                          </AdminTableCell>
                          <AdminTableCell>
                            <span className="text-slate-600 font-mono text-xs block">In: {b.checkIn || "—"}</span>
                            <span className="text-slate-400 font-mono text-xs block">Out: {b.checkOut || "—"}</span>
                          </AdminTableCell>
                          <AdminTableCell>
                            <span className="text-xs font-semibold text-slate-600">{b.bookingSource || "Direct"}</span>
                          </AdminTableCell>
                          <AdminTableCell>
                            <AdminButton
                              variant="outline"
                              size="xs"
                              onClick={() => {
                                window.location.href = `/admin/bookings?search=${encodeURIComponent(b.guestName || '')}`;
                              }}
                            >
                              Manage
                            </AdminButton>
                          </AdminTableCell>
                        </AdminTableRow>
                      ))}
                    </AdminTable>
                  </div>
                )}
              </div>

            </div>
          );
        })()}
      </AdminModal>

    </div>
  );
}
