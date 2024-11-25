import { toDateFromDatePicker } from '../lib/helpers/utils';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Action {
  setFilters: (module: string, filters: any[]) => void;
  clearFilters: (module: string, arrayFilters: any, uniqueValues: any) => void;
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
    clearFilters: (module: string, arrayFilters: any[], uniqueValues: any[]) => {
      const properties: any = []
      for (const element of arrayFilters) {
        let data: any = {
          name: element.name,
          key: element.key,
          type: element.type ?? 'text',
        }

        switch (element.type) {
          case 'array':
            data.options = uniqueValues[element.key] ?? []
            data.optionsSelected = []
            break

          case 'date':
            data.optionsSelected = null
            break

          default:
            break
        }

        properties.push(data)
      }

      set((state) => ({
        ...state,
        filters: {
          ...state.filters,
          [module]: properties,
        },
      }))
    },

    prepareFiltersToSend: (module: string) => {
      let mutateFilters: any = {}
      const moduleFilter = get().filters[module] || []

      if (moduleFilter.length === 0) return {}
      moduleFilter.forEach((filter: any) => {
        if (filter.type === 'array' && filter.optionsSelected.length > 0) {
          mutateFilters[filter.key] = filter.optionsSelected
        } else if (
          filter.type === 'date' &&
          Object.keys(filter.optionsSelected || {}).length > 0
        ) {
          if (!mutateFilters['dates']) mutateFilters['dates'] = []

          const { start, end } = filter.optionsSelected

          mutateFilters['dates'].push({
            column: filter.key,
            start_date: start ? toDateFromDatePicker(start)?.toString() : null,
            end_date: end ? toDateFromDatePicker(end)?.toString() : null,
          })
        }
      })
      return mutateFilters
    }
  }))
);