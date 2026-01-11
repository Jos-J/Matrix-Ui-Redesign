// src/domain/types.ts

export type TicketId = string;
export type CustomerId = string;

export type ReviewStatus = "empty" | "pass" | "fail";

export interface Ticket {
  id: TicketId;
  ticketNumber: string; // what you display on the left
  summary?: string;
}

export interface Customer {
  id: CustomerId;
  name: string; // what you display in the column header
}

export interface ReviewDecision {
  status: ReviewStatus;
  comment: string | null;
  updatedAt?: string; // ISO string for easy persistence
}

export type DecisionKey = string;

/**
 * Canonical app state (source of truth)
 */
export interface ReviewState {
  tickets: Ticket[];
  customers: Customer[];
  /**
   * decisions map keyed by (ticketId, customerId)
   * only store entries when status !== "empty" (recommended)
   */
  decisions: Record<DecisionKey, ReviewDecision>;
}
