import React, { useState } from "react";
import { api } from "../lib/apil";
import { useUserStore, type Customer } from "../store/userStore";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createFormData } from "../factories/customerFormData";
import DynamicForm from "../components/DynamicForm";

const Addcustomer: React.FC = () => {
  const initCustomer = {
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  };
  const { user, setUser } = useUserStore();
  const [customer, setCustomer] = useState<Customer>(initCustomer);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formData = createFormData(customer, t);

  const handleSaveNewcustomer = async () => {
    if (!user) return;
    const newcustomer = { ...customer, userId: user.id };
    const response = await api.post("/api/customer", newcustomer);
    if (response.status === 201 || response.status === 200) {
      setUser({ ...user, customers: [...user.customers, customer] });
      navigate("/dashboard");
      toast.success(t("addCustomer.addSuccess"));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCustomer((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <DynamicForm
      title={t("dashboard.title")}
      fields={formData}
      onChange={handleChange}
      onSubmit={handleSaveNewcustomer}
      submitLabel={t("buttons.save")}
    />
  );
};

export default Addcustomer;
