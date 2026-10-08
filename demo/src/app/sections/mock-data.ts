export type Tone = 'default' | 'good' | 'bad' | 'warn' | 'info' | 'low' | 'med' | 'high' | 'blue' | 'grey' | 'purple' | 'white';

export interface Cell { text: string; tone?: Tone; mono?: boolean; strong?: boolean; }
export interface Stat {
  label: string; value?: string; tone?: Tone;
  filter?: { key: string; value: string };
  countAll?: boolean;
  pill?: { text: string; key: string; value: string; tone?: Tone };  // small count pill inside the tile
}
export interface CardItem { title: string; desc: string; tag?: string; icon?: string; }

export interface Section {
  title: string;
  subtitle: string;
  kind: 'table' | 'cards' | 'chat' | 'calendar';
  stats?: Stat[];
  columns?: { key: string; label: string; align?: 'left' | 'right' | 'center' }[];
  rows?: Record<string, Cell>[];
  cards?: CardItem[];
  chat?: ChatData;
  searchKeys?: string[];       // columns the search box matches against
  filterKeys?: string[];       // columns exposed as dropdown filters
  rowAction?: 'tracing' | 'quote' | 'carrier' | 'load' | 'rfq';  // what clicking a row does
  addQuote?: boolean;          // show the "Add quote" button
  backTo?: string;             // show a back arrow returning to this route (board sub-pages)
  calEvents?: Record<number, { label: string; tone: string }[]>;  // events for a calendar section
}

export interface ChatData {
  channels: { name: string; unread?: number; active?: boolean }[];
  title: string;
  messages: { who: string; initials: string; color: string; time: string; text: string; me?: boolean }[];
}

const P = '#6E6FFD', B = '#3396CD';
const c = (text: string, extra: Partial<Cell> = {}): Cell => ({ text, ...extra });

export const SECTIONS: Record<string, Section> = {
  /* ---------------- Dashboard ---------------- */
  'load-board': {
    title: 'Dispatch boards',
    subtitle: 'External loads available to book on connected boards',
    kind: 'table',
    searchKeys: ['customer', 'carrier', 'ship', 'delivery'],
    filterKeys: ['importance', 'customer', 'carrier', 'equip', 'curr'],
    rowAction: 'load',
    stats: [
      { label: 'Total offers', countAll: true },
      { label: 'High', tone: 'high', filter: { key: 'importance', value: 'High' } },
      { label: 'Medium', tone: 'med', filter: { key: 'importance', value: 'Medium' } },
      { label: 'Low', tone: 'low', filter: { key: 'importance', value: 'Low' } },
    ],
    columns: [
      { key: 'load', label: 'Load' }, { key: 'customer', label: 'Customer' },
      { key: 'carrier', label: 'Carrier' }, { key: 'origin', label: 'Origin' }, { key: 'dest', label: 'Destination' },
      { key: 'equip', label: 'Equipment' },
      { key: 'ship', label: 'Ship date', align: 'right' }, { key: 'delivery', label: 'Delivery date', align: 'right' },
      { key: 'rate', label: 'Rate', align: 'right' }, { key: 'curr', label: 'Currency', align: 'center' },
      { key: 'importance', label: 'Importance', align: 'right' },
    ],
    rows: [
      { load: c('LB-55120', { mono: true, tone: 'info' }), customer: c('Customer 1'), carrier: c('Carrier 1'), origin: c('Los Angeles'), dest: c('Dallas'), lane: c('Los Angeles → Dallas'), equip: c('Dry Van 53′'), importance: c('High', { tone: 'high' }), ship: c('09-12-2026', { mono: true }), delivery: c('09-14-2026', { mono: true }), rate: c('$2,720', { mono: true, strong: true }), curr: c('USD'), dispatcher: c('Dispatcher 1'), contactName: c('Dana Whitfield'), contactPhone: c('(213) 555-0190', { mono: true }), contactEmail: c('ops@customer1.example') },
      { load: c('LB-55118', { mono: true, tone: 'info' }), customer: c('Customer 2'), carrier: c('Carrier 3'), origin: c('Phoenix'), dest: c('Denver'), lane: c('Phoenix → Denver'), equip: c('Reefer'), importance: c('Medium', { tone: 'med' }), ship: c('09-12-2026', { mono: true }), delivery: c('09-13-2026', { mono: true }), rate: c('$1,980', { mono: true, strong: true }), curr: c('USD'), dispatcher: c('Dispatcher 2'), contactName: c('Raj Alvarez'), contactPhone: c('(602) 555-0120', { mono: true }), contactEmail: c('dispatch@customer2.example') },
      { load: c('LB-55101', { mono: true, tone: 'info' }), customer: c('Customer 3'), carrier: c('Carrier 2'), origin: c('Chicago'), dest: c('Atlanta'), lane: c('Chicago → Atlanta'), equip: c('Dry Van 53′'), importance: c('Low', { tone: 'low' }), ship: c('09-13-2026', { mono: true }), delivery: c('09-14-2026', { mono: true }), rate: c('$1,540', { mono: true, strong: true }), curr: c('USD'), dispatcher: c('Dispatcher 1'), contactName: c('Sara Nguyen'), contactPhone: c('(312) 555-0133', { mono: true }), contactEmail: c('logistics@customer3.example') },
      { load: c('LB-55097', { mono: true, tone: 'info' }), customer: c('Customer 1'), carrier: c('Carrier 4'), origin: c('Seattle'), dest: c('Portland'), lane: c('Seattle → Portland'), equip: c('Flatbed'), importance: c('High', { tone: 'high' }), ship: c('09-13-2026', { mono: true }), delivery: c('09-13-2026', { mono: true }), rate: c('$620', { mono: true, strong: true }), curr: c('USD'), dispatcher: c('Dispatcher 2'), contactName: c('Dana Whitfield'), contactPhone: c('(213) 555-0190', { mono: true }), contactEmail: c('ops@customer1.example') },
      { load: c('LB-55081', { mono: true, tone: 'info' }), customer: c('Customer 4'), carrier: c('Carrier 1'), origin: c('Toronto'), dest: c('Detroit'), lane: c('Toronto → Detroit'), equip: c('Dry Van 53′'), importance: c('Medium', { tone: 'med' }), ship: c('09-14-2026', { mono: true }), delivery: c('09-15-2026', { mono: true }), rate: c('C$1,060', { mono: true, strong: true }), curr: c('CAD'), dispatcher: c('Dispatcher 1'), contactName: c('Jon Park'), contactPhone: c('(416) 555-0177', { mono: true }), contactEmail: c('freight@customer4.example') },
      { load: c('LB-55066', { mono: true, tone: 'info' }), customer: c('Customer 2'), carrier: c('Carrier 5'), origin: c('Houston'), dest: c('Memphis'), lane: c('Houston → Memphis'), equip: c('Reefer'), importance: c('High', { tone: 'high' }), ship: c('09-14-2026', { mono: true }), delivery: c('09-16-2026', { mono: true }), rate: c('$1,410', { mono: true, strong: true }), curr: c('USD'), dispatcher: c('Dispatcher 2'), contactName: c('Raj Alvarez'), contactPhone: c('(602) 555-0120', { mono: true }), contactEmail: c('dispatch@customer2.example') },
      { load: c('LB-55040', { mono: true, tone: 'info' }), customer: c('Customer 3'), carrier: c('Carrier 3'), origin: c('Dallas'), dest: c('Kansas City'), lane: c('Dallas → Kansas City'), equip: c('Dry Van 53′'), importance: c('Low', { tone: 'low' }), ship: c('09-15-2026', { mono: true }), delivery: c('09-16-2026', { mono: true }), rate: c('$1,120', { mono: true, strong: true }), curr: c('USD'), dispatcher: c('Dispatcher 1'), contactName: c('Sara Nguyen'), contactPhone: c('(312) 555-0133', { mono: true }), contactEmail: c('logistics@customer3.example') },
    ],
  },
  'load-offers': {
    title: 'Load offers',
    subtitle: 'Loads offered to your carriers, awaiting acceptance',
    kind: 'table',
    searchKeys: ['carrier', 'lane'],
    filterKeys: ['status', 'carrier', 'curr'],
    rowAction: 'load',
    columns: [
      { key: 'date', label: 'Date' }, { key: 'load', label: 'Load' },
      { key: 'carrier', label: 'Carrier' }, { key: 'origin', label: 'Origin' }, { key: 'dest', label: 'Destination' },
      { key: 'rate', label: 'Offer', align: 'right' }, { key: 'curr', label: 'Currency', align: 'center' },
      { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { date: c('09-15-2026 - 08:00', { mono: true }), load: c('L-90231', { mono: true, tone: 'info' }), carrier: c('Carrier 1'), origin: c('Los Angeles'), dest: c('Dallas'), lane: c('Los Angeles → Dallas'), rate: c('$2,650', { mono: true, strong: true }), curr: c('USD'), status: c('Pending', { tone: 'warn' }), dispatcher: c('Dispatcher 1'), contactName: c('Dana Whitfield'), contactPhone: c('(213) 555-0190', { mono: true }), contactEmail: c('ops@customer1.example') },
      { date: c('09-15-2026 - 09:20', { mono: true }), load: c('L-90228', { mono: true, tone: 'info' }), carrier: c('Carrier 3'), origin: c('Ontario'), dest: c('Phoenix'), lane: c('Ontario → Phoenix'), rate: c('$980', { mono: true, strong: true }), curr: c('USD'), status: c('Accepted', { tone: 'good' }), dispatcher: c('Dispatcher 2'), contactName: c('Raj Alvarez'), contactPhone: c('(602) 555-0120', { mono: true }), contactEmail: c('dispatch@customer2.example') },
      { date: c('09-14-2026 - 16:45', { mono: true }), load: c('L-90224', { mono: true, tone: 'info' }), carrier: c('Carrier 2'), origin: c('Dallas'), dest: c('Memphis'), lane: c('Dallas → Memphis'), rate: c('$1,240', { mono: true, strong: true }), curr: c('USD'), status: c('Accepted', { tone: 'good' }), dispatcher: c('Dispatcher 1'), contactName: c('Sara Nguyen'), contactPhone: c('(312) 555-0133', { mono: true }), contactEmail: c('logistics@customer3.example') },
      { date: c('09-14-2026 - 11:05', { mono: true }), load: c('L-90219', { mono: true, tone: 'info' }), carrier: c('Carrier 4'), origin: c('Windsor'), dest: c('Detroit'), lane: c('Windsor → Detroit'), rate: c('C$920', { mono: true, strong: true }), curr: c('CAD'), status: c('Declined', { tone: 'bad' }), dispatcher: c('Dispatcher 2'), contactName: c('Jon Park'), contactPhone: c('(519) 555-0177', { mono: true }), contactEmail: c('freight@customer4.example') },
      { date: c('09-13-2026 - 14:30', { mono: true }), load: c('L-90215', { mono: true, tone: 'info' }), carrier: c('Carrier 1'), origin: c('Los Angeles'), dest: c('Las Vegas'), lane: c('Los Angeles → Las Vegas'), rate: c('$540', { mono: true, strong: true }), curr: c('USD'), status: c('Pending', { tone: 'warn' }), dispatcher: c('Dispatcher 1'), contactName: c('Dana Whitfield'), contactPhone: c('(213) 555-0190', { mono: true }), contactEmail: c('ops@customer1.example') },
    ],
  },
  'tracing': {
    title: 'Tracing',
    subtitle: 'Live status of shipments in transit',
    kind: 'table',
    searchKeys: ['carrier', 'lane', 'client', 'dispatcher'],
    filterKeys: ['status', 'carrier', 'dispatcher'],
    rowAction: 'tracing',
    stats: [
      { label: 'In transit', countAll: true, tone: 'info' },
      { label: 'On schedule', tone: 'good', filter: { key: 'status', value: 'On schedule' } },
      { label: 'Cancelled', tone: 'bad', filter: { key: 'status', value: 'Cancelled' } },
      { label: 'Delayed', tone: 'warn', filter: { key: 'status', value: 'Delayed' } },
    ],
    columns: [
      { key: 'load', label: 'Load' }, { key: 'carrier', label: 'Carrier' },
      { key: 'dispatcher', label: 'Dispatcher' }, { key: 'origin', label: 'Origin' }, { key: 'dest', label: 'Destination' },
      { key: 'eta', label: 'ETA', align: 'right' }, { key: 'phone', label: 'Contact phone', align: 'right' },
      { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { load: c('L-90188', { mono: true, tone: 'info' }), carrier: c('Carrier 1'), dispatcher: c('Dispatcher 1'), origin: c('Los Angeles'), dest: c('Dallas'), lane: c('Los Angeles → Dallas'), eta: c('Sep 11, 14:00', { mono: true }), phone: c('(312) 555-0142', { mono: true }), status: c('On schedule', { tone: 'good' }), client: c('Customer 1'), clientPhone: c('(213) 555-0190', { mono: true }), carrierEmail: c('dispatch@carrier1.example'), clientEmail: c('ops@customer1.example') },
      { load: c('L-90176', { mono: true, tone: 'info' }), carrier: c('Carrier 2'), dispatcher: c('Dispatcher 2'), origin: c('Phoenix'), dest: c('Denver'), lane: c('Phoenix → Denver'), eta: c('Sep 10, 22:00', { mono: true }), phone: c('(602) 555-0177', { mono: true }), status: c('Cancelled', { tone: 'bad' }), client: c('Customer 2'), clientPhone: c('(303) 555-0166', { mono: true }), carrierEmail: c('dispatch@carrier2.example'), clientEmail: c('dispatch@customer2.example'), note: c('Carrier cancelled at pickup — driver reassigned. Sourcing replacement capacity, will re-tender within the hour.') },
      { load: c('L-90171', { mono: true, tone: 'info' }), carrier: c('Carrier 3'), dispatcher: c('Dispatcher 1'), origin: c('Chicago'), dest: c('Atlanta'), lane: c('Chicago → Atlanta'), eta: c('Sep 11, 09:00', { mono: true }), phone: c('(773) 555-0121', { mono: true }), status: c('Delayed', { tone: 'warn' }), client: c('Customer 3'), clientPhone: c('(404) 555-0155', { mono: true }), carrierEmail: c('dispatch@carrier3.example'), clientEmail: c('logistics@customer3.example'), note: c('Delayed by weather on I-40. Driver reports ETA pushed ~4 hours; consignee notified.') },
      { load: c('L-90165', { mono: true, tone: 'info' }), carrier: c('Carrier 4'), dispatcher: c('Dispatcher 2'), origin: c('Seattle'), dest: c('Portland'), lane: c('Seattle → Portland'), eta: c('Today, 18:30', { mono: true }), phone: c('(206) 555-0138', { mono: true }), status: c('On schedule', { tone: 'good' }), client: c('Customer 4'), clientPhone: c('(503) 555-0144', { mono: true }), carrierEmail: c('dispatch@carrier4.example'), clientEmail: c('freight@customer4.example') },
      { load: c('L-90160', { mono: true, tone: 'info' }), carrier: c('Carrier 1'), dispatcher: c('Dispatcher 1'), origin: c('Houston'), dest: c('Memphis'), lane: c('Houston → Memphis'), eta: c('Sep 10, 16:00', { mono: true }), phone: c('(312) 555-0142', { mono: true }), status: c('On schedule', { tone: 'good' }), client: c('Customer 2'), clientPhone: c('(901) 555-0112', { mono: true }), carrierEmail: c('dispatch@carrier1.example'), clientEmail: c('dispatch@customer2.example') },
    ],
  },

  /* ---------------- Quotes ---------------- */
  'carrier-quotes': {
    title: 'Carrier quotes',
    subtitle: 'Carrier bids for this lane · click a carrier for details',
    kind: 'table',
    searchKeys: ['carrier', 'mc'],
    filterKeys: ['trailer', 'status'],
    rowAction: 'carrier',
    stats: [
      { label: 'Carriers', countAll: true, pill: { text: 'active', key: 'status', value: 'Active', tone: 'good' } },
      { label: 'Active', tone: 'good', filter: { key: 'status', value: 'Active' } },
      { label: 'Expired', tone: 'grey', filter: { key: 'status', value: 'Expired' } },
      { label: 'Disqualified', tone: 'grey', filter: { key: 'status', value: 'Disqualified' } },
    ],
    columns: [
      { key: 'carrier', label: 'Carrier' }, { key: 'mc', label: 'MC #' },
      { key: 'origin', label: 'Origin' }, { key: 'dest', label: 'Destination' }, { key: 'dispatcher', label: 'Dispatcher' }, { key: 'cargoType', label: 'Cargo type' },
      { key: 'trailer', label: 'Trailer' }, { key: 'transit', label: 'Transit', align: 'center' },
      { key: 'ontime', label: 'On-time', align: 'right' },
      { key: 'hist', label: 'Hist. avg', align: 'right' }, { key: 'active', label: 'Active quote', align: 'right' },
      { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { carrier: c('Carrier 1', { strong: true }), color: c('#6E6FFD'), mc: c('MC-448201', { mono: true }), trailer: c('Dry Van 53′'), transit: c('2 d', { mono: true }), ontime: c('96%', { mono: true }), hist: c('$2,690', { mono: true }), active: c('$2,650', { mono: true, strong: true }), status: c('Active', { tone: 'good' }), origin: c('Los Angeles'), dest: c('Dallas'), lane: c('Los Angeles → Dallas'), dispatcher: c('AI'), cargoType: c('FTL') },
      { carrier: c('Carrier 2', { strong: true }), color: c('#3396CD'), mc: c('MC-771043', { mono: true }), trailer: c('Dry Van 53′'), transit: c('2 d', { mono: true }), ontime: c('94%', { mono: true }), hist: c('$2,560', { mono: true }), active: c('$2,585', { mono: true, strong: true }), status: c('Active', { tone: 'good' }), origin: c('Phoenix'), dest: c('Denver'), lane: c('Phoenix → Denver'), dispatcher: c('M. Lopez'), cargoType: c('LTL') },
      { carrier: c('Carrier 3', { strong: true }), color: c('#8f7bff'), mc: c('MC-330918', { mono: true }), trailer: c('Dry Van 53′'), transit: c('3 d', { mono: true }), ontime: c('91%', { mono: true }), hist: c('$2,780', { mono: true }), active: c('$2,740', { mono: true, strong: true }), status: c('Expired', { tone: 'grey' }), origin: c('Chicago'), dest: c('Atlanta'), lane: c('Chicago → Atlanta'), dispatcher: c('AI'), cargoType: c('FTL') },
      { carrier: c('Carrier 4', { strong: true }), color: c('#5a6b8c'), mc: c('MC-559277', { mono: true }), trailer: c('Dry Van 53′'), transit: c('2 d', { mono: true }), ontime: c('95%', { mono: true }), hist: c('$2,720', { mono: true }), active: c('Awaiting', { tone: 'warn' }), status: c('Disqualified', { tone: 'grey' }), origin: c('Seattle'), dest: c('Portland'), lane: c('Seattle → Portland'), dispatcher: c('T. Nguyen'), cargoType: c('LTL') },
    ],
  },
  'customer-quotes': {
    title: 'Quote list',
    subtitle: 'Rate quotes issued to customers · click a quote to open it',
    kind: 'table',
    searchKeys: ['cust', 'lane', 'q'],
    filterKeys: ['status', 'cust', 'curr'],
    rowAction: 'quote',
    addQuote: true,
    stats: [
      { label: 'Open', tone: 'info', filter: { key: 'status', value: 'Open' } },
      { label: 'Quoting', tone: 'warn', filter: { key: 'status', value: 'Quoting' } },
      { label: 'Closed', tone: 'good', filter: { key: 'status', value: 'Closed' } },
    ],
    columns: [
      { key: 'q', label: 'Quote' }, { key: 'cust', label: 'Customer' },
      { key: 'origin', label: 'Origin' }, { key: 'dest', label: 'Destination' }, { key: 'equipment', label: 'Equipment' }, { key: 'equipType', label: 'Equipment type' }, { key: 'cargoType', label: 'Cargo type' }, { key: 'dispatcher', label: 'Dispatcher' }, { key: 'amt', label: 'Amount', align: 'right' },
      { key: 'curr', label: 'Currency', align: 'center' },
      { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { q: c('5820 0044 3301', { mono: true, tone: 'info' }), cust: c('Customer 2'), origin: c('Dallas'), dest: c('Memphis'), lane: c('Dallas → Memphis'), amt: c('$1,480', { mono: true, strong: true }), curr: c('USD'), status: c('Open', { tone: 'info' }), equipment: c('Dry Van 53′'), equipType: c('Van'), cargoType: c('FTL'), dispatcher: c('AI') },
      { q: c('5820 0044 3288', { mono: true, tone: 'info' }), cust: c('Customer 1'), origin: c('Los Angeles'), dest: c('Phoenix'), lane: c('Los Angeles → Phoenix'), amt: c('$740', { mono: true, strong: true }), curr: c('USD'), status: c('Quoting', { tone: 'warn' }), equipment: c('Reefer'), equipType: c('Reefer'), cargoType: c('LTL'), dispatcher: c('M. Lopez') },
      { q: c('5820 0044 3270', { mono: true, tone: 'info' }), cust: c('Customer 3'), origin: c('Toronto'), dest: c('Buffalo'), lane: c('Toronto → Buffalo'), amt: c('C$820', { mono: true, strong: true }), curr: c('CAD'), status: c('Closed', { tone: 'good' }), equipment: c('Flatbed'), equipType: c('Flatbed'), cargoType: c('FTL'), dispatcher: c('AI') },
      { q: c('5820 0044 3255', { mono: true, tone: 'info' }), cust: c('Customer 4'), origin: c('Houston'), dest: c('New Orleans'), lane: c('Houston → New Orleans'), amt: c('$820', { mono: true, strong: true }), curr: c('USD'), status: c('Closed', { tone: 'good' }), equipment: c('Step Deck'), equipType: c('Step deck'), cargoType: c('LTL'), dispatcher: c('T. Nguyen') },
      { q: c('5820 0044 3241', { mono: true, tone: 'info' }), cust: c('Customer 2'), origin: c('Detroit'), dest: c('Windsor'), lane: c('Detroit → Windsor'), amt: c('C$1,240', { mono: true, strong: true }), curr: c('CAD'), status: c('Open', { tone: 'info' }), equipment: c('Dry Van 53′'), equipType: c('Van'), cargoType: c('FTL'), dispatcher: c('A. Singh') },
      { q: c('4711 0082 1902', { mono: true, tone: 'info' }), cust: c('Customer 1'), origin: c('Los Angeles'), dest: c('Dallas'), lane: c('Los Angeles → Dallas'), amt: c('$3,155', { mono: true, strong: true }), curr: c('USD'), status: c('Quoting', { tone: 'warn' }), equipment: c('Reefer'), equipType: c('Reefer'), cargoType: c('LTL'), dispatcher: c('AI') },
    ],
  },
  'broker-quotes': {
    title: 'Broker load quotes',
    subtitle: 'Quotes submitted against brokered loads',
    kind: 'table',
    searchKeys: ['broker', 'lane', 'q'],
    filterKeys: ['status', 'broker', 'curr'],
    rowAction: 'load',
    stats: [
      { label: 'Total bids', countAll: true },
      { label: 'Active', tone: 'good', filter: { key: 'status', value: 'Active' } },
      { label: 'Pending', tone: 'blue', filter: { key: 'status', value: 'Pending' } },
      { label: 'Expiring', tone: 'warn', filter: { key: 'status', value: 'Expiring' } },
    ],
    columns: [
      { key: 'q', label: 'Quote' }, { key: 'broker', label: 'Broker' },
      { key: 'origin', label: 'Origin' }, { key: 'dest', label: 'Destination' }, { key: 'equip', label: 'Equipment' }, { key: 'equipType', label: 'Equipment type' }, { key: 'cargoType', label: 'Cargo type' }, { key: 'dispatcher', label: 'Dispatcher' }, { key: 'bid', label: 'Bid', align: 'right' },
      { key: 'curr', label: 'Currency', align: 'center' },
      { key: 'posted', label: 'Posted', align: 'right' }, { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { q: c('BQ-2043', { mono: true, tone: 'info' }), load: c('BQ-2043', { mono: true, tone: 'info' }), broker: c('Broker 1'), customer: c('Broker 1'), carrier: c('Carrier 1'), equip: c('Dry Van 53′'), origin: c('Los Angeles'), dest: c('Dallas'), lane: c('Los Angeles → Dallas'), bid: c('$2,690', { mono: true, strong: true }), curr: c('USD'), rate: c('$2,690', { mono: true }), posted: c('20m', { mono: true }), ship: c('09-12-2026', { mono: true }), delivery: c('09-14-2026', { mono: true }), status: c('Active', { tone: 'good' }), dispatcher: c('AI'), contactName: c('Alicia Moore'), contactPhone: c('(312) 555-0148', { mono: true }), contactEmail: c('bids@broker1.example'), equipType: c('Van'), cargoType: c('FTL') },
      { q: c('BQ-2039', { mono: true, tone: 'info' }), load: c('BQ-2039', { mono: true, tone: 'info' }), broker: c('Broker 2'), customer: c('Broker 2'), carrier: c('Carrier 3'), equip: c('Reefer'), origin: c('Dallas'), dest: c('Memphis'), lane: c('Dallas → Memphis'), bid: c('$1,220', { mono: true, strong: true }), curr: c('USD'), rate: c('$1,220', { mono: true }), posted: c('1h', { mono: true }), ship: c('09-13-2026', { mono: true }), delivery: c('09-14-2026', { mono: true }), status: c('Pending', { tone: 'blue' }), dispatcher: c('A. Singh'), contactName: c('Marcus Reed'), contactPhone: c('(214) 555-0173', { mono: true }), contactEmail: c('bids@broker2.example'), equipType: c('Reefer'), cargoType: c('LTL') },
      { q: c('BQ-2031', { mono: true, tone: 'info' }), load: c('BQ-2031', { mono: true, tone: 'info' }), broker: c('Broker 1'), customer: c('Broker 1'), carrier: c('Carrier 2'), equip: c('Dry Van 53′'), origin: c('Denver'), dest: c('Salt Lake City'), lane: c('Denver → Salt Lake City'), bid: c('$880', { mono: true, strong: true }), curr: c('USD'), rate: c('$880', { mono: true }), posted: c('3h', { mono: true }), ship: c('09-13-2026', { mono: true }), delivery: c('09-14-2026', { mono: true }), status: c('Expiring', { tone: 'warn' }), dispatcher: c('AI'), contactName: c('Alicia Moore'), contactPhone: c('(312) 555-0148', { mono: true }), contactEmail: c('bids@broker1.example'), equipType: c('Flatbed'), cargoType: c('FTL') },
      { q: c('BQ-2024', { mono: true, tone: 'info' }), load: c('BQ-2024', { mono: true, tone: 'info' }), broker: c('Broker 3'), customer: c('Broker 3'), carrier: c('Carrier 4'), equip: c('Dry Van 53′'), origin: c('Toronto'), dest: c('Buffalo'), lane: c('Toronto → Buffalo'), bid: c('C$1,010', { mono: true, strong: true }), curr: c('CAD'), rate: c('C$1,010', { mono: true }), posted: c('5h', { mono: true }), ship: c('09-14-2026', { mono: true }), delivery: c('09-15-2026', { mono: true }), status: c('Expired', { tone: 'grey' }), dispatcher: c('A. Singh'), contactName: c('Émile Tremblay'), contactPhone: c('(416) 555-0192', { mono: true }), contactEmail: c('bids@broker3.example'), equipType: c('Step deck'), cargoType: c('LTL') },
      { q: c('BQ-2018', { mono: true, tone: 'info' }), load: c('BQ-2018', { mono: true, tone: 'info' }), broker: c('Broker 2'), customer: c('Broker 2'), carrier: c('Carrier 5'), equip: c('Flatbed'), origin: c('Detroit'), dest: c('Windsor'), lane: c('Detroit → Windsor'), bid: c('C$1,540', { mono: true, strong: true }), curr: c('CAD'), rate: c('C$1,540', { mono: true }), posted: c('1d', { mono: true }), ship: c('09-11-2026', { mono: true }), delivery: c('09-12-2026', { mono: true }), status: c('Completed', { tone: 'grey' }), dispatcher: c('AI'), contactName: c('Marcus Reed'), contactPhone: c('(313) 555-0166', { mono: true }), contactEmail: c('bids@broker2.example'), equipType: c('Van'), cargoType: c('FTL') },
    ],
  },
  'rfqs': {
    title: 'RFQs',
    subtitle: 'Requests for quote received from customers',
    kind: 'table',
    searchKeys: ['rfq', 'cust', 'equip', 'equipType'],
    filterKeys: ['status', 'cust', 'equip'],
    rowAction: 'rfq',
    stats: [
      { label: 'Total RFQs', countAll: true },
      { label: 'Open', tone: 'good', filter: { key: 'status', value: 'Open' } },
      { label: 'Closed', tone: 'grey', filter: { key: 'status', value: 'Closed' } },
    ],
    columns: [
      { key: 'rfq', label: 'RFQ' }, { key: 'date', label: 'Date' },
      { key: 'cust', label: 'Customer' }, { key: 'equip', label: 'Equipment' },
      { key: 'equipType', label: 'Equipment type' }, { key: 'lanes', label: 'Lanes', align: 'center' },
      { key: 'deadline', label: 'Deadline', align: 'right' }, { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { rfq: c('RFQ-3082', { mono: true, tone: 'info' }), no: c('482013'), curr: c('USD'), commodity: c('Consumer goods'), weight: c('42,000'), date: c('09-09-2026', { mono: true }), cust: c('Customer 1'), equip: c('Dry Van'), equipType: c('53′'), lanes: c('12', { mono: true }), deadline: c('09-16-2026', { mono: true }), status: c('Open', { tone: 'good' }) },
      { rfq: c('RFQ-3078', { mono: true, tone: 'info' }), no: c('482007'), curr: c('USD'), commodity: c('Food & beverage'), weight: c('44,000'), date: c('09-08-2026', { mono: true }), cust: c('Customer 2'), equip: c('Reefer'), equipType: c('Multi-temp'), lanes: c('6', { mono: true }), deadline: c('09-15-2026', { mono: true }), status: c('Open', { tone: 'good' }) },
      { rfq: c('RFQ-3071', { mono: true, tone: 'info' }), no: c('481990'), curr: c('USD'), commodity: c('Building materials'), weight: c('47,500'), date: c('09-05-2026', { mono: true }), cust: c('Customer 3'), equip: c('Flatbed'), equipType: c('Step deck'), lanes: c('4', { mono: true }), deadline: c('09-11-2026', { mono: true }), status: c('Closed', { tone: 'grey' }) },
      { rfq: c('RFQ-3064', { mono: true, tone: 'info' }), no: c('481975'), curr: c('USD'), commodity: c('Consumer goods'), weight: c('40,000'), date: c('09-03-2026', { mono: true }), cust: c('Customer 4'), equip: c('Dry Van'), equipType: c('48′'), lanes: c('20', { mono: true }), deadline: c('09-10-2026', { mono: true }), status: c('Closed', { tone: 'grey' }) },
      { rfq: c('RFQ-3059', { mono: true, tone: 'info' }), no: c('481962'), curr: c('CAD'), commodity: c('Frozen food'), weight: c('43,000'), date: c('09-02-2026', { mono: true }), cust: c('Customer 1'), equip: c('Reefer'), equipType: c('53′ · frozen'), lanes: c('9', { mono: true }), deadline: c('09-17-2026', { mono: true }), status: c('Open', { tone: 'good' }) },
      { rfq: c('RFQ-3050', { mono: true, tone: 'info' }), no: c('481948'), curr: c('CAD'), commodity: c('Drop trailer'), weight: c('38,000'), date: c('08-28-2026', { mono: true }), cust: c('Customer 2'), equip: c('Power only'), equipType: c('Day cab'), lanes: c('3', { mono: true }), deadline: c('09-04-2026', { mono: true }), status: c('Closed', { tone: 'grey' }) },
    ],
  },

  /* ---------------- Partners ---------------- */
  'carriers': {
    title: 'Carriers',
    subtitle: 'Contracted and spot carriers in your network',
    kind: 'table',
    searchKeys: ['name', 'mc'],
    filterKeys: ['status', 'type'],
    rowAction: 'carrier',
    stats: [
      { label: 'Carriers', countAll: true, pill: { text: 'verified', key: 'status', value: 'Verified', tone: 'good' } },
      { label: 'Verified', tone: 'good', filter: { key: 'status', value: 'Verified' } },
      { label: 'Pending', tone: 'blue', filter: { key: 'status', value: 'Pending' } },
      { label: 'Under review', tone: 'warn', filter: { key: 'status', value: 'Under review' } },
    ],
    columns: [
      { key: 'name', label: 'Carrier' }, { key: 'mc', label: 'MC #' },
      { key: 'type', label: 'Type' }, { key: 'ontime', label: 'On-time', align: 'right' },
      { key: 'loads', label: 'Loads', align: 'right' }, { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { name: c('Carrier 1', { strong: true }), color: c('#6E6FFD'), mc: c('MC-448201', { mono: true }), type: c('Asset'), ontime: c('96%', { mono: true }), loads: c('128', { mono: true }), status: c('Verified', { tone: 'good' }) },
      { name: c('Carrier 2', { strong: true }), color: c('#3396CD'), mc: c('MC-771043', { mono: true }), type: c('Brokered'), ontime: c('94%', { mono: true }), loads: c('86', { mono: true }), status: c('Verified', { tone: 'good' }) },
      { name: c('Carrier 3', { strong: true }), color: c('#8f7bff'), mc: c('MC-330918', { mono: true }), type: c('Asset'), ontime: c('91%', { mono: true }), loads: c('64', { mono: true }), status: c('Pending', { tone: 'blue' }) },
      { name: c('Carrier 4', { strong: true }), color: c('#5a6b8c'), mc: c('MC-559277', { mono: true }), type: c('Asset'), ontime: c('95%', { mono: true }), loads: c('102', { mono: true }), status: c('Under review', { tone: 'warn' }) },
      { name: c('Carrier 5', { strong: true }), color: c('#4aa3d5'), mc: c('MC-610284', { mono: true }), type: c('Brokered'), ontime: c('89%', { mono: true }), loads: c('41', { mono: true }), status: c('Verified', { tone: 'good' }) },
    ],
  },
  'customers': {
    title: 'Shippers',
    subtitle: 'Shippers you move freight for',
    kind: 'table',
    searchKeys: ['company', 'city', 'contactName'],
    filterKeys: ['status', 'city'],
    stats: [
      { label: 'Total', countAll: true },
      { label: 'Active', tone: 'good', filter: { key: 'status', value: 'Active' } },
      { label: 'Inactive', tone: 'grey', filter: { key: 'status', value: 'Inactive' } },
    ],
    columns: [
      { key: 'company', label: 'Company' }, { key: 'city', label: 'City' },
      { key: 'contactName', label: 'Contact' }, { key: 'contactPhone', label: 'Phone', align: 'right' },
      { key: 'contactEmail', label: 'Email' }, { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { company: c('Shipper 1', { strong: true }), city: c('Los Angeles, CA'), contactName: c('Dana Whitfield'), contactPhone: c('(213) 555-0190', { mono: true }), contactEmail: c('ops@shipper1.example'), status: c('Active', { tone: 'good' }) },
      { company: c('Shipper 2', { strong: true }), city: c('Phoenix, AZ'), contactName: c('Raj Alvarez'), contactPhone: c('(602) 555-0120', { mono: true }), contactEmail: c('dispatch@shipper2.example'), status: c('Active', { tone: 'good' }) },
      { company: c('Shipper 3', { strong: true }), city: c('Chicago, IL'), contactName: c('Sara Nguyen'), contactPhone: c('(312) 555-0133', { mono: true }), contactEmail: c('logistics@shipper3.example'), status: c('Inactive', { tone: 'grey' }) },
      { company: c('Shipper 4', { strong: true }), city: c('Houston, TX'), contactName: c('Jon Park'), contactPhone: c('(713) 555-0177', { mono: true }), contactEmail: c('freight@shipper4.example'), status: c('Active', { tone: 'good' }) },
      { company: c('Shipper 5', { strong: true }), city: c('Toronto, ON'), contactName: c('Émile Tremblay'), contactPhone: c('(416) 555-0192', { mono: true }), contactEmail: c('ops@shipper5.example'), status: c('Active', { tone: 'good' }) },
    ],
  },
  'consignees': {
    title: 'Consignees',
    subtitle: 'Receiving locations',
    kind: 'table',
    searchKeys: ['company', 'city', 'contactName'],
    filterKeys: ['status', 'city'],
    stats: [
      { label: 'Total', countAll: true },
      { label: 'Active', tone: 'good', filter: { key: 'status', value: 'Active' } },
      { label: 'Inactive', tone: 'grey', filter: { key: 'status', value: 'Inactive' } },
    ],
    columns: [
      { key: 'company', label: 'Company' }, { key: 'city', label: 'City' },
      { key: 'contactName', label: 'Contact' }, { key: 'contactPhone', label: 'Phone', align: 'right' },
      { key: 'contactEmail', label: 'Email' }, { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { company: c('Consignee 1', { strong: true }), city: c('Dallas, TX'), contactName: c('Marcus Reed'), contactPhone: c('(214) 555-0173', { mono: true }), contactEmail: c('receiving@consignee1.example'), status: c('Active', { tone: 'good' }) },
      { company: c('Consignee 2', { strong: true }), city: c('Memphis, TN'), contactName: c('Alicia Moore'), contactPhone: c('(901) 555-0112', { mono: true }), contactEmail: c('dock@consignee2.example'), status: c('Active', { tone: 'good' }) },
      { company: c('Consignee 3', { strong: true }), city: c('Denver, CO'), contactName: c('Kwame Osei'), contactPhone: c('(303) 555-0166', { mono: true }), contactEmail: c('receiving@consignee3.example'), status: c('Inactive', { tone: 'grey' }) },
      { company: c('Consignee 4', { strong: true }), city: c('Atlanta, GA'), contactName: c('Lena Cruz'), contactPhone: c('(404) 555-0155', { mono: true }), contactEmail: c('dock@consignee4.example'), status: c('Active', { tone: 'good' }) },
    ],
  },
  'customs-brokers': {
    title: 'Customs brokers',
    subtitle: 'Cross-border clearance partners',
    kind: 'table',
    searchKeys: ['company', 'city', 'contactName'],
    filterKeys: ['status', 'city'],
    stats: [
      { label: 'Total', countAll: true },
      { label: 'Active', tone: 'good', filter: { key: 'status', value: 'Active' } },
      { label: 'Inactive', tone: 'grey', filter: { key: 'status', value: 'Inactive' } },
    ],
    columns: [
      { key: 'company', label: 'Company' }, { key: 'city', label: 'City' },
      { key: 'contactName', label: 'Contact' }, { key: 'contactPhone', label: 'Phone', align: 'right' },
      { key: 'contactEmail', label: 'Email' }, { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { company: c('Broker 1', { strong: true }), city: c('Laredo, TX'), contactName: c('Paola Sandoval'), contactPhone: c('(956) 555-0141', { mono: true }), contactEmail: c('clearance@broker1.example'), status: c('Active', { tone: 'good' }) },
      { company: c('Broker 2', { strong: true }), city: c('Otay Mesa, CA'), contactName: c('Noah Ito'), contactPhone: c('(619) 555-0128', { mono: true }), contactEmail: c('filing@broker2.example'), status: c('Active', { tone: 'good' }) },
      { company: c('Broker 3', { strong: true }), city: c('Buffalo, NY'), contactName: c('Grace Fournier'), contactPhone: c('(716) 555-0119', { mono: true }), contactEmail: c('clearance@broker3.example'), status: c('Inactive', { tone: 'grey' }) },
    ],
  },

  /* ---------------- Accounting ---------------- */
  'documents': {
    title: 'Receivable documents',
    subtitle: 'Receivable-side paperwork by load',
    kind: 'table',
    searchKeys: ['num', 'type', 'load'],
    filterKeys: ['status', 'type', 'curr'],
    stats: [
      { label: 'Total', countAll: true },
      { label: 'Open', tone: 'good', filter: { key: 'status', value: 'Open' } },
      { label: 'Under review', tone: 'warn', filter: { key: 'status', value: 'Under review' } },
      { label: 'Closed', tone: 'grey', filter: { key: 'status', value: 'Closed' } },
    ],
    columns: [
      { key: 'date', label: 'Date' }, { key: 'num', label: 'Number' },
      { key: 'type', label: 'Document type' }, { key: 'load', label: 'Load' },
      { key: 'curr', label: 'Currency', align: 'center' }, { key: 'amt', label: 'Amount', align: 'right' },
      { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { date: c('09-08-2026', { mono: true }), num: c('LD-100482', { mono: true, tone: 'info' }), type: c('Rate confirmation'), load: c('L-90188'), curr: c('USD'), amt: c('$2,650.00', { mono: true, strong: true }), status: c('Open', { tone: 'good' }) },
      { date: c('09-08-2026', { mono: true }), num: c('LD-100479', { mono: true, tone: 'info' }), type: c('Bill of lading'), load: c('L-90176'), curr: c('USD'), amt: c('$1,220.00', { mono: true, strong: true }), status: c('Under review', { tone: 'warn' }) },
      { date: c('09-07-2026', { mono: true }), num: c('LD-100471', { mono: true, tone: 'info' }), type: c('Proof of delivery'), load: c('L-90160'), curr: c('USD'), amt: c('$1,410.00', { mono: true, strong: true }), status: c('Open', { tone: 'good' }) },
      { date: c('09-06-2026', { mono: true }), num: c('LD-100463', { mono: true, tone: 'info' }), type: c('Invoice copy'), load: c('L-90118'), curr: c('USD'), amt: c('$2,640.00', { mono: true, strong: true }), status: c('Closed', { tone: 'grey' }) },
      { date: c('09-05-2026', { mono: true }), num: c('LD-100455', { mono: true, tone: 'info' }), type: c('Detention notice'), load: c('LB-55081'), curr: c('CAD'), amt: c('C$320.00', { mono: true, strong: true }), status: c('Under review', { tone: 'warn' }) },
      { date: c('09-04-2026', { mono: true }), num: c('LD-100448', { mono: true, tone: 'info' }), type: c('Rate confirmation'), load: c('L-90165'), curr: c('USD'), amt: c('$1,980.00', { mono: true, strong: true }), status: c('Closed', { tone: 'grey' }) },
    ],
  },
  'invoices': {
    title: 'Invoices',
    subtitle: 'Customer receivables',
    kind: 'table',
    searchKeys: ['inv', 'cust', 'load'],
    filterKeys: ['status', 'cust', 'curr'],
    stats: [
      { label: 'Total', countAll: true },
      { label: 'Open', tone: 'good', filter: { key: 'status', value: 'Open' } },
      { label: 'Under review', tone: 'warn', filter: { key: 'status', value: 'Under review' } },
      { label: 'Closed', tone: 'grey', filter: { key: 'status', value: 'Closed' } },
    ],
    columns: [
      { key: 'date', label: 'Date' }, { key: 'cust', label: 'Customer' },
      { key: 'load', label: 'Load' }, { key: 'shipper', label: 'Shipper' },
      { key: 'consignee', label: 'Consignee' }, { key: 'curr', label: 'Currency', align: 'center' },
      { key: 'amt', label: 'Amount', align: 'right' }, { key: 'bal', label: 'Balance', align: 'right' },
      { key: 'age', label: 'Age', align: 'right' }, { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { date: c('09-01-2026', { mono: true }), cust: c('Customer 1'), load: c('L-90188'), shipper: c('Shipper 1'), consignee: c('Consignee 1'), curr: c('USD'), amt: c('$6,935.00', { mono: true, strong: true }), bal: c('$6,935.00', { mono: true }), age: c('10d', { mono: true }), status: c('Open', { tone: 'good' }) },
      { date: c('08-28-2026', { mono: true }), cust: c('Customer 3'), load: c('L-90171'), shipper: c('Shipper 3'), consignee: c('Consignee 3'), curr: c('USD'), amt: c('$12,480.00', { mono: true, strong: true }), bal: c('$12,480.00', { mono: true }), age: c('14d', { mono: true }), status: c('Under review', { tone: 'warn' }) },
      { date: c('08-25-2026', { mono: true }), cust: c('Customer 2'), load: c('L-90176'), shipper: c('Shipper 2'), consignee: c('Consignee 2'), curr: c('USD'), amt: c('$4,120.00', { mono: true, strong: true }), bal: c('$0.00', { mono: true }), age: c('17d', { mono: true }), status: c('Closed', { tone: 'grey' }) },
      { date: c('09-03-2026', { mono: true }), cust: c('Customer 4'), load: c('L-90165'), shipper: c('Shipper 4'), consignee: c('Consignee 4'), curr: c('USD'), amt: c('$2,240.00', { mono: true, strong: true }), bal: c('$2,240.00', { mono: true }), age: c('8d', { mono: true }), status: c('Open', { tone: 'good' }) },
      { date: c('08-30-2026', { mono: true }), cust: c('Customer 2'), load: c('LB-55081'), shipper: c('Shipper 2'), consignee: c('Consignee 1'), curr: c('CAD'), amt: c('C$1,060.00', { mono: true, strong: true }), bal: c('C$1,060.00', { mono: true }), age: c('12d', { mono: true }), status: c('Under review', { tone: 'warn' }) },
    ],
  },
  'payments': {
    title: 'Payments',
    subtitle: 'Customer settlements',
    kind: 'table',
    searchKeys: ['cust', 'load'],
    filterKeys: ['status', 'cust', 'curr'],
    stats: [
      { label: 'Total', countAll: true },
      { label: 'Open', tone: 'good', filter: { key: 'status', value: 'Open' } },
      { label: 'Under review', tone: 'warn', filter: { key: 'status', value: 'Under review' } },
      { label: 'Closed', tone: 'grey', filter: { key: 'status', value: 'Closed' } },
    ],
    columns: [
      { key: 'date', label: 'Date' }, { key: 'cust', label: 'Customer' },
      { key: 'load', label: 'Load' }, { key: 'curr', label: 'Currency', align: 'center' },
      { key: 'amt', label: 'Amount', align: 'right' }, { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { date: c('09-09-2026', { mono: true }), cust: c('Customer 1'), load: c('L-90188'), curr: c('USD'), amt: c('$2,650.00', { mono: true, strong: true }), status: c('Open', { tone: 'good' }) },
      { date: c('09-08-2026', { mono: true }), cust: c('Customer 2'), load: c('L-90176'), curr: c('USD'), amt: c('$1,220.00', { mono: true, strong: true }), status: c('Closed', { tone: 'grey' }) },
      { date: c('09-07-2026', { mono: true }), cust: c('Customer 4'), load: c('L-90165'), curr: c('USD'), amt: c('$980.00', { mono: true, strong: true }), status: c('Under review', { tone: 'warn' }) },
      { date: c('09-05-2026', { mono: true }), cust: c('Customer 3'), load: c('L-90171'), curr: c('USD'), amt: c('$1,410.00', { mono: true, strong: true }), status: c('Closed', { tone: 'grey' }) },
      { date: c('09-04-2026', { mono: true }), cust: c('Customer 2'), load: c('LB-55081'), curr: c('CAD'), amt: c('C$1,060.00', { mono: true, strong: true }), status: c('Open', { tone: 'good' }) },
    ],
  },
  'support': {
    title: 'Missing documents',
    subtitle: 'Customer tickets',
    kind: 'table',
    searchKeys: ['t', 'cust', 'subj', 'load'],
    filterKeys: ['status', 'pri', 'cust'],
    stats: [
      { label: 'Total', countAll: true },
      { label: 'Open', tone: 'good', filter: { key: 'status', value: 'Open' } },
      { label: 'In progress', tone: 'warn', filter: { key: 'status', value: 'In progress' } },
      { label: 'Closed', tone: 'grey', filter: { key: 'status', value: 'Closed' } },
    ],
    columns: [
      { key: 't', label: 'Ticket' }, { key: 'cust', label: 'Customer' },
      { key: 'subj', label: 'Subject' }, { key: 'load', label: 'Load' },
      { key: 'age', label: 'Age', align: 'right' }, { key: 'pri', label: 'Priority', align: 'right' },
      { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { t: c('TCK-3391', { mono: true, tone: 'info' }), cust: c('Customer 1'), subj: c('Missing POD'), load: c('L-90160'), age: c('2d', { mono: true }), pri: c('Urgent', { tone: 'bad' }), status: c('Open', { tone: 'good' }) },
      { t: c('TCK-3388', { mono: true, tone: 'info' }), cust: c('Customer 3'), subj: c('Invoice dispute'), load: c('L-90171'), age: c('4d', { mono: true }), pri: c('High', { tone: 'warn' }), status: c('In progress', { tone: 'warn' }) },
      { t: c('TCK-3382', { mono: true, tone: 'info' }), cust: c('Customer 2'), subj: c('Update delivery appointment'), load: c('L-90176'), age: c('1d', { mono: true }), pri: c('Normal'), status: c('Open', { tone: 'good' }) },
      { t: c('TCK-3377', { mono: true, tone: 'info' }), cust: c('Customer 4'), subj: c('Add new billing contact'), load: c('L-90165'), age: c('6d', { mono: true }), pri: c('Low'), status: c('Closed', { tone: 'grey' }) },
      { t: c('TCK-3370', { mono: true, tone: 'info' }), cust: c('Customer 1'), subj: c('Detention charge query'), load: c('LB-55081'), age: c('8d', { mono: true }), pri: c('High', { tone: 'warn' }), status: c('In progress', { tone: 'warn' }) },
    ],
  },

  /* ---------------- Employees ---------------- */
  'emp-resources': {
    title: 'Employee resources',
    subtitle: 'Handbooks, tools and internal links',
    kind: 'cards',
    cards: [
      { title: 'Employee handbook', desc: 'Policies, code of conduct and company guidelines.', tag: 'HR', icon: 'book' },
      { title: 'IT help desk', desc: 'Request hardware, reset passwords, report issues.', tag: 'IT', icon: 'laptop' },
      { title: 'Dispatch playbook', desc: 'Standard operating procedures for booking and tracing.', tag: 'Ops', icon: 'clipboard' },
      { title: 'Training & certifications', desc: 'Onboarding courses and compliance training.', tag: 'Learning', icon: 'cap' },
      { title: 'Company directory', desc: 'Find teammates, roles and contact details.', tag: 'People', icon: 'users' },
      { title: 'Time off & scheduling', desc: 'Request PTO and view your shift calendar.', tag: 'HR', icon: 'calendar' },
    ],
  },
  'emp-chat': {
    title: 'Employee chat',
    subtitle: 'Team messaging',
    kind: 'chat',
    chat: {
      channels: [
        { name: '# dispatch', active: true },
        { name: '# sales', unread: 3 },
        { name: '# accounting' },
        { name: '# announcements', unread: 1 },
        { name: '# random' },
      ],
      title: '# dispatch',
      messages: [
        { who: 'Dispatcher 2', initials: 'D2', color: B, time: '9:02 AM', text: 'Carrier 1 confirmed pickup for L-90188 at 08:00.' },
        { who: 'Maria (Ops)', initials: 'MO', color: '#8f7bff', time: '9:14 AM', text: 'Nice. Watch the LA DC detention window, 2 hr free only.' },
        { who: 'Dispatcher 1', initials: 'D1', color: P, time: '9:20 AM', text: 'Booked Carrier 3 on the Chicago → Atlanta at $1,540.' },
        { who: 'You', initials: 'A', color: P, time: '9:22 AM', text: 'Thanks — I\'ll send the rate cons now.', me: true },
        { who: 'Dispatcher 2', initials: 'D2', color: B, time: '9:31 AM', text: 'Tracing shows L-90176 at risk, ETA slipped 2 hours.' },
      ],
    },
  },
  'calendar': {
    title: 'Calendar',
    subtitle: 'Shipments, deliveries and team schedule',
    kind: 'calendar',
    calEvents: {
      2: [{ label: 'Payday', tone: 'good' }],
      4: [{ label: 'Team standup · 9 AM', tone: 'info' }],
      9: [{ label: 'PTO · J. Park', tone: 'warn' }],
      10: [{ label: 'Cancelled · L-90176', tone: 'bad' }, { label: 'All-hands · 3 PM', tone: 'info' }],
      11: [{ label: 'Delivery · L-90188', tone: 'good' }, { label: 'Delayed · L-90171', tone: 'warn' }, { label: 'PTO · J. Park', tone: 'warn' }],
      12: [{ label: 'Pickup · LB-55120', tone: 'info' }],
      14: [{ label: 'Delivery · LB-55120', tone: 'good' }],
      15: [{ label: 'Pickup · L-90231', tone: 'info' }],
      16: [{ label: 'Benefits enrollment closes', tone: 'bad' }],
      17: [{ label: 'Delivery · Q-4471', tone: 'good' }],
      18: [{ label: 'Team standup · 9 AM', tone: 'info' }],
      22: [{ label: 'Safety training · 1 PM', tone: 'info' }],
      23: [{ label: 'Maintenance · 9 PM', tone: 'warn' }],
      25: [{ label: 'Payday', tone: 'good' }],
      30: [{ label: 'Q3 review · 2 PM', tone: 'info' }],
    },
  },
  'emp-benefits': {
    title: 'Employee benefits',
    subtitle: 'Your coverage and perks',
    kind: 'cards',
    cards: [
      { title: 'Health insurance', desc: 'Medical PPO/HMO plans with company contribution.', tag: 'Active', icon: 'heart' },
      { title: 'Dental & vision', desc: 'Preventive and major care, annual eye exam.', tag: 'Active', icon: 'tooth' },
      { title: '401(k) match', desc: 'Up to 4% company match, vested after 1 year.', tag: 'Enrolled', icon: 'piggy' },
      { title: 'Paid time off', desc: '15 days PTO + 10 holidays. 9 days remaining.', tag: '9 left', icon: 'umbrella' },
      { title: 'Wellness program', desc: 'Gym reimbursement and mental-health support.', tag: 'Active', icon: 'wellness' },
      { title: 'Perks & discounts', desc: 'Fuel, phone and travel partner discounts.', tag: 'Perks', icon: 'gift' },
    ],
  },

  /* ---------------- Dispatch-board sub-pages (reachable from the board pills; not in the sidebar) ---------------- */
  'pending-documents': {
    title: 'Pending documents',
    subtitle: 'Carrier invoice documents awaiting review or approval',
    kind: 'table',
    backTo: '/section/load-board',
    filterKeys: ['status', 'fileType', 'attached'],
    columns: [ { key: 'load', label: 'Load' }, { key: 'carrierInvoice', label: 'Carrier invoices' }, { key: 'billTo', label: 'Bill to' }, { key: 'status', label: 'Status' }, { key: 'fileName', label: 'File name' }, { key: 'fileType', label: 'File type' }, { key: 'attached', label: 'Attached' } ],
    rows: [
      { load: { text: 'LB-55200', mono: true, tone: 'info' }, carrierInvoice: { text: 'CI-8100', mono: true }, billTo: { text: 'Acme Corp' }, status: { text: 'Pending', tone: 'warn' }, fileName: { text: 'doc_55200.pdf', mono: true }, fileType: { text: 'PDF' }, attached: { text: 'No' } },
      { load: { text: 'LB-55199', mono: true, tone: 'info' }, carrierInvoice: { text: 'CI-8101', mono: true }, billTo: { text: 'Globex' }, status: { text: 'Received', tone: 'blue' }, fileName: { text: 'doc_55199.png', mono: true }, fileType: { text: 'PNG' }, attached: { text: 'Yes' } },
      { load: { text: 'LB-55198', mono: true, tone: 'info' }, carrierInvoice: { text: 'CI-8102', mono: true }, billTo: { text: 'Initech' }, status: { text: 'Approved', tone: 'good' }, fileName: { text: 'doc_55198.jpg', mono: true }, fileType: { text: 'JPG' }, attached: { text: 'Yes' } },
      { load: { text: 'LB-55197', mono: true, tone: 'info' }, carrierInvoice: { text: 'CI-8103', mono: true }, billTo: { text: 'Umbrella' }, status: { text: 'Rejected', tone: 'high' }, fileName: { text: 'doc_55197.docx', mono: true }, fileType: { text: 'DOCX' }, attached: { text: 'No' } },
      { load: { text: 'LB-55196', mono: true, tone: 'info' }, carrierInvoice: { text: 'CI-8104', mono: true }, billTo: { text: 'Soylent' }, status: { text: 'Pending', tone: 'warn' }, fileName: { text: 'doc_55196.xlsx', mono: true }, fileType: { text: 'XLSX' }, attached: { text: 'Yes' } },
      { load: { text: 'LB-55195', mono: true, tone: 'info' }, carrierInvoice: { text: 'CI-8105', mono: true }, billTo: { text: 'Acme Corp' }, status: { text: 'Received', tone: 'blue' }, fileName: { text: 'doc_55195.pdf', mono: true }, fileType: { text: 'PDF' }, attached: { text: 'Yes' } },
      { load: { text: 'LB-55194', mono: true, tone: 'info' }, carrierInvoice: { text: 'CI-8106', mono: true }, billTo: { text: 'Globex' }, status: { text: 'Approved', tone: 'good' }, fileName: { text: 'doc_55194.png', mono: true }, fileType: { text: 'PNG' }, attached: { text: 'No' } },
      { load: { text: 'LB-55193', mono: true, tone: 'info' }, carrierInvoice: { text: 'CI-8107', mono: true }, billTo: { text: 'Initech' }, status: { text: 'Rejected', tone: 'high' }, fileName: { text: 'doc_55193.jpg', mono: true }, fileType: { text: 'JPG' }, attached: { text: 'Yes' } },
      { load: { text: 'LB-55192', mono: true, tone: 'info' }, carrierInvoice: { text: 'CI-8108', mono: true }, billTo: { text: 'Umbrella' }, status: { text: 'Pending', tone: 'warn' }, fileName: { text: 'doc_55192.docx', mono: true }, fileType: { text: 'DOCX' }, attached: { text: 'Yes' } },
      { load: { text: 'LB-55191', mono: true, tone: 'info' }, carrierInvoice: { text: 'CI-8109', mono: true }, billTo: { text: 'Soylent' }, status: { text: 'Received', tone: 'blue' }, fileName: { text: 'doc_55191.xlsx', mono: true }, fileType: { text: 'XLSX' }, attached: { text: 'No' } },
      { load: { text: 'LB-55190', mono: true, tone: 'info' }, carrierInvoice: { text: 'CI-8110', mono: true }, billTo: { text: 'Acme Corp' }, status: { text: 'Approved', tone: 'good' }, fileName: { text: 'doc_55190.pdf', mono: true }, fileType: { text: 'PDF' }, attached: { text: 'Yes' } },
      { load: { text: 'LB-55189', mono: true, tone: 'info' }, carrierInvoice: { text: 'CI-8111', mono: true }, billTo: { text: 'Globex' }, status: { text: 'Rejected', tone: 'high' }, fileName: { text: 'doc_55189.png', mono: true }, fileType: { text: 'PNG' }, attached: { text: 'Yes' } },
    ],
  },
  'carrier-insurance': {
    title: 'Carrier insurance',
    subtitle: 'Policies expiring within 2 months or already expired',
    kind: 'table',
    backTo: '/section/load-board',
    filterKeys: ['status'],
    columns: [ { key: 'name', label: 'Name' }, { key: 'cargoExp', label: 'Cargo expiry' }, { key: 'liabExp', label: 'Liability expiry' }, { key: 'status', label: 'Status', align: 'right' } ],
    rows: [
      { name: { text: 'Carrier 1 Ins.', mono: true, tone: 'info' }, cargoExp: { text: '09-12-2026', mono: true }, liabExp: { text: '09-05-2026', mono: true }, status: { text: 'Expired', tone: 'high' } },
      { name: { text: 'Carrier 2 Ins.', mono: true, tone: 'info' }, cargoExp: { text: '09-29-2026', mono: true }, liabExp: { text: '10-06-2026', mono: true }, status: { text: 'Expired', tone: 'high' } },
      { name: { text: 'Carrier 3 Ins.', mono: true, tone: 'info' }, cargoExp: { text: '10-12-2026', mono: true }, liabExp: { text: '10-05-2026', mono: true }, status: { text: 'Expired', tone: 'high' } },
      { name: { text: 'Carrier 4 Ins.', mono: true, tone: 'info' }, cargoExp: { text: '10-25-2026', mono: true }, liabExp: { text: '11-01-2026', mono: true }, status: { text: 'Expiring', tone: 'warn' } },
      { name: { text: 'Carrier 5 Ins.', mono: true, tone: 'info' }, cargoExp: { text: '11-09-2026', mono: true }, liabExp: { text: '11-02-2026', mono: true }, status: { text: 'Expiring', tone: 'warn' } },
      { name: { text: 'Carrier 1 Ins.', mono: true, tone: 'info' }, cargoExp: { text: '11-26-2026', mono: true }, liabExp: { text: '12-03-2026', mono: true }, status: { text: 'Expiring', tone: 'warn' } },
      { name: { text: 'Carrier 2 Ins.', mono: true, tone: 'info' }, cargoExp: { text: '12-04-2026', mono: true }, liabExp: { text: '11-27-2026', mono: true }, status: { text: 'Expiring', tone: 'warn' } },
      { name: { text: 'Carrier 3 Ins.', mono: true, tone: 'info' }, cargoExp: { text: '09-22-2026', mono: true }, liabExp: { text: '09-29-2026', mono: true }, status: { text: 'Expired', tone: 'high' } },
      { name: { text: 'Carrier 1 Ins.', mono: true, tone: 'info' }, cargoExp: { text: '10-19-2026', mono: true }, liabExp: { text: '10-12-2026', mono: true }, status: { text: 'Expiring', tone: 'warn' } },
      { name: { text: 'Carrier 2 Ins.', mono: true, tone: 'info' }, cargoExp: { text: '11-16-2026', mono: true }, liabExp: { text: '11-23-2026', mono: true }, status: { text: 'Expiring', tone: 'warn' } },
      { name: { text: 'Carrier 3 Ins.', mono: true, tone: 'info' }, cargoExp: { text: '10-04-2026', mono: true }, liabExp: { text: '09-27-2026', mono: true }, status: { text: 'Expired', tone: 'high' } },
    ],
  },
  'pending-quotes': {
    title: 'Pending quotes',
    subtitle: 'Quotes in auto or manual bidding',
    kind: 'table',
    backTo: '/section/load-board',
    filterKeys: ['status', 'cargoType'],
    columns: [ { key: 'status', label: 'Status' }, { key: 'bidding', label: 'Bidding' }, { key: 'id', label: 'ID' }, { key: 'date', label: 'Date' }, { key: 'quote', label: 'Quote #' }, { key: 'originCity', label: 'Origin' }, { key: 'originState', label: 'OS' }, { key: 'destCity', label: 'Destination' }, { key: 'destState', label: 'DS' }, { key: 'cargoType', label: 'Cargo type' }, { key: 'equipment', label: 'Equipment' }, { key: 'equipmentType', label: 'Equipment type' }, { key: 'pickupDate', label: 'Pickup date' }, { key: 'deliveryDate', label: 'Delivery date' } ],
    rows: [
      { status: { text: 'Pending', tone: 'warn' }, bidding: { text: 'AI', tone: 'purple' }, id: { text: 'PQ-2200', mono: true }, date: { text: '10-07-2026', mono: true }, quote: { text: 'Q-9300', mono: true, tone: 'info' }, originCity: { text: 'Los Angeles' }, originState: { text: 'CA' }, destCity: { text: 'Seattle' }, destState: { text: 'WA' }, cargoType: { text: 'LTL' }, equipment: { text: 'Dry Van 53\'' }, equipmentType: { text: 'Van' }, pickupDate: { text: '10-09-2026', mono: true }, deliveryDate: { text: '10-12-2026', mono: true } },
      { status: { text: 'Bidding', tone: 'blue' }, bidding: { text: 'A. Singh', tone: 'grey' }, id: { text: 'PQ-2201', mono: true }, date: { text: '10-06-2026', mono: true }, quote: { text: 'Q-9301', mono: true, tone: 'info' }, originCity: { text: 'Dallas' }, originState: { text: 'TX' }, destCity: { text: 'Portland' }, destState: { text: 'OR' }, cargoType: { text: 'FTL' }, equipment: { text: 'Reefer' }, equipmentType: { text: 'Reefer' }, pickupDate: { text: '10-10-2026', mono: true }, deliveryDate: { text: '10-13-2026', mono: true } },
      { status: { text: 'Submitted', tone: 'good' }, bidding: { text: 'AI', tone: 'purple' }, id: { text: 'PQ-2202', mono: true }, date: { text: '10-05-2026', mono: true }, quote: { text: 'Q-9302', mono: true, tone: 'info' }, originCity: { text: 'Phoenix' }, originState: { text: 'AZ' }, destCity: { text: 'Houston' }, destState: { text: 'TX' }, cargoType: { text: 'LTL' }, equipment: { text: 'Flatbed' }, equipmentType: { text: 'Flatbed' }, pickupDate: { text: '10-11-2026', mono: true }, deliveryDate: { text: '10-14-2026', mono: true } },
      { status: { text: 'Pending', tone: 'warn' }, bidding: { text: 'T. Nguyen', tone: 'grey' }, id: { text: 'PQ-2203', mono: true }, date: { text: '10-04-2026', mono: true }, quote: { text: 'Q-9303', mono: true, tone: 'info' }, originCity: { text: 'Denver' }, originState: { text: 'CO' }, destCity: { text: 'Memphis' }, destState: { text: 'TN' }, cargoType: { text: 'FTL' }, equipment: { text: 'Step Deck' }, equipmentType: { text: 'Specialized' }, pickupDate: { text: '10-12-2026', mono: true }, deliveryDate: { text: '10-15-2026', mono: true } },
      { status: { text: 'Bidding', tone: 'blue' }, bidding: { text: 'AI', tone: 'purple' }, id: { text: 'PQ-2204', mono: true }, date: { text: '10-03-2026', mono: true }, quote: { text: 'Q-9304', mono: true, tone: 'info' }, originCity: { text: 'Chicago' }, originState: { text: 'IL' }, destCity: { text: 'Miami' }, destState: { text: 'FL' }, cargoType: { text: 'LTL' }, equipment: { text: 'Box Truck' }, equipmentType: { text: 'Van' }, pickupDate: { text: '10-13-2026', mono: true }, deliveryDate: { text: '10-16-2026', mono: true } },
      { status: { text: 'Submitted', tone: 'good' }, bidding: { text: 'A. Singh', tone: 'grey' }, id: { text: 'PQ-2205', mono: true }, date: { text: '10-02-2026', mono: true }, quote: { text: 'Q-9305', mono: true, tone: 'info' }, originCity: { text: 'Atlanta' }, originState: { text: 'GA' }, destCity: { text: 'Charlotte' }, destState: { text: 'NC' }, cargoType: { text: 'FTL' }, equipment: { text: 'Dry Van 53\'' }, equipmentType: { text: 'Reefer' }, pickupDate: { text: '10-14-2026', mono: true }, deliveryDate: { text: '10-17-2026', mono: true } },
      { status: { text: 'Pending', tone: 'warn' }, bidding: { text: 'AI', tone: 'purple' }, id: { text: 'PQ-2206', mono: true }, date: { text: '10-01-2026', mono: true }, quote: { text: 'Q-9306', mono: true, tone: 'info' }, originCity: { text: 'Seattle' }, originState: { text: 'WA' }, destCity: { text: 'Newark' }, destState: { text: 'NJ' }, cargoType: { text: 'LTL' }, equipment: { text: 'Reefer' }, equipmentType: { text: 'Flatbed' }, pickupDate: { text: '10-15-2026', mono: true }, deliveryDate: { text: '10-18-2026', mono: true } },
      { status: { text: 'Bidding', tone: 'blue' }, bidding: { text: 'T. Nguyen', tone: 'grey' }, id: { text: 'PQ-2207', mono: true }, date: { text: '09-30-2026', mono: true }, quote: { text: 'Q-9307', mono: true, tone: 'info' }, originCity: { text: 'Portland' }, originState: { text: 'OR' }, destCity: { text: 'Boston' }, destState: { text: 'MA' }, cargoType: { text: 'FTL' }, equipment: { text: 'Flatbed' }, equipmentType: { text: 'Specialized' }, pickupDate: { text: '10-16-2026', mono: true }, deliveryDate: { text: '10-19-2026', mono: true } },
      { status: { text: 'Submitted', tone: 'good' }, bidding: { text: 'AI', tone: 'purple' }, id: { text: 'PQ-2208', mono: true }, date: { text: '09-29-2026', mono: true }, quote: { text: 'Q-9308', mono: true, tone: 'info' }, originCity: { text: 'Houston' }, originState: { text: 'TX' }, destCity: { text: 'Los Angeles' }, destState: { text: 'CA' }, cargoType: { text: 'LTL' }, equipment: { text: 'Step Deck' }, equipmentType: { text: 'Van' }, pickupDate: { text: '10-17-2026', mono: true }, deliveryDate: { text: '10-20-2026', mono: true } },
      { status: { text: 'Pending', tone: 'warn' }, bidding: { text: 'A. Singh', tone: 'grey' }, id: { text: 'PQ-2209', mono: true }, date: { text: '09-28-2026', mono: true }, quote: { text: 'Q-9309', mono: true, tone: 'info' }, originCity: { text: 'Memphis' }, originState: { text: 'TN' }, destCity: { text: 'Dallas' }, destState: { text: 'TX' }, cargoType: { text: 'FTL' }, equipment: { text: 'Box Truck' }, equipmentType: { text: 'Reefer' }, pickupDate: { text: '10-18-2026', mono: true }, deliveryDate: { text: '10-21-2026', mono: true } },
      { status: { text: 'Bidding', tone: 'blue' }, bidding: { text: 'AI', tone: 'purple' }, id: { text: 'PQ-2210', mono: true }, date: { text: '09-27-2026', mono: true }, quote: { text: 'Q-9310', mono: true, tone: 'info' }, originCity: { text: 'Miami' }, originState: { text: 'FL' }, destCity: { text: 'Phoenix' }, destState: { text: 'AZ' }, cargoType: { text: 'LTL' }, equipment: { text: 'Dry Van 53\'' }, equipmentType: { text: 'Flatbed' }, pickupDate: { text: '10-09-2026', mono: true }, deliveryDate: { text: '10-22-2026', mono: true } },
      { status: { text: 'Submitted', tone: 'good' }, bidding: { text: 'T. Nguyen', tone: 'grey' }, id: { text: 'PQ-2211', mono: true }, date: { text: '09-26-2026', mono: true }, quote: { text: 'Q-9311', mono: true, tone: 'info' }, originCity: { text: 'Charlotte' }, originState: { text: 'NC' }, destCity: { text: 'Denver' }, destState: { text: 'CO' }, cargoType: { text: 'FTL' }, equipment: { text: 'Reefer' }, equipmentType: { text: 'Specialized' }, pickupDate: { text: '10-10-2026', mono: true }, deliveryDate: { text: '10-23-2026', mono: true } },
    ],
  },
  'automated-loadboard': {
    title: 'Automated loadboard',
    subtitle: 'Auto-matched external loads',
    kind: 'table',
    backTo: '/section/load-board',
    filterKeys: ['loadboardOrigin', 'cargoType', 'status'],
    columns: [ { key: 'loadboardOrigin', label: 'Loadboard origin' }, { key: 'quote', label: 'Quote #' }, { key: 'customer', label: 'Customer' }, { key: 'originCity', label: 'Origin' }, { key: 'originState', label: 'OS' }, { key: 'destCity', label: 'Destination' }, { key: 'destState', label: 'DS' }, { key: 'cargoType', label: 'Cargo type' }, { key: 'equipment', label: 'Equipment' }, { key: 'equipmentType', label: 'Equipment type' }, { key: 'pickupDate', label: 'Pickup date' }, { key: 'deliveryDate', label: 'Delivery date' }, { key: 'status', label: 'Status', align: 'right' } ],
    rows: [
      { loadboardOrigin: { text: 'DAT' }, quote: { text: 'Q-9500', mono: true, tone: 'info' }, customer: { text: 'Customer 1' }, originCity: { text: 'Los Angeles' }, originState: { text: 'CA' }, destCity: { text: 'Seattle' }, destState: { text: 'WA' }, cargoType: { text: 'LTL' }, equipment: { text: 'Dry Van 53\'' }, equipmentType: { text: 'Van' }, pickupDate: { text: '10-08-2026', mono: true }, deliveryDate: { text: '10-11-2026', mono: true }, status: { text: 'New', tone: 'blue' } },
      { loadboardOrigin: { text: 'Truckstop' }, quote: { text: 'Q-9501', mono: true, tone: 'info' }, customer: { text: 'Customer 2' }, originCity: { text: 'Dallas' }, originState: { text: 'TX' }, destCity: { text: 'Portland' }, destState: { text: 'OR' }, cargoType: { text: 'FTL' }, equipment: { text: 'Reefer' }, equipmentType: { text: 'Reefer' }, pickupDate: { text: '10-09-2026', mono: true }, deliveryDate: { text: '10-12-2026', mono: true }, status: { text: 'Matched', tone: 'warn' } },
      { loadboardOrigin: { text: '123Loadboard' }, quote: { text: 'Q-9502', mono: true, tone: 'info' }, customer: { text: 'Customer 3' }, originCity: { text: 'Phoenix' }, originState: { text: 'AZ' }, destCity: { text: 'Houston' }, destState: { text: 'TX' }, cargoType: { text: 'LTL' }, equipment: { text: 'Flatbed' }, equipmentType: { text: 'Flatbed' }, pickupDate: { text: '10-10-2026', mono: true }, deliveryDate: { text: '10-13-2026', mono: true }, status: { text: 'Booked', tone: 'good' } },
      { loadboardOrigin: { text: 'Internal' }, quote: { text: 'Q-9503', mono: true, tone: 'info' }, customer: { text: 'Customer 4' }, originCity: { text: 'Denver' }, originState: { text: 'CO' }, destCity: { text: 'Memphis' }, destState: { text: 'TN' }, cargoType: { text: 'FTL' }, equipment: { text: 'Step Deck' }, equipmentType: { text: 'Specialized' }, pickupDate: { text: '10-11-2026', mono: true }, deliveryDate: { text: '10-14-2026', mono: true }, status: { text: 'Expired', tone: 'high' } },
      { loadboardOrigin: { text: 'DAT' }, quote: { text: 'Q-9504', mono: true, tone: 'info' }, customer: { text: 'Customer 5' }, originCity: { text: 'Chicago' }, originState: { text: 'IL' }, destCity: { text: 'Miami' }, destState: { text: 'FL' }, cargoType: { text: 'LTL' }, equipment: { text: 'Box Truck' }, equipmentType: { text: 'Van' }, pickupDate: { text: '10-12-2026', mono: true }, deliveryDate: { text: '10-15-2026', mono: true }, status: { text: 'New', tone: 'blue' } },
      { loadboardOrigin: { text: 'Truckstop' }, quote: { text: 'Q-9505', mono: true, tone: 'info' }, customer: { text: 'Customer 6' }, originCity: { text: 'Atlanta' }, originState: { text: 'GA' }, destCity: { text: 'Charlotte' }, destState: { text: 'NC' }, cargoType: { text: 'FTL' }, equipment: { text: 'Dry Van 53\'' }, equipmentType: { text: 'Reefer' }, pickupDate: { text: '10-13-2026', mono: true }, deliveryDate: { text: '10-16-2026', mono: true }, status: { text: 'Matched', tone: 'warn' } },
      { loadboardOrigin: { text: '123Loadboard' }, quote: { text: 'Q-9506', mono: true, tone: 'info' }, customer: { text: 'Customer 1' }, originCity: { text: 'Seattle' }, originState: { text: 'WA' }, destCity: { text: 'Newark' }, destState: { text: 'NJ' }, cargoType: { text: 'LTL' }, equipment: { text: 'Reefer' }, equipmentType: { text: 'Flatbed' }, pickupDate: { text: '10-14-2026', mono: true }, deliveryDate: { text: '10-17-2026', mono: true }, status: { text: 'Booked', tone: 'good' } },
      { loadboardOrigin: { text: 'Internal' }, quote: { text: 'Q-9507', mono: true, tone: 'info' }, customer: { text: 'Customer 2' }, originCity: { text: 'Portland' }, originState: { text: 'OR' }, destCity: { text: 'Boston' }, destState: { text: 'MA' }, cargoType: { text: 'FTL' }, equipment: { text: 'Flatbed' }, equipmentType: { text: 'Specialized' }, pickupDate: { text: '10-15-2026', mono: true }, deliveryDate: { text: '10-18-2026', mono: true }, status: { text: 'Expired', tone: 'high' } },
      { loadboardOrigin: { text: 'DAT' }, quote: { text: 'Q-9508', mono: true, tone: 'info' }, customer: { text: 'Customer 3' }, originCity: { text: 'Houston' }, originState: { text: 'TX' }, destCity: { text: 'Los Angeles' }, destState: { text: 'CA' }, cargoType: { text: 'LTL' }, equipment: { text: 'Step Deck' }, equipmentType: { text: 'Van' }, pickupDate: { text: '10-16-2026', mono: true }, deliveryDate: { text: '10-19-2026', mono: true }, status: { text: 'New', tone: 'blue' } },
      { loadboardOrigin: { text: 'Truckstop' }, quote: { text: 'Q-9509', mono: true, tone: 'info' }, customer: { text: 'Customer 4' }, originCity: { text: 'Memphis' }, originState: { text: 'TN' }, destCity: { text: 'Dallas' }, destState: { text: 'TX' }, cargoType: { text: 'FTL' }, equipment: { text: 'Box Truck' }, equipmentType: { text: 'Reefer' }, pickupDate: { text: '10-08-2026', mono: true }, deliveryDate: { text: '10-20-2026', mono: true }, status: { text: 'Matched', tone: 'warn' } },
      { loadboardOrigin: { text: '123Loadboard' }, quote: { text: 'Q-9510', mono: true, tone: 'info' }, customer: { text: 'Customer 5' }, originCity: { text: 'Miami' }, originState: { text: 'FL' }, destCity: { text: 'Phoenix' }, destState: { text: 'AZ' }, cargoType: { text: 'LTL' }, equipment: { text: 'Dry Van 53\'' }, equipmentType: { text: 'Flatbed' }, pickupDate: { text: '10-09-2026', mono: true }, deliveryDate: { text: '10-21-2026', mono: true }, status: { text: 'Booked', tone: 'good' } },
      { loadboardOrigin: { text: 'Internal' }, quote: { text: 'Q-9511', mono: true, tone: 'info' }, customer: { text: 'Customer 6' }, originCity: { text: 'Charlotte' }, originState: { text: 'NC' }, destCity: { text: 'Denver' }, destState: { text: 'CO' }, cargoType: { text: 'FTL' }, equipment: { text: 'Reefer' }, equipmentType: { text: 'Specialized' }, pickupDate: { text: '10-10-2026', mono: true }, deliveryDate: { text: '10-11-2026', mono: true }, status: { text: 'Expired', tone: 'high' } },
    ],
  },

};
