import React from "react";
import { useUserStore } from "../../store/userStore";
import CTAButton from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { DisplayInvoices } from "../../components/DisplayInvoices";

const Invoices = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();

  return (
    <div>
      {" "}
      <CTAButton onClick={() => navigate("/create-invoice")}>
        {t("buttons.createInvoice")}
      </CTAButton>
      <DisplayInvoices invoices={user!.invoices} />{" "}
    </div>
  );
};

export default Invoices;
