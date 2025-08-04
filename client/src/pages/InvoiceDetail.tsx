import React from "react";
import { useUserStore } from "../store/userStore";
import { useParams } from "react-router-dom";
import { t } from "i18next";

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUserStore();
  const invoice = user?.invoices.find((inv) => inv.id === id);

  if (!invoice) {
    return (
      <div className="text-center text-red-500 mt-10">
        {t("invoice.notFound") || "Rechnung nicht gefunden"}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">{invoice.name}</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-400">
            {t("invoice.invoiceDate") || "Rechnungsdatum"}
          </p>
          <p>{invoice.invoiceDate}</p>
        </div>
        <div>
          <p className="text-gray-400">{t("invoice.dueDate") || "Fällig am"}</p>
          <p>{invoice.dueDate}</p>
        </div>
        <div>
          <p className="text-gray-400">
            {t("invoice.grossAmount") || "Bruttobetrag"}
          </p>
          <p>{parseFloat(invoice.grossAmount).toFixed(2)} €</p>
        </div>
        <div>
          <p className="text-gray-400">
            {t("invoice.netAmount") || "Nettobetrag"}
          </p>
          <p>{parseFloat(invoice.netAmount).toFixed(2)} €</p>
        </div>
        <div>
          <p className="text-gray-400">{t("invoice.vat") || "Umsatzsteuer"}</p>
          <p>{invoice.vat} %</p>
        </div>
        <div>
          <p className="text-gray-400">
            {t("invoice.customerId") || "Kunde-ID"}
          </p>
          <p className="truncate">{invoice.customerId}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">
        {t("invoice.products") || "Produkte"}
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-700 rounded">
          <thead className="text-sm uppercase bg-gray-600 text-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">Produkt</th>
              <th className="px-4 py-2 text-left">Anzahl</th>
              <th className="px-4 py-2 text-left">Einzelpreis</th>
              <th className="px-4 py-2 text-left">Gesamt</th>
            </tr>
          </thead>
          <tbody>
            {invoice.products.map((product, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-600 hover:bg-gray-600"
              >
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.quantity}</td>
                {Number(product.price).toFixed(2)} €{" "}
                <td className="px-4 py-2">
                  {(Number(product.price) * product.quantity).toFixed(2)} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceDetail;
