import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { DisplayInvoices } from './DisplayInvoices';
import { useNavigateMock } from '../../test/setup';

const mockInvoices = [
  {
    id: '1',
    invoiceDate: '2025-09-14',
    name: 'Musterkunde',
    grossAmount: '123.45',
    customerId: 'cust-1',
    userId: 'user-1',
    dueDate: '2025-10-14',
    vat: 19,
    netAmount: '103.78',
    status: 'open',
    products: [
      { id: 'p1', name: 'Laptop', quantity: 1, price: 1000 },
      { id: 'p2', name: 'Maus', quantity: 2, price: 25 },
    ],
  },
];

describe('DisplayInvoices', () => {
  it('renders the invoices table with correct data', () => {
    render(<DisplayInvoices invoices={mockInvoices} />);
    expect(screen.getByText('Musterkunde')).toBeInTheDocument();
    expect(screen.getByText('2025-09-14')).toBeInTheDocument();
    expect(screen.getByText(/123\.45\s*€/)).toBeInTheDocument();
  });

  it('navigates to invoice detail on row click', async () => {
    const user = userEvent.setup();
    useNavigateMock.mockClear();

    render(<DisplayInvoices invoices={mockInvoices} />);
    await user.click(screen.getByText('Musterkunde').closest('tr')!);

    expect(useNavigateMock).toHaveBeenCalledWith('/invoices/1');
  });

  it('formats grossAmount to 2 decimals + euro sign', () => {
    const invoices = [
      { ...mockInvoices[0], grossAmount: '10' },
      { ...mockInvoices[0], id: '2', grossAmount: '3.5' }, // Fix hier
    ];
    render(<DisplayInvoices invoices={invoices} />);
    expect(screen.getByText(/10\.00\s*€/)).toBeInTheDocument();
    expect(screen.getByText(/3\.50\s*€/)).toBeInTheDocument();
  });
});
