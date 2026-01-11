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

export const emptyDecision = (): ReviewDecision => ({
  status: "empty",
  comment: null,
});

export const getDecision = (
  state: ReviewState,
  ticketId: TicketId,
  customerId: CustomerId
): ReviewDecision => {
  const key = makeDecisionKey(ticketId, customerId);
  return state.decisions[key] ?? emptyDecision();
};

export type SetDecisionResult =
  | { ok: true; state: ReviewState }
  | { ok: false; error: string };

const nowIso = (): string => new Date().toISOString();

const isNonEmpty = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

/**
 * The ONE place decisions are updated.
 * Enforces rules:
 * - If status === "fail" -> comment is required and must be non-empty
 * - If status !== "fail" -> comment is cleared to null
 * - If status === "empty" -> entry is removed from map (recommended)
 */
export const setDecision = (
  state: ReviewState,
  ticketId: TicketId,
  customerId: CustomerId,
  nextStatus: ReviewStatus,
  comment?: string | null
): SetDecisionResult => {
  const key = makeDecisionKey(ticketId, customerId);

  // Validate inputs
  if (nextStatus === "fail" && !isNonEmpty(comment)) {
    return { ok: false, error: "A comment is required when marking a ticket as Fail." };
  }

  // Build the next decision value
  const nextDecision: ReviewDecision = {
    status: nextStatus,
    comment: nextStatus === "fail" ? comment!.trim() : null,
    updatedAt: nowIso(),
  };

  // Copy decisions map immutably
  const nextDecisions = { ...state.decisions };

  // Recommended: don't store "empty" decisions at all
  if (nextStatus === "empty") {
    delete nextDecisions[key];
  } else {
    nextDecisions[key] = nextDecision;
  }

  return {
    ok: true,
    state: {
      ...state,
      decisions: nextDecisions,
    },
  };
};

/**
 * Optional helper if you want explicit clearing later.
 */
export const clearAllDecisions = (state: ReviewState): ReviewState => ({
  ...state,
  decisions: {},
});
