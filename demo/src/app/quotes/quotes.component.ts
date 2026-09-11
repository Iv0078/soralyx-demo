import { Component, computed, signal } from '@angular/core';
import { NgClass, DecimalPipe, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrierModalComponent } from './carrier-modal.component';
import { buildCarrierDetail } from './carrier-detail';
import { QuoteContextService } from './quote-context.service';
import { Carrier, CarrierDetail } from './models';
import { EmailModalComponent } from '../shared/email-modal.component';
import { Router } from '@angular/router';
import { DetailContextService } from '../sections/detail-context.service';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [NgClass, DecimalPipe, FormsModule, CarrierModalComponent, EmailModalComponent],
  templateUrl: './quotes.component.html',
  styleUrl: './quotes.component.scss',
})
export class QuotesComponent {
  shipment = {
    customer: 'Northwind Traders',
    origin: 'Los Angeles, CA 90021',
    destination: 'Dallas, TX 75201',
    distance: 1435,
    weight: '42,000 lbs',
    trailer: 'Dry Van 53′',
    commodity: 'Consumer electronics',
    pickup: 'Sep 15, 08:00',
    delivery: 'Sep 17, 14:00',
  };

  // Pricing (editable) — seeded per quote in the constructor
  linehaul = signal(2650);
  fuel = signal(385);
  accessorials = signal(120);
  truckstopAvg = signal(2800);

  // Market rates for this quote (Individual rates cards + chart axis)
  rateTruckstop = signal(2800);
  rateSonar = signal(2760);
  rateSoralyx = signal(2740);
  axisHi = signal(2800);
  axisMid = signal(2600);
  axisLo = signal(2400);

  allIn = computed(() => this.linehaul() + this.fuel() + this.accessorials());
  spread = computed(() => this.allIn() - this.truckstopAvg());
  spreadPct = computed(() => this.truckstopAvg() ? (this.spread() / this.truckstopAvg()) * 100 : 0);
  perMileLinehaul = computed(() => this.linehaul() / this.shipment.distance);
  perMileFuel = computed(() => this.fuel() / this.shipment.distance);

  carriers: Carrier[] = [
    { id: 'c1', name: 'Carrier 1', monogram: 'C1', color: '#6E6FFD', mc: 'MC-448201', kind: 'asset',    trailer: 'Dry Van 53′', transitDays: 2, onTime: 96, histAvg: 2690, activeQuote: 2650, selected: true,  checked: true },
    { id: 'c2', name: 'Carrier 2', monogram: 'C2', color: '#3396CD', mc: 'MC-771043', kind: 'brokered',  trailer: 'Dry Van 53′', transitDays: 2, onTime: 94, histAvg: 2560, activeQuote: 2585, selected: false, checked: true },
    { id: 'c3', name: 'Carrier 3', monogram: 'C3', color: '#8f7bff', mc: 'MC-330918', kind: 'asset',    trailer: 'Dry Van 53′', transitDays: 3, onTime: 91, histAvg: 2780, activeQuote: 2740, selected: false, checked: false },
    { id: 'c4', name: 'Carrier 4', monogram: 'C4', color: '#5a6b8c', mc: 'MC-559277', kind: 'asset',    trailer: 'Dry Van 53′', transitDays: 2, onTime: 95, histAvg: 2720, activeQuote: null,  selected: false, checked: false },
  ];

  private static LANE_MI: Record<string, number> = {
    'Los Angeles|Dallas': 1435, 'Dallas|Memphis': 452, 'Los Angeles|Phoenix': 373,
    'Toronto|Buffalo': 100, 'Houston|New Orleans': 348, 'Detroit|Windsor': 20,
    'Chicago|Detroit': 283, 'Seattle|Boise': 496, 'Los Angeles|Las Vegas': 270,
  };
  private parseAmount(s?: string): number {
    if (!s) return 0;
    const n = parseFloat(s.replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
  }
  private applyQuote(base: number, origin: string, dest: string) {
    if (base > 0) {
      const lh = Math.round(base * 0.84), fu = Math.round(base * 0.12);
      this.linehaul.set(lh); this.fuel.set(fu); this.accessorials.set(Math.max(0, base - lh - fu));
      const ts = Math.round(base * 1.03), sn = Math.round(base * 1.01), sx = Math.round(base * 0.99);
      this.rateTruckstop.set(ts); this.rateSonar.set(sn); this.rateSoralyx.set(sx);
      this.truckstopAvg.set(ts);
      this.axisHi.set(Math.round(base * 1.06)); this.axisMid.set(Math.round(base)); this.axisLo.set(Math.round(base * 0.94));
      this.carriers = [
        { id: 'c1', name: 'Carrier 1', monogram: 'C1', color: '#6E6FFD', mc: 'MC-448201', kind: 'asset',   trailer: this.shipment.trailer, transitDays: 2, onTime: 96, histAvg: Math.round(base * 1.015), activeQuote: base,                    selected: true,  checked: true },
        { id: 'c2', name: 'Carrier 2', monogram: 'C2', color: '#3396CD', mc: 'MC-771043', kind: 'brokered', trailer: this.shipment.trailer, transitDays: 2, onTime: 94, histAvg: Math.round(base * 0.985), activeQuote: Math.round(base * 1.012), selected: false, checked: true },
        { id: 'c3', name: 'Carrier 3', monogram: 'C3', color: '#8f7bff', mc: 'MC-330918', kind: 'asset',   trailer: this.shipment.trailer, transitDays: 3, onTime: 91, histAvg: Math.round(base * 1.05),  activeQuote: Math.round(base * 1.03),  selected: false, checked: false },
        { id: 'c4', name: 'Carrier 4', monogram: 'C4', color: '#5a6b8c', mc: 'MC-559277', kind: 'asset',   trailer: this.shipment.trailer, transitDays: 2, onTime: 95, histAvg: Math.round(base * 1.02),  activeQuote: null,                    selected: false, checked: false },
      ];
    }
    const dist = QuotesComponent.LANE_MI[`${origin}|${dest}`] || (base > 0 ? Math.max(50, Math.round(base / 1.85)) : this.shipment.distance);
    this.shipment.distance = dist;
  }

  get allChecked(): boolean { return this.carriers.every(c => c.checked); }
  get someChecked(): boolean { return this.carriers.some(c => c.checked) && !this.allChecked; }
  toggleAll() { const v = !this.allChecked; this.carriers.forEach(c => c.checked = v); }

  // modal
  showModal = signal(false);
  detail: CarrierDetail | null = null;

  // email compose
  showEmail = signal(false);
  get emailTo() { return 'ops@' + this.shipment.customer.toLowerCase().replace(/[^a-z0-9]/g, '') + '.example'; }
  get emailSubject() { return `Quote ${this.quoteNumber()} — ${this.shipment.origin} → ${this.shipment.destination}`; }

  openedCarrier: Carrier | null = null;
  openCarrier(c: Carrier) {
    this.openedCarrier = c;
    this.detail = buildCarrierDetail({ name: c.name, monogram: c.monogram, color: c.color, mc: c.mc });
    this.showModal.set(true);
  }
  closeModal() { this.showModal.set(false); }
  expandCarrier() {
    this.showModal.set(false);
    const c = this.openedCarrier;
    if (c) {
      this.detailCtx.carrier = {
        name: c.name, mc: c.mc, color: c.color, state: 'Verified',
        bid: {
          lane: `${this.shipment.origin} → ${this.shipment.destination}`,
          trailer: c.trailer, transit: c.transitDays + ' d',
          histAvg: this.money0(c.histAvg),
          activeQuote: c.activeQuote !== null ? this.money0(c.activeQuote) : 'Awaiting',
          status: 'Active', statusTone: 'good',
        },
      };
    }
    this.router.navigate(['/carrier']);
  }

  // ---- Shipment edit mode (grayed until clicked) ----
  editingShip = signal(false);
  private shipSnapshot: typeof this.shipment | null = null;
  startEditShip() {
    if (this.editingShip()) return;
    this.shipSnapshot = { ...this.shipment };
    this.editingShip.set(true);
  }
  saveShip() { this.shipSnapshot = null; this.editingShip.set(false); }
  cancelShip() { if (this.shipSnapshot) this.shipment = { ...this.shipSnapshot }; this.editingShip.set(false); }

  quoteNumber = signal('4711 0082 1902');
  quoteStatus = signal('Quoting');
  statusPillClass = computed(() => {
    const s = this.quoteStatus();
    return s === 'Closed' ? 'good' : s === 'Open' ? 'info' : 'warn';
  });

  // Currency for this quote — applied consistently across the whole workspace
  currency = signal('USD');
  curSymbol = computed(() => this.currency() === 'CAD' ? 'C$' : '$');
  curCode = computed(() => this.currency());

  constructor(private location: Location, ctx: QuoteContextService, private router: Router, private detailCtx: DetailContextService) {
    if (ctx.current) {
      this.quoteNumber.set(ctx.current.number || this.quoteNumber());
      this.shipment.customer = ctx.current.customer || this.shipment.customer;
      if (ctx.current.origin) this.shipment.origin = ctx.current.origin;
      if (ctx.current.destination) this.shipment.destination = ctx.current.destination;
      if (ctx.current.status) this.quoteStatus.set(ctx.current.status);
      if (ctx.current.currency) this.currency.set(ctx.current.currency);
      this.applyQuote(this.parseAmount(ctx.current.amount), ctx.current.origin || '', ctx.current.destination || '');
    }
  }
  back() { this.location.back(); }

  notes = [
    { who: 'Dispatcher 1', initials: 'D1', color: '#6E6FFD', time: '2:14 PM', text: 'Customer is flexible on pickup — can push to 9/16 if it shaves the linehaul.' },
    { who: 'Dispatcher 2', initials: 'D2', color: '#3396CD', time: '11:40 AM', text: 'Carrier confirmed dry van is fine, no reefer needed. Their $2,650 holds through EOD.' },
    { who: 'Dispatcher 1', initials: 'D1', color: '#6E6FFD', time: 'Yesterday', text: 'Watch detention at the LA DC — 2 hr free only. Added a $120 accessorial to be safe.' },
  ];

  // formatting helpers — respect the quote's currency
  money(n: number): string { return this.curSymbol() + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  money0(n: number): string { return this.curSymbol() + Math.round(n).toLocaleString('en-US'); }
  perMile(n: number): string { return this.curSymbol() + n.toFixed(2) + ' / mi'; }
}
