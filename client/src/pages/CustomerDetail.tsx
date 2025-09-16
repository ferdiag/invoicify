import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useUserStore } from '../store/userStore';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { createFormData } from '../factories/createForms';
import DynamicForm from '../components/DynamicForm/DynamicForm';
import type { Customer } from '../store/types';
import { PATHS } from '../../../shared/paths';

const keys: (keyof Customer)[] = [
  'name',
  'email',
  'phone',
  'contact',
  'address',
  'zip',
  'city',
  'country',
];
const defaultCustomer: Customer = {
  id: '',
  name: '',
  contact: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  zip: '',
  country: '',
};
const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, updateCustomerSuccess, addCustomerSuccess } = useUserStore();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer>(defaultCustomer);

  useEffect(() => {
    if (id) {
      const targetCustomer: Customer | undefined = user?.customers.find((cust) => cust.id === id);
      if (targetCustomer) {
        setCustomer({ ...targetCustomer });
      } else {
        void navigate('/customers');
      }
    }
  }, [user?.customers, id, setCustomer, navigate]);
  const { t } = useTranslation();

  const formData = createFormData(customer as unknown as Record<string, unknown>, t, keys);

  const handleSaveNewCustomer = async (): Promise<void> => {
    if (!user) return;
    const payload = { ...customer, userId: user.id };

    const path = id ? PATHS.CUSTOMERS.buildById(id) : PATHS.CUSTOMERS.ROOT;
    const action = id ? 'patch' : 'post';

    const response = await api[action]<{ data?: { id: string } }>(path, payload);
    const newCustomer = {
      ...customer,
      id: (response.data as { id?: string } | undefined)?.id ?? '',
    };
    if ([200, 201].includes(response.status)) {
      if (id) {
        updateCustomerSuccess(customer);
      } else {
        addCustomerSuccess(newCustomer);
      }
      void navigate('/customers');
    }
  };

  return (
    <DynamicForm
      title={id ? t('CustomerDetail.edit') : t('CustomerDetail.add')}
      fields={formData}
      setState={setCustomer}
      onSubmit={() => void handleSaveNewCustomer}
      submitLabel={t('buttons.save')}
    />
  );
};

export default CustomerDetail;
