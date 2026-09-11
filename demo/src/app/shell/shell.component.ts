import { Component, HostListener, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { SoralyxLogoComponent } from '../shared/logo.component';
import { NAV_MENUS, NavMenu } from '../core/nav';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [NgClass, RouterLink, RouterOutlet, SoralyxLogoComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  readonly navMenus: NavMenu[] = NAV_MENUS;

  openMenu = signal<number | null>(null);
  accountOpen = signal(false);
  notifOpen = signal(false);

  notifications = signal([
    { tone: 'warn', title: 'Scheduled maintenance', text: 'System update today at 9:00 PM ET. Expect a brief interruption.', time: '2h ago' },
    { tone: 'info', title: 'New load board offers', text: '37 new offers matched to your lanes today.', time: '4h ago' },
  ]);
  dismissNotif(i: number, ev: Event) { ev.stopPropagation(); this.notifications.update(a => a.filter((_, idx) => idx !== i)); }

  theme = signal<'light' | 'dark'>('light');

  constructor(private router: Router, private auth: AuthService) {
    let t: 'light' | 'dark' = 'light';
    try { const s = localStorage.getItem('soralyx.theme'); if (s === 'dark' || s === 'light') t = s; } catch { /* ignore */ }
    this.theme.set(t);
    document.documentElement.setAttribute('data-theme', t);
  }
  toggleTheme(ev: Event) {
    ev.stopPropagation();
    const t = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(t);
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('soralyx.theme', t); } catch { /* ignore */ }
  }

  get user() { return this.auth.currentUser || 'admin'; }
  get initial() { return this.user.charAt(0).toUpperCase(); }
  private get url() { return this.router.url.split('?')[0]; }

  isMenuActive(m: NavMenu): boolean {
    if (m.link) return this.url === m.link;
    // the rate-quote workspace (/quotes) belongs to the Quotes menu even though it isn't a menu item
    if (m.label === 'Quotes' && (this.url === '/quotes' || this.url === '/rfq')) return true;
    return m.items.some(i => this.isItemActive(i.link));
  }
  isItemActive(link: string): boolean { return this.url === link; }

  toggleMenu(i: number, ev: Event) { ev.stopPropagation(); this.accountOpen.set(false); this.notifOpen.set(false); this.openMenu.set(this.openMenu() === i ? null : i); }
  toggleAccount(ev: Event) { ev.stopPropagation(); this.openMenu.set(null); this.notifOpen.set(false); this.accountOpen.set(!this.accountOpen()); }
  toggleNotif(ev: Event) { ev.stopPropagation(); this.openMenu.set(null); this.accountOpen.set(false); this.notifOpen.set(!this.notifOpen()); }
  onItemClick() { this.openMenu.set(null); }

  signOut() { this.accountOpen.set(false); this.auth.logout(); this.router.navigateByUrl('/login'); }

  @HostListener('document:click')
  closeAll() { this.openMenu.set(null); this.accountOpen.set(false); this.notifOpen.set(false); }
}
