/**
 * @ai-context AI Notes Domain Contracts Tests | Smart Assist notes, categories, and context schemas
 *
 * This test suite verifies:
 * 1. AINoteCategory tuple, schema, constants, labels, type guards
 * 2. AINoteSourceType tuple, schema, constants, labels, type guards
 * 3. workoutSessionNoteSchema
 * 4. aiPermanentNoteSchema
 * 5. permanentNoteFormSchema
 * 6. aiContextSchema
 * 7. Mock factory functions
 *
 * Run: npx jest shared/contracts/__tests__/domain-ai-notes.test.ts
 */

import {
  AI_NOTE_CATEGORIES,
  AI_NOTE_CATEGORY,
  AI_NOTE_CATEGORY_LABELS,
  AI_NOTE_SOURCE_TYPE,
  AI_NOTE_SOURCE_TYPE_LABELS,
  AI_NOTE_SOURCE_TYPES,
  aiContextSchema,
  AINoteCategory,
  AINoteCategorySchema,
  AINoteSourceTypeSchema,
  aiPermanentNoteSchema,
  createMockAIContext,
  createMockAIPermanentNote,
  createMockWorkoutSessionNote,
  getAINoteCategoryLabel,
  getAINoteSourceTypeLabel,
  isAINoteCategory,
  isAINoteSourceType,
  permanentNoteFormSchema,
  workoutSessionNoteSchema,
} from '../domain/ai-notes';

// ============================================================================
// HELPERS
// ============================================================================

const NOW_ISO = new Date().toISOString();
const TODAY = NOW_ISO.slice(0, 10);

function validWorkoutNote() {
  return {
    id: 'note-123',
    userId: 'user-456',
    workoutDate: TODAY,
    content: 'Felt strong during bench press today.',
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
  };
}

function validPermanentNote() {
  return {
    id: 'perm-note-789',
    userId: 'user-456',
    content: 'User has left shoulder rotator cuff issue.',
    category: 'INJURY' as const,
    source: 'Initial intake form',
    sourceType: 'INTAKE_SEEDED' as const,
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
  };
}

// ============================================================================
// AI NOTE CATEGORY
// ============================================================================

describe('AI Notes Domain Contracts', () => {
  describe('AINoteCategory', () => {
    it('should contain exactly 6 categories', () => {
      expect(AI_NOTE_CATEGORIES).toHaveLength(6);
    });

    it('should contain all expected values', () => {
      expect(AI_NOTE_CATEGORIES).toContain('INJURY');
      expect(AI_NOTE_CATEGORIES).toContain('PREFERENCE');
      expect(AI_NOTE_CATEGORIES).toContain('LIMITATION');
      expect(AI_NOTE_CATEGORIES).toContain('MEDICAL');
      expect(AI_NOTE_CATEGORIES).toContain('GOAL');
      expect(AI_NOTE_CATEGORIES).toContain('OTHER');
    });

    it.each(AI_NOTE_CATEGORIES)('schema should accept: %s', (value) => {
      expect(AINoteCategorySchema.safeParse(value).success).toBe(true);
    });

    it('schema should reject invalid values', () => {
      expect(AINoteCategorySchema.safeParse('HEALTH').success).toBe(false);
      expect(AINoteCategorySchema.safeParse('injury').success).toBe(false);
      expect(AINoteCategorySchema.safeParse('').success).toBe(false);
      expect(AINoteCategorySchema.safeParse(null).success).toBe(false);
    });

    it('should have constants matching tuple values', () => {
      expect(AI_NOTE_CATEGORY.INJURY).toBe('INJURY');
      expect(AI_NOTE_CATEGORY.PREFERENCE).toBe('PREFERENCE');
      expect(AI_NOTE_CATEGORY.LIMITATION).toBe('LIMITATION');
      expect(AI_NOTE_CATEGORY.MEDICAL).toBe('MEDICAL');
      expect(AI_NOTE_CATEGORY.GOAL).toBe('GOAL');
      expect(AI_NOTE_CATEGORY.OTHER).toBe('OTHER');
    });

    it('should have non-empty labels for all categories', () => {
      for (const cat of AI_NOTE_CATEGORIES) {
        expect(AI_NOTE_CATEGORY_LABELS[cat as AINoteCategory]).toBeDefined();
        expect(AI_NOTE_CATEGORY_LABELS[cat as AINoteCategory].length).toBeGreaterThan(0);
      }
    });

    describe('isAINoteCategory type guard', () => {
      it.each(AI_NOTE_CATEGORIES)('should return true for: %s', (value) => {
        expect(isAINoteCategory(value)).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isAINoteCategory('HEALTH')).toBe(false);
        expect(isAINoteCategory('injury')).toBe(false);
        expect(isAINoteCategory('')).toBe(false);
      });
    });

    describe('getAINoteCategoryLabel', () => {
      it.each(AI_NOTE_CATEGORIES)('should return label for valid value: %s', (value) => {
        const label = getAINoteCategoryLabel(value);
        expect(typeof label).toBe('string');
        expect(label.length).toBeGreaterThan(0);
      });

      it('should return the input as fallback for unknown values', () => {
        expect(getAINoteCategoryLabel('UNKNOWN_CATEGORY')).toBe('UNKNOWN_CATEGORY');
      });
    });
  });

  // ============================================================================
  // AI NOTE SOURCE TYPE
  // ============================================================================

  describe('AINoteSourceType', () => {
    it('should contain exactly 4 source types', () => {
      expect(AI_NOTE_SOURCE_TYPES).toHaveLength(4);
    });

    it('should contain all expected values', () => {
      expect(AI_NOTE_SOURCE_TYPES).toContain('AI_GENERATED');
      expect(AI_NOTE_SOURCE_TYPES).toContain('COACH_OBSERVATION');
      expect(AI_NOTE_SOURCE_TYPES).toContain('INTAKE_SEEDED');
      expect(AI_NOTE_SOURCE_TYPES).toContain('CLINICIAN_VERIFIED');
    });

    it.each(AI_NOTE_SOURCE_TYPES)('schema should accept: %s', (value) => {
      expect(AINoteSourceTypeSchema.safeParse(value).success).toBe(true);
    });

    it('schema should reject invalid values', () => {
      expect(AINoteSourceTypeSchema.safeParse('MANUAL').success).toBe(false);
      expect(AINoteSourceTypeSchema.safeParse('ai_generated').success).toBe(false);
      expect(AINoteSourceTypeSchema.safeParse('').success).toBe(false);
    });

    it('should have constants matching tuple values', () => {
      expect(AI_NOTE_SOURCE_TYPE.AI_GENERATED).toBe('AI_GENERATED');
      expect(AI_NOTE_SOURCE_TYPE.COACH_OBSERVATION).toBe('COACH_OBSERVATION');
      expect(AI_NOTE_SOURCE_TYPE.INTAKE_SEEDED).toBe('INTAKE_SEEDED');
      expect(AI_NOTE_SOURCE_TYPE.CLINICIAN_VERIFIED).toBe('CLINICIAN_VERIFIED');
    });

    it('should have labels for all source types', () => {
      for (const sourceType of AI_NOTE_SOURCE_TYPES) {
        expect(AI_NOTE_SOURCE_TYPE_LABELS[sourceType]).toBeDefined();
        expect(AI_NOTE_SOURCE_TYPE_LABELS[sourceType].length).toBeGreaterThan(0);
      }
    });

    describe('isAINoteSourceType type guard', () => {
      it.each(AI_NOTE_SOURCE_TYPES)('should return true for: %s', (value) => {
        expect(isAINoteSourceType(value)).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isAINoteSourceType('MANUAL')).toBe(false);
        expect(isAINoteSourceType('')).toBe(false);
      });
    });

    describe('getAINoteSourceTypeLabel', () => {
      it.each(AI_NOTE_SOURCE_TYPES)('should return label for valid value: %s', (value) => {
        const label = getAINoteSourceTypeLabel(value);
        expect(typeof label).toBe('string');
        expect(label.length).toBeGreaterThan(0);
      });

      it('should return the input as fallback for unknown source types', () => {
        expect(getAINoteSourceTypeLabel('UNKNOWN_TYPE')).toBe('UNKNOWN_TYPE');
      });
    });
  });

  // ============================================================================
  // WORKOUT SESSION NOTE SCHEMA
  // ============================================================================

  describe('workoutSessionNoteSchema', () => {
    it('should accept a valid workout session note', () => {
      expect(workoutSessionNoteSchema.safeParse(validWorkoutNote()).success).toBe(true);
    });

    it('should accept a note without optional workoutPlanId', () => {
      const result = workoutSessionNoteSchema.safeParse({
        ...validWorkoutNote(),
        workoutPlanId: null,
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty content', () => {
      expect(workoutSessionNoteSchema.safeParse({
        ...validWorkoutNote(),
        content: '',
      }).success).toBe(false);
    });

    it('should reject invalid workoutDate format', () => {
      expect(workoutSessionNoteSchema.safeParse({
        ...validWorkoutNote(),
        workoutDate: '2024/01/15',
      }).success).toBe(false);
    });

    it('should reject missing required fields', () => {
      expect(workoutSessionNoteSchema.safeParse({
        id: 'note-123',
        userId: 'user-456',
        // missing workoutDate and content
        createdAt: NOW_ISO,
        updatedAt: NOW_ISO,
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // AI PERMANENT NOTE SCHEMA
  // ============================================================================

  describe('aiPermanentNoteSchema', () => {
    it('should accept a valid permanent note', () => {
      expect(aiPermanentNoteSchema.safeParse(validPermanentNote()).success).toBe(true);
    });

    it('should accept null source and sourceType', () => {
      const result = aiPermanentNoteSchema.safeParse({
        ...validPermanentNote(),
        source: null,
        sourceType: null,
      });
      expect(result.success).toBe(true);
    });

    it('should accept a note without sourceType (optional)', () => {
      const { sourceType: _s, ...rest } = validPermanentNote();
      expect(aiPermanentNoteSchema.safeParse(rest).success).toBe(true);
    });

    it('should reject empty content', () => {
      expect(aiPermanentNoteSchema.safeParse({
        ...validPermanentNote(),
        content: '',
      }).success).toBe(false);
    });

    it('should reject invalid category', () => {
      expect(aiPermanentNoteSchema.safeParse({
        ...validPermanentNote(),
        category: 'PHYSICAL_LIMITATION',
      }).success).toBe(false);
    });

    it('should reject invalid sourceType', () => {
      expect(aiPermanentNoteSchema.safeParse({
        ...validPermanentNote(),
        sourceType: 'MANUAL_ENTRY',
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // PERMANENT NOTE FORM SCHEMA
  // ============================================================================

  describe('permanentNoteFormSchema', () => {
    it('should accept a valid form input', () => {
      expect(permanentNoteFormSchema.safeParse({
        content: 'Client reports lower back pain during deadlifts.',
      }).success).toBe(true);
    });

    it('should accept with optional source', () => {
      expect(permanentNoteFormSchema.safeParse({
        content: 'Prefers morning workouts.',
        source: 'Client intake conversation',
      }).success).toBe(true);
    });

    it('should trim whitespace from content', () => {
      const result = permanentNoteFormSchema.parse({
        content: '  Some content  ',
      });
      expect(result.content).toBe('Some content');
    });

    it('should reject empty content (after trim)', () => {
      expect(permanentNoteFormSchema.safeParse({
        content: '   ',
      }).success).toBe(false);
    });

    it('should reject content over 50000 chars', () => {
      expect(permanentNoteFormSchema.safeParse({
        content: 'a'.repeat(50001),
      }).success).toBe(false);
    });

    it('should reject source over 200 chars', () => {
      expect(permanentNoteFormSchema.safeParse({
        content: 'Valid content',
        source: 'a'.repeat(201),
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // AI CONTEXT SCHEMA
  // ============================================================================

  describe('aiContextSchema', () => {
    it('should accept a valid AI context', () => {
      const result = aiContextSchema.safeParse({
        userId: 'user-123',
        recentSessionNotes: [validWorkoutNote()],
        permanentNotes: [validPermanentNote()],
        clinicalLimitations: ['Lower back sensitivity'],
        medicalNotes: 'No current medications.',
        goals: ['Build lean muscle'],
        preferences: ['Free weights over machines'],
        contextWindowDays: 7,
        generatedAt: NOW_ISO,
      });
      expect(result.success).toBe(true);
    });

    it('should accept minimal context (empty arrays, no optional fields)', () => {
      const result = aiContextSchema.safeParse({
        userId: 'user-123',
        recentSessionNotes: [],
        permanentNotes: [],
        contextWindowDays: 14,
        generatedAt: NOW_ISO,
      });
      expect(result.success).toBe(true);
    });

    it('should reject contextWindowDays below 1', () => {
      expect(aiContextSchema.safeParse({
        userId: 'user-123',
        recentSessionNotes: [],
        permanentNotes: [],
        contextWindowDays: 0,
        generatedAt: NOW_ISO,
      }).success).toBe(false);
    });

    it('should reject invalid generatedAt (non-ISO timestamp)', () => {
      expect(aiContextSchema.safeParse({
        userId: 'user-123',
        recentSessionNotes: [],
        permanentNotes: [],
        contextWindowDays: 7,
        generatedAt: 'not-a-timestamp',
      }).success).toBe(false);
    });

    it('should reject missing userId', () => {
      expect(aiContextSchema.safeParse({
        recentSessionNotes: [],
        permanentNotes: [],
        contextWindowDays: 7,
        generatedAt: NOW_ISO,
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // MOCK FACTORIES
  // ============================================================================

  describe('Mock factories', () => {
    describe('createMockWorkoutSessionNote', () => {
      it('should produce a valid WorkoutSessionNoteContract', () => {
        const mock = createMockWorkoutSessionNote();
        expect(workoutSessionNoteSchema.safeParse(mock).success).toBe(true);
      });

      it('should allow overriding fields', () => {
        const mock = createMockWorkoutSessionNote({ userId: 'custom-user' });
        expect(mock.userId).toBe('custom-user');
      });
    });

    describe('createMockAIPermanentNote', () => {
      it('should produce a valid AIPermanentNoteContract', () => {
        const mock = createMockAIPermanentNote();
        expect(aiPermanentNoteSchema.safeParse(mock).success).toBe(true);
      });

      it('should allow overriding category', () => {
        const mock = createMockAIPermanentNote({ category: AI_NOTE_CATEGORY.MEDICAL });
        expect(mock.category).toBe('MEDICAL');
      });
    });

    describe('createMockAIContext', () => {
      it('should produce a valid AIContextContract', () => {
        const mock = createMockAIContext();
        expect(aiContextSchema.safeParse(mock).success).toBe(true);
      });

      it('should use default contextWindowDays of 7', () => {
        const mock = createMockAIContext();
        expect(mock.contextWindowDays).toBe(7);
      });
    });
  });
});
