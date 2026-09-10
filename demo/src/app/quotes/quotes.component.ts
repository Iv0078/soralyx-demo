import { Component, computed, signal } from '@angular/core';
import { NgClass, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrierModalComponent } from './carrier-modal.component';
import { Carrier, CarrierDetail } from './models';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [NgClass, DecimalPipe, FormsModule, CarrierModalComponent],
  templateUrl: './quotes.component.html',
  styleUrl: './quotes.component.scss',
})
export class QuotesComponent {
  shipment = {
    customer: 'Northwind Traders',
    origin: 'Los Angeles, CA 90021',
    destination: 'Dallas, TX 75201',
    distance: 1435,
    weight: '42,000 lbs',
    trailer: 'Dry Van 53′',
    commodity: 'Consumer electronics',
    pickup: 'Sep 15, 08:00',
    delivery: 'Sep 17, 14:00',
  };

  // Pricing (editable)
  linehaul = signal(2650);
  fuel = signal(385);
  accessorials = signal(120);
  readonly truckstopAvg = 2800;

  allIn = computed(() => this.linehaul() + this.fuel() + this.accessorials());
  spread = computed(() => this.allIn() - this.truckstopAvg);
  spreadPct = computed(() => (this.spread() / this.truckstopAvg) * 100);
  perMileLinehaul = computed(() => this.linehaul() / this.shipment.distance);
  perMileFuel = computed(() => this.fuel() / this.shipment.distance);

  carriers: Carrier[] = [
    { id: 'c1', name: 'Carrier 1', monogram: 'C1', color: '#6E6FFD', mc: 'MC-448201', kind: 'asset',    trailer: 'Dry Van 53′', transitDays: 2, onTime: 96, histAvg: 2690, activeQuote: 2650, selected: true,  checked: true },
    { id: 'c2', name: 'Carrier 2', monogram: 'C2', color: '#3396CD', mc: 'MC-771043', kind: 'brokered',  trailer: 'Dry Van 53′', transitDays: 2, onTime: 94, histAvg: 2560, activeQuote: 2585, selected: false, checked: true },
    { id: 'c3', name: 'Carrier 3', monogram: 'C3', color: '#8f7bff', mc: 'MC-330918', kind: 'asset',    trailer: 'Dry Van 53′', transitDays: 3, onTime: 91, histAvg: 2780, activeQuote: 2740, selected: false, checked: false },
    { id: 'c4', name: 'Carrier 4', monogram: 'C4', color: '#5a6b8c', mc: 'MC-559277', kind: 'asset',    trailer: 'Dry Van 53′', transitDays: 2, onTime: 95, histAvg: 2720, activeQuote: null,  selected: false, checked: false },
  ];

  get allChecked(): boolean { return this.carriers.every(c => c.checked); }
  get someChecked(): boolean { return this.carriers.some(c => c.checked) && !this.allChecked; }
  toggleAll() { const v = !this.allChecked; this.carriers.forEach(c => c.checked = v); }

  // modal
  showModal = signal(false);
  detail: CarrierDetail | null = null;

  private baseDetail(c: Carrier): CarrierDetail {
    return {
      name: c.name, monogram: c.monogram, color: c.color, mc: c.mc,
      contact: { name: 'James Okafor', title: 'Dispatch Manager', phone: '(312) 555-0142', email: 'dispatch@carrier.example' },
      address: ['2200 W Cermak Rd', 'Chicago, IL 60608', 'United States'],
      primary: [
        { label: 'Deliveries', value: '128', state: 'normal' },
        { label: 'Cancelled', value: '4', state: 'bad', sub: '3.1% rate' },
        { label: 'On-time delivery', value: '96%', state: 'good' },
      ],
      failures: [
        { label: 'OTP failure', value: '2.1%', state: 'normal' },
        { label: 'OTD failure', value: '3.4%', state: 'normal' },
        { label: 'Comms failure', value: '9.2%', state: 'bad' },
        { label: 'Claims', value: '0.6%', state: 'normal' },
      ],
      activity: [
        { label: 'Apr', value: 6 }, { label: 'May', value: 9 }, { label: 'Jun', value: 8 },
        { label: 'Jul', value: 11 }, { label: 'Aug', value: 13 }, { label: 'Sep', value: 5, current: true },
      ],
      deliveries: [
        { load: 'L-90118', lane: 'Los Angeles → Dallas', date: 'Sep 2', rate: '$2,640', status: 'Delivered' },
        { load: 'L-89944', lane: 'Phoenix → Dallas', date: 'Aug 24', rate: '$1,920', status: 'Delivered' },
        { load: 'L-89760', lane: 'Los Angeles → Houston', date: 'Aug 15', rate: '$2,880', status: 'Delivered' },
        { load: 'L-89512', lane: 'Los Angeles → Dallas', date: 'Aug 3', rate: '$2,600', status: 'Delivered' },
        { load: 'L-89330', lane: 'Ontario → Dallas', date: 'Jul 22', rate: '$2,710', status: 'Cancelled' },
        { load: 'L-89201', lane: 'Los Angeles → Dallas', date: 'Jul 14', rate: '$2,650', status: 'Delivered' },
      ],
      deliveriesTotal: 128,
    };
  }

  openCarrier(c: Carrier) { this.detail = this.baseDetail(c); this.showModal.set(true); }
  closeModal() { this.showModal.set(false); }

  notes = [
    { who: 'Dispatcher 1', initials: 'D1', color: '#6E6FFD', time: '2:14 PM', text: 'Customer is flexible on pickup — can push to 9/16 if it shaves the linehaul.' },
    { who: 'Dispatcher 2', initials: 'D2', color: '#3396CD', time: '11:40 AM', text: 'Carrier confirmed dry van is fine, no reefer needed. Their $2,650 holds through EOD.' },
    { who: 'Dispatcher 1', initials: 'D1', color: '#6E6FFD', time: 'Yesterday', text: 'Watch detention at the LA DC — 2 hr free only. Added a $120 accessorial to be safe.' },
  ];

  // formatting helpers
  money(n: number): string { return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  money0(n: number): string { return '$' + Math.round(n).toLocaleString('en-US'); }
  perMile(n: number): string { return '$' + n.toFixed(2) + ' / mi'; }
}
