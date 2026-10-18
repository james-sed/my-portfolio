// Single source of truth for personal details and shared content.
// Update values here once — every component reads from this file.

export const NAME = "James Sederia";

export const EMAIL = "jjsederia08@gmail.com";

// TODO: point these at real profile/repo URLs.
export const GITHUB_URL = "https://github.com/james-sed";
export const LINKEDIN_URL =
  "https://www.linkedin.com/in/james-sederia-4b87383a8";

export const RESUME_URL = "/resume-sederia.pdf";

// Phrases cycled through the hero's typing effect.
export const ROLES = [
  "Front-end Developer",
  "Web Developer",
  "AWS Student Builder",
];

// Shared social/contact link list (used by Hero, Contact, Footer).
export const SOCIAL_LINKS = {
  github: {
    href: GITHUB_URL,
    label: "github.com/james-sed",
    hint: "Code, PRs, experiments",
  },
  linkedin: {
    href: LINKEDIN_URL,
    label: "in/james-sederia",
    hint: "Professional updates",
  },
  email: {
    href: `mailto:${EMAIL}`,
    label: EMAIL,
    hint: "Best for quick questions",
  },
};
