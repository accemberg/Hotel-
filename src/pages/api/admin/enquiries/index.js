import { adminDb } from "../../../../lib/firebase-admin";
import { withAdminAuth } from "../../../../lib/middleware/verifyAdmin";
import { rateLimit } from "../../../../lib/rateLimit";

async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const snapshot = await adminDb.collection("enquiries").orderBy("createdAt", "desc").get();
    const enquiries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).json(enquiries);
  } catch (err) {
    console.error("GET /api/admin/enquiries failed:", err);
    return res.status(500).json({ success: false, error: "Failed to fetch enquiries" });
  }
}

export default rateLimit({ windowMs: 60_000, max: 30 })(withAdminAuth(handler));