import { Injectable } from '@angular/core';

export interface QuoteContext {
  number: string;
  customer: string;
  origin: string;
  destination: string;
  amount?: string;
  status?: string;
  currency?: string;   // 'USD' | 'CAD'
}

@Injectable({ providedIn: 'root' })
export class QuoteContextService {
  current: QuoteContext | null = null;
}
