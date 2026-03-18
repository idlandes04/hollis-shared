/**
 * @ai-context Units & Realtime Domain Contracts Tests
 *
 * This test suite covers:
 * 1. units.ts: all unit type tuples, schemas, constants, labels, AdvancedUnitPreferences
 * 2. realtime.ts: SSE resource types, SSE event types, type guards
 *
 * Run: npx jest shared/contracts/__tests__/domain-units-realtime.test.ts
 */

import {
  ALTITUDE_UNIT,
  ALTITUDE_UNITS,
  AltitudeUnitSchema,
  AdvancedUnitPreferencesSchema,
  CALORIE_UNIT,
  CALORIE_UNITS,
  CalorieUnitSchema,
  DISTANCE_UNIT,
  DISTANCE_UNITS,
  DistanceUnitSchema,
  FOOD_VOLUME_UNIT,
  FOOD_VOLUME_UNITS,
  FoodVolumeUnitSchema,
  FOOD_WEIGHT_UNIT,
  FOOD_WEIGHT_UNITS,
  FoodWeightUnitSchema,
  HEIGHT_UNIT,
  HEIGHT_UNITS,
  HeightUnitSchema,
  SPEED_UNIT,
  SPEED_UNITS,
  SpeedUnitSchema,
  TEMPERATURE_UNIT,
  TEMPERATURE_UNITS,
  TemperatureUnitSchema,
  TIME_FORMAT,
  TIME_FORMAT_LABELS,
  TIME_FORMATS,
  TimeFormatSchema,
  UNIT_SYSTEM,
  UNIT_SYSTEM_LABELS,
  UNIT_SYSTEMS,
  UnitSystemSchema,
  WATER_UNIT,
  WATER_UNITS,
  WaterUnitSchema,
  WEIGHT_UNIT,
  WEIGHT_UNITS,
  WeightUnitSchema,
} from '../domain/units';

import {
  isSSEResourceType,
  SSE_EVENT_TYPE,
  SSE_EVENT_TYPES,
  SSE_RESOURCE_TYPE,
  SSE_RESOURCE_TYPES,
  sseEventTypeSchema,
  sseResourceTypeSchema,
} from '../domain/realtime';

// ============================================================================
// UNITS (units.ts)
// ============================================================================

describe('Units Domain Contracts', () => {

  // ============================================================================
  // UNIT SYSTEM
  // ============================================================================

  describe('UnitSystem', () => {
    it('should contain exactly 3 unit systems', () => {
      expect(UNIT_SYSTEMS).toHaveLength(3);
    });

    it('should contain metric, imperial, advanced', () => {
      expect(UNIT_SYSTEMS).toContain('metric');
      expect(UNIT_SYSTEMS).toContain('imperial');
      expect(UNIT_SYSTEMS).toContain('advanced');
    });

    it.each(UNIT_SYSTEMS)('schema should accept: %s', (value) => {
      expect(UnitSystemSchema.safeParse(value).success).toBe(true);
    });

    it('schema should reject invalid values', () => {
      expect(UnitSystemSchema.safeParse('METRIC').success).toBe(false);
      expect(UnitSystemSchema.safeParse('customary').success).toBe(false);
      expect(UnitSystemSchema.safeParse('').success).toBe(false);
    });

    it('should have constants matching tuple values', () => {
      expect(UNIT_SYSTEM.METRIC).toBe('metric');
      expect(UNIT_SYSTEM.IMPERIAL).toBe('imperial');
      expect(UNIT_SYSTEM.ADVANCED).toBe('advanced');
    });

    it('should have labels for all unit systems', () => {
      for (const system of UNIT_SYSTEMS) {
        expect(UNIT_SYSTEM_LABELS[system]).toBeDefined();
        expect(UNIT_SYSTEM_LABELS[system].length).toBeGreaterThan(0);
      }
    });
  });

  // ============================================================================
  // TIME FORMAT
  // ============================================================================

  describe('TimeFormat', () => {
    it('should contain exactly 2 time formats', () => {
      expect(TIME_FORMATS).toHaveLength(2);
    });

    it('should contain standard and military', () => {
      expect(TIME_FORMATS).toContain('standard');
      expect(TIME_FORMATS).toContain('military');
    });

    it.each(TIME_FORMATS)('schema should accept: %s', (value) => {
      expect(TimeFormatSchema.safeParse(value).success).toBe(true);
    });

    it('should have constants matching tuple values', () => {
      expect(TIME_FORMAT.STANDARD).toBe('standard');
      expect(TIME_FORMAT.MILITARY).toBe('military');
    });

    it('should have labels for both time formats', () => {
      for (const format of TIME_FORMATS) {
        expect(TIME_FORMAT_LABELS[format]).toBeDefined();
        expect(TIME_FORMAT_LABELS[format].length).toBeGreaterThan(0);
      }
    });
  });

  // ============================================================================
  // WEIGHT UNITS
  // ============================================================================

  describe('WeightUnit', () => {
    it('should contain kg and lbs', () => {
      expect(WEIGHT_UNITS).toContain('kg');
      expect(WEIGHT_UNITS).toContain('lbs');
    });

    it.each(WEIGHT_UNITS)('schema should accept: %s', (value) => {
      expect(WeightUnitSchema.safeParse(value).success).toBe(true);
    });

    it('schema should reject invalid values', () => {
      expect(WeightUnitSchema.safeParse('pounds').success).toBe(false);
      expect(WeightUnitSchema.safeParse('KG').success).toBe(false);
    });

    it('should have constants matching tuple values', () => {
      expect(WEIGHT_UNIT.KG).toBe('kg');
      expect(WEIGHT_UNIT.LBS).toBe('lbs');
    });
  });

  // ============================================================================
  // HEIGHT UNITS
  // ============================================================================

  describe('HeightUnit', () => {
    it('should contain cm and ft_in', () => {
      expect(HEIGHT_UNITS).toContain('cm');
      expect(HEIGHT_UNITS).toContain('ft_in');
    });

    it.each(HEIGHT_UNITS)('schema should accept: %s', (value) => {
      expect(HeightUnitSchema.safeParse(value).success).toBe(true);
    });

    it('should have constants matching tuple values', () => {
      expect(HEIGHT_UNIT.CM).toBe('cm');
      expect(HEIGHT_UNIT.FT_IN).toBe('ft_in');
    });
  });

  // ============================================================================
  // FOOD WEIGHT UNITS
  // ============================================================================

  describe('FoodWeightUnit', () => {
    it('should contain g, oz, lbs', () => {
      expect(FOOD_WEIGHT_UNITS).toContain('g');
      expect(FOOD_WEIGHT_UNITS).toContain('oz');
      expect(FOOD_WEIGHT_UNITS).toContain('lbs');
    });

    it.each(FOOD_WEIGHT_UNITS)('schema should accept: %s', (value) => {
      expect(FoodWeightUnitSchema.safeParse(value).success).toBe(true);
    });

    it('should have constants matching tuple values', () => {
      expect(FOOD_WEIGHT_UNIT.G).toBe('g');
      expect(FOOD_WEIGHT_UNIT.OZ).toBe('oz');
      expect(FOOD_WEIGHT_UNIT.LBS).toBe('lbs');
    });
  });

  // ============================================================================
  // FOOD VOLUME UNITS
  // ============================================================================

  describe('FoodVolumeUnit', () => {
    it('should contain ml, fl_oz, cups, tbsp, tsp', () => {
      expect(FOOD_VOLUME_UNITS).toContain('ml');
      expect(FOOD_VOLUME_UNITS).toContain('fl_oz');
      expect(FOOD_VOLUME_UNITS).toContain('cups');
      expect(FOOD_VOLUME_UNITS).toContain('tbsp');
      expect(FOOD_VOLUME_UNITS).toContain('tsp');
    });

    it.each(FOOD_VOLUME_UNITS)('schema should accept: %s', (value) => {
      expect(FoodVolumeUnitSchema.safeParse(value).success).toBe(true);
    });

    it('should have constants matching tuple values', () => {
      expect(FOOD_VOLUME_UNIT.ML).toBe('ml');
      expect(FOOD_VOLUME_UNIT.FL_OZ).toBe('fl_oz');
      expect(FOOD_VOLUME_UNIT.CUPS).toBe('cups');
      expect(FOOD_VOLUME_UNIT.TBSP).toBe('tbsp');
      expect(FOOD_VOLUME_UNIT.TSP).toBe('tsp');
    });
  });

  // ============================================================================
  // CALORIE UNITS
  // ============================================================================

  describe('CalorieUnit', () => {
    it('should contain kcal and kj', () => {
      expect(CALORIE_UNITS).toContain('kcal');
      expect(CALORIE_UNITS).toContain('kj');
    });

    it.each(CALORIE_UNITS)('schema should accept: %s', (value) => {
      expect(CalorieUnitSchema.safeParse(value).success).toBe(true);
    });

    it('should have constants matching tuple values', () => {
      expect(CALORIE_UNIT.KCAL).toBe('kcal');
      expect(CALORIE_UNIT.KJ).toBe('kj');
    });
  });

  // ============================================================================
  // DISTANCE UNITS
  // ============================================================================

  describe('DistanceUnit', () => {
    it('should contain km, mi, m, ft', () => {
      expect(DISTANCE_UNITS).toContain('km');
      expect(DISTANCE_UNITS).toContain('mi');
      expect(DISTANCE_UNITS).toContain('m');
      expect(DISTANCE_UNITS).toContain('ft');
    });

    it.each(DISTANCE_UNITS)('schema should accept: %s', (value) => {
      expect(DistanceUnitSchema.safeParse(value).success).toBe(true);
    });

    it('should have constants matching tuple values', () => {
      expect(DISTANCE_UNIT.KM).toBe('km');
      expect(DISTANCE_UNIT.MI).toBe('mi');
      expect(DISTANCE_UNIT.M).toBe('m');
      expect(DISTANCE_UNIT.FT).toBe('ft');
    });
  });

  // ============================================================================
  // SPEED UNITS
  // ============================================================================

  describe('SpeedUnit', () => {
    it('should contain km_h, mph, m_s', () => {
      expect(SPEED_UNITS).toContain('km_h');
      expect(SPEED_UNITS).toContain('mph');
      expect(SPEED_UNITS).toContain('m_s');
    });

    it.each(SPEED_UNITS)('schema should accept: %s', (value) => {
      expect(SpeedUnitSchema.safeParse(value).success).toBe(true);
    });

    it('should have constants matching tuple values', () => {
      expect(SPEED_UNIT.KM_H).toBe('km_h');
      expect(SPEED_UNIT.MPH).toBe('mph');
      expect(SPEED_UNIT.M_S).toBe('m_s');
    });
  });

  // ============================================================================
  // ALTITUDE UNITS
  // ============================================================================

  describe('AltitudeUnit', () => {
    it('should contain m and ft', () => {
      expect(ALTITUDE_UNITS).toContain('m');
      expect(ALTITUDE_UNITS).toContain('ft');
    });

    it.each(ALTITUDE_UNITS)('schema should accept: %s', (value) => {
      expect(AltitudeUnitSchema.safeParse(value).success).toBe(true);
    });

    it('should have constants matching tuple values', () => {
      expect(ALTITUDE_UNIT.M).toBe('m');
      expect(ALTITUDE_UNIT.FT).toBe('ft');
    });
  });

  // ============================================================================
  // TEMPERATURE UNITS
  // ============================================================================

  describe('TemperatureUnit', () => {
    it('should contain celsius and fahrenheit', () => {
      expect(TEMPERATURE_UNITS).toContain('celsius');
      expect(TEMPERATURE_UNITS).toContain('fahrenheit');
    });

    it.each(TEMPERATURE_UNITS)('schema should accept: %s', (value) => {
      expect(TemperatureUnitSchema.safeParse(value).success).toBe(true);
    });

    it('should have constants matching tuple values', () => {
      expect(TEMPERATURE_UNIT.CELSIUS).toBe('celsius');
      expect(TEMPERATURE_UNIT.FAHRENHEIT).toBe('fahrenheit');
    });
  });

  // ============================================================================
  // WATER UNITS
  // ============================================================================

  describe('WaterUnit', () => {
    it('should contain ml, fl_oz, cups, l', () => {
      expect(WATER_UNITS).toContain('ml');
      expect(WATER_UNITS).toContain('fl_oz');
      expect(WATER_UNITS).toContain('cups');
      expect(WATER_UNITS).toContain('l');
    });

    it.each(WATER_UNITS)('schema should accept: %s', (value) => {
      expect(WaterUnitSchema.safeParse(value).success).toBe(true);
    });

    it('should have constants matching tuple values', () => {
      expect(WATER_UNIT.ML).toBe('ml');
      expect(WATER_UNIT.FL_OZ).toBe('fl_oz');
      expect(WATER_UNIT.CUPS).toBe('cups');
      expect(WATER_UNIT.L).toBe('l');
    });
  });

  // ============================================================================
  // ADVANCED UNIT PREFERENCES SCHEMA
  // ============================================================================

  describe('AdvancedUnitPreferencesSchema', () => {
    it('should accept valid advanced preferences', () => {
      const result = AdvancedUnitPreferencesSchema.safeParse({
        weight: 'kg',
        height: 'cm',
        foodWeight: 'g',
        foodVolume: 'ml',
        calories: 'kcal',
        exerciseWeight: 'lbs',
        distance: 'km',
        speed: 'km_h',
        altitude: 'm',
        temperature: 'celsius',
        water: 'ml',
      });
      expect(result.success).toBe(true);
    });

    it('should accept imperial unit preferences', () => {
      const result = AdvancedUnitPreferencesSchema.safeParse({
        weight: 'lbs',
        height: 'ft_in',
        foodWeight: 'oz',
        foodVolume: 'cups',
        calories: 'kcal',
        exerciseWeight: 'lbs',
        distance: 'mi',
        speed: 'mph',
        altitude: 'ft',
        temperature: 'fahrenheit',
        water: 'fl_oz',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid unit values', () => {
      expect(AdvancedUnitPreferencesSchema.safeParse({
        weight: 'pounds', // invalid
        height: 'cm',
        foodWeight: 'g',
        foodVolume: 'ml',
        calories: 'kcal',
        exerciseWeight: 'kg',
        distance: 'km',
        speed: 'km_h',
        altitude: 'm',
        temperature: 'celsius',
        water: 'ml',
      }).success).toBe(false);
    });

    it('should reject missing required fields', () => {
      expect(AdvancedUnitPreferencesSchema.safeParse({
        weight: 'kg',
        height: 'cm',
        // missing other fields
      }).success).toBe(false);
    });
  });
});

// ============================================================================
// REALTIME (realtime.ts)
// ============================================================================

describe('Realtime Domain Contracts', () => {

  // ============================================================================
  // SSE RESOURCE TYPES
  // ============================================================================

  describe('SSEResourceType', () => {
    it('should contain 12 resource types', () => {
      expect(SSE_RESOURCE_TYPES).toHaveLength(12);
    });

    it('should contain all expected resource types', () => {
      expect(SSE_RESOURCE_TYPES).toContain('nutrition');
      expect(SSE_RESOURCE_TYPES).toContain('daily-metrics');
      expect(SSE_RESOURCE_TYPES).toContain('daily-summary');
      expect(SSE_RESOURCE_TYPES).toContain('biometrics');
      expect(SSE_RESOURCE_TYPES).toContain('journal');
      expect(SSE_RESOURCE_TYPES).toContain('appointments');
      expect(SSE_RESOURCE_TYPES).toContain('sessions');
      expect(SSE_RESOURCE_TYPES).toContain('user-account');
      expect(SSE_RESOURCE_TYPES).toContain('messages');
      expect(SSE_RESOURCE_TYPES).toContain('exercise-performance');
      expect(SSE_RESOURCE_TYPES).toContain('labs');
      expect(SSE_RESOURCE_TYPES).toContain('plans');
    });

    it.each(SSE_RESOURCE_TYPES)('schema should accept: %s', (value) => {
      expect(sseResourceTypeSchema.safeParse(value).success).toBe(true);
    });

    it('schema should reject invalid resource types', () => {
      expect(sseResourceTypeSchema.safeParse('health-metrics').success).toBe(false);
      expect(sseResourceTypeSchema.safeParse('NUTRITION').success).toBe(false);
      expect(sseResourceTypeSchema.safeParse('').success).toBe(false);
    });

    it('should have constants for all resource types', () => {
      expect(SSE_RESOURCE_TYPE.NUTRITION).toBe('nutrition');
      expect(SSE_RESOURCE_TYPE.DAILY_METRICS).toBe('daily-metrics');
      expect(SSE_RESOURCE_TYPE.DAILY_SUMMARY).toBe('daily-summary');
      expect(SSE_RESOURCE_TYPE.BIOMETRICS).toBe('biometrics');
      expect(SSE_RESOURCE_TYPE.JOURNAL).toBe('journal');
      expect(SSE_RESOURCE_TYPE.APPOINTMENTS).toBe('appointments');
      expect(SSE_RESOURCE_TYPE.SESSIONS).toBe('sessions');
      expect(SSE_RESOURCE_TYPE.USER_ACCOUNT).toBe('user-account');
      expect(SSE_RESOURCE_TYPE.MESSAGES).toBe('messages');
      expect(SSE_RESOURCE_TYPE.EXERCISE_PERFORMANCE).toBe('exercise-performance');
      expect(SSE_RESOURCE_TYPE.LABS).toBe('labs');
      expect(SSE_RESOURCE_TYPE.PLANS).toBe('plans');
    });

    describe('isSSEResourceType type guard', () => {
      it.each(SSE_RESOURCE_TYPES)('should return true for: %s', (value) => {
        expect(isSSEResourceType(value)).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isSSEResourceType('health-metrics')).toBe(false);
        expect(isSSEResourceType('NUTRITION')).toBe(false);
        expect(isSSEResourceType('')).toBe(false);
      });
    });
  });

  // ============================================================================
  // SSE EVENT TYPES
  // ============================================================================

  describe('SSEEventType', () => {
    it('should contain exactly 4 event types', () => {
      expect(SSE_EVENT_TYPES).toHaveLength(4);
    });

    it('should contain invalidate, connected, heartbeat, notification', () => {
      expect(SSE_EVENT_TYPES).toContain('invalidate');
      expect(SSE_EVENT_TYPES).toContain('connected');
      expect(SSE_EVENT_TYPES).toContain('heartbeat');
      expect(SSE_EVENT_TYPES).toContain('notification');
    });

    it.each(SSE_EVENT_TYPES)('schema should accept: %s', (value) => {
      expect(sseEventTypeSchema.safeParse(value).success).toBe(true);
    });

    it('schema should reject invalid event types', () => {
      expect(sseEventTypeSchema.safeParse('disconnect').success).toBe(false);
      expect(sseEventTypeSchema.safeParse('INVALIDATE').success).toBe(false);
      expect(sseEventTypeSchema.safeParse('').success).toBe(false);
    });

    it('should have constants for all event types', () => {
      expect(SSE_EVENT_TYPE.INVALIDATE).toBe('invalidate');
      expect(SSE_EVENT_TYPE.CONNECTED).toBe('connected');
      expect(SSE_EVENT_TYPE.HEARTBEAT).toBe('heartbeat');
      expect(SSE_EVENT_TYPE.NOTIFICATION).toBe('notification');
    });
  });
});
