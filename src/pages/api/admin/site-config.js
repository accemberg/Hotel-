import { adminDb } from "../../../lib/firebase-admin";
import { withAdminAuth } from "../../../lib/middleware/verifyAdmin";
import { rateLimit } from "../../../lib/rateLimit";

async function handler(req, res) {
  try {
    const docRef = adminDb.collection("settings").doc("siteConfig");
    const docSnap = await docRef.get();

    if (req.method === "GET") {
      if (!docSnap.exists) {
        return res.status(404).json({ success: false, error: "Site config not found" });
      }
      return res.status(200).json({ id: docSnap.id, ...docSnap.data() });
    }

    if (req.method === "PATCH") {
      const updates = req.body || {};
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ success: false, error: "No fields provided to update" });
      }
      await docRef.set(updates, { merge: true });
      return res.status(200).json({ success: true });
    }

    res.setHeader("Allow", ["GET", "PATCH"]);
    return res.status(405).json({ success: false, error: "Method not allowed" });
  } catch (err) {
    console.error("/api/admin/site-config failed:", err);
    return res.status(500).json({ success: false, error: "Failed to process site config" });
  }
}

export default rateLimit({ windowMs: 60_000, max: 20 })(withAdminAuth(handler));