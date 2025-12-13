/**
 * @ai-context Admin domain types | Types for admin/CRM operations
 *
 * This module provides type definitions for admin-specific operations:
 * - Patient management (summaries, details, filters)
 * - Clinician management
 * - Registration/onboarding
 * - Training strategies (create/update inputs)
 * - Lab results and extraction
 * - Workout/nutrition generation
 * - Availability and scheduling
 * - Analytics
 *
 * IMPORTANT: All admin-related types MUST be imported from here.
 *
 * NOTE: This module defines self-contained types for admin operations.
 * Complex nested types (like PatientDetails) use generic typing to allow
 * consumers to inject their platform-specific contract types.
 *
 * deps: domain types | consumers: web-admin/services/*, server/src/routes/admin/*
 */

import type {
    AccountStatus,
    ActivityLevel,
    BiologicalSex,
    FitnessExperience,
    GoalDataSource,
    PregnancyStatus,
    PrimaryGoal,
    StrategyStatus,
    StrategyType,
    UserRole,
    UserTier,
} from '../domain';

// ============================================================================
// COMPLIANCE STATUS (admin-specific)
// ============================================================================

/**
 * Granular compliance status levels for admin views.
 */
export const ADMIN_COMPLIANCE_STATUSES = ['excellent', 'good', 'at-risk', 'non-compliant'] as const;
export type AdminComplianceStatus = (typeof ADMIN_COMPLIANCE_STATUSES)[number];

// ============================================================================
// VOLUME LEVELS (for training phases)
// ============================================================================

export const VOLUME_LEVELS = ['low', 'moderate', 'high'] as const;
export type VolumeLevel = (typeof VOLUME_LEVELS)[number];

// ============================================================================
// GOAL METRIC KEYS (string type for admin inputs)
// ============================================================================

/**
 * Goal metric key type for admin inputs.
 * Uses string to avoid circular dependency with goalMetrics definitions.
 * Consumers should validate against GOAL_METRIC_KEYS from their contracts.
 */
export type GoalMetricKey = string;

// ============================================================================
// PATIENT MANAGEMENT TYPES
// ============================================================================

/**
 * Summary view of a patient for list displays.
 */
export interface PatientSummary {
  id: string;
  email: string;
  name: string;
  tier: UserTier;
  status: AdminComplianceStatus;
  complianceScore: number;
  lastLog: string;
}

/**
 * Medication entry for patient profile.
 */
export interface AdminMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
}

/**
 * Limitation entry for patient profile.
 */
export interface AdminLimitation {
  id: string;
  description: string;
  severity?: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

/**
 * Patient profile update payload for admin editing.
 */
export interface PatientProfileUpdatePayload {
  fullName?: string;
  preferredName?: string | null;
  email?: string;
  dateOfBirth?: string;
  biologicalSex?: BiologicalSex | null;
  pregnancyStatus?: PregnancyStatus | null;
  pregnancyDueDate?: string | null;
  occupation?: string | null;
  bio?: string | null;
  heightCm?: number;
  weightKg?: number;
  activityLevel?: ActivityLevel | null;
  experienceLevel?: FitnessExperience | null;
  primaryGoal?: PrimaryGoal | null;
  medications?: AdminMedication[];
  limitations?: AdminLimitation[];
}

/**
 * Patient goals update payload.
 */
export interface PatientGoalsUpdatePayload {
  calorieTarget?: number;
  proteinTarget?: number;
  carbTarget?: number;
  fatTarget?: number;
  workoutsPerWeek?: number;
  sleepHoursTarget?: number;
  weeklyWeightChangeTarget?: number;
}

/**
 * Admin controls update payload for tier, role, and status changes.
 */
export interface PatientAdminControlsPayload {
  tier?: UserTier | null;
  role?: UserRole | null;
  assignedClinicianId?: string | null;
  accountStatus?: AccountStatus;
  timezone?: string | null;
}

// ============================================================================
// CLINICIAN MANAGEMENT TYPES
// ============================================================================

/**
 * Summary view of a clinician for list displays.
 */
export interface ClinicianSummary {
  id: string;
  name: string;
  role: UserRole;
  specialty: string;
}

/**
 * Availability slot for clinician scheduling.
 */
export interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

/**
 * Clinician availability response.
 */
export interface ClinicianAvailability {
  clinicianId: string;
  slots: AvailabilitySlot[];
}

/**
 * Provider schedule slot.
 */
export interface ProviderScheduleSlot {
  dayOfWeek: number;
  startHour: number;
  endHour: number;
  isAvailable?: boolean;
}

/**
 * Provider schedule data with availability slots.
 */
export interface ProviderScheduleData {
  providerId: string;
  slots: ProviderScheduleSlot[];
}

// ============================================================================
// REGISTRATION TYPES
// ============================================================================

/**
 * Prefilled profile data for registration.
 */
export interface PrefilledProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  heightCm?: number;
  weightKg?: number;
  dateOfBirth?: string;
  sex?: BiologicalSex;
  goals?: string;
}

/**
 * Registered user with barcode for onboarding flow.
 */
export interface RegisteredUser {
  id: string;
  barcode: string;
  prefilledEmail?: string | null;
  prefilledTier?: UserTier | null;
  prefilledProfile?: PrefilledProfile | null;
  isRegistered: boolean;
  registrationExpiresAt: string;
  createdAt: string;
  registeredBy?: { id: string; email: string } | null;
}

/**
 * Payload for creating a new registration.
 */
export interface CreateRegistrationPayload {
  email?: string;
  tier?: UserTier;
  profile?: PrefilledProfile;
  expiresInDays?: number;
}

// ============================================================================
// TRAINING STRATEGY TYPES
// ============================================================================

/**
 * Input for creating a training phase.
 */
export interface CreatePhaseInput {
  name: string;
  order: number;
  weekCount: number;
  intensityRange?: string;
  volumeLevel?: VolumeLevel;
  focusAreas: string[];
  notes?: string;
  isActive: boolean;
  isCompleted: boolean;
}

/**
 * Input for creating a strategy goal.
 */
export interface CreateGoalInput {
  goalMetric: GoalMetricKey;
  goalTarget: number;
  baselineValue?: number;
  weight?: number;
  linkedExerciseId?: string;
}

/**
 * Input for updating a strategy goal.
 */
export interface UpdateGoalInput {
  goalTarget?: number;
  baselineValue?: number;
  currentValue?: number;
  weight?: number;
}

/**
 * Input for creating a training strategy.
 */
export interface CreateStrategyInput {
  name: string;
  type: StrategyType;
  goal: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status?: StrategyStatus;
  goals: CreateGoalInput[];
  phases?: CreatePhaseInput[];
}

/**
 * Request to fetch a goal value from a data source.
 */
export interface FetchValueRequest {
  dataSource: GoalDataSource;
  dataKey: string;
  linkedExerciseId?: string;
}

/**
 * Response from fetching a goal value.
 */
export interface FetchValueResponse {
  found: boolean;
  value: number | null;
  date: string | null;
}

// ============================================================================
// WORKOUT GENERATION TYPES
// ============================================================================

/**
 * Workout generation progress update.
 */
export interface WorkoutGenerationProgress {
  step: number;
  totalSteps: number;
  phase: string;
  detail?: string;
}

/**
 * Workout plan SSE generation parameters.
 */
export interface WorkoutPlanGenerationParams {
  userId: string;
  weekStartDate: string;
  customPrompt?: string;
  overwriteMode?: 'overwrite' | 'fillEmpty';
  signal?: AbortSignal;
  onProgress?: (progress: WorkoutGenerationProgress) => void;
}

// ============================================================================
// NUTRITION GENERATION TYPES
// ============================================================================

/**
 * Nutrition preferences for plan generation.
 */
export interface NutritionPreferences {
  dietaryRestrictions?: string[];
  allergies?: string[];
  mealCount?: number;
  cuisinePreferences?: string[];
}

/**
 * Macro targets for nutrition planning.
 */
export interface MacroTargets {
  dailyCalories?: number;
  proteinGrams?: number;
  carbsGrams?: number;
  fatGrams?: number;
}

/**
 * Nutrition plan generation request payload.
 */
export interface NutritionPlanGenerationRequest {
  userId: string;
  weekStartDate?: string;
  customPrompt?: string;
  goals?: string[];
  preferences?: NutritionPreferences;
  macroTargets?: MacroTargets;
}

// ============================================================================
// LAB RESULT TYPES
// ============================================================================

/**
 * Lab panel entry for creating lab results.
 */
export interface LabPanelEntry {
  key: string;
  value: number;
  unit: string;
  source: string;
}

/**
 * Lab panel creation payload.
 */
export interface CreateLabPanelPayload {
  panelType: string;
  drawDate: string;
  labName?: string;
  orderId?: string;
  entries: LabPanelEntry[];
}

/**
 * Extracted lab result from PDF/image parsing.
 */
export interface ExtractedLabResult {
  key: string;
  value: number | string | null;
  unit: string;
}

/**
 * Lab data extraction response.
 */
export interface LabDataExtractionResult {
  results: ExtractedLabResult[];
}

// ============================================================================
// INTAKE & QUESTIONNAIRE TYPES
// ============================================================================

/**
 * Intake questionnaire response.
 */
export interface IntakeQuestionnaireResponse {
  userId: string;
  completedAt?: string;
  responses: Record<string, string | number | boolean | string[]>;
}

/**
 * Client intake submission payload.
 */
export interface ClientIntakePayload {
  goals: string;
  experienceLevel: string;
  injuries?: string;
  preferences?: string;
  limitations?: string;
  medicalConditions?: string;
}

// ============================================================================
// EXERCISE FILTER TYPES
// ============================================================================

/**
 * Exercise filter options for API queries.
 */
export interface ExerciseFilterParams {
  search?: string;
  category?: string;
  muscleGroup?: string;
  equipment?: string;
  difficulty?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

/**
 * Admin analytics dashboard data.
 * Note: Full analytics types are in the CRMAnalytics contract.
 */
export interface AdminAnalyticsData {
  totalPatients: number;
  activePatients: number;
  newPatientsThisMonth: number;
  averageComplianceScore: number;
  appointmentsToday: number;
  pendingLabReviews: number;
}
