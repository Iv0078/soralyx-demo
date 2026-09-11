import { Injectable } from '@angular/core';

const KEY = 'soralyx.auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Demo credentials */
  private readonly USER = 'admin';
  private readonly PASS = '12345';

  login(username: string, password: string): boolean {
    const ok = username.trim() === this.USER && password === this.PASS;
    if (ok) {
      try { sessionStorage.setItem(KEY, username.trim()); } catch { /* ignore */ }
    }
    return ok;
  }

  logout(): void {
    try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
  }

  get isAuthenticated(): boolean {
    try { return !!sessionStorage.getItem(KEY); } catch { return false; }
  }

  get currentUser(): string {
    try { return sessionStorage.getItem(KEY) ?? ''; } catch { return ''; }
  }
}
