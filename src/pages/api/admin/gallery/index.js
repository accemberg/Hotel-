import { adminDb } from "../../../../lib/firebase-admin";
import { withAdminAuth } from "../../../../lib/middleware/verifyAdmin";
import { rateLimit } from "../../../../lib/rateLimit";

async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { category, imageUrl, order } = req.body || {};

  if (!category || typeof category !== "string") {
    return res.status(400).json({ success: false, error: "category is required" });
  }
  if (!imageUrl || typeof imageUrl !== "string") {
    return res.status(400).json({ success: false, error: "imageUrl is required" });
  }
  if (order !== undefined && typeof order !== "number") {
    return res.status(400).json({ success: false, error: "order must be a number" });
  }

  try {
    const docRef = await adminDb.collection("gallery").add({
      category,
      imageUrl,
      order: typeof order === "number" ? order : 0,
    });
    return res.status(201).json({ success: true, id: docRef.id });
  } catch (err) {
    console.error("POST /api/admin/gallery failed:", err);
    return res.status(500).json({ success: false, error: "Failed to add gallery image" });
  }
}

export default rateLimit({ windowMs: 60_000, max: 20 })(withAdminAuth(handler));