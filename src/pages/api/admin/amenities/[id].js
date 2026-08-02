import { adminDb } from "../../../../lib/firebase-admin";
import { withAdminAuth } from "../../../../lib/middleware/verifyAdmin";
import { rateLimit } from "../../../../lib/rateLimit";

async function handler(req, res) {
  const { id } = req.query;
  const ref = adminDb.collection("amenities").doc(id);

  if (req.method === "PATCH") {
    const updates = req.body || {};
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: "No fields provided to update" });
    }
    try {
      const doc = await ref.get();
      if (!doc.exists) return res.status(404).json({ success: false, error: "Amenity not found" });
      await ref.update(updates);
      return res.status(200).json({ success: true, id });
    } catch (err) {
      console.error("PATCH /api/admin/amenities/:id failed:", err);
      return res.status(500).json({ success: false, error: "Failed to update amenity" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const doc = await ref.get();
      if (!doc.exists) return res.status(404).json({ success: false, error: "Amenity not found" });
      await ref.delete();
      return res.status(200).json({ success: true, id });
    } catch (err) {
      console.error("DELETE /api/admin/amenities/:id failed:", err);
      return res.status(500).json({ success: false, error: "Failed to delete amenity" });
    }
  }

  res.setHeader("Allow", ["PATCH", "DELETE"]);
  return res.status(405).json({ success: false, error: "Method not allowed" });
}

export default rateLimit({ windowMs: 60_000, max: 20 })(withAdminAuth(handler));