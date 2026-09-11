import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { ShellComponent } from './shell/shell.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    component: ShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'section/customer-quotes' },
      { path: 'quotes', loadComponent: () => import('./quotes/quotes.component').then(m => m.QuotesComponent) },
      { path: 'rfq', loadComponent: () => import('./rfq/rfq-detail.component').then(m => m.RfqDetailComponent) },
      { path: 'load', loadComponent: () => import('./sections/load-page.component').then(m => m.LoadPageComponent) },
      { path: 'trace', loadComponent: () => import('./sections/tracking-page.component').then(m => m.TrackingPageComponent) },
      { path: 'carrier', loadComponent: () => import('./carrier/carrier-page.component').then(m => m.CarrierPageComponent) },
      { path: 'section/:slug', loadComponent: () => import('./sections/section.component').then(m => m.SectionComponent) },
      { path: '**', redirectTo: 'section/customer-quotes' },
    ],
  },
];
