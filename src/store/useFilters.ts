import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Action {
  setFilters: (module: string, filters: any[]) => void;
  clearFilters: (module: string) => void;
  setOptionsByKey: (module: string, key: string | number, newOptionSelected: any[]) => void;
}

interface State {
  filters: {
    [module: string]: any[];
  };
  computed: {
    getFilters: (module: string) => any[];
  };
}

// Create your store, which includes both state and (optionally) actions
export const useFilters = create<State & Action>()(
  devtools((set, get) => ({
    filters: {
      billingFilters: [],
      workerFilters: [],
    },

    // Getters
    computed: {
      getFilters: (module: string) => {
        return get().filters[module] || [];
      },
    },

    // Actions
    setFilters: (module: string, filters: any[]) =>
      set((state) => ({
        ...state,
        filters: {
          ...state.filters,
          [module]: filters,
        },
      })),
    setOptionsByKey: (module: string, key: string | number, newOptionSelected: any[]) =>
      set((state) => {
        const filters = state.filters[module] || [];
        const keyIndex = filters.findIndex((filter) => filter.key === key);
        if (keyIndex !== -1) {
          filters[keyIndex].optionsSelected = newOptionSelected;
        }
        return {
          ...state,
          filters: {
            ...state.filters,
            [module]: filters,
          },
        };
      }),
    clearFilters: (module: string) =>
      set((state) => ({
        ...state,
        filters: {
          ...state.filters,
          [module]: [],
        },
      })),
  }))
);