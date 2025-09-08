import React from "react";
import { useUserStore } from "../../store/userStore";

const InvoicePDF = () => {
  const { invoiceData } = useUserStore();
  console.log(invoiceData);
  return <div>InvoicePDF</div>;
};

export default InvoicePDF;
