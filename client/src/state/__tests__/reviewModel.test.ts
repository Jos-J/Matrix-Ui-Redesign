// src/state/reviewModel.test.ts
import { describe, it, expect } from "vitest";
import type { ReviewState } from "@/domain/types";
import  { getDecision, setDecision, makeDecisionKey } from "@/state/reviewModel";

const baseState = (): ReviewState => ({
  tickets: [{ id: "t1", ticketNumber: "1001" }],
  customers: [{ id: "c1", name: "Customer A" }],
  decisions: {},
});

describe("reviewModel", () => {
  it("getDecision returns empty default when missing", () => {
    const state = baseState();
    const d = getDecision(state, "t1", "c1");
    expect(d.status).toBe("empty");
    expect(d.comment).toBeNull();
  });

  it("rejects fail when comment is missing/empty", () => {
    const state = baseState();

    const res1 = setDecision(state, "t1", "c1", "fail", "");
    expect(res1.ok).toBe(false);

    const res2 = setDecision(state, "t1", "c1", "fail", "   ");
    expect(res2.ok).toBe(false);

    const res3 = setDecision(state, "t1", "c1", "fail", null);
    expect(res3.ok).toBe(false);
  });

  it("stores fail with trimmed comment", () => {
    const state = baseState();
    const res = setDecision(state, "t1", "c1", "fail", "  bad data  ");
    expect(res.ok).toBe(true);
    if (!res.ok) return;

    const key = makeDecisionKey("t1", "c1");
    expect(res.state.decisions[key].status).toBe("fail");
    expect(res.state.decisions[key].comment).toBe("bad data");
    expect(res.state.decisions[key].updatedAt).toBeTruthy();
  });

  it("pass clears comment and stores pass", () => {
    const state = baseState();
    const res = setDecision(state, "t1", "c1", "pass", "ignored");
    expect(res.ok).toBe(true);
    if (!res.ok) return;

    const key = makeDecisionKey("t1", "c1");
    expect(res.state.decisions[key].status).toBe("pass");
    expect(res.state.decisions[key].comment).toBeNull();
  });

  it("empty removes the decision entry", () => {
    const state = baseState();
    const key = makeDecisionKey("t1", "c1");

    const res1 = setDecision(state, "t1", "c1", "pass");
    expect(res1.ok).toBe(true);
    if (!res1.ok) return;
    expect(res1.state.decisions[key]).toBeTruthy();

    const res2 = setDecision(res1.state, "t1", "c1", "empty");
    expect(res2.ok).toBe(true);
    if (!res2.ok) return;
    expect(res2.state.decisions[key]).toBeUndefined();
  });

  it("prevents ghost decisions for unknown ids (if enabled)", () => {
    const state = baseState();
    const res = setDecision(state, "missingTicket", "c1", "pass");
    expect(res.ok).toBe(false);
  });
});
