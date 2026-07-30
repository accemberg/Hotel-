import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { sendMail } from "../../lib/email/resend";
import { guestAutoReplyEmail, internalNotificationEmail } from "../../lib/email/templates";

const INTERNAL_NOTIFY_EMAIL = process.env.INTERNAL_NOTIFY_EMAIL;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { guestName, contact, message, roomName } = req.body || {};

  if (!guestName || !contact || !message) {
    return res.status(400).json({
      success: false,
      error: "guestName, contact, and message are required",
    });
  }

  try {
    const docRef = await addDoc(collection(db, "enquiries"), {
      guestName,
      contact,
      message,
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
      if (!result.success) {
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
      if (!result.success) {
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