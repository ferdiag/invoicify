import type { Invoice } from "../store/types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const DisplayInvoices = ({ invoices }: { invoices: Invoice[] }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  if (!invoices || invoices.length === 0) {
    return (
      <p className="text-gray-400 text-center py-6">
        {t("displayInvoice.noInvoices")}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full text-sm text-left text-gray-200 bg-gray-800 rounded shadow-md">
        <thead className="bg-gray-700 text-gray-300 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-3">{t("displayInvoice.invoiceDate")}</th>
            <th className="px-6 py-3">{t("displayInvoice.name")}</th>
            <th className="px-6 py-3">{t("displayInvoice.grossAmount")}</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr
              onClick={() => {
                navigate(`/invoices/${invoice.id}`);
              }}
              key={invoice.id}
              className="hover:bg-gray-700 transition-colors duration-200"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                {invoice.invoiceDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {invoice.name || t("displayInvoice.unnamed")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {parseFloat(invoice.grossAmount).toFixed(2)} €
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
