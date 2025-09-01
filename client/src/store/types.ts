import type { TFunction } from "i18next";
import type { NavigateFunction } from "react-router-dom";

export type Product = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};
export type Invoice = {
  id: string;
  name: string;
  customerId: string;
  userId: string;
  invoiceDate: string;
  dueDate: string;
  vat: number;
  netAmount: string;
  grossAmount: string;
  products: Product[];
};
export type User = {
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
};
export type DefaultCustomer = {
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
};
export type Customer = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
};
export type ProductChange = {
  id: string;
  field: string;
  value: string;
};
export type InvoiceData = {
  customerId: string;
  products: { name: string; quantity: number; price: number; id: string }[];
  vat: number;
  invoiceDate: string;
  dueDate: string;
  netAmount: number;
  grossAmount: number;
};
export type State = {
  token: string | null;
  user: User | null;
  invoiceData: InvoiceData;
};
export type UpdateProducts = {
  id: string;
  field: string;
  value: string | number;
  set: (partial: Partial<State>) => void;
  invoice: InvoiceData;
};
export type Actions = {
  logout: () => void;
  setToken: (token: string) => void;
  deleteCustomer: (id: string) => void;
  loginSuccess: (
    data: { user: User; token: string },
    message: string,
    navigate: NavigateFunction
  ) => void;
  registerSuccess: (
    reset: () => void,
    message: string,
    setMode: React.Dispatch<React.SetStateAction<"login" | "register">>
  ) => void;
  handleApiError: (
    error: unknown,
    t: TFunction<"translation", undefined>
  ) => void;
  editCompanyDataSuccess: (
    newUser: Partial<User>,
    navigate: NavigateFunction,
    t: TFunction<"translation", undefined>
  ) => void;
  updateCustomerSuccess: (data: Customer) => void;
  addCustomerSuccess: (data: Customer) => void;
  handleAddProduct: () => void;
  handleRemoveProduct: (id: string) => void;
  handleVatChange: (value: string) => void;
  handleDateChange: (field: "invoiceDate" | "dueDate", value: string) => void;

  handleProductChange: ({ id, field, value }: ProductChange) => void;
  handleCustomerChange: (value: string) => void;
  handleCalculateTaxAndPrice: () => void;
  handlePriceChange: ({ id, field, value }: ProductChange) => string;
  handleQuantityChange: ({ id, field, value }: ProductChange) => void;
};
