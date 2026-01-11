// src/state/seed.ts

import type { ReviewState } from "../domain/types";

export const seedState: ReviewState = {
  tickets: [
    { id: "t-1001", ticketNumber: "1001", summary: "Replace filter" },
    { id: "t-1002", ticketNumber: "1002", summary: "Inspect leak" },
    { id: "t-1003", ticketNumber: "1003", summary: "Verify wiring" },
  ],
  customers: [
    { id: "c-01", name: "Customer A" },
    { id: "c-02", name: "Customer B" },
    { id: "c-03", name: "Customer C" },
    { id: "c-04", name: "Customer D" },
    { id: "c-05", name: "Customer E" },
    // later you can expand to 15
  ],
  decisions: {}, // start empty (recommended)
};
