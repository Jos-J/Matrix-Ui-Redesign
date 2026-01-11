// src/storage/localStorage.ts

import type { ReviewState } from "../domain/types";

const STORAGE_KEY = "matrix_review_state_v1";

export const loadState = (): ReviewState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ReviewState;
  } catch {
    return null;
  }
};

export const saveState = (state: ReviewState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage quota errors for now
  }
};

export const clearSavedState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};
