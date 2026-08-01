"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Plus, X, Save, RefreshCw, Edit2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, writeBatch } from "firebase/firestore";

const CATEGORIES = ["In-Room", "Bathroom", "Dining", "Services", "Security", "Connectivity", "Outdoor"];

export default function AmenitiesManager() {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("In-Room");
  const [saving, setSaving] = useState(false);

  const fetchAmenities = async () => {
    try {
      const snapshot = await getDocs(collection(db, "amenities"));
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setAmenities(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAmenities(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "amenities", editingId), { name: newName.trim(), category: newCategory });
      } else {
        await addDoc(collection(db, "amenities"), { name: newName.trim(), category: newCategory, createdAt: new Date() });
      }
      setNewName(""); setNewCategory("In-Room"); setIsAdding(false); setEditingId(null);
      await fetchAmenities();
    } catch (err) { alert("Failed to save amenity."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this amenity?")) return;
    try { await deleteDoc(doc(db, "amenities", id)); setAmenities(amenities.filter(a => a.id !== id)); }
    catch (err) { alert("Failed to delete."); }
  };

  const startEdit = (amen) => {
    setNewName(amen.name || ''); setNewCategory(amen.category || 'In-Room');
    setEditingId(amen.id); setIsAdding(true);
  };

  const handleSeed = async () => {
    if (!confirm("Clear all amenities and seed the standard list from the brief?")) return;
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
      await fetchAmenities();
    } catch (err) { alert("Failed to seed."); }
    finally { setSaving(false); }
  };

  const boxStyle = { backgroundColor: "#2a221a", border: "3px solid rgba(168, 142, 106, 0.25)", borderRadius: "24px", padding: "32px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", flexWrap: "wrap" };
  const inputStyle = { width: "100%", minHeight: "70px", backgroundColor: "#1a1410", border: "3px solid rgba(168, 142, 106, 0.4)", color: "#f5f0e8", padding: "18px 24px", borderRadius: "16px", fontSize: "22px", fontWeight: "500", outline: "none", boxSizing: "border-box" };
  const labelStyle = { display: "block", color: "#a88e6a", textTransform: "uppercase", letterSpacing: "0.15em", fontSize: "16px", fontWeight: "800", marginBottom: "12px" };
  const btnStyle = (bg, text, border) => ({ padding: "16px 32px", backgroundColor: bg, color: text, border: `3px solid ${border}`, borderRadius: "16px", fontSize: "15px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.12em", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" });

  const categoryColor = (cat) => {
    const map = { "In-Room": "#e3a869", "Bathroom": "#60a5fa", "Dining": "#f87171", "Services": "#34d399", "Security": "#fbbf24", "Connectivity": "#a78bfa", "Outdoor": "#6ee7b7" };
    return map[cat] || "#a88e6a";
  };

  // Group by category
  const grouped = amenities.reduce((acc, a) => {
    const cat = a.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(a);
    return acc;
  }, {});

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "24px" }}>
        <div>
          <h2 style={{ fontSize: "48px", fontWeight: "bold", color: "#e3a869", textTransform: "uppercase", letterSpacing: "0.05em", textShadow: "0 0 20px rgba(227, 168, 105, 0.4)", fontFamily: "var(--font-tt-ramillas-variable)" }}>Amenities Manager</h2>
          <p style={{ color: "#a88e6a", marginTop: "12px", fontSize: "20px", fontWeight: "500" }}>Manage amenities by category for Moksh Haveli Inn.</p>
        </div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <button onClick={handleSeed} disabled={saving} style={btnStyle("#1a1410", "#e3a869", "rgba(227, 168, 105, 0.5)")}>
            <RefreshCw style={{ height: 20, width: 20 }} className={saving ? 'animate-spin' : ''} /> Clean & Seed
          </button>
          <button onClick={() => { setNewName(""); setNewCategory("In-Room"); setEditingId(null); setIsAdding(true); }} style={btnStyle("#e3a869", "#1a1410", "#e3a869")}>
            <Plus style={{ height: 20, width: 20 }} /> Add Amenity
          </button>
        </div>
      </div>

      {isAdding && (
        <div style={{ backgroundColor: "#2a221a", border: "3px solid rgba(227, 168, 105, 0.5)", borderRadius: "24px", padding: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", borderBottom: "2px solid rgba(168, 142, 106, 0.2)", paddingBottom: "16px" }}>
            <h3 style={{ fontSize: "26px", fontWeight: "bold", color: "#e3a869", textTransform: "uppercase", letterSpacing: "0.15em" }}>{editingId ? 'Edit Amenity' : 'Add New Amenity'}</h3>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} style={{ color: "#a88e6a", cursor: "pointer", background: "none", border: "none" }}><X style={{ height: 32, width: 32 }} /></button>
          </div>
          <form onSubmit={handleAdd} style={{ display: "flex", gap: "24px", alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: 2, minWidth: "250px" }}>
              <label style={labelStyle}>Amenity Name</label>
              <input required type="text" value={newName} onChange={e => setNewName(e.target.value)} style={inputStyle} placeholder="e.g. Free Wi-Fi" autoFocus />
            </div>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={labelStyle}>Category</label>
              <select value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                {CATEGORIES.map(c => <option key={c} value={c} style={{ backgroundColor: "#1a1410" }}>{c}</option>)}
              </select>
            </div>
            <button disabled={saving} type="submit" style={{ ...btnStyle("#e3a869", "#1a1410", "#e3a869"), minHeight: "70px", opacity: saving ? 0.6 : 1 }}>
              {saving ? <Loader2 style={{ height: 20, width: 20 }} className="animate-spin" /> : <Save style={{ height: 20, width: 20 }} />}
              {saving ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 0" }}>
          <Loader2 style={{ height: 48, width: 48, color: "#e3a869" }} className="animate-spin" />
          <span style={{ marginLeft: 16, fontSize: 24, fontWeight: "bold", color: "#a88e6a" }}>Loading...</span>
        </div>
      ) : amenities.length === 0 ? (
        <div style={{ padding: "48px", textAlign: "center", color: "#a88e6a", fontSize: "24px", fontWeight: "bold" }}>No amenities yet. Click &quot;Clean &amp; Seed&quot; to get started.</div>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <div style={{ height: 14, width: 14, borderRadius: "50%", backgroundColor: categoryColor(category), boxShadow: `0 0 12px ${categoryColor(category)}` }}></div>
              <h3 style={{ fontSize: "28px", fontWeight: "bold", color: categoryColor(category), textTransform: "uppercase", letterSpacing: "0.15em" }}>{category}</h3>
              <div style={{ flex: 1, height: "2px", backgroundColor: "rgba(168, 142, 106, 0.15)", marginLeft: "8px" }}></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {items.map(amen => (
                <div key={amen.id} style={boxStyle}>
                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={{ height: 12, width: 12, borderRadius: "50%", backgroundColor: categoryColor(category), flexShrink: 0 }}></div>
                    <span style={{ color: "#f5f0e8", fontWeight: "bold", fontSize: "26px" }}>{amen.name || 'Unnamed'}</span>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => startEdit(amen)} style={btnStyle("#1a1410", "#60a5fa", "rgba(96, 165, 250, 0.4)")}><Edit2 style={{ height: 18, width: 18 }} /> Edit</button>
                    <button onClick={() => handleDelete(amen.id)} style={btnStyle("#1a1410", "#f87171", "rgba(248, 113, 113, 0.4)")}><Trash2 style={{ height: 18, width: 18 }} /> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
