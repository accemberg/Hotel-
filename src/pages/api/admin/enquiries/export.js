import { adminDb } from "../../../../lib/firebase-admin";
import { withAdminAuth } from "../../../../lib/middleware/verifyAdmin";
import { rateLimit } from "../../../../lib/rateLimit";

function toCsvValue(value) {
  if (value === null || value === undefined) return "";
  return `"${String(value).replace(/"/g, '""')}"`;
}

async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const snapshot = await adminDb.collection("enquiries").orderBy("createdAt", "desc").get();
    const headers = ["id", "guestName", "contact", "roomName", "message", "status", "notes", "createdAt"];
    const rows = snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : "";
      return [
        doc.id,
        data.guestName,
        data.contact,
        data.roomName || "",
        data.message,
        data.status,
        data.notes || "",
        createdAt,
      ]
        .map(toCsvValue)
        .join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=enquiries.csv");
    return res.status(200).send(csv);
  } catch (err) {
    console.error("GET /api/admin/enquiries/export failed:", err);
    return res.status(500).json({ success: false, error: "Failed to export enquiries" });
  }
}

export default rateLimit({ windowMs: 60_000, max: 10 })(withAdminAuth(handler));