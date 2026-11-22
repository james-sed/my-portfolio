// Contact form endpoint (Vercel Function).
// Sends the message through Resend, the email provider installed from the
// Vercel Marketplace (it sets RESEND_API_KEY on the project).
//
// The endpoint is public, so every accepted request costs Resend quota. Layers
// of cheap checks run before anything is sent: cross-site posts are refused,
// per-IP submissions are capped, the body size is bounded, and a honeypot
// field silently drops form-filling bots.

import { CONTACT_LIMITS, EMAIL_PATTERN } from "../shared/contact-limits.js";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const MAX = CONTACT_LIMITS;

const MAX_BODY_BYTES = 16 * 1024;

// Per-IP budget. A real visitor sends one or two messages, so five in ten
// minutes leaves plenty of headroom.
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5, maxKeys: 1000 };

// Best-effort only: Vercel may run several instances, so this caps bursts that
// reach the same one. The firewall rate-limit rule is the shared ceiling.
const submissions = new Map();

class BodyTooLargeError extends Error {}

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
  if (typeof req.body === "string") {
    if (Buffer.byteLength(req.body) > MAX_BODY_BYTES) throw new BodyTooLargeError();
    return JSON.parse(req.body);
  }

  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new BodyTooLargeError();
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

/** First hop in X-Forwarded-For is the client as Vercel saw it. */
function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const first = (value || req.headers["x-real-ip"] || "unknown")
    .split(",")[0]
    .trim();
  return first || "unknown";
}

/**
 * A browser POST from another site is tagged `cross-site`. Refusing those stops
 * third-party pages using this endpoint as a free mail relay. Non-browser
 * clients can omit the header, which is why the rate limit also exists.
 */
function isCrossSite(req) {
  const site = String(req.headers["sec-fetch-site"] || "").toLowerCase();
  return site === "cross-site";
}

/**
 * Read-only check. Only accepted messages are recorded, so a malformed or
 * honeypot submission does not use up a real visitor's budget.
 */
function rateLimitFor(key) {
  const now = Date.now();
  const recent = (submissions.get(key) || []).filter(
    (time) => now - time < RATE_LIMIT.windowMs,
  );
  submissions.set(key, recent);

  if (recent.length < RATE_LIMIT.max) {
    return { limited: false, recent, now };
  }

  // Report the time until the oldest entry leaves the window rather than the
  // whole window, so the client never asks for a longer wait than necessary.
  const retryAfter = Math.max(
    1,
    Math.ceil((recent[0] + RATE_LIMIT.windowMs - now) / 1000),
  );
  return { limited: true, retryAfter, recent, now };
}

function recordSubmission(key, recent, now) {
  recent.push(now);
  submissions.set(key, recent);

  // Drop keys that have gone quiet so the map cannot grow without bound.
  if (submissions.size > RATE_LIMIT.maxKeys) {
    for (const [ip, times] of submissions) {
      if (!times.some((time) => now - time < RATE_LIMIT.windowMs)) {
        submissions.delete(ip);
      }
    }
  }
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

  if (isCrossSite(req)) {
    return sendJson(res, 403, { error: "Request blocked." });
  }

  const ip = clientIp(req);

  const limit = rateLimitFor(ip);
  if (limit.limited) {
    res.setHeader("Retry-After", String(limit.retryAfter));
    return sendJson(res, 429, {
      error: "Too many messages. Please try again later.",
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set.");
    return sendJson(res, 500, { error: "Email is not configured." });
  }

  const declaredLength = Number(req.headers["content-length"]);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return sendJson(res, 413, { error: "Request is too large." });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      return sendJson(res, 413, { error: "Request is too large." });
    }
    return sendJson(res, 400, { error: "Invalid request body." });
  }

  // Honeypot: hidden from people, attractive to bots that fill every input.
  // Answer 200 so they do not retry, but send nothing. The legacy field name
  // is still checked so an old cached bundle stays covered.
  if (
    String(body?.hp_website ?? body?.company_website ?? "").trim()
  ) {
    console.warn("Contact form honeypot triggered from", ip);
    return sendJson(res, 200, { ok: true });
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

  // The message is valid and about to be sent, so it counts against the budget.
  recordSubmission(ip, limit.recent, limit.now);

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
