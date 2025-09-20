import { describe, it, vi } from 'vitest';
import InvoiceDetail from './InvoiceDetail';
import { render, screen } from '@testing-library/react';
import { mockParams, useUserStoreMock } from '../../../test/setup';
import { makeUserStore } from '../../../test/makeUserStore';
import type { UserStoreType } from '../../../store/types';

type StoreUser = NonNullable<UserStoreType['user']>;
type StoreInvoice = StoreUser['invoices'][number];

const baseInvoice: StoreInvoice = {
  id: 'inv-1',
  userId: 'user-1',
  name: 'Rechnung ACME',
  invoiceDate: '2025-09-14',
  dueDate: '2025-10-14',
  grossAmount: '123.45',
  netAmount: '103.78',
  vat: 19,
  customerId: 'cust-1234567890',
  products: [
    { id: 'p1', name: 'Laptop', quantity: 1, price: 1000 },
    { id: 'p2', name: 'Maus', quantity: 2, price: 25 },
  ],
};

describe('InvoiceDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders invoice details correctly', () => {
    type StoreUser = NonNullable<UserStoreType['user']>;
    const baseUser: StoreUser = { ...makeUserStore().user!, invoices: [baseInvoice] };

    const user: StoreUser = { ...baseUser, invoices: [baseInvoice] };
    useUserStoreMock.mockReturnValue(makeUserStore({ user }));

    mockParams.id = 'inv-1';
    render(<InvoiceDetail />);
    expect(screen.getByText('Rechnung ACME')).toBeInTheDocument();
    expect(screen.getByText('2025-09-14')).toBeInTheDocument();
    expect(screen.getByText('2025-10-14')).toBeInTheDocument();
    expect(screen.getByText('123.45 €')).toBeInTheDocument();
    expect(screen.getByText('103.78 €')).toBeInTheDocument();
    expect(screen.getByText('19 %')).toBeInTheDocument();
    expect(screen.getByText('cust-1234567890')).toBeInTheDocument();
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Maus')).toBeInTheDocument();
  });
  it('shows notFound message when invoice id does not exist', () => {
    const baseUser = makeUserStore().user!;
    const user: StoreUser = { ...baseUser, invoices: [baseInvoice] };
    useUserStoreMock.mockReturnValue(makeUserStore({ user }));

    mockParams.id = 'does-not-exist';
    render(<InvoiceDetail />);

    expect(screen.getByText('Rechnung nicht gefunden')).toBeInTheDocument();
  });
  it('shows notFound message when user is null', () => {
    useUserStoreMock.mockReturnValue(makeUserStore({ user: null }));

    mockParams.id = 'inv-1';
    render(<InvoiceDetail />);

    expect(screen.getByText('Rechnung nicht gefunden')).toBeInTheDocument();
  });

  it('formats amounts to 2 decimals', () => {
    const invoice: StoreInvoice = {
      ...baseInvoice,
      id: 'inv-2',
      grossAmount: '10',
      netAmount: '3.5',
    };

    const baseUser = makeUserStore().user!;
    const user: StoreUser = { ...baseUser, invoices: [invoice] };
    useUserStoreMock.mockReturnValue(makeUserStore({ user }));

    mockParams.id = 'inv-2';
    render(<InvoiceDetail />);

    expect(screen.getByText('10.00 €')).toBeInTheDocument();
    expect(screen.getByText('3.50 €')).toBeInTheDocument();
  });
  it('renders product rows with correct calculations', () => {
    const invoice: StoreInvoice = {
      ...baseInvoice,
      id: 'inv-3',
      products: [
        { id: 'p1', name: 'Monitor', quantity: 2, price: 199.99 },
        { id: 'p2', name: 'Kabel', quantity: 3, price: 5 },
      ],
    };

    const baseUser = makeUserStore().user!;
    const user: StoreUser = { ...baseUser, invoices: [invoice] };
    useUserStoreMock.mockReturnValue(makeUserStore({ user }));

    mockParams.id = 'inv-3';
    render(<InvoiceDetail />);

    // Monitor: 2 * 199.99
    expect(screen.getByText('Monitor')).toBeInTheDocument();
    expect(screen.getByText('199.99 €')).toBeInTheDocument();
    expect(screen.getByText('399.98 €')).toBeInTheDocument();

    // Kabel: 3 * 5
    expect(screen.getByText('Kabel')).toBeInTheDocument();
    expect(screen.getByText('5.00 €')).toBeInTheDocument();
    expect(screen.getByText('15.00 €')).toBeInTheDocument();
  });
});
