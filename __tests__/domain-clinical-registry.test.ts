/**
 * @ai-context Clinical Registry Schema Domain Contracts Tests
 *
 * This test suite verifies:
 * 1. CLINICAL_METRIC_CATEGORIES (8) — schema, constants, labels, type guard
 * 2. CLINICAL_METRIC_DIRECTIONS (3) — schema, constants, labels, type guard
 * 3. CLINICAL_VALUE_TYPES (4) — schema, constants, labels, type guard
 * 4. CLINICAL_AGE_BRACKETS (6) — schema, constants, labels, type guard
 * 5. CLINICAL_SEXES (2) — schema, constants
 * 6. CLINICAL_PREGNANCY_STATUSES (5) — schema, constants, labels, type guard
 * 7. CLINICAL_MODIFIER_LOGIC_TYPES (3) — schema, constants, labels, type guard
 * 8. ClinicalMetricKeySchema — camelCase regex validation
 * 9. ClinicalUnitVariantSchema
 * 10. ClinicalBaseRangeSchema — min < max refine
 * 11. ClinicalOptimalRangeSchema — at-least-one-of-min-max, min < max if both
 * 12. ClinicalHardLimitsSchema — min < max refine
 * 13. ClinicalModifierConditionsSchema
 * 14. ClinicalPopulationModifierSchema
 * 15. ClinicalPanelComponentSchema
 * 16. ClinicalMetricDefinitionSchema — superRefine cross-field validations:
 *     - hardLimits must contain baseRange
 *     - optimalRange must be within baseRange
 *     - deprecatedReason required when isDeprecated = true
 * 17. ClinicalMetricRegistrySchema — superRefine:
 *     - record key must match definition key
 *     - duplicate modifier conditions rejected
 *     - panel component references must exist
 * 18. Type guards: isClinicalMetricKey, isClinicalMetricCategory, etc.
 * 19. Parse helpers: parseClinicalMetricDefinition, safeParseClinicalMetricRegistry
 *
 * Run: npx jest shared/contracts/__tests__/domain-clinical-registry.test.ts
 */

import {
  CLINICAL_AGE_BRACKET,
  CLINICAL_AGE_BRACKET_LABELS,
  CLINICAL_AGE_BRACKETS,
  ClinicalAgeBracketSchema,
  CLINICAL_METRIC_CATEGORIES,
  CLINICAL_METRIC_CATEGORY,
  CLINICAL_METRIC_CATEGORY_LABELS,
  ClinicalMetricCategorySchema,
  CLINICAL_METRIC_DIRECTION,
  CLINICAL_METRIC_DIRECTION_LABELS,
  CLINICAL_METRIC_DIRECTIONS,
  ClinicalMetricDirectionSchema,
  ClinicalMetricKeySchema,
  ClinicalMetricDefinitionSchema,
  ClinicalMetricRegistrySchema,
  CLINICAL_MODIFIER_LOGIC,
  CLINICAL_MODIFIER_LOGIC_LABELS,
  CLINICAL_MODIFIER_LOGIC_TYPES,
  ClinicalModifierConditionsSchema,
  ClinicalModifierLogicSchema,
  ClinicalBaseRangeSchema,
  ClinicalHardLimitsSchema,
  ClinicalOptimalRangeSchema,
  ClinicalPanelComponentSchema,
  ClinicalPopulationModifierSchema,
  ClinicalUnitVariantSchema,
  CLINICAL_PREGNANCY_STATUS,
  CLINICAL_PREGNANCY_STATUS_LABELS,
  CLINICAL_PREGNANCY_STATUSES,
  ClinicalPregnancyStatusSchema,
  CLINICAL_SEX,
  CLINICAL_SEXES,
  ClinicalSexSchema,
  CLINICAL_VALUE_TYPE,
  CLINICAL_VALUE_TYPE_LABELS,
  CLINICAL_VALUE_TYPES,
  ClinicalValueTypeSchema,
  isClinicalAgeBracket,
  isClinicalMetricCategory,
  isClinicalMetricDirection,
  isClinicalMetricKey,
  isClinicalModifierLogic,
  isClinicalPregnancyStatus,
  isClinicalSex,
  isClinicalValueType,
  parseClinicalMetricDefinition,
  safeParseClinicalMetricRegistry,
} from '../domain/clinical-registry.schema';

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Minimal valid ClinicalMetricDefinition suitable as a test baseline.
 * All required fields filled; optional fields omitted.
 */
function validMetricDefinition(overrides: Record<string, unknown> = {}) {
  return {
    key: 'glucoseFasting',
    displayName: 'Fasting Glucose',
    category: 'metabolic' as const,
    direction: 'lower_better' as const,
    valueType: 'numeric' as const,
    unit: 'mg/dL',
    baseRange: { min: 70, max: 99 },
    ...overrides,
  };
}

/**
 * Minimal valid registry entry for a single metric.
 */
function validRegistry(extraMetrics: Record<string, unknown> = {}) {
  return {
    version: '1.0.0',
    lastUpdated: '2024-06-15T00:00:00+00:00',
    metrics: {
      glucoseFasting: validMetricDefinition(),
      ...extraMetrics,
    },
  };
}

// ============================================================================
// CLINICAL METRIC CATEGORIES
// ============================================================================

describe('Clinical Registry Schema Domain Contracts', () => {
  describe('CLINICAL_METRIC_CATEGORIES', () => {
    it('should contain exactly 8 categories', () => {
      expect(CLINICAL_METRIC_CATEGORIES).toHaveLength(8);
    });

    it('should contain all expected categories', () => {
      expect(CLINICAL_METRIC_CATEGORIES).toContain('body_composition');
      expect(CLINICAL_METRIC_CATEGORIES).toContain('cardiovascular');
      expect(CLINICAL_METRIC_CATEGORIES).toContain('metabolic');
      expect(CLINICAL_METRIC_CATEGORIES).toContain('hormonal');
      expect(CLINICAL_METRIC_CATEGORIES).toContain('performance');
      expect(CLINICAL_METRIC_CATEGORIES).toContain('hematology');
      expect(CLINICAL_METRIC_CATEGORIES).toContain('inflammatory');
      expect(CLINICAL_METRIC_CATEGORIES).toContain('nutritional');
    });

    it.each(CLINICAL_METRIC_CATEGORIES)('ClinicalMetricCategorySchema should accept: %s', (value) => {
      expect(ClinicalMetricCategorySchema.safeParse(value).success).toBe(true);
    });

    it('ClinicalMetricCategorySchema should reject invalid values', () => {
      expect(ClinicalMetricCategorySchema.safeParse('METABOLIC').success).toBe(false);
      expect(ClinicalMetricCategorySchema.safeParse('lab').success).toBe(false);
      expect(ClinicalMetricCategorySchema.safeParse('').success).toBe(false);
    });

    it('should have constants for all categories', () => {
      expect(CLINICAL_METRIC_CATEGORY.BODY_COMPOSITION).toBe('body_composition');
      expect(CLINICAL_METRIC_CATEGORY.CARDIOVASCULAR).toBe('cardiovascular');
      expect(CLINICAL_METRIC_CATEGORY.METABOLIC).toBe('metabolic');
      expect(CLINICAL_METRIC_CATEGORY.HORMONAL).toBe('hormonal');
      expect(CLINICAL_METRIC_CATEGORY.PERFORMANCE).toBe('performance');
      expect(CLINICAL_METRIC_CATEGORY.HEMATOLOGY).toBe('hematology');
      expect(CLINICAL_METRIC_CATEGORY.INFLAMMATORY).toBe('inflammatory');
      expect(CLINICAL_METRIC_CATEGORY.NUTRITIONAL).toBe('nutritional');
    });

    it('should have labels for all categories', () => {
      for (const cat of CLINICAL_METRIC_CATEGORIES) {
        expect(CLINICAL_METRIC_CATEGORY_LABELS[cat]).toBeDefined();
        expect(CLINICAL_METRIC_CATEGORY_LABELS[cat].length).toBeGreaterThan(0);
      }
    });

    describe('isClinicalMetricCategory type guard', () => {
      it.each(CLINICAL_METRIC_CATEGORIES)('should return true for: %s', (value) => {
        expect(isClinicalMetricCategory(value)).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isClinicalMetricCategory('METABOLIC')).toBe(false);
        expect(isClinicalMetricCategory('')).toBe(false);
      });
    });
  });

  // ============================================================================
  // CLINICAL METRIC DIRECTIONS
  // ============================================================================

  describe('CLINICAL_METRIC_DIRECTIONS', () => {
    it('should contain exactly 3 directions', () => {
      expect(CLINICAL_METRIC_DIRECTIONS).toHaveLength(3);
    });

    it('should contain lower_better, higher_better, target_range', () => {
      expect(CLINICAL_METRIC_DIRECTIONS).toContain('lower_better');
      expect(CLINICAL_METRIC_DIRECTIONS).toContain('higher_better');
      expect(CLINICAL_METRIC_DIRECTIONS).toContain('target_range');
    });

    it.each(CLINICAL_METRIC_DIRECTIONS)('ClinicalMetricDirectionSchema should accept: %s', (value) => {
      expect(ClinicalMetricDirectionSchema.safeParse(value).success).toBe(true);
    });

    it('ClinicalMetricDirectionSchema should reject invalid values', () => {
      expect(ClinicalMetricDirectionSchema.safeParse('LOWER_BETTER').success).toBe(false);
      expect(ClinicalMetricDirectionSchema.safeParse('higher').success).toBe(false);
    });

    it('should have constants matching directions', () => {
      expect(CLINICAL_METRIC_DIRECTION.LOWER_BETTER).toBe('lower_better');
      expect(CLINICAL_METRIC_DIRECTION.HIGHER_BETTER).toBe('higher_better');
      expect(CLINICAL_METRIC_DIRECTION.TARGET_RANGE).toBe('target_range');
    });

    it('should have labels for all directions', () => {
      for (const dir of CLINICAL_METRIC_DIRECTIONS) {
        expect(CLINICAL_METRIC_DIRECTION_LABELS[dir]).toBeDefined();
        expect(CLINICAL_METRIC_DIRECTION_LABELS[dir].length).toBeGreaterThan(0);
      }
    });

    describe('isClinicalMetricDirection type guard', () => {
      it.each(CLINICAL_METRIC_DIRECTIONS)('should return true for: %s', (value) => {
        expect(isClinicalMetricDirection(value)).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isClinicalMetricDirection('neutral')).toBe(false);
      });
    });
  });

  // ============================================================================
  // CLINICAL VALUE TYPES
  // ============================================================================

  describe('CLINICAL_VALUE_TYPES', () => {
    it('should contain exactly 4 value types', () => {
      expect(CLINICAL_VALUE_TYPES).toHaveLength(4);
    });

    it('should contain numeric, ratio, qualitative, calculated', () => {
      expect(CLINICAL_VALUE_TYPES).toContain('numeric');
      expect(CLINICAL_VALUE_TYPES).toContain('ratio');
      expect(CLINICAL_VALUE_TYPES).toContain('qualitative');
      expect(CLINICAL_VALUE_TYPES).toContain('calculated');
    });

    it.each(CLINICAL_VALUE_TYPES)('ClinicalValueTypeSchema should accept: %s', (value) => {
      expect(ClinicalValueTypeSchema.safeParse(value).success).toBe(true);
    });

    it('should have constants matching value types', () => {
      expect(CLINICAL_VALUE_TYPE.NUMERIC).toBe('numeric');
      expect(CLINICAL_VALUE_TYPE.RATIO).toBe('ratio');
      expect(CLINICAL_VALUE_TYPE.QUALITATIVE).toBe('qualitative');
      expect(CLINICAL_VALUE_TYPE.CALCULATED).toBe('calculated');
    });

    it('should have labels for all value types', () => {
      for (const type of CLINICAL_VALUE_TYPES) {
        expect(CLINICAL_VALUE_TYPE_LABELS[type]).toBeDefined();
        expect(CLINICAL_VALUE_TYPE_LABELS[type].length).toBeGreaterThan(0);
      }
    });

    describe('isClinicalValueType type guard', () => {
      it.each(CLINICAL_VALUE_TYPES)('should return true for: %s', (value) => {
        expect(isClinicalValueType(value)).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isClinicalValueType('NUMERIC')).toBe(false);
        expect(isClinicalValueType('integer')).toBe(false);
      });
    });
  });

  // ============================================================================
  // CLINICAL AGE BRACKETS
  // ============================================================================

  describe('CLINICAL_AGE_BRACKETS', () => {
    it('should contain exactly 6 age brackets', () => {
      expect(CLINICAL_AGE_BRACKETS).toHaveLength(6);
    });

    it('should contain all expected brackets', () => {
      expect(CLINICAL_AGE_BRACKETS).toContain('pediatric');
      expect(CLINICAL_AGE_BRACKETS).toContain('18-29');
      expect(CLINICAL_AGE_BRACKETS).toContain('30-39');
      expect(CLINICAL_AGE_BRACKETS).toContain('40-49');
      expect(CLINICAL_AGE_BRACKETS).toContain('50-59');
      expect(CLINICAL_AGE_BRACKETS).toContain('60+');
    });

    it.each(CLINICAL_AGE_BRACKETS)('ClinicalAgeBracketSchema should accept: %s', (value) => {
      expect(ClinicalAgeBracketSchema.safeParse(value).success).toBe(true);
    });

    it('ClinicalAgeBracketSchema should reject invalid values', () => {
      expect(ClinicalAgeBracketSchema.safeParse('adult').success).toBe(false);
      expect(ClinicalAgeBracketSchema.safeParse('PEDIATRIC').success).toBe(false);
    });

    it('should have constants matching brackets', () => {
      expect(CLINICAL_AGE_BRACKET.PEDIATRIC).toBe('pediatric');
      expect(CLINICAL_AGE_BRACKET.YOUNG_ADULT).toBe('18-29');
      expect(CLINICAL_AGE_BRACKET.THIRTIES).toBe('30-39');
      expect(CLINICAL_AGE_BRACKET.FORTIES).toBe('40-49');
      expect(CLINICAL_AGE_BRACKET.FIFTIES).toBe('50-59');
      expect(CLINICAL_AGE_BRACKET.SENIORS).toBe('60+');
    });

    it('should have labels for all age brackets', () => {
      for (const bracket of CLINICAL_AGE_BRACKETS) {
        expect(CLINICAL_AGE_BRACKET_LABELS[bracket]).toBeDefined();
        expect(CLINICAL_AGE_BRACKET_LABELS[bracket].length).toBeGreaterThan(0);
      }
    });

    describe('isClinicalAgeBracket type guard', () => {
      it.each(CLINICAL_AGE_BRACKETS)('should return true for: %s', (value) => {
        expect(isClinicalAgeBracket(value)).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isClinicalAgeBracket('senior')).toBe(false);
        expect(isClinicalAgeBracket('20-30')).toBe(false);
      });
    });
  });

  // ============================================================================
  // CLINICAL SEXES
  // ============================================================================

  describe('CLINICAL_SEXES', () => {
    it('should contain exactly 2 sexes', () => {
      expect(CLINICAL_SEXES).toHaveLength(2);
    });

    it('should contain male and female', () => {
      expect(CLINICAL_SEXES).toContain('male');
      expect(CLINICAL_SEXES).toContain('female');
    });

    it.each(CLINICAL_SEXES)('ClinicalSexSchema should accept: %s', (value) => {
      expect(ClinicalSexSchema.safeParse(value).success).toBe(true);
    });

    it('ClinicalSexSchema should reject invalid values', () => {
      expect(ClinicalSexSchema.safeParse('MALE').success).toBe(false);
      expect(ClinicalSexSchema.safeParse('any').success).toBe(false);
      expect(ClinicalSexSchema.safeParse('').success).toBe(false);
    });

    it('should have constants matching sexes', () => {
      expect(CLINICAL_SEX.MALE).toBe('male');
      expect(CLINICAL_SEX.FEMALE).toBe('female');
    });

    describe('isClinicalSex type guard', () => {
      it.each(CLINICAL_SEXES)('should return true for: %s', (value) => {
        expect(isClinicalSex(value)).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isClinicalSex('other')).toBe(false);
        expect(isClinicalSex('')).toBe(false);
      });
    });
  });

  // ============================================================================
  // CLINICAL PREGNANCY STATUSES
  // ============================================================================

  describe('CLINICAL_PREGNANCY_STATUSES', () => {
    it('should contain exactly 5 statuses', () => {
      expect(CLINICAL_PREGNANCY_STATUSES).toHaveLength(5);
    });

    it('should contain all expected statuses', () => {
      expect(CLINICAL_PREGNANCY_STATUSES).toContain('not_pregnant');
      expect(CLINICAL_PREGNANCY_STATUSES).toContain('trimester_1');
      expect(CLINICAL_PREGNANCY_STATUSES).toContain('trimester_2');
      expect(CLINICAL_PREGNANCY_STATUSES).toContain('trimester_3');
      expect(CLINICAL_PREGNANCY_STATUSES).toContain('postpartum');
    });

    it.each(CLINICAL_PREGNANCY_STATUSES)('ClinicalPregnancyStatusSchema should accept: %s', (value) => {
      expect(ClinicalPregnancyStatusSchema.safeParse(value).success).toBe(true);
    });

    it('should have constants matching statuses', () => {
      expect(CLINICAL_PREGNANCY_STATUS.NOT_PREGNANT).toBe('not_pregnant');
      expect(CLINICAL_PREGNANCY_STATUS.TRIMESTER_1).toBe('trimester_1');
      expect(CLINICAL_PREGNANCY_STATUS.TRIMESTER_2).toBe('trimester_2');
      expect(CLINICAL_PREGNANCY_STATUS.TRIMESTER_3).toBe('trimester_3');
      expect(CLINICAL_PREGNANCY_STATUS.POSTPARTUM).toBe('postpartum');
    });

    it('should have labels for all statuses', () => {
      for (const status of CLINICAL_PREGNANCY_STATUSES) {
        expect(CLINICAL_PREGNANCY_STATUS_LABELS[status]).toBeDefined();
        expect(CLINICAL_PREGNANCY_STATUS_LABELS[status].length).toBeGreaterThan(0);
      }
    });

    describe('isClinicalPregnancyStatus type guard', () => {
      it.each(CLINICAL_PREGNANCY_STATUSES)('should return true for: %s', (value) => {
        expect(isClinicalPregnancyStatus(value)).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isClinicalPregnancyStatus('pregnant')).toBe(false);
        expect(isClinicalPregnancyStatus('POSTPARTUM')).toBe(false);
      });
    });
  });

  // ============================================================================
  // CLINICAL MODIFIER LOGIC TYPES
  // ============================================================================

  describe('CLINICAL_MODIFIER_LOGIC_TYPES', () => {
    it('should contain exactly 3 logic types', () => {
      expect(CLINICAL_MODIFIER_LOGIC_TYPES).toHaveLength(3);
    });

    it('should contain override, offset, multiplier', () => {
      expect(CLINICAL_MODIFIER_LOGIC_TYPES).toContain('override');
      expect(CLINICAL_MODIFIER_LOGIC_TYPES).toContain('offset');
      expect(CLINICAL_MODIFIER_LOGIC_TYPES).toContain('multiplier');
    });

    it.each(CLINICAL_MODIFIER_LOGIC_TYPES)('ClinicalModifierLogicSchema should accept: %s', (value) => {
      expect(ClinicalModifierLogicSchema.safeParse(value).success).toBe(true);
    });

    it('should have constants matching logic types', () => {
      expect(CLINICAL_MODIFIER_LOGIC.OVERRIDE).toBe('override');
      expect(CLINICAL_MODIFIER_LOGIC.OFFSET).toBe('offset');
      expect(CLINICAL_MODIFIER_LOGIC.MULTIPLIER).toBe('multiplier');
    });

    it('should have labels for all logic types', () => {
      for (const logicType of CLINICAL_MODIFIER_LOGIC_TYPES) {
        expect(CLINICAL_MODIFIER_LOGIC_LABELS[logicType]).toBeDefined();
        expect(CLINICAL_MODIFIER_LOGIC_LABELS[logicType].length).toBeGreaterThan(0);
      }
    });

    describe('isClinicalModifierLogic type guard', () => {
      it.each(CLINICAL_MODIFIER_LOGIC_TYPES)('should return true for: %s', (value) => {
        expect(isClinicalModifierLogic(value)).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isClinicalModifierLogic('OVERRIDE')).toBe(false);
        expect(isClinicalModifierLogic('replace')).toBe(false);
      });
    });
  });

  // ============================================================================
  // ClinicalMetricKeySchema
  // ============================================================================

  describe('ClinicalMetricKeySchema', () => {
    it('should accept valid camelCase keys', () => {
      expect(ClinicalMetricKeySchema.safeParse('glucoseFasting').success).toBe(true);
      expect(ClinicalMetricKeySchema.safeParse('ldlCholesterol').success).toBe(true);
      expect(ClinicalMetricKeySchema.safeParse('hbA1c').success).toBe(true);
      expect(ClinicalMetricKeySchema.safeParse('totalCholesterol').success).toBe(true);
      expect(ClinicalMetricKeySchema.safeParse('a').success).toBe(true);
    });

    it('should reject PascalCase', () => {
      expect(ClinicalMetricKeySchema.safeParse('GlucoseFasting').success).toBe(false);
    });

    it('should reject snake_case', () => {
      expect(ClinicalMetricKeySchema.safeParse('glucose_fasting').success).toBe(false);
    });

    it('should reject kebab-case', () => {
      expect(ClinicalMetricKeySchema.safeParse('glucose-fasting').success).toBe(false);
    });

    it('should reject empty string', () => {
      expect(ClinicalMetricKeySchema.safeParse('').success).toBe(false);
    });

    it('should reject strings with spaces', () => {
      expect(ClinicalMetricKeySchema.safeParse('glucose fasting').success).toBe(false);
    });

    describe('isClinicalMetricKey type guard', () => {
      it('should return true for valid camelCase keys', () => {
        expect(isClinicalMetricKey('glucoseFasting')).toBe(true);
        expect(isClinicalMetricKey('hbA1c')).toBe(true);
      });

      it('should return false for invalid keys', () => {
        expect(isClinicalMetricKey('GlucoseFasting')).toBe(false);
        expect(isClinicalMetricKey('glucose_fasting')).toBe(false);
        expect(isClinicalMetricKey('')).toBe(false);
      });
    });
  });

  // ============================================================================
  // ClinicalUnitVariantSchema
  // ============================================================================

  describe('ClinicalUnitVariantSchema', () => {
    it('should accept a minimal unit variant', () => {
      expect(ClinicalUnitVariantSchema.safeParse({ unit: 'mg/dl' }).success).toBe(true);
    });

    it('should accept with conversion factor and note', () => {
      expect(ClinicalUnitVariantSchema.safeParse({
        unit: 'mmol/L',
        conversionFactor: 18.0,
        note: 'Multiply mg/dL by 18 to get mmol/L',
      }).success).toBe(true);
    });

    it('should reject empty unit string', () => {
      expect(ClinicalUnitVariantSchema.safeParse({ unit: '' }).success).toBe(false);
    });

    it('should reject non-positive conversion factor', () => {
      expect(ClinicalUnitVariantSchema.safeParse({
        unit: 'mmol/L',
        conversionFactor: 0,
      }).success).toBe(false);

      expect(ClinicalUnitVariantSchema.safeParse({
        unit: 'mmol/L',
        conversionFactor: -1,
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // ClinicalBaseRangeSchema
  // ============================================================================

  describe('ClinicalBaseRangeSchema', () => {
    it('should accept a valid base range', () => {
      expect(ClinicalBaseRangeSchema.safeParse({ min: 70, max: 99 }).success).toBe(true);
    });

    it('should accept negative min values (e.g., pH, temperature offsets)', () => {
      expect(ClinicalBaseRangeSchema.safeParse({ min: -10, max: 0 }).success).toBe(true);
    });

    it('should accept optional source', () => {
      expect(ClinicalBaseRangeSchema.safeParse({
        min: 70,
        max: 99,
        source: 'ADA Guidelines 2024',
      }).success).toBe(true);
    });

    it('should reject min === max (min must be strictly less than max)', () => {
      expect(ClinicalBaseRangeSchema.safeParse({ min: 99, max: 99 }).success).toBe(false);
    });

    it('should reject min > max', () => {
      expect(ClinicalBaseRangeSchema.safeParse({ min: 100, max: 70 }).success).toBe(false);
    });

    it('should reject missing min or max', () => {
      expect(ClinicalBaseRangeSchema.safeParse({ min: 70 }).success).toBe(false);
      expect(ClinicalBaseRangeSchema.safeParse({ max: 99 }).success).toBe(false);
    });
  });

  // ============================================================================
  // ClinicalOptimalRangeSchema
  // ============================================================================

  describe('ClinicalOptimalRangeSchema', () => {
    it('should accept a range with both min and max', () => {
      expect(ClinicalOptimalRangeSchema.safeParse({ min: 75, max: 85 }).success).toBe(true);
    });

    it('should accept min-only (higher is optimal — no upper bound)', () => {
      expect(ClinicalOptimalRangeSchema.safeParse({ min: 60 }).success).toBe(true);
    });

    it('should accept max-only (lower is optimal — no lower bound)', () => {
      expect(ClinicalOptimalRangeSchema.safeParse({ max: 100 }).success).toBe(true);
    });

    it('should reject when both min and max are absent', () => {
      expect(ClinicalOptimalRangeSchema.safeParse({}).success).toBe(false);
    });

    it('should reject when min >= max (both defined)', () => {
      expect(ClinicalOptimalRangeSchema.safeParse({ min: 85, max: 75 }).success).toBe(false);
      expect(ClinicalOptimalRangeSchema.safeParse({ min: 75, max: 75 }).success).toBe(false);
    });
  });

  // ============================================================================
  // ClinicalHardLimitsSchema
  // ============================================================================

  describe('ClinicalHardLimitsSchema', () => {
    it('should accept valid hard limits', () => {
      expect(ClinicalHardLimitsSchema.safeParse({ min: 0, max: 500 }).success).toBe(true);
    });

    it('should accept optional rationale', () => {
      expect(ClinicalHardLimitsSchema.safeParse({
        min: 0,
        max: 500,
        rationale: 'Values above 500 mg/dL represent severe hyperglycemia requiring immediate intervention.',
      }).success).toBe(true);
    });

    it('should reject min >= max', () => {
      expect(ClinicalHardLimitsSchema.safeParse({ min: 500, max: 0 }).success).toBe(false);
      expect(ClinicalHardLimitsSchema.safeParse({ min: 100, max: 100 }).success).toBe(false);
    });
  });

  // ============================================================================
  // ClinicalModifierConditionsSchema
  // ============================================================================

  describe('ClinicalModifierConditionsSchema', () => {
    it('should accept empty conditions (all optional)', () => {
      expect(ClinicalModifierConditionsSchema.safeParse({}).success).toBe(true);
    });

    it('should accept sex-only condition', () => {
      expect(ClinicalModifierConditionsSchema.safeParse({ sex: 'female' }).success).toBe(true);
    });

    it('should accept fully specified conditions', () => {
      expect(ClinicalModifierConditionsSchema.safeParse({
        sex: 'female',
        ageBracket: '18-29',
        pregnancyStatus: 'trimester_1',
      }).success).toBe(true);
    });

    it('should reject invalid sex value', () => {
      expect(ClinicalModifierConditionsSchema.safeParse({ sex: 'FEMALE' }).success).toBe(false);
    });
  });

  // ============================================================================
  // ClinicalPopulationModifierSchema
  // ============================================================================

  describe('ClinicalPopulationModifierSchema', () => {
    it('should accept a valid population modifier', () => {
      expect(ClinicalPopulationModifierSchema.safeParse({
        conditions: { sex: 'female' },
        logic: 'offset',
        min: -5,
        max: -5,
        source: 'ADA 2024',
        priority: 1,
      }).success).toBe(true);
    });

    it('should accept a modifier with override logic', () => {
      expect(ClinicalPopulationModifierSchema.safeParse({
        conditions: { sex: 'female', pregnancyStatus: 'trimester_1' },
        logic: 'override',
        min: 60,
        max: 90,
        priority: 2,
      }).success).toBe(true);
    });

    it('should reject non-positive priority', () => {
      expect(ClinicalPopulationModifierSchema.safeParse({
        conditions: {},
        logic: 'override',
        priority: 0,
      }).success).toBe(false);
    });

    it('should reject invalid logic type', () => {
      expect(ClinicalPopulationModifierSchema.safeParse({
        conditions: {},
        logic: 'replace',
        priority: 1,
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // ClinicalPanelComponentSchema
  // ============================================================================

  describe('ClinicalPanelComponentSchema', () => {
    it('should accept a valid panel component', () => {
      expect(ClinicalPanelComponentSchema.safeParse({
        metricKey: 'ldlCholesterol',
      }).success).toBe(true);
    });

    it('should apply default required=true when omitted', () => {
      const result = ClinicalPanelComponentSchema.safeParse({
        metricKey: 'hdlCholesterol',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.required).toBe(true);
      }
    });

    it('should accept optional display order', () => {
      expect(ClinicalPanelComponentSchema.safeParse({
        metricKey: 'triglycerides',
        required: false,
        order: 3,
      }).success).toBe(true);
    });

    it('should reject invalid metric key (PascalCase)', () => {
      expect(ClinicalPanelComponentSchema.safeParse({
        metricKey: 'LdlCholesterol',
      }).success).toBe(false);
    });

    it('should reject negative order', () => {
      expect(ClinicalPanelComponentSchema.safeParse({
        metricKey: 'totalCholesterol',
        order: -1,
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // ClinicalMetricDefinitionSchema
  // ============================================================================

  describe('ClinicalMetricDefinitionSchema', () => {
    it('should accept a minimal valid definition', () => {
      expect(ClinicalMetricDefinitionSchema.safeParse(validMetricDefinition()).success).toBe(true);
    });

    it('should accept a fully populated definition', () => {
      const result = ClinicalMetricDefinitionSchema.safeParse({
        ...validMetricDefinition(),
        description: 'Fasting blood glucose level measured after 8-hour fast.',
        tags: ['diabetes', 'glucose', 'metabolic'],
        sortOrder: 10,
        unitVariants: [{ unit: 'mmol/L', conversionFactor: 0.0555 }],
        optimalRange: { min: 72, max: 92 },
        hardLimits: { min: 0, max: 500, rationale: 'Safety bounds' },
        modifiers: [{
          conditions: { sex: 'female', pregnancyStatus: 'trimester_1' },
          logic: 'offset',
          max: -5,
          priority: 1,
        }],
        requiresVerification: true,
        isPregnancySensitive: true,
        addedVersion: '1.0.0',
      });
      expect(result.success).toBe(true);
    });

    it('should apply default tags = [] when omitted', () => {
      const result = ClinicalMetricDefinitionSchema.safeParse(validMetricDefinition());
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tags).toEqual([]);
      }
    });

    it('should reject when hardLimits.min > baseRange.min', () => {
      expect(ClinicalMetricDefinitionSchema.safeParse({
        ...validMetricDefinition(),
        baseRange: { min: 70, max: 99 },
        hardLimits: { min: 75, max: 500 }, // hardLimits.min (75) > baseRange.min (70) — invalid
      }).success).toBe(false);
    });

    it('should reject when hardLimits.max < baseRange.max', () => {
      expect(ClinicalMetricDefinitionSchema.safeParse({
        ...validMetricDefinition(),
        baseRange: { min: 70, max: 99 },
        hardLimits: { min: 0, max: 95 }, // hardLimits.max (95) < baseRange.max (99) — invalid
      }).success).toBe(false);
    });

    it('should accept when hardLimits contains baseRange', () => {
      expect(ClinicalMetricDefinitionSchema.safeParse({
        ...validMetricDefinition(),
        baseRange: { min: 70, max: 99 },
        hardLimits: { min: 0, max: 500 }, // 0 <= 70 and 500 >= 99 — valid
      }).success).toBe(true);
    });

    it('should reject when optimalRange.min is below baseRange.min', () => {
      expect(ClinicalMetricDefinitionSchema.safeParse({
        ...validMetricDefinition(),
        baseRange: { min: 70, max: 99 },
        optimalRange: { min: 60 }, // 60 < 70 — invalid
      }).success).toBe(false);
    });

    it('should reject when optimalRange.max is above baseRange.max', () => {
      expect(ClinicalMetricDefinitionSchema.safeParse({
        ...validMetricDefinition(),
        baseRange: { min: 70, max: 99 },
        optimalRange: { max: 110 }, // 110 > 99 — invalid
      }).success).toBe(false);
    });

    it('should accept optimalRange within baseRange', () => {
      expect(ClinicalMetricDefinitionSchema.safeParse({
        ...validMetricDefinition(),
        baseRange: { min: 70, max: 99 },
        optimalRange: { min: 72, max: 90 },
      }).success).toBe(true);
    });

    it('should reject isDeprecated=true without deprecatedReason', () => {
      expect(ClinicalMetricDefinitionSchema.safeParse({
        ...validMetricDefinition(),
        isDeprecated: true,
        // no deprecatedReason
      }).success).toBe(false);
    });

    it('should accept isDeprecated=true with deprecatedReason', () => {
      // The schema only requires deprecatedReason when isDeprecated=true.
      // Whether a replacedBy key actually exists in the registry is validated at the registry level.
      expect(ClinicalMetricDefinitionSchema.safeParse({
        ...validMetricDefinition(),
        isDeprecated: true,
        deprecatedReason: 'Use glucoseFastingV2 instead.',
      }).success).toBe(true);
    });

    it('should accept isDeprecated=true with replacedBy (registry-level cross-reference not validated here)', () => {
      // replacedBy is an optional field; its referential integrity is a registry-level concern,
      // not enforced by ClinicalMetricDefinitionSchema itself.
      expect(ClinicalMetricDefinitionSchema.safeParse({
        ...validMetricDefinition(),
        isDeprecated: true,
        deprecatedReason: 'Replaced by glucoseFastingV2 with updated reference ranges.',
        replacedBy: 'glucoseFastingV2',
      }).success).toBe(true);
    });

    it('should reject invalid category', () => {
      expect(ClinicalMetricDefinitionSchema.safeParse({
        ...validMetricDefinition(),
        category: 'METABOLIC',
      }).success).toBe(false);
    });

    it('should reject invalid camelCase key', () => {
      expect(ClinicalMetricDefinitionSchema.safeParse({
        ...validMetricDefinition(),
        key: 'Glucose_Fasting',
      }).success).toBe(false);
    });

    it('should reject missing unit', () => {
      const { unit: _u, ...rest } = validMetricDefinition();
      expect(ClinicalMetricDefinitionSchema.safeParse(rest).success).toBe(false);
    });

    it('should reject missing baseRange', () => {
      const { baseRange: _b, ...rest } = validMetricDefinition();
      expect(ClinicalMetricDefinitionSchema.safeParse(rest).success).toBe(false);
    });
  });

  // ============================================================================
  // ClinicalMetricRegistrySchema
  // ============================================================================

  describe('ClinicalMetricRegistrySchema', () => {
    it('should accept a valid minimal registry', () => {
      expect(ClinicalMetricRegistrySchema.safeParse(validRegistry()).success).toBe(true);
    });

    it('should accept a registry with multiple metrics', () => {
      const result = ClinicalMetricRegistrySchema.safeParse(validRegistry({
        hdlCholesterol: {
          ...validMetricDefinition(),
          key: 'hdlCholesterol',
          displayName: 'HDL Cholesterol',
          direction: 'higher_better',
          unit: 'mg/dL',
          baseRange: { min: 40, max: 200 },
        },
      }));
      expect(result.success).toBe(true);
    });

    it('should reject when record key does not match definition key', () => {
      const result = ClinicalMetricRegistrySchema.safeParse({
        ...validRegistry(),
        metrics: {
          wrongKey: validMetricDefinition(), // record key 'wrongKey' != definition key 'glucoseFasting'
        },
      });
      expect(result.success).toBe(false);
    });

    it('should reject duplicate modifier conditions within a metric', () => {
      const duplicateModifier = {
        conditions: { sex: 'female' as const },
        logic: 'offset' as const,
        max: -5,
        priority: 1,
      };
      const result = ClinicalMetricRegistrySchema.safeParse({
        ...validRegistry(),
        metrics: {
          glucoseFasting: {
            ...validMetricDefinition(),
            modifiers: [
              duplicateModifier,
              { ...duplicateModifier, priority: 2 }, // same conditions (sex: female), different priority
            ],
          },
        },
      });
      expect(result.success).toBe(false);
    });

    it('should accept two modifiers with different conditions', () => {
      const result = ClinicalMetricRegistrySchema.safeParse({
        ...validRegistry(),
        metrics: {
          glucoseFasting: {
            ...validMetricDefinition(),
            modifiers: [
              { conditions: { sex: 'female' as const }, logic: 'offset' as const, max: -5, priority: 1 },
              { conditions: { sex: 'male' as const }, logic: 'offset' as const, max: 5, priority: 2 },
            ],
          },
        },
      });
      expect(result.success).toBe(true);
    });

    it('should reject a panel component that references a non-existent metric', () => {
      const result = ClinicalMetricRegistrySchema.safeParse({
        ...validRegistry(),
        metrics: {
          lipidPanel: {
            ...validMetricDefinition(),
            key: 'lipidPanel',
            displayName: 'Lipid Panel',
            unit: 'panel',
            baseRange: { min: 0, max: 1 },
            panelComponents: [
              { metricKey: 'ldlCholesterol' }, // ldlCholesterol not in this registry
            ],
          },
        },
      });
      expect(result.success).toBe(false);
    });

    it('should accept a panel component that references an existing metric', () => {
      const result = ClinicalMetricRegistrySchema.safeParse({
        version: '1.0.0',
        lastUpdated: '2024-06-15T00:00:00+00:00',
        metrics: {
          ldlCholesterol: {
            ...validMetricDefinition(),
            key: 'ldlCholesterol',
            displayName: 'LDL Cholesterol',
            unit: 'mg/dL',
            baseRange: { min: 0, max: 129 },
          },
          lipidPanel: {
            ...validMetricDefinition(),
            key: 'lipidPanel',
            displayName: 'Lipid Panel',
            unit: 'panel',
            baseRange: { min: 0, max: 1 },
            panelComponents: [
              { metricKey: 'ldlCholesterol' }, // now exists in the registry
            ],
          },
        },
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid semver version', () => {
      expect(ClinicalMetricRegistrySchema.safeParse({
        ...validRegistry(),
        version: 'v1.0',
      }).success).toBe(false);
    });

    it('should reject missing lastUpdated', () => {
      const { lastUpdated: _l, ...rest } = validRegistry();
      expect(ClinicalMetricRegistrySchema.safeParse(rest).success).toBe(false);
    });
  });

  // ============================================================================
  // PARSE HELPERS
  // ============================================================================

  describe('parseClinicalMetricDefinition', () => {
    it('should return a parsed definition for valid input', () => {
      const result = parseClinicalMetricDefinition(validMetricDefinition());
      expect(result.key).toBe('glucoseFasting');
      expect(result.displayName).toBe('Fasting Glucose');
    });

    it('should throw a ZodError for invalid input', () => {
      expect(() => parseClinicalMetricDefinition({ key: 'BadKey' })).toThrow();
    });
  });

  describe('safeParseClinicalMetricRegistry', () => {
    it('should return success=true for valid registry', () => {
      const result = safeParseClinicalMetricRegistry(validRegistry());
      expect(result.success).toBe(true);
    });

    it('should return success=false for invalid registry', () => {
      const result = safeParseClinicalMetricRegistry({ version: 'bad', lastUpdated: 'bad', metrics: {} });
      expect(result.success).toBe(false);
    });
  });
});
