import { useUserStore } from "../store/userStore";
import CTAButton from "../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type React from "react";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center bg-gray-900 text-white w-full h-full ">
      <div className="max-w-4xl w-full flex flex-col justify-center items-center p-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p>Welcome, {user ? user.email : "Guest"}!</p>
        <CTAButton onClick={() => navigate("/customers")}>
          {t("buttons.toCustomers")}
        </CTAButton>
        <CTAButton onClick={() => navigate("/add-data")}>
          {t("buttons.toCompanyData")}
        </CTAButton>
        <CTAButton onClick={() => navigate("/invoices")}>
          {t("buttons.toInvoices")}
        </CTAButton>
      </div>
    </div>
  );
};

export default Dashboard;
