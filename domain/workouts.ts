/**
 * @ai-context Workout contracts | workout session, plan, and set schemas for training features
 */
import { z } from "zod";
import { baseDocumentSchema, isoDateSchema, isoTimestampSchema } from "./common";
import { WeightUnitSchema } from "./units";

// ============================================================================
// WORKOUT SECTION TYPES
// ============================================================================

/**
 * Valid workout section types for training plans.
 */
export const WORKOUT_SECTION_TYPES = ["warmup", "working", "cooldown"] as const;

export const WorkoutSectionTypeSchema = z.enum(WORKOUT_SECTION_TYPES);
export type WorkoutSectionType = z.infer<typeof WorkoutSectionTypeSchema>;

/** Centralized workout section type constants for equality checks */
export const WORKOUT_SECTION_TYPE = {
  WARMUP: "warmup" as WorkoutSectionType,
  WORKING: "working" as WorkoutSectionType,
  COOLDOWN: "cooldown" as WorkoutSectionType,
} as const;

/** Human-readable labels for workout section types */
export const WORKOUT_SECTION_TYPE_LABELS: Record<WorkoutSectionType, string> = {
  warmup: "Warm-up",
  working: "Working Sets",
  cooldown: "Cool-down",
};

/**
 * Check if a string is a valid workout section type
 */
export function isWorkoutSectionType(
  value: string,
): value is WorkoutSectionType {
  return (WORKOUT_SECTION_TYPES as readonly string[]).includes(value);
}

// --- Sub-components ---

export const workoutSetSchema = z.object({
  id: z.string(),
  exerciseId: z.string().optional(), // Reference to Exercise library item
  name: z.string(),
  description: z.string().optional(),
  link: z.string().url().optional(),
  reps: z.number().int().min(0).optional(),
  weight: z.number().min(0).optional(),
  weightUnit: WeightUnitSchema.optional(),
  duration: z.number().int().min(0).optional(),
  rpe: z.number().min(1).max(10).optional(),
  restSeconds: z.number().int().min(0).optional(),
});

export type WorkoutSetContract = z.infer<typeof workoutSetSchema>;

export const workoutSectionSchema = z.object({
  id: z.string(),
  type: WorkoutSectionTypeSchema,
  title: z.string(), // Customizable title
  sets: z.array(workoutSetSchema),
});

export type WorkoutSectionContract = z.infer<typeof workoutSectionSchema>;

// --- The Workout Session (One Day) ---

export const workoutSessionSchema = z.object({
  id: z.string(),
  dayOfWeek: z.number().int().min(0).max(6), // 0=Sunday, 1=Monday, etc.
  name: z.string(), // "Leg Day", "Rest", "Cardio"
  icon: z.string(), // Icon name for the UI
  sections: z.array(workoutSectionSchema),
  isRestDay: z.boolean().default(false),
});

export type WorkoutSessionContract = z.infer<typeof workoutSessionSchema>;

// --- The Daily Workout Plan ---

export const workoutPlanSchema = baseDocumentSchema.extend({
  id: z.string().optional(),
  userId: z.string(),
  date: isoDateSchema, // ISO Date YYYY-MM-DD
  title: z.string(),
  description: z.string().nullable().optional(),
  blocks: z.array(workoutSectionSchema),
  isCompleted: z.boolean().default(false),
  completedAt: z.string().nullable().optional(),
});

export type WorkoutPlanContract = z.infer<typeof workoutPlanSchema>;

// ============================================================================
// WEARABLE WORKOUT SESSION
// ============================================================================

/**
 * A single workout activity recorded by a wearable device (e.g., Apple Watch,
 * Garmin, Whoop). Free-form sessions that do not map to structured exercise
 * logs — stored in `wearable_workout_sessions` for longitudinal activity
 * analytics and future AI context.
 *
 * Units contract:
 * - `durationMinutes`: integer minutes (1–1440)
 * - `activeCaloriesKcal`: integer kcal (0–50000)
 * - `distanceKm`: decimal km (0–1000) — always stored in km regardless of device unit
 */
export const wearableWorkoutSessionSchema = z.object({
  /** Unique identifier (UUID) — present on records read from DB, absent on create */
  id: z.string().uuid().optional(),
  userId: z.string(),
  /** Activity type as reported by the wearable (e.g. "running", "cycling") */
  type: z.string().min(1).max(100),
  /** ISO 8601 UTC timestamp for workout start */
  startTime: isoTimestampSchema,
  /** ISO 8601 UTC timestamp for workout end */
  endTime: isoTimestampSchema,
  /** Duration in whole minutes (1–1440) */
  durationMinutes: z.number().int().min(1).max(1440),
  /** Active (exercise) calories burned in kcal */
  activeCaloriesKcal: z.number().int().min(0).max(50000).optional(),
  /** Distance covered in km (normalized from device unit at write time) */
  distanceKm: z.number().min(0).max(1000).optional(),
  /** Device or app source identifier (e.g. "com.apple.health", "whoop") */
  source: z.string().min(1).max(200).optional(),
  createdAt: isoTimestampSchema.optional(),
  updatedAt: isoTimestampSchema.optional(),
});

export type WearableWorkoutSessionContract = z.infer<
  typeof wearableWorkoutSessionSchema
>;

/**
 * Schema used when a wearable client submits workout sessions in a daily sync
 * payload. The `userId` and `id` fields are populated server-side.
 */
export const wearableWorkoutSyncSchema = wearableWorkoutSessionSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type WearableWorkoutSync = z.infer<typeof wearableWorkoutSyncSchema>;
