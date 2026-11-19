import { useState } from "react";
import { FaEnvelope, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineCheckCircle } from "react-icons/hi";
import Reveal from "./Reveal";
import { SOCIAL_LINKS } from "../site.config";

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

const FIELDS = [
  { name: "name", label: "Name" },
  { name: "email", label: "Email" },
  { name: "message", label: "Message" },
];

const EMPTY_ERRORS = { name: "", email: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    // Clear this field's error as soon as the user starts typing in it.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = { ...EMPTY_ERRORS };
    FIELDS.forEach(({ name, label }) => {
      if (!form[name].trim()) {
        nextErrors[name] = `${label} is required.`;
      }
    });

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      const firstInvalid = FIELDS.find(({ name }) => nextErrors[name]);
      document.getElementById(`contact-${firstInvalid.name}`)?.focus();
      return;
    }

    setErrors(EMPTY_ERRORS);
    // TODO: connect to a mail service (Formspree / EmailJS / your API).
    setSent(true);
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
            {sent ? (
              <p className="form-status" role="status" aria-live="polite">
                <HiOutlineCheckCircle size={22} aria-hidden="true" />
                Thanks, {form.name || "friend"}! Your message is on its way.
              </p>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className={errors.name ? "field field--invalid" : "field"}>
                  <label htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    autoComplete="name"
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
                    aria-invalid={errors.message ? "true" : undefined}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                    required
                  />
                  {errors.message && (
                    <p className="field__error" id="contact-message-error">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button className="btn btn--primary" type="submit">
                  Send message
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}