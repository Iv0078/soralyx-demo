import { Component, Input } from '@angular/core';

/**
 * Soralyx logo — official wordmark from the brand guideline (the sprout mark is the "o").
 * variant 'gradient' = full-color logo (for light backgrounds) | 'light' = white logo (for the brand bar).
 */
@Component({
  selector: 'soralyx-logo',
  standalone: true,
  template: `
    <img
      class="logo"
      [src]="variant === 'light' ? 'assets/soralyx-logo-white.png' : 'assets/soralyx-logo.png'"
      [style.height.px]="size"
      alt="Soralyx" />
  `,
  styles: [`
    .logo { display: block; width: auto; }
  `],
})
export class SoralyxLogoComponent {
  @Input() variant: 'gradient' | 'light' = 'gradient';
  @Input() size = 26;
}
