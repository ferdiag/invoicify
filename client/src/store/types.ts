import type { TFunction } from 'i18next';
import type { NavigateFunction } from 'react-router-dom';

export interface ProductBase {
  name: string;
  quantity: number;
  price: number;
}
export type ProductWithId = ProductBase & { id: string };

export interface Customer {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

export type CustomerCreate = Customer & {
  userId: string;
};

export type CustomerUpdate = Partial<Customer> & {
  userId: string;
};

export type CreateCustomerResponse = { id: string } | Customer;
export type UpdateCustomerResponse = Customer;

export interface Invoice {
  id: string;
  name: string;
  customerId: string;
  userId: string;
  invoiceDate: string;
  dueDate: string;
  vat: number;
  netAmount: string;
  grossAmount: string;
  products: ProductWithId[];
}
export interface Field {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
}
export interface FormField {
  id: string;
  label: string;
  placeholder: string;
  value: string;
}
export interface DynamicFormProps<T extends Record<string, unknown>> {
  title?: string;
  fields: Field[];
  setState: React.Dispatch<React.SetStateAction<T>>;
  onSubmit: () => void;
  submitLabel: string;
}
export interface AuthData {
  email: string;
  password: string;
}
export interface User {
  id: string;
  email: string;
  name: string;
  contact: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  customers: Customer[];
  invoices: Invoice[];
  taxNumber: string;
}

export interface InvoiceData {
  customerId: string;
  products: { name: string; quantity: number; price: number; id: string }[];
  vat: number;
  invoiceDate: string;
  dueDate: string;
  netAmount: number;
  grossAmount: number;
}

export interface State {
  token: string | null;
  user: User | null;
  invoiceData: InvoiceData;
}

export interface ProductChange {
  id: string;
  field: string;
  value: string;
}

export interface UpdateProducts {
  id: string;
  field: string;
  value: string | number;
  set: (partial: Partial<State>) => void;
  invoice: InvoiceData;
}

export interface Actions {
  logout: () => void;
  setToken: (token: string) => void;
  deleteCustomer: (id: string) => void;
  loginSuccess: (
    data: { user: User; token: string },
    message: string,
    navigate: NavigateFunction,
  ) => void;
  registerSuccess: (
    reset: () => void,
    message: string,
    setMode: React.Dispatch<React.SetStateAction<'login' | 'register'>>,
  ) => void;

  handleApiError: (error: unknown, t: TFunction<'translation', undefined>) => void;

  editCompanyDataSuccess: (
    newUser: Partial<User>,
    navigate: NavigateFunction,
    t: TFunction<'translation', undefined>,
  ) => void;

  updateCustomerSuccess: (data: Customer) => void;
  addCustomerSuccess: (data: Customer) => void;
  handleAddProduct: () => void;
  handleRemoveProduct: (id: string) => void;
  handleVatChange: (value: string) => void;
  handleDateChange: (field: 'invoiceDate' | 'dueDate', value: string) => void;

  handleProductChange: ({ id, field, value }: ProductChange) => void;
  handleCustomerChange: (value: string) => void;
  handleCalculateTaxAndPrice: () => void;
  handlePriceChange: ({ id, field, value }: ProductChange) => string;
  handleQuantityChange: ({ id, field, value }: ProductChange) => void;
}
