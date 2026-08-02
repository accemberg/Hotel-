"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Plus, X, Save, RefreshCw, Upload } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, writeBatch } from "firebase/firestore";

const GALLERY_CATEGORIES = ["Exterior", "Rooms", "Dining", "Events", "Amenities", "Other"];

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState("Exterior");
  const [saving, setSaving] = useState(false);

  const fetchGallery = async () => {
    try {
      const snapshot = await getDocs(collection(db, "gallery"));
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      setImages(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "gallery"), { url: newUrl.trim(), category: newCategory, createdAt: new Date() });
      setNewUrl(""); setIsAdding(false);
      await fetchGallery();
    } catch (err) { alert("Failed to add image."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this image permanently?")) return;
    try { await deleteDoc(doc(db, "gallery", id)); setImages(images.filter(img => img.id !== id)); }
    catch (err) { alert("Failed to delete."); }
  };

  const handleSeed = async () => {
    if (!confirm("Clear all images and add demo hotel images?")) return;
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
      await fetchGallery();
    } catch (err) { alert("Failed to seed gallery."); }
    finally { setSaving(false); }
  };

  const inputStyle = { width: "100%", minHeight: "70px", backgroundColor: "#1a1410", border: "3px solid rgba(168, 142, 106, 0.4)", color: "#f5f0e8", padding: "18px 24px", borderRadius: "16px", fontSize: "20px", fontWeight: "500", outline: "none", boxSizing: "border-box" };
  const labelStyle = { display: "block", color: "#a88e6a", textTransform: "uppercase", letterSpacing: "0.15em", fontSize: "16px", fontWeight: "800", marginBottom: "12px" };
  const btnStyle = (bg, text, border) => ({ padding: "18px 36px", backgroundColor: bg, color: text, border: `3px solid ${border}`, borderRadius: "16px", fontSize: "16px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.12em", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" });

  // Group by category
  const grouped = images.reduce((acc, img) => {
    const cat = img.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(img);
    return acc;
  }, {});

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "24px" }}>
        <div>
          <h2 style={{ fontSize: "48px", fontWeight: "bold", color: "#e3a869", textTransform: "uppercase", letterSpacing: "0.05em", textShadow: "0 0 20px rgba(227, 168, 105, 0.4)", fontFamily: "var(--font-tt-ramillas-variable)" }}>Gallery Manager</h2>
          <p style={{ color: "#a88e6a", marginTop: "12px", fontSize: "20px", fontWeight: "500" }}>Manage your property photos by category.</p>
        </div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <button onClick={handleSeed} disabled={saving} style={btnStyle("#1a1410", "#e3a869", "rgba(227, 168, 105, 0.5)")}>
            <RefreshCw style={{ height: 20, width: 20 }} className={saving ? 'animate-spin' : ''} /> Seed Demo
          </button>
          <button onClick={() => setIsAdding(true)} style={btnStyle("#e3a869", "#1a1410", "#e3a869")}>
            <Upload style={{ height: 20, width: 20 }} /> Add Image
          </button>
        </div>
      </div>

      {isAdding && (
        <div style={{ backgroundColor: "#2a221a", border: "3px solid rgba(227, 168, 105, 0.5)", borderRadius: "24px", padding: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", borderBottom: "2px solid rgba(168, 142, 106, 0.2)", paddingBottom: "16px" }}>
            <h3 style={{ fontSize: "26px", fontWeight: "bold", color: "#e3a869", textTransform: "uppercase", letterSpacing: "0.15em" }}>Add Image URL</h3>
            <button onClick={() => setIsAdding(false)} style={{ color: "#a88e6a", cursor: "pointer", background: "none", border: "none" }}><X style={{ height: 32, width: 32 }} /></button>
          </div>
          <form onSubmit={handleAdd} style={{ display: "flex", gap: "24px", alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: 2, minWidth: "250px" }}>
              <label style={labelStyle}>Image URL</label>
              <input required type="url" value={newUrl} onChange={e => setNewUrl(e.target.value)} style={inputStyle} placeholder="https://example.com/image.jpg" autoFocus />
            </div>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={labelStyle}>Category</label>
              <select value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                {GALLERY_CATEGORIES.map(c => <option key={c} value={c} style={{ backgroundColor: "#1a1410" }}>{c}</option>)}
              </select>
            </div>
            <button disabled={saving} type="submit" style={{ ...btnStyle("#e3a869", "#1a1410", "#e3a869"), minHeight: "70px", opacity: saving ? 0.6 : 1 }}>
              {saving ? <Loader2 style={{ height: 20, width: 20 }} className="animate-spin" /> : <Save style={{ height: 20, width: 20 }} />}
              Save
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 0" }}>
          <Loader2 style={{ height: 48, width: 48, color: "#e3a869" }} className="animate-spin" />
          <span style={{ marginLeft: 16, fontSize: 24, fontWeight: "bold", color: "#a88e6a" }}>Loading gallery...</span>
        </div>
      ) : images.length === 0 ? (
        <div style={{ padding: "48px", textAlign: "center", color: "#a88e6a", fontSize: "24px", fontWeight: "bold" }}>No images. Click &quot;Seed Demo&quot; to add sample images.</div>
      ) : (
        Object.entries(grouped).map(([category, imgs]) => (
          <div key={category}>
            <h3 style={{ fontSize: "28px", fontWeight: "bold", color: "#e3a869", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "24px", borderBottom: "3px solid rgba(168, 142, 106, 0.2)", paddingBottom: "12px" }}>
              {category} <span style={{ color: "#a88e6a", fontSize: "20px" }}>({imgs.length})</span>
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "28px", marginBottom: "40px" }}>
              {imgs.map(img => {
                const imageUrl = img.url || img.src || img.imageUrl || img.image || '';
                return (
                  <div key={img.id} style={{ backgroundColor: "#2a221a", border: "3px solid rgba(168, 142, 106, 0.25)", borderRadius: "24px", overflow: "hidden" }}>
                    {imageUrl ? (
                      <div style={{ position: "relative", aspectRatio: "4/3" }}>
                        <img src={imageUrl} alt={category} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'; }} />
                        <div style={{ display: "none", position: "absolute", inset: 0, backgroundColor: "#1a1410", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px", padding: "24px" }}>
                          <span style={{ color: "#ef4444", fontWeight: "bold", fontSize: "18px" }}>Image Failed</span>
                          <span style={{ color: "#a88e6a", fontSize: "12px", wordBreak: "break-all", textAlign: "center" }}>{imageUrl}</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ aspectRatio: "4/3", backgroundColor: "#1a1410", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "#a88e6a", fontWeight: "bold" }}>No URL</span>
                      </div>
                    )}
                    <div style={{ padding: "20px 24px", display: "flex", justifyContent: "center" }}>
                      <button onClick={() => handleDelete(img.id)} style={btnStyle("#1a1410", "#f87171", "rgba(248, 113, 113, 0.4)")}>
                        <Trash2 style={{ height: 20, width: 20 }} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
