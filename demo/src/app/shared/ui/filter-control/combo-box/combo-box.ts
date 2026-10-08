import { Component, EventEmitter, Input, Output } from '@angular/core';

// Reusable dropdown for columns with a fixed set of values (status, currency…).
// The empty option ("All") clears the filter.
@Component({
  standalone: true,
  selector: 'app-combo-box',
  imports: [],
  templateUrl: './combo-box.html',
  styleUrl: './combo-box.scss',
})
export class ComboBox {
  @Input() options: string[] = [];
  @Input() value = '';
  @Input() placeholder = 'All';
  @Output() valueChange = new EventEmitter<string>();

  onChange(e: Event): void {
    const v = (e.target as HTMLSelectElement).value;
    this.value = v;
    this.valueChange.emit(v);
  }
}
