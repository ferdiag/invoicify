import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useUserStore } from "../store/userStore";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createFormData } from "../factories/createForms";
import DynamicForm from "../components/DynamicForm";
import type { Customer, InitCustomer } from "../store/types";

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, setUser } = useUserStore();

  const [customer, setCustomer] = useState<Partial<InitCustomer>>({
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
    const payload: Customer | undefined = user?.customers.find(
      (cust) => cust.id === id
    );
    if (payload) {
      const { ...updatedCustomer } = payload;
      setCustomer(updatedCustomer);
    }
  }, [user?.customers, id, setCustomer]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const keys: (keyof Customer)[] = [
    "name",
    "email",
    "phone",
    "contact",
    "address",
    "zip",
    "city",
    "country",
  ];

  const formData = createFormData<Customer>(customer, t, keys);
  const handleSaveNewCustomer = async () => {
    if (!user) return;
    const payload = { ...customer, userId: user.id };

    const path = id ? `/api/customer/${id}` : "/api/customer";
    const action = id ? "patch" : "post";

    const response = await api[action](path, payload);

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

  return (
    <DynamicForm
      title={id ? t("CustomerDetail.edit") : t("CustomerDetail.add")}
      fields={formData}
      setState={setCustomer}
      onSubmit={handleSaveNewCustomer}
      submitLabel={t("buttons.save")}
    />
  );
};

export default CustomerDetail;
