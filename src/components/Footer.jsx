import { FaEnvelope, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineArrowUp } from "react-icons/hi";
import { SOCIAL_LINKS } from "../site.config";

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const SOCIALS = [
  { id: "github", Icon: FaGithub, label: "GitHub", ...SOCIAL_LINKS.github },
  { id: "linkedin", Icon: FaLinkedinIn, label: "LinkedIn", ...SOCIAL_LINKS.linkedin },
  { id: "email", Icon: FaEnvelope, label: "Email", ...SOCIAL_LINKS.email },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__brand">
            <strong>James Sederia</strong>
            <span>Front-end Developer · Web Development</span>
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
            © {year} James Sederia. All Rights Reserved.
          </small>
          <a className="btn btn--ghost" href="#home">
            Back to top <HiOutlineArrowUp aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}