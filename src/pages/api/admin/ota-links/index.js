import { adminDb } from "../../../../lib/firebase-admin";
import { withAdminAuth } from "../../../../lib/middleware/verifyAdmin";
import { rateLimit } from "../../../../lib/rateLimit";

async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { platform, listingUrl, logoUrl, active } = req.body || {};

  if (!platform || typeof platform !== "string") {
    return res.status(400).json({ success: false, error: "platform is required" });
  }
  if (!listingUrl || typeof listingUrl !== "string") {
    return res.status(400).json({ success: false, error: "listingUrl is required" });
  }
  if (active !== undefined && typeof active !== "boolean") {
    return res.status(400).json({ success: false, error: "active must be a boolean" });
  }

  try {
    const docRef = await adminDb.collection("otaLinks").add({
      platform,
      listingUrl,
      logoUrl: logoUrl || "",
      active: active ?? true,
    });
    return res.status(201).json({ success: true, id: docRef.id });
  } catch (err) {
    console.error("POST /api/admin/ota-links failed:", err);
    return res.status(500).json({ success: false, error: "Failed to create OTA link" });
  }
}

export default rateLimit({ windowMs: 60_000, max: 20 })(withAdminAuth(handler));