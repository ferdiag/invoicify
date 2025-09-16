import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { toast } from 'react-toastify';
import { useUserStore } from '../../../store/userStore';
import type { Customer, ProductWithId } from '../../../store/types';
import { toApi } from '../../../lib/toApi';
import { PATHS } from '../../../../../shared/paths';
import { api } from '../../../lib/api';

const CreateInvoice: React.FC = () => {
  const {
    user,
    invoiceData,
    handleAddProduct,
    handleRemoveProduct,
    handleProductChange,
    handleVatChange,
    handleDateChange,
    handleCustomerChange,
    handleCalculateTaxAndPrice,
    handlePriceChange,
    handleQuantityChange,
  } = useUserStore();
  const { t } = useTranslation();

  useEffect(() => {
    handleCalculateTaxAndPrice();
  }, [handleCalculateTaxAndPrice, invoiceData.products, invoiceData.vat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const customerName = user?.customers.find(
      (cust: Customer) => cust.id === invoiceData.customerId,
    )?.name;

    const path = toApi(PATHS.INVOICES.ROOT);

    const cleanedProducts = invoiceData.products.map((p) => ({ ...p, name: p.name.trim() }));

    const payload = {
      ...invoiceData,
      userId: user?.id,
      name: customerName,
      products: cleanedProducts,
    };
    let isFieldEmpty = false;

    isFieldEmpty = cleanedProducts.some(
      (p) => !p.name || Number(p.quantity) <= 0 || Number(p.price) <= 0,
    );

    Object.entries(payload).forEach(([_, value]) => {
      if (value === '' || value === null || value === undefined) {
        console.log('Empty field found:', _);
        isFieldEmpty = true;
        return;
      }
    });
    if (isFieldEmpty) {
      toast.error(t('invoice.fillAllFields'));
      return;
    }
    try {
      const response: { status: number; data: { id: string } } = await api.post(path, payload);
      if ([200, 201].includes(response.status)) {
        toast.success(t('invoice.createSuccess'));
        window.open(`http://localhost:3000/invoices/${response.data.id}/pdf`, '_blank', 'noopener');
      }
    } catch {
      toast.error(t('invoice.createError'));
    }
  };
  return (
    <div>
      <h1>{t('invoice.createTitle')}</h1>
      <form onSubmit={(e) => void handleSubmit(e)}>
        <label htmlFor="customer" className="block text-sm text-gray-300 mb-1">
          {t('invoice.selectCustomer')}
        </label>
        <select
          id="customer"
          value={invoiceData.customerId}
          onChange={(e) => handleCustomerChange(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
        >
          <option value="">{t('invoice.selectCustomerPlaceholder')}</option>
          {user?.customers.map((customer: Customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} ({customer.contact})
            </option>
          ))}
        </select>

        <div className="mt-4">
          <label className="block text-sm text-gray-300 mb-1">{t('invoice.products')}</label>
          <table className="w-full text-left mb-2">
            <thead>
              <tr>
                <th className="px-2 py-1">{t('invoice.productName')}</th>
                <th className="px-2 py-1 text-center">{t('invoice.quantity')}</th>
                <th className="px-2 py-1 text-center">{t('invoice.price')}</th>
                <th className="px-2 py-1"></th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.products.map((product: ProductWithId) => (
                <tr key={product.id}>
                  <td className="px-2 py-1">
                    <input
                      type="text"
                      placeholder={t('invoice.productName')}
                      value={product.name}
                      name="name"
                      onChange={(e) => {
                        handleProductChange({
                          id: product.id,
                          field: e.target.name,
                          value: e.target.value,
                        });
                      }}
                      className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-full"
                    />
                  </td>
                  <td className="px-2 py-1 text-center">
                    <input
                      type="number"
                      min={1}
                      placeholder={t('invoice.quantity')}
                      name="quantity"
                      value={product.quantity}
                      onChange={(e) =>
                        handleQuantityChange({
                          id: product.id,
                          field: e.target.name,
                          value: e.target.value,
                        })
                      }
                      className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-20 text-center"
                    />
                  </td>
                  <td className="px-2 py-1 text-center">
                    <input
                      type="text"
                      inputMode="decimal"
                      name="price"
                      defaultValue={product.price}
                      onBlur={(e) => {
                        const newValue = handlePriceChange({
                          id: product.id,
                          field: e.target.name,
                          value: e.target.value,
                        });
                        e.target.value = newValue;
                      }}
                      className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-24 text-center"
                    />
                  </td>
                  <td className="px-2 py-1 text-center">
                    {invoiceData.products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(product.id)}
                        className="bg-red-600 text-white px-2 rounded"
                      >
                        &minus;
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={() => handleAddProduct()}
            className="bg-blue-600 text-white px-4 py-1 rounded mt-2"
          >
            {t('invoice.addProduct')}
          </button>
        </div>

        <div className="mt-4">
          <label htmlFor="vat">{t('invoice.vat')}</label>
          <input
            type="number"
            id="vat"
            min={0}
            max={100}
            value={invoiceData.vat}
            onChange={(e) => handleVatChange(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-full"
          />
        </div>

        <div className="mt-4 flex gap-4">
          <div className="flex-1">
            <label htmlFor="invoiceDate">{t('invoice.invoiceDate')}</label>
            <input
              type="date"
              id="invoiceDate"
              value={invoiceData.invoiceDate}
              onChange={(e) => handleDateChange('invoiceDate', e.target.value)}
              className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-full"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="dueDate">{t('invoice.dueDate')}</label>
            <input
              type="date"
              id="dueDate"
              value={invoiceData.dueDate}
              onChange={(e) => handleDateChange('dueDate', e.target.value)}
              className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-full"
            />
          </div>
        </div>

        <div className="mt-4">
          <label>{t('invoice.netAmount')}</label>
          <div className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-full">
            {invoiceData.netAmount.toFixed(2)}
          </div>
        </div>
        <div className="mt-2">
          <label>{t('invoice.grossAmount')}</label>
          <div className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-full">
            {invoiceData.grossAmount.toFixed(2)}
          </div>
        </div>
        <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
          {t('invoice.create')}
        </button>
      </form>
    </div>
  );
};

export default CreateInvoice;
