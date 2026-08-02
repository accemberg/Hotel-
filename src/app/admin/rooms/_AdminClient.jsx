"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Edit2, Trash2, X, Save } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export default function RoomsManager() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", price: "", guests: 2, imageUrl: "", isAvailable: true });

  const fetchRooms = async () => {
    try {
      const snapshot = await getDocs(collection(db, "rooms"));
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setRooms(data);
    } catch (err) { setError("Could not load rooms."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name, price: Number(formData.price),
        guests: Number(formData.guests), imageUrl: formData.imageUrl,
        isAvailable: formData.isAvailable
      };
      if (editingId) {
        await updateDoc(doc(db, "rooms", editingId), payload);
      } else {
        await addDoc(collection(db, "rooms"), { ...payload, createdAt: new Date() });
      }
      setIsAdding(false); setEditingId(null);
      await fetchRooms();
    } catch (err) { alert("Failed to save room."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this room permanently?")) return;
    try { await deleteDoc(doc(db, "rooms", id)); setRooms(rooms.filter(r => r.id !== id)); }
    catch (err) { alert("Failed to delete."); }
  };

  const startEdit = (room) => {
    setFormData({ name: room.name || room.title || '', price: room.price || 0, guests: room.guests || 2, imageUrl: room.imageUrl || '', isAvailable: room.isAvailable !== false });
    setEditingId(room.id); setIsAdding(true);
  };

  const toggleAvailability = async (id, currentVal) => {
    try {
      setRooms(rooms.map(r => r.id === id ? { ...r, isAvailable: !currentVal } : r));
      await updateDoc(doc(db, "rooms", id), { isAvailable: !currentVal });
    } catch (err) {
      alert("Failed to update.");
      setRooms(rooms.map(r => r.id === id ? { ...r, isAvailable: currentVal } : r));
    }
  };

  const boxStyle = { backgroundColor: "#2a221a", border: "3px solid rgba(168, 142, 106, 0.25)", borderRadius: "24px", padding: "40px" };
  const inputStyle = { width: "100%", minHeight: "70px", backgroundColor: "#1a1410", border: "3px solid rgba(168, 142, 106, 0.4)", color: "#f5f0e8", padding: "18px 24px", borderRadius: "16px", fontSize: "20px", fontWeight: "500", outline: "none", boxSizing: "border-box" };
  const labelStyle = { display: "block", color: "#a88e6a", textTransform: "uppercase", letterSpacing: "0.15em", fontSize: "16px", fontWeight: "800", marginBottom: "12px" };
  const btnStyle = (bg, text, border) => ({ padding: "18px 36px", backgroundColor: bg, color: text, border: `3px solid ${border}`, borderRadius: "16px", fontSize: "16px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.15em", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", transition: "all 0.3s" });

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "24px" }}>
        <div>
          <h2 style={{ fontSize: "48px", fontWeight: "bold", color: '#DEB76A', textTransform: "uppercase", letterSpacing: "0.05em", textShadow: "0 0 20px rgba(227, 168, 105, 0.4)", fontFamily: "var(--font-tt-ramillas-variable)" }}>Rooms Manager</h2>
          <p style={{ color: "#a88e6a", marginTop: "12px", fontSize: "20px", fontWeight: "500" }}>Update room pricing, capacity, images, and availability.</p>
        </div>
        <button onClick={() => { setFormData({ name: "", price: "", guests: 2, imageUrl: "", isAvailable: true }); setEditingId(null); setIsAdding(true); }} style={btnStyle("#e3a869", "#1a1410", "#e3a869")}>
          <Plus style={{ height: 22, width: 22 }} /> Add Room
        </button>
      </div>

      {isAdding && (
        <div style={{ ...boxStyle, border: "3px solid rgba(227, 168, 105, 0.5)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", borderBottom: "2px solid rgba(168, 142, 106, 0.2)", paddingBottom: "20px" }}>
            <h3 style={{ fontSize: "28px", fontWeight: "bold", color: "#e3a869", textTransform: "uppercase", letterSpacing: "0.15em" }}>{editingId ? 'Edit Room' : 'New Room'}</h3>
            <button onClick={() => setIsAdding(false)} style={{ color: "#a88e6a", cursor: "pointer", background: "none", border: "none" }}><X style={{ height: 32, width: 32 }} /></button>
          </div>
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              <div>
                <label style={labelStyle}>Room Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} placeholder="e.g. Deluxe Heritage Suite" />
              </div>
              <div>
                <label style={labelStyle}>Base Price (₹ per night)</label>
                <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={inputStyle} placeholder="2500" />
              </div>
              <div>
                <label style={labelStyle}>Capacity (Guests)</label>
                <input required type="number" min="1" value={formData.guests} onChange={e => setFormData({...formData, guests: e.target.value})} style={inputStyle} placeholder="2" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <label style={labelStyle}>Availability</label>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", minHeight: "70px", backgroundColor: "#1a1410", border: "3px solid rgba(168, 142, 106, 0.4)", borderRadius: "16px", padding: "0 24px" }}>
                  <Switch checked={formData.isAvailable} onCheckedChange={(val) => setFormData({...formData, isAvailable: val})} />
                  <span style={{ color: "#f5f0e8", fontWeight: "700", fontSize: "20px" }}>{formData.isAvailable ? 'Available' : 'Hidden'}</span>
                </div>
              </div>
            </div>
            {/* Image URL - full width */}
            <div>
              <label style={labelStyle}>Room Image URL</label>
              <input type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} style={inputStyle} placeholder="https://example.com/room-image.jpg" />
            </div>
            {formData.imageUrl && (
              <div style={{ backgroundColor: "#1a1410", borderRadius: "16px", overflow: "hidden", border: "2px solid rgba(168, 142, 106, 0.3)", maxHeight: "280px" }}>
                <img src={formData.imageUrl} alt="Room preview" style={{ width: "100%", height: "280px", objectFit: "cover", display: "block" }} onError={e => { e.target.style.display = 'none'; }} />
              </div>
            )}
            <div style={{ borderTop: "2px solid rgba(168, 142, 106, 0.2)", paddingTop: "24px", display: "flex", justifyContent: "flex-end" }}>
              <button disabled={saving} type="submit" style={{ ...btnStyle("#e3a869", "#1a1410", "#e3a869"), opacity: saving ? 0.6 : 1 }}>
                {saving ? <Loader2 style={{ height: 22, width: 22 }} className="animate-spin" /> : <Save style={{ height: 22, width: 22 }} />}
                {saving ? "Saving..." : "Save Room"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h3 style={{ fontSize: "32px", fontWeight: "bold", color: "#f5f0e8", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "32px", borderBottom: "3px solid rgba(168, 142, 106, 0.2)", paddingBottom: "16px" }}>All Rooms</h3>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 0" }}>
            <Loader2 style={{ height: 48, width: 48, color: "#e3a869" }} className="animate-spin" />
            <span style={{ marginLeft: 16, fontSize: 24, fontWeight: "bold", color: "#a88e6a" }}>Loading rooms...</span>
          </div>
        ) : error ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#ef4444", fontSize: "24px", fontWeight: "bold" }}>{error}</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {rooms.map((room) => {
              const imgUrl = room.imageUrl || room.image || room.url || '';
              return (
                <div key={room.id} style={boxStyle}>
                  <div style={{ display: "grid", gridTemplateColumns: imgUrl ? "1fr 2fr" : "1fr", gap: "40px" }}>
                    {imgUrl && (
                      <div style={{ borderRadius: "16px", overflow: "hidden", border: "2px solid rgba(168, 142, 106, 0.3)", maxHeight: "240px" }}>
                        <img src={imgUrl} alt={room.name} style={{ width: "100%", height: "240px", objectFit: "cover", display: "block" }} onError={e => { e.target.parentNode.style.display = 'none'; }} />
                      </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "24px" }}>
                      <div>
                        <h4 style={{ color: "#f5f0e8", fontWeight: "bold", fontSize: "32px", marginBottom: "12px" }}>{room.name || room.title || 'Unnamed Room'}</h4>
                        <p style={{ color: "#e3a869", fontWeight: "bold", fontSize: "28px" }}>₹{room.price || 0} <span style={{ color: "#a88e6a", fontSize: "20px" }}>/ NIGHT</span></p>
                        <p style={{ color: "#a88e6a", marginTop: "8px", fontSize: "18px" }}>Up to {room.guests || 2} guests</p>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", paddingTop: "20px", borderTop: "2px solid rgba(168, 142, 106, 0.15)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", backgroundColor: "#1a1410", padding: "14px 24px", borderRadius: "16px", border: "2px solid rgba(168, 142, 106, 0.3)" }}>
                          <Switch checked={room.isAvailable !== false} onCheckedChange={() => toggleAvailability(room.id, room.isAvailable !== false)} />
                          <span style={{ color: "#f5f0e8", fontWeight: "700", fontSize: "18px", textTransform: "uppercase" }}>{room.isAvailable !== false ? 'Available' : 'Hidden'}</span>
                        </div>
                        <div style={{ display: "flex", gap: "16px" }}>
                          <button onClick={() => startEdit(room)} style={btnStyle("#1a1410", "#60a5fa", "rgba(96, 165, 250, 0.4)")}><Edit2 style={{ height: 20, width: 20 }} /> Edit</button>
                          <button onClick={() => handleDelete(room.id)} style={btnStyle("#1a1410", "#f87171", "rgba(248, 113, 113, 0.4)")}><Trash2 style={{ height: 20, width: 20 }} /> Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
