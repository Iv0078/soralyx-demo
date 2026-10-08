import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

// How a column's cells should render.
export type CellKind = 'text' | 'mono' | 'link' | 'status';

// What kind of control the Filters panel shows for a column.
//  text   -> free-text box (default)
//  number -> numeric-only box (e.g. Rate)
//  date   -> single box, placeholder for the custom calendar component (added later)
//  select -> dropdown built from `options`
//  none   -> column still shows in the table but is NOT offered in the search panel
export type FilterKind = 'text' | 'number' | 'date' | 'select' | 'none';

export interface TableColumn {
  key: string;
  label: string;              // shown in the header cell (may be short, e.g. 'OS')
  fullLabel?: string;         // full name for the Filters panel + header tooltip
  align?: 'left' | 'right';
  kind?: CellKind;          // default 'text'
  filter?: FilterKind;      // default 'text'
  options?: string[];       // choices for a 'select' filter
  pillTone?: string;        // 'status' columns: force every pill to this one tone (e.g. 'blue')
}

// What the Filters panel + search box emit up to the page.
export interface FilterCriteria {
  search: string;
  fields: Record<string, string>;
}

// Parse an 'mm-dd-yyyy' string to a timestamp, or null if it isn't one.
function toTime(s: string): number | null {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec((s || '').trim());
  return m ? new Date(+m[3], +m[1] - 1, +m[2]).getTime() : null;
}

// A date field is emitted as 'gte:mm-dd-yyyy' | 'lte:mm-dd-yyyy' | 'eq:mm-dd-yyyy'.
// gte = on/after, lte = on/before, eq = on that day (bound always inclusive).
// A two-date range is just gte on the start column + lte on the end column.
function parseDateField(raw: string): { op: 'gte' | 'lte' | 'eq'; t: number } | null {
  const m = /^(gte|lte|eq):(\d{2})-(\d{2})-(\d{4})$/.exec(raw);
  if (m) return { op: m[1] as 'gte' | 'lte' | 'eq', t: new Date(+m[4], +m[2] - 1, +m[3]).getTime() };
  const p = toTime(raw); // plain date -> treat as on/after
  return p === null ? null : { op: 'gte', t: p };
}

// Shared row filter used by every page. Global search matches any column
// (substring, case-insensitive). Per-column fields match their own column:
// text/number/select as substring; date columns by the operator carried in the
// value (on/before, on, on/after) — a two-date range is gte on the first column
// and lte on the last.
export function filterRows(
  rows: Record<string, any>[],
  columns: TableColumn[],
  c: FilterCriteria,
): Record<string, any>[] {
  const q = c.search.trim().toLowerCase();
  const text = (v: any): string =>
    v && typeof v === 'object' && 'label' in v ? String(v.label) : String(v ?? '');

  return rows.filter(r => {
    // global search scans visible column values only (keys beginning with '_' are
    // internal, e.g. a back-reference to the source row — never searched)
    if (q && !Object.keys(r).filter(k => !k.startsWith('_')).some(k => text(r[k]).toLowerCase().includes(q))) return false;

    for (const k of Object.keys(c.fields)) {
      const raw = (c.fields[k] ?? '').trim();
      if (!raw) continue;
      const col = columns.find(x => x.key === k);

      if (col?.filter === 'date') {
        const f = parseDateField(raw);
        const cell = toTime(text(r[k]));
        if (!f || cell === null) continue;
        if (f.op === 'gte' && cell < f.t) return false;
        if (f.op === 'lte' && cell > f.t) return false;
        if (f.op === 'eq' && cell !== f.t) return false;
      } else if (col?.filter === 'number') {
        // compare digits only, so "2720" matches a cell shown as "$2,720"
        const cellNum = text(r[k]).replace(/[^0-9.]/g, '');
        const qNum = raw.replace(/[^0-9.]/g, '');
        if (qNum && !cellNum.includes(qNum)) return false;
      } else if (!text(r[k]).toLowerCase().includes(raw.toLowerCase())) {
        return false;
      }
    }
    return true;
  });
}

// For a 'status' column the row value is this shape.
export interface StatusCell {
  label: string;
  tone: 'high' | 'med' | 'low' | 'good' | 'warn' | 'grey' | string;
}

// Default tone for a plain-string status/availability value (lower-cased).
// Anything not listed renders as a neutral grey pill. Adjust to taste.
const TONE_BY_WORD: Record<string, string> = {
  // positive / available
  available: 'good', open: 'good', active: 'good', accepted: 'good',
  booked: 'good', 'on time': 'good', delivered: 'good',
  // in-progress / info
  pending: 'blue', 'in transit': 'blue', new: 'blue', loaded: 'blue',
  'under review': 'blue', 'pick up': 'blue', 'cust notified': 'blue',
  // caution
  limited: 'warn', countered: 'warn', 'at border': 'warn',
  maintenance: 'warn', 'on hold': 'warn', delivery: 'warn',
  // negative / unavailable
  full: 'high', covered: 'high', declined: 'high', rejected: 'high',
  delayed: 'high', cancelled: 'high', 'out of service': 'high',
  // neutral / closed
  expired: 'grey', inactive: 'grey', closed: 'grey',
};

// Build a status cell { label, tone } from a chosen label (used by the add-item
// form so a new row's status renders as the right-coloured pill).
export function statusCell(label: string, forceTone?: string): StatusCell {
  return { label, tone: forceTone ?? TONE_BY_WORD[String(label).trim().toLowerCase()] ?? 'grey' };
}

// Reusable table: pass `columns` + `rows`, it builds the header and rows and
// styles each cell by its column's `kind`.
@Component({
  standalone: true,
  selector: 'app-table',
  imports: [NgClass],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table {
  private router = inject(Router);

  @Input() columns: TableColumn[] = [];
  @Input() rows: Record<string, any>[] = [];
  // when false, clicking a row only emits (rowClick) and does NOT navigate to the
  // shared details page — used by the demo, which opens its own modals/subpages
  @Input() navigate = true;
  @Output() rowClick = new EventEmitter<Record<string, any>>();

  // click-to-group: clicking a header groups rows by that column (same values
  // clustered together), toggling ascending -> descending -> off on repeat clicks.
  sortKey = '';
  sortDir: 'asc' | 'desc' = 'asc';

  toggleSort(c: TableColumn): void {
    if (this.sortKey !== c.key) { this.sortKey = c.key; this.sortDir = 'asc'; }
    else if (this.sortDir === 'asc') { this.sortDir = 'desc'; }
    else { this.sortKey = ''; this.sortDir = 'asc'; } // third click clears grouping
  }

  // rows shown in the body: the input rows, grouped by the active column (if any)
  get displayRows(): Record<string, any>[] {
    if (!this.sortKey) return this.rows;
    const key = this.sortKey;
    const dir = this.sortDir === 'asc' ? 1 : -1;
    const text = (v: any): string =>
      v && typeof v === 'object' && 'label' in v ? String(v.label) : String(v ?? '');

    // If the column defines `options` (e.g. a select like On time/Delayed/Cancelled),
    // group by that intended order instead of alphabetically; otherwise compare the
    // cell text (numeric-aware so numbers sort naturally).
    const order = this.columns.find(c => c.key === key)?.options;
    const rank = (v: string): number => {
      const i = order ? order.indexOf(v) : -1;
      return i === -1 ? Number.MAX_SAFE_INTEGER : i; // unknown values sort last
    };

    return [...this.rows].sort((a, b) => {
      const av = text(a[key]), bv = text(b[key]);
      const cmp = order ? rank(av) - rank(bv) : av.localeCompare(bv, undefined, { numeric: true });
      return cmp * dir;
    });
  }

  // Normalize a status cell to { label, tone } so the template can render a pill.
  // Accepts an existing { label, tone } object, or a plain string whose tone is
  // inferred from common status/availability words (falls back to neutral grey).
  pill(v: any, forceTone?: string): { label: string; tone: string } {
    const label =
      v && typeof v === 'object' && 'label' in v ? String(v.label) : String(v ?? '');
    if (forceTone) return { label, tone: forceTone };           // single-tone column
    if (v && typeof v === 'object' && 'tone' in v) return { label, tone: String(v.tone) };
    return { label, tone: TONE_BY_WORD[label.trim().toLowerCase()] ?? 'grey' };
  }

  // clicking a row opens the shared details page with this row + columns
  onRow(row: Record<string, any>): void {
    this.rowClick.emit(row);
    if (this.navigate) this.router.navigate(['/app/details'], { state: { row, columns: this.columns } });
  }
}
