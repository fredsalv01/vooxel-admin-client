export type BillingRequestPost = {
  clientId: number;
  documentType: string;
  documentNumber: string;
  startDate: string;
  paymentDeadline: string;
  serviceId: number;
  descripcion: string;
  purchaseOrderNumber: string;
  currency: string;
  currencyValue: number;
  amount: number;
  hasIGV: boolean;
  igv: number;
  total: number;
  billingState: string;
  expirationDate: string;
  hashes: boolean;
  hes: string;
  accumulatedDays?: number; // only client
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


