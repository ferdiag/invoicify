import React from "react";
import { useUserStore } from "../store/userStore";
import CTAButton from "../components/Button";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

const CustomersPage: React.FC = () => {
  const { user, deleteCustomer } = useUserStore();
  const navigate = useNavigate();

  const handleDeleteCustomer = async (id: string) => {
    const response = await api.delete(`api/customer/${id}`);
    if (response.status === 200) {
      deleteCustomer(id);
    } else {
      console.error("Failed to delete customer");
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <CTAButton onClick={() => navigate("/add-customer")}>
        {t("buttons.toAddCustomer")}
      </CTAButton>
      {user!.customers.map((customer) => (
        <div key={customer.id!} className="flex flex-col gap-2">
          <div className="font-bold">{customer.name}</div>
          <CTAButton
            onClick={async () => navigate(`/customer/${customer.id!}`)}
          >
            {t("buttons.edit")}
          </CTAButton>
          <CTAButton
            onClick={() => handleDeleteCustomer(customer.id!)}
            variant="danger"
          >
            {t("buttons.delete")}
          </CTAButton>
        </div>
      ))}
    </div>
  );
};

export default CustomersPage;
