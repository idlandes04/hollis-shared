/**
 * @ai-context Analytics Contracts Tests | validates all analytics domain contracts
 *
 * This test suite verifies:
 * 1. All exports from analytics contracts are importable
 * 2. All Zod schemas are valid and parse sample data correctly
 * 3. All type guards work correctly
 * 4. All label maps are complete (every value in tuple has a label)
 * 5. All constants objects match their tuple values
 *
 * Run: npm test -- shared/contracts/__tests__/analytics.test.ts
 */

import {
    // ChartCategory
    CHART_CATEGORIES,
    CHART_CATEGORY,
    CHART_CATEGORY_LABELS,
    CHART_TYPE,
    // ChartType
    CHART_TYPES,
    CHART_TYPE_LABELS,
    ChartCategorySchema,
    // ChartDataPoint & ChartItem
    ChartDataPointSchema,
    ChartItemSchema,
    ChartTypeSchema,
    RECOVERY_STATUS,
    // RecoveryStatus
    RECOVERY_STATUSES,
    RECOVERY_STATUS_LABELS,
    RecoveryStatusSchema,
    TIME_RANGE,
    // TimeRange
    TIME_RANGES,
    TIME_RANGE_CONFIG,
    TIME_RANGE_LABELS,
    TRAINING_RISK_LEVEL,
    // TrainingRiskLevel
    TRAINING_RISK_LEVELS,
    TRAINING_RISK_LEVEL_LABELS,
    TRAINING_STATUS,
    // TrainingStatus
    TRAINING_STATUSES,
    TRAINING_STATUS_LABELS,
    TREND_INDICATOR,
    // TrendIndicator
    TREND_INDICATORS,
    TREND_INDICATOR_LABELS,
    TimeRangeSchema,
    TrainingRiskLevelSchema,
    TrainingStatusSchema,
    TrendIndicatorSchema,
    WEIGHT_TREND,
    // WeightTrend
    WEIGHT_TRENDS,
    WEIGHT_TREND_LABELS,
    WeightTrendSchema,
    isChartCategory,
    isChartType,
    isRecoveryStatus,
    isTimeRange,
    isTrainingRiskLevel,
    isTrainingStatus,
    isTrendIndicator,
    isWeightTrend,
} from '../domain/analytics';

// ============================================================================
// TREND INDICATOR TESTS
// ============================================================================

describe('Analytics Contracts', () => {
  describe('TrendIndicator', () => {
    describe('tuple values', () => {
      it('should contain exactly 3 values', () => {
        expect(TREND_INDICATORS).toHaveLength(3);
      });

      it('should contain all expected values', () => {
        expect(TREND_INDICATORS).toContain('increasing');
        expect(TREND_INDICATORS).toContain('stable');
        expect(TREND_INDICATORS).toContain('decreasing');
      });
    });

    describe('schema validation', () => {
      it.each(TREND_INDICATORS)('should accept valid value: %s', (value) => {
        const result = TrendIndicatorSchema.safeParse(value);
        expect(result.success).toBe(true);
      });

      it('should reject invalid values', () => {
        expect(TrendIndicatorSchema.safeParse('invalid').success).toBe(false);
        expect(TrendIndicatorSchema.safeParse('').success).toBe(false);
        expect(TrendIndicatorSchema.safeParse(123).success).toBe(false);
        expect(TrendIndicatorSchema.safeParse(null).success).toBe(false);
        expect(TrendIndicatorSchema.safeParse(undefined).success).toBe(false);
      });
    });

    describe('type guard', () => {
      it.each(TREND_INDICATORS)('isTrendIndicator should return true for: %s', (value) => {
        expect(isTrendIndicator(value)).toBe(true);
      });

      it('isTrendIndicator should return false for invalid values', () => {
        expect(isTrendIndicator('invalid')).toBe(false);
        expect(isTrendIndicator('')).toBe(false);
        expect(isTrendIndicator('INCREASING')).toBe(false); // case-sensitive
      });
    });

    describe('labels map', () => {
      it('should have a label for every tuple value', () => {
        for (const value of TREND_INDICATORS) {
          expect(TREND_INDICATOR_LABELS[value]).toBeDefined();
          expect(typeof TREND_INDICATOR_LABELS[value]).toBe('string');
          expect(TREND_INDICATOR_LABELS[value].length).toBeGreaterThan(0);
        }
      });
    });

    describe('constants object', () => {
      it('should have keys that map to tuple values', () => {
        expect(TREND_INDICATOR.INCREASING).toBe('increasing');
        expect(TREND_INDICATOR.STABLE).toBe('stable');
        expect(TREND_INDICATOR.DECREASING).toBe('decreasing');
      });

      it('should have all values present in tuple', () => {
        const constantValues = Object.values(TREND_INDICATOR);
        for (const value of constantValues) {
          expect(TREND_INDICATORS).toContain(value);
        }
      });
    });
  });

  // ============================================================================
  // WEIGHT TREND TESTS
  // ============================================================================

  describe('WeightTrend', () => {
    describe('tuple values', () => {
      it('should contain exactly 3 values', () => {
        expect(WEIGHT_TRENDS).toHaveLength(3);
      });

      it('should contain all expected values', () => {
        expect(WEIGHT_TRENDS).toContain('gaining');
        expect(WEIGHT_TRENDS).toContain('stable');
        expect(WEIGHT_TRENDS).toContain('losing');
      });
    });

    describe('schema validation', () => {
      it.each(WEIGHT_TRENDS)('should accept valid value: %s', (value) => {
        const result = WeightTrendSchema.safeParse(value);
        expect(result.success).toBe(true);
      });

      it('should reject invalid values', () => {
        expect(WeightTrendSchema.safeParse('invalid').success).toBe(false);
        expect(WeightTrendSchema.safeParse('increasing').success).toBe(false); // not a weight trend
        expect(WeightTrendSchema.safeParse(null).success).toBe(false);
      });
    });

    describe('type guard', () => {
      it.each(WEIGHT_TRENDS)('isWeightTrend should return true for: %s', (value) => {
        expect(isWeightTrend(value)).toBe(true);
      });

      it('isWeightTrend should return false for invalid values', () => {
        expect(isWeightTrend('invalid')).toBe(false);
        expect(isWeightTrend('increasing')).toBe(false); // TrendIndicator, not WeightTrend
      });
    });

    describe('labels map', () => {
      it('should have a label for every tuple value', () => {
        for (const value of WEIGHT_TRENDS) {
          expect(WEIGHT_TREND_LABELS[value]).toBeDefined();
          expect(typeof WEIGHT_TREND_LABELS[value]).toBe('string');
          expect(WEIGHT_TREND_LABELS[value].length).toBeGreaterThan(0);
        }
      });
    });

    describe('constants object', () => {
      it('should have keys that map to tuple values', () => {
        expect(WEIGHT_TREND.GAINING).toBe('gaining');
        expect(WEIGHT_TREND.STABLE).toBe('stable');
        expect(WEIGHT_TREND.LOSING).toBe('losing');
      });

      it('should have all values present in tuple', () => {
        const constantValues = Object.values(WEIGHT_TREND);
        for (const value of constantValues) {
          expect(WEIGHT_TRENDS).toContain(value);
        }
      });
    });
  });

  // ============================================================================
  // TRAINING STATUS TESTS
  // ============================================================================

  describe('TrainingStatus', () => {
    describe('tuple values', () => {
      it('should contain exactly 6 values', () => {
        expect(TRAINING_STATUSES).toHaveLength(6);
      });

      it('should contain all expected values', () => {
        expect(TRAINING_STATUSES).toContain('detraining');
        expect(TRAINING_STATUSES).toContain('recovery');
        expect(TRAINING_STATUSES).toContain('maintenance');
        expect(TRAINING_STATUSES).toContain('productive');
        expect(TRAINING_STATUSES).toContain('overreaching');
        expect(TRAINING_STATUSES).toContain('overtraining');
      });
    });

    describe('schema validation', () => {
      it.each(TRAINING_STATUSES)('should accept valid value: %s', (value) => {
        const result = TrainingStatusSchema.safeParse(value);
        expect(result.success).toBe(true);
      });

      it('should reject invalid values', () => {
        expect(TrainingStatusSchema.safeParse('invalid').success).toBe(false);
        expect(TrainingStatusSchema.safeParse('training').success).toBe(false);
        expect(TrainingStatusSchema.safeParse(null).success).toBe(false);
      });
    });

    describe('type guard', () => {
      it.each(TRAINING_STATUSES)('isTrainingStatus should return true for: %s', (value) => {
        expect(isTrainingStatus(value)).toBe(true);
      });

      it('isTrainingStatus should return false for invalid values', () => {
        expect(isTrainingStatus('invalid')).toBe(false);
        expect(isTrainingStatus('')).toBe(false);
      });
    });

    describe('labels map', () => {
      it('should have a label for every tuple value', () => {
        for (const value of TRAINING_STATUSES) {
          expect(TRAINING_STATUS_LABELS[value]).toBeDefined();
          expect(typeof TRAINING_STATUS_LABELS[value]).toBe('string');
          expect(TRAINING_STATUS_LABELS[value].length).toBeGreaterThan(0);
        }
      });
    });

    describe('constants object', () => {
      it('should have keys that map to tuple values', () => {
        expect(TRAINING_STATUS.DETRAINING).toBe('detraining');
        expect(TRAINING_STATUS.RECOVERY).toBe('recovery');
        expect(TRAINING_STATUS.MAINTENANCE).toBe('maintenance');
        expect(TRAINING_STATUS.PRODUCTIVE).toBe('productive');
        expect(TRAINING_STATUS.OVERREACHING).toBe('overreaching');
        expect(TRAINING_STATUS.OVERTRAINING).toBe('overtraining');
      });

      it('should have all values present in tuple', () => {
        const constantValues = Object.values(TRAINING_STATUS);
        expect(constantValues).toHaveLength(6);
        for (const value of constantValues) {
          expect(TRAINING_STATUSES).toContain(value);
        }
      });
    });
  });

  // ============================================================================
  // RECOVERY STATUS TESTS
  // ============================================================================

  describe('RecoveryStatus', () => {
    describe('tuple values', () => {
      it('should contain exactly 5 values', () => {
        expect(RECOVERY_STATUSES).toHaveLength(5);
      });

      it('should contain all expected values', () => {
        expect(RECOVERY_STATUSES).toContain('poor');
        expect(RECOVERY_STATUSES).toContain('low');
        expect(RECOVERY_STATUSES).toContain('moderate');
        expect(RECOVERY_STATUSES).toContain('good');
        expect(RECOVERY_STATUSES).toContain('excellent');
      });

      it('should maintain order from poor to excellent', () => {
        expect(RECOVERY_STATUSES[0]).toBe('poor');
        expect(RECOVERY_STATUSES[1]).toBe('low');
        expect(RECOVERY_STATUSES[2]).toBe('moderate');
        expect(RECOVERY_STATUSES[3]).toBe('good');
        expect(RECOVERY_STATUSES[4]).toBe('excellent');
      });
    });

    describe('schema validation', () => {
      it.each(RECOVERY_STATUSES)('should accept valid value: %s', (value) => {
        const result = RecoveryStatusSchema.safeParse(value);
        expect(result.success).toBe(true);
      });

      it('should reject invalid values', () => {
        expect(RecoveryStatusSchema.safeParse('invalid').success).toBe(false);
        expect(RecoveryStatusSchema.safeParse('bad').success).toBe(false);
        expect(RecoveryStatusSchema.safeParse(null).success).toBe(false);
      });
    });

    describe('type guard', () => {
      it.each(RECOVERY_STATUSES)('isRecoveryStatus should return true for: %s', (value) => {
        expect(isRecoveryStatus(value)).toBe(true);
      });

      it('isRecoveryStatus should return false for invalid values', () => {
        expect(isRecoveryStatus('invalid')).toBe(false);
        expect(isRecoveryStatus('bad')).toBe(false);
      });
    });

    describe('labels map', () => {
      it('should have a label for every tuple value', () => {
        for (const value of RECOVERY_STATUSES) {
          expect(RECOVERY_STATUS_LABELS[value]).toBeDefined();
          expect(typeof RECOVERY_STATUS_LABELS[value]).toBe('string');
          expect(RECOVERY_STATUS_LABELS[value].length).toBeGreaterThan(0);
        }
      });
    });

    describe('constants object', () => {
      it('should have keys that map to tuple values', () => {
        expect(RECOVERY_STATUS.POOR).toBe('poor');
        expect(RECOVERY_STATUS.LOW).toBe('low');
        expect(RECOVERY_STATUS.MODERATE).toBe('moderate');
        expect(RECOVERY_STATUS.GOOD).toBe('good');
        expect(RECOVERY_STATUS.EXCELLENT).toBe('excellent');
      });

      it('should have all values present in tuple', () => {
        const constantValues = Object.values(RECOVERY_STATUS);
        expect(constantValues).toHaveLength(5);
        for (const value of constantValues) {
          expect(RECOVERY_STATUSES).toContain(value);
        }
      });
    });
  });

  // ============================================================================
  // TRAINING RISK LEVEL TESTS
  // ============================================================================

  describe('TrainingRiskLevel', () => {
    describe('tuple values', () => {
      it('should contain exactly 3 values', () => {
        expect(TRAINING_RISK_LEVELS).toHaveLength(3);
      });

      it('should contain all expected values', () => {
        expect(TRAINING_RISK_LEVELS).toContain('low');
        expect(TRAINING_RISK_LEVELS).toContain('moderate');
        expect(TRAINING_RISK_LEVELS).toContain('high');
      });

      it('should not contain values from other RiskLevel types (no collision)', () => {
        // Ensure these are the only values and no crossover with other risk types
        expect(TRAINING_RISK_LEVELS).toEqual(['low', 'moderate', 'high']);
      });
    });

    describe('schema validation', () => {
      it.each(TRAINING_RISK_LEVELS)('should accept valid value: %s', (value) => {
        const result = TrainingRiskLevelSchema.safeParse(value);
        expect(result.success).toBe(true);
      });

      it('should reject invalid values', () => {
        expect(TrainingRiskLevelSchema.safeParse('invalid').success).toBe(false);
        expect(TrainingRiskLevelSchema.safeParse('critical').success).toBe(false);
        expect(TrainingRiskLevelSchema.safeParse('medium').success).toBe(false);
        expect(TrainingRiskLevelSchema.safeParse(null).success).toBe(false);
      });
    });

    describe('type guard', () => {
      it.each(TRAINING_RISK_LEVELS)('isTrainingRiskLevel should return true for: %s', (value) => {
        expect(isTrainingRiskLevel(value)).toBe(true);
      });

      it('isTrainingRiskLevel should return false for invalid values', () => {
        expect(isTrainingRiskLevel('invalid')).toBe(false);
        expect(isTrainingRiskLevel('critical')).toBe(false);
      });
    });

    describe('labels map', () => {
      it('should have a label for every tuple value', () => {
        for (const value of TRAINING_RISK_LEVELS) {
          expect(TRAINING_RISK_LEVEL_LABELS[value]).toBeDefined();
          expect(typeof TRAINING_RISK_LEVEL_LABELS[value]).toBe('string');
          expect(TRAINING_RISK_LEVEL_LABELS[value].length).toBeGreaterThan(0);
        }
      });
    });

    describe('constants object', () => {
      it('should have keys that map to tuple values', () => {
        expect(TRAINING_RISK_LEVEL.LOW).toBe('low');
        expect(TRAINING_RISK_LEVEL.MODERATE).toBe('moderate');
        expect(TRAINING_RISK_LEVEL.HIGH).toBe('high');
      });

      it('should have all values present in tuple', () => {
        const constantValues = Object.values(TRAINING_RISK_LEVEL);
        expect(constantValues).toHaveLength(3);
        for (const value of constantValues) {
          expect(TRAINING_RISK_LEVELS).toContain(value);
        }
      });
    });
  });

  // ============================================================================
  // CHART CATEGORY TESTS
  // ============================================================================

  describe('ChartCategory', () => {
    describe('tuple values', () => {
      it('should contain exactly 6 categories', () => {
        expect(CHART_CATEGORIES).toHaveLength(6);
      });

      it('should contain all expected values', () => {
        expect(CHART_CATEGORIES).toContain('body-composition');
        expect(CHART_CATEGORIES).toContain('sleep');
        expect(CHART_CATEGORIES).toContain('heart-health');
        expect(CHART_CATEGORIES).toContain('nutrition');
        expect(CHART_CATEGORIES).toContain('activity');
        expect(CHART_CATEGORIES).toContain('biometrics');
      });
    });

    describe('schema validation', () => {
      it.each(CHART_CATEGORIES)('should accept valid value: %s', (value) => {
        const result = ChartCategorySchema.safeParse(value);
        expect(result.success).toBe(true);
      });

      it('should reject invalid values', () => {
        expect(ChartCategorySchema.safeParse('invalid').success).toBe(false);
        expect(ChartCategorySchema.safeParse('fitness').success).toBe(false);
        expect(ChartCategorySchema.safeParse(null).success).toBe(false);
      });
    });

    describe('type guard', () => {
      it.each(CHART_CATEGORIES)('isChartCategory should return true for: %s', (value) => {
        expect(isChartCategory(value)).toBe(true);
      });

      it('isChartCategory should return false for invalid values', () => {
        expect(isChartCategory('invalid')).toBe(false);
        expect(isChartCategory('weight')).toBe(false);
      });
    });

    describe('labels map', () => {
      it('should have a label for every tuple value', () => {
        for (const value of CHART_CATEGORIES) {
          expect(CHART_CATEGORY_LABELS[value]).toBeDefined();
          expect(typeof CHART_CATEGORY_LABELS[value]).toBe('string');
          expect(CHART_CATEGORY_LABELS[value].length).toBeGreaterThan(0);
        }
      });

      it('should have human-readable labels', () => {
        expect(CHART_CATEGORY_LABELS['body-composition']).toBe('Body Composition');
        expect(CHART_CATEGORY_LABELS['sleep']).toBe('Sleep');
        expect(CHART_CATEGORY_LABELS['heart-health']).toBe('Heart Health');
        expect(CHART_CATEGORY_LABELS['nutrition']).toBe('Nutrition');
        expect(CHART_CATEGORY_LABELS['activity']).toBe('Activity');
        expect(CHART_CATEGORY_LABELS['biometrics']).toBe('Biometrics');
      });
    });

    describe('constants object', () => {
      it('should have keys that map to tuple values', () => {
        expect(CHART_CATEGORY.BODY_COMPOSITION).toBe('body-composition');
        expect(CHART_CATEGORY.SLEEP).toBe('sleep');
        expect(CHART_CATEGORY.HEART_HEALTH).toBe('heart-health');
        expect(CHART_CATEGORY.NUTRITION).toBe('nutrition');
        expect(CHART_CATEGORY.ACTIVITY).toBe('activity');
        expect(CHART_CATEGORY.BIOMETRICS).toBe('biometrics');
      });

      it('should have all values present in tuple', () => {
        const constantValues = Object.values(CHART_CATEGORY);
        expect(constantValues).toHaveLength(6);
        for (const value of constantValues) {
          expect(CHART_CATEGORIES).toContain(value);
        }
      });
    });
  });

  // ============================================================================
  // TIME RANGE TESTS
  // ============================================================================

  describe('TimeRange', () => {
    describe('tuple values', () => {
      it('should contain exactly 5 ranges', () => {
        expect(TIME_RANGES).toHaveLength(5);
      });

      it('should contain all expected values', () => {
        expect(TIME_RANGES).toContain('1d');
        expect(TIME_RANGES).toContain('1w');
        expect(TIME_RANGES).toContain('1m');
        expect(TIME_RANGES).toContain('6m');
        expect(TIME_RANGES).toContain('1y');
      });
    });

    describe('schema validation', () => {
      it.each(TIME_RANGES)('should accept valid value: %s', (value) => {
        const result = TimeRangeSchema.safeParse(value);
        expect(result.success).toBe(true);
      });

      it('should reject invalid values', () => {
        expect(TimeRangeSchema.safeParse('invalid').success).toBe(false);
        expect(TimeRangeSchema.safeParse('2w').success).toBe(false);
        expect(TimeRangeSchema.safeParse('3m').success).toBe(false);
        expect(TimeRangeSchema.safeParse(null).success).toBe(false);
      });
    });

    describe('type guard', () => {
      it.each(TIME_RANGES)('isTimeRange should return true for: %s', (value) => {
        expect(isTimeRange(value)).toBe(true);
      });

      it('isTimeRange should return false for invalid values', () => {
        expect(isTimeRange('invalid')).toBe(false);
        expect(isTimeRange('2d')).toBe(false);
      });
    });

    describe('labels map', () => {
      it('should have a label for every tuple value', () => {
        for (const value of TIME_RANGES) {
          expect(TIME_RANGE_LABELS[value]).toBeDefined();
          expect(typeof TIME_RANGE_LABELS[value]).toBe('string');
          expect(TIME_RANGE_LABELS[value].length).toBeGreaterThan(0);
        }
      });
    });

    describe('TIME_RANGE_CONFIG', () => {
      it('should have config for every tuple value', () => {
        for (const value of TIME_RANGES) {
          expect(TIME_RANGE_CONFIG[value]).toBeDefined();
          expect(TIME_RANGE_CONFIG[value].label).toBeDefined();
          expect(TIME_RANGE_CONFIG[value].days).toBeDefined();
        }
      });

      it('should have correct day values', () => {
        expect(TIME_RANGE_CONFIG['1d'].days).toBe(1);
        expect(TIME_RANGE_CONFIG['1w'].days).toBe(7);
        expect(TIME_RANGE_CONFIG['1m'].days).toBe(30);
        expect(TIME_RANGE_CONFIG['6m'].days).toBe(180);
        expect(TIME_RANGE_CONFIG['1y'].days).toBe(365);
      });

      it('should have matching labels with TIME_RANGE_LABELS', () => {
        for (const value of TIME_RANGES) {
          expect(TIME_RANGE_CONFIG[value].label).toBe(TIME_RANGE_LABELS[value]);
        }
      });
    });

    describe('constants object', () => {
      it('should have keys that map to tuple values', () => {
        expect(TIME_RANGE.ONE_DAY).toBe('1d');
        expect(TIME_RANGE.ONE_WEEK).toBe('1w');
        expect(TIME_RANGE.ONE_MONTH).toBe('1m');
        expect(TIME_RANGE.SIX_MONTHS).toBe('6m');
        expect(TIME_RANGE.ONE_YEAR).toBe('1y');
      });

      it('should have all values present in tuple', () => {
        const constantValues = Object.values(TIME_RANGE);
        expect(constantValues).toHaveLength(5);
        for (const value of constantValues) {
          expect(TIME_RANGES).toContain(value);
        }
      });
    });
  });

  // ============================================================================
  // CHART TYPE TESTS
  // ============================================================================

  describe('ChartType', () => {
    describe('tuple values', () => {
      it('should contain exactly 2 types', () => {
        expect(CHART_TYPES).toHaveLength(2);
      });

      it('should contain all expected values', () => {
        expect(CHART_TYPES).toContain('line');
        expect(CHART_TYPES).toContain('bar');
      });
    });

    describe('schema validation', () => {
      it('should accept "line"', () => {
        const result = ChartTypeSchema.safeParse('line');
        expect(result.success).toBe(true);
      });

      it('should accept "bar"', () => {
        const result = ChartTypeSchema.safeParse('bar');
        expect(result.success).toBe(true);
      });

      it('should reject invalid values', () => {
        expect(ChartTypeSchema.safeParse('pie').success).toBe(false);
        expect(ChartTypeSchema.safeParse('scatter').success).toBe(false);
        expect(ChartTypeSchema.safeParse('area').success).toBe(false);
        expect(ChartTypeSchema.safeParse('invalid').success).toBe(false);
        expect(ChartTypeSchema.safeParse(null).success).toBe(false);
      });
    });

    describe('type guard', () => {
      it('isChartType should return true for valid values', () => {
        expect(isChartType('line')).toBe(true);
        expect(isChartType('bar')).toBe(true);
      });

      it('isChartType should return false for invalid values', () => {
        expect(isChartType('pie')).toBe(false);
        expect(isChartType('invalid')).toBe(false);
      });
    });

    describe('labels map', () => {
      it('should have a label for every tuple value', () => {
        for (const value of CHART_TYPES) {
          expect(CHART_TYPE_LABELS[value]).toBeDefined();
          expect(typeof CHART_TYPE_LABELS[value]).toBe('string');
          expect(CHART_TYPE_LABELS[value].length).toBeGreaterThan(0);
        }
      });
    });

    describe('constants object', () => {
      it('should have keys that map to tuple values', () => {
        expect(CHART_TYPE.LINE).toBe('line');
        expect(CHART_TYPE.BAR).toBe('bar');
      });

      it('should have all values present in tuple', () => {
        const constantValues = Object.values(CHART_TYPE);
        expect(constantValues).toHaveLength(2);
        for (const value of constantValues) {
          expect(CHART_TYPES).toContain(value);
        }
      });
    });
  });

  // ============================================================================
  // CHART DATA POINT SCHEMA TESTS
  // ============================================================================

  describe('ChartDataPointSchema', () => {
    describe('valid objects', () => {
      it('should accept valid data point', () => {
        const result = ChartDataPointSchema.safeParse({
          label: 'Jan 1',
          value: 150.5,
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.label).toBe('Jan 1');
          expect(result.data.value).toBe(150.5);
        }
      });

      it('should accept data point with zero value', () => {
        const result = ChartDataPointSchema.safeParse({
          label: 'Empty',
          value: 0,
        });
        expect(result.success).toBe(true);
      });

      it('should accept data point with negative value', () => {
        const result = ChartDataPointSchema.safeParse({
          label: 'Deficit',
          value: -500,
        });
        expect(result.success).toBe(true);
      });

      it('should accept data point with empty string label', () => {
        const result = ChartDataPointSchema.safeParse({
          label: '',
          value: 100,
        });
        expect(result.success).toBe(true);
      });
    });

    describe('invalid objects', () => {
      it('should reject missing label', () => {
        const result = ChartDataPointSchema.safeParse({
          value: 150,
        });
        expect(result.success).toBe(false);
      });

      it('should reject missing value', () => {
        const result = ChartDataPointSchema.safeParse({
          label: 'Jan 1',
        });
        expect(result.success).toBe(false);
      });

      it('should reject wrong type for label', () => {
        const result = ChartDataPointSchema.safeParse({
          label: 123,
          value: 150,
        });
        expect(result.success).toBe(false);
      });

      it('should reject wrong type for value', () => {
        const result = ChartDataPointSchema.safeParse({
          label: 'Jan 1',
          value: '150',
        });
        expect(result.success).toBe(false);
      });

      it('should reject null values', () => {
        expect(ChartDataPointSchema.safeParse(null).success).toBe(false);
      });

      it('should reject undefined', () => {
        expect(ChartDataPointSchema.safeParse(undefined).success).toBe(false);
      });
    });
  });

  // ============================================================================
  // CHART ITEM SCHEMA TESTS
  // ============================================================================

  describe('ChartItemSchema', () => {
    const validChartItem = {
      id: 'weight-chart',
      title: 'Weight Over Time',
      data: [
        { label: 'Week 1', value: 180 },
        { label: 'Week 2', value: 178 },
        { label: 'Week 3', value: 176 },
      ],
      type: 'line' as const,
    };

    describe('valid objects', () => {
      it('should accept valid chart item with required fields only', () => {
        const result = ChartItemSchema.safeParse(validChartItem);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.id).toBe('weight-chart');
          expect(result.data.title).toBe('Weight Over Time');
          expect(result.data.data).toHaveLength(3);
          expect(result.data.type).toBe('line');
        }
      });

      it('should accept chart item with all optional fields', () => {
        const result = ChartItemSchema.safeParse({
          ...validChartItem,
          yAxisSuffix: ' lbs',
          color: '#FF5733',
          category: 'body-composition',
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.yAxisSuffix).toBe(' lbs');
          expect(result.data.color).toBe('#FF5733');
          expect(result.data.category).toBe('body-composition');
        }
      });

      it('should accept chart item with empty data array', () => {
        const result = ChartItemSchema.safeParse({
          ...validChartItem,
          data: [],
        });
        expect(result.success).toBe(true);
      });

      it('should accept chart item with bar type', () => {
        const result = ChartItemSchema.safeParse({
          ...validChartItem,
          type: 'bar',
        });
        expect(result.success).toBe(true);
      });

      it('should accept all valid category values', () => {
        for (const category of CHART_CATEGORIES) {
          const result = ChartItemSchema.safeParse({
            ...validChartItem,
            category,
          });
          expect(result.success).toBe(true);
        }
      });
    });

    describe('required fields enforcement', () => {
      it('should reject missing id', () => {
        const { id, ...rest } = validChartItem;
        const result = ChartItemSchema.safeParse(rest);
        expect(result.success).toBe(false);
      });

      it('should reject missing title', () => {
        const { title, ...rest } = validChartItem;
        const result = ChartItemSchema.safeParse(rest);
        expect(result.success).toBe(false);
      });

      it('should reject missing data', () => {
        const { data, ...rest } = validChartItem;
        const result = ChartItemSchema.safeParse(rest);
        expect(result.success).toBe(false);
      });

      it('should reject missing type', () => {
        const { type, ...rest } = validChartItem;
        const result = ChartItemSchema.safeParse(rest);
        expect(result.success).toBe(false);
      });
    });

    describe('type validation', () => {
      it('should reject invalid chart type', () => {
        const result = ChartItemSchema.safeParse({
          ...validChartItem,
          type: 'pie',
        });
        expect(result.success).toBe(false);
      });

      it('should reject invalid category', () => {
        const result = ChartItemSchema.safeParse({
          ...validChartItem,
          category: 'invalid-category',
        });
        expect(result.success).toBe(false);
      });

      it('should reject invalid data point in array', () => {
        const result = ChartItemSchema.safeParse({
          ...validChartItem,
          data: [{ label: 'Valid', value: 100 }, { invalid: 'data' }],
        });
        expect(result.success).toBe(false);
      });

      it('should reject wrong type for id', () => {
        const result = ChartItemSchema.safeParse({
          ...validChartItem,
          id: 123,
        });
        expect(result.success).toBe(false);
      });

      it('should reject wrong type for title', () => {
        const result = ChartItemSchema.safeParse({
          ...validChartItem,
          title: { text: 'Title' },
        });
        expect(result.success).toBe(false);
      });
    });

    describe('optional fields work correctly', () => {
      it('should work without yAxisSuffix', () => {
        const result = ChartItemSchema.safeParse(validChartItem);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.yAxisSuffix).toBeUndefined();
        }
      });

      it('should work without color', () => {
        const result = ChartItemSchema.safeParse(validChartItem);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.color).toBeUndefined();
        }
      });

      it('should work without category', () => {
        const result = ChartItemSchema.safeParse(validChartItem);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.category).toBeUndefined();
        }
      });
    });
  });
});
