export function guestAutoReplyEmail({ guestName, roomName }) {
  return {
    subject: "We received your enquiry — Moksh Haveli Inn",
    html: `
      <div style="font-family: Arial, sans-serif; color: #2E251C;">
        <h2 style="color: #B0872F;">Thank you, ${guestName}!</h2>
        <p>We've received your enquiry${roomName ? ` about the <strong>${roomName}</strong>` : ""} at Moksh Haveli Inn, Varanasi.</p>
        <p>Our team will get back to you shortly on WhatsApp or the contact details you provided.</p>
        <p style="margin-top: 24px; color: #8C7B5D;">— Moksh Haveli Inn</p>
      </div>
    `,
  };
}

export function internalNotificationEmail({ guestName, contact, message, roomName }) {
  return {
    subject: `New Enquiry: ${guestName}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h3>New website enquiry</h3>
        <p><strong>Guest:</strong> ${guestName}</p>
        <p><strong>Contact:</strong> ${contact}</p>
        ${roomName ? `<p><strong>Room:</strong> ${roomName}</p>` : ""}
        <p><strong>Message:</strong> ${message}</p>
      </div>
    `,
  };
}