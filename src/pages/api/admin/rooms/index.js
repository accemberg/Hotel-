import { adminDb } from "../../../../lib/firebase-admin";
import { withAdminAuth } from "../../../../lib/middleware/verifyAdmin";
import { rateLimit } from "../../../../lib/rateLimit";

async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { name, description, slug, beds, maxOccupancy, qty, rate, size } = req.body || {};

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ success: false, error: "name must be at least 2 characters" });
  }
  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ success: false, error: "slug is required" });
  }
  if (typeof rate !== "number" || rate <= 0) {
    return res.status(400).json({ success: false, error: "rate must be a positive number" });
  }
  if (typeof qty !== "number" || qty < 0 || !Number.isInteger(qty)) {
    return res.status(400).json({ success: false, error: "qty must be a non-negative integer" });
  }
  if (maxOccupancy !== undefined && (typeof maxOccupancy !== "number" || maxOccupancy <= 0)) {
    return res.status(400).json({ success: false, error: "maxOccupancy must be a positive number" });
  }

  try {
    const docRef = await adminDb.collection("rooms").add({
      name: name.trim(),
      description: description || "",
      slug,
      beds: beds || "",
      maxOccupancy: maxOccupancy || 1,
      qty,
      rate,
      size: size || "",
      available: true,
    });
    return res.status(201).json({ success: true, id: docRef.id });
  } catch (err) {
    console.error("POST /api/admin/rooms failed:", err);
    return res.status(500).json({ success: false, error: "Failed to create room" });
  }
}

export default rateLimit({ windowMs: 60_000, max: 20 })(withAdminAuth(handler));