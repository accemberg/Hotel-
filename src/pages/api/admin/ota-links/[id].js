import { adminDb } from "../../../../lib/firebase-admin";
import { withAdminAuth } from "../../../../lib/middleware/verifyAdmin";
import { rateLimit } from "../../../../lib/rateLimit";

async function handler(req, res) {
  const { id } = req.query;
  const ref = adminDb.collection("otaLinks").doc(id);

  if (req.method === "PATCH") {
    const updates = req.body || {};
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: "No fields provided to update" });
    }
    if (updates.active !== undefined && typeof updates.active !== "boolean") {
      return res.status(400).json({ success: false, error: "active must be a boolean" });
    }
    try {
      const doc = await ref.get();
      if (!doc.exists) return res.status(404).json({ success: false, error: "OTA link not found" });
      await ref.update(updates);
      return res.status(200).json({ success: true, id });
    } catch (err) {
      console.error("PATCH /api/admin/ota-links/:id failed:", err);
      return res.status(500).json({ success: false, error: "Failed to update OTA link" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const doc = await ref.get();
      if (!doc.exists) return res.status(404).json({ success: false, error: "OTA link not found" });
      await ref.delete();
      return res.status(200).json({ success: true, id });
    } catch (err) {
      console.error("DELETE /api/admin/ota-links/:id failed:", err);
      return res.status(500).json({ success: false, error: "Failed to delete OTA link" });
    }
  }

  res.setHeader("Allow", ["PATCH", "DELETE"]);
  return res.status(405).json({ success: false, error: "Method not allowed" });
}

export default rateLimit({ windowMs: 60_000, max: 20 })(withAdminAuth(handler));