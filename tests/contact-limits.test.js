import { describe, expect, it } from "vitest";
import { CONTACT_LIMITS, EMAIL_PATTERN } from "../shared/contact-limits.js";

describe("EMAIL_PATTERN", () => {
  it.each([
    "a@b.co",
    "jane.doe@example.com",
    "jane+tag@sub.domain.org",
    "JANE@EXAMPLE.COM",
  ])("accepts %s", (email) => {
    expect(EMAIL_PATTERN.test(email)).toBe(true);
  });

  it.each([
    "",
    "nope",
    "nope@",
    "@nope.com",
    "no spaces@example.com",
    "jane@example",
    "jane@@example.com",
  ])("rejects %s", (email) => {
    expect(EMAIL_PATTERN.test(email)).toBe(false);
  });
});

describe("CONTACT_LIMITS", () => {
  it("matches the bounds the form and the endpoint rely on", () => {
    expect(CONTACT_LIMITS).toEqual({ name: 120, email: 200, message: 5000 });
  });
});
