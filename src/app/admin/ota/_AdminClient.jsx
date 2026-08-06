"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, ArrowUp, ArrowDown, ExternalLink, Link as LinkIcon } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore";

import { PageHeader } from "@/components/admin/PageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminButton } from "@/components/admin/AdminButton";
import { SkeletonLoader } from "@/components/admin/SkeletonLoader";
import { EmptyState } from "@/components/admin/EmptyState";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminInput, AdminSelect } from "@/components/admin/AdminInputs";

const PLATFORMS = [
  { name: "Booking.com", logo: "🏨" },
  { name: "MakeMyTrip", logo: "✈️" },
  { name: "Goibibo", logo: "🌐" },
  { name: "Airbnb", logo: "🏠" },
  { name: "Agoda", logo: "🛎️" },
  { name: "Expedia", logo: "🌍" },
  { name: "TripAdvisor", logo: "🦉" },
  { name: "OYO", logo: "🏷️" },
  { name: "Other", logo: "🔗" },
];

export default function OTALinksManager() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);

  const [formData, setFormData] = useState({ 
    platform: "Booking.com", 
    url: "", 
    isActive: true 
  });

  const fetchLinks = async () => {
    try {
      const snapshot = await getDocs(collection(db, "otaLinks"));
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (a.order || 0) - (b.order || 0));
      setLinks(data);
    } catch (err) { 
      console.warn("OTA links load warning:", err?.message || err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchLinks(); }, []);

  const openAddModal = () => {
    setFormData({ platform: "Booking.com", url: "", isActive: true });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!formData.url.trim()) return;
    setSaving(true);
    try {
      const platform = PLATFORMS.find(p => p.name === formData.platform) || { name: formData.platform, logo: "🔗" };
      await addDoc(collection(db, "otaLinks"), {
        platform: platform.name, 
        logo: platform.logo,
        url: formData.url.trim(), 
        isActive: formData.isActive,
        order: links.length, 
        createdAt: new Date()
      });
      setIsModalOpen(false);
      await fetchLinks();
    } catch (err) { 
      alert("Failed to save."); 
    } finally { 
      setSaving(false); 
    }
  };

  const confirmDelete = (link) => {
    setLinkToDelete(link);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!linkToDelete) return;
    setSaving(true);
    try { 
      await deleteDoc(doc(db, "otaLinks", linkToDelete.id)); 
      setLinks(links.filter(l => l.id !== linkToDelete.id)); 
      setDeleteModalOpen(false);
      setLinkToDelete(null);
    } catch (err) { 
      alert("Failed to delete."); 
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id, currentVal) => {
    setLinks(links.map(l => l.id === id ? { ...l, isActive: !currentVal } : l));
    try {
      await updateDoc(doc(db, "otaLinks", id), { isActive: !currentVal });
    } catch (err) { 
      alert("Failed to update status."); 
      setLinks(links.map(l => l.id === id ? { ...l, isActive: currentVal } : l));
    }
  };

  const moveItem = async (index, direction) => {
    const newLinks = [...links];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newLinks.length) return;
    
    // Swap items
    [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];
    setLinks(newLinks);
    
    try {
      const batch = writeBatch(db);
      newLinks.forEach((link, i) => batch.update(doc(db, "otaLinks", link.id), { order: i }));
      await batch.commit();
    } catch (err) { 
      console.error(err); 
    }
  };

  return (
    <div className="flex flex-col gap-8">
      
      <PageHeader 
        title="OTA Integrations" 
        subtitle="Manage your connected booking platforms (MakeMyTrip, Agoda, etc.)."
        action={
          <AdminButton icon={Plus} onClick={openAddModal}>
            Connect Platform
          </AdminButton>
        }
      />

      {loading ? (
        <AdminCard padding="p-0">
          <SkeletonLoader type="table" count={4} />
        </AdminCard>
      ) : links.length === 0 ? (
        <EmptyState 
          icon={LinkIcon}
          title="No OTA Platforms Connected" 
          description="You haven't added any Online Travel Agency (OTA) links yet. Connect platforms to display them on your website."
          action={<AdminButton onClick={openAddModal} icon={Plus}>Connect First Platform</AdminButton>}
        />
      ) : (
        <AdminCard padding="p-0" className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-xl">
          <div className="bg-slate-50/80 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Connected Platforms</h3>
            <span className="text-[11px] font-bold bg-slate-100 text-slate-500 py-1 px-3 rounded-full border border-slate-200/50">
              {links.length} Connected
            </span>
          </div>
          
          <ul className="divide-y divide-slate-100">
            {links.map((link, index) => (
              <li key={link.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors gap-4">
                
                {/* Platform Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200/60 shadow-sm text-2xl shrink-0">
                    {link.logo || "🔗"}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-[16px] flex items-center gap-2">
                      {link.platform}
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </h4>
                    <p className="text-[13px] text-slate-500 max-w-xs md:max-w-md truncate mt-0.5">{link.url}</p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-6 justify-between sm:justify-end shrink-0">
                  
                  {/* Visibility Toggle */}
                  <div className="flex items-center gap-2.5">
                    <Switch 
                      checked={link.isActive !== false} 
                      onCheckedChange={() => toggleActive(link.id, link.isActive !== false)} 
                    />
                    <span className={`text-[13px] font-bold uppercase tracking-wider w-16 ${link.isActive !== false ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {link.isActive !== false ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  
                  <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 border border-slate-200/50 rounded-xl">
                      <button 
                        onClick={() => moveItem(index, -1)} 
                        disabled={index === 0} 
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => moveItem(index, 1)} 
                        disabled={index === links.length - 1} 
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <AdminButton 
                      variant="danger" 
                      size="sm"
                      onClick={() => confirmDelete(link)} 
                    >
                      Delete
                    </AdminButton>
                  </div>
                </div>
                
              </li>
            ))}
          </ul>
        </AdminCard>
      )}

      {/* Add Platform Modal */}
      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => !saving && setIsModalOpen(false)}
        title="Connect OTA Platform"
        maxWidth="max-w-md"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setIsModalOpen(false)} disabled={saving}>Cancel</AdminButton>
            <AdminButton onClick={handleSave} loading={saving}>Add Platform</AdminButton>
          </>
        }
      >
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <AdminSelect 
            label="Booking Platform"
            value={formData.platform} 
            onChange={e => setFormData({...formData, platform: e.target.value})}
            options={PLATFORMS.map(p => ({ value: p.name, label: `${p.logo} ${p.name}` }))}
          />
          <AdminInput 
            label="Listing URL" 
            type="url"
            placeholder="https://www.booking.com/hotel/..." 
            required 
            value={formData.url} 
            onChange={e => setFormData({...formData, url: e.target.value})} 
          />
          
          <div className="flex flex-col justify-center border-t border-slate-200 pt-5">
            <label className="block text-sm font-medium text-slate-700 mb-2">Website Visibility</label>
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <Switch 
                checked={formData.isActive} 
                onCheckedChange={(val) => setFormData({...formData, isActive: val})} 
              />
              <span className="text-sm font-medium text-slate-700">
                {formData.isActive ? 'Visible on website' : 'Hidden from website'}
              </span>
            </div>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={deleteModalOpen}
        onClose={() => !saving && setDeleteModalOpen(false)}
        title="Remove Platform"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setDeleteModalOpen(false)} disabled={saving}>Cancel</AdminButton>
            <AdminButton variant="danger" onClick={executeDelete} loading={saving}>Remove</AdminButton>
          </>
        }
      >
        <div className="py-4">
          <p className="text-slate-600">Are you sure you want to remove <strong>{linkToDelete?.platform}</strong>? The booking link will no longer appear on your website.</p>
        </div>
      </AdminModal>

    </div>
  );
}
