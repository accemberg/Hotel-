import { db } from "../../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ success: false, error: "Missing slug parameter" });
  }

  try {
    const q = query(collection(db, "rooms"), where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).json({ success: false, error: "Room not found" });
    }

    const roomDoc = snapshot.docs[0];
    const room = { id: roomDoc.id, ...roomDoc.data() };
    return res.status(200).json(room);
  } catch (err) {
    console.error("GET /api/rooms/[slug] failed:", err);
    return res.status(500).json({ success: false, error: "Failed to fetch room" });
  }
}