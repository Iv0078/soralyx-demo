export interface NavItem { name: string; link: string; }
export interface NavMenu { label: string; items: NavItem[]; link?: string; }

export const NAV_MENUS: NavMenu[] = [
  { label: 'Dashboard', items: [
    { name: 'Dispatch boards', link: '/section/load-board' },
    { name: 'Load offers', link: '/section/load-offers' },
    { name: 'Tracing', link: '/section/tracing' } ] },
  { label: 'Quotes', items: [
    { name: 'Quote list', link: '/section/customer-quotes' },
    { name: 'RFQs', link: '/section/rfqs' },
    { name: 'Carrier quotes', link: '/section/carrier-quotes' },
    { name: 'Broker load quotes', link: '/section/broker-quotes' } ] },
  { label: 'Partners', items: [
    { name: 'Carriers', link: '/section/carriers' },
    { name: 'Shippers', link: '/section/customers' },
    { name: 'Consignees', link: '/section/consignees' },
    { name: 'Customs brokers', link: '/section/customs-brokers' } ] },
  { label: 'Accounting', items: [
    { name: 'Receivable documents', link: '/section/documents' },
    { name: 'Invoices', link: '/section/invoices' },
    { name: 'Payments', link: '/section/payments' },
    { name: 'Missing documents', link: '/section/support' } ] },
  { label: 'Employees', items: [
    { name: 'Employee resources', link: '/section/emp-resources' },
    { name: 'Employee chat', link: '/section/emp-chat' },
    { name: 'Employee benefits', link: '/section/emp-benefits' } ] },
  { label: 'Calendar', link: '/section/calendar', items: [] },
];
