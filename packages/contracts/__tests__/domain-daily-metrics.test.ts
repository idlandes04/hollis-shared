/**
 * @ai-context Daily Metrics Domain Contracts Tests | validates daily metrics schemas and types
 *
 * This test suite verifies:
 * 1. SleepSource tuple, schema, constants, and labels
 * 2. dailyMetricsSchema accepts all valid shapes (full + minimal)
 * 3. dailyMetricsSchema rejects invalid date formats and non-integer fields
 * 4. createMockDailyMetrics mock factory produces valid data
 * 5. dailyMetricsListPayloadSchema (paginated shape)
 * 6. Edge cases: null optionals, out-of-range values (no range constraints on output schema)
 *
 * Run: npx jest shared/contracts/__tests__/domain-daily-metrics.test.ts
 */

import {
  createMockDailyMetrics,
  dailyMetricsListPayloadSchema,
  dailyMetricsSchema,
  SLEEP_SOURCE,
  SLEEP_SOURCE_LABELS,
  SLEEP_SOURCES,
  SleepSourceSchema,
  type DailyMetricsContract,
  type SleepSource,
} from '../domain/daily-metrics';

// ============================================================================
// HELPERS
// ============================================================================

const NOW_ISO = new Date().toISOString();

function validDailyMetrics(): DailyMetricsContract {
  return {
    userId: 'HH-ABC123',
    date: '2024-06-15',
    tdeeEstimate: 2150,
    tdeeConfidence: 0.72,
    recoveryScore: 82,
    trainingLoad: 45,
    strainDelta: -5,
    sleepScore: 78,
    readinessScore: 80,
    caloricBalance: -250,
    acuteChronicRatio: 1.05,
    notes: ['Stay hydrated.'],
    recommendations: ['Consider a light recovery ride.'],
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
  };
}

// ============================================================================
// SLEEP SOURCE TESTS
// ============================================================================

describe('Daily Metrics Domain Contracts', () => {
  describe('SleepSource', () => {
    describe('tuple values', () => {
      it('should contain exactly 3 values', () => {
        expect(SLEEP_SOURCES).toHaveLength(3);
      });

      it('should contain all expected values', () => {
        expect(SLEEP_SOURCES).toContain('USER');
        expect(SLEEP_SOURCES).toContain('ADMIN_ENTERED');
        expect(SLEEP_SOURCES).toContain('WEARABLE');
      });
    });

    describe('schema validation', () => {
      it.each(SLEEP_SOURCES)('should accept valid value: %s', (value) => {
        expect(SleepSourceSchema.safeParse(value).success).toBe(true);
      });

      it('should reject invalid values', () => {
        expect(SleepSourceSchema.safeParse('MANUAL').success).toBe(false);
        expect(SleepSourceSchema.safeParse('user').success).toBe(false); // lowercase
        expect(SleepSourceSchema.safeParse('').success).toBe(false);
        expect(SleepSourceSchema.safeParse(null).success).toBe(false);
        expect(SleepSourceSchema.safeParse(undefined).success).toBe(false);
      });
    });

    describe('constants object', () => {
      it('should have keys that map to tuple values', () => {
        expect(SLEEP_SOURCE.USER).toBe('USER');
        expect(SLEEP_SOURCE.ADMIN_ENTERED).toBe('ADMIN_ENTERED');
        expect(SLEEP_SOURCE.WEARABLE).toBe('WEARABLE');
      });

      it('should have all values present in tuple', () => {
        for (const value of Object.values(SLEEP_SOURCE)) {
          expect(SLEEP_SOURCES).toContain(value);
        }
      });
    });

    describe('labels map', () => {
      it('should have a non-empty label for every tuple value', () => {
        for (const value of SLEEP_SOURCES) {
          expect(SLEEP_SOURCE_LABELS[value as SleepSource]).toBeDefined();
          expect(SLEEP_SOURCE_LABELS[value as SleepSource].length).toBeGreaterThan(0);
        }
      });
    });
  });

  // ============================================================================
  // DAILY METRICS SCHEMA TESTS
  // ============================================================================

  describe('dailyMetricsSchema', () => {
    describe('valid objects', () => {
      it('should accept a fully populated valid object', () => {
        const result = dailyMetricsSchema.safeParse(validDailyMetrics());
        expect(result.success).toBe(true);
      });

      it('should accept a minimal object (only required fields)', () => {
        const result = dailyMetricsSchema.safeParse({
          userId: 'HH-XYZ789',
          date: '2024-01-01',
          createdAt: NOW_ISO,
          updatedAt: NOW_ISO,
        });
        expect(result.success).toBe(true);
      });

      it('should accept null for all nullable metric fields', () => {
        const result = dailyMetricsSchema.safeParse({
          userId: 'HH-ABC123',
          date: '2024-06-15',
          tdeeEstimate: null,
          tdeeConfidence: null,
          recoveryScore: null,
          trainingLoad: null,
          strainDelta: null,
          sleepScore: null,
          readinessScore: null,
          caloricBalance: null,
          acuteChronicRatio: null,
          createdAt: NOW_ISO,
          updatedAt: NOW_ISO,
        });
        expect(result.success).toBe(true);
      });

      it('should accept empty arrays for notes and recommendations', () => {
        const result = dailyMetricsSchema.safeParse({
          ...validDailyMetrics(),
          notes: [],
          recommendations: [],
        });
        expect(result.success).toBe(true);
      });

      // NOTE: The output schema intentionally has NO range constraints on metric fields.
      // This is documented in the source: wearable sync data may exceed expected ranges.
      it('should accept out-of-typical-range values (no range constraints on output schema)', () => {
        const result = dailyMetricsSchema.safeParse({
          ...validDailyMetrics(),
          recoveryScore: 101, // above typical 0-100
          sleepScore: -5,    // below 0
        });
        expect(result.success).toBe(true);
      });

      it('should accept negative caloricBalance (caloric deficit)', () => {
        const result = dailyMetricsSchema.safeParse({
          ...validDailyMetrics(),
          caloricBalance: -1200,
        });
        expect(result.success).toBe(true);
      });

      it('should accept negative strainDelta', () => {
        const result = dailyMetricsSchema.safeParse({
          ...validDailyMetrics(),
          strainDelta: -50,
        });
        expect(result.success).toBe(true);
      });
    });

    describe('invalid objects', () => {
      it('should reject missing userId', () => {
        const { userId: _u, ...rest } = validDailyMetrics();
        expect(dailyMetricsSchema.safeParse(rest).success).toBe(false);
      });

      it('should reject missing date', () => {
        const { date: _d, ...rest } = validDailyMetrics();
        expect(dailyMetricsSchema.safeParse(rest).success).toBe(false);
      });

      it('should reject invalid date format', () => {
        expect(dailyMetricsSchema.safeParse({
          ...validDailyMetrics(),
          date: '2024/06/15',
        }).success).toBe(false);

        expect(dailyMetricsSchema.safeParse({
          ...validDailyMetrics(),
          date: 'not-a-date',
        }).success).toBe(false);
      });

      it('should reject non-integer for integer fields', () => {
        expect(dailyMetricsSchema.safeParse({
          ...validDailyMetrics(),
          tdeeEstimate: 2150.5,
        }).success).toBe(false);

        expect(dailyMetricsSchema.safeParse({
          ...validDailyMetrics(),
          recoveryScore: 82.3,
        }).success).toBe(false);
      });

      it('should reject non-number for numeric fields', () => {
        expect(dailyMetricsSchema.safeParse({
          ...validDailyMetrics(),
          tdeeConfidence: 'high',
        }).success).toBe(false);
      });

      it('should reject empty object', () => {
        expect(dailyMetricsSchema.safeParse({}).success).toBe(false);
      });
    });
  });

  // ============================================================================
  // MOCK FACTORY
  // ============================================================================

  describe('createMockDailyMetrics', () => {
    it('should produce a valid DailyMetricsContract', () => {
      const mock = createMockDailyMetrics();
      const result = dailyMetricsSchema.safeParse(mock);
      expect(result.success).toBe(true);
    });

    it('should allow overriding individual fields', () => {
      const mock = createMockDailyMetrics({ userId: 'HH-CUSTOM', recoveryScore: 99 });
      expect(mock.userId).toBe('HH-CUSTOM');
      expect(mock.recoveryScore).toBe(99);
    });

    it('should use defaults when no overrides provided', () => {
      const mock = createMockDailyMetrics();
      expect(mock.userId).toBe('HH-ABC123');
      expect(typeof mock.tdeeEstimate).toBe('number');
    });
  });

  // ============================================================================
  // PAGINATED LIST SCHEMA
  // ============================================================================

  describe('dailyMetricsListPayloadSchema', () => {
    it('should accept a valid paginated response', () => {
      const result = dailyMetricsListPayloadSchema.safeParse({
        data: [validDailyMetrics()],
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          hasMore: false,
        },
      });
      expect(result.success).toBe(true);
    });

    it('should accept an empty data array', () => {
      const result = dailyMetricsListPayloadSchema.safeParse({
        data: [],
        pagination: {
          total: 0,
          limit: 20,
          offset: 0,
          hasMore: false,
        },
      });
      expect(result.success).toBe(true);
    });

    it('should reject a response without pagination', () => {
      const result = dailyMetricsListPayloadSchema.safeParse({
        data: [validDailyMetrics()],
      });
      expect(result.success).toBe(false);
    });
  });
});
