import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AiProof } from './ai-proof';

// Shows proof that a quote/bid was made by the Soralyx AI dispatcher:
// the email chain (for email) or the call transcript (for phone).
@Component({
  selector: 'app-ai-call-modal',
  standalone: true,
  imports: [],
  template: `
<div class="overlay" (click)="closed.emit()">
  <div class="sheet" (click)="$event.stopPropagation()">
    <header class="h">
      <div class="h-left">
        <span class="ai-badge"><span class="spark">✦</span> Made by AI</span>
        <span class="chan" [class.phone]="proof.channel === 'phone'">
          @if (proof.channel === 'email') {
            <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M4 7l8 6 8-6" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg> Email
          } @else {
            <svg viewBox="0 0 24 24" fill="none"><path d="M4 5c0 9 6 15 15 15l-1-4-4-1-2 2a12 12 0 0 1-5-5l2-2-1-4H4z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg> Phone
          }
        </span>
      </div>
      <button class="x" type="button" (click)="closed.emit()" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>
      </button>
    </header>

    <div class="meta">
      <div><span class="m-lab">Reference</span><span class="m-val mono">{{ proof.id }}</span></div>
      <div><span class="m-lab">Counterparty</span><span class="m-val">{{ proof.counterparty }}</span></div>
      <div><span class="m-lab">Lane</span><span class="m-val">{{ proof.lane }}</span></div>
      @if (proof.rate !== '—') {
        <div><span class="m-lab">Agreed rate</span><span class="m-val mono strong">{{ proof.rate }}</span></div>
      }
      @if (proof.channel === 'phone') {
        <div><span class="m-lab">Called</span><span class="m-val mono">{{ proof.phoneNumber }}</span></div>
        <div><span class="m-lab">Duration</span><span class="m-val mono">{{ proof.duration }} · {{ proof.when }}</span></div>
      }
    </div>

    @if (proof.channel === 'email') {
      <div class="body">
        <div class="subject">Subject: {{ proof.subject }}</div>
        @for (m of proof.emails; track $index) {
          <div class="msg" [class.out]="m.dir === 'out'">
            <div class="msg-head">
              <span class="who">{{ m.from }}</span>
              <span class="when">{{ m.time }}</span>
            </div>
            <div class="to">to {{ m.to }}</div>
            <div class="text">{{ m.body }}</div>
          </div>
        }
      </div>
    } @else {
      <div class="body">
        <div class="t-head">Call transcript</div>
        @for (l of proof.transcript; track $index) {
          <div class="line" [class.ai]="l.speaker === 'ai'">
            <span class="spk">{{ l.name }}</span>
            <span class="say">{{ l.text }}</span>
          </div>
        }
      </div>
    }

    <footer class="f">This quote was generated and negotiated autonomously by the Soralyx AI dispatcher. The {{ proof.channel === 'email' ? 'email thread' : 'call transcript' }} above is retained as proof.</footer>
  </div>
</div>
  `,
  styles: [`
.overlay { position: fixed; inset: 0; z-index: 120; background: rgba(20,24,40,.45); display: flex; align-items: flex-start; justify-content: center; padding: 48px 16px; overflow: auto; }
.sheet { width: 100%; max-width: 640px; background: var(--surface); border-radius: 16px; box-shadow: 0 24px 48px rgba(20,24,40,.3); overflow: hidden; }

.h { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--line); }
.h-left { display: flex; align-items: center; gap: 10px; }
.ai-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: #fff; background: linear-gradient(120deg, #6E6FFD, #8f7bff); padding: 5px 11px; border-radius: 20px; }
.ai-badge .spark { font-size: 12px; }
.chan { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 600; color: #2b6fd6; background: #e6f0fe; padding: 5px 10px; border-radius: 20px; }
.chan.phone { color: #1b8a53; background: #e3f6ec; }
.chan svg { width: 15px; height: 15px; }
.x { border: 0; background: none; color: var(--muted-2); cursor: pointer; display: flex; padding: 4px; border-radius: 6px; }
.x:hover { background: var(--surface-2); color: var(--ink-2); }
.x svg { width: 18px; height: 18px; }

.meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px 18px; padding: 16px 20px; border-bottom: 1px solid var(--line-2); background: var(--surface-2); }
.meta > div { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.m-lab { font-size: 10.5px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: var(--muted-2); }
.m-val { font-size: 13.5px; color: var(--ink); }
.m-val.strong { font-weight: 700; }
.mono { font-family: "Roboto Mono", ui-monospace, monospace; }

.body { padding: 16px 20px; max-height: 46vh; overflow: auto; }
.subject { font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 12px; }

.msg { border: 1px solid var(--line); border-radius: 10px; padding: 10px 12px; margin-bottom: 10px; background: var(--surface); }
.msg.out { background: var(--brand-purple-soft); border-color: var(--brand-border); }
.msg-head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.who { font-size: 12.5px; font-weight: 700; color: var(--ink); }
.when { font-size: 11px; color: var(--muted-2); white-space: nowrap; }
.to { font-size: 11px; color: var(--muted); margin: 1px 0 6px; }
.text { font-size: 13px; color: var(--ink-2); line-height: 1.5; }

.t-head { font-size: 12px; font-weight: 700; letter-spacing: .03em; text-transform: uppercase; color: var(--muted-2); margin-bottom: 10px; }
.line { display: flex; gap: 10px; padding: 7px 0; border-bottom: 1px solid var(--line-2); }
.line:last-child { border-bottom: 0; }
.spk { flex: 0 0 92px; font-size: 12.5px; font-weight: 700; color: var(--muted); }
.line.ai .spk { color: var(--brand-purple); }
.say { font-size: 13px; color: var(--ink-2); line-height: 1.5; }

.f { padding: 12px 20px; border-top: 1px solid var(--line); background: var(--surface-2); font-size: 12px; color: var(--muted); line-height: 1.5; }
  `],
})
export class AiCallModalComponent {
  @Input() proof!: AiProof;
  @Output() closed = new EventEmitter<void>();
}
