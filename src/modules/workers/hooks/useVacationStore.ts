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
  quantity: number;
  vacationId?: number;
  // isActive: boolean;
}

interface Action {
  setVacation: (vacation: Vacation) => void;
  setVacationDetails: (vacationDetail: VacationDetail[]) => void;
  addVacationDetail: (vacationDetail: VacationDetail) => void;
  removeVacationDetail: (vacationDetail: VacationDetail) => void;
  getVacationDetailByIndex: (index: number) => VacationDetail | undefined; // Getter function
  setVacationDetailByIndex: (index: number, args: any) => VacationDetail | undefined; // Getter function
  removeVacationDetailByIndex: (index: number) => void;
}

interface State {
  vacation: Vacation;
  vacationDetails: VacationDetail[];

  computed: {
    get accumulatedVac(): number;
    get takenVac(): number;
    get remainingVac(): number;
    get expiredDays(): number;
    get vacationDetails(): VacationDetail[];
  }
}


// Create your store, which includes both state and (optionally) actions
export const useVacationStore = create<State & Action>()(devtools((set, get) => ({
  vacation: {
    id: 0,
    plannedVacations: 0,
    accumulatedVacations: 0,
    takenVacations: 0,
    remainingVacations: 0,
    expiredDays: 0,
    workerId: 0,
    isActive: false,
  },

  vacationDetails: [],

  // Getters
  computed: {
    get accumulatedVac() {
      return get()?.vacation?.accumulatedVacations;
    },
    get takenVac() {
      return get()?.vacation?.takenVacations;
    },
    get remainingVac() {
      return get()?.vacation?.remainingVacations;
    },
    get expiredDays() {
      return get()?.vacation?.expiredDays;
    },
    get vacationDetails() {
      return get()?.vacationDetails;
    },
  },

  // Actions
  setVacation: (vacation) => set((state) => ({ ...state, vacation })),
  setVacationDetails: (vacationDetails) => set((state) => ({
    ...state, vacationDetails: vacationDetails.map(
      (vd: VacationDetail, index: number) => ({ ...vd, index: index })
    )
  })),
  addVacationDetail: (vacationDetail) => set((state) => ({ ...state, vacationDetails: [...state.vacationDetails, vacationDetail] })),
  removeVacationDetail: (vacationDetail) => set((state) => ({ ...state, vacationDetails: state.vacationDetails.filter((vd, index) => vd.id !== vacationDetail.id) })),
  getVacationDetailByIndex: (index) => get().vacationDetails.find((vd) => vd.index === index),
  setVacationDetailByIndex: (index, args) => {
    const vacationDetail = get().vacationDetails.find((vd) => vd.index === index);
    // If the vacationDetail is not found, return undefined
    if (!vacationDetail) return undefined;
    // If there are no arguments, return the vacationDetail
    if (!Object.keys(args).length) return vacationDetail;
    // If there are arguments, update the vacationDetail and return it
    set((state) => ({
      ...state,
      vacationDetails: state.vacationDetails.map((vd) => vd.index === index ? { ...vd, ...args } : vd)
    }))
  },
  removeVacationDetailByIndex: (index) => set((state) => ({ ...state, vacationDetails: state.vacationDetails.filter((vd) => vd.index !== index) })),
})))