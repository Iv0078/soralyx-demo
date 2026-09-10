import { Component, HostListener, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { SoralyxLogoComponent } from '../shared/logo.component';

interface NavItem { name: string; link: string; }
interface NavMenu { label: string; items: NavItem[]; }

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [NgClass, RouterLink, RouterOutlet, SoralyxLogoComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  readonly navMenus: NavMenu[] = [
    { label: 'Dashboard', items: [
      { name: 'Load board offers', link: '/section/load-board' },
      { name: 'Load offers', link: '/section/load-offers' },
      { name: 'Tracing', link: '/section/tracing' } ] },
    { label: 'Quotes', items: [
      { name: 'All', link: '/section/quotes-all' },
      { name: 'Carrier quotes', link: '/quotes' },
      { name: 'Broker load quotes', link: '/section/broker-quotes' } ] },
    { label: 'Partners', items: [
      { name: 'Carriers', link: '/section/carriers' },
      { name: 'Customers / Shippers', link: '/section/customers' },
      { name: 'Consignees', link: '/section/consignees' },
      { name: 'Customs brokers', link: '/section/customs-brokers' } ] },
    { label: 'Accounting', items: [
      { name: 'Documents', link: '/section/documents' },
      { name: 'Invoices', link: '/section/invoices' },
      { name: 'Payments', link: '/section/payments' },
      { name: 'Customer support', link: '/section/support' } ] },
    { label: 'Employees', items: [
      { name: 'Employee resources', link: '/section/emp-resources' },
      { name: 'Employee chat', link: '/section/emp-chat' },
      { name: 'Employee benefits', link: '/section/emp-benefits' } ] },
  ];

  openMenu = signal<number | null>(null);
  accountOpen = signal(false);

  constructor(private router: Router, private auth: AuthService) {}

  get user() { return this.auth.currentUser || 'admin'; }
  get initial() { return this.user.charAt(0).toUpperCase(); }
  private get url() { return this.router.url.split('?')[0]; }

  isMenuActive(m: NavMenu): boolean { return m.items.some(i => this.isItemActive(i.link)); }
  isItemActive(link: string): boolean { return this.url === link; }

  toggleMenu(i: number, ev: Event) { ev.stopPropagation(); this.accountOpen.set(false); this.openMenu.set(this.openMenu() === i ? null : i); }
  toggleAccount(ev: Event) { ev.stopPropagation(); this.openMenu.set(null); this.accountOpen.set(!this.accountOpen()); }
  onItemClick() { this.openMenu.set(null); }

  signOut() { this.accountOpen.set(false); this.auth.logout(); this.router.navigateByUrl('/login'); }

  @HostListener('document:click')
  closeAll() { this.openMenu.set(null); this.accountOpen.set(false); }
}
