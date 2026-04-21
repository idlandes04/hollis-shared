/**
 * @ai-context Contract tests for new wearable session schemas (Feature 7)
 *
 * Covers:
 * - WearableSessionListQuerySchema: valid inputs, transformations, edge cases
 * - WearableSessionItemSchema: required fields, nullable fields
 * - WearableSessionListResponseSchema: full shape validation
 * - WearableActivityDaySummarySchema: field validation
 * - WearableActivitySummaryResponseSchema: full shape validation
 */

import {
  WearableActivityDaySummarySchema,
  WearableActivitySummaryResponseSchema,
  WearableSessionItemSchema,
  WearableSessionListQuerySchema,
  WearableSessionListResponseSchema,
} from "../domain/workouts";

// ---------------------------------------------------------------------------
// WearableSessionListQuerySchema
// ---------------------------------------------------------------------------

describe("WearableSessionListQuerySchema", () => {
  it("accepts empty input and applies defaults", () => {
    const result = WearableSessionListQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.page).toBe(1);
    expect(result.data.limit).toBe(20);
  });

  it("parses page and limit from string query params", () => {
    const result = WearableSessionListQuerySchema.safeParse({
      page: "3",
      limit: "50",
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.page).toBe(3);
    expect(result.data.limit).toBe(50);
  });

  it("clamps limit to max of 100", () => {
    const result = WearableSessionListQuerySchema.safeParse({ limit: "999" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.limit).toBe(100);
  });

  it("clamps page to minimum of 1", () => {
    const result = WearableSessionListQuerySchema.safeParse({ page: "-5" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.page).toBe(1);
  });

  it("accepts optional startDate as YYYY-MM-DD", () => {
    const result = WearableSessionListQuerySchema.safeParse({
      startDate: "2026-04-01",
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.startDate).toBe("2026-04-01");
  });

  it("accepts optional endDate as YYYY-MM-DD", () => {
    const result = WearableSessionListQuerySchema.safeParse({
      endDate: "2026-04-21",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid date format for startDate", () => {
    const result = WearableSessionListQuerySchema.safeParse({
      startDate: "not-a-date",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional type filter", () => {
    const result = WearableSessionListQuerySchema.safeParse({ type: "running" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.type).toBe("running");
  });

  it("rejects type filter that exceeds max length (100)", () => {
    const result = WearableSessionListQuerySchema.safeParse({
      type: "x".repeat(101),
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// WearableSessionItemSchema
// ---------------------------------------------------------------------------

describe("WearableSessionItemSchema", () => {
  const validSession = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    userId: "HH-000001",
    type: "running",
    startTime: "2026-04-21T08:00:00.000Z",
    endTime: "2026-04-21T08:30:00.000Z",
    durationMinutes: 30,
    activeCaloriesKcal: 300,
    distanceKm: 5.0,
    source: "com.apple.health",
    createdAt: "2026-04-21T08:30:00.000Z",
    updatedAt: "2026-04-21T08:30:00.000Z",
  };

  it("accepts a fully-populated session", () => {
    const result = WearableSessionItemSchema.safeParse(validSession);
    expect(result.success).toBe(true);
  });

  it("accepts null for nullable fields (activeCaloriesKcal, distanceKm, source)", () => {
    const result = WearableSessionItemSchema.safeParse({
      ...validSession,
      activeCaloriesKcal: null,
      distanceKm: null,
      source: null,
    });
    expect(result.success).toBe(true);
  });

  it("requires id to be a UUID", () => {
    const result = WearableSessionItemSchema.safeParse({
      ...validSession,
      id: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("requires durationMinutes to be an integer", () => {
    const result = WearableSessionItemSchema.safeParse({
      ...validSession,
      durationMinutes: 30.5,
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// WearableSessionListResponseSchema
// ---------------------------------------------------------------------------

describe("WearableSessionListResponseSchema", () => {
  it("accepts a valid list response with empty data", () => {
    const result = WearableSessionListResponseSchema.safeParse({
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
    });
    expect(result.success).toBe(true);
  });

  it("requires pagination.hasMore to be a boolean", () => {
    const result = WearableSessionListResponseSchema.safeParse({
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasMore: "yes", // invalid
      },
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// WearableActivityDaySummarySchema
// ---------------------------------------------------------------------------

describe("WearableActivityDaySummarySchema", () => {
  it("accepts a valid day summary", () => {
    const result = WearableActivityDaySummarySchema.safeParse({
      date: "2026-04-20",
      totalActiveMins: 45,
      totalCalories: 450,
      sessionCount: 2,
    });
    expect(result.success).toBe(true);
  });

  it("requires totalActiveMins to be an integer", () => {
    const result = WearableActivityDaySummarySchema.safeParse({
      date: "2026-04-20",
      totalActiveMins: 45.5, // invalid — must be int
      totalCalories: 450,
      sessionCount: 2,
    });
    expect(result.success).toBe(false);
  });

  it("requires sessionCount to be an integer", () => {
    const result = WearableActivityDaySummarySchema.safeParse({
      date: "2026-04-20",
      totalActiveMins: 30,
      totalCalories: 300,
      sessionCount: 1.5, // invalid
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// WearableActivitySummaryResponseSchema
// ---------------------------------------------------------------------------

describe("WearableActivitySummaryResponseSchema", () => {
  it("accepts a valid summary response with days", () => {
    const result = WearableActivitySummaryResponseSchema.safeParse({
      days: [
        { date: "2026-04-20", totalActiveMins: 30, totalCalories: 300, sessionCount: 1 },
      ],
      periodDays: 30,
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty days array", () => {
    const result = WearableActivitySummaryResponseSchema.safeParse({
      days: [],
      periodDays: 7,
    });
    expect(result.success).toBe(true);
  });

  it("requires periodDays to be an integer", () => {
    const result = WearableActivitySummaryResponseSchema.safeParse({
      days: [],
      periodDays: 30.5, // invalid
    });
    expect(result.success).toBe(false);
  });
});
