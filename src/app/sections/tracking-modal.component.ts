import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cell } from './mock-data';

interface Note { who: string; initials: string; color: string; time: string; text: string; }

@Component({
  selector: 'app-tracking-modal',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './tracking-modal.component.html',
  styleUrl: './tracking-modal.component.scss',
})
export class TrackingModalComponent implements OnInit {
  @Input() row!: Record<string, Cell>;
  @Input() inline = false;   // render as an in-page panel instead of an overlay
  @Output() closed = new EventEmitter<void>();
  @Output() expand = new EventEmitter<void>();

  progress = signal(0.55);
  readonly statusOptions = ['On schedule', 'Delayed', 'Cancelled', 'Delivered'];
  status = signal('On schedule');
  detail = signal('');       // carrier reason/details for delayed/cancelled
  notes = signal<Note[]>([]);
  draft = '';
  saved = signal(false);

  ngOnInit() {
    this.status.set(this.val('status') || 'On schedule');
    this.detail.set(this.val('note') || '');
    this.notes.set([]);
  }

  get needsDetail() { const s = this.status(); return s === 'Delayed' || s === 'Cancelled'; }

  toneOf(s: string): string {
    if (s === 'On schedule' || s === 'Delivered') return 'good';
    if (s === 'Delayed') return 'warn';
    if (s === 'Cancelled') return 'bad';
    return 'info';
  }
  addNote() {
    const t = this.draft.trim();
    if (!t) return;
    this.notes.update(n => [...n, { who: 'You', initials: 'A', color: '#6E6FFD', time: 'Just now', text: t }]);
    this.draft = '';
  }
  saveStatus() {
    const cell = this.row['status'];
    if (cell) { cell.text = this.status(); cell.tone = this.toneOf(this.status()) as any; }
    else { this.row['status'] = { text: this.status(), tone: this.toneOf(this.status()) as any }; }
    // persist carrier reason/details (shown as the carrier note) for delayed/cancelled
    if (this.needsDetail) { this.row['note'] = { text: this.detail() }; }
    else { this.row['note'] = { text: '' }; }
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }

  // route control points (SVG space)
  private p0 = [60, 150]; private p1 = [320, 42]; private p2 = [580, 84];

  get t() { return this.progress(); }
  get truckX() { return this.point(this.t)[0]; }
  get truckY() { return this.point(this.t)[1]; }
  get truckAngle() {
    const mt = 1 - this.t;
    const dx = 2 * mt * (this.p1[0] - this.p0[0]) + 2 * this.t * (this.p2[0] - this.p1[0]);
    const dy = 2 * mt * (this.p1[1] - this.p0[1]) + 2 * this.t * (this.p2[1] - this.p1[1]);
    return Math.atan2(dy, dx) * 180 / Math.PI;
  }
  get pct() { return Math.round(this.t * 100); }

  private point(t: number): [number, number] {
    const mt = 1 - t;
    return [
      mt * mt * this.p0[0] + 2 * mt * t * this.p1[0] + t * t * this.p2[0],
      mt * mt * this.p0[1] + 2 * mt * t * this.p1[1] + t * t * this.p2[1],
    ];
  }

  autoEmail = signal(true);
  autoPhone = signal(false);

  val(key: string): string { return this.row?.[key]?.text ?? ''; }
  statusTone(): string { return this.toneOf(this.status()); }
  get origin() { return this.val('lane').split('→')[0].trim(); }
  get dest() { return this.val('lane').split('→')[1]?.trim() ?? ''; }
  get isAlert() { return this.needsDetail && !!this.detail(); }

  refresh() {
    const next = 0.35 + Math.random() * 0.5;
    this.progress.set(+next.toFixed(2));
  }
  close() { this.closed.emit(); }
}
