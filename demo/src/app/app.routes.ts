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
      { path: '', pathMatch: 'full', redirectTo: 'quotes' },
      { path: 'quotes', loadComponent: () => import('./quotes/quotes.component').then(m => m.QuotesComponent) },
      { path: 'section/:slug', loadComponent: () => import('./sections/section.component').then(m => m.SectionComponent) },
      { path: '**', redirectTo: 'quotes' },
    ],
  },
];
