import { adminDb } from "../../../../lib/firebase-admin";
import { withAdminAuth } from "../../../../lib/middleware/verifyAdmin";
import { rateLimit } from "../../../../lib/rateLimit";

const VALID_STATUSES = ["New", "Contacted", "Confirmed", "Closed"];

async function handler(req, res) {
  const { id } = req.query;
  const ref = adminDb.collection("enquiries").doc(id);

  if (req.method === "PATCH") {
    const { status, notes } = req.body || {};

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `status must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }
    if (!status && notes === undefined) {
      return res.status(400).json({ success: false, error: "Provide status and/or notes to update" });
    }
    if (notes !== undefined && typeof notes !== "string") {
      return res.status(400).json({ success: false, error: "notes must be a string" });
    }

    try {
      const doc = await ref.get();
      if (!doc.exists) {
        return res.status(404).json({ success: false, error: "Enquiry not found" });
      }

      const updates = {};
      if (status) updates.status = status;
      if (notes !== undefined) updates.notes = notes;

      await ref.update(updates);
      return res.status(200).json({ success: true, id });
    } catch (err) {
      console.error("PATCH /api/admin/enquiries/:id failed:", err);
      return res.status(500).json({ success: false, error: "Failed to update enquiry" });
    }
  }

  res.setHeader("Allow", ["PATCH"]);
  return res.status(405).json({ success: false, error: "Method not allowed" });
}

export default rateLimit({ windowMs: 60_000, max: 20 })(withAdminAuth(handler));