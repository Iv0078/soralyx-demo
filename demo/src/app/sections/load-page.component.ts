import { Component } from '@angular/core';
import { NgClass, Location } from '@angular/common';
import { LoadModalComponent } from './load-modal.component';
import { DetailContextService } from './detail-context.service';
import { DetailActionsComponent } from '../shared/detail-actions.component';
import { Cell } from './mock-data';

@Component({
  selector: 'app-load-page',
  standalone: true,
  imports: [NgClass, LoadModalComponent, DetailActionsComponent],
  template: `
    <div class="detail-page">
      @if (row) {
        <div class="dp-head">
          <div class="dp-left">
            <button class="backbtn" (click)="back()" title="Back">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#737b8c" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="dp-num"><span class="eyebrow">Load</span><span class="mono num">{{ val('load') }}</span></div>
            @if (val('status')) { <span class="pill" [ngClass]="tone('status')">{{ val('status') }}</span> }
            @if (val('importance')) { <span class="pill" [ngClass]="tone('importance')">{{ val('importance') }}</span> }
          </div>
          <app-detail-actions [emailTo]="val('contactEmail') || 'ops@customer.example'" [emailSubject]="'Load ' + val('load') + (val('lane') ? ' — ' + val('lane') : '')"></app-detail-actions>
        </div>
        <div class="dp-body">
          <app-load-modal [row]="row" [inline]="true"></app-load-modal>
        </div>
      } @else {
        <div class="dp-head"><div class="dp-left"><button class="backbtn" (click)="back()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#737b8c" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div>
        <div class="dp-body"><div class="empty">No load selected. Open a load from a Dashboard table.</div></div>
      }
    </div>
  `,
  styles: [`
    .detail-page { }
    .dp-head { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 16px 28px; background: var(--surface); border-bottom: 1px solid var(--line); }
    .dp-left { display: flex; align-items: center; gap: 14px; }
    .dp-body { padding: 24px 28px; }
    @media (max-width: 720px) { .dp-head { flex-wrap: wrap; } }
    .backbtn { width: 38px; height: 38px; border: 1px solid var(--line); background: var(--surface); border-radius: 9px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; }
    .backbtn:hover { border-color: #c9cee0; }
    .dp-num { display: flex; flex-direction: column; gap: 1px; }
    .eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--muted-2); }
    .dp-num .num { font-size: 20px; font-weight: 700; color: var(--ink); }
    .pill { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 20px; font-size: 12.5px; font-weight: 500; }
    .pill.good { background: #eafaf2; color: var(--success); }
    .pill.bad { background: var(--danger-soft); color: var(--danger); }
    .pill.warn { background: var(--warn-soft); color: var(--warn); }
    .pill.info { background: var(--brand-purple-soft); color: var(--brand-purple); }
    .pill.blue { background: rgba(51,150,205,0.14); color: var(--brand-blue); }
    .pill.grey { background: var(--surface-2); color: var(--muted); border: 1px solid var(--line); }
    .pill.high { background: var(--danger-soft); color: var(--danger); }
    .pill.med { background: #fff7db; color: #9a7500; }
    .pill.low { background: var(--surface); color: var(--ink-2); border: 1px solid var(--line); }
    .empty { color: var(--muted); font-size: 14px; padding: 40px 0; }
  `],
})
export class LoadPageComponent {
  row: Record<string, Cell> | null;
  constructor(private location: Location, ctx: DetailContextService) { this.row = ctx.loadRow; }
  val(k: string) { return this.row?.[k]?.text ?? ''; }
  tone(k: string) { return this.row?.[k]?.tone ?? 'default'; }
  back() { this.location.back(); }
}
