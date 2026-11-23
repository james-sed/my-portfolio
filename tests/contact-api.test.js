import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The provider is never contacted for real: every test swaps this stub.
let providerMode = "ok";
const fetchMock = vi.fn(async () => {
  if (providerMode === "throw") throw new Error("network down");
  if (providerMode === "fail") {
    return { ok: false, status: 500, text: async () => "provider exploded" };
  }
  return { ok: true, status: 200, text: async () => "" };
});
globalThis.fetch = fetchMock;

const { default: handler } = await import("../api/contact.js");

let ipCounter = 0;
const nextIp = () => `10.9.${Math.floor(ipCounter / 250)}.${(ipCounter++ % 250) + 1}`;

const VALID = { name: "Jane", email: "a@b.co", message: "Hello there" };

function makeRes() {
  let raw = "";
  return {
    statusCode: 0,
    headers: {},
    setHeader(key, value) {
      this.headers[key.toLowerCase()] = value;
    },
    end(chunk) {
      raw = chunk ?? "";
    },
    get body() {
      return raw ? JSON.parse(raw) : null;
    },
  };
}

async function call({
  method = "POST",
  ip = nextIp(),
  body = {},
  headers = {},
} = {}) {
  const req = {
    method,
    headers: {
      "x-forwarded-for": ip,
      "content-type": "application/json",
      ...headers,
    },
    body,
  };
  const res = makeRes();
  await handler(req, res);
  return { status: res.statusCode, headers: res.headers, body: res.body };
}

/** Runs `count` submissions from one IP and returns the statuses. */
async function burst(ip, count, body = VALID) {
  const statuses = [];
  for (let i = 0; i < count; i++) statuses.push((await call({ ip, body })).status);
  return statuses;
}

beforeEach(() => {
  providerMode = "ok";
  fetchMock.mockClear();
  process.env.RESEND_API_KEY = "re_test_key";
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("request guards", () => {
  it("refuses non-POST methods", async () => {
    const { status, headers, body } = await call({ method: "GET" });
    expect(status).toBe(405);
    expect(headers.allow).toBe("POST");
    expect(body.error).toMatch(/method/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refuses cross-site browser posts", async () => {
    const { status, body } = await call({
      headers: { "sec-fetch-site": "cross-site" },
    });
    expect(status).toBe(403);
    expect(body.error).toMatch(/blocked/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("allows same-origin and headerless posts", async () => {
    const sameOrigin = await call({
      body: VALID,
      headers: { "sec-fetch-site": "same-origin" },
    });
    expect(sameOrigin.status).toBe(200);
    expect((await call({ body: VALID })).status).toBe(200);
  });

  it("rejects a declared body over 16 KB", async () => {
    const { status } = await call({
      body: VALID,
      headers: { "content-length": String(17 * 1024) },
    });
    expect(status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an oversized string body", async () => {
    const { status } = await call({ body: "x".repeat(17 * 1024) });
    expect(status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a streamed body that grows past the limit", async () => {
    const chunk = Buffer.alloc(8 * 1024, "a");
    async function* stream() {
      yield chunk;
      yield chunk;
      yield chunk;
    }
    const req = {
      method: "POST",
      headers: { "x-forwarded-for": nextIp() },
      [Symbol.asyncIterator]: stream,
    };
    const res = makeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON", async () => {
    const { status } = await call({ body: "{not json" });
    expect(status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a missing field", async () => {
    const { status } = await call({ body: { name: "Jane", email: "a@b.co" } });
    expect(status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid email", async () => {
    const { status } = await call({ body: { ...VALID, email: "nope" } });
    expect(status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an over-long message", async () => {
    const { status } = await call({
      body: { ...VALID, message: "x".repeat(5001) },
    });
    expect(status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports a missing provider key without sending", async () => {
    delete process.env.RESEND_API_KEY;
    const { status } = await call();
    expect(status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("honeypot", () => {
  it("answers 200 but sends nothing for hp_website", async () => {
    const { status, body } = await call({
      body: { ...VALID, hp_website: "https://spam.example" },
    });
    expect(status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("still checks the legacy company_website field", async () => {
    const { status } = await call({
      body: { ...VALID, company_website: "spam" },
    });
    expect(status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("ignores an empty honeypot", async () => {
    const { status } = await call({ body: { ...VALID, hp_website: "   " } });
    expect(status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("successful submission", () => {
  it("posts the message to Resend", async () => {
    const { status, body, headers } = await call({
      body: { name: " Jane ", email: " a@b.co ", message: "Hi there" },
    });
    expect(status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(headers["cache-control"]).toBe("no-store");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    const payload = JSON.parse(init.body);
    expect(payload.reply_to).toBe("a@b.co");
    expect(payload.subject).toBe("New message from Jane");
    expect(payload.text).toContain("Name: Jane");
    expect(payload.text).toContain("Hi there");
  });

  it("strips header-breaking newlines from the name", async () => {
    await call({ body: { ...VALID, name: "Jane\r\nBcc: evil@example.com" } });
    const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(payload.subject).not.toMatch(/[\r\n]/);
    expect(payload.subject).toBe("New message from Jane Bcc: evil@example.com");
  });

  it("escapes HTML in the email copy", async () => {
    await call({
      body: {
        name: "<script>alert(1)</script>",
        email: "a@b.co",
        message: "<img src=x onerror=alert(1)>",
      },
    });
    const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(payload.html).not.toContain("<script>");
    expect(payload.html).not.toContain("<img");
    expect(payload.html).toContain("&lt;script&gt;");
  });
});

describe("rate limiting", () => {
  it("accepts five messages then refuses the sixth", async () => {
    const ip = nextIp();
    expect(await burst(ip, 5)).toEqual([200, 200, 200, 200, 200]);

    const sixth = await call({ ip });
    expect(sixth.status).toBe(429);
    expect(sixth.body.error).toMatch(/too many/i);
    const retryAfter = Number(sixth.headers["retry-after"]);
    expect(Number.isInteger(retryAfter)).toBe(true);
    expect(retryAfter).toBeGreaterThan(0);
    expect(retryAfter).toBeLessThanOrEqual(600);
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it("does not spend budget on malformed or honeypot traffic", async () => {
    const ip = nextIp();
    expect((await call({ ip, body: { ...VALID, email: "nope" } })).status).toBe(400);
    expect((await call({ ip, body: { ...VALID, message: "" } })).status).toBe(400);
    expect((await call({ ip, body: { ...VALID, hp_website: "spam" } })).status).toBe(200);
    expect(await burst(ip, 5)).toEqual([200, 200, 200, 200, 200]);
  });
});

describe("provider failures do not spend the budget", () => {
  it("releases the slot after a 5xx", async () => {
    const ip = nextIp();
    providerMode = "fail";
    expect(await burst(ip, 6)).toEqual([502, 502, 502, 502, 502, 502]);

    providerMode = "ok";
    expect(await burst(ip, 5)).toEqual([200, 200, 200, 200, 200]);
    expect((await call({ ip })).status).toBe(429);
  });

  it("releases the slot after a network error", async () => {
    const ip = nextIp();
    providerMode = "throw";
    expect(await burst(ip, 6)).toEqual([502, 502, 502, 502, 502, 502]);

    providerMode = "ok";
    expect(await burst(ip, 5)).toEqual([200, 200, 200, 200, 200]);
  });
});
