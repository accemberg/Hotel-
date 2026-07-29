import rooms from "../../mocks/rooms.json";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    // TODO Day 2: swap for Firestore read against Aryan's `rooms` collection
    // const snapshot = await db.collection("rooms").get();
    // const rooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json(rooms);
  } catch (err) {
    console.error("GET /api/rooms failed:", err);
    return res.status(500).json({ success: false, error: "Failed to fetch rooms" });
  }
}