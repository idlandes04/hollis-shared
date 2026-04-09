import { sanitizeSentryEvent, sanitizeSentryLog } from "../sentrySanitization";

describe("sanitizeSentryEvent", () => {
  it("redacts PHI strings and strips sensitive fields across the event", () => {
    const sanitized = sanitizeSentryEvent({
      user: {
        id: "user-123",
        email: "patient@example.com",
        username: "patient-user",
      },
      message: "Failed for patient@example.com",
      request: {
        headers: {
          Authorization: "Bearer secret-token",
          "content-type": "application/json",
        },
        query_string: "email=patient@example.com&userId=user-123",
        data: {
          diagnosis: "Hypertension",
          phoneNumber: "555-123-4567",
          nested: {
            notes: "Private note",
            barcode: "HH-ABC234",
          },
        },
        url: "https://example.com/reset#token=secret",
      },
      extra: {
        patientName: "Jane Doe",
        safeCode: "webhook_received",
      },
      contexts: {
        trace: {
          userId: "user-123",
          requestId: "req_123",
        },
      },
    });

    expect(sanitized.user).toEqual({});
    expect(sanitized.message).toBe("Failed for [REDACTED_EMAIL]");
    expect(sanitized.request).toEqual({
      headers: {
        "content-type": "application/json",
      },
      query_string: "[QUERY_REDACTED]",
      data: {
        nested: {
          barcode: "[REDACTED_BARCODE]",
        },
      },
      url: "https://example.com/reset#[FRAGMENT_REDACTED]",
    });
    expect(sanitized.extra).toEqual({
      safeCode: "webhook_received",
    });
    expect(sanitized.contexts).toEqual({
      trace: {
        requestId: "req_123",
      },
    });
  });

  it("sanitizes breadcrumb payloads and preserves non-sensitive metadata", () => {
    const sanitized = sanitizeSentryEvent({
      breadcrumbs: [
        {
          category: "fetch",
          data: {
            url: "https://example.com/account#reset-token",
            weight: "180",
            outcome: "failed",
          },
          message: "Request for patient@example.com",
        },
      ],
      tags: {
        route: "/account",
        webhook_event_id: "evt_123",
      },
    });

    expect(sanitized.breadcrumbs).toEqual([
      {
        category: "fetch",
        data: {
          url: "https://example.com/account#[FRAGMENT_REDACTED]",
          outcome: "failed",
        },
        message: "Request for [REDACTED_EMAIL]",
      },
    ]);
    expect(sanitized.tags).toEqual({
      route: "/account",
      webhook_event_id: "evt_123",
    });
  });
});

describe("sanitizeSentryLog", () => {
  it("scrubs PHI from message and attributes", () => {
    const sanitized = sanitizeSentryLog({
      level: "error",
      message: "Validation failed for patient@example.com",
      timestamp: 1700000000,
      attributes: {
        email: "patient@example.com",
        endpoint: "/api/account",
        err: "Invalid payload",
      },
    });

    expect(sanitized.level).toBe("error");
    expect(sanitized.message).toBe("Validation failed for [REDACTED_EMAIL]");
    expect(sanitized.timestamp).toBe(1700000000);
    expect(sanitized.attributes).toEqual({
      endpoint: "/api/account",
      err: "Invalid payload",
    });
  });

  it("preserves safe attributes and scrubs PHI field names", () => {
    const sanitized = sanitizeSentryLog({
      level: "warn",
      message: "Schema mismatch",
      attributes: {
        route: "/account/profile",
        weight: "180",
        safeCode: "VALIDATION_FAILED",
      },
    });

    expect(sanitized.attributes).toEqual({
      route: "/account/profile",
      safeCode: "VALIDATION_FAILED",
    });
  });
});
