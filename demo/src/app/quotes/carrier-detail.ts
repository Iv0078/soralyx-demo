import { CarrierDetail } from './models';

const PALETTE = ['#6E6FFD', '#3396CD', '#8f7bff', '#5a6b8c', '#4aa3d5'];

export function monogramOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}
export function colorFor(seed: string): string {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

/**
 * Single source of truth for a carrier's detail window, so the sub-window
 * shows the same data everywhere it is opened.
 */
export function buildCarrierDetail(c: { name: string; monogram?: string; color?: string; mc?: string }): CarrierDetail {
  return {
    name: c.name,
    monogram: c.monogram ?? monogramOf(c.name),
    color: c.color ?? colorFor(c.name),
    mc: c.mc ?? 'MC-000000',
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
