export interface Carrier {
  id: string;
  name: string;
  monogram: string;
  color: string;
  mc: string;
  kind: 'asset' | 'brokered';
  trailer: string;
  transitDays: number;
  onTime: number;          // %
  histAvg: number;
  activeQuote: number | null;  // null => awaiting
  selected: boolean;       // awarded / highlighted
  checked: boolean;        // row checkbox (for email)
}

export interface DeliveryRow {
  load: string;
  lane: string;
  date: string;
  rate: string;
  status: 'Delivered' | 'Cancelled';
}

export interface Metric {
  label: string;
  value: string;
  state: 'normal' | 'good' | 'bad';
  sub?: string;
}

export interface CarrierDetail {
  name: string;
  monogram: string;
  color: string;
  mc: string;
  contact: { name: string; title: string; phone: string; email: string };
  address: string[];
  primary: Metric[];       // deliveries / cancelled / on-time
  failures: Metric[];      // otp / otd / comms / claims
  activity: { label: string; value: number; current?: boolean }[];
  deliveries: DeliveryRow[];
  deliveriesTotal: number;
}
