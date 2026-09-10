import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

/**
 * Soralyx logo — sprout mark + wordmark.
 * variant 'gradient' (purple→blue, for light backgrounds) | 'light' (white, for the brand bar).
 * Recreated from the brand guideline; swap in the official SVG asset when available.
 */
@Component({
  selector: 'soralyx-logo',
  standalone: true,
  imports: [NgClass],
  template: `
    <span class="logo" [ngClass]="variant" [style.--mark]="markPx">
      <svg class="mark" [attr.width]="markPx" [attr.height]="markPx" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <defs>
          <linearGradient [attr.id]="gid" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#6E6FFD"/>
            <stop offset="1" stop-color="#3396CD"/>
          </linearGradient>
        </defs>
        <g [attr.stroke]="stroke" stroke-width="2.4" stroke-linecap="round" fill="none">
          <path d="M16 28V12"/>
          <path d="M16 18C10.5 18 8.6 13.8 9.4 9.2"/>
          <path d="M16 16.5L21 14"/>
        </g>
        <circle cx="16" cy="8.2" r="3" [attr.fill]="stroke"/>
        <circle cx="22.6" cy="12.6" r="2.4" [attr.fill]="stroke"/>
      </svg>
      <span class="word" [attr.aria-label]="'Soralyx'">Soralyx</span>
    </span>
  `,
  styles: [`
    .logo { display: inline-flex; align-items: center; gap: 8px; }
    .word {
      font-family: "Roboto", sans-serif; font-weight: 700; letter-spacing: -0.02em; line-height: 1;
      font-size: calc(var(--mark, 26px) * 0.78);
    }
    .logo.gradient .word {
      background: linear-gradient(120deg, #6E6FFD 0%, #3396CD 100%);
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .logo.light .word { color: #ffffff; }
  `],
})
export class SoralyxLogoComponent {
  @Input() variant: 'gradient' | 'light' = 'gradient';
  @Input() size = 26;
  private static seq = 0;
  gid = 'sx-grad-' + (SoralyxLogoComponent.seq++);
  get markPx() { return this.size + 'px'; }
  get stroke() { return this.variant === 'light' ? '#ffffff' : `url(#${this.gid})`; }
}
