import { Component, OnDestroy, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SECTIONS, Section, Stat, Cell } from './mock-data';
import { TrackingModalComponent } from './tracking-modal.component';
import { LoadModalComponent } from './load-modal.component';
import { CarrierModalComponent } from '../quotes/carrier-modal.component';
import { buildCarrierDetail } from '../quotes/carrier-detail';
import { CarrierDetail } from '../quotes/models';
import { QuoteContextService } from '../quotes/quote-context.service';
import { RfqContextService } from '../rfq/rfq-context.service';
import { DetailContextService } from './detail-context.service';
import { NAV_MENUS, NavItem } from '../core/nav';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [NgClass, FormsModule, TrackingModalComponent, LoadModalComponent, CarrierModalComponent],
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss',
})
export class SectionComponent implements OnDestroy {
  data: Section | null = null;
  private sub: Subscription;

  query = signal('');
  filters = signal<Record<string, string>>({});
  showFilters = signal(false);

  trackRow: Record<string, Cell> | null = null;
  showTrack = signal(false);
  loadRow: Record<string, Cell> | null = null;
  showLoad = signal(false);
  carrierDetail: CarrierDetail | null = null;
  showCarrier = signal(false);

  curSlug = '';
  constructor(route: ActivatedRoute, private router: Router, private quoteCtx: QuoteContextService, private rfqCtx: RfqContextService, private detailCtx: DetailContextService) {
    this.sub = route.paramMap.subscribe(p => {
      this.curSlug = p.get('slug') ?? '';
      this.data = SECTIONS[p.get('slug') ?? ''] ?? null;
      this.query.set('');
      this.filters.set({});
      this.showFilters.set(false);
      this.showTrack.set(false); this.trackRow = null;
      this.showLoad.set(false); this.loadRow = null;
      this.showCarrier.set(false); this.carrierDetail = null;
      this.showEvent.set(false);
      if (this.data?.kind === 'calendar') this.seedCalendar();
      window.scrollTo(0, 0);
    });
  }
  ngOnDestroy() { this.sub.unsubscribe(); }

  // sibling sub-sections shown as a pill sub-nav
  get siblings(): NavItem[] {
    const link = '/section/' + this.curSlug;
    const menu = NAV_MENUS.find(m => m.items.some(i => i.link === link));
    return (menu && menu.items.length > 1) ? menu.items : [];
  }
  isCurrent(link: string) { return link === '/section/' + this.curSlug; }
  goSection(link: string) { this.router.navigateByUrl(link); }

  get rows(): Record<string, Cell>[] {
    const d = this.data;
    if (!d?.rows) return [];
    const q = this.query().trim().toLowerCase();
    const f = this.filters();
    const sk = d.searchKeys ?? [];
    return d.rows.filter(r => {
      if (q) {
        const keys = sk.length ? sk : Object.keys(r);
        if (!keys.some(k => (r[k]?.text ?? '').toLowerCase().includes(q))) return false;
      }
      for (const k of Object.keys(f)) {
        if ((r[k]?.text ?? '') !== f[k]) return false;
      }
      return true;
    });
  }

  options(key: string): string[] {
    const set = new Set<string>();
    (this.data?.rows ?? []).forEach(r => { const t = r[key]?.text; if (t) set.add(t); });
    return Array.from(set);
  }
  labelFor(key: string): string { return this.data?.columns?.find(c => c.key === key)?.label ?? key; }

  onFilterChange(key: string, ev: Event) {
    const value = (ev.target as HTMLSelectElement).value;
    const f = { ...this.filters() };
    if (!value) delete f[key]; else f[key] = value;
    this.filters.set(f);
  }
  clearAll() { this.filters.set({}); this.query.set(''); }
  hasFilters() { return !!this.query() || Object.keys(this.filters()).length > 0; }

  statValue(s: Stat): string {
    const rows = this.data?.rows ?? [];
    if (s.filter) return String(rows.filter(r => (r[s.filter!.key]?.text ?? '') === s.filter!.value).length);
    if (s.countAll) return String(rows.length);
    return s.value ?? '';
  }
  statPillCount(s: Stat): number {
    if (!s.pill) return 0;
    return (this.data?.rows ?? []).filter(r => (r[s.pill!.key]?.text ?? '') === s.pill!.value).length;
  }
  pillActive(s: Stat): boolean { return !!s.pill && this.filters()[s.pill.key] === s.pill.value; }
  onStatPill(s: Stat, ev: Event) {
    ev.stopPropagation();
    if (!s.pill) return;
    const f = { ...this.filters() };
    if (f[s.pill.key] === s.pill.value) delete f[s.pill.key]; else f[s.pill.key] = s.pill.value;
    this.filters.set(f);
  }
  statClickable(s: Stat) { return !!s.filter || !!s.countAll; }
  statActive(s: Stat) {
    if (s.filter) return this.filters()[s.filter.key] === s.filter.value;
    if (s.countAll) return !this.hasFilters();
    return false;
  }
  onStat(s: Stat) {
    if (s.filter) {
      const f = { ...this.filters() };
      if (f[s.filter.key] === s.filter.value) delete f[s.filter.key];
      else f[s.filter.key] = s.filter.value;
      this.filters.set(f);
    } else if (s.countAll) {
      this.clearAll();
    }
  }

  // ---- Add quote ----
  showAdd = signal(false);
  form = { cust: '', lane: '', amount: '', status: 'Open', curr: 'USD' };
  openAdd() { this.form = { cust: '', lane: '', amount: '', status: 'Open', curr: 'USD' }; this.showAdd.set(true); }
  cancelAdd() { this.showAdd.set(false); }
  private randQuote(): string {
    const p = () => Math.floor(1000 + Math.random() * 9000);
    return `${p()} ${p()} ${p()}`;
  }
  private statusToneOf(s: string): Cell['tone'] {
    if (s === 'Closed') return 'good';
    if (s === 'Quoting') return 'warn';
    return 'info';
  }
  saveQuote() {
    if (!this.data?.rows) return;
    const amt = this.form.amount.replace(/[^0-9.]/g, '');
    const sym = this.form.curr === 'CAD' ? 'C$' : '$';
    const row: Record<string, Cell> = {
      q: { text: this.randQuote(), mono: true, tone: 'info' },
      cust: { text: this.form.cust || 'New customer' },
      lane: { text: this.form.lane || '—' },
      amt: { text: amt ? sym + Number(amt).toLocaleString('en-US') : sym + '0', mono: true, strong: true },
      curr: { text: this.form.curr },
      status: { text: this.form.status, tone: this.statusToneOf(this.form.status) },
    };
    this.data.rows = [row, ...this.data.rows];
    this.showAdd.set(false);
  }

  // ---- Calendar ----
  readonly weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  readonly TODAY = { y: 2026, m: 8, d: 12 };   // Sep 12, 2026 — anything earlier is "completed"
  viewYear = signal(2026);
  viewMonth = signal(8);   // September (0-based)
  calItems = signal<{ y: number; m: number; d: number; label: string; tone: string }[]>([]);

  private seedCalendar() {
    const src = this.data?.calEvents ?? {};
    const items: { y: number; m: number; d: number; label: string; tone: string }[] = [];
    for (const k of Object.keys(src)) {
      const day = +k;
      for (const e of src[day]) items.push({ y: 2026, m: 8, d: day, label: e.label, tone: e.tone });
    }
    // seed a few events in neighbouring months so navigation has content
    items.push({ y: 2026, m: 7, d: 19, label: 'Delivery · L-90090', tone: 'good' });
    items.push({ y: 2026, m: 7, d: 26, label: 'Payday', tone: 'good' });
    items.push({ y: 2026, m: 7, d: 28, label: 'Q3 close', tone: 'info' });
    items.push({ y: 2026, m: 9, d: 2,  label: 'Team standup · 9 AM', tone: 'info' });
    items.push({ y: 2026, m: 9, d: 9,  label: 'Payday', tone: 'good' });
    items.push({ y: 2026, m: 9, d: 15, label: 'Q4 kickoff · 10 AM', tone: 'info' });
    this.calItems.set(items);
    this.viewYear.set(2026);
    this.viewMonth.set(8);
  }

  get calTitle() { return new Date(this.viewYear(), this.viewMonth(), 1).toLocaleString('en-US', { month: 'long', year: 'numeric' }); }
  get calWeeks(): (number | null)[][] {
    const first = new Date(this.viewYear(), this.viewMonth(), 1).getDay();
    const days = new Date(this.viewYear(), this.viewMonth() + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < first; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    const weeks: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
  }
  eventsOn(day: number) { return this.calItems().filter(e => e.y === this.viewYear() && e.m === this.viewMonth() && e.d === day); }
  isToday(day: number) { return this.viewYear() === this.TODAY.y && this.viewMonth() === this.TODAY.m && day === this.TODAY.d; }
  isDone(day: number): boolean {
    const y = this.viewYear(), m = this.viewMonth();
    if (y !== this.TODAY.y) return y < this.TODAY.y;
    if (m !== this.TODAY.m) return m < this.TODAY.m;
    return day < this.TODAY.d;
  }
  prevMonth() { let m = this.viewMonth() - 1, y = this.viewYear(); if (m < 0) { m = 11; y--; } this.viewMonth.set(m); this.viewYear.set(y); }
  nextMonth() { let m = this.viewMonth() + 1, y = this.viewYear(); if (m > 11) { m = 0; y++; } this.viewMonth.set(m); this.viewYear.set(y); }
  goToday() { this.viewYear.set(this.TODAY.y); this.viewMonth.set(this.TODAY.m); }

  // ---- Add calendar event ----
  showEvent = signal(false);
  evForm = { day: 12, title: '', importance: 'Medium' };
  openEvent() { this.evForm = { day: this.viewMonth() === this.TODAY.m && this.viewYear() === this.TODAY.y ? this.TODAY.d : 1, title: '', importance: 'Medium' }; this.showEvent.set(true); }
  cancelEvent() { this.showEvent.set(false); }
  private toneForImportance(i: string): string { return i === 'High' ? 'bad' : i === 'Low' ? 'info' : 'warn'; }
  saveEvent() {
    const t = this.evForm.title.trim();
    if (!t) { this.showEvent.set(false); return; }
    const maxDay = new Date(this.viewYear(), this.viewMonth() + 1, 0).getDate();
    const day = Math.max(1, Math.min(maxDay, Math.floor(+this.evForm.day) || 1));
    this.calItems.update(a => [...a, { y: this.viewYear(), m: this.viewMonth(), d: day, label: t, tone: this.toneForImportance(this.evForm.importance) }]);
    this.showEvent.set(false);
  }

  get actionable() { return !!this.data?.rowAction; }
  rowClick(row: Record<string, Cell>) {
    const a = this.data?.rowAction;
    // Quick view mode: open the popup instead of navigating to the subpage
    if (this.quickViewMode() && (a === 'load' || a === 'tracing' || a === 'carrier')) { this.openQuickView(row); return; }
    if (a === 'quote') {
      const lane = (row['lane']?.text ?? '').split('→');
      this.quoteCtx.current = {
        number: row['q']?.text ?? '',
        customer: row['cust']?.text ?? '',
        origin: (lane[0] ?? '').trim(),
        destination: (lane[1] ?? '').trim(),
        amount: row['amt']?.text,
        status: row['status']?.text,
        currency: row['curr']?.text || 'USD',
      };
      this.router.navigate(['/quotes']);
    }
    else if (a === 'rfq') {
      this.rfqCtx.current = {
        no: row['no']?.text ?? '000000',
        customer: row['cust']?.text ?? '',
        equipment: row['equip']?.text ?? '',
        equipType: row['equipType']?.text ?? '',
        currency: row['curr']?.text ?? 'USD',
        commodity: row['commodity']?.text ?? 'General freight',
        weight: row['weight']?.text ?? '42,000',
        cargoType: 'TL',
        deadline: row['deadline']?.text ?? '',
        status: row['status']?.text ?? 'Open',
        lanesCount: parseInt(row['lanes']?.text ?? '6', 10) || 6,
      };
      this.router.navigate(['/rfq']);
    }
    else if (a === 'tracing') { this.detailCtx.traceRow = row; this.router.navigate(['/trace']); }
    else if (a === 'load') { this.detailCtx.loadRow = row; this.router.navigate(['/load']); }
    else if (a === 'carrier') { this.detailCtx.carrier = this.carrierCtxFor(row); this.router.navigate(['/carrier']); }
  }

  // ---- Quick view mode (toggle): row click opens a popup instead of the page ----
  quickViewMode = signal(false);
  qvRow: Record<string, Cell> | null = null;
  get quickViewable() { const a = this.data?.rowAction; return a === 'load' || a === 'tracing' || a === 'carrier'; }
  toggleQuickView() { this.quickViewMode.set(!this.quickViewMode()); }
  private openQuickView(row: Record<string, Cell>) {
    const a = this.data?.rowAction;
    this.qvRow = row;
    if (a === 'tracing') { this.trackRow = row; this.showTrack.set(true); }
    else if (a === 'load') { this.loadRow = row; this.showLoad.set(true); }
    else if (a === 'carrier') {
      this.carrierDetail = buildCarrierDetail({ name: row['carrier']?.text ?? row['name']?.text ?? 'Carrier', mc: row['mc']?.text, color: row['color']?.text });
      this.showCarrier.set(true);
    }
  }
  // Expand a popup to its full subpage
  expandLoad() { this.showLoad.set(false); if (this.loadRow) this.detailCtx.loadRow = this.loadRow; this.router.navigate(['/load']); }
  expandTrack() { this.showTrack.set(false); if (this.trackRow) this.detailCtx.traceRow = this.trackRow; this.router.navigate(['/trace']); }
  expandCarrier() { this.showCarrier.set(false); if (this.qvRow) this.detailCtx.carrier = this.carrierCtxFor(this.qvRow); this.router.navigate(['/carrier']); }
  private carrierCtxFor(row: Record<string, Cell>) {
    const name = row['carrier']?.text ?? row['name']?.text ?? 'Carrier';
    const st = row['status']?.text ?? '';
    const state = (st === 'Verified' || st === 'Pending' || st === 'Under review') ? st : 'Verified';
    // When opened from a carrier quote, surface the quote's rate/lane for this carrier.
    const bid = row['active'] ? {
      lane: this.quoteCtx.current ? `${this.quoteCtx.current.origin} → ${this.quoteCtx.current.destination}` : undefined,
      trailer: row['trailer']?.text,
      transit: row['transit']?.text,
      histAvg: row['hist']?.text,
      activeQuote: row['active']?.text,
      status: row['status']?.text,
      statusTone: row['status']?.tone,
    } : null;
    return { name, mc: row['mc']?.text ?? 'MC-000000', color: row['color']?.text ?? '#6E6FFD', state, type: row['type']?.text, onTime: row['ontime']?.text, loads: row['loads']?.text, bid };
  }
  closeTrack() { this.showTrack.set(false); }
  closeLoad() { this.showLoad.set(false); }
  closeCarrier() { this.showCarrier.set(false); }
}
