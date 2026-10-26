type ContactEmail = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] ?? character,
  );
}

async function sendResendEmail(payload: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return false;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      reply_to: payload.replyTo,
    }),
  });
  if (!response.ok) {
    console.error(
      "Transactional email failed:",
      response.status,
      await response.text(),
    );
    return false;
  }
  return true;
}

export async function sendContactEmails(contact: ContactEmail) {
  const notificationAddress = process.env.CONTACT_NOTIFICATION_EMAIL;
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.RESEND_FROM_EMAIL ||
    !notificationAddress
  ) {
    console.warn("Contact email notifications are not configured.");
    return;
  }
  const name = escapeHtml(contact.name);
  const email = escapeHtml(contact.email);
  const topic = escapeHtml(contact.topic || "General enquiry");
  const message = escapeHtml(contact.message).replace(/\n/g, "<br />");
  await Promise.all([
    sendResendEmail({
      to: notificationAddress,
      replyTo: contact.email,
      subject: `New 507 Head contact message: ${contact.topic || "General enquiry"}`,
      html: `<h1>New contact message</h1><p><strong>From:</strong> ${name} (${email})</p><p><strong>Topic:</strong> ${topic}</p><p>${message}</p>`,
    }),
    sendResendEmail({
      to: contact.email,
      subject: "We received your message | 507 Head",
      html: `<p>Namaste ${name},</p><p>Thank you for contacting 507 Head. Our editorial team has received your message and will respond if needed.</p><p><strong>Your topic:</strong> ${topic}</p>`,
    }),
  ]);
}
