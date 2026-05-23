import { create } from 'zustand';
import { MOCK_ESCALATIONS, MOCK_FOLLOWUPS } from '../mock';

interface AppState {
  resolvedEscalationIds: string[];
  completedFollowUpIds: string[];
  resolveEscalation: (id: string) => void;
  completeFollowUp: (id: string) => void;
  activeEscalationCount: () => number;
  pendingFollowUpCount: () => number;
}

export const useAppStore = create<AppState>((set, get) => ({
  resolvedEscalationIds: [],
  completedFollowUpIds: [],

  resolveEscalation: (id: string) =>
    set((state) => ({
      resolvedEscalationIds: [...state.resolvedEscalationIds, id],
    })),

  completeFollowUp: (id: string) =>
    set((state) => ({
      completedFollowUpIds: [...state.completedFollowUpIds, id],
    })),

  activeEscalationCount: () => {
    const { resolvedEscalationIds } = get();
    return MOCK_ESCALATIONS.filter(
      (e) => !e.resolved && !resolvedEscalationIds.includes(e.id)
    ).length;
  },

  pendingFollowUpCount: () => {
    const { completedFollowUpIds } = get();
    return MOCK_FOLLOWUPS.filter(
      (f) => !f.done && !completedFollowUpIds.includes(f.id)
    ).length;
  },
}));
