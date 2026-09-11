import { Injectable } from '@angular/core';

export interface RfqContext {
  no: string;          // 6-digit RFQ number
  customer: string;
  equipment: string;
  equipType: string;
  currency: string;    // 'USD' | 'CAD'
  commodity: string;
  weight: string;      // lbs, without unit
  cargoType: string;
  deadline: string;
  status: string;      // 'Open' | 'Closed'
  lanesCount: number;
}

@Injectable({ providedIn: 'root' })
export class RfqContextService {
  current: RfqContext | null = null;
}
