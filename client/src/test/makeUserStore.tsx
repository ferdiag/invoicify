import { vi } from 'vitest';
import type { InvoiceData, User, UserStoreType } from '../store/types';

export function makeUserStore(overrides?: Partial<UserStoreType>): UserStoreType {
  const baseUser: User = {
    id: 'user-1',
    email: 'u@example.com',
    name: 'Max',
    contact: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    customers: [],
    invoices: [],
    taxNumber: '',
  };

  const baseInvoiceData: InvoiceData = {
    customerId: '',
    products: [],
    vat: 19,
    invoiceDate: '',
    dueDate: '',
    netAmount: 0,
    grossAmount: 0,
  };

  const noop = vi.fn();

  const actions = {
    logout: noop,
    setToken: noop,
    deleteCustomer: noop,
    loginSuccess: noop,
    registerSuccess: noop,
    handleApiError: noop,
    editCompanyDataSuccess: noop,
    updateCustomerSuccess: noop,
    addCustomerSuccess: noop,
    handleAddProduct: noop,
    handleRemoveProduct: noop,
    handleVatChange: noop,
    handleDateChange: noop,
    handleProductChange: noop,
    handleCustomerChange: noop,
    handleCalculateTaxAndPrice: noop,
    handlePriceChange: vi.fn(() => ''), // hat Rückgabewert string
    handleQuantityChange: noop,
  };

  const store: UserStoreType = {
    token: null,
    user: baseUser,
    invoiceData: baseInvoiceData,
    ...actions,
  };
  console.log('makeUserStore called with overrides:', store);
  return { ...store, ...overrides };
}
