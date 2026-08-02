import { db } from "../../lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { category } = req.query;

  try {
    const galleryRef = collection(db, "gallery");
    const q = category
      ? query(galleryRef, where("category", "==", category), orderBy("order"))
      : query(galleryRef, orderBy("order"));

    const snapshot = await getDocs(q);
    const images = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.status(200).json(images);
  } catch (err) {
    console.error("GET /api/gallery failed:", err);
    return res.status(500).json({ success: false, error: "Failed to fetch gallery" });
  }
}