"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { Trash2, Plus, RefreshCw, Upload, Image as ImageIcon } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, writeBatch } from "firebase/firestore";

import { PageHeader } from "@/components/admin/PageHeader";
import { AdminButton } from "@/components/admin/AdminButton";
import { SkeletonLoader } from "@/components/admin/SkeletonLoader";
import { EmptyState } from "@/components/admin/EmptyState";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminInput, AdminSelect } from "@/components/admin/AdminInputs";

const GALLERY_CATEGORIES = ["Exterior", "Rooms", "Dining", "Events", "Amenities", "Other"];

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState("Exterior");
  const [saving, setSaving] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  
  const [seedModalOpen, setSeedModalOpen] = useState(false);

  const fetchGallery = async () => {
    try {
      const snapshot = await getDocs(collection(db, "gallery"));
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setImages(data);
    } catch (err) { 
      console.warn("Gallery load warning:", err?.message || err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchGallery(); }, []);

  const openAddModal = () => {
    setNewUrl("");
    setNewCategory("Exterior");
    setIsModalOpen(true);
  };

  const handleAdd = async (e) => {
    if (e) e.preventDefault();
    if (!newUrl.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "gallery"), { 
        url: newUrl.trim(), 
        category: newCategory, 
        createdAt: new Date() 
      });
      setIsModalOpen(false);
      await fetchGallery();
    } catch (err) { 
      alert("Failed to add image."); 
    } finally { 
      setSaving(false); 
    }
  };

  const confirmDelete = (img) => {
    setImageToDelete(img);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!imageToDelete) return;
    setSaving(true);
    try { 
      await deleteDoc(doc(db, "gallery", imageToDelete.id)); 
      setImages(images.filter(img => img.id !== imageToDelete.id)); 
      setDeleteModalOpen(false);
      setImageToDelete(null);
    } catch (err) { 
      alert("Failed to delete."); 
    } finally {
      setSaving(false);
    }
  };

  const executeSeed = async () => {
    setSaving(true);
    try {
      for (const img of images) await deleteDoc(doc(db, "gallery", img.id));
      const demos = [
        { url: "https://images.unsplash.com/photo-1542314831-c53cd4b85aca?auto=format&fit=crop&q=80&w=800", category: "Exterior" },
        { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800", category: "Rooms" },
        { url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800", category: "Rooms" },
        { url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800", category: "Dining" },
      ];
      const batch = writeBatch(db);
      for (const item of demos) batch.set(doc(collection(db, "gallery")), { ...item, createdAt: new Date() });
      await batch.commit();
      setSeedModalOpen(false);
      await fetchGallery();
    } catch (err) { 
      alert("Failed to seed gallery."); 
    } finally { 
      setSaving(false); 
    }
  };

  // Group by category
  const grouped = images.reduce((acc, img) => {
    const cat = img.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(img);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-8">
      
      <PageHeader 
        title="Gallery Manager" 
        subtitle="Manage your property photos across different categories."
        action={
          <div className="flex items-center gap-3">
            <AdminButton variant="outline" icon={RefreshCw} onClick={() => setSeedModalOpen(true)}>
              Seed Demo
            </AdminButton>
            <AdminButton icon={Upload} onClick={openAddModal}>
              Upload Image
            </AdminButton>
          </div>
        }
      />

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <SkeletonLoader type="card" count={8} />
        </div>
      ) : images.length === 0 ? (
        <EmptyState 
          icon={ImageIcon}
          title="No Images Uploaded" 
          description="Your gallery is currently empty. Upload your first image or use the seed button to load sample hotel photos."
          action={<AdminButton onClick={openAddModal} icon={Upload}>Upload First Image</AdminButton>}
        />
      ) : (
        <div className="flex flex-col gap-10">
          {Object.entries(grouped).sort(([catA], [catB]) => catA.localeCompare(catB)).map(([category, imgs]) => (
            <div key={category} className="flex flex-col gap-6">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{category}</h3>
                <span className="text-[11px] font-bold bg-blue-50 text-blue-600 py-1 px-3 rounded-full">
                  {imgs.length} {imgs.length === 1 ? 'photo' : 'photos'}
                </span>
              </div>
              
              {/* Image Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {imgs.map(img => {
                  const imageUrl = img.url || img.src || img.imageUrl || img.image || '';
                  return (
                    <div 
                      key={img.id} 
                      className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out"
                    >
                      <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden">
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={category} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            onError={(e) => { e.target.style.display = 'none'; }} 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100">
                            <span className="text-slate-400 font-semibold text-sm">No Image</span>
                          </div>
                        )}
                        
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[1px] z-10">
                          <AdminButton variant="danger" size="sm" onClick={() => confirmDelete(img)}>
                            Delete
                          </AdminButton>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Image Modal */}
      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => !saving && setIsModalOpen(false)}
        title="Upload Image"
        maxWidth="max-w-md"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setIsModalOpen(false)} disabled={saving}>Cancel</AdminButton>
            <AdminButton onClick={handleAdd} loading={saving}>Save Image</AdminButton>
          </>
        }
      >
        <form onSubmit={handleAdd} className="flex flex-col gap-6">
          <AdminInput 
            label="Image URL" 
            type="url"
            placeholder="https://example.com/image.jpg" 
            required 
            value={newUrl} 
            onChange={e => setNewUrl(e.target.value)} 
            autoFocus
          />
          <AdminSelect 
            label="Category"
            value={newCategory} 
            onChange={e => setNewCategory(e.target.value)}
            options={GALLERY_CATEGORIES.map(c => ({ value: c, label: c }))}
          />
          
          {newUrl && (
            <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-50">
              <img 
                src={newUrl} 
                alt="Preview" 
                className="w-full h-full object-cover" 
                onError={e => { e.target.style.display = 'none'; }} 
              />
            </div>
          )}
        </form>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={deleteModalOpen}
        onClose={() => !saving && setDeleteModalOpen(false)}
        title="Delete Image"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setDeleteModalOpen(false)} disabled={saving}>Cancel</AdminButton>
            <AdminButton variant="danger" onClick={executeDelete} loading={saving}>Delete</AdminButton>
          </>
        }
      >
        <div className="py-4">
          <p className="text-slate-600">Are you sure you want to permanently delete this image from the gallery?</p>
        </div>
      </AdminModal>
      
      {/* Seed Confirmation Modal */}
      <AdminModal
        isOpen={seedModalOpen}
        onClose={() => !saving && setSeedModalOpen(false)}
        title="Seed Demo Gallery"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setSeedModalOpen(false)} disabled={saving}>Cancel</AdminButton>
            <AdminButton variant="danger" onClick={executeSeed} loading={saving}>Reset & Seed</AdminButton>
          </>
        }
      >
        <div className="py-4">
          <p className="text-slate-600 mb-4">Are you sure you want to clear your current gallery and load the standard hotel demo photos?</p>
          <p className="text-red-600 font-medium text-sm">Warning: This action cannot be undone.</p>
        </div>
      </AdminModal>

    </div>
  );
}
