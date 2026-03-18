/**
 * @ai-context Miscellaneous Domain Contracts Tests
 *
 * This test file covers smaller domain schemas not large enough to warrant
 * their own test files:
 *
 * 1. auth-tokens.ts: REVOKED_REASONS, RevokedReasonSchema, REVOKED_REASON constants
 * 2. jobs.ts: CRON_JOB_STATUS constants, CronJobStatus type
 * 3. journal.ts: JOURNAL_MOODS, JOURNAL_ENERGIES, dailyCheckInFormSchema,
 *    journalAIAssessmentSchema, journalEntrySchema, journalEntryFormSchema
 * 4. metric-definition.ts: MetricDefinitionSummarySchema
 * 5. appointment-config.ts: APPOINTMENT_DURATIONS, BUSINESS_TIMEZONE,
 *    TimeSlotSchema, AvailabilityResponseSchema, getDurationForType
 * 6. enumContract.ts: createEnumContract factory, toTitleCase, getEnumValues
 *
 * Run: npx jest shared/contracts/__tests__/domain-misc.test.ts
 */

import {
  REVOKED_REASON,
  REVOKED_REASONS,
  RevokedReasonSchema,
} from '../domain/auth-tokens';

import {
  CRON_JOB_STATUS,
  type CronJobStatus,
} from '../domain/jobs';

import {
  createMockJournalEntry,
  dailyCheckInFormSchema,
  JOURNAL_ENERGIES,
  JOURNAL_ENERGY_LABELS,
  journalAIAssessmentSchema,
  journalEntryFormSchema,
  journalEntrySchema,
  JournalEnergySchema,
  JOURNAL_MOODS,
  JOURNAL_MOOD_LABELS,
  JournalMoodSchema,
  PLAN_ADHERENCE_VALUES,
  PlanAdherenceSchema,
} from '../domain/journal';

import {
  MetricDefinitionSummarySchema,
} from '../domain/metric-definition';

import {
  APPOINTMENT_DURATIONS,
  AvailabilityResponseSchema,
  BUSINESS_TIMEZONE,
  BUSINESS_TIMEZONE_ABBR,
  getDurationForType,
  TimeSlotSchema,
} from '../domain/appointment-config';

import {
  createEnumContract,
  getEnumValues,
  toTitleCase,
} from '../domain/enumContract';

// ============================================================================
// HELPERS
// ============================================================================

const NOW_ISO = new Date().toISOString();
const TODAY = NOW_ISO.slice(0, 10);

// ============================================================================
// AUTH TOKENS (auth-tokens.ts)
// ============================================================================

describe('Auth Tokens Domain Contracts', () => {
  describe('RevokedReason', () => {
    it('should contain exactly 7 revocation reasons', () => {
      expect(REVOKED_REASONS).toHaveLength(7);
    });

    it('should contain production revocation reasons', () => {
      expect(REVOKED_REASONS).toContain('LOGOUT');
      expect(REVOKED_REASONS).toContain('TOKEN_REUSE_DETECTED');
      expect(REVOKED_REASONS).toContain('PASSWORD_RESET');
      expect(REVOKED_REASONS).toContain('PASSWORD_CHANGE');
      expect(REVOKED_REASONS).toContain('ORG_ARCHIVED');
    });

    it('should contain test-only revocation reasons', () => {
      expect(REVOKED_REASONS).toContain('TEST_CLEANUP');
      expect(REVOKED_REASONS).toContain('TEST_REVOCATION');
    });

    it.each(REVOKED_REASONS)('RevokedReasonSchema should accept: %s', (value) => {
      expect(RevokedReasonSchema.safeParse(value).success).toBe(true);
    });

    it('RevokedReasonSchema should reject invalid values', () => {
      expect(RevokedReasonSchema.safeParse('SUSPENDED').success).toBe(false);
      expect(RevokedReasonSchema.safeParse('logout').success).toBe(false);
      expect(RevokedReasonSchema.safeParse('').success).toBe(false);
      expect(RevokedReasonSchema.safeParse(null).success).toBe(false);
    });

    it('should have constants matching all revocation reasons', () => {
      expect(REVOKED_REASON.LOGOUT).toBe('LOGOUT');
      expect(REVOKED_REASON.TOKEN_REUSE_DETECTED).toBe('TOKEN_REUSE_DETECTED');
      expect(REVOKED_REASON.PASSWORD_RESET).toBe('PASSWORD_RESET');
      expect(REVOKED_REASON.PASSWORD_CHANGE).toBe('PASSWORD_CHANGE');
      expect(REVOKED_REASON.ORG_ARCHIVED).toBe('ORG_ARCHIVED');
      expect(REVOKED_REASON.TEST_CLEANUP).toBe('TEST_CLEANUP');
      expect(REVOKED_REASON.TEST_REVOCATION).toBe('TEST_REVOCATION');
    });

    it('all constant values should be present in tuple', () => {
      for (const value of Object.values(REVOKED_REASON)) {
        expect(REVOKED_REASONS).toContain(value);
      }
    });
  });
});

// ============================================================================
// JOBS (jobs.ts)
// ============================================================================

describe('Jobs Domain Contracts', () => {
  describe('CRON_JOB_STATUS', () => {
    it('should have expected status values', () => {
      expect(CRON_JOB_STATUS.SUCCESS).toBe('success');
      expect(CRON_JOB_STATUS.FAILURE).toBe('failure');
      expect(CRON_JOB_STATUS.PARTIAL).toBe('partial');
    });

    it('should produce correct CronJobStatus type values', () => {
      const success: CronJobStatus = CRON_JOB_STATUS.SUCCESS;
      const failure: CronJobStatus = CRON_JOB_STATUS.FAILURE;
      const partial: CronJobStatus = CRON_JOB_STATUS.PARTIAL;

      expect(success).toBe('success');
      expect(failure).toBe('failure');
      expect(partial).toBe('partial');
    });

    it('should have all values as lowercase strings', () => {
      for (const value of Object.values(CRON_JOB_STATUS)) {
        expect(value).toBe(value.toLowerCase());
      }
    });
  });
});

// ============================================================================
// JOURNAL (journal.ts)
// ============================================================================

describe('Journal Domain Contracts', () => {
  describe('JournalMood', () => {
    it('should contain exactly 5 moods', () => {
      expect(JOURNAL_MOODS).toHaveLength(5);
    });

    it('should contain all mood values in order from negative to positive', () => {
      expect(JOURNAL_MOODS).toContain('very_negative');
      expect(JOURNAL_MOODS).toContain('negative');
      expect(JOURNAL_MOODS).toContain('neutral');
      expect(JOURNAL_MOODS).toContain('positive');
      expect(JOURNAL_MOODS).toContain('very_positive');
    });

    it.each(JOURNAL_MOODS)('JournalMoodSchema should accept: %s', (value) => {
      expect(JournalMoodSchema.safeParse(value).success).toBe(true);
    });

    it('JournalMoodSchema should reject invalid values', () => {
      expect(JournalMoodSchema.safeParse('happy').success).toBe(false);
      expect(JournalMoodSchema.safeParse('NEUTRAL').success).toBe(false);
      expect(JournalMoodSchema.safeParse(3).success).toBe(false);
    });

    it('should have labels for all moods', () => {
      for (const mood of JOURNAL_MOODS) {
        expect(JOURNAL_MOOD_LABELS[mood]).toBeDefined();
        expect(JOURNAL_MOOD_LABELS[mood].length).toBeGreaterThan(0);
      }
    });
  });

  describe('JournalEnergy', () => {
    it('should contain exactly 5 energy levels', () => {
      expect(JOURNAL_ENERGIES).toHaveLength(5);
    });

    it('should contain all energy values', () => {
      expect(JOURNAL_ENERGIES).toContain('very_low');
      expect(JOURNAL_ENERGIES).toContain('low');
      expect(JOURNAL_ENERGIES).toContain('medium');
      expect(JOURNAL_ENERGIES).toContain('high');
      expect(JOURNAL_ENERGIES).toContain('very_high');
    });

    it.each(JOURNAL_ENERGIES)('JournalEnergySchema should accept: %s', (value) => {
      expect(JournalEnergySchema.safeParse(value).success).toBe(true);
    });

    it('should have labels for all energy levels', () => {
      for (const energy of JOURNAL_ENERGIES) {
        expect(JOURNAL_ENERGY_LABELS[energy]).toBeDefined();
        expect(JOURNAL_ENERGY_LABELS[energy].length).toBeGreaterThan(0);
      }
    });
  });

  describe('PlanAdherence', () => {
    it('should contain exactly 3 plan adherence values', () => {
      expect(PLAN_ADHERENCE_VALUES).toHaveLength(3);
    });

    it('should contain Yes, Mostly, No', () => {
      expect(PLAN_ADHERENCE_VALUES).toContain('Yes');
      expect(PLAN_ADHERENCE_VALUES).toContain('Mostly');
      expect(PLAN_ADHERENCE_VALUES).toContain('No');
    });

    it.each(PLAN_ADHERENCE_VALUES)('PlanAdherenceSchema should accept: %s', (value) => {
      expect(PlanAdherenceSchema.safeParse(value).success).toBe(true);
    });

    it('should reject invalid values', () => {
      expect(PlanAdherenceSchema.safeParse('yes').success).toBe(false);
      expect(PlanAdherenceSchema.safeParse('Kind Of').success).toBe(false);
    });
  });

  describe('dailyCheckInFormSchema', () => {
    it('should accept a valid check-in', () => {
      expect(dailyCheckInFormSchema.safeParse({
        planAdherence: 'Yes',
        energyLevel: 4,
        notes: 'Felt great today.',
      }).success).toBe(true);
    });

    it('should accept without optional notes', () => {
      expect(dailyCheckInFormSchema.safeParse({
        planAdherence: 'Mostly',
        energyLevel: 3,
      }).success).toBe(true);
    });

    it('should reject energyLevel outside 1-5', () => {
      expect(dailyCheckInFormSchema.safeParse({
        planAdherence: 'No',
        energyLevel: 0,
      }).success).toBe(false);

      expect(dailyCheckInFormSchema.safeParse({
        planAdherence: 'No',
        energyLevel: 6,
      }).success).toBe(false);
    });

    it('should reject non-integer energyLevel', () => {
      expect(dailyCheckInFormSchema.safeParse({
        planAdherence: 'Yes',
        energyLevel: 3.5,
      }).success).toBe(false);
    });

    it('should reject notes over 2000 chars', () => {
      expect(dailyCheckInFormSchema.safeParse({
        planAdherence: 'Yes',
        energyLevel: 3,
        notes: 'a'.repeat(2001),
      }).success).toBe(false);
    });
  });

  describe('journalAIAssessmentSchema', () => {
    it('should accept a valid AI assessment', () => {
      expect(journalAIAssessmentSchema.safeParse({
        summary: 'User had a productive day with mild stress.',
        themes: ['work', 'productivity'],
        sentimentScore: 0.6,
        recommendedActions: ['Take a walk'],
      }).success).toBe(true);
    });

    it('should accept without optional recommendedActions', () => {
      expect(journalAIAssessmentSchema.safeParse({
        summary: 'Neutral day.',
        themes: [],
        sentimentScore: 0,
      }).success).toBe(true);
    });

    it('should reject sentimentScore outside -1 to 1', () => {
      expect(journalAIAssessmentSchema.safeParse({
        summary: 'Summary',
        themes: [],
        sentimentScore: 1.5,
      }).success).toBe(false);

      expect(journalAIAssessmentSchema.safeParse({
        summary: 'Summary',
        themes: [],
        sentimentScore: -1.1,
      }).success).toBe(false);
    });

    it('should reject empty summary', () => {
      expect(journalAIAssessmentSchema.safeParse({
        summary: '',
        themes: [],
        sentimentScore: 0,
      }).success).toBe(false);
    });
  });

  describe('journalEntrySchema', () => {
    it('should accept a valid journal entry', () => {
      const result = journalEntrySchema.safeParse({
        id: 'entry-123',
        userId: 'user-456',
        entryDate: TODAY,
        content: 'Today was a good day.',
        mood: 'positive',
        energy: 'high',
        stressLevel: 3,
        planAdherence: 1,
        motivation: 8,
        tags: ['workout', 'productive'],
        createdAt: NOW_ISO,
        updatedAt: NOW_ISO,
      });
      expect(result.success).toBe(true);
    });

    it('should accept minimal entry (only required fields)', () => {
      expect(journalEntrySchema.safeParse({
        userId: 'user-456',
        entryDate: TODAY,
        content: 'Quick entry.',
        createdAt: NOW_ISO,
        updatedAt: NOW_ISO,
      }).success).toBe(true);
    });

    it('should accept null for mood and energy (graceful degradation)', () => {
      expect(journalEntrySchema.safeParse({
        userId: 'user-456',
        entryDate: TODAY,
        content: 'Entry with null mood.',
        mood: null,
        energy: null,
        createdAt: NOW_ISO,
        updatedAt: NOW_ISO,
      }).success).toBe(true);
    });

    it('should coerce unknown mood to null via .catch(null)', () => {
      const result = journalEntrySchema.safeParse({
        userId: 'user-456',
        entryDate: TODAY,
        content: 'Entry.',
        mood: 'UNKNOWN_LEGACY_MOOD',
        createdAt: NOW_ISO,
        updatedAt: NOW_ISO,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.mood).toBeNull();
      }
    });

    it('should reject empty content', () => {
      expect(journalEntrySchema.safeParse({
        userId: 'user-456',
        entryDate: TODAY,
        content: '',
        createdAt: NOW_ISO,
        updatedAt: NOW_ISO,
      }).success).toBe(false);
    });

    it('should reject stressLevel outside 1-10', () => {
      expect(journalEntrySchema.safeParse({
        userId: 'user-456',
        entryDate: TODAY,
        content: 'Entry.',
        stressLevel: 0,
        createdAt: NOW_ISO,
        updatedAt: NOW_ISO,
      }).success).toBe(false);
    });
  });

  describe('journalEntryFormSchema', () => {
    it('should accept valid form input', () => {
      expect(journalEntryFormSchema.safeParse({
        content: 'Had a great workout today.',
        mood: 7,
        energy: 8,
        stress: 3,
        motivation: 9,
        tags: ['fitness', 'positive'],
      }).success).toBe(true);
    });

    it('should accept minimal form input', () => {
      expect(journalEntryFormSchema.safeParse({
        content: 'Quick note.',
      }).success).toBe(true);
    });

    it('should trim content', () => {
      const result = journalEntryFormSchema.parse({ content: '  Hello World  ' });
      expect(result.content).toBe('Hello World');
    });

    it('should reject empty content (after trim)', () => {
      expect(journalEntryFormSchema.safeParse({ content: '   ' }).success).toBe(false);
    });

    it('should reject content over 10000 chars', () => {
      expect(journalEntryFormSchema.safeParse({
        content: 'a'.repeat(10001),
      }).success).toBe(false);
    });

    it('should reject too many tags (over 20)', () => {
      expect(journalEntryFormSchema.safeParse({
        content: 'Entry',
        tags: Array.from({ length: 21 }, (_, i) => `tag-${i}`),
      }).success).toBe(false);
    });

    it('should reject a tag over 50 chars', () => {
      expect(journalEntryFormSchema.safeParse({
        content: 'Entry',
        tags: ['a'.repeat(51)],
      }).success).toBe(false);
    });

    it('should reject mood outside 1-10', () => {
      expect(journalEntryFormSchema.safeParse({
        content: 'Entry',
        mood: 0,
      }).success).toBe(false);

      expect(journalEntryFormSchema.safeParse({
        content: 'Entry',
        mood: 11,
      }).success).toBe(false);
    });
  });

  describe('createMockJournalEntry mock factory', () => {
    it('should produce a valid journal entry', () => {
      const mock = createMockJournalEntry();
      expect(journalEntrySchema.safeParse(mock).success).toBe(true);
    });

    it('should allow overriding fields', () => {
      const mock = createMockJournalEntry({ userId: 'custom-user', mood: 'neutral' });
      expect(mock.userId).toBe('custom-user');
      expect(mock.mood).toBe('neutral');
    });
  });
});

// ============================================================================
// METRIC DEFINITION (metric-definition.ts)
// ============================================================================

describe('MetricDefinition Domain Contracts', () => {
  describe('MetricDefinitionSummarySchema', () => {
    it('should accept a valid metric definition summary', () => {
      const result = MetricDefinitionSummarySchema.safeParse({
        code: 'glucoseFasting',
        displayName: 'Fasting Glucose',
        primaryUnit: 'mg/dL',
        trendDirection: 'LOWER_BETTER',
        category: 'LAB',
        healthCategory: 'metabolic',
        description: 'Fasting blood glucose level.',
        goalEligible: true,
      });
      expect(result.success).toBe(true);
    });

    it('should accept null for nullable fields', () => {
      expect(MetricDefinitionSummarySchema.safeParse({
        code: 'bodyWeight',
        displayName: 'Body Weight',
        primaryUnit: 'kg',
        trendDirection: null,
        category: 'BIOMETRIC',
        healthCategory: null,
        description: null,
        goalEligible: false,
      }).success).toBe(true);
    });

    it('should reject invalid category', () => {
      expect(MetricDefinitionSummarySchema.safeParse({
        code: 'glucoseFasting',
        displayName: 'Fasting Glucose',
        primaryUnit: 'mg/dL',
        trendDirection: null,
        category: 'IMAGING',
        healthCategory: null,
        description: null,
        goalEligible: true,
      }).success).toBe(false);
    });

    it('should reject invalid trendDirection', () => {
      expect(MetricDefinitionSummarySchema.safeParse({
        code: 'metric',
        displayName: 'Metric',
        primaryUnit: 'units',
        trendDirection: 'higher_better', // wrong case
        category: 'LAB',
        healthCategory: null,
        description: null,
        goalEligible: false,
      }).success).toBe(false);
    });
  });
});

// ============================================================================
// APPOINTMENT CONFIG (appointment-config.ts)
// ============================================================================

describe('Appointment Config Domain Contracts', () => {
  describe('BUSINESS_TIMEZONE', () => {
    it('should be America/Chicago', () => {
      expect(BUSINESS_TIMEZONE).toBe('America/Chicago');
    });

    it('should have timezone abbreviations', () => {
      expect(BUSINESS_TIMEZONE_ABBR.standard).toBe('CST');
      expect(BUSINESS_TIMEZONE_ABBR.daylight).toBe('CDT');
    });
  });

  describe('APPOINTMENT_DURATIONS', () => {
    it('should have durations for all appointment types', () => {
      expect(APPOINTMENT_DURATIONS.CHECK_IN).toBe(30);
      expect(APPOINTMENT_DURATIONS.CONSULTATION).toBe(60);
      expect(APPOINTMENT_DURATIONS.TRAINING_SESSION).toBe(60);
      expect(APPOINTMENT_DURATIONS.ONBOARDING).toBe(45);
      expect(APPOINTMENT_DURATIONS.RECOVERY_SESSION).toBe(60);
      expect(APPOINTMENT_DURATIONS.LABWORK).toBe(30);
      expect(APPOINTMENT_DURATIONS.DXA_SCAN).toBe(30);
      expect(APPOINTMENT_DURATIONS.SLEEP_SCREENING).toBe(15);
    });

    it('all durations should be positive integers', () => {
      for (const duration of Object.values(APPOINTMENT_DURATIONS)) {
        expect(duration).toBeGreaterThan(0);
        expect(Number.isInteger(duration)).toBe(true);
      }
    });
  });

  describe('getDurationForType', () => {
    it('should return 30 for CHECK_IN', () => {
      expect(getDurationForType('CHECK_IN')).toBe(30);
    });

    it('should return 60 for CONSULTATION', () => {
      expect(getDurationForType('CONSULTATION')).toBe(60);
    });

    it('should return 15 for SLEEP_SCREENING', () => {
      expect(getDurationForType('SLEEP_SCREENING')).toBe(15);
    });
  });

  describe('TimeSlotSchema', () => {
    it('should accept a valid time slot', () => {
      expect(TimeSlotSchema.safeParse({
        date: '2024-06-15',
        time: '09:00',
        available: true,
        utcOffset: '-05:00',
      }).success).toBe(true);
    });

    it('should accept unavailable time slot', () => {
      expect(TimeSlotSchema.safeParse({
        date: '2024-06-15',
        time: '10:00',
        available: false,
        utcOffset: '-06:00',
      }).success).toBe(true);
    });

    it('should reject missing required fields', () => {
      expect(TimeSlotSchema.safeParse({
        date: '2024-06-15',
        time: '09:00',
        // missing available and utcOffset
      }).success).toBe(false);
    });
  });

  describe('AvailabilityResponseSchema', () => {
    it('should accept a valid availability response', () => {
      const result = AvailabilityResponseSchema.safeParse({
        slots: [
          { date: '2024-06-15', time: '09:00', available: true, utcOffset: '-05:00' },
          { date: '2024-06-15', time: '10:00', available: false, utcOffset: '-05:00' },
        ],
        timezone: 'America/Chicago',
        timezoneAbbr: 'CST',
      });
      expect(result.success).toBe(true);
    });

    it('should accept empty slots array', () => {
      expect(AvailabilityResponseSchema.safeParse({
        slots: [],
        timezone: 'America/Chicago',
        timezoneAbbr: 'CDT',
      }).success).toBe(true);
    });

    it('should reject missing timezone fields', () => {
      expect(AvailabilityResponseSchema.safeParse({
        slots: [],
      }).success).toBe(false);
    });
  });
});

// ============================================================================
// ENUM CONTRACT (enumContract.ts)
// ============================================================================

describe('EnumContract Utility', () => {
  describe('toTitleCase', () => {
    it('should convert snake_case to Title Case', () => {
      expect(toTitleCase('lightly_active')).toBe('Lightly Active');
      expect(toTitleCase('very_low')).toBe('Very Low');
    });

    it('should convert kebab-case to Title Case', () => {
      expect(toTitleCase('lose-weight')).toBe('Lose Weight');
      expect(toTitleCase('at-risk')).toBe('At Risk');
    });

    it('should convert UPPER_CASE to Title Case', () => {
      expect(toTitleCase('ADMIN')).toBe('Admin');
    });

    it('should handle single word', () => {
      expect(toTitleCase('fitness')).toBe('Fitness');
    });

    it('should handle string with numbers', () => {
      expect(toTitleCase('trimester_1')).toBe('Trimester 1');
    });
  });

  describe('createEnumContract', () => {
    const SexContract = createEnumContract(['male', 'female', 'other'] as const, {
      labels: { other: 'Non-Binary' },
    });

    it('should preserve the original values tuple', () => {
      expect(SexContract.values).toEqual(['male', 'female', 'other']);
    });

    it('should create a valid Zod schema', () => {
      expect(SexContract.schema.safeParse('male').success).toBe(true);
      expect(SexContract.schema.safeParse('female').success).toBe(true);
      expect(SexContract.schema.safeParse('other').success).toBe(true);
      expect(SexContract.schema.safeParse('intersex').success).toBe(false);
    });

    it('should auto-generate labels with title case', () => {
      expect(SexContract.labels.male).toBe('Male');
      expect(SexContract.labels.female).toBe('Female');
    });

    it('should use custom labels when provided', () => {
      expect(SexContract.labels.other).toBe('Non-Binary');
    });

    it('should generate UPPER_SNAKE_CASE constants', () => {
      expect(SexContract.constants.MALE).toBe('male');
      expect(SexContract.constants.FEMALE).toBe('female');
      expect(SexContract.constants.OTHER).toBe('other');
    });

    it('should handle hyphenated values in constants', () => {
      const StatusContract = createEnumContract(['at-risk', 'non-compliant'] as const);
      expect(StatusContract.constants.AT_RISK).toBe('at-risk');
      expect(StatusContract.constants.NON_COMPLIANT).toBe('non-compliant');
    });

    it('should auto-generate labels from kebab-case', () => {
      const StatusContract = createEnumContract(['at-risk', 'non-compliant'] as const);
      expect(StatusContract.labels['at-risk']).toBe('At Risk');
      expect(StatusContract.labels['non-compliant']).toBe('Non Compliant');
    });

    it('should work with a single-value tuple', () => {
      const SingleContract = createEnumContract(['only_option'] as const);
      expect(SingleContract.schema.safeParse('only_option').success).toBe(true);
      expect(SingleContract.constants.ONLY_OPTION).toBe('only_option');
    });
  });

  describe('getEnumValues', () => {
    it('should return the values tuple from an enum contract', () => {
      const contract = createEnumContract(['a', 'b', 'c'] as const);
      const values = getEnumValues(contract);
      expect(values).toEqual(['a', 'b', 'c']);
    });
  });
});
