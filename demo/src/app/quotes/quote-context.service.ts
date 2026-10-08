import { Injectable } from '@angular/core';
import { AiProof } from '../sections/ai-proof';

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
  // AI dispatch proof to overlay on the quote workspace (null = not AI-made)
  aiProof: AiProof | null = null;
}
