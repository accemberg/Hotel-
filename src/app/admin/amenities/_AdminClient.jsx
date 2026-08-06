"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { Trash2, Plus, RefreshCw, Edit2, ShieldCheck, Wifi, Tv, Coffee, Bath, Car, BellRing } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, writeBatch } from "firebase/firestore";

import { PageHeader } from "@/components/admin/PageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminButton } from "@/components/admin/AdminButton";
import { SkeletonLoader } from "@/components/admin/SkeletonLoader";
import { EmptyState } from "@/components/admin/EmptyState";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminInput, AdminSelect } from "@/components/admin/AdminInputs";

const CATEGORIES = ["In-Room", "Bathroom", "Dining", "Services", "Security", "Connectivity", "Outdoor"];

// Helper to get an icon based on category
const getCategoryIcon = (category) => {
  switch (category) {
    case "In-Room": return Tv;
    case "Bathroom": return Bath;
    case "Dining": return Coffee;
    case "Services": return BellRing;
    case "Security": return ShieldCheck;
    case "Connectivity": return Wifi;
    case "Outdoor": return Car;
    default: return Plus;
  }
};

export default function AmenitiesManager() {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("In-Room");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [amenityToDelete, setAmenityToDelete] = useState(null);
  
  const [seedModalOpen, setSeedModalOpen] = useState(false);

  const fetchAmenities = async () => {
    try {
      const snapshot = await getDocs(collection(db, "amenities"));
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setAmenities(data);
    } catch (err) { 
      console.warn("Amenities load warning:", err?.message || err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchAmenities(); }, []);

  const openAddModal = () => {
    setNewName(""); 
    setNewCategory("In-Room");
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (amen) => {
    setNewName(amen.name || ''); 
    setNewCategory(amen.category || 'In-Room');
    setEditingId(amen.id);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "amenities", editingId), { name: newName.trim(), category: newCategory });
      } else {
        await addDoc(collection(db, "amenities"), { name: newName.trim(), category: newCategory, createdAt: new Date() });
      }
      setIsModalOpen(false);
      await fetchAmenities();
    } catch (err) { 
      alert("Failed to save amenity."); 
    } finally { 
      setSaving(false); 
    }
  };

  const confirmDelete = (amen) => {
    setAmenityToDelete(amen);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!amenityToDelete) return;
    setSaving(true);
    try { 
      await deleteDoc(doc(db, "amenities", amenityToDelete.id)); 
      setAmenities(amenities.filter(a => a.id !== amenityToDelete.id)); 
      setDeleteModalOpen(false);
      setAmenityToDelete(null);
    } catch (err) { 
      alert("Failed to delete."); 
    } finally {
      setSaving(false);
    }
  };

  const executeSeed = async () => {
    setSaving(true);
    try {
      for (const a of amenities) await deleteDoc(doc(db, "amenities", a.id));
      const list = [
        { name: "Free Wi-Fi", category: "Connectivity" },
        { name: "LED Smart TV", category: "In-Room" },
        { name: "Air Conditioning", category: "In-Room" },
        { name: "Room Service", category: "Services" },
        { name: "Mineral Water", category: "In-Room" },
        { name: "Private Bathroom", category: "Bathroom" },
        { name: "Hot & Cold Water", category: "Bathroom" },
        { name: "Daily Housekeeping", category: "Services" },
        { name: "24/7 Front Desk", category: "Services" },
        { name: "Rooftop Restaurant", category: "Dining" },
        { name: "Luggage Storage", category: "Services" },
        { name: "Travel Desk", category: "Services" },
        { name: "Laundry Service", category: "Services" },
        { name: "Power Backup", category: "Security" },
        { name: "CCTV Security", category: "Security" },
        { name: "Parking Available", category: "Outdoor" },
      ];
      const batch = writeBatch(db);
      for (const item of list) {
        batch.set(doc(collection(db, "amenities")), { ...item, createdAt: new Date() });
      }
      await batch.commit();
      setSeedModalOpen(false);
      await fetchAmenities();
    } catch (err) { 
      alert("Failed to seed."); 
    } finally { 
      setSaving(false); 
    }
  };

  // Group by category
  const grouped = amenities.reduce((acc, a) => {
    const cat = a.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(a);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-8">
      
      <PageHeader 
        title="Amenities Manager" 
        subtitle="Organize and track property-wide and in-room amenities."
        action={
          <div className="flex items-center gap-3">
            <AdminButton variant="outline" icon={RefreshCw} onClick={() => setSeedModalOpen(true)}>
              Reset & Seed Default
            </AdminButton>
            <AdminButton icon={Plus} onClick={openAddModal}>
              Add Amenity
            </AdminButton>
          </div>
        }
      />

      {loading ? (
        <div className="flex flex-col gap-6">
          <SkeletonLoader type="table" />
          <SkeletonLoader type="table" />
        </div>
      ) : amenities.length === 0 ? (
        <EmptyState 
          icon={Coffee}
          title="No Amenities Configured" 
          description="You haven't added any amenities yet. You can add them manually or use the seed button to load standard hotel amenities."
          action={<AdminButton onClick={() => setSeedModalOpen(true)} icon={RefreshCw}>Seed Standard Amenities</AdminButton>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(grouped).sort(([catA], [catB]) => catA.localeCompare(catB)).map(([category, items]) => {
            const CatIcon = getCategoryIcon(category);
            return (
              <AdminCard key={category} padding="p-0" className="flex flex-col border border-slate-200 bg-white shadow-sm rounded-xl h-full">
                {/* Category Header */}
                <div className="px-6 py-5 flex items-center gap-3 border-b border-slate-100">
                  <div className="shrink-0">
                    <CatIcon className="w-5 h-5 text-slate-900" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">{category}</h3>
                  <span className="ml-auto text-[11px] font-bold bg-blue-50 text-blue-600 py-1 px-3 rounded-full">
                    {items.length} items
                  </span>
                </div>
                
                {/* Amenities List */}
                <div className="p-6 flex-1">
                  <ul className="grid grid-cols-2 gap-y-4 gap-x-4">
                    {items.sort((a, b) => (a.name || '').localeCompare(b.name || '')).map(amen => (
                      <li key={amen.id} className="group relative">
                        <span className="text-[13px] font-medium text-slate-600 block pr-6 leading-relaxed">{amen.name || 'Unnamed'}</span>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity bg-white pl-2">
                          <button onClick={() => openEditModal(amen)} className="text-slate-400 hover:text-blue-600 transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => confirmDelete(amen)} className="text-slate-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => !saving && setIsModalOpen(false)}
        title={editingId ? 'Edit Amenity' : 'Add New Amenity'}
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setIsModalOpen(false)} disabled={saving}>Cancel</AdminButton>
            <AdminButton onClick={handleSave} loading={saving}>Save Amenity</AdminButton>
          </>
        }
      >
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <AdminInput 
            label="Amenity Name" 
            placeholder="e.g. Free Wi-Fi" 
            required 
            value={newName} 
            onChange={e => setNewName(e.target.value)} 
            autoFocus
          />
          <AdminSelect 
            label="Category"
            value={newCategory} 
            onChange={e => setNewCategory(e.target.value)}
            options={CATEGORIES.map(c => ({ value: c, label: c }))}
          />
        </form>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={deleteModalOpen}
        onClose={() => !saving && setDeleteModalOpen(false)}
        title="Delete Amenity"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setDeleteModalOpen(false)} disabled={saving}>Cancel</AdminButton>
            <AdminButton variant="danger" onClick={executeDelete} loading={saving}>Delete</AdminButton>
          </>
        }
      >
        <div className="py-4">
          <p className="text-slate-600">Are you sure you want to delete <strong>{amenityToDelete?.name}</strong>? This will remove it from the master list.</p>
        </div>
      </AdminModal>
      
      {/* Seed Confirmation Modal */}
      <AdminModal
        isOpen={seedModalOpen}
        onClose={() => !saving && setSeedModalOpen(false)}
        title="Reset & Seed Amenities"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setSeedModalOpen(false)} disabled={saving}>Cancel</AdminButton>
            <AdminButton variant="danger" onClick={executeSeed} loading={saving}>Reset to Defaults</AdminButton>
          </>
        }
      >
        <div className="py-4">
          <p className="text-slate-600 mb-4">Are you sure you want to completely clear your current amenities list and load the standard hotel defaults?</p>
          <p className="text-red-600 font-medium text-sm">Warning: This action cannot be undone.</p>
        </div>
      </AdminModal>

    </div>
  );
}
