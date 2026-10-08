import { Cell } from './mock-data';

// Evidence that a quote/bid was made by the Soralyx AI dispatcher: either the
// full email chain, or a phone-call transcript. Built on demand from a table row.
export interface AiEmail { dir: 'out' | 'in'; from: string; to: string; time: string; body: string; }
export interface AiLine { speaker: 'ai' | 'them'; name: string; text: string; }

export interface AiProof {
  id: string;
  channel: 'email' | 'phone';
  counterparty: string;
  lane: string;
  rate: string;
  // email
  subject?: string;
  emails?: AiEmail[];
  // phone
  phoneNumber?: string;
  duration?: string;
  when?: string;
  transcript?: AiLine[];
}

const AI_FROM = 'Soralyx AI Dispatcher <dispatch-ai@soralyx.com>';

function t(r: Record<string, Cell>, ...keys: string[]): string {
  for (const k of keys) { const v = r[k]?.text; if (v) return v; }
  return '';
}
function hash(s: string): number {
  let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
function slug(name: string): string { return (name || 'partner').toLowerCase().replace(/[^a-z0-9]+/g, '') || 'partner'; }
function email(name: string): string { return `dispatch@${slug(name)}.example`; }
function phone(r: Record<string, Cell>, seed: number): string {
  const p = t(r, 'contactPhone'); if (p) return p;
  const n = 100 + (seed % 89);
  return `(415) 555-0${n}`;
}

// Build the AI proof for a row that was dispatched by "AI".
export function aiProofFor(r: Record<string, Cell>): AiProof {
  const id = t(r, 'q', 'quote', 'id', 'load', 'carrier') || 'AI-QUOTE';
  const counterparty = t(r, 'cust', 'customer', 'broker', 'carrier') || 'the customer';
  const laneTxt = t(r, 'lane');
  const origin = t(r, 'origin') || (laneTxt.split('→')[0] || '').trim() || 'Origin';
  const dest = t(r, 'dest') || (laneTxt.split('→')[1] || '').trim() || 'Destination';
  const lane = `${origin} → ${dest}`;
  const rate = t(r, 'amt', 'bid', 'active', 'rate') || '—';
  const when = reformat(t(r, 'date', 'ship', 'pickup')) || 'Sep 12, 2026';
  const h = hash(id);
  const channel: 'email' | 'phone' = h % 2 === 0 ? 'email' : 'phone';

  const contactEmail = t(r, 'contactEmail') || email(counterparty);
  const contactName = t(r, 'contactName') || counterparty;
  const lower = counterparty;

  if (channel === 'email') {
    const ask = rate !== '—' ? rate : 'the posted rate';
    const counter = discount(rate, 0.96);
    const settled = discount(rate, 0.985);
    const emails: AiEmail[] = [
      { dir: 'out', from: AI_FROM, to: `${contactName} <${contactEmail}>`, time: `${when} · 8:42 AM`,
        body: `Hi ${firstName(contactName)}, this is the Soralyx automated dispatch desk. We can cover ${lane} (${t(r,'equipment','equip') || 'Dry Van'}) for ${ask} all-in, picking up on your requested date. Would you like me to lock it in?` },
      { dir: 'in', from: `${contactName} <${contactEmail}>`, to: AI_FROM, time: `${when} · 9:05 AM`,
        body: `Thanks. Can you do ${counter}? We had this lane quoted a little lower last week.` },
      { dir: 'out', from: AI_FROM, to: `${contactName} <${contactEmail}>`, time: `${when} · 9:11 AM`,
        body: `Best I can do on short notice is ${settled} — fuel is up on this corridor. That includes live tracking and a 2-day transit commitment.` },
      { dir: 'in', from: `${contactName} <${contactEmail}>`, to: AI_FROM, time: `${when} · 9:20 AM`,
        body: `That works. Please book it at ${settled}.` },
      { dir: 'out', from: AI_FROM, to: `${contactName} <${contactEmail}>`, time: `${when} · 9:21 AM`,
        body: `Booked at ${settled}. Rate confirmation and BOL are on the way. Quote ${id}. Thank you!` },
    ];
    return { id, channel, counterparty: lower, lane, rate: settled, subject: `Rate quote ${id} · ${lane}`, emails };
  }

  const settled = discount(rate, 0.98);
  const transcript: AiLine[] = [
    { speaker: 'ai', name: 'Soralyx AI', text: `Hi, this is the Soralyx automated dispatch line calling about the ${lane} load.` },
    { speaker: 'them', name: firstName(contactName), text: `Sure, go ahead.` },
    { speaker: 'ai', name: 'Soralyx AI', text: `We can move it on a ${t(r,'equipment','equip') || 'dry van'} for ${rate !== '—' ? rate : 'our quoted rate'} all-in, picking up on your requested date.` },
    { speaker: 'them', name: firstName(contactName), text: `That's a little higher than I hoped.` },
    { speaker: 'ai', name: 'Soralyx AI', text: `I can bring it to ${settled} if we confirm now, including tracking and a 2-day transit.` },
    { speaker: 'them', name: firstName(contactName), text: `Okay, let's do ${settled}.` },
    { speaker: 'ai', name: 'Soralyx AI', text: `Great — confirming ${id} at ${settled}. You'll have the rate confirmation by email shortly. Thank you!` },
  ];
  return { id, channel, counterparty: lower, lane, rate: settled, phoneNumber: phone(r, h), duration: `${2 + (h % 3)}m ${10 + (h % 48)}s`, when, transcript };
}

function firstName(n: string): string { const p = (n || '').trim().split(/\s+/); return p[0] || 'there'; }

// Nudge a money string ("$2,720" / "C$1,060") by a factor, keeping its symbol.
function discount(rate: string, factor: number): string {
  const m = /^([^\d]*)([\d,]+)/.exec(rate || '');
  if (!m) return rate || '—';
  const sym = m[1];
  const n = parseInt(m[2].replace(/,/g, ''), 10);
  if (!n) return rate;
  const v = Math.round(n * factor);
  return sym + v.toLocaleString('en-US');
}

// "09-12-2026" -> "Sep 12, 2026"
function reformat(d: string): string {
  const m = /^(\d{2})-(\d{2})-(\d{4})/.exec((d || '').trim());
  if (!m) return '';
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[+m[1] - 1]} ${+m[2]}, ${m[3]}`;
}
