import React from "react";
import { useUserStore } from "../store/userStore";
import CTAButton from "../components/Button";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

const CustomersPage: React.FC = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  return (
    <div>
      {user!.customers.map((customer, i) => (
        <div key={i}>
          <div>{customer.name}</div>
          <CTAButton
            onClick={async () => navigate(`/customer/${customer.id!}`)}
          >
            {t("buttons.viewDetails")}
          </CTAButton>
        </div>
      ))}
    </div>
  );
};

export default CustomersPage;
