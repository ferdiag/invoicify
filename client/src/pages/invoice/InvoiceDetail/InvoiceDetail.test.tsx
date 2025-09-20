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
});
