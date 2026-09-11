import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { CarrierDetail } from './models';

@Component({
  selector: 'app-carrier-modal',
  standalone: true,
  imports: [NgClass],
  templateUrl: './carrier-modal.component.html',
  styleUrl: './carrier-modal.component.scss',
})
export class CarrierModalComponent {
  @Input() detail!: CarrierDetail;
  @Output() closed = new EventEmitter<void>();
  @Output() expand = new EventEmitter<void>();

  get maxActivity(): number {
    return Math.max(...this.detail.activity.map(a => a.value), 1);
  }
  barHeight(v: number): string {
    return Math.round((v / this.maxActivity) * 96) + 'px';
  }
  close() { this.closed.emit(); }
}
