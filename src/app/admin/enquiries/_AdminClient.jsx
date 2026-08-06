"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Loader2, Download, MessageCircle } from "lucide-react";

export default function EnquiriesManager() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    async function fetchEnquiries() {
      try {
        const snapshot = await getDocs(collection(db, "enquiries"));
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setEnquiries(data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
      } catch (err) {
        setError("Could not load enquiries.");
      } finally {
        setLoading(false);
      }
    }
    fetchEnquiries();
  }, []);

  const exportCSV = () => {
    const headers = ["Date", "Name", "Email", "Phone", "Check-In", "Check-Out", "Status", "Notes"];
    const csvData = enquiries.map(e => [
      e.createdAt?.toDate ? e.createdAt.toDate().toLocaleDateString() : 'N/A',
      `"${e.name || ''}"`, `"${e.email || ''}"`, `"${e.phone || ''}"`,
      e.checkIn || '', e.checkOut || '', e.status || 'New', `"${e.notes || ''}"`
    ].join(","));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvData].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "moksh_haveli_enquiries.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateEnquiry = async (id, field, value) => {
    setSavingId(id);
    try {
      await updateDoc(doc(db, "enquiries", id), { [field]: value });
      setEnquiries(enquiries.map(e => e.id === id ? { ...e, [field]: value } : e));
    } catch (err) {
      alert("Failed to save.");
    } finally {
      setSavingId(null);
    }
  };

  const boxStyle = {
    backgroundColor: "#2a221a",
    border: "3px solid rgba(168, 142, 106, 0.25)",
    borderRadius: "24px",
    padding: "40px",
  };

  const labelStyle = {
    display: "block",
    color: "#a88e6a",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    fontSize: "14px",
    fontWeight: "800",
    marginBottom: "8px",
  };

  const btnStyle = (bg, text, border) => ({
    padding: "18px 36px",
    backgroundColor: bg,
    color: text,
    border: `3px solid ${border}`,
    borderRadius: "16px",
    fontSize: "16px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    transition: "all 0.3s",
    textDecoration: "none",
  });

  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed': return { color: "#34d399", border: "2px solid rgba(52, 211, 153, 0.4)", backgroundColor: "rgba(52, 211, 153, 0.1)" };
      case 'contacted': return { color: "#60a5fa", border: "2px solid rgba(96, 165, 250, 0.4)", backgroundColor: "rgba(96, 165, 250, 0.1)" };
      default: return { color: "#e3a869", border: "2px solid rgba(227, 168, 105, 0.4)", backgroundColor: "rgba(227, 168, 105, 0.1)" };
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "40px" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "24px" }}>
        <div>
          <h2 style={{ fontSize: "48px", fontWeight: "bold", color: 'var(--color-saffron)', textTransform: "uppercase", letterSpacing: "0.05em", textShadow: "0 0 20px rgba(227, 168, 105, 0.4)", fontFamily: "var(--font-tt-ramillas-variable)" }}>
            Enquiries CRM
          </h2>
          <p style={{ color: "#a88e6a", marginTop: "12px", fontSize: "20px", fontWeight: "500" }}>
            Manage guest leads, update status, and add notes.
          </p>
        </div>
        <button onClick={exportCSV} style={btnStyle("#1a1410", "#e3a869", "rgba(227, 168, 105, 0.5)")}>
          <Download style={{ height: 20, width: 20 }} /> Export CSV
        </button>
      </div>

      {/* Enquiry Cards */}
      <div>
        <h3 style={{ fontSize: "32px", fontWeight: "bold", color: "#f5f0e8", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "32px", borderBottom: "3px solid rgba(168, 142, 106, 0.2)", paddingBottom: "16px" }}>
          Recent Leads
        </h3>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 0", color: "#a88e6a" }}>
            <Loader2 style={{ height: 48, width: 48, color: "#e3a869" }} className="animate-spin" />
            <span style={{ marginLeft: 16, fontSize: 24, fontWeight: "bold" }}>Loading enquiries...</span>
          </div>
        ) : error ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#ef4444", fontSize: "24px", fontWeight: "bold" }}>{error}</div>
        ) : enquiries.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#a88e6a", fontSize: "24px", fontWeight: "bold" }}>No enquiries found.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {enquiries.map((enq) => (
              <div key={enq.id} style={boxStyle}>
                
                {/* Top Row: Name + Date + Status */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
                  <div>
                    <h4 style={{ color: "#e3a869", fontWeight: "bold", fontSize: "30px", marginBottom: "8px" }}>
                      {enq.name || 'Unknown Guest'}
                    </h4>
                    <span style={{ color: "#a88e6a", fontSize: "16px", fontWeight: "500" }}>
                      {enq.createdAt?.toDate ? enq.createdAt.toDate().toLocaleDateString() : 'Date N/A'}
                    </span>
                  </div>
                  <div style={{ position: "relative" }}>
                    {savingId === enq.id && <Loader2 style={{ position: "absolute", top: -8, right: -8, height: 20, width: 20, color: "#e3a869" }} className="animate-spin" />}
                    <select 
                      value={enq.status || 'New'} 
                      onChange={(e) => updateEnquiry(enq.id, 'status', e.target.value)}
                      style={{
                        padding: "14px 32px 14px 20px",
                        borderRadius: "12px",
                        fontSize: "18px",
                        fontWeight: "800",
                        outline: "none",
                        appearance: "none",
                        cursor: "pointer",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        ...getStatusStyle(enq.status || 'New'),
                      }}
                    >
                      <option value="New" style={{ backgroundColor: "#1a1410", color: "white" }}>New</option>
                      <option value="Contacted" style={{ backgroundColor: "#1a1410", color: "white" }}>Contacted</option>
                      <option value="Confirmed" style={{ backgroundColor: "#1a1410", color: "white" }}>Confirmed</option>
                    </select>
                  </div>
                </div>

                {/* Contact Info + Dates Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "24px", marginBottom: "28px" }}>
                  <div style={{ backgroundColor: "#1a1410", padding: "20px", borderRadius: "16px", border: "2px solid rgba(168, 142, 106, 0.2)" }}>
                    <span style={labelStyle}>Email</span>
                    <span style={{ color: "#f5f0e8", fontSize: "18px", fontWeight: "500", wordBreak: "break-all" }}>{enq.email || '—'}</span>
                  </div>
                  <div style={{ backgroundColor: "#1a1410", padding: "20px", borderRadius: "16px", border: "2px solid rgba(168, 142, 106, 0.2)" }}>
                    <span style={labelStyle}>Phone</span>
                    <span style={{ color: "#f5f0e8", fontSize: "18px", fontWeight: "500" }}>{enq.phone || '—'}</span>
                  </div>
                  <div style={{ backgroundColor: "#1a1410", padding: "20px", borderRadius: "16px", border: "2px solid rgba(168, 142, 106, 0.2)" }}>
                    <span style={labelStyle}>Check-In</span>
                    <span style={{ color: "#e3a869", fontSize: "18px", fontWeight: "700" }}>{enq.checkIn || '—'}</span>
                  </div>
                  <div style={{ backgroundColor: "#1a1410", padding: "20px", borderRadius: "16px", border: "2px solid rgba(168, 142, 106, 0.2)" }}>
                    <span style={labelStyle}>Check-Out</span>
                    <span style={{ color: "#e3a869", fontSize: "18px", fontWeight: "700" }}>{enq.checkOut || '—'}</span>
                  </div>
                </div>

                {/* Notes + WhatsApp */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "24px", paddingTop: "24px", borderTop: "3px solid rgba(168, 142, 106, 0.15)" }}>
                  <div>
                    <span style={labelStyle}>Notes (auto-saves on blur)</span>
                    <textarea 
                      defaultValue={enq.notes || ''}
                      onBlur={(e) => {
                        if (e.target.value !== enq.notes) updateEnquiry(enq.id, 'notes', e.target.value);
                      }}
                      placeholder="Add notes about this guest..."
                      style={{
                        width: "100%",
                        minHeight: "100px",
                        backgroundColor: "#1a1410",
                        border: "3px solid rgba(168, 142, 106, 0.4)",
                        color: "#f5f0e8",
                        padding: "18px 24px",
                        borderRadius: "16px",
                        fontSize: "18px",
                        fontWeight: "500",
                        outline: "none",
                        resize: "vertical",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end" }}>
                    <a 
                      href={`https://wa.me/${(enq.phone || '').replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        ...btnStyle("rgba(37, 211, 102, 0.15)", "#25D366", "#25D366"),
                        minHeight: "100px",
                        flexDirection: "column",
                        padding: "20px 32px",
                        textAlign: "center",
                      }}
                    >
                      <MessageCircle style={{ height: 28, width: 28 }} />
                      WhatsApp
                    </a>
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
