import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';

interface Day {
  date: Date;
  inMonth: boolean;
}

interface MonthView {
  y: number;
  m: number;
  label: string;
  weeks: Day[][];
}

type PickerKind = 'month' | 'year';
interface PickerState { grid: number; kind: PickerKind; }

// Small two-month calendar. Each month has its OWN left/right arrows and can be
// navigated independently of the other. It's controlled: selection (start/end)
// comes in as inputs; it emits a clicked date (pick). The `base` input only seeds
// the initial months (and re-seeds on reset) — navigation afterwards is internal.
//
// The header month and year are SEPARATE buttons. Clicking either opens a picker
// in the body (under the header): the month picker is a 12-month grid, the year
// picker is a grid of year boxes with ‹ / › arrows to page through earlier/later
// years. Choosing a box applies it to that grid immediately.
@Component({
  standalone: true,
  selector: 'app-mini-calendar',
  imports: [],
  templateUrl: './mini-calendar.html',
  styleUrl: './mini-calendar.scss',
})
export class MiniCalendar {
  @Input() start: Date | null = null;
  @Input() end: Date | null = null;
  @Input() single = false; // one month instead of two
  @Input() set base(d: Date) {
    const f = this.firstOfMonth(d);
    this.b0.set(f);
    this.b1.set(this.addMonths(f, 1));
  }
  get base(): Date { return this.b0(); }

  @Output() pick = new EventEmitter<Date>();
  @Output() baseChange = new EventEmitter<Date>(); // kept for compatibility (not emitted)

  MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
  MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // one base month per grid, independent of each other
  b0 = signal(this.firstOfMonth(new Date()));
  b1 = signal(this.addMonths(this.firstOfMonth(new Date()), 1));

  // which grid's picker is open, and which kind (month grid vs year grid)
  picker = signal<PickerState | null>(null);
  // first year shown in the year-boxes grid (12 per page)
  yearStart = signal(new Date().getFullYear() - 5);

  months = computed<MonthView[]>(() =>
    this.single
      ? [this.buildMonth(this.b0())]
      : [this.buildMonth(this.b0()), this.buildMonth(this.b1())],
  );

  // the 12 years currently shown in the year picker
  yearWindow = computed<number[]>(() => {
    const s = this.yearStart();
    return Array.from({ length: 12 }, (_, i) => s + i);
  });

  // ---- per-grid month navigation (each arrow moves only its own month) ----
  private baseSig(grid: number) { return grid === 1 ? this.b1 : this.b0; }
  prev(grid: number): void { const s = this.baseSig(grid); s.set(this.addMonths(s(), -1)); }
  next(grid: number): void { const s = this.baseSig(grid); s.set(this.addMonths(s(), 1)); }

  // ---- month / year pickers (per grid) ----
  isPicking(grid: number, kind: PickerKind): boolean {
    const p = this.picker();
    return !!p && p.grid === grid && p.kind === kind;
  }
  isPickerOpen(grid: number): boolean { const p = this.picker(); return !!p && p.grid === grid; }

  openPicker(grid: number, kind: PickerKind): void {
    const p = this.picker();
    if (p && p.grid === grid && p.kind === kind) { this.picker.set(null); return; }
    if (kind === 'year') this.yearStart.set(this.baseSig(grid)().getFullYear() - 5);
    this.picker.set({ grid, kind });
  }
  closePicker(): void { this.picker.set(null); }

  // choose a month from the grid -> applies to that grid and closes the picker
  chooseMonth(grid: number, m: number): void {
    const s = this.baseSig(grid);
    s.set(new Date(s().getFullYear(), m, 1));
    this.picker.set(null);
  }
  // choose a year box -> applies to that grid and closes the picker
  chooseYear(grid: number, y: number): void {
    const s = this.baseSig(grid);
    s.set(new Date(y, s().getMonth(), 1));
    this.picker.set(null);
  }
  // page the year grid back/forward (12 years at a time); keeps the picker open
  yearPage(delta: number): void { this.yearStart.update(s => s + delta); }

  // picking a day also dismisses any open month/year picker
  onPick(d: Day): void { if (d.inMonth) { this.picker.set(null); this.pick.emit(d.date); } }

  // ---- day-cell state (from the start/end inputs) ----
  isStart(d: Day): boolean { return this.same(d.date, this.start); }
  isEnd(d: Day): boolean { return this.same(d.date, this.end); }
  inRange(d: Day): boolean {
    if (!this.start || !this.end) return false;
    const t = d.date.getTime();
    return t > this.start.getTime() && t < this.end.getTime();
  }
  isToday(d: Day): boolean { return this.same(d.date, new Date()); }

  // ---- date helpers ----
  private firstOfMonth(d: Date): Date { return new Date(d.getFullYear(), d.getMonth(), 1); }
  private addMonths(d: Date, n: number): Date { return new Date(d.getFullYear(), d.getMonth() + n, 1); }
  private same(a: Date, b: Date | null): boolean {
    return !!b
      && a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }
  private buildMonth(base: Date): MonthView {
    const y = base.getFullYear(), m = base.getMonth();
    const first = new Date(y, m, 1);
    const cur = new Date(y, m, 1 - first.getDay()); // back up to the Sunday
    const weeks: Day[][] = [];
    for (let w = 0; w < 6; w++) {
      const row: Day[] = [];
      for (let i = 0; i < 7; i++) {
        row.push({ date: new Date(cur), inMonth: cur.getMonth() === m });
        cur.setDate(cur.getDate() + 1);
      }
      weeks.push(row);
    }
    return { y, m, label: `${this.MONTHS[m]} ${y}`, weeks };
  }
}
