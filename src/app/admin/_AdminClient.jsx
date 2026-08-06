"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Users, Mail, CheckCircle, Clock, PlusCircle, Image as ImageIcon, Settings, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, confirmed: 0 });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const snapshot = await getDocs(collection(db, "enquiries"));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const newLeads = data.filter(d => d.status === "New" || !d.status).length;
        const contacted = data.filter(d => d.status === "Contacted").length;
        const confirmed = data.filter(d => d.status === "Confirmed").length;
        
        setStats({ total: data.length, new: newLeads, contacted, confirmed });

        // Sort by createdAt descending and get top 3
        const sorted = data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 3);
        setRecentEnquiries(sorted);
      } catch (error) {
        // Silently handle
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Enquiries", value: stats.total, icon: Users, color: "#e3a869" },
    { title: "New Leads", value: stats.new, icon: Mail, color: "#60a5fa" },
    { title: "Contacted", value: stats.contacted, icon: Clock, color: "#fbbf24" },
    { title: "Confirmed", value: stats.confirmed, icon: CheckCircle, color: "#34d399" },
  ];

  const cardStyle = {
    backgroundColor: "#2a221a",
    border: "3px solid rgba(168, 142, 106, 0.25)",
    borderRadius: "24px",
    padding: "40px",
    transition: "all 0.3s",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  };

  const linkStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "24px 32px",
    backgroundColor: "#1a1410",
    border: "3px solid rgba(168, 142, 106, 0.4)",
    borderRadius: "16px",
    color: "#e3a869",
    fontWeight: "bold",
    fontSize: "20px",
    textDecoration: "none",
    transition: "all 0.3s",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  };

  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed': return { color: "#34d399", border: "2px solid rgba(52, 211, 153, 0.4)", backgroundColor: "rgba(52, 211, 153, 0.1)" };
      case 'contacted': return { color: "#60a5fa", border: "2px solid rgba(96, 165, 250, 0.4)", backgroundColor: "rgba(96, 165, 250, 0.1)" };
      default: return { color: "#e3a869", border: "2px solid rgba(227, 168, 105, 0.4)", backgroundColor: "rgba(227, 168, 105, 0.1)" };
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "48px" }}>
      
      {/* Header */}
      <div>
        <h2 style={{ 
          fontSize: "48px", fontWeight: "bold", color: 'var(--color-saffron)', 
          textTransform: "uppercase", letterSpacing: "0.05em",
          textShadow: "0 0 20px rgba(227, 168, 105, 0.4)",
          fontFamily: "var(--font-tt-ramillas-variable)",
        }}>
          Dashboard Overview
        </h2>
        <p style={{ color: "#a88e6a", marginTop: "12px", fontSize: "20px", fontWeight: "500" }}>
          Welcome back to the Moksh Haveli Inn Admin Portal.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "32px" }}>
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <span style={{ 
                  color: "#a88e6a", textTransform: "uppercase", letterSpacing: "0.15em", 
                  fontSize: "16px", fontWeight: "800" 
                }}>
                  {stat.title}
                </span>
                <Icon style={{ height: 36, width: 36, color: stat.color }} />
              </div>
              <div style={{ 
                fontSize: "56px", fontWeight: "bold", color: 'var(--color-saffron)',
                fontFamily: "var(--font-tt-ramillas-variable)",
                textShadow: "0 0 15px rgba(227, 168, 105, 0.3)",
              }}>
                {loading ? "—" : stat.value}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>
        {/* Recent Enquiries */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", borderBottom: "3px solid rgba(168, 142, 106, 0.2)", paddingBottom: "16px" }}>
            <h3 style={{ fontSize: "28px", fontWeight: "bold", color: "#f5f0e8", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Recent Enquiries
            </h3>
            <Link href="/admin/enquiries" style={{ color: "#e3a869", fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "none" }}>
              View All →
            </Link>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {loading ? (
              <p style={{ color: "#a88e6a", fontSize: "20px" }}>Loading...</p>
            ) : recentEnquiries.length === 0 ? (
              <p style={{ color: "#a88e6a", fontSize: "20px" }}>No recent enquiries.</p>
            ) : (
              recentEnquiries.map(enq => (
                <div key={enq.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1a1410", padding: "24px 32px", borderRadius: "16px", border: "2px solid rgba(168, 142, 106, 0.2)" }}>
                  <div>
                    <h4 style={{ color: "#f5f0e8", fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>{enq.name || 'Unknown'}</h4>
                    <span style={{ color: "#a88e6a", fontSize: "16px" }}>{enq.phone || enq.email || 'No contact info'}</span>
                  </div>
                  <div style={{ padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.1em", ...getStatusStyle(enq.status) }}>
                    {enq.status || 'New'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: "28px", fontWeight: "bold", color: "#f5f0e8", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "32px", borderBottom: "3px solid rgba(168, 142, 106, 0.2)", paddingBottom: "16px" }}>
            Quick Links
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Link href="/admin/rooms" style={linkStyle}>
              <PlusCircle style={{ height: 28, width: 28 }} /> Add / Edit Room
            </Link>
            <Link href="/admin/gallery" style={linkStyle}>
              <ImageIcon style={{ height: 28, width: 28 }} /> Manage Gallery
            </Link>
            <Link href="/admin/enquiries" style={linkStyle}>
              <MessageSquare style={{ height: 28, width: 28 }} /> View CRM
            </Link>
            <Link href="/admin/settings" style={linkStyle}>
              <Settings style={{ height: 28, width: 28 }} /> Site Settings
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
