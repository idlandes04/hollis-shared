/**
 * @ai-context Mobile session contracts | Types for mobile session management
 *
 * CONCIERGE tier gets 2 free mobile sessions/month (cap at 4).
 * A-la-carte sessions are $80 each and never expire.
 *
 * deps: zod | consumers: server routes, web-admin
 */

import { z } from "zod";

// ============================================================================
// MOBILE SESSION BALANCE
// ============================================================================

export const MobileSessionBalanceSchema = z.object({
  /** userId uses HH-XXXXXX barcode format, not UUID */
  userId: z.string().min(1),
  freeAllocationPerMonth: z.number().int(),
  freeAvailable: z.number().int(),
  freeMaxRollover: z.number().int(),
  paidBalance: z.number().int(),
  totalAvailable: z.number().int(),
  lastFreeResetDate: z.string().nullable(),
});
export type MobileSessionBalanceContract = z.infer<
  typeof MobileSessionBalanceSchema
>;
/** @deprecated Use MobileSessionBalanceContract */
export type MobileSessionBalance = MobileSessionBalanceContract;

// ============================================================================
// MOBILE SESSION USAGE
// ============================================================================

export const MOBILE_SESSION_SOURCES = [
  "TIER_ALLOCATION",
  "A_LA_CARTE",
] as const;

export type MobileSessionSource = (typeof MOBILE_SESSION_SOURCES)[number];

export const MobileSessionUsageSchema = z.object({
  id: z.string().uuid(),
  /** userId uses HH-XXXXXX barcode format, not UUID */
  userId: z.string().min(1),
  source: z.enum(MOBILE_SESSION_SOURCES),
  usedAt: z.string(),
  appointmentId: z.string().nullable(),
  notes: z.string().nullable(),
});
export type MobileSessionUsageContract = z.infer<
  typeof MobileSessionUsageSchema
>;
/** @deprecated Use MobileSessionUsageContract */
export type MobileSessionUsage = MobileSessionUsageContract;

// ============================================================================
// PURCHASE REQUEST
// ============================================================================

export const PurchaseMobileSessionsRequestSchema = z.object({
  quantity: z.number().int().positive().max(10), // Max 10 at once
});
export type PurchaseMobileSessionsRequest = z.infer<
  typeof PurchaseMobileSessionsRequestSchema
>;

// ============================================================================
// PURCHASE RESPONSE
// ============================================================================

export const MobileSessionPurchaseSchema = z.object({
  id: z.string().uuid(),
  /** userId uses HH-XXXXXX barcode format, not UUID */
  userId: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPriceInCents: z.number().int(),
  totalInCents: z.number().int(),
  purchasedAt: z.string(),
});
export type MobileSessionPurchaseContract = z.infer<
  typeof MobileSessionPurchaseSchema
>;
/** @deprecated Use MobileSessionPurchaseContract */
export type MobileSessionPurchase = MobileSessionPurchaseContract;

// ============================================================================
// CONSTANTS
// ============================================================================

/** Price per mobile session in cents ($80) */
export const MOBILE_SESSION_PRICE_CENTS = 8000;

/** Maximum free mobile sessions that can accumulate */
export const MOBILE_SESSION_FREE_MAX = 4;

/** Free mobile sessions per month for CONCIERGE */
export const MOBILE_SESSION_CONCIERGE_MONTHLY = 2;
