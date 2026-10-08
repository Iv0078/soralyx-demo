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

// Small two-month calendar. Each month has its OWN left/right arrows and can be
// navigated independently of the other. It's controlled: selection (start/end)
// comes in as inputs; it emits a clicked date (pick). The `base` input only seeds
// the initial months (and re-seeds on reset) — navigation afterwards is internal.
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

  picking = signal<number | null>(null); // which grid's month/year picker is open (0 or 1)
  pickYear = signal(new Date().getFullYear());

  months = computed<MonthView[]>(() =>
    this.single
      ? [this.buildMonth(this.b0())]
      : [this.buildMonth(this.b0()), this.buildMonth(this.b1())],
  );

  // ---- per-grid month navigation (each arrow moves only its own month) ----
  private baseSig(grid: number) { return grid === 1 ? this.b1 : this.b0; }
  prev(grid: number): void { const s = this.baseSig(grid); s.set(this.addMonths(s(), -1)); }
  next(grid: number): void { const s = this.baseSig(grid); s.set(this.addMonths(s(), 1)); }

  // month/year picker (per grid)
  openPicker(grid: number): void {
    this.pickYear.set(this.months()[grid].y);
    this.picking.set(this.picking() === grid ? null : grid);
  }
  yearStep(n: number): void { this.pickYear.update(y => y + n); }
  chooseMonth(m: number): void {
    const grid = this.picking() ?? 0;
    this.baseSig(grid).set(new Date(this.pickYear(), m, 1));
    this.picking.set(null);
  }

  onPick(d: Day): void { if (d.inMonth) this.pick.emit(d.date); }

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
