# Matrix UI Redesign — Master Roadmap (Definition + Implementation)

> **Purpose:** Define, build, and verify the redesigned matrix UI in one structured, lockstep plan.

---

## Phase 0 — Ground Rules (Lock Before Building)

- [X] Confirm no backend integration (UI-only)
- [X] Confirm persistence strategy (localStorage / IndexedDB / file)
- [X] Confirm Pass / Fail vocabulary set
- [X] Confirm Fail → comment required rule (non-negotiable)

---

## Phase 1 — Matrix Behavior & State Rules (Define → Implement)

- [X] **1. Cell interaction rules**
  - [X] Define click behavior (empty / pass / fail)
  - [X] Implement cell click handling
  - [X] Verify behavior matches definition

- [X] **2. Allowed state transitions**
  - [X] Define legal transitions
  - [X] Implement transition guards
  - [X] Prevent illegal states in UI

- [x] **3. Data persistence**
  - [x] Define storage method
  - [x] Implement load on app start
  - [x] Implement save on change
  - [x] Verify refresh retains data

---

## Phase 2 — Project & Domain Foundation

- [ ] **4. Project setup**
  - [ ] Create Vite + TypeScript project
  - [ ] Clean template files
  - [ ] Verify dev/build workflow

- [ ] **5. Domain models**
  - [ ] Ticket model
  - [ ] Customer model
  - [ ] Review state model
  - [ ] Enforce Fail → comment rule in types

---

## Phase 3 — Matrix Core UI (Define → Implement)

- [ ] **6. Matrix layout**
  - [ ] Define layout constraints (scroll, sticky)
  - [ ] Render ticket rows
  - [ ] Render customer columns
  - [ ] Implement sticky header / column

- [ ] **7. Matrix cell visuals**
  - [ ] Define icon usage
  - [ ] Render empty / pass / fail states
  - [ ] Render comment indicators
  - [ ] Verify visual clarity at a glance

---

## Phase 4 — Cell Modal (Primary Editing Surface)

- [ ] **8. Cell modal structure**
  - [ ] Define modal contents
  - [ ] Implement modal container
  - [ ] Display ticket + customer context

- [ ] **9. Decision & validation logic**
  - [ ] Implement Pass / Fail selection
  - [ ] Show comment field on Fail
  - [ ] Enforce required comment
  - [ ] Disable Save until valid

- [ ] **10. Modal actions**
  - [ ] Save commits changes
  - [ ] Cancel discards changes
  - [ ] Unsaved changes warning
  - [ ] Esc key support

---

## Phase 5 — Row & Column Panels (Secondary Navigation)

- [ ] **11. Ticket row panel**
  - [ ] Define panel scope
  - [ ] Implement ticket summary view
  - [ ] Show customer status overview
  - [ ] Navigate to cell modal

- [ ] **12. Customer column panel**
  - [ ] Define panel scope
  - [ ] Implement ticket list view
  - [ ] Filters (All / Incomplete / Failed)
  - [ ] Navigate to cell modal

- [ ] **13. Panel behavior**
  - [ ] Define open/close rules
  - [ ] Implement single-panel rule
  - [ ] Keyboard close support

---

## Phase 6 — Feedback, Errors & Confirmations

- [ ] **14. Validation feedback**
  - [ ] Define error messaging
  - [ ] Implement inline validation
  - [ ] Ensure errors clear correctly

- [ ] **15. Confirmation dialogs**
  - [ ] Define confirmation thresholds
  - [ ] Implement bulk action confirmations
  - [ ] Implement data loss warnings

---

## Phase 7 — Accessibility & Power Use

- [ ] **16. Keyboard interaction**
  - [ ] Enter = Save
  - [ ] Esc = Cancel
  - [ ] Focus management in modal
  - [ ] Optional arrow navigation

- [ ] **17. Accessibility checks**
  - [ ] Color contrast verified
  - [ ] Icons not color-only
  - [ ] Focus states visible
  - [ ] Screen reader labels where needed

---

## Phase 8 — Polish, Performance & Stability

- [ ] **18. Visual polish**
  - [ ] Consistent spacing
  - [ ] Icon alignment
  - [ ] Hover and active states

- [ ] **19. Performance**
  - [ ] Large matrix rendering tested
  - [ ] Avoid unnecessary re-renders
  - [ ] Modal open/close smooth

---

## Phase 9 — Final Verification & Lock

- [ ] **20. Workflow validation**
  - [ ] One ticket → many customers
  - [ ] One customer → many tickets
  - [ ] Mixed review workflow

- [ ] **21. Success criteria met**
  - [ ] No new windows open
  - [ ] All decisions visible in matrix
  - [ ] Fail always requires comment
  - [ ] Faster than legacy UI

---

## Explicitly Out of Scope (v1)

- [ ] No backend
- [ ] No authentication
- [ ] No real-time collaboration
- [ ] No audit history
- [ ] No undo stack

---

## Done Definition

The redesign is complete when:
- Users never leave the matrix to make decisions
- Status is visible without clicking
- Review work is faster and clearer than before
