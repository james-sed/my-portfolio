import Reveal from "./Reveal";
import { CERTIFICATIONS } from "../data/certifications";

function AwardIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="9" r="6" />
      <path d="M8.5 14.5L7 22l5-3 5 3-1.5-7.5" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </svg>
  );
}

function GraduationCapIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8l9-4 9 4-9 4-9-4z" />
      <path d="M7 10.5V16c0 1.2 2.2 3 5 3s5-1.8 5-3v-5.5" />
      <path d="M21 8v6" />
    </svg>
  );
}

function ExternalArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  );
}

const ICON_MAP = {
  award: AwardIcon,
  shield: ShieldCheckIcon,
  cap: GraduationCapIcon,
};

export default function Certifications() {
  return (
    <section
      className="section certifications-section"
      id="certifications"
      aria-labelledby="certifications-title"
    >
      <div className="container">
        <Reveal className="section__head">
          <h2 className="section__title" id="certifications-title">
            Credentials
          </h2>
          <p className="section__lead">
            Courses and certificates that I have completed and received throughout my college years in Jose Rizal University.
          </p>
        </Reveal>

        <div className="certifications-grid">
          {CERTIFICATIONS.map(
            ({ id, title, issuer, year, credentialId, url, icon }, i) => {
              const IconComponent = ICON_MAP[icon] || AwardIcon;
              const isExternal =
                url && (url.startsWith("http://") || url.startsWith("https://"));

              return (
                <Reveal
                  as="article"
                  key={id}
                  className="cert-card"
                  delay={(i % 3) * 100}
                >
                  <div className="cert-card__header">
                    <div className="cert-card__icon" aria-hidden="true">
                      <IconComponent />
                    </div>
                    <span className="cert-card__year">{year}</span>
                  </div>

                  <div className="cert-card__content">
                    <h3 className="cert-card__title">{title}</h3>
                    <span className="cert-card__issuer">{issuer}</span>
                  </div>

                  <div className="cert-card__divider" aria-hidden="true" />

                  <div className="cert-card__footer">
                    {credentialId ? (
                      <span
                        className="cert-card__id"
                        title={`Credential ID: ${credentialId}`}
                      >
                        ID: {credentialId}
                      </span>
                    ) : null}
                    <a
                      href={url}
                      className="cert-card__link"
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      aria-label={`View credential for ${title}`}
                    >
                      <span>View credential</span>
                      <ExternalArrowIcon />
                    </a>
                  </div>
                </Reveal>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}
