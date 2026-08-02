import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const snapshot = await getDocs(collection(db, "otaLinks"));
    const otaLinks = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.status(200).json(otaLinks);
  } catch (err) {
    console.error("GET /api/ota-links failed:", err);
    return res.status(500).json({ success: false, error: "Failed to fetch OTA links" });
  }
}
