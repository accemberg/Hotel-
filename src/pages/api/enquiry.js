import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { sendMail } from "../../lib/email/resend";
import { guestAutoReplyEmail, internalNotificationEmail } from "../../lib/email/templates";
import { rateLimit } from "../../lib/rateLimit";

const INTERNAL_NOTIFY_EMAIL = process.env.INTERNAL_NOTIFY_EMAIL;

async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { guestName, contact, message, roomName } = req.body || {};

  if (!guestName || typeof guestName !== "string" || guestName.trim().length < 2) {
    return res.status(400).json({ success: false, error: "guestName must be at least 2 characters" });
  }
  if (!contact || typeof contact !== "string" || contact.trim().length < 5) {
    return res.status(400).json({ success: false, error: "contact must be a valid email or phone number" });
  }
  if (!message || typeof message !== "string" || message.trim().length < 5) {
    return res.status(400).json({ success: false, error: "message must be at least 5 characters" });
  }
  if (message.length > 2000) {
    return res.status(400).json({ success: false, error: "message is too long (max 2000 characters)" });
  }
  if (roomName !== undefined && typeof roomName !== "string") {
    return res.status(400).json({ success: false, error: "roomName must be a string" });
  }

  try {
    const docRef = await addDoc(collection(db, "enquiries"), {
      guestName: guestName.trim(),
      contact: contact.trim(),
      message: message.trim(),
      roomName: roomName || null,
      status: "New",
      createdAt: serverTimestamp(),
    });

    try {
      const guestEmail = guestAutoReplyEmail({ guestName, roomName });
      const result = await sendMail({
        to: contact.includes("@") ? contact : undefined,
        subject: guestEmail.subject,
        html: guestEmail.html,
      });
      if (result?.error) {
        console.error("Guest auto-reply failed:", result.error);
      }
    } catch (emailErr) {
      console.error("Guest auto-reply failed:", emailErr);
    }

    try {
      const internalEmail = internalNotificationEmail({ guestName, contact, message, roomName });
      const result = await sendMail({
        to: INTERNAL_NOTIFY_EMAIL,
        subject: internalEmail.subject,
        html: internalEmail.html,
      });
      if (result?.error) {
        console.error("Internal notification failed:", result.error);
      }
    } catch (emailErr) {
      console.error("Internal notification failed:", emailErr);
    }

    return res.status(201).json({ success: true, id: docRef.id });
  } catch (err) {
    console.error("POST /api/enquiry failed:", err);
    return res.status(500).json({ success: false, error: "Failed to submit enquiry" });
  }
}

export default rateLimit({ windowMs: 60_000, max: 5 })(handler);