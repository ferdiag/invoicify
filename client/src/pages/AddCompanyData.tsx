import React, { useState } from "react";
import DynamicForm from "../components/DynamicForm";
import { useTranslation } from "react-i18next";
import { createFormData } from "../factories/customerFormData";
import { useUserStore, type User } from "../store/userStore";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddCompanyData: React.FC = () => {
  const { user, setUser } = useUserStore();
  const [newUser, setNewUser] = useState<Partial<User>>(user!);
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!user) {
    return <div>{t("addCompanyData.noUser")}</div>;
  }

  const formData = createFormData(user, t);

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
      setState={setNewUser}
      onSubmit={handleUpdateCompanyData}
      submitLabel={t("buttons.save")}
    />
  );
};

export default AddCompanyData;
