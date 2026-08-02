import { adminDb } from "../../../lib/firebase-admin";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  // TEMPORARY: full Firebase Auth token verification lands Day 4 per the
  // brief ("Protect all admin routes with Firebase Auth middleware").
  // Until then, this route is unprotected — do not deploy to production
  // or share this URL outside the dev team.

  try {
    const snapshot = await adminDb
      .collection("enquiries")
      .orderBy("createdAt", "desc")
      .get();

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