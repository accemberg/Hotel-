"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Loader2, Save } from "lucide-react";

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
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const docSnap = await getDoc(doc(db, "settings", "siteConfig"));
        if (docSnap.exists()) setConfig(prev => ({ ...prev, ...docSnap.data() }));
      } catch (err) { console.warn("Could not load settings, starting fresh."); }
      finally { setLoading(false); }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setSaveMsg("");
    try {
      await setDoc(doc(db, "settings", "siteConfig"), config);
      setSaveMsg("✅ Settings saved successfully!");
      setTimeout(() => setSaveMsg(""), 4000);
    } catch (err) {
      console.error(err);
      setSaveMsg("❌ Failed to save. Check Firebase security rules — the 'settings' collection needs write access.");
    } finally { setSaving(false); }
  };

  const handleChange = (e) => setConfig({ ...config, [e.target.name]: e.target.value });

  const inputStyle = { width: "100%", minHeight: "80px", backgroundColor: "#1a1410", border: "3px solid rgba(168, 142, 106, 0.4)", color: "#f5f0e8", padding: "20px 24px", borderRadius: "16px", fontSize: "22px", fontWeight: "500", outline: "none", transition: "border-color 0.3s", boxSizing: "border-box" };
  const labelStyle = { display: "block", color: "#a88e6a", textTransform: "uppercase", letterSpacing: "0.15em", fontSize: "18px", fontWeight: "800", marginBottom: "16px" };
  const fieldBoxStyle = { backgroundColor: "#2a221a", border: "2px solid rgba(168, 142, 106, 0.2)", borderRadius: "20px", padding: "32px" };
  const sectionTitle = (title) => (
    <div style={{ fontSize: "32px", fontWeight: "bold", color: "#e3a869", textTransform: "uppercase", letterSpacing: "0.15em", borderBottom: "3px solid rgba(168, 142, 106, 0.2)", paddingBottom: "16px", marginBottom: "8px" }}>{title}</div>
  );

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Loader2 style={{ height: 48, width: 48, color: "#e3a869" }} className="animate-spin" />
        <span style={{ marginLeft: 16, fontSize: 24, color: "#a88e6a", fontWeight: "bold" }}>Loading settings...</span>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "40px" }}>
      <div>
        <h2 style={{ fontSize: "48px", fontWeight: "bold", color: '#DEB76A', textTransform: "uppercase", letterSpacing: "0.05em", textShadow: "0 0 20px rgba(227, 168, 105, 0.4)", fontFamily: "var(--font-tt-ramillas-variable)" }}>Global Settings</h2>
        <p style={{ color: "#a88e6a", marginTop: "12px", fontSize: "20px", fontWeight: "500" }}>Manage your hotel&apos;s contact info, content, and website configuration.</p>
      </div>

      {saveMsg && (
        <div style={{ padding: "20px 32px", borderRadius: "16px", fontSize: "20px", fontWeight: "bold", backgroundColor: saveMsg.includes("✅") ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)", border: saveMsg.includes("✅") ? "2px solid rgba(34, 197, 94, 0.4)" : "2px solid rgba(239, 68, 68, 0.4)", color: saveMsg.includes("✅") ? "#22c55e" : "#ef4444" }}>
          {saveMsg}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        
        {/* ── PROPERTY INFO ── */}
        {sectionTitle("Property Info")}
        <div style={fieldBoxStyle}>
          <label style={labelStyle}>Property Name</label>
          <input type="text" name="siteName" value={config.siteName} onChange={handleChange} style={inputStyle} onFocus={e => e.target.style.borderColor="#e3a869"} onBlur={e => e.target.style.borderColor="rgba(168, 142, 106, 0.4)"} />
        </div>

        {/* ── CONTACT ── */}
        {sectionTitle("Contact Details")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div style={fieldBoxStyle}>
            <label style={labelStyle}>Contact Email</label>
            <input type="email" name="contactEmail" value={config.contactEmail} onChange={handleChange} style={inputStyle} placeholder="info@mokshhaveli.com" onFocus={e => e.target.style.borderColor="#e3a869"} onBlur={e => e.target.style.borderColor="rgba(168, 142, 106, 0.4)"} />
          </div>
          <div style={fieldBoxStyle}>
            <label style={labelStyle}>Contact Phone</label>
            <input type="text" name="contactPhone" value={config.contactPhone} onChange={handleChange} style={inputStyle} placeholder="+91 98765 43210" onFocus={e => e.target.style.borderColor="#e3a869"} onBlur={e => e.target.style.borderColor="rgba(168, 142, 106, 0.4)"} />
          </div>
        </div>

        {/* ── WHATSAPP ── */}
        {sectionTitle("WhatsApp")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "32px" }}>
          <div style={fieldBoxStyle}>
            <label style={labelStyle}>WhatsApp Number</label>
            <input type="text" name="whatsappNumber" value={config.whatsappNumber} onChange={handleChange} style={inputStyle} placeholder="+919876543210" onFocus={e => e.target.style.borderColor="#e3a869"} onBlur={e => e.target.style.borderColor="rgba(168, 142, 106, 0.4)"} />
          </div>
          <div style={fieldBoxStyle}>
            <label style={labelStyle}>Default WhatsApp Message</label>
            <input type="text" name="whatsappMessage" value={config.whatsappMessage} onChange={handleChange} style={inputStyle} placeholder="Hello! I'd like to book a room..." onFocus={e => e.target.style.borderColor="#e3a869"} onBlur={e => e.target.style.borderColor="rgba(168, 142, 106, 0.4)"} />
          </div>
        </div>

        {/* ── LOCATION ── */}
        {sectionTitle("Location")}
        <div style={fieldBoxStyle}>
          <label style={labelStyle}>Physical Address</label>
          <textarea name="address" value={config.address} onChange={handleChange} rows="4" placeholder="Near Pushkar Lake, Pushkar, Rajasthan 305022" style={{ ...inputStyle, minHeight: "150px", resize: "vertical", lineHeight: "1.6" }} onFocus={e => e.target.style.borderColor="#e3a869"} onBlur={e => e.target.style.borderColor="rgba(168, 142, 106, 0.4)"} />
        </div>
        <div style={fieldBoxStyle}>
          <label style={labelStyle}>Google Maps Embed URL</label>
          <input type="url" name="mapEmbedUrl" value={config.mapEmbedUrl} onChange={handleChange} style={inputStyle} placeholder="https://www.google.com/maps/embed?pb=..." onFocus={e => e.target.style.borderColor="#e3a869"} onBlur={e => e.target.style.borderColor="rgba(168, 142, 106, 0.4)"} />
          <p style={{ color: "#a88e6a", marginTop: "12px", fontSize: "16px" }}>Tip: Go to Google Maps → Share → Embed a map → Copy the src URL from the iframe code.</p>
        </div>

        {/* ── SOCIAL MEDIA ── */}
        {sectionTitle("Social Media")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div style={fieldBoxStyle}>
            <label style={labelStyle}>Instagram URL</label>
            <input type="url" name="instagramUrl" value={config.instagramUrl} onChange={handleChange} style={inputStyle} placeholder="https://instagram.com/mokshhavelinn" onFocus={e => e.target.style.borderColor="#e3a869"} onBlur={e => e.target.style.borderColor="rgba(168, 142, 106, 0.4)"} />
          </div>
          <div style={fieldBoxStyle}>
            <label style={labelStyle}>Facebook URL</label>
            <input type="url" name="facebookUrl" value={config.facebookUrl} onChange={handleChange} style={inputStyle} placeholder="https://facebook.com/mokshhavelinn" onFocus={e => e.target.style.borderColor="#e3a869"} onBlur={e => e.target.style.borderColor="rgba(168, 142, 106, 0.4)"} />
          </div>
        </div>

        {/* ── WEBSITE CONTENT ── */}
        {sectionTitle("Website Content")}
        <div style={fieldBoxStyle}>
          <label style={labelStyle}>Hero / Banner Text</label>
          <textarea name="heroText" value={config.heroText} onChange={handleChange} rows="3" placeholder="Experience the soul of Rajasthan..." style={{ ...inputStyle, minHeight: "130px", resize: "vertical", lineHeight: "1.6" }} onFocus={e => e.target.style.borderColor="#e3a869"} onBlur={e => e.target.style.borderColor="rgba(168, 142, 106, 0.4)"} />
        </div>
        <div style={fieldBoxStyle}>
          <label style={labelStyle}>About Section Text</label>
          <textarea name="aboutText" value={config.aboutText} onChange={handleChange} rows="6" placeholder="Moksh Haveli Inn is a boutique heritage property..." style={{ ...inputStyle, minHeight: "220px", resize: "vertical", lineHeight: "1.6" }} onFocus={e => e.target.style.borderColor="#e3a869"} onBlur={e => e.target.style.borderColor="rgba(168, 142, 106, 0.4)"} />
        </div>

        {/* ── SEO ── */}
        {sectionTitle("SEO Meta Tags")}
        <div style={fieldBoxStyle}>
          <label style={labelStyle}>Meta Title</label>
          <input type="text" name="metaTitle" value={config.metaTitle} onChange={handleChange} style={inputStyle} placeholder="Moksh Haveli Inn — Boutique Heritage Hotel in Pushkar" onFocus={e => e.target.style.borderColor="#e3a869"} onBlur={e => e.target.style.borderColor="rgba(168, 142, 106, 0.4)"} />
        </div>
        <div style={fieldBoxStyle}>
          <label style={labelStyle}>Meta Description</label>
          <textarea name="metaDescription" value={config.metaDescription} onChange={handleChange} rows="3" placeholder="Stay at Moksh Haveli Inn in Pushkar — a unique heritage experience near the sacred lake." style={{ ...inputStyle, minHeight: "130px", resize: "vertical", lineHeight: "1.6" }} onFocus={e => e.target.style.borderColor="#e3a869"} onBlur={e => e.target.style.borderColor="rgba(168, 142, 106, 0.4)"} />
          <p style={{ color: "#a88e6a", marginTop: "12px", fontSize: "16px" }}>Recommended: 150–160 characters. Current: {config.metaDescription.length} characters.</p>
        </div>

        {/* ── SAVE ── */}
        <div style={{ borderTop: "3px solid rgba(168, 142, 106, 0.2)", paddingTop: "40px", display: "flex", justifyContent: "flex-end" }}>
          <button disabled={saving} type="submit" style={{ padding: "24px 64px", backgroundColor: "#e3a869", color: "#1a1410", textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "24px", fontWeight: "900", borderRadius: "20px", border: "none", cursor: saving ? "wait" : "pointer", display: "flex", alignItems: "center", gap: "16px", opacity: saving ? 0.6 : 1, boxShadow: "0 8px 32px rgba(227, 168, 105, 0.4)", transition: "all 0.3s" }}>
            {saving ? <Loader2 style={{ height: 32, width: 32 }} className="animate-spin" /> : <Save style={{ height: 32, width: 32 }} />}
            {saving ? "SAVING..." : "SAVE SETTINGS"}
          </button>
        </div>
      </form>
    </div>
  );
}
