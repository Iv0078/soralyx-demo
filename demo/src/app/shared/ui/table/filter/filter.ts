import { Component, EventEmitter, Input, Output, ViewChildren, QueryList, signal } from '@angular/core';
import { TableColumn, FilterCriteria } from '../table';
import { DateSearch } from '../../filter-control/date-search/date-search';
import { InputBox } from '../../filter-control/input-box/input-box';
import { ComboBox } from '../../filter-control/combo-box/combo-box';
import { AddItem } from '../add-item/add-item';

// Reusable table toolbar: a live search box + a Filters panel.
// While the panel is open the top search box is disabled; the panel stages its
// values and only applies them when the Search button is clicked. Date columns
// render as a connected two-month range only when `rangeDates` is set (dispatch
// boards); otherwise each date column is its own single-month search.
@Component({
  standalone: true,
  selector: 'app-filter',
  imports: [DateSearch, InputBox, ComboBox, AddItem],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class Filter {
  @Input() placeholder = 'Search…';
  @Input() columns: TableColumn[] = [];
  @Input() rangeDates = false; // connected two-month range (dispatch boards only)
  @Input() addLabel = 'New item'; // modal title for "+ New"
  @Input() showAdd = true;        // show the "+ New" button (hidden on read-only tables)

  @Output() filter = new EventEmitter<FilterCriteria>();
  @Output() export = new EventEmitter<void>();
  @Output() add = new EventEmitter<Record<string, any>>(); // a new row from the + New modal

  addOpen = signal(false);
  openAdd(): void { this.addOpen.set(true); }
  closeAdd(): void { this.addOpen.set(false); }
  onAdded(row: Record<string, any>): void { this.add.emit(row); this.addOpen.set(false); }

  @ViewChildren(DateSearch) private dateSearches?: QueryList<DateSearch>;

  value = '';
  panelOpen = signal(false);
  fields: Record<string, string> = {};

  // stable derived arrays (recomputed only when `columns` changes) so template
  // bindings don't hand child components a new array reference every cycle
  private cachedFor?: TableColumn[];
  private dateCols: TableColumn[] = [];
  private plainCols: TableColumn[] = [];
  private groups: TableColumn[][] = [];

  private ensure(): void {
    if (this.cachedFor === this.columns) return;
    this.cachedFor = this.columns;
    this.dateCols = this.columns.filter(c => c.filter === 'date');
    // 'none' columns stay in the table but are not offered as search fields
    this.plainCols = this.columns.filter(c => c.filter !== 'date' && c.filter !== 'none');
    // dispatch boards -> one group of both dates (connected range);
    // every other page -> one group per date column (independent single months)
    this.groups = this.rangeDates && this.dateCols.length > 1
      ? [this.dateCols]
      : this.dateCols.map(c => [c]);
  }

  get dateColumns(): TableColumn[] { this.ensure(); return this.dateCols; }
  get plainColumns(): TableColumn[] { this.ensure(); return this.plainCols; }
  get dateGroups(): TableColumn[][] { this.ensure(); return this.groups; }

  togglePanel(): void { this.panelOpen.update(v => !v); }

  private emit(): void {
    this.filter.emit({ search: this.value, fields: { ...this.fields } });
  }

  // top search box: filters live, but only while the panel is closed
  onTopSearch(v: string): void { this.value = v; if (!this.panelOpen()) this.emit(); }

  // panel edits are staged; they don't filter until Search is clicked
  onField(key: string, val: string): void { this.fields[key] = val; }
  onDates(map: Record<string, string>): void {
    for (const k of Object.keys(map)) {
      if (map[k]) this.fields[k] = map[k];
      else delete this.fields[k];
    }
  }

  // the panel's Search button
  runSearch(): void { this.emit(); }

  clear(): void {
    this.value = '';
    this.fields = {};
    this.dateSearches?.forEach(d => d.reset()); // clears every date picker + calendar
    this.emit();
  }
}
