import { Injectable } from '@angular/core';
import { Cell } from './mock-data';

export interface CarrierBid {
  lane?: string;
  trailer?: string;
  transit?: string;
  histAvg?: string;
  activeQuote?: string;
  status?: string;
  statusTone?: string;
}

export interface CarrierCtx {
  name: string;
  mc: string;
  color: string;
  state: string;   // 'Verified' | 'Pending' | 'Under review'
  type?: string;
  onTime?: string;
  loads?: string;
  bid?: CarrierBid | null;   // set when opened from a carrier quote
}

@Injectable({ providedIn: 'root' })
export class DetailContextService {
  loadRow: Record<string, Cell> | null = null;
  traceRow: Record<string, Cell> | null = null;
  carrier: CarrierCtx | null = null;
}
