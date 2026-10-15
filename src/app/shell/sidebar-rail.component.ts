import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAV_MENUS, NavMenu } from '../core/nav';

interface Shortcut { label: string; link: string; }

const STORE_KEY = 'soralyx.demo.shortcuts';
const MAX_VISIBLE = 8;

// Left utility rail (ported from the website). The "+" opens a popover listing
// every nav sub-page; chosen pages appear as monogram shortcuts (max 8). The
// rail also carries fixed quick links (messages, calendar) and help.
@Component({
  selector: 'app-sidebar-rail',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
<aside class="rail">
  <div class="rwrap">
    <button class="util primary" type="button" [class.on]="addOpen()" (click)="toggleAdd($event)" title="Add shortcut" aria-label="Add shortcut">
      <svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
    </button>

    @if (addOpen()) {
      <div class="sheet" (click)="$event.stopPropagation()">
        <div class="sheet-head">
          <span>Add shortcuts <em class="count" [class.full]="full()">{{ shortcuts().length }}/{{ max }}</em></span>
          <button class="x" type="button" (click)="closeAdd()" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div class="sheet-body">
          @for (m of menus; track m.label) {
            @if (m.items.length) {
              <div class="grp">
                <div class="grp-title">{{ m.label }}</div>
                <div class="grp-pills">
                  @for (it of m.items; track it.link) {
                    <button type="button" class="chip" [class.on]="isOn(it.link)"
                            [disabled]="full() && !isOn(it.link)" (click)="toggle(it)">
                      @if (isOn(it.link)) {
                        <svg class="chk" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      }
                      {{ it.name }}
                    </button>
                  }
                </div>
              </div>
            }
          }
        </div>
      </div>
    }
  </div>

  <div class="sep"></div>

  <a class="util" routerLink="/section/emp-chat" routerLinkActive="on" title="Messages" aria-label="Messages">
    <svg viewBox="0 0 24 24" fill="none"><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 3v-3H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
  </a>
  <a class="util" routerLink="/section/calendar" routerLinkActive="on" title="Calendar" aria-label="Calendar">
    <svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5" width="17" height="16" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
  </a>

  @if (shortcuts().length) {
    <div class="sep"></div>
    <div class="group">
      @for (s of shortcuts(); track s.link) {
        <a class="util sc" [routerLink]="s.link" routerLinkActive="on" [title]="s.label">{{ monogram(s.label) }}</a>
      }
    </div>
  }

  <div class="spacer"></div>

  <button class="util" type="button" title="Help" aria-label="Help">
    <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M9.3 9.2a2.7 2.7 0 0 1 5.2 1c0 1.8-2.5 2-2.5 3.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>
  </button>
</aside>
  `,
  styles: [`
:host { display: block; align-self: stretch; }

.rail {
  width: 4.375rem; height: 100%;
  background: linear-gradient(180deg, #37a1d7 0%, var(--brand-2) 55%, #2f8ac0 100%);
  border-radius: 0 1.25rem 1.25rem 0;
  display: flex; flex-direction: column; align-items: center;
  gap: 0.5rem; padding: 1rem 0;
}
.group { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; margin-top: 0.5rem; }
.spacer { flex: 1; }
.sep { width: 1.75rem; height: 1px; background: rgba(255,255,255,.28); margin: 0.125rem 0; flex: none; }
.rwrap { position: relative; display: flex; }

.util.sc { font-size: 0.8rem; font-weight: 800; letter-spacing: -.02em; text-decoration: none; }

.util {
  width: 2.5rem; height: 2.5rem; flex: none; border: 0; border-radius: 0.75rem;
  background: rgba(255,255,255,.12); color: #fff; cursor: pointer; text-decoration: none;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s, color .15s;
}
.util:hover { background: rgba(255,255,255,.26); }
.util svg { width: 1.25rem; height: 1.25rem; }
.util.on { background: #fff; color: var(--brand-2); }

.util.primary { background: #fff; color: var(--brand); box-shadow: 0 0.25rem 0.75rem rgba(0,0,0,.18); }
.util.primary:hover { background: var(--brand-tint); }
.util.primary svg { width: 1.35rem; height: 1.35rem; }

/* add-shortcut popover */
.sheet {
  position: absolute; left: calc(100% + 0.625rem); top: 0; z-index: 70;
  width: 19rem; max-height: 32rem; display: flex; flex-direction: column;
  background: #fff; border: 1px solid #eef0f5; border-radius: 0.875rem;
  box-shadow: 0 0.75rem 2rem rgba(30,36,60,.22);
  color: #1c2030;
}
.sheet-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.875rem 1rem; border-bottom: 1px solid #f2f3f7;
  font-size: 0.9rem; font-weight: 700;
}
.x { border: 0; background: none; color: #9aa2b2; cursor: pointer; display: flex; padding: 0.15rem; }
.x svg { width: 1.05rem; height: 1.05rem; }
.x:hover { color: #414a5c; }
.sheet-body { overflow-y: auto; padding: 0.5rem 1rem 1rem; }
.grp { margin-top: 0.75rem; }
.grp-title { font-size: 0.6875rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: #9aa2b2; margin-bottom: 0.5rem; }
.grp-pills { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.chip {
  display: inline-flex; align-items: center; gap: 0.35rem;
  border: 1px solid #e4e7ef; border-radius: 999px; padding: 0.375rem 0.75rem;
  background: #fff; color: #414a5c; cursor: pointer; font: inherit; font-size: 0.8rem; font-weight: 600;
  transition: background .12s, border-color .12s, color .12s;
}
.chip:hover:not(:disabled) { border-color: var(--brand-border); color: var(--brand); }
.chip:disabled { opacity: .4; cursor: not-allowed; }
.chip.on { background: var(--brand); border-color: var(--brand); color: #fff; }
.chip.on:hover { background: var(--brand-dark); color: #fff; }
.chip .chk { width: 0.85rem; height: 0.85rem; }
.count { font-style: normal; font-size: 0.75rem; font-weight: 700; color: #9aa2b2; margin-left: 0.25rem; }
.count.full { color: var(--brand); }
  `],
})
export class SidebarRailComponent {
  menus: NavMenu[] = NAV_MENUS;
  max = MAX_VISIBLE;

  addOpen = signal(false);
  shortcuts = signal<Shortcut[]>(this.load());

  full(): boolean { return this.shortcuts().length >= this.max; }
  isOn(link: string): boolean { return this.shortcuts().some(s => s.link === link); }

  toggleAdd(ev: Event): void { ev.stopPropagation(); this.addOpen.update(v => !v); }
  closeAdd(): void { this.addOpen.set(false); }

  @HostListener('document:click')
  onOutside(): void { this.addOpen.set(false); }

  toggle(it: { name: string; link: string }): void {
    const list = [...this.shortcuts()];
    const i = list.findIndex(s => s.link === it.link);
    if (i >= 0) list.splice(i, 1);
    else { if (list.length >= this.max) return; list.push({ label: it.name, link: it.link }); }
    this.shortcuts.set(list);
    this.save(list);
  }

  monogram(label: string): string {
    const w = label.replace(/[()]/g, '').split(/\s+/).filter(Boolean);
    return (w.length > 1 ? w[0][0] + w[1][0] : label.slice(0, 2)).toUpperCase();
  }

  private load(): Shortcut[] {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]'); } catch { return []; }
  }
  private save(list: Shortcut[]): void {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch { /* ignore */ }
  }
}
