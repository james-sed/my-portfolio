import { useState } from "react";
import { FaEnvelope, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineCheckCircle } from "react-icons/hi";
import Reveal from "./Reveal";
import { SOCIAL_LINKS } from "../site.config";
import { CONTACT_LIMITS, EMAIL_PATTERN } from "../../shared/contact-limits.js";

// Shared with /api/contact.js so the two sides cannot drift apart.
const MAX_LENGTH = CONTACT_LIMITS;

// Friendly rewrites of the API's 400 messages. The server's wording is for
// operators, so it is mapped here instead of being shown verbatim.
const FIELD_ERRORS = {
  "All fields are required.": "Please fill in your name, email, and message.",
  "Enter a valid email address.": "Enter a valid email address.",
  "Message is too long.": "That message is too long. Please shorten it.",
};

function formatRetryAfter(retryAfter) {
  if (!retryAfter) return null;
  let seconds = Number.parseInt(retryAfter, 10);
  if (Number.isNaN(seconds)) {
    const date = Date.parse(retryAfter);
    if (!Number.isNaN(date)) {
      seconds = Math.max(0, Math.ceil((date - Date.now()) / 1000));
    }
  }
  if (!Number.isFinite(seconds) || seconds <= 0) return null;

  if (seconds < 60) {
    return `${seconds} second${seconds === 1 ? "" : "s"}`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

const METHODS = [
  {
    id: "email",
    Icon: FaEnvelope,
    external: false,
    ...SOCIAL_LINKS.email,
  },
  {
    id: "github",
    Icon: FaGithub,
    external: true,
    ...SOCIAL_LINKS.github,
  },
  {
    id: "linkedin",
    Icon: FaLinkedinIn,
    external: true,
    ...SOCIAL_LINKS.linkedin,
  },
];

const FIELDS = ["name", "email", "message"];

const EMPTY_ERRORS = { name: "", email: "", message: "" };

function validate(values) {
  const nextErrors = { ...EMPTY_ERRORS };

  if (!values.name.trim()) {
    nextErrors.name = "Name is required.";
  } else if (values.name.length > MAX_LENGTH.name) {
    nextErrors.name = `Name must be ${MAX_LENGTH.name} characters or fewer.`;
  }

  if (!values.email.trim()) {
    nextErrors.email = "Email is required.";
  } else if (values.email.length > MAX_LENGTH.email) {
    nextErrors.email = `Email must be ${MAX_LENGTH.email} characters or fewer.`;
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    nextErrors.email = "Enter a valid email address.";
  }

  if (!values.message.trim()) {
    nextErrors.message = "Message is required.";
  } else if (values.message.length > MAX_LENGTH.message) {
    nextErrors.message = `Message must be ${MAX_LENGTH.message} characters or fewer.`;
  }

  return nextErrors;
}

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    // Honeypot. Real visitors never see or fill this field; bots do.
    hp_website: "",
  });
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    // Clear this field's error as soon as the user starts typing in it.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
    setSubmitError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate(form);
    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      const firstInvalid = FIELDS.find((name) => nextErrors[name]);
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }

    setErrors(EMPTY_ERRORS);
    setSubmitError(null);
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          hp_website: form.hp_website,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setStatus("idle");

        if (response.status === 429) {
          const waitTime = formatRetryAfter(response.headers.get("Retry-After"));
          setSubmitError({
            message: waitTime
              ? `Too many messages. Please try again in ${waitTime}.`
              : "Too many messages. Please try again later.",
            showEmailLink: false,
          });
          return;
        }

        if (response.status === 413) {
          setSubmitError({
            message: "That message is too large to send. Please shorten it.",
            showEmailLink: false,
          });
          return;
        }

        if (response.status === 400) {
          setSubmitError({
            message:
              FIELD_ERRORS[data?.error] ??
              "Please check your details and try again.",
            showEmailLink: true,
          });
          return;
        }

        // Never echo 403/5xx text: it is written for operators and can expose
        // configuration details ("Email is not configured."). Keep the copy
        // generic and offer the direct address instead.
        setSubmitError({
          message:
            response.status >= 500
              ? "The form is temporarily unavailable. Please try again in a moment, or email me directly:"
              : "That request couldn't be completed. Please email me directly:",
          showEmailLink: true,
        });
        return;
      }

      setStatus("sent");
    } catch {
      setStatus("idle");
      setSubmitError({
        message:
          "Something went wrong sending your message. Please try again, or email me directly:",
        showEmailLink: true,
      });
    }
  };

  return (
    <section
      className="section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="container">
        <Reveal className="section__head section__head--center">
          <p className="eyebrow">Contact</p>
          <h2 className="section__title" id="contact-title">
            Let's build something together
          </h2>
          <p className="section__lead">
            Have a project, a role, or just a hello? My inbox is always open, and I'll get back to you within a day or two.
          </p>
        </Reveal>

        {/* Persistent live region: it exists before the text changes, so
            screen readers reliably announce the result. */}
        <p
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {status === "sent"
            ? `Thanks, ${form.name || "friend"}! Your message is on its way.`
            : ""}
        </p>

        <div className="contact-grid">
          {/* ---- Direct methods ---- */}
          <Reveal className="contact-methods">
            {METHODS.map(({ id, href, Icon, label, hint, external }) => (
              <a
                key={id}
                className="contact-method"
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                <span className="contact-method__icon">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <span>
                  <small>{hint}</small>
                  <strong>{label}</strong>
                </span>
              </a>
            ))}
          </Reveal>

          {/* ---- Form ---- */}
          <Reveal delay={120}>
            {status === "sent" ? (
              <p className="form-status">
                <HiOutlineCheckCircle size={22} aria-hidden="true" />
                Thanks, {form.name || "friend"}! Your message is on its way.
              </p>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                {/* Honeypot: off-screen and skipped by keyboard and screen
                    readers, but bots that fill every input will populate it.
                    The label avoids profile keywords and the data-* attributes
                    tell password managers not to autofill it. */}
                <div className="field field--hp" aria-hidden="true">
                  <label htmlFor="contact-hp">Leave this field empty</label>
                  <input
                    id="contact-hp"
                    name="hp_website"
                    value={form.hp_website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                    data-lpignore="true"
                    data-1p-ignore=""
                    data-bwignore="true"
                  />
                </div>

                <div className={errors.name ? "field field--invalid" : "field"}>
                  <label htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="your name"
                    autoComplete="name"
                    maxLength={MAX_LENGTH.name}
                    aria-invalid={errors.name ? "true" : undefined}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    required
                  />
                  {errors.name && (
                    <p className="field__error" id="contact-name-error">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className={errors.email ? "field field--invalid" : "field"}>
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    inputMode="email"
                    maxLength={MAX_LENGTH.email}
                    aria-invalid={errors.email ? "true" : undefined}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    required
                  />
                  {errors.email && (
                    <p className="field__error" id="contact-email-error">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className={errors.message ? "field field--invalid" : "field"}>
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project or opportunity…"
                    maxLength={MAX_LENGTH.message}
                    aria-invalid={errors.message ? "true" : undefined}
                    aria-describedby={
                      errors.message
                        ? "contact-message-error"
                        : form.message.length >= MAX_LENGTH.message - 250
                          ? "contact-message-count"
                          : undefined
                    }
                    required
                  />
                  {errors.message && (
                    <p className="field__error" id="contact-message-error">
                      {errors.message}
                    </p>
                  )}
                  {form.message.length >= MAX_LENGTH.message - 250 && (
                    <p
                      className={
                        form.message.length >= MAX_LENGTH.message
                          ? "field__counter field__counter--limit"
                          : "field__counter"
                      }
                      id="contact-message-count"
                    >
                      {form.message.length >= MAX_LENGTH.message
                        ? `Message limit reached (${MAX_LENGTH.message.toLocaleString()} characters). Text beyond the limit was not added.`
                        : `${form.message.length.toLocaleString()} / ${MAX_LENGTH.message.toLocaleString()} characters`}
                    </p>
                  )}
                </div>

                {submitError && (
                  <p className="form-status form-status--error" role="alert">
                    {submitError.message || submitError}
                    {submitError.showEmailLink && (
                      <>
                        {" "}
                        <a href={SOCIAL_LINKS.email.href}>
                          {SOCIAL_LINKS.email.label}
                        </a>
                      </>
                    )}
                  </p>
                )}

                <button
                  className="btn btn--primary"
                  type="submit"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}