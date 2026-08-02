import { adminAuth } from "../firebase-admin";

export function withAdminAuth(handler) {
  return async (req, res) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, error: "Missing or invalid Authorization header" });
    }

    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      req.admin = decodedToken;
      return handler(req, res);
    } catch (err) {
      console.error("Admin token verification failed:", err);
      return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }
  };
}