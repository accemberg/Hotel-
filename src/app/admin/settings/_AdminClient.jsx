"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Save, Building2, MapPin, Share2, Globe, CheckCircle2, AlertCircle } from "lucide-react";

import { PageHeader } from "@/components/admin/PageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminButton } from "@/components/admin/AdminButton";
import { SkeletonLoader } from "@/components/admin/SkeletonLoader";
import { AdminInput, AdminTextarea } from "@/components/admin/AdminInputs";

export default function SettingsManager() {
  const [config, setConfig] = useState({
    siteName: "Moksh Haveli Inn",
    contactEmail: "",
    contactPhone: "",
    whatsappNumber: "",
    whatsappMessage: "Hello! I'm interested in booking a room at Moksh Haveli Inn.",
    address: "",
    mapEmbedUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    heroText: "",
    aboutText: "",
    metaTitle: "",
    metaDescription: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const docSnap = await getDoc(doc(db, "settings", "siteConfig"));
        if (docSnap.exists()) {
          setConfig(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (err) { 
        console.warn("Could not load settings, starting fresh."); 
      } finally { 
        setLoading(false); 
      }
    }
    fetchSettings();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); 
    setToast(null);
    try {
      await setDoc(doc(db, "settings", "siteConfig"), config);
      showToast('success', 'Settings successfully saved and published.');
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to save settings. Please check your permissions.');
    } finally { 
      setSaving(false); 
    }
  };

  const handleChange = (e) => setConfig({ ...config, [e.target.name]: e.target.value });

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader title="Global Settings" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SkeletonLoader type="card" count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      
      <PageHeader 
        title="Global Settings" 
        subtitle="Manage hotel information, contact details, and SEO."
        action={
          <AdminButton icon={Save} onClick={handleSave} loading={saving}>
            Save All Changes
          </AdminButton>
        }
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl transition-all animate-in slide-in-from-bottom-5 ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        
        <div className="flex flex-col gap-8">
          {/* Property Info */}
          <AdminCard padding="p-0" className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-xl">
            <div className="bg-slate-50/80 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl border border-slate-200/60 shadow-sm shrink-0"><Building2 className="w-5 h-5 text-slate-700" /></div>
              <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Property Information</h3>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <AdminInput label="Property Name" name="siteName" value={config.siteName} onChange={handleChange} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AdminInput label="Contact Email" type="email" name="contactEmail" placeholder="info@mokshhaveli.com" value={config.contactEmail} onChange={handleChange} />
                <AdminInput label="Contact Phone" name="contactPhone" placeholder="+91 98765 43210" value={config.contactPhone} onChange={handleChange} />
              </div>
            </div>
          </AdminCard>

          {/* Social & Integrations */}
          <AdminCard padding="p-0" className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-xl">
            <div className="bg-slate-50/80 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl border border-slate-200/60 shadow-sm shrink-0"><Share2 className="w-5 h-5 text-slate-700" /></div>
              <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Social & Communication</h3>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AdminInput label="WhatsApp Number" name="whatsappNumber" placeholder="+919876543210" value={config.whatsappNumber} onChange={handleChange} />
                <AdminInput label="WhatsApp Default Message" name="whatsappMessage" placeholder="Hello..." value={config.whatsappMessage} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AdminInput label="Instagram URL" type="url" name="instagramUrl" placeholder="https://instagram.com/..." value={config.instagramUrl} onChange={handleChange} />
                <AdminInput label="Facebook URL" type="url" name="facebookUrl" placeholder="https://facebook.com/..." value={config.facebookUrl} onChange={handleChange} />
              </div>
            </div>
          </AdminCard>
        </div>

        <div className="flex flex-col gap-8">
          {/* Location */}
          <AdminCard padding="p-0" className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-xl">
            <div className="bg-slate-50/80 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl border border-slate-200/60 shadow-sm shrink-0"><MapPin className="w-5 h-5 text-slate-700" /></div>
              <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Location Details</h3>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <AdminTextarea label="Physical Address" name="address" rows={3} placeholder="Near Pushkar Lake..." value={config.address} onChange={handleChange} />
              <div>
                <AdminInput label="Google Maps Embed URL" type="url" name="mapEmbedUrl" placeholder="https://www.google.com/maps/embed?pb=..." value={config.mapEmbedUrl} onChange={handleChange} />
                <p className="text-xs text-slate-500 mt-2 font-medium">Tip: Copy the `src` URL from the iframe code when you share a map.</p>
              </div>
            </div>
          </AdminCard>

          {/* Website Content & SEO */}
          <AdminCard padding="p-0" className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-xl">
            <div className="bg-slate-50/80 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl border border-slate-200/60 shadow-sm shrink-0"><Globe className="w-5 h-5 text-slate-700" /></div>
              <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Content & SEO</h3>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <AdminTextarea label="Hero / Banner Text" name="heroText" rows={2} value={config.heroText} onChange={handleChange} />
              <AdminTextarea label="About Section Text" name="aboutText" rows={4} value={config.aboutText} onChange={handleChange} />
              
              <div className="border-t border-slate-200 pt-5 mt-2 flex flex-col gap-5">
                <AdminInput label="SEO Meta Title" name="metaTitle" placeholder="Moksh Haveli Inn — Boutique Heritage Hotel" value={config.metaTitle} onChange={handleChange} />
                <div>
                  <AdminTextarea label="SEO Meta Description" name="metaDescription" rows={3} value={config.metaDescription} onChange={handleChange} />
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    <span className={config.metaDescription.length > 160 ? 'text-red-500' : 'text-emerald-600'}>
                      {config.metaDescription.length} chars
                    </span> (Recommended: 150-160)
                  </p>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>
      </form>
    </div>
  );
}
