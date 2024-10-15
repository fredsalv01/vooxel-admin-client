export type BillingRequestPost = {
  clientId: number;
  documentType: string;
  documentNumber: string;
  startDate: string;
  paymentDeadline: number;
  serviceId: number;
  description: string;
  purchaseOrderNumber: string;
  currency: string;
  conversionRate: number;
  amount: number;
  hasIGV: boolean;
  igv: string;
  total: number;
  billingState: string;
  billingStateDate?: string;
  expirationDate: string;
  hasHes?: boolean;
  hes: string;
  state2?: string | null;
  depositDate?: string | null;
  depositAmountDollars?: number | null;
  depositAmountSoles?: number | null;
  depositDate2?: string | null;
  depositAmountDollars2?: number | null;
  depositAmountSoles2?: number | null;
  accumulatedDays?: number | null; // only client
}

export interface BillingItem {
  id: number;
  clientName: string;
  documentType: string;
  documentNumber: string;
  startDate: Date;
  paymentDeadline: Date;
  description: null;
  purchaseOrderNumber: null;
  currency: string;
  currencyValue: string;
  amount: string;
  hasIGV: boolean;
  igv: string;
  total: string;
  billingState: string;
  billingStateDate: null;
  expirationDate: Date;
  accumulatedDays: number;
  hashes: boolean;
  hes: string;
  currencyConversionAmount: number;
  igvConversionDollars: number;
  totalAmountDollars: number;
  paymentMonth: null;
  createdAt: Date;
  updatedAt: Date;
  serviceName: string;
}


