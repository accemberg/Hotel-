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

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL;

export const resend = new Proxy({}, {
  get: (target, prop) => {
    const r = getResend();
    const val = Reflect.get(r, prop);
    return typeof val === "function" ? val.bind(r) : val;
  }
});

export async function sendMail({ to, subject, html }) {
  try {
    const resendClient = getResend();
    const { data, error } = await resendClient.emails.send({
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