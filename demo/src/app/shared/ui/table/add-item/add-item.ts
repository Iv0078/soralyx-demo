import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableColumn, statusCell } from '../table';

// Modal form for adding a new table row. Renders one field per column (text /
// number / date / dropdown / status), and emits the assembled row on Save.
@Component({
  standalone: true,
  selector: 'app-add-item',
  imports: [FormsModule],
  templateUrl: './add-item.html',
  styleUrl: './add-item.scss',
})
export class AddItem {
  @Input() columns: TableColumn[] = [];
  @Input() title = 'New item';
  @Output() save = new EventEmitter<Record<string, any>>();
  @Output() cancel = new EventEmitter<void>();

  model: Record<string, any> = {};

  labelOf(c: TableColumn): string { return c.fullLabel || c.label; }
  isDropdown(c: TableColumn): boolean { return c.kind === 'status' || c.filter === 'select'; }
  isDate(c: TableColumn): boolean { return c.filter === 'date'; }
  isNumber(c: TableColumn): boolean { return c.filter === 'number'; }

  onSave(): void {
    const row: Record<string, any> = {};
    for (const c of this.columns) {
      const v = this.model[c.key];
      // status columns store { label, tone } so they render as a coloured pill
      row[c.key] = c.kind === 'status' ? (v ? statusCell(v, c.pillTone) : '') : (v ?? '');
    }
    this.save.emit(row);
  }
}
