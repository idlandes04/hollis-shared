/**
 * @ai-context Lab domain contracts | lab result statuses and flags
 *
 * This module provides the canonical definitions for lab-related constants:
 * - Lab result statuses (preliminary, final, corrected, cancelled)
 * - Lab result flags (normal, low, high, critical_low, critical_high)
 *
 * IMPORTANT: All lab-related enum values MUST be imported from here.
 *
 * deps: zod | consumers: all codebases
 */

import { z } from 'zod';

// ============================================================================
// LAB RESULT STATUS (Domain Constants Pattern)
// ============================================================================

/** Tuple of valid lab result status values (source of truth) */
export const LAB_RESULT_STATUSES = ['preliminary', 'final', 'corrected', 'cancelled'] as const;
export type LabResultStatus = (typeof LAB_RESULT_STATUSES)[number];

/** Zod schema for lab result status - derived from tuple */
export const LabResultStatusSchema = z.enum(LAB_RESULT_STATUSES);

/** Constant object for lab result status comparisons */
export const LAB_RESULT_STATUS = {
  PRELIMINARY: 'preliminary' as LabResultStatus,
  FINAL: 'final' as LabResultStatus,
  CORRECTED: 'corrected' as LabResultStatus,
  CANCELLED: 'cancelled' as LabResultStatus,
} as const;

/** Human-readable labels for lab result statuses */
export const LAB_RESULT_STATUS_LABELS: Record<LabResultStatus, string> = {
  preliminary: 'Preliminary',
  final: 'Final',
  corrected: 'Corrected',
  cancelled: 'Cancelled',
};

/**
 * Type guard to check if a string is a valid lab result status
 */
export function isLabResultStatus(value: string): value is LabResultStatus {
  return (LAB_RESULT_STATUSES as readonly string[]).includes(value);
}

// ============================================================================
// LAB RESULT FLAG (Domain Constants Pattern)
// ============================================================================

/** Tuple of valid lab result flag values (source of truth) */
export const LAB_RESULT_FLAGS = ['normal', 'low', 'high', 'critical_low', 'critical_high'] as const;
export type LabResultFlag = (typeof LAB_RESULT_FLAGS)[number];

/** Zod schema for lab result flag - derived from tuple */
export const LabResultFlagSchema = z.enum(LAB_RESULT_FLAGS);

/** Constant object for lab result flag comparisons */
export const LAB_RESULT_FLAG = {
  NORMAL: 'normal' as LabResultFlag,
  LOW: 'low' as LabResultFlag,
  HIGH: 'high' as LabResultFlag,
  CRITICAL_LOW: 'critical_low' as LabResultFlag,
  CRITICAL_HIGH: 'critical_high' as LabResultFlag,
} as const;

/** Human-readable labels for lab result flags */
export const LAB_RESULT_FLAG_LABELS: Record<LabResultFlag, string> = {
  normal: 'Normal',
  low: 'Low',
  high: 'High',
  critical_low: 'Critical Low',
  critical_high: 'Critical High',
};

/**
 * Type guard to check if a string is a valid lab result flag
 */
export function isLabResultFlag(value: string): value is LabResultFlag {
  return (LAB_RESULT_FLAGS as readonly string[]).includes(value);
}
