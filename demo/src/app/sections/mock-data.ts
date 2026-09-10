export type Tone = 'default' | 'good' | 'bad' | 'warn' | 'info';

export interface Cell { text: string; tone?: Tone; mono?: boolean; strong?: boolean; }
export interface Stat { label: string; value: string; tone?: Tone; }
export interface CardItem { title: string; desc: string; tag?: string; }

export interface Section {
  title: string;
  subtitle: string;
  kind: 'table' | 'cards' | 'chat';
  stats?: Stat[];
  columns?: { key: string; label: string; align?: 'left' | 'right' | 'center' }[];
  rows?: Record<string, Cell>[];
  cards?: CardItem[];
  chat?: ChatData;
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
    title: 'Load board offers',
    subtitle: 'External loads available to book on connected boards',
    kind: 'table',
    stats: [
      { label: 'Open offers', value: '182' },
      { label: 'Matched to lanes', value: '46', tone: 'info' },
      { label: 'Avg rate / mi', value: '$1.92' },
      { label: 'New today', value: '37', tone: 'good' },
    ],
    columns: [
      { key: 'load', label: 'Load' }, { key: 'lane', label: 'Lane' },
      { key: 'equip', label: 'Equipment' }, { key: 'miles', label: 'Miles', align: 'right' },
      { key: 'rate', label: 'Rate', align: 'right' }, { key: 'age', label: 'Age', align: 'right' },
      { key: 'broker', label: 'Source' },
    ],
    rows: [
      { load: c('LB-55120', { mono: true, tone: 'info' }), lane: c('Los Angeles → Dallas'), equip: c('Dry Van 53′'), miles: c('1,435', { mono: true, align: 'right' } as any), rate: c('$2,720', { mono: true, strong: true }), age: c('14m', { mono: true }), broker: c('DAT') },
      { load: c('LB-55118', { mono: true, tone: 'info' }), lane: c('Phoenix → Denver'), equip: c('Reefer'), miles: c('821', { mono: true }), rate: c('$1,980', { mono: true, strong: true }), age: c('26m', { mono: true }), broker: c('Truckstop') },
      { load: c('LB-55101', { mono: true, tone: 'info' }), lane: c('Chicago → Atlanta'), equip: c('Dry Van 53′'), miles: c('716', { mono: true }), rate: c('$1,540', { mono: true, strong: true }), age: c('41m', { mono: true }), broker: c('DAT') },
      { load: c('LB-55097', { mono: true, tone: 'info' }), lane: c('Seattle → Portland'), equip: c('Flatbed'), miles: c('174', { mono: true }), rate: c('$620', { mono: true, strong: true }), age: c('52m', { mono: true }), broker: c('Truckstop') },
      { load: c('LB-55081', { mono: true, tone: 'info' }), lane: c('Newark → Boston'), equip: c('Dry Van 53′'), miles: c('221', { mono: true }), rate: c('$780', { mono: true, strong: true }), age: c('1h', { mono: true }), broker: c('DAT') },
      { load: c('LB-55066', { mono: true, tone: 'info' }), lane: c('Houston → Memphis'), equip: c('Reefer'), miles: c('561', { mono: true }), rate: c('$1,410', { mono: true, strong: true }), age: c('1h', { mono: true }), broker: c('123Loadboard') },
    ],
  },
  'load-offers': {
    title: 'Load offers',
    subtitle: 'Loads offered to your carriers, awaiting acceptance',
    kind: 'table',
    stats: [
      { label: 'Pending', value: '23', tone: 'warn' },
      { label: 'Accepted', value: '58', tone: 'good' },
      { label: 'Declined', value: '9', tone: 'bad' },
      { label: 'Expiring soon', value: '4', tone: 'warn' },
    ],
    columns: [
      { key: 'load', label: 'Load' }, { key: 'carrier', label: 'Carrier' },
      { key: 'lane', label: 'Lane' }, { key: 'rate', label: 'Offer', align: 'right' },
      { key: 'expires', label: 'Expires', align: 'right' }, { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { load: c('L-90231', { mono: true, tone: 'info' }), carrier: c('Carrier 1'), lane: c('Los Angeles → Dallas'), rate: c('$2,650', { mono: true, strong: true }), expires: c('2h', { mono: true }), status: c('Pending', { tone: 'warn' }) },
      { load: c('L-90228', { mono: true, tone: 'info' }), carrier: c('Carrier 3'), lane: c('Ontario → Phoenix'), rate: c('$980', { mono: true, strong: true }), expires: c('5h', { mono: true }), status: c('Accepted', { tone: 'good' }) },
      { load: c('L-90224', { mono: true, tone: 'info' }), carrier: c('Carrier 2'), lane: c('Dallas → Memphis'), rate: c('$1,240', { mono: true, strong: true }), expires: c('—', { mono: true }), status: c('Accepted', { tone: 'good' }) },
      { load: c('L-90219', { mono: true, tone: 'info' }), carrier: c('Carrier 4'), lane: c('Denver → Salt Lake City'), rate: c('$860', { mono: true, strong: true }), expires: c('—', { mono: true }), status: c('Declined', { tone: 'bad' }) },
      { load: c('L-90215', { mono: true, tone: 'info' }), carrier: c('Carrier 1'), lane: c('Los Angeles → Las Vegas'), rate: c('$540', { mono: true, strong: true }), expires: c('45m', { mono: true }), status: c('Pending', { tone: 'warn' }) },
    ],
  },
  'tracing': {
    title: 'Tracing',
    subtitle: 'Live status of shipments in transit',
    kind: 'table',
    stats: [
      { label: 'In transit', value: '41', tone: 'info' },
      { label: 'On schedule', value: '36', tone: 'good' },
      { label: 'At risk', value: '3', tone: 'warn' },
      { label: 'Delayed', value: '2', tone: 'bad' },
    ],
    columns: [
      { key: 'load', label: 'Load' }, { key: 'carrier', label: 'Carrier' },
      { key: 'lane', label: 'Lane' }, { key: 'status', label: 'Status' },
      { key: 'eta', label: 'ETA', align: 'right' }, { key: 'updated', label: 'Last ping', align: 'right' },
    ],
    rows: [
      { load: c('L-90188', { mono: true, tone: 'info' }), carrier: c('Carrier 1'), lane: c('Los Angeles → Dallas'), status: c('On schedule', { tone: 'good' }), eta: c('Sep 11, 14:00', { mono: true }), updated: c('6m', { mono: true }) },
      { load: c('L-90176', { mono: true, tone: 'info' }), carrier: c('Carrier 2'), lane: c('Phoenix → Denver'), status: c('At risk', { tone: 'warn' }), eta: c('Sep 10, 22:00', { mono: true }), updated: c('12m', { mono: true }) },
      { load: c('L-90171', { mono: true, tone: 'info' }), carrier: c('Carrier 3'), lane: c('Chicago → Atlanta'), status: c('Delayed', { tone: 'bad' }), eta: c('Sep 11, 09:00', { mono: true }), updated: c('3m', { mono: true }) },
      { load: c('L-90165', { mono: true, tone: 'info' }), carrier: c('Carrier 4'), lane: c('Seattle → Portland'), status: c('On schedule', { tone: 'good' }), eta: c('Today, 18:30', { mono: true }), updated: c('1m', { mono: true }) },
      { load: c('L-90160', { mono: true, tone: 'info' }), carrier: c('Carrier 1'), lane: c('Houston → Memphis'), status: c('On schedule', { tone: 'good' }), eta: c('Sep 10, 16:00', { mono: true }), updated: c('9m', { mono: true }) },
    ],
  },

  /* ---------------- Quotes ---------------- */
  'quotes-all': {
    title: 'All quotes',
    subtitle: 'Every rate quote across carrier and broker loads',
    kind: 'table',
    stats: [
      { label: 'Open', value: '64', tone: 'info' },
      { label: 'Won', value: '128', tone: 'good' },
      { label: 'Lost', value: '31', tone: 'bad' },
      { label: 'Win rate', value: '80%', tone: 'good' },
    ],
    columns: [
      { key: 'q', label: 'Quote' }, { key: 'cust', label: 'Customer' },
      { key: 'lane', label: 'Lane' }, { key: 'type', label: 'Type' },
      { key: 'amt', label: 'Amount', align: 'right' }, { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { q: c('4711 0082 1902', { mono: true, tone: 'info' }), cust: c('Customer 1'), lane: c('Los Angeles → Dallas'), type: c('Carrier'), amt: c('$3,155', { mono: true, strong: true }), status: c('Quoting', { tone: 'info' }) },
      { q: c('4711 0082 1874', { mono: true, tone: 'info' }), cust: c('Customer 2'), lane: c('Phoenix → Denver'), type: c('Broker'), amt: c('$2,240', { mono: true, strong: true }), status: c('Won', { tone: 'good' }) },
      { q: c('4711 0082 1861', { mono: true, tone: 'info' }), cust: c('Customer 3'), lane: c('Chicago → Atlanta'), type: c('Carrier'), amt: c('$1,780', { mono: true, strong: true }), status: c('Won', { tone: 'good' }) },
      { q: c('4711 0082 1845', { mono: true, tone: 'info' }), cust: c('Customer 1'), lane: c('Newark → Boston'), type: c('Broker'), amt: c('$920', { mono: true, strong: true }), status: c('Lost', { tone: 'bad' }) },
      { q: c('4711 0082 1832', { mono: true, tone: 'info' }), cust: c('Customer 4'), lane: c('Houston → Memphis'), type: c('Carrier'), amt: c('$1,560', { mono: true, strong: true }), status: c('Sent', { tone: 'warn' }) },
    ],
  },
  'broker-quotes': {
    title: 'Broker load quotes',
    subtitle: 'Quotes submitted against brokered loads',
    kind: 'table',
    stats: [
      { label: 'Active bids', value: '38', tone: 'info' },
      { label: 'Awarded', value: '52', tone: 'good' },
      { label: 'Avg margin', value: '14.6%' },
      { label: 'Expiring', value: '6', tone: 'warn' },
    ],
    columns: [
      { key: 'q', label: 'Quote' }, { key: 'broker', label: 'Broker' },
      { key: 'lane', label: 'Lane' }, { key: 'bid', label: 'Bid', align: 'right' },
      { key: 'posted', label: 'Posted', align: 'right' }, { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { q: c('BQ-2043', { mono: true, tone: 'info' }), broker: c('Broker 1'), lane: c('Los Angeles → Dallas'), bid: c('$2,690', { mono: true, strong: true }), posted: c('20m', { mono: true }), status: c('Submitted', { tone: 'info' }) },
      { q: c('BQ-2039', { mono: true, tone: 'info' }), broker: c('Broker 2'), lane: c('Dallas → Memphis'), bid: c('$1,220', { mono: true, strong: true }), posted: c('1h', { mono: true }), status: c('Awarded', { tone: 'good' }) },
      { q: c('BQ-2031', { mono: true, tone: 'info' }), broker: c('Broker 1'), lane: c('Denver → Salt Lake City'), bid: c('$880', { mono: true, strong: true }), posted: c('3h', { mono: true }), status: c('Countered', { tone: 'warn' }) },
      { q: c('BQ-2024', { mono: true, tone: 'info' }), broker: c('Broker 3'), lane: c('Ontario → Phoenix'), bid: c('$1,010', { mono: true, strong: true }), posted: c('5h', { mono: true }), status: c('Lost', { tone: 'bad' }) },
    ],
  },

  /* ---------------- Partners ---------------- */
  'carriers': {
    title: 'Carriers',
    subtitle: 'Contracted and spot carriers in your network',
    kind: 'table',
    stats: [
      { label: 'Active', value: '86', tone: 'good' },
      { label: 'Preferred', value: '24', tone: 'info' },
      { label: 'On-hold', value: '3', tone: 'warn' },
      { label: 'Avg on-time', value: '94%' },
    ],
    columns: [
      { key: 'name', label: 'Carrier' }, { key: 'mc', label: 'MC #' },
      { key: 'type', label: 'Type' }, { key: 'ontime', label: 'On-time', align: 'right' },
      { key: 'loads', label: 'Loads', align: 'right' }, { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { name: c('Carrier 1', { strong: true }), mc: c('MC-448201', { mono: true }), type: c('Asset'), ontime: c('96%', { mono: true }), loads: c('128', { mono: true }), status: c('Preferred', { tone: 'info' }) },
      { name: c('Carrier 2', { strong: true }), mc: c('MC-771043', { mono: true }), type: c('Brokered'), ontime: c('94%', { mono: true }), loads: c('86', { mono: true }), status: c('Active', { tone: 'good' }) },
      { name: c('Carrier 3', { strong: true }), mc: c('MC-330918', { mono: true }), type: c('Asset'), ontime: c('91%', { mono: true }), loads: c('64', { mono: true }), status: c('Active', { tone: 'good' }) },
      { name: c('Carrier 4', { strong: true }), mc: c('MC-559277', { mono: true }), type: c('Asset'), ontime: c('95%', { mono: true }), loads: c('102', { mono: true }), status: c('On-hold', { tone: 'warn' }) },
      { name: c('Carrier 5', { strong: true }), mc: c('MC-610284', { mono: true }), type: c('Brokered'), ontime: c('89%', { mono: true }), loads: c('41', { mono: true }), status: c('Active', { tone: 'good' }) },
    ],
  },
  'customers': {
    title: 'Customers / Shippers',
    subtitle: 'Shippers and customers you move freight for',
    kind: 'table',
    stats: [
      { label: 'Active', value: '54', tone: 'good' },
      { label: 'Loads MTD', value: '312' },
      { label: 'On credit hold', value: '2', tone: 'warn' },
      { label: 'Avg DSO', value: '34d' },
    ],
    columns: [
      { key: 'name', label: 'Customer' }, { key: 'contact', label: 'Primary contact' },
      { key: 'loc', label: 'Location' }, { key: 'loads', label: 'Loads', align: 'right' },
      { key: 'terms', label: 'Terms' }, { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { name: c('Customer 1', { strong: true }), contact: c('D. Whitfield'), loc: c('Los Angeles, CA'), loads: c('88', { mono: true }), terms: c('Net 30'), status: c('Active', { tone: 'good' }) },
      { name: c('Customer 2', { strong: true }), contact: c('R. Alvarez'), loc: c('Phoenix, AZ'), loads: c('61', { mono: true }), terms: c('Net 45'), status: c('Active', { tone: 'good' }) },
      { name: c('Customer 3', { strong: true }), contact: c('S. Nguyen'), loc: c('Chicago, IL'), loads: c('47', { mono: true }), terms: c('Net 30'), status: c('Credit hold', { tone: 'warn' }) },
      { name: c('Customer 4', { strong: true }), contact: c('J. Park'), loc: c('Houston, TX'), loads: c('39', { mono: true }), terms: c('Prepaid'), status: c('Active', { tone: 'good' }) },
    ],
  },
  'consignees': {
    title: 'Consignees',
    subtitle: 'Receiving locations and their delivery requirements',
    kind: 'table',
    columns: [
      { key: 'name', label: 'Consignee' }, { key: 'loc', label: 'Location' },
      { key: 'hours', label: 'Receiving hours' }, { key: 'appt', label: 'Appointment' },
      { key: 'deliveries', label: 'Deliveries', align: 'right' },
    ],
    rows: [
      { name: c('Consignee 1', { strong: true }), loc: c('Dallas, TX 75201'), hours: c('06:00 – 14:00'), appt: c('Required', { tone: 'warn' }), deliveries: c('214', { mono: true }) },
      { name: c('Consignee 2', { strong: true }), loc: c('Memphis, TN 38118'), hours: c('24 hours'), appt: c('FCFS', { tone: 'good' }), deliveries: c('167', { mono: true }) },
      { name: c('Consignee 3', { strong: true }), loc: c('Denver, CO 80216'), hours: c('07:00 – 15:00'), appt: c('Required', { tone: 'warn' }), deliveries: c('98', { mono: true }) },
      { name: c('Consignee 4', { strong: true }), loc: c('Atlanta, GA 30336'), hours: c('05:00 – 13:00'), appt: c('FCFS', { tone: 'good' }), deliveries: c('142', { mono: true }) },
    ],
  },
  'customs-brokers': {
    title: 'Customs brokers',
    subtitle: 'Cross-border clearance partners',
    kind: 'table',
    columns: [
      { key: 'name', label: 'Broker' }, { key: 'port', label: 'Port of entry' },
      { key: 'filings', label: 'Filings MTD', align: 'right' }, { key: 'avg', label: 'Avg clearance', align: 'right' },
      { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { name: c('Broker 1', { strong: true }), port: c('Laredo, TX'), filings: c('64', { mono: true }), avg: c('3.2h', { mono: true }), status: c('Active', { tone: 'good' }) },
      { name: c('Broker 2', { strong: true }), port: c('Otay Mesa, CA'), filings: c('41', { mono: true }), avg: c('4.1h', { mono: true }), status: c('Active', { tone: 'good' }) },
      { name: c('Broker 3', { strong: true }), port: c('Buffalo, NY'), filings: c('18', { mono: true }), avg: c('2.7h', { mono: true }), status: c('Active', { tone: 'good' }) },
    ],
  },

  /* ---------------- Accounting ---------------- */
  'documents': {
    title: 'Documents',
    subtitle: 'Rate confirmations, BOLs, PODs and contracts',
    kind: 'table',
    columns: [
      { key: 'name', label: 'Document' }, { key: 'type', label: 'Type' },
      { key: 'related', label: 'Related to' }, { key: 'date', label: 'Date', align: 'right' },
      { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { name: c('RateCon L-90188.pdf', { mono: true }), type: c('Rate confirmation'), related: c('Load L-90188'), date: c('Sep 8', { mono: true }), status: c('Signed', { tone: 'good' }) },
      { name: c('BOL L-90176.pdf', { mono: true }), type: c('Bill of lading'), related: c('Load L-90176'), date: c('Sep 8', { mono: true }), status: c('Received', { tone: 'good' }) },
      { name: c('POD L-90160.pdf', { mono: true }), type: c('Proof of delivery'), related: c('Load L-90160'), date: c('Sep 7', { mono: true }), status: c('Pending', { tone: 'warn' }) },
      { name: c('MSA Customer 2.pdf', { mono: true }), type: c('Contract'), related: c('Customer 2'), date: c('Aug 30', { mono: true }), status: c('Active', { tone: 'good' }) },
    ],
  },
  'invoices': {
    title: 'Invoices',
    subtitle: 'Customer receivables',
    kind: 'table',
    stats: [
      { label: 'Outstanding', value: '$284,120' },
      { label: 'Overdue', value: '$41,900', tone: 'bad' },
      { label: 'Paid MTD', value: '$612,400', tone: 'good' },
      { label: 'Avg DSO', value: '34d' },
    ],
    columns: [
      { key: 'inv', label: 'Invoice' }, { key: 'cust', label: 'Customer' },
      { key: 'amt', label: 'Amount', align: 'right' }, { key: 'due', label: 'Due', align: 'right' },
      { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { inv: c('INV-10421', { mono: true, tone: 'info' }), cust: c('Customer 1'), amt: c('$6,935.00', { mono: true, strong: true }), due: c('Sep 30', { mono: true }), status: c('Open', { tone: 'info' }) },
      { inv: c('INV-10418', { mono: true, tone: 'info' }), cust: c('Customer 3'), amt: c('$12,480.00', { mono: true, strong: true }), due: c('Sep 2', { mono: true }), status: c('Overdue', { tone: 'bad' }) },
      { inv: c('INV-10402', { mono: true, tone: 'info' }), cust: c('Customer 2'), amt: c('$4,120.00', { mono: true, strong: true }), due: c('Aug 28', { mono: true }), status: c('Paid', { tone: 'good' }) },
      { inv: c('INV-10395', { mono: true, tone: 'info' }), cust: c('Customer 4'), amt: c('$2,240.00', { mono: true, strong: true }), due: c('Sep 18', { mono: true }), status: c('Open', { tone: 'info' }) },
    ],
  },
  'payments': {
    title: 'Payments',
    subtitle: 'Carrier settlements and payables',
    kind: 'table',
    stats: [
      { label: 'Scheduled', value: '$118,300' },
      { label: 'Quick-pay', value: '$22,400', tone: 'info' },
      { label: 'Paid MTD', value: '$489,100', tone: 'good' },
      { label: 'Held', value: '$3,200', tone: 'warn' },
    ],
    columns: [
      { key: 'pmt', label: 'Payment' }, { key: 'carrier', label: 'Carrier' },
      { key: 'amt', label: 'Amount', align: 'right' }, { key: 'method', label: 'Method' },
      { key: 'date', label: 'Date', align: 'right' }, { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { pmt: c('PMT-8841', { mono: true, tone: 'info' }), carrier: c('Carrier 1'), amt: c('$2,650.00', { mono: true, strong: true }), method: c('ACH'), date: c('Sep 9', { mono: true }), status: c('Scheduled', { tone: 'info' }) },
      { pmt: c('PMT-8836', { mono: true, tone: 'info' }), carrier: c('Carrier 2'), amt: c('$1,220.00', { mono: true, strong: true }), method: c('Quick-pay'), date: c('Sep 8', { mono: true }), status: c('Paid', { tone: 'good' }) },
      { pmt: c('PMT-8829', { mono: true, tone: 'info' }), carrier: c('Carrier 4'), amt: c('$980.00', { mono: true, strong: true }), method: c('ACH'), date: c('Sep 7', { mono: true }), status: c('Held', { tone: 'warn' }) },
      { pmt: c('PMT-8820', { mono: true, tone: 'info' }), carrier: c('Carrier 3'), amt: c('$1,410.00', { mono: true, strong: true }), method: c('Check'), date: c('Sep 5', { mono: true }), status: c('Paid', { tone: 'good' }) },
    ],
  },
  'support': {
    title: 'Customer support',
    subtitle: 'Open service tickets',
    kind: 'table',
    stats: [
      { label: 'Open', value: '17', tone: 'info' },
      { label: 'Urgent', value: '3', tone: 'bad' },
      { label: 'Avg first response', value: '48m' },
      { label: 'Resolved today', value: '22', tone: 'good' },
    ],
    columns: [
      { key: 't', label: 'Ticket' }, { key: 'subj', label: 'Subject' },
      { key: 'req', label: 'Requester' }, { key: 'pri', label: 'Priority' },
      { key: 'status', label: 'Status', align: 'right' },
    ],
    rows: [
      { t: c('TCK-3391', { mono: true, tone: 'info' }), subj: c('Missing POD for L-90160'), req: c('Customer 1'), pri: c('Urgent', { tone: 'bad' }), status: c('Open', { tone: 'info' }) },
      { t: c('TCK-3388', { mono: true, tone: 'info' }), subj: c('Invoice dispute INV-10418'), req: c('Customer 3'), pri: c('High', { tone: 'warn' }), status: c('In progress', { tone: 'warn' }) },
      { t: c('TCK-3382', { mono: true, tone: 'info' }), subj: c('Update delivery appointment'), req: c('Customer 2'), pri: c('Normal'), status: c('Waiting', { tone: 'warn' }) },
      { t: c('TCK-3377', { mono: true, tone: 'info' }), subj: c('Add new billing contact'), req: c('Customer 4'), pri: c('Low'), status: c('Resolved', { tone: 'good' }) },
    ],
  },

  /* ---------------- Employees ---------------- */
  'emp-resources': {
    title: 'Employee resources',
    subtitle: 'Handbooks, tools and internal links',
    kind: 'cards',
    cards: [
      { title: 'Employee handbook', desc: 'Policies, code of conduct and company guidelines.', tag: 'HR' },
      { title: 'IT help desk', desc: 'Request hardware, reset passwords, report issues.', tag: 'IT' },
      { title: 'Dispatch playbook', desc: 'Standard operating procedures for booking and tracing.', tag: 'Ops' },
      { title: 'Training & certifications', desc: 'Onboarding courses and compliance training.', tag: 'Learning' },
      { title: 'Company directory', desc: 'Find teammates, roles and contact details.', tag: 'People' },
      { title: 'Time off & scheduling', desc: 'Request PTO and view your shift calendar.', tag: 'HR' },
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
  'emp-benefits': {
    title: 'Employee benefits',
    subtitle: 'Your coverage and perks',
    kind: 'cards',
    cards: [
      { title: 'Health insurance', desc: 'Medical PPO/HMO plans with company contribution.', tag: 'Active' },
      { title: 'Dental & vision', desc: 'Preventive and major care, annual eye exam.', tag: 'Active' },
      { title: '401(k) match', desc: 'Up to 4% company match, vested after 1 year.', tag: 'Enrolled' },
      { title: 'Paid time off', desc: '15 days PTO + 10 holidays. 9 days remaining.', tag: '9 left' },
      { title: 'Wellness program', desc: 'Gym reimbursement and mental-health support.', tag: 'Active' },
      { title: 'Perks & discounts', desc: 'Fuel, phone and travel partner discounts.', tag: 'Perks' },
    ],
  },
};
