// Contact form endpoint (Vercel Function).
// Sends the message through Resend, the email provider installed from the
// Vercel Marketplace (it sets RESEND_API_KEY on the project).

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX = { name: 120, email: 200, message: 5000 };

// Where the message lands. Override with CONTACT_TO if it ever changes.
const TO_ADDRESS = process.env.CONTACT_TO || "jjsederia08@gmail.com";

// onboarding@resend.dev works without a verified domain. Set CONTACT_FROM once
// a domain is verified in Resend, e.g. "Portfolio <hello@james-sederia.dev>".
const FROM_ADDRESS =
  process.env.CONTACT_FROM || "Portfolio Contact <onboarding@resend.dev>";

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

/** Vercel pre-parses JSON bodies; the Vite dev server does not. */
async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Keep user input out of the mail headers. */
function singleLine(value) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set.");
    return sendJson(res, 500, { error: "Email is not configured." });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return sendJson(res, 400, { error: "Invalid request body." });
  }

  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const message = String(body?.message ?? "").trim();

  if (!name || !email || !message) {
    return sendJson(res, 400, { error: "All fields are required." });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return sendJson(res, 400, { error: "Enter a valid email address." });
  }
  if (
    name.length > MAX.name ||
    email.length > MAX.email ||
    message.length > MAX.message
  ) {
    return sendJson(res, 400, { error: "Message is too long." });
  }

  const safeName = singleLine(name);

  let response;
  try {
    response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [TO_ADDRESS],
        reply_to: email,
        subject: `New message from ${safeName}`,
        text: `Name: ${safeName}\nEmail: ${email}\n\n${message}`,
        html: `
          <h2>New message from ${escapeHtml(safeName)}</h2>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p style="white-space: pre-wrap">${escapeHtml(message)}</p>
        `,
      }),
    });
  } catch (error) {
    console.error("Resend request failed:", error);
    return sendJson(res, 502, { error: "Could not reach the email service." });
  }

  if (!response.ok) {
    // Log the provider's reason, but don't leak it to the browser.
    console.error("Resend responded:", response.status, await response.text());
    return sendJson(res, 502, { error: "Could not send the message." });
  }

  return sendJson(res, 200, { ok: true });
}
