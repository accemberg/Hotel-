"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, X, Save, ArrowUp, ArrowDown } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore";

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
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ platform: "Booking.com", url: "", isActive: true });

  const fetchLinks = async () => {
    try {
      const snapshot = await getDocs(collection(db, "otaLinks"));
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (a.order || 0) - (b.order || 0));
      setLinks(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLinks(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.url.trim()) return;
    setSaving(true);
    try {
      const platform = PLATFORMS.find(p => p.name === formData.platform) || { name: formData.platform, logo: "🔗" };
      await addDoc(collection(db, "otaLinks"), {
        platform: platform.name, logo: platform.logo,
        url: formData.url.trim(), isActive: formData.isActive,
        order: links.length, createdAt: new Date()
      });
      setFormData({ platform: "Booking.com", url: "", isActive: true });
      setIsAdding(false);
      await fetchLinks();
    } catch (err) { alert("Failed to save."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this OTA link?")) return;
    try { await deleteDoc(doc(db, "otaLinks", id)); setLinks(links.filter(l => l.id !== id)); }
    catch (err) { alert("Failed to delete."); }
  };

  const toggleActive = async (id, currentVal) => {
    try {
      setLinks(links.map(l => l.id === id ? { ...l, isActive: !currentVal } : l));
      await updateDoc(doc(db, "otaLinks", id), { isActive: !currentVal });
    } catch (err) { alert("Failed to update."); }
  };

  const moveItem = async (index, direction) => {
    const newLinks = [...links];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newLinks.length) return;
    [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];
    setLinks(newLinks);
    try {
      const batch = writeBatch(db);
      newLinks.forEach((link, i) => batch.update(doc(db, "otaLinks", link.id), { order: i }));
      await batch.commit();
    } catch (err) { console.error(err); }
  };

  const boxStyle = { backgroundColor: "#2a221a", border: "3px solid rgba(168, 142, 106, 0.25)", borderRadius: "24px", padding: "40px" };
  const inputStyle = { width: "100%", minHeight: "70px", backgroundColor: "#1a1410", border: "3px solid rgba(168, 142, 106, 0.4)", color: "#f5f0e8", padding: "18px 24px", borderRadius: "16px", fontSize: "20px", fontWeight: "500", outline: "none", boxSizing: "border-box" };
  const labelStyle = { display: "block", color: "#a88e6a", textTransform: "uppercase", letterSpacing: "0.15em", fontSize: "16px", fontWeight: "800", marginBottom: "12px" };
  const btnStyle = (bg, text, border) => ({ padding: "16px 28px", backgroundColor: bg, color: text, border: `3px solid ${border}`, borderRadius: "16px", fontSize: "15px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" });

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "24px" }}>
        <div>
          <h2 style={{ fontSize: "48px", fontWeight: "bold", color: '#DEB76A', textTransform: "uppercase", letterSpacing: "0.05em", textShadow: "0 0 20px rgba(227, 168, 105, 0.4)", fontFamily: "var(--font-tt-ramillas-variable)" }}>OTA Links</h2>
          <p style={{ color: "#a88e6a", marginTop: "12px", fontSize: "20px", fontWeight: "500" }}>Manage your booking platform links (Booking.com, MakeMyTrip, etc.).</p>
        </div>
        <button onClick={() => setIsAdding(true)} style={btnStyle("#e3a869", "#1a1410", "#e3a869")}>
          <Plus style={{ height: 22, width: 22 }} /> Add Platform
        </button>
      </div>

      {isAdding && (
        <div style={{ ...boxStyle, border: "3px solid rgba(227, 168, 105, 0.5)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", borderBottom: "2px solid rgba(168, 142, 106, 0.2)", paddingBottom: "20px" }}>
            <h3 style={{ fontSize: "26px", fontWeight: "bold", color: "#e3a869", textTransform: "uppercase", letterSpacing: "0.15em" }}>Add OTA Platform</h3>
            <button onClick={() => setIsAdding(false)} style={{ color: "#a88e6a", cursor: "pointer", background: "none", border: "none" }}><X style={{ height: 32, width: 32 }} /></button>
          </div>
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "32px" }}>
              <div>
                <label style={labelStyle}>Platform</label>
                <select value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} style={{ ...inputStyle, cursor: "pointer" }}>
                  {PLATFORMS.map(p => <option key={p.name} value={p.name} style={{ backgroundColor: "#1a1410" }}>{p.logo} {p.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Listing URL</label>
                <input required type="url" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} style={inputStyle} placeholder="https://www.booking.com/hotel/..." />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", backgroundColor: "#1a1410", padding: "20px 28px", borderRadius: "16px", border: "2px solid rgba(168, 142, 106, 0.3)", width: "fit-content" }}>
              <Switch checked={formData.isActive} onCheckedChange={val => setFormData({...formData, isActive: val})} />
              <span style={{ color: "#f5f0e8", fontWeight: "700", fontSize: "20px" }}>Show on website</span>
            </div>
            <div style={{ borderTop: "2px solid rgba(168, 142, 106, 0.2)", paddingTop: "24px", display: "flex", justifyContent: "flex-end" }}>
              <button disabled={saving} type="submit" style={{ ...btnStyle("#e3a869", "#1a1410", "#e3a869"), padding: "20px 48px", fontSize: "18px", opacity: saving ? 0.6 : 1 }}>
                {saving ? <Loader2 style={{ height: 22, width: 22 }} className="animate-spin" /> : <Save style={{ height: 22, width: 22 }} />}
                {saving ? "Saving..." : "Save Platform"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h3 style={{ fontSize: "32px", fontWeight: "bold", color: "#f5f0e8", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "32px", borderBottom: "3px solid rgba(168, 142, 106, 0.2)", paddingBottom: "16px" }}>Active Platforms</h3>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 0" }}>
            <Loader2 style={{ height: 48, width: 48, color: "#e3a869" }} className="animate-spin" />
            <span style={{ marginLeft: 16, fontSize: 24, fontWeight: "bold", color: "#a88e6a" }}>Loading...</span>
          </div>
        ) : links.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#a88e6a", fontSize: "24px", fontWeight: "bold" }}>No OTA platforms added yet. Click &quot;Add Platform&quot; above.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {links.map((link, index) => (
              <div key={link.id} style={boxStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                    <span style={{ fontSize: "48px" }}>{link.logo || "🔗"}</span>
                    <div>
                      <h4 style={{ color: "#f5f0e8", fontWeight: "bold", fontSize: "28px", marginBottom: "8px" }}>{link.platform}</h4>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa", fontSize: "16px", wordBreak: "break-all" }}>{link.url}</a>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#1a1410", padding: "14px 24px", borderRadius: "16px", border: "2px solid rgba(168, 142, 106, 0.3)" }}>
                      <Switch checked={link.isActive !== false} onCheckedChange={() => toggleActive(link.id, link.isActive !== false)} />
                      <span style={{ color: link.isActive !== false ? "#34d399" : "#a88e6a", fontWeight: "700", fontSize: "16px", textTransform: "uppercase" }}>{link.isActive !== false ? 'Active' : 'Hidden'}</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => moveItem(index, -1)} disabled={index === 0} style={{ ...btnStyle("#1a1410", "#a88e6a", "rgba(168, 142, 106, 0.3)"), padding: "14px 16px", opacity: index === 0 ? 0.4 : 1 }}><ArrowUp style={{ height: 20, width: 20 }} /></button>
                      <button onClick={() => moveItem(index, 1)} disabled={index === links.length - 1} style={{ ...btnStyle("#1a1410", "#a88e6a", "rgba(168, 142, 106, 0.3)"), padding: "14px 16px", opacity: index === links.length - 1 ? 0.4 : 1 }}><ArrowDown style={{ height: 20, width: 20 }} /></button>
                    </div>
                    <button onClick={() => handleDelete(link.id)} style={btnStyle("#1a1410", "#f87171", "rgba(248, 113, 113, 0.4)")}><Trash2 style={{ height: 20, width: 20 }} /> Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
