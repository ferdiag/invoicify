// actions.ts
import { toast } from 'react-toastify';
import { api } from '../lib/api';
import axios from 'axios';
import type { State, Actions, Customer, UpdateProducts, ProductWithId } from './types';
import { t } from 'i18next';

export const actions = (set: (partial: Partial<State>) => void, get: () => State): Actions => ({
  logout: () => set({ user: null, token: null }),

  deleteCustomer: (id) => {
    const { user } = get();
    if (!user) return;
    set({
      user: {
        ...user,
        customers: user.customers.filter((cust) => cust.id !== id),
      },
    });
  },

  loginSuccess: (data, message, navigate): void => {
    toast.success(message, { position: 'bottom-center' });
    set({ user: data.user, token: data.token });
    if (data.token) api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
    else delete api.defaults.headers.common.Authorization;
    void navigate('/dashboard');
  },

  registerSuccess: (reset, message, setMode) => {
    reset();
    toast.success(message);
    setMode('login');
  },
  handleApiError: (error, t) => {
    let msg = undefined;

    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data as { message?: string } | undefined;
      msg = responseData?.message ?? t('auth.errors.defaultError');
    }
    toast.error(msg, { position: 'bottom-center' });
  },

  editCompanyDataSuccess: (newUser, navigate, t) => {
    const { user } = get();
    if (!user) return;
    set({ user: { ...user, ...newUser } });
    void navigate('/dashboard');
    toast.success(t('addCompanyData.Success'));
  },
  updateCustomerSuccess: (data: Customer) => {
    const { user } = get();
    if (user) {
      set({
        user: {
          ...user,
          customers: user.customers.map((cust) =>
            cust.id === data.id ? { ...cust, ...data } : cust,
          ),
        },
      });
      toast.success(t('CustomerDetail.edit'));
    }
  },
  addCustomerSuccess: (data: Customer) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, customers: [...user.customers, data] } });
      toast.success(t('addCustomer.addSuccess'));
    }
  },
  handleAddProduct: () => {
    const defaultProduct = {
      id: crypto.randomUUID().toString(),
      name: '',
      quantity: 1,
      price: 0,
    };
    const { invoiceData } = get();
    set({
      invoiceData: {
        ...invoiceData,
        products: [...invoiceData.products, defaultProduct],
      },
    });
  },
  handleRemoveProduct: (id) => {
    const { invoiceData } = get();
    set({
      invoiceData: {
        ...invoiceData,
        products: invoiceData.products.filter((prod) => prod.id !== id),
      },
    });
  },

  handleVatChange: (value) => {
    const { invoiceData } = get();

    set({
      invoiceData: {
        ...invoiceData,
        vat: Number(value),
      },
    });
  },

  handleDateChange: (field, value) => {
    const { invoiceData } = get();
    set({
      invoiceData: {
        ...invoiceData,
        [field]: value,
      },
    });
  },
  handlePriceChange: ({ id, field, value }) => {
    const { invoiceData } = get();
    const sanitized = value
      .replace(',', '.')
      .replace(/[^0-9.]/g, '')
      .replace(/^(\d*\.\d{0,2}).*$/, '$1');
    const parsed = parseFloat(sanitized) || 0.0;
    updateProducts({ id, field, value, set, invoice: invoiceData });

    value = sanitized;

    return parsed.toFixed(2).toString();
  },
  handleProductChange: ({ id, field, value }) => {
    const { invoiceData } = get();
    updateProducts({ id, field, value, set, invoice: invoiceData });
  },
  handleQuantityChange: ({ id, field, value }) => {
    const { invoiceData } = get();
    const updated = Number(parseInt(value, 10));
    updateProducts({ id, field, set, value: updated, invoice: invoiceData });
  },
  handleCustomerChange: (value) => {
    const { invoiceData } = get();
    set({ invoiceData: { ...invoiceData, customerId: value } });
  },
  handleCalculateTaxAndPrice: () => {
    const { invoiceData } = get();

    const round2 = (n: number) => Math.round(n * 100) / 100;

    const netAmount = round2(
      invoiceData.products.reduce((sum, p) => sum + p.quantity * p.price, 0),
    );
    const grossAmount = round2(netAmount * (1 + invoiceData.vat / 100));

    set({ invoiceData: { ...invoiceData, netAmount, grossAmount } });
  },
});

const updateProducts = ({ id, field, value, set, invoice }: UpdateProducts) => {
  const updatedProducts = invoice.products.map((prod: ProductWithId) =>
    prod.id === id ? { ...prod, [field]: value } : prod,
  );
  set({
    invoiceData: {
      ...invoice,
      products: updatedProducts,
    },
  });
};
