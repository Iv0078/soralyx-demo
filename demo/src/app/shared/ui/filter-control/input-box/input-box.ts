import { Component, EventEmitter, Input, Output } from '@angular/core';

// The one text-input component for the app (login stays separate).
// modes:    'alpha'  -> any text (most columns)
//           'numeric'-> digits/decimal only (rates/amounts)
// variants: 'field'  -> the bordered box used in filter/date fields
//           'search' -> the grey pill with a leading icon used in toolbars
@Component({
  standalone: true,
  selector: 'app-input-box',
  imports: [],
  templateUrl: './input-box.html',
  styleUrl: './input-box.scss',
})
export class InputBox {
  @Input() mode: 'alpha' | 'numeric' = 'alpha';
  @Input() variant: 'field' | 'search' = 'field';
  @Input() icon = '';                 // svg-icon name, e.g. 'search' -> leading icon
  @Input() value = '';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<string>();

  get ph(): string {
    return this.placeholder || (this.mode === 'numeric' ? '0' : 'Any');
  }

  // inline custom property that points the mask at the chosen asset file
  get iconUrl(): string {
    return this.icon ? `url(assets/svg-icons/${this.icon}.svg)` : '';
  }

  onInput(e: Event): void {
    const el = e.target as HTMLInputElement;
    let v = el.value;
    if (this.mode === 'numeric') {
      // strip anything that isn't a digit or a decimal point (also catches paste)
      const clean = v.replace(/[^0-9.]/g, '');
      if (clean !== v) { v = clean; el.value = clean; }
    }
    this.value = v;
    this.valueChange.emit(v);
  }
}
