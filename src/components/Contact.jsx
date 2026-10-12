import { useState } from "react";
import { FaEnvelope, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineCheckCircle } from "react-icons/hi";
import Reveal from "./Reveal";

// TODO: replace with your real details
const LINKS = {
  github: "https://github.com/james-sed",
  linkedin: "https://www.linkedin.com/in/james-sederia-4b87383a8",
  email: "jjsederia08@gmail.com",
};

const METHODS = [
  {
    id: "email",
    href: `mailto:${LINKS.email}`,
    Icon: FaEnvelope,
    label: LINKS.email,
    hint: "Best for quick questions",
    external: false,
  },
  {
    id: "github",
    href: LINKS.github,
    Icon: FaGithub,
    label: "github.com/james-sed",
    hint: "Code, PRs, experiments",
    external: true,
  },
  {
    id: "linkedin",
    href: LINKS.linkedin,
    Icon: FaLinkedinIn,
    label: "in/james-sederia",
    hint: "Professional updates",
    external: true,
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
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
            Have a project, a role, or just a hello? My inbox is always open —
            I'll get back to you within a day or two.
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
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project or opportunity…"
                    required
                  />
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