import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cell } from './mock-data';

interface Note { who: string; initials: string; color: string; time: string; text: string; }

@Component({
  selector: 'app-load-modal',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './load-modal.component.html',
  styleUrl: './load-modal.component.scss',
})
export class LoadModalComponent implements OnInit {
  @Input() row!: Record<string, Cell>;
  @Input() inline = false;   // render as an in-page panel instead of an overlay
  @Output() closed = new EventEmitter<void>();
  @Output() expand = new EventEmitter<void>();

  notes = signal<Note[]>([]);
  draft = '';

  ngOnInit() {
    this.notes.set([
      { who: 'Dispatcher 1', initials: 'D1', color: '#6E6FFD', time: '9:12 AM', text: 'Shipper confirmed the pickup window. Appointment set with the DC.' },
      { who: 'Dispatcher 2', initials: 'D2', color: '#3396CD', time: 'Yesterday', text: 'Rate looks competitive for this lane — flagged as a priority booking.' },
    ]);
  }

  has(key: string) { return !!this.row?.[key]?.text; }
  val(key: string) { return this.row?.[key]?.text ?? ''; }
  tone(key: string) { return this.row?.[key]?.tone ?? 'default'; }
  private static ADDR: Record<string, string> = {
    'Los Angeles': '1200 Alameda St, Los Angeles, CA 90021',
    'Dallas': '650 S Griffin St, Dallas, TX 75202',
    'Phoenix': '2400 W Jefferson St, Phoenix, AZ 85009',
    'Denver': '4800 Havana St, Denver, CO 80239',
    'Chicago': '2300 S Throop St, Chicago, IL 60608',
    'Atlanta': '3400 Bankhead Hwy, Atlanta, GA 30331',
    'Seattle': '3800 4th Ave S, Seattle, WA 98134',
    'Portland': '5100 NW Front Ave, Portland, OR 97210',
    'Newark': '900 Doremus Ave, Newark, NJ 07105',
    'Boston': '25 Drydock Ave, Boston, MA 02210',
    'Houston': '8200 Clinton Dr, Houston, TX 77029',
    'Memphis': '3550 Southwide Dr, Memphis, TN 38118',
    'Kansas City': '1600 Universal Ave, Kansas City, MO 64120',
    'Ontario': '2500 S Milliken Ave, Ontario, CA 91761',
    'Las Vegas': '3900 W Diablo Dr, Las Vegas, NV 89118',
    'Salt Lake City': '1950 W 2100 S, Salt Lake City, UT 84119',
    'Toronto': '2451 Royal Windsor Dr, Mississauga, ON L5J 4S7',
    'Buffalo': '1200 Niagara St, Buffalo, NY 14213',
    'Detroit': '2700 W Fort St, Detroit, MI 48216',
    'Windsor': '3701 Wyandotte St E, Windsor, ON N8Y 1E2',
  };
  private addr(city: string) { return LoadModalComponent.ADDR[city] ?? city; }
  get origin() { return this.addr(this.val('lane').split('→')[0].trim()); }
  get dest() { return this.addr((this.val('lane').split('→')[1] ?? '').trim()); }

  addNote() {
    const t = this.draft.trim();
    if (!t) return;
    this.notes.update(n => [...n, { who: 'You', initials: 'A', color: '#6E6FFD', time: 'Just now', text: t }]);
    this.draft = '';
  }
  close() { this.closed.emit(); }
}
