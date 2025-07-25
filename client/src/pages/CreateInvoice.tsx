import React, { useState } from "react";
import { useUserStore, type Customer } from "../store/userStore";
import { useTranslation } from "react-i18next";

type Product = {
  name: string;
  quantity: number;
  price: number;
};

const CreateInvoice: React.FC = () => {
  const { user } = useUserStore();
  const { t } = useTranslation();
  const [invoiceData, setInvoiceData] = useState({
    customer: "",
    products: [{ name: "", quantity: 1, price: 0 }],
    vat: 19,
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 14);
      return d.toISOString().split("T")[0];
    })(),
  });

  const handleCustomerChange = (value: string) => {
    setInvoiceData((prev) => ({ ...prev, customer: value }));
  };

  const handleProductChange = (
    id: number,
    field: string,
    value: string | number
  ) => {
    setInvoiceData((prev) => ({
      ...prev,
      products: prev.products.map((prod, i) =>
        i === id
          ? {
              ...prod,
              [field]:
                field === "quantity" || field === "price"
                  ? Number(value)
                  : value,
            }
          : prod
      ),
    }));
  };

  const handleAddProduct = () => {
    setInvoiceData((prev) => ({
      ...prev,
      products: [...prev.products, { name: "", quantity: 1, price: 0 }],
    }));
  };

  const handleRemoveProduct = (id: number) => {
    setInvoiceData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== id),
    }));
  };

  const handleVatChange = (value: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      vat: Number(value),
    }));
  };

  const handleDateChange = (
    field: "invoiceDate" | "dueDate",
    value: string
  ) => {
    setInvoiceData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const netAmount =
    Math.round(
      invoiceData.products.reduce((sum, p) => sum + p.quantity * p.price, 0) *
        100
    ) / 100;

  const grossAmount =
    Math.round(netAmount * (1 + invoiceData.vat / 100) * 100) / 100;

  return (
    <div>
      <h1>{t("invoice.createTitle")}</h1>
      <form>
        <label htmlFor="customer" className="block text-sm text-gray-300 mb-1">
          {t("invoice.selectCustomer")}
        </label>
        <select
          id="customer"
          value={invoiceData.customer}
          onChange={(e) => handleCustomerChange(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
        >
          <option value="">{t("invoice.selectCustomerPlaceholder")}</option>
          {user?.customers.map((customer: Customer, id: number) => (
            <option key={id} value={customer.name}>
              {customer.name} ({customer.contact})
            </option>
          ))}
        </select>

        <div className="mt-4">
          <label className="block text-sm text-gray-300 mb-1">
            {t("invoice.products")}
          </label>
          <table className="w-full text-left mb-2">
            <thead>
              <tr>
                <th className="px-2 py-1">{t("invoice.productName")}</th>
                <th className="px-2 py-1 text-center">
                  {t("invoice.quantity")}
                </th>
                <th className="px-2 py-1 text-center">{t("invoice.price")}</th>
                <th className="px-2 py-1"></th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.products.map((product: Product, id: number) => (
                <tr key={id}>
                  <td className="px-2 py-1">
                    <input
                      type="text"
                      placeholder={t("invoice.productName")}
                      value={product.name}
                      onChange={(e) =>
                        handleProductChange(id, "name", e.target.value)
                      }
                      className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-full"
                    />
                  </td>
                  <td className="px-2 py-1 text-center">
                    <input
                      type="number"
                      min={1}
                      placeholder={t("invoice.quantity")}
                      value={product.quantity}
                      onChange={(e) =>
                        handleProductChange(id, "quantity", e.target.value)
                      }
                      className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-20 text-center"
                    />
                  </td>
                  <td className="px-2 py-1 text-center">
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder={t("invoice.price")}
                      value={product.price}
                      onChange={(e) =>
                        handleProductChange(id, "price", e.target.value)
                      }
                      className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-24 text-center"
                    />
                  </td>
                  <td className="px-2 py-1 text-center">
                    {invoiceData.products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(id)}
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
            onClick={handleAddProduct}
            className="bg-blue-600 text-white px-4 py-1 rounded mt-2"
          >
            {t("invoice.addProduct")}
          </button>
        </div>

        <div className="mt-4">
          <label htmlFor="vat">{t("invoice.vat")}</label>
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
            <label htmlFor="invoiceDate">{t("invoice.invoiceDate")}</label>
            <input
              type="date"
              id="invoiceDate"
              value={invoiceData.invoiceDate}
              onChange={(e) => handleDateChange("invoiceDate", e.target.value)}
              className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-full"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="dueDate">{t("invoice.dueDate")}</label>
            <input
              type="date"
              id="dueDate"
              value={invoiceData.dueDate}
              onChange={(e) => handleDateChange("dueDate", e.target.value)}
              className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-full"
            />
          </div>
        </div>

        <div className="mt-4">
          <label>{t("invoice.netAmount")}</label>
          <div className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-full">
            {netAmount.toFixed(2)}
          </div>
        </div>
        <div className="mt-2">
          <label>{t("invoice.grossAmount")}</label>
          <div className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-full">
            {grossAmount.toFixed(2)}
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          {t("invoice.create")}
        </button>
      </form>
    </div>
  );
};

export default CreateInvoice;
