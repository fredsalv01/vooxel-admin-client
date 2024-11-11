import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Vacation {
  id: number;
  plannedVacations: number;
  accumulatedVacations: number;
  takenVacations: number;
  remainingVacations: number;
  expiredDays: number;
  workerId: number;
  isActive: boolean;
}

export interface VacationDetail {
  id?: number;
  index: number;
  vacationType: string;
  reason: string;
  startDate: string;
  endDate: string;
  quantity: number | string;
  vacationId?: number;
  // isActive: boolean;
}

interface Action {
  setFilters: (filters: any[]) => void;
  clearFilters: () => void;
}

interface State {
  filters: any[];
  computed: {
    get filters(): any[];
  }
}


// Create your store, which includes both state and (optionally) actions
export const useVacationStore = create<State & Action>()(devtools((set, get) => ({

  filters: [],

  // Getters
  computed: {
    get filters() {
      return get()?.filters;
    },
  },

  // Actions
  setFilters: (filters) => set((state) => ({ ...state, filters })),
  clearFilters: () => set((state) => ({ ...state, filters: [] })),
})))