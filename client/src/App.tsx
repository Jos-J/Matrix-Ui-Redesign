// src/App.tsx
import { useMemo, useState } from "react";
import type { CustomerId, TicketId } from "./domain/types";
import { seedState } from "./state/seed";
import { getDecision, setDecision } from "./state/reviewModel";
import { loadState, saveState, clearSavedState } from "./storage/localStorage";

export default function App() {
  const initial = useMemo(() => loadState() ?? seedState, []);
  const [state, setState] = useState(initial);

  const [ticketId, setTicketId] = useState<TicketId>(state.tickets[0]?.id ?? "");
  const [customerId, setCustomerId] = useState<CustomerId>(state.customers[0]?.id ?? "");
  const [comment, setComment] = useState("");

  const decision = getDecision(state, ticketId, customerId);

  const apply = (nextStatus: "pass" | "fail" | "empty") => {
    const res = setDecision(state, ticketId, customerId, nextStatus, comment);
    if (!res.ok) {
      alert(res.error);
      return;
    }
    setState(res.state);
    saveState(res.state);

    // optional: clear comment box after save
    setComment("");
  };

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif", maxWidth: 700 }}>
      <h1>Dev Harness — Review Model</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <label>
          Ticket{" "}
          <select value={ticketId} onChange={(e) => setTicketId(e.target.value)}>
            {state.tickets.map((t) => (
              <option key={t.id} value={t.id}>
                #{t.ticketNumber}
              </option>
            ))}
          </select>
        </label>

        <label>
          Customer{" "}
          <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            {state.customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
        <div>
          <strong>Current decision:</strong> {decision.status.toUpperCase()}
        </div>
        <div>
          <strong>Comment:</strong> {decision.comment ?? "(none)"}
        </div>
        <div>
          <strong>Updated:</strong> {decision.updatedAt ?? "(n/a)"}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label>
          Comment (required for Fail):{" "}
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
            placeholder="Required if you choose Fail"
          />
        </label>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => apply("pass")}>Pass</button>
        <button onClick={() => apply("fail")}>Fail</button>
        <button onClick={() => apply("empty")}>Clear (Empty)</button>
        <button
          onClick={() => {
            clearSavedState();
            setState(seedState);
            setTicketId(seedState.tickets[0]?.id ?? "");
            setCustomerId(seedState.customers[0]?.id ?? "");
            setComment("");
          }}
          style={{ marginLeft: "auto" }}
        >
          Reset Storage
        </button>
      </div>

      <pre style={{ marginTop: 16, background: "#f6f8fa", padding: 12, borderRadius: 8 }}>
        {JSON.stringify(state.decisions, null, 2)}
      </pre>
    </div>
  );
}



