import {
  ADMIN_API_ROUTES,
  ADMIN_PATIENT_ROUTES,
  createDxaResultPayloadSchema,
  dxaExtractionResultSchema,
  DXA_TRACKED_METRICS,
  extractDxaDataInputSchema,
} from "../admin";
import {
  METRIC_BODY_FAT_PERCENTAGE,
  METRIC_BODY_WEIGHT,
  METRIC_LEAN_BODY_MASS,
} from "../domain/metric-codes";

describe("DXA admin contracts", () => {
  it("accepts valid DXA extraction input", () => {
    expect(
      extractDxaDataInputSchema.safeParse({
        fileBase64: "ZmFrZQ==",
        mimeType: "application/pdf",
      }).success,
    ).toBe(true);
  });

  it("accepts a valid DXA extraction result", () => {
    expect(
      dxaExtractionResultSchema.safeParse({
        scanDate: "2026-04-01",
        vendor: "Hologic",
        metrics: [
          {
            metricCode: METRIC_BODY_WEIGHT,
            label: "Body Weight",
            value: 72.5,
            unit: "kg",
            confidence: 0.98,
          },
          {
            metricCode: METRIC_BODY_FAT_PERCENTAGE,
            label: "Body Fat %",
            value: 21.4,
            unit: "%",
            confidence: 0.94,
          },
          {
            metricCode: METRIC_LEAN_BODY_MASS,
            label: "Lean Body Mass",
            value: 57,
            unit: "kg",
            confidence: 0.93,
          },
        ],
        extraMetrics: [],
        warnings: [],
        sourceCategory: "IMAGING",
      }).success,
    ).toBe(true);
  });

  it("rejects invalid DXA save metric units", () => {
    expect(
      createDxaResultPayloadSchema.safeParse({
        fileBase64: "ZmFrZQ==",
        fileName: "scan.pdf",
        mimeType: "application/pdf",
        scanDate: "2026-04-01",
        vendor: "Hologic",
        notes: null,
        metrics: [
          {
            metricCode: METRIC_BODY_FAT_PERCENTAGE,
            value: 19.2,
            unit: "kg",
          },
        ],
      }).success,
    ).toBe(false);
  });

  it("tracks the expected v1 DXA metrics", () => {
    expect(DXA_TRACKED_METRICS).toEqual([
      METRIC_BODY_WEIGHT,
      METRIC_BODY_FAT_PERCENTAGE,
      METRIC_LEAN_BODY_MASS,
    ]);
  });

  it("exposes the DXA admin routes", () => {
    expect(ADMIN_API_ROUTES.DXA.EXTRACT).toBe("/api/admin/dxa/extract");
    expect(ADMIN_PATIENT_ROUTES.createDxaResult("HH-123456")).toBe(
      "/api/admin/patients/HH-123456/dxa-results",
    );
  });
});
