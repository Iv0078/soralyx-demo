import { Component, signal } from '@angular/core';
import { NgClass, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetailContextService, CarrierBid } from '../sections/detail-context.service';
import { buildCarrierDetail } from '../quotes/carrier-detail';
import { Metric } from '../quotes/models';
import { DetailActionsComponent } from '../shared/detail-actions.component';
import { AiCallModalComponent } from '../sections/ai-call-modal.component';
import { AiProof } from '../sections/ai-proof';

interface ActiveLoad { load: string; lane: string; pickup: string; rate: string; status: string; tone: string; }
interface DocItem { name: string; meta: string; }
interface Note { who: string; initials: string; color: string; time: string; text: string; }

@Component({
  selector: 'app-carrier-page',
  standalone: true,
  imports: [NgClass, FormsModule, DetailActionsComponent, AiCallModalComponent],
  templateUrl: './carrier-page.component.html',
  styleUrl: './carrier-page.component.scss',
})
export class CarrierPageComponent {
  // AI dispatch proof (email chain / transcript), shown on top when AI-made
  aiProof: AiProof | null = null;
  showAi = signal(false);
  closeAi() { this.showAi.set(false); }

  bid: CarrierBid | null = null;
  tiles: Metric[] = [];          // Deliveries / Cancelled / On-time
  failures: Metric[] = [];       // OTP / OTD / Comms / Claims
  activity: { label: string; value: number; current?: boolean }[] = [];

  // pricing (when opened from a carrier quote)
  curSym = '$';
  bidRate = 0; bidHist = 0;
  origin = ''; destination = '';
  originAddr = ''; destAddr = '';
  pickup = 'Sep 15, 08:00'; delivery = 'Sep 17, 14:00';
  weight = '42,000 lbs'; commodity = 'Consumer electronics';
  get bidDelta() { return this.bidRate - this.bidHist; }
  get bidPct() { return this.bidHist ? (this.bidDelta / this.bidHist) * 100 : 0; }
  money0(n: number) { return this.curSym + Math.round(n).toLocaleString('en-US'); }

  private static ADDR: Record<string, string> = {
    'Los Angeles': '1200 Alameda St, Los Angeles, CA 90021', 'Dallas': '650 S Griffin St, Dallas, TX 75202',
    'Phoenix': '2400 W Jefferson St, Phoenix, AZ 85009', 'Denver': '4800 Havana St, Denver, CO 80239',
    'Chicago': '2300 S Throop St, Chicago, IL 60608', 'Atlanta': '3400 Bankhead Hwy, Atlanta, GA 30331',
    'Houston': '8200 Clinton Dr, Houston, TX 77029', 'Memphis': '3550 Southwide Dr, Memphis, TN 38118',
    'Toronto': '2451 Royal Windsor Dr, Mississauga, ON L5J 4S7', 'Buffalo': '1200 Niagara St, Buffalo, NY 14213',
    'Detroit': '2700 W Fort St, Detroit, MI 48216', 'Windsor': '3701 Wyandotte St E, Windsor, ON N8Y 1E2',
    'Salt Lake City': '1950 W 2100 S, Salt Lake City, UT 84119', 'Ontario': '2500 S Milliken Ave, Ontario, CA 91761',
  };
  private addr(city: string) { return CarrierPageComponent.ADDR[city] ?? city; }

  get maxActivity() { return Math.max(...this.activity.map(a => a.value), 1); }
  barHeight(v: number) { return Math.round((v / this.maxActivity) * 92) + 'px'; }
  notes = signal<Note[]>([
    { who: 'Dispatcher 1', initials: 'D1', color: '#6E6FFD', time: '1:20 PM', text: 'Reliable on the LA lanes — good comms. Prefer them for reefer when available.' },
    { who: 'Dispatcher 2', initials: 'D2', color: '#3396CD', time: 'Yesterday', text: 'Insurance cert on file through 2027. Cleared for hazmat class 3.' },
  ]);
  draft = '';
  addNote() {
    const t = this.draft.trim();
    if (!t) return;
    this.notes.update(n => [...n, { who: 'You', initials: 'A', color: '#6E6FFD', time: 'Just now', text: t }]);
    this.draft = '';
  }
  name = 'Carrier 1';
  mc = 'MC-000000';
  color = '#6E6FFD';
  monogram = 'C1';
  state = 'Verified';
  contact = { name: 'James Okafor', title: 'Dispatch Manager', phone: '(312) 555-0142', email: 'dispatch@carrier.example' };
  address: string[] = ['2200 W Cermak Rd', 'Chicago, IL 60608', 'United States'];

  activeLoads: ActiveLoad[] = [];

  docTab = signal<'docs' | 'permits'>('docs');
  documents: DocItem[] = [
    { name: 'W-9.pdf', meta: 'Tax form · valid' },
    { name: 'Certificate of insurance.pdf', meta: 'Insurance · exp 03-2027' },
    { name: 'Carrier packet.pdf', meta: 'Onboarding · signed' },
    { name: 'Rate agreement.pdf', meta: 'Contract · active' },
  ];
  permits: DocItem[] = [
    { name: 'MC authority', meta: 'FMCSA · active' },
    { name: 'IFTA license', meta: 'Fuel tax · 2026' },
    { name: 'Hazmat endorsement', meta: 'Class 3 · valid' },
    { name: 'CVOR (Ontario)', meta: 'Safety · good standing' },
  ];

  servicesOpen = signal(true);
  usaZones: string[] = [];
  canadaZones: string[] = [];

  get statePill() { return this.state === 'Verified' ? 'good' : this.state === 'Pending' ? 'blue' : 'warn'; }

  private hash(s: string): number { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; }
  private parseNum(s?: string): number { if (!s) return 0; const n = parseFloat(s.replace(/[^0-9.]/g, '')); return isNaN(n) ? 0 : n; }

  constructor(private location: Location, ctx: DetailContextService) {
    const c = ctx.carrier;
    if (c) {
      this.name = c.name; this.mc = c.mc; this.color = c.color; this.state = c.state || 'Verified';
      const d = buildCarrierDetail({ name: c.name, mc: c.mc, color: c.color });
      this.monogram = d.monogram; this.contact = d.contact; this.address = d.address;
      this.tiles = d.primary;         // Deliveries / Cancelled / On-time — like the popup
      this.failures = d.failures;     // OTP / OTD / Comms / Claims
      this.activity = d.activity;     // recent-activity bars
      this.bid = c.bid ?? null;
      if (this.bid) {
        this.curSym = (this.bid.activeQuote || '').trim().startsWith('C$') ? 'C$' : '$';
        this.bidRate = this.parseNum(this.bid.activeQuote);
        this.bidHist = this.parseNum(this.bid.histAvg);
        const parts = (this.bid.lane || '').split('→');
        this.origin = (parts[0] || '').trim();
        this.destination = (parts[1] || '').trim();
        this.originAddr = this.addr(this.origin);
        this.destAddr = this.addr(this.destination);
      }

      const h = this.hash(c.name + c.mc);
      const lanes = [
        ['Los Angeles → Dallas', 'Sep 12', '$2,650'], ['Phoenix → Denver', 'Sep 13', '$1,980'],
        ['Chicago → Atlanta', 'Sep 13', '$1,540'], ['Houston → Memphis', 'Sep 14', '$1,410'],
      ];
      const st = [['In transit', 'good'], ['At pickup', 'info'], ['In transit', 'good'], ['Dispatched', 'blue']];
      this.activeLoads = lanes.slice(0, 2 + (h % 3)).map((l, i) => ({
        load: 'L-90' + (188 - i * 7), lane: l[0], pickup: l[1], rate: l[2], status: st[i % 4][0], tone: st[i % 4][1],
      }));

      // Covered service zones (only covered ones are shown)
      const usa = ['Pacific', 'Mountain West', 'South Central', 'Midwest', 'Southeast', 'Northeast'];
      const can = ['British Columbia', 'Alberta', 'Prairies (SK/MB)', 'Ontario', 'Quebec', 'Atlantic'];
      this.usaZones = usa.filter((_, i) => (h >> i) & 1);
      this.canadaZones = can.filter((_, i) => (h >> (i + 2)) & 1);
      if (!this.usaZones.length) this.usaZones = ['Pacific', 'Mountain West'];
      if (!this.canadaZones.length) this.canadaZones = ['Alberta', 'Ontario'];
    }
    this.aiProof = ctx.aiProof;   // opened via the "Origin log" button, not automatically
  }
  back() { this.location.back(); }
}
