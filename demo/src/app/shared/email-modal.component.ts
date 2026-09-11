import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-modal',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="ov" (click)="close()">
      <div class="win" (click)="$event.stopPropagation()">
        <div class="bar">
          <span class="bar-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#6E6FFD" stroke-width="1.7"/><path d="M4 6l8 6 8-6" stroke="#6E6FFD" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
            New email
          </span>
          <button class="x" (click)="close()"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#737b8c" stroke-width="1.8" stroke-linecap="round"/></svg></button>
        </div>
        <div class="rows">
          <label class="r"><span>To</span><input [(ngModel)]="toV" /></label>
          <label class="r"><span>Cc</span><input [(ngModel)]="ccV" placeholder="Add Cc…" /></label>
          <label class="r"><span>Subject</span><input [(ngModel)]="subjectV" /></label>
        </div>
        <textarea class="body" rows="8" [(ngModel)]="bodyV"></textarea>
        <div class="foot">
          @if (sent()) { <span class="sent">✓ Sent to {{ toV }}</span> }
          <button class="ghost" (click)="close()">Discard</button>
          <button class="send" (click)="doSend()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Send
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ov { position: fixed; inset: 0; z-index: 70; background: rgba(27,33,48,0.35); display: flex; align-items: flex-start; justify-content: center; padding: 70px 20px; overflow: auto; }
    .win { width: 560px; max-width: 100%; background: var(--surface); border: 1px solid #d5d9e6; border-radius: 12px; box-shadow: 0 24px 70px rgba(27,33,48,0.30); overflow: hidden; }
    .bar { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: var(--surface-2); border-bottom: 1px solid var(--line); }
    .bar-title { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--ink); }
    .x { border: none; background: transparent; cursor: pointer; display: inline-flex; padding: 4px; }
    .rows { padding: 6px 16px; }
    .r { display: flex; align-items: center; gap: 12px; height: 42px; border-bottom: 1px solid var(--line-2); }
    .r span { width: 58px; font-size: 12.5px; color: var(--muted); }
    .r input { flex: 1; border: none; outline: none; background: transparent; font-family: inherit; font-size: 13.5px; color: var(--ink); }
    .body { width: 100%; border: none; outline: none; resize: vertical; padding: 14px 16px; font-family: inherit; font-size: 13.5px; line-height: 1.6; color: var(--ink-2); background: var(--surface); box-sizing: border-box; }
    .foot { display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding: 12px 16px; border-top: 1px solid var(--line-2); }
    .sent { margin-right: auto; font-size: 12.5px; color: var(--success); font-weight: 500; }
    .ghost { height: 38px; padding: 0 16px; border: 1px solid var(--line); background: var(--surface); color: var(--ink-2); border-radius: 9px; font-family: inherit; font-size: 13.5px; font-weight: 500; cursor: pointer; }
    .send { height: 38px; padding: 0 18px; border: 1px solid var(--brand-purple); background: var(--brand-purple); color: #fff; border-radius: 9px; font-family: inherit; font-size: 13.5px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; }
    .send:hover { background: var(--brand-purple-dark); }
  `],
})
export class EmailModalComponent implements OnInit {
  @Input() to = '';
  @Input() subject = '';
  @Input() body = '';
  @Output() closed = new EventEmitter<void>();

  toV = ''; ccV = ''; subjectV = ''; bodyV = '';
  sent = signal(false);

  ngOnInit() {
    this.toV = this.to;
    this.subjectV = this.subject;
    this.bodyV = this.body || `Hi,\n\nPlease find the details for ${this.subject || 'this shipment'} below. Let me know if you have any questions or would like to proceed.\n\nBest regards,\nSoralyx Dispatch\ndispatch@soralyx.com`;
  }
  doSend() { this.sent.set(true); setTimeout(() => this.close(), 900); }
  close() { this.closed.emit(); }
}
