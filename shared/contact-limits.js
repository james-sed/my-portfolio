// Single source of truth for the contact-form rules.
// Imported by both the React form (src/components/Contact.jsx) and the
// serverless endpoint (api/contact.js) so the two cannot drift apart.

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CONTACT_LIMITS = {
  name: 120,
  email: 200,
  message: 5000,
};
