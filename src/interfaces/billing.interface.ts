export type BillingRequestPost = {
  clientName: string;
  documentType: string;
  documentNumber: string;
  startDate: Date;
  paymentDeadline: Date;
  serviceType: string;
  descripcion: null;
  purchaseOrderNumber: null;
  currency: string;
  currencyValue: number;
  amount: number;
  hasIGV: boolean;
  igv: number;
  total: number;
  billingState: string;
  expirationDate: Date;
  accumulatedDays: number;
  hashes: boolean;
  hes: string;
}
