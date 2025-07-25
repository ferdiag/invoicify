import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useUserStore } from "../store/userStore";
import type { Customer, InitCustomer } from "../store/userStore";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createFormData } from "../factories/customerFormData";
import DynamicForm from "../components/DynamicForm";

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, setUser } = useUserStore();

  const [customer, setCustomer] = useState<InitCustomer>({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });
  useEffect(() => {
    const targetCustomer: Customer | undefined = user?.customers.find(
      (cust) => cust.id === id
    );
    if (targetCustomer) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...updatedCustomer } = targetCustomer;
      setCustomer(updatedCustomer);
    }
  }, [user?.customers, id, setCustomer]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formData = createFormData(customer, t);

  const handleSaveNewcustomer = async () => {
    if (!user) return;
    const targetCustomer = { ...customer, userId: user.id };
    let response;
    if (id) {
      console.log("Updating customer with ID:", id);
      response = await api.patch(`/api/customer/${id}`, targetCustomer);
    } else {
      response = await api.post("/api/customer", targetCustomer);
    }

    if ([200, 201].includes(response.status)) {
      if (id) {
        setUser({
          ...user,
          customers: user.customers.map((cust) =>
            cust.id === id ? { ...cust, ...response.data } : cust
          ),
        });
        toast.success(t("CustomerDetail.edit"));
      } else {
        setUser({ ...user, customers: [...user.customers, response.data] });
        toast.success(t("addCustomer.addSuccess"));
      }
      navigate("/customers");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCustomer((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <DynamicForm
      title={id ? t("CustomerDetail.edit") : t("CustomerDetail.add")}
      fields={formData}
      onChange={handleChange}
      onSubmit={handleSaveNewcustomer}
      submitLabel={t("buttons.save")}
    />
  );
};

export default CustomerDetail;
