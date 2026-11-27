import { useState } from "react";
import Reveal from "./Reveal";
import { CERTIFICATIONS, CERT_KEYS } from "../data/certifications";

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
  cap: GraduationCapIcon,
};

const isExternalUrl = (url) =>
  Boolean(url && (url.startsWith("http://") || url.startsWith("https://")));

export default function Certifications() {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);

  const filtered =
    filter === "all"
      ? CERTIFICATIONS
      : CERTIFICATIONS.filter((c) => c.issuerKey === filter);

  const canToggle = filtered.length > 5;
  const mobileShown = canToggle && !expanded ? filtered.slice(0, 5) : filtered;

  const handleFilterClick = (key) => {
    setFilter(key);
    setExpanded(false);
  };

  const chips = CERT_KEYS.map((k) => {
    const count =
      k === "all"
        ? CERTIFICATIONS.length
        : CERTIFICATIONS.filter((c) => c.issuerKey === k).length;
    const active = k === filter;
    return {
      key: k,
      label: `${k === "all" ? "All" : k} ${count}`,
      active,
    };
  });

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
            {CERTIFICATIONS.length} credentials earned during my college years
            and through my organization at Jose Rizal University. You can filter
            by the issuer.
          </p>
        </Reveal>

        {/* Filter chips (Certifications filter row) */}
        <div
          className="cert-chips"
          role="group"
          aria-label="Filter credentials by issuer"
        >
          {chips.map(({ key, label, active }) => (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              className={`cert-chip${active ? " is-active" : ""}`}
              onClick={() => handleFilterClick(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Mobile Compact Grouped List (<= 640px) */}
        <div className="cert-mobile-list">
          {mobileShown.map(({ id, title, issuer, credentialId, url }) => {
            const info = (
              <div className="cert-mobile-row__info">
                <span className="cert-mobile-row__title">{title}</span>
                <span className="cert-mobile-row__issuer">{issuer}</span>
                {/* No public URL: show the ID so the row still carries proof. */}
                {!url && credentialId ? (
                  <span className="cert-mobile-row__id">ID: {credentialId}</span>
                ) : null}
              </div>
            );

            if (!url) {
              return (
                <div key={id} className="cert-mobile-row cert-mobile-row--static">
                  {info}
                </div>
              );
            }

            const isExternal = isExternalUrl(url);

            return (
              <a
                key={id}
                href={url}
                className="cert-mobile-row"
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                aria-label={`View credential: ${title} (${issuer})`}
              >
                {info}
                <svg
                  className="cert-mobile-row__arrow"
                  width="18"
                  height="18"
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
              </a>
            );
          })}
        </div>

        {/* Mobile Show all / Show less button */}
        {canToggle && (
          <button
            type="button"
            className="cert-toggle-btn"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : `Show all ${filtered.length}`}
          </button>
        )}

        {/* Desktop 3-column / 2-column Grid (> 640px) */}
        <div className="certifications-grid">
          {filtered.map(
            ({ id, title, issuer, year, credentialId, url, icon }, i) => {
              const IconComponent = ICON_MAP[icon] || AwardIcon;
              const isExternal = isExternalUrl(url);

              const content = (
                <>
                  <div className="cert-card__icon" aria-hidden="true">
                    <IconComponent />
                  </div>

                  <div className="cert-card__body">
                    <div className="cert-card__header">
                      <span className="cert-card__year">{year}</span>
                    </div>

                    <div className="cert-card__content">
                      <h3 className="cert-card__title">{title}</h3>
                      <span className="cert-card__issuer">{issuer}</span>
                    </div>

                    {(credentialId || url) && (
                      <>
                        <div
                          className="cert-card__divider"
                          aria-hidden="true"
                        />

                        <div className="cert-card__footer">
                          {credentialId ? (
                            <span
                              className="cert-card__id"
                              title={`Credential ID: ${credentialId}`}
                            >
                              ID: {credentialId}
                            </span>
                          ) : null}
                          {url ? (
                            <span className="cert-card__link">
                              <span>
                                {isExternal ? "View credential" : "View details"}
                              </span>
                              <ExternalArrowIcon />
                            </span>
                          ) : null}
                        </div>
                      </>
                    )}
                  </div>
                </>
              );

              return (
                <Reveal key={id} className="cert-card-wrap" delay={(i % 3) * 70}>
                  {url ? (
                    <a
                      className="cert-card"
                      href={url}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      aria-label={`View credential: ${title} (${issuer})`}
                    >
                      {content}
                    </a>
                  ) : (
                    <article className="cert-card cert-card--static">
                      {content}
                    </article>
                  )}
                </Reveal>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}
