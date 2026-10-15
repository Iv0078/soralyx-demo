import { Component, ElementRef, EventEmitter, HostListener, Input, Output, inject, signal } from '@angular/core';
import { MiniCalendar } from './mini-calendar/mini-calendar';
import { InputBox } from '../input-box/input-box';
import { TableColumn } from '../../table/table';

// Date filter for the Filters panel. The user can type each date (mm-dd-yyyy) or
// pick a start (ship) date and a delivery date from the mini calendar; the two
// stay in sync. Emits the chosen dates keyed by column:
// { <shipKey>: 'mm-dd-yyyy', <deliveryKey>: 'mm-dd-yyyy' }.
@Component({
  standalone: true,
  selector: 'app-date-search',
  imports: [MiniCalendar, InputBox],
  templateUrl: './date-search.html',
  styleUrl: './date-search.scss',
})
export class DateSearch {
  @Input() columns: TableColumn[] = []; // the date columns (1 or 2)
  @Output() dates = new EventEmitter<Record<string, string>>();

  open = signal(false);
  start = signal<Date | null>(null);
  end = signal<Date | null>(null);
  base = signal(this.firstOfMonth(new Date()));
  cmp = signal<'lte' | 'eq' | 'gte'>('gte'); // single-date comparison: on/before, on, on/after
  active = signal<'start' | 'end'>('start');  // which date a calendar click sets
  badStart = signal(false); // typed a ship date after the delivery date
  badEnd = signal(false);   // typed a delivery date before the ship date
  startText = '';
  endText = '';

  private host = inject(ElementRef<HTMLElement>);

  get mode(): 'range' | 'single' { return this.columns.length > 1 ? 'range' : 'single'; }
  get startLabel(): string { return this.columns[0]?.label ?? 'Start date'; }
  get endLabel(): string { return this.columns[1]?.label ?? 'Delivery date'; }

  toggle(): void { this.open.update(v => !v); }

  // close the calendar popover when clicking anywhere outside this component
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(ev.target as Node)) this.open.set(false);
  }

  // would setting this date invert the range (ship after delivery)?
  private inverts(which: 'start' | 'end', d: Date | null): boolean {
    if (!d) return false;
    if (which === 'start') { const e = this.end(); return !!e && d.getTime() > e.getTime(); }
    const s = this.start(); return !!s && d.getTime() < s.getTime();
  }

  // single-date comparison toggle: '<' on/before, '=' on, '>' on/after
  setCmp(v: 'lte' | 'eq' | 'gte'): void { this.cmp.set(v); this.emit(); }

  // clicked a day in the calendar. Sets ONLY the active field (start or end) —
  // the other date is never touched. The active field follows which input you
  // focused; after setting the start it advances to the end (typical range flow).
  onPick(day: Date): void {
    if (this.mode === 'single') {
      this.setStart(day);
      this.emit();
      return;
    }
    if (this.active() === 'start') {
      if (this.inverts('start', day)) return;  // ignore a ship date after delivery
      this.setStart(day);
      this.active.set('end');   // next calendar click fills the end date
    } else {
      if (this.inverts('end', day)) return;    // ignore a delivery date before ship
      this.setEnd(day);
    }
    this.emit();
  }

  // typed into an input. A ship date after delivery (or delivery before ship) is
  // flagged and NOT applied to the filter until it's corrected.
  onType(which: 'start' | 'end', text: string): void {
    const d = this.parse(text);
    if (which === 'start') {
      this.startText = text;
      const bad = this.inverts('start', d);
      this.badStart.set(bad);
      this.start.set(bad ? null : d);
    } else {
      this.endText = text;
      const bad = this.inverts('end', d);
      this.badEnd.set(bad);
      this.end.set(bad ? null : d);
    }
    this.emit();
  }

  // called by the Filters panel's "Clear all"
  reset(): void {
    this.start.set(null);
    this.end.set(null);
    this.startText = '';
    this.endText = '';
    this.cmp.set('gte');
    this.active.set('start');
    this.badStart.set(false);
    this.badEnd.set(false);
    this.base.set(this.firstOfMonth(new Date()));
  }

  private setStart(d: Date | null): void {
    this.start.set(d);
    this.startText = this.fmt(d);
    this.badStart.set(false);
    // note: does NOT move the displayed month — picking/typing a date leaves the
    // two-month view where it is (use the calendar arrows to change months).
  }
  private setEnd(d: Date | null): void {
    this.end.set(d);
    this.endText = this.fmt(d);
    this.badEnd.set(false);
  }

  private emit(): void {
    const out: Record<string, string> = {};
    const s = this.start(), e = this.end();
    if (this.mode === 'range') {
      // between: start column is on/after, end column is on/before
      if (this.columns[0]) out[this.columns[0].key] = s ? `gte:${this.fmt(s)}` : '';
      if (this.columns[1]) out[this.columns[1].key] = e ? `lte:${this.fmt(e)}` : '';
    } else if (this.columns[0]) {
      // single date with the chosen comparison
      out[this.columns[0].key] = s ? `${this.cmp()}:${this.fmt(s)}` : '';
    }
    this.dates.emit(out);
  }

  fmt(d: Date | null): string {
    if (!d) return '';
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${mm}-${dd}-${d.getFullYear()}`;
  }
  private parse(s: string): Date | null {
    const m = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec((s || '').trim());
    if (!m) return null;
    const mo = +m[1], da = +m[2], yr = +m[3];
    if (mo < 1 || mo > 12 || da < 1 || da > 31) return null;
    const d = new Date(yr, mo - 1, da);
    return d.getMonth() === mo - 1 ? d : null; // rejects e.g. 02-31
  }
  private firstOfMonth(d: Date): Date { return new Date(d.getFullYear(), d.getMonth(), 1); }
}
