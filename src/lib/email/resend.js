import { Resend } from "resend";

// Lazily instantiated so missing env vars don't crash the server at startup
let _resend = null;
function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set in .env.local");
  }
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export async function sendMail({ to, subject, html }) {
  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to,
      subject,
      html,
    });
    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error("Resend send failed:", err);
    return { success: false, error: err.message };
  }
}