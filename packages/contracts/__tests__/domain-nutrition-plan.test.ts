/**
 * @ai-context Nutrition Plan Domain Contracts Tests
 *
 * This test suite verifies:
 * 1. lifestyleGoalsSchema: nullable/optional JSON column
 * 2. NutritionPlanSchema: full plan with optional fields
 * 3. NutritionTargetsSchema: macro targets with optionals
 * 4. DetailedNutritionSchema: vitamins, minerals extension
 * 5. NutritionProgressSchema: progress tracking
 * 6. calculateNutritionProgress: utility function
 * 7. DEFAULT_NUTRITION_TARGETS constant
 * 8. nutritionPlanDaySchema: daily plan structure
 *
 * Run: npx jest shared/contracts/__tests__/domain-nutrition-plan.test.ts
 */

import {
  calculateNutritionProgress,
  DailyNutritionTargetSchema,
  DEFAULT_NUTRITION_TARGETS,
  DetailedNutritionSchema,
  lifestyleGoalsSchema,
  NutritionPlanSchema,
  NutritionProgressSchema,
  NutritionTargetsSchema,
  nutritionPlanDaySchema,
} from '../domain/nutrition-plan';

// ============================================================================
// HELPERS
// ============================================================================

const NOW_ISO = new Date().toISOString();
const TODAY = '2024-06-15';

function validNutritionPlan() {
  return {
    id: 'plan-123',
    userId: 'user-456',
    startDate: TODAY,
    targetCalories: 2200,
    targetProtein: 165,
    targetCarbs: 275,
    targetFats: 73,
  };
}

function validNutritionTargets() {
  return {
    calories: 2200,
    protein: 165,
    carbs: 275,
    fat: 73,
  };
}

// ============================================================================
// LIFESTYLE GOALS
// ============================================================================

describe('Nutrition Plan Domain Contracts', () => {
  describe('lifestyleGoalsSchema', () => {
    it('should accept a valid lifestyle goals object', () => {
      expect(lifestyleGoalsSchema.safeParse({
        workoutsPerWeek: 4,
        sleepHoursTarget: 8,
        weeklyWeightChangeTarget: -0.5,
      }).success).toBe(true);
    });

    it('should accept null (nullable column)', () => {
      expect(lifestyleGoalsSchema.safeParse(null).success).toBe(true);
    });

    it('should accept undefined (optional column)', () => {
      expect(lifestyleGoalsSchema.safeParse(undefined).success).toBe(true);
    });

    it('should accept empty object (all fields optional)', () => {
      expect(lifestyleGoalsSchema.safeParse({}).success).toBe(true);
    });

    it('should accept null for individual fields', () => {
      expect(lifestyleGoalsSchema.safeParse({
        workoutsPerWeek: null,
        sleepHoursTarget: null,
        weeklyWeightChangeTarget: null,
      }).success).toBe(true);
    });

    it('should reject workoutsPerWeek outside 0-14 range', () => {
      expect(lifestyleGoalsSchema.safeParse({
        workoutsPerWeek: 15,
      }).success).toBe(false);

      expect(lifestyleGoalsSchema.safeParse({
        workoutsPerWeek: -1,
      }).success).toBe(false);
    });

    it('should reject sleepHoursTarget outside 0-24 range', () => {
      expect(lifestyleGoalsSchema.safeParse({
        sleepHoursTarget: 25,
      }).success).toBe(false);
    });

    it('should reject non-integer workoutsPerWeek', () => {
      expect(lifestyleGoalsSchema.safeParse({
        workoutsPerWeek: 3.5,
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // NUTRITION PLAN DAY
  // ============================================================================

  describe('nutritionPlanDaySchema', () => {
    it('should accept a valid plan day', () => {
      const result = nutritionPlanDaySchema.safeParse({
        dayOfWeek: 1,
        label: 'Monday - Training Day',
        totalCalories: 2500,
        protein: 180,
        carbs: 300,
        fat: 80,
        meals: [
          {
            name: 'Breakfast',
            time: '07:00',
            calories: 600,
            foods: [{ name: 'Eggs', amount: '3 large' }],
          },
        ],
      });
      expect(result.success).toBe(true);
    });

    it('should accept an empty object (all optional via passthrough)', () => {
      expect(nutritionPlanDaySchema.safeParse({}).success).toBe(true);
    });

    it('should accept extra fields via passthrough', () => {
      expect(nutritionPlanDaySchema.safeParse({
        dayOfWeek: 0,
        customField: 'allowed by passthrough',
      }).success).toBe(true);
    });

    it('should reject dayOfWeek outside 0-6', () => {
      expect(nutritionPlanDaySchema.safeParse({ dayOfWeek: 7 }).success).toBe(false);
      expect(nutritionPlanDaySchema.safeParse({ dayOfWeek: -1 }).success).toBe(false);
    });

    it('should reject negative totalCalories', () => {
      expect(nutritionPlanDaySchema.safeParse({ totalCalories: -100 }).success).toBe(false);
    });
  });

  // ============================================================================
  // DAILY NUTRITION TARGET
  // ============================================================================

  describe('DailyNutritionTargetSchema', () => {
    it('should accept a valid daily target', () => {
      expect(DailyNutritionTargetSchema.safeParse({
        day: 'Monday',
        calories: 2500,
        protein: 180,
        carbs: 300,
        fats: 80,
        notes: 'Training day - higher carbs',
      }).success).toBe(true);
    });

    it('should accept minimal target (only day required)', () => {
      expect(DailyNutritionTargetSchema.safeParse({ day: 'Tuesday' }).success).toBe(true);
    });

    it('should reject negative calories', () => {
      expect(DailyNutritionTargetSchema.safeParse({
        day: 'Monday',
        calories: -100,
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // NUTRITION PLAN SCHEMA
  // ============================================================================

  describe('NutritionPlanSchema', () => {
    it('should accept a valid nutrition plan', () => {
      expect(NutritionPlanSchema.safeParse(validNutritionPlan()).success).toBe(true);
    });

    it('should accept a plan with optional fields', () => {
      const result = NutritionPlanSchema.safeParse({
        ...validNutritionPlan(),
        endDate: '2024-12-31',
        notes: 'High protein for muscle gain phase',
        dailyTargets: [{ day: 'Monday', calories: 2500 }],
        days: [{ dayOfWeek: 1 }],
        createdAt: NOW_ISO,
        updatedAt: NOW_ISO,
      });
      expect(result.success).toBe(true);
    });

    it('should accept null for nullable fields', () => {
      expect(NutritionPlanSchema.safeParse({
        ...validNutritionPlan(),
        endDate: null,
        notes: null,
        days: null,
      }).success).toBe(true);
    });

    it('should reject negative targetCalories', () => {
      expect(NutritionPlanSchema.safeParse({
        ...validNutritionPlan(),
        targetCalories: -100,
      }).success).toBe(false);
    });

    it('should reject non-integer targetProtein', () => {
      expect(NutritionPlanSchema.safeParse({
        ...validNutritionPlan(),
        targetProtein: 165.5,
      }).success).toBe(false);
    });

    it('should reject missing required fields', () => {
      expect(NutritionPlanSchema.safeParse({
        id: 'plan-123',
        userId: 'user-456',
        // missing startDate, targetCalories, etc.
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // NUTRITION TARGETS
  // ============================================================================

  describe('NutritionTargetsSchema', () => {
    it('should accept valid macro targets', () => {
      expect(NutritionTargetsSchema.safeParse(validNutritionTargets()).success).toBe(true);
    });

    it('should accept targets with optional micronutrients', () => {
      expect(NutritionTargetsSchema.safeParse({
        ...validNutritionTargets(),
        fiber: 35,
        sugar: 50,
        sodium: 2300,
        water: 2500,
      }).success).toBe(true);
    });

    it('should accept zero values for macros', () => {
      expect(NutritionTargetsSchema.safeParse({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      }).success).toBe(true);
    });

    it('should reject negative calories', () => {
      expect(NutritionTargetsSchema.safeParse({
        ...validNutritionTargets(),
        calories: -100,
      }).success).toBe(false);
    });

    it('should reject non-integer calories', () => {
      expect(NutritionTargetsSchema.safeParse({
        ...validNutritionTargets(),
        calories: 2200.5,
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // DETAILED NUTRITION SCHEMA
  // ============================================================================

  describe('DetailedNutritionSchema', () => {
    it('should accept valid base macros (vitamins/minerals optional)', () => {
      expect(DetailedNutritionSchema.safeParse(validNutritionTargets()).success).toBe(true);
    });

    it('should accept with vitamins and minerals', () => {
      const result = DetailedNutritionSchema.safeParse({
        ...validNutritionTargets(),
        vitaminA: 900,
        vitaminC: 90,
        vitaminD: 15,
        calcium: 1000,
        iron: 8,
        magnesium: 400,
      });
      expect(result.success).toBe(true);
    });

    it('should accept null for vitamin/mineral fields', () => {
      expect(DetailedNutritionSchema.safeParse({
        ...validNutritionTargets(),
        vitaminA: null,
        vitaminC: null,
        calcium: null,
      }).success).toBe(true);
    });

    it('should reject negative vitamin values', () => {
      expect(DetailedNutritionSchema.safeParse({
        ...validNutritionTargets(),
        vitaminC: -10,
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // NUTRITION PROGRESS
  // ============================================================================

  describe('NutritionProgressSchema', () => {
    it('should accept a valid progress object', () => {
      expect(NutritionProgressSchema.safeParse({
        current: 1800,
        target: 2200,
        percentage: 82,
        remaining: 400,
      }).success).toBe(true);
    });

    it('should accept 100% progress', () => {
      expect(NutritionProgressSchema.safeParse({
        current: 2200,
        target: 2200,
        percentage: 100,
        remaining: 0,
      }).success).toBe(true);
    });

    it('should reject percentage outside 0-100', () => {
      expect(NutritionProgressSchema.safeParse({
        current: 2500,
        target: 2200,
        percentage: 114,
        remaining: 0,
      }).success).toBe(false);
    });

    it('should reject negative remaining', () => {
      expect(NutritionProgressSchema.safeParse({
        current: 2500,
        target: 2200,
        percentage: 100,
        remaining: -300,
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // CALCULATE NUTRITION PROGRESS
  // ============================================================================

  describe('calculateNutritionProgress', () => {
    it('should correctly calculate percentage for partial intake', () => {
      const result = calculateNutritionProgress(1100, 2200);
      expect(result.percentage).toBe(50);
      expect(result.current).toBe(1100);
      expect(result.target).toBe(2200);
      expect(result.remaining).toBe(1100);
    });

    it('should return 100% when current meets target', () => {
      const result = calculateNutritionProgress(2200, 2200);
      expect(result.percentage).toBe(100);
      expect(result.remaining).toBe(0);
    });

    it('should cap remaining at 0 when current exceeds target', () => {
      const result = calculateNutritionProgress(2500, 2200);
      expect(result.remaining).toBe(0);
    });

    it('should handle zero target safely (uses max(1, target))', () => {
      const result = calculateNutritionProgress(0, 0);
      expect(result.target).toBe(1); // safeTarget = max(1, 0) = 1
      expect(result.percentage).toBe(0);
    });

    it('should return a valid NutritionProgress shape', () => {
      const result = calculateNutritionProgress(500, 2000);
      expect(NutritionProgressSchema.safeParse(result).success).toBe(true);
    });
  });

  // ============================================================================
  // DEFAULT NUTRITION TARGETS
  // ============================================================================

  describe('DEFAULT_NUTRITION_TARGETS', () => {
    it('should be a valid NutritionTargets object', () => {
      expect(NutritionTargetsSchema.safeParse(DEFAULT_NUTRITION_TARGETS).success).toBe(true);
    });

    it('should have sensible default macros', () => {
      expect(DEFAULT_NUTRITION_TARGETS.calories).toBeGreaterThan(1000);
      expect(DEFAULT_NUTRITION_TARGETS.protein).toBeGreaterThan(0);
      expect(DEFAULT_NUTRITION_TARGETS.carbs).toBeGreaterThan(0);
      expect(DEFAULT_NUTRITION_TARGETS.fat).toBeGreaterThan(0);
    });

    it('should have fiber, sugar, sodium, and water defaults', () => {
      expect(DEFAULT_NUTRITION_TARGETS.fiber).toBeDefined();
      expect(DEFAULT_NUTRITION_TARGETS.sugar).toBeDefined();
      expect(DEFAULT_NUTRITION_TARGETS.sodium).toBeDefined();
      expect(DEFAULT_NUTRITION_TARGETS.water).toBeDefined();
    });
  });
});
