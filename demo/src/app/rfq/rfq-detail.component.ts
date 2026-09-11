import { Component, computed, signal } from '@angular/core';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RfqContextService } from './rfq-context.service';
import { DetailActionsComponent } from '../shared/detail-actions.component';

interface Lane { origin: string; ostate: string; dest: string; dstate: string; miles: number; }
interface DocRow { name: string; kind: string; date: string; }
interface Note { who: string; initials: string; color: string; time: string; text: string; }

@Component({
  selector: 'app-rfq-detail',
  standalone: true,
  imports: [FormsModule, DetailActionsComponent],
  templateUrl: './rfq-detail.component.html',
  styleUrl: './rfq-detail.component.scss',
})
export class RfqDetailComponent {
  no = signal('482013');
  customer = signal('Customer 1');
  equipment = signal('Dry Van');
  equipType = signal('53′');
  currency = signal('USD');
  commodity = signal('Consumer goods');
  weight = signal('42,000');
  cargoType = signal('TL');
  deadline = signal('09-16-2026');
  status = signal('Open');
  lanesCount = signal(6);

  statusPillClass = computed(() => this.status() === 'Open' ? 'good' : 'grey');

  // A small pool of realistic city pairs; the RFQ shows the first N.
  private pool: Lane[] = [
    { origin: 'Edmonton', ostate: 'AB', dest: 'Saskatoon', dstate: 'SK', miles: 325 },
    { origin: 'Edmonton', ostate: 'AB', dest: 'Calgary',   dstate: 'AB', miles: 186 },
    { origin: 'Edmonton', ostate: 'AB', dest: 'Winnipeg',  dstate: 'MB', miles: 811 },
    { origin: 'Toronto',  ostate: 'ON', dest: 'Montreal',  dstate: 'QC', miles: 335 },
    { origin: 'Toronto',  ostate: 'ON', dest: 'Buffalo',   dstate: 'NY', miles: 100 },
    { origin: 'Vancouver',ostate: 'BC', dest: 'Kelowna',   dstate: 'BC', miles: 242 },
    { origin: 'Calgary',  ostate: 'AB', dest: 'Regina',    dstate: 'SK', miles: 470 },
    { origin: 'Montreal', ostate: 'QC', dest: 'Quebec City',dstate: 'QC', miles: 155 },
    { origin: 'Winnipeg', ostate: 'MB', dest: 'Thunder Bay',dstate: 'ON', miles: 437 },
    { origin: 'Chicago',  ostate: 'IL', dest: 'Detroit',   dstate: 'MI', miles: 283 },
    { origin: 'Dallas',   ostate: 'TX', dest: 'Houston',   dstate: 'TX', miles: 239 },
    { origin: 'Los Angeles', ostate: 'CA', dest: 'Phoenix',dstate: 'AZ', miles: 373 },
  ];

  get lanes(): Lane[] { return this.pool.slice(0, Math.max(1, Math.min(this.pool.length, this.lanesCount()))); }
  get curSymbol() { return this.currency() === 'CAD' ? 'C$' : '$'; }
  get totalMiles() { return this.lanes.reduce((s, l) => s + l.miles, 0); }

  documents: DocRow[] = [
    { name: 'RFQ packet.pdf', kind: 'RFQ', date: 'Sep 9' },
    { name: 'Lane list.xlsx', kind: 'Lanes', date: 'Sep 9' },
    { name: 'Rate template.xlsx', kind: 'Template', date: 'Sep 9' },
    { name: 'MSA — customer.pdf', kind: 'Contract', date: 'Aug 30' },
  ];
  notes = signal<Note[]>([
    { who: 'Dispatcher 1', initials: 'D1', color: '#6E6FFD', time: '2:14 PM', text: 'Customer wants all-in rates by lane, fuel included. Bid due EOD on the deadline.' },
    { who: 'Dispatcher 2', initials: 'D2', color: '#3396CD', time: '11:05 AM', text: 'Reefer capacity is tight on the Edmonton lanes this week — pad the linehaul a bit.' },
  ]);
  draft = '';
  addNote() {
    const t = this.draft.trim();
    if (!t) return;
    this.notes.update(n => [...n, { who: 'You', initials: 'A', color: '#6E6FFD', time: 'Just now', text: t }]);
    this.draft = '';
  }

  constructor(private location: Location, ctx: RfqContextService) {
    const r = ctx.current;
    if (r) {
      this.no.set(r.no || this.no());
      this.customer.set(r.customer || this.customer());
      this.equipment.set(r.equipment || this.equipment());
      this.equipType.set(r.equipType || this.equipType());
      this.currency.set(r.currency || this.currency());
      this.commodity.set(r.commodity || this.commodity());
      this.weight.set(r.weight || this.weight());
      this.cargoType.set(r.cargoType || this.cargoType());
      this.deadline.set(r.deadline || this.deadline());
      this.status.set(r.status || this.status());
      this.lanesCount.set(r.lanesCount || this.lanesCount());
    }
  }
  back() { this.location.back(); }
}
