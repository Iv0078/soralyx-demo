import { Component, Input, signal } from '@angular/core';
import { EmailModalComponent } from './email-modal.component';

@Component({
  selector: 'app-detail-actions',
  standalone: true,
  imports: [EmailModalComponent],
  template: `
    <div class="acts">
      <button class="btn ghost">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#737b8c" stroke-width="1.6"/><path d="M12 7v5l3.5 2" stroke="#737b8c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Activity log
      </button>
      <button class="btn ghost">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 4h3.5l1.6 4-2 1.4a11 11 0 0 0 4.9 4.9l1.4-2 4 1.6V18a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 3 6.2 2 2 0 0 1 5 4z" stroke="#737b8c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Contact
      </button>
      <button class="btn primary" (click)="showEmail.set(true)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#fff" stroke-width="1.6"/><path d="M4 6l8 6 8-6" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Send email
      </button>
    </div>
    @if (showEmail()) {
      <app-email-modal [to]="emailTo" [subject]="emailSubject" [body]="emailBody" (closed)="showEmail.set(false)"></app-email-modal>
    }
  `,
  styles: [`
    .acts { display: inline-flex; align-items: center; gap: 10px; }
    .btn { display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 16px; border-radius: 10px; font-family: inherit; font-size: 13.5px; font-weight: 500; cursor: pointer; white-space: nowrap; }
    .btn.ghost { background: var(--surface); border: 1px solid var(--line); color: var(--ink-2); }
    .btn.ghost:hover { border-color: #c9cee0; }
    .btn.primary { background: var(--brand-purple); border: 1px solid var(--brand-purple); color: #fff; }
    .btn.primary:hover { background: var(--brand-purple-dark); }
    @media (max-width: 640px) { .btn span, .btn { font-size: 12.5px; } }
  `],
})
export class DetailActionsComponent {
  @Input() emailTo = 'dispatch@soralyx.com';
  @Input() emailSubject = '';
  @Input() emailBody = '';
  showEmail = signal(false);
}
