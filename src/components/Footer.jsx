import { FaEnvelope, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineArrowUp } from "react-icons/hi";

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const SOCIALS = [
  {
    id: "github",
    href: "https://github.com/james-sed", // TODO: replace
    Icon: FaGithub,
    label: "GitHub",
  },
  {
    id: "linkedin",
    href: "https://www.linkedin.com/in/james-sederia-4b87383a8", // TODO: replace
    Icon: FaLinkedinIn,
    label: "LinkedIn",
  },
  {
    id: "email",
    href: "mailto:jjsederia08@gmail.com", // TODO: replace
    Icon: FaEnvelope,
    label: "Email",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__brand">
            <strong>James Sederia</strong>
            <span>Front-end Developer · AWS SBG JRU</span>
          </div>

          <nav className="footer__nav" aria-label="Footer">
            {NAV.map(({ id, label }) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>

          <div className="footer__socials">
            {SOCIALS.map(({ id, href, Icon, label }) => (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
              >
                <Icon size={19} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="footer__bottom">
          <small>
            © {year} James Sederia. Built with React, vanilla CSS & a lot of
            coffee.
          </small>
          <a className="btn btn--ghost" href="#home">
            Back to top <HiOutlineArrowUp aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}