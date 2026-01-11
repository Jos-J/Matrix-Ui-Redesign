// src/state/reviewModel.ts

import type {
  CustomerId,
  DecisionKey,
  ReviewDecision,
  ReviewState,
  ReviewStatus,
  TicketId,
} from "../domain/types";

export const makeDecisionKey = (ticketId: TicketId, customerId: CustomerId): DecisionKey =>
  `${ticketId}:${customerId}`;

// Optional: stable singleton empty decision
const EMPTY_DECISION: ReviewDecision = { status: "empty", comment: null };

export const emptyDecision = (): ReviewDecision => EMPTY_DECISION;

export const getDecision = (
  state: ReviewState,
  ticketId: TicketId,
  customerId: CustomerId
): ReviewDecision => {
  const key = makeDecisionKey(ticketId, customerId);
  return state.decisions[key] ?? EMPTY_DECISION;
};

export type SetDecisionResult =
  | { ok: true; state: ReviewState }
  | { ok: false; error: string };

const nowIso = (): string => new Date().toISOString();

const isNonEmpty = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const hasTicket = (state: ReviewState, ticketId: TicketId) =>
  state.tickets.some((t) => t.id === ticketId);

const hasCustomer = (state: ReviewState, customerId: CustomerId) =>
  state.customers.some((c) => c.id === customerId);

/**
 * The ONE place decisions are updated.
 * Enforces rules:
 * - If status === "fail" -> comment is required and must be non-empty
 * - If status !== "fail" -> comment is cleared to null
 * - If status === "empty" -> entry is removed from map (recommended)
 * - ticketId/customerId must exist in state
 */
export const setDecision = (
  state: ReviewState,
  ticketId: TicketId,
  customerId: CustomerId,
  nextStatus: ReviewStatus,
  comment?: string | null
): SetDecisionResult => {
  if (!hasTicket(state, ticketId)) {
    return { ok: false, error: "Unknown ticketId. Cannot set a decision for a missing ticket." };
  }
  if (!hasCustomer(state, customerId)) {
    return { ok: false, error: "Unknown customerId. Cannot set a decision for a missing customer." };
  }

  const key = makeDecisionKey(ticketId, customerId);

  if (nextStatus === "fail" && !isNonEmpty(comment)) {
    return { ok: false, error: "A comment is required when marking a ticket as Fail." };
  }

  const nextDecision: ReviewDecision = {
    status: nextStatus,
    comment: nextStatus === "fail" ? comment!.trim() : null,
    updatedAt: nowIso(),
  };

  const nextDecisions = { ...state.decisions };

  if (nextStatus === "empty") {
    delete nextDecisions[key];
  } else {
    nextDecisions[key] = nextDecision;
  }

  return { ok: true, state: { ...state, decisions: nextDecisions } };
};

export const clearAllDecisions = (state: ReviewState): ReviewState => ({
  ...state,
  decisions: {},
});

