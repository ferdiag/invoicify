import React, { useState } from "react";
import DynamicForm from "../components/DynamicForm";
import { useTranslation } from "react-i18next";
import { createFormData } from "../factories/customerFormData";
import { useUserStore, type User } from "../store/userStore";
import { api } from "../lib/apil";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddCompanyData = () => {
  const { user, setUser } = useUserStore();
  const [newUser, setNewUser] = useState<User | null>(user);
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!user) {
    return <div>{t("add-company-data.no-user")}</div>;
  }

  const formData = createFormData(user, t);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewUser({ ...user, [id]: value });
  };
  const handleUpdateCompanyData = async () => {
    if (newUser) {
      const response = await api.put("/api/user", newUser);
      if (response.status === 201 || response.status === 200) {
        setUser({ ...user, ...newUser });
        navigate("/dashboard");
        toast.success(t("addCompanyData.Success"));
      }
    }
  };
  return (
    <DynamicForm
      title={t("addCompanyData.title")}
      fields={formData}
      onChange={handleChange}
      onSubmit={handleUpdateCompanyData}
      submitLabel={t("buttons.save")}
    />
  );
};

export default AddCompanyData;
