import { adminDb } from '../../lib/firebase-admin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  try {
    const docSnap = await adminDb.collection("settings").doc("siteConfig").get();
    if (!docSnap.exists) {
      return res.status(404).json({ success: false, error: "Site config not found" });
    }
    return res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    console.error("Error fetching site config:", error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
