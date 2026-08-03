import { adminDb } from "../../../../lib/firebase-admin";
import { withAdminAuth } from "../../../../lib/middleware/verifyAdmin";
import { rateLimit } from "../../../../lib/rateLimit";

async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { name, category, notes } = req.body || {};

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ success: false, error: "name must be at least 2 characters" });
  }
  if (!category || typeof category !== "string") {
    return res.status(400).json({ success: false, error: "category is required" });
  }

  try {
    const docRef = await adminDb.collection("amenities").add({
      name: name.trim(),
      category,
      notes: notes || "",
    });
    return res.status(201).json({ success: true, id: docRef.id });
  } catch (err) {
    console.error("POST /api/admin/amenities failed:", err);
    return res.status(500).json({ success: false, error: "Failed to create amenity" });
  }
}

export default rateLimit({ windowMs: 60_000, max: 20 })(withAdminAuth(handler));