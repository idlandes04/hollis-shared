import {
  RECOVERY_SESSION_MODALITIES,
  RECOVERY_SESSION_MODALITY,
  RECOVERY_SESSION_MODALITY_LABELS,
  RecoverySessionCreatePayloadSchema,
  RecoverySessionListResponseSchema,
  RecoverySessionModalitySchema,
  RecoverySessionSchema,
  createMockRecoverySession,
} from "../domain/recovery-sessions";

describe("Recovery session domain contracts", () => {
  it("exposes the expected modality constants", () => {
    expect(RECOVERY_SESSION_MODALITIES).toEqual([
      "SAUNA",
      "ICE_BATH",
      "RED_LIGHT_THERAPY",
      "CRYOTHERAPY",
      "BREATHWORK",
      "MOBILITY",
      "OTHER",
    ]);
    expect(RECOVERY_SESSION_MODALITY.SAUNA).toBe("SAUNA");
    expect(RECOVERY_SESSION_MODALITY_LABELS.SAUNA).toBe("Sauna");
  });

  it("validates recovery session records and list responses", () => {
    const session = createMockRecoverySession();
    expect(RecoverySessionSchema.safeParse(session).success).toBe(true);
    expect(
      RecoverySessionCreatePayloadSchema.safeParse({
        modality: "ICE_BATH",
        performedAt: "2026-03-14T12:00:00.000Z",
        durationMinutes: 30,
        temperatureCelsius: 8,
        perceivedBenefitScore: 7,
        notes: "Cold plunge",
      }).success,
    ).toBe(true);
    expect(
      RecoverySessionListResponseSchema.safeParse({
        data: [session],
        pagination: {
          page: 1,
          limit: 50,
          total: 1,
          totalPages: 1,
          hasMore: false,
        },
      }).success,
    ).toBe(true);
    expect(RecoverySessionModalitySchema.safeParse("SAUNA").success).toBe(true);
    expect(RecoverySessionModalitySchema.safeParse("HOT_TUB").success).toBe(
      false,
    );
  });
});
