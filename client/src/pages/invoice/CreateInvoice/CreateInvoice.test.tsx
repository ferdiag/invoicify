import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CreateInvoice from './CreateInvoice';
import type { User, InvoiceData, ProductChange, Actions } from '../../../store/types';

const toastMock = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));
vi.mock('react-toastify', () => ({ toast: toastMock }));

type ApiPost = (...args: unknown[]) => Promise<unknown>;
const postMock = vi.hoisted(() => vi.fn() as unknown as ApiPost);
vi.mock('../../../lib/api', () => ({
  api: {
    post: (...args: unknown[]) => (postMock as unknown as ApiPost)(...args),
  },
}));

const toApiMock = vi.hoisted(() => vi.fn((p: string) => `/api${p}`));
vi.mock('../../../lib/toApi', () => ({ toApi: (p: string) => toApiMock(p) }));

vi.mock('../../../../../shared/paths', () => ({
  PATHS: { INVOICES: { ROOT: '/invoices' } },
}));

const storeState = vi.hoisted(() => ({
  user: null as User | null,
  invoiceData: null as InvoiceData | null,
  fns: {
    handleAddProduct: vi.fn<() => void>(),
    handleRemoveProduct: vi.fn<(id: string) => void>(),
    handleProductChange: vi.fn<(p: ProductChange) => void>(),
    handleVatChange: vi.fn<(value: string) => void>(),
    handleDateChange: vi.fn<(field: 'invoiceDate' | 'dueDate', value: string) => void>(),
    handleCustomerChange: vi.fn<(value: string) => void>(),
    handleCalculateTaxAndPrice: vi.fn<() => void>(),
    handlePriceChange: vi.fn<(p: ProductChange) => string>(),
    handleQuantityChange: vi.fn<(p: ProductChange) => void>(),
  } satisfies Partial<Actions>,
}));

vi.mock('../../../store/userStore', () => ({
  useUserStore: () => ({
    user: storeState.user,
    invoiceData: storeState.invoiceData,
    ...storeState.fns,
  }),
}));

function setupWithState(state: {
  user?: User;
  invoiceData?: InvoiceData;
  priceChangeReturn?: string;
}) {
  storeState.user = state.user ?? {
    id: 'u1',
    email: 'u1@example.com',
    name: 'User One',
    contact: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    taxNumber: '',
    customers: [
      {
        id: 'c1',
        name: 'Acme Corp',
        contact: 'mail@acme.test',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        country: '',
      },
    ],
    invoices: [],
  };

  storeState.invoiceData = state.invoiceData ?? {
    customerId: '',
    products: [{ id: 'p1', name: '', quantity: 0, price: 0 }],
    vat: 19,
    invoiceDate: '',
    dueDate: '',
    netAmount: 0,
    grossAmount: 0,
  };

  Object.values(storeState.fns).forEach((fn) => fn.mockClear());
  (postMock as unknown as jest.Mock).mockClear?.();
  toApiMock.mockClear();
  toastMock.success.mockClear();
  toastMock.error.mockClear();
  storeState.fns.handlePriceChange.mockReturnValue(state.priceChangeReturn ?? '12.30');
}

describe('CreateInvoice', () => {
  beforeEach(() => {
    setupWithState({});
  });

  it('renders form fields', () => {
    render(<CreateInvoice />);
    expect(screen.getByRole('heading', { name: 'invoice.createTitle' })).toBeInTheDocument();

    const select = screen.getByLabelText('invoice.selectCustomer');
    expect(select).toBeInTheDocument();
    expect(
      within(select as HTMLSelectElement).getByRole('option', {
        name: 'invoice.selectCustomerPlaceholder',
      }),
    ).toBeInTheDocument();
    expect(
      within(select as HTMLSelectElement).getByRole('option', { name: /Acme Corp/ }),
    ).toBeInTheDocument();

    expect(screen.getByText('invoice.products')).toBeInTheDocument();
    expect(screen.getByText('invoice.productName')).toBeInTheDocument();
    expect(screen.getByText('invoice.quantity')).toBeInTheDocument();
    expect(screen.getByText('invoice.price')).toBeInTheDocument();
    expect(screen.getByLabelText('invoice.vat')).toBeInTheDocument();
    expect(screen.getByLabelText('invoice.invoiceDate')).toBeInTheDocument();
    expect(screen.getByLabelText('invoice.dueDate')).toBeInTheDocument();
  });

  it('calls handleCustomerChange when selecting a customer', async () => {
    render(<CreateInvoice />);
    await userEvent.selectOptions(screen.getByLabelText('invoice.selectCustomer'), 'c1');
    expect(storeState.fns.handleCustomerChange).toHaveBeenCalledWith('c1');
  });

  it('calls handleAddProduct when add product is clicked', async () => {
    render(<CreateInvoice />);
    await userEvent.click(screen.getByRole('button', { name: 'invoice.addProduct' }));
    expect(storeState.fns.handleAddProduct).toHaveBeenCalled();
  });

  it('calls handleVatChange when VAT input changes', async () => {
    render(<CreateInvoice />);
    await userEvent.type(screen.getByLabelText('invoice.vat'), '20');
    expect(storeState.fns.handleVatChange).toHaveBeenCalled();
  });

  it('submits form and shows success toast', async () => {
    setupWithState({
      invoiceData: {
        customerId: 'c1',
        products: [{ id: 'p1', name: 'Razor', quantity: 1, price: 10 }],
        vat: 19,
        invoiceDate: '2025-09-15',
        dueDate: '2025-09-20',
        netAmount: 100,
        grossAmount: 119,
      },
    });
    (postMock as unknown as jest.Mock).mockResolvedValue?.({
      status: 201,
      data: { id: 'inv1' },
    });
    render(<CreateInvoice />);
    await userEvent.click(screen.getByRole('button', { name: 'invoice.create' }));
    expect(postMock).toHaveBeenCalled();
    expect(toastMock.success).toHaveBeenCalledWith('invoice.createSuccess');
  });

  it('shows error toast when customer is not selected', async () => {
    setupWithState({
      invoiceData: {
        customerId: '',
        products: [{ id: 'p1', name: 'Razor', quantity: 1, price: 10 }],
        vat: 19,
        invoiceDate: '2025-09-15',
        dueDate: '2025-09-20',
        netAmount: 100,
        grossAmount: 119,
      },
    });
    render(<CreateInvoice />);
    await userEvent.click(screen.getByRole('button', { name: 'invoice.create' }));
    expect(toastMock.error).toHaveBeenCalledWith('invoice.fillAllFields');
  });

  it('shows error toast when product name is empty', async () => {
    setupWithState({
      invoiceData: {
        customerId: 'c1',
        products: [{ id: 'p1', name: '', quantity: 1, price: 10 }],
        vat: 19,
        invoiceDate: '2025-09-15',
        dueDate: '2025-09-20',
        netAmount: 100,
        grossAmount: 119,
      },
    });
    render(<CreateInvoice />);
    await userEvent.click(screen.getByRole('button', { name: 'invoice.create' }));
    expect(toastMock.error).toHaveBeenCalledWith('invoice.fillAllFields');
  });

  it('shows error toast when API call fails', async () => {
    setupWithState({
      invoiceData: {
        customerId: 'c1',
        products: [{ id: 'p1', name: 'Razor', quantity: 1, price: 10 }],
        vat: 19,
        invoiceDate: '2025-09-15',
        dueDate: '2025-09-20',
        netAmount: 100,
        grossAmount: 119,
      },
    });
    (postMock as unknown as jest.Mock).mockRejectedValue?.(new Error('API Error'));
    render(<CreateInvoice />);
    await userEvent.click(screen.getByRole('button', { name: 'invoice.create' }));
    expect(toastMock.error).toHaveBeenCalledWith('invoice.createError');
  });
});
