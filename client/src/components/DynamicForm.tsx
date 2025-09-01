import React from "react";
import CTAButton from "./Button/Button";
import Input from "./Input";

type Field = {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
};

type DynamicFormProps<T> = {
  title?: string;
  fields: Field[];
  setState: React.Dispatch<React.SetStateAction<Partial<T>>>;
  onSubmit: () => void;
  submitLabel: string;
};

const DynamicForm = <T,>({
  title,
  fields,
  setState,
  onSubmit,
  submitLabel,
}: DynamicFormProps<T>) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    console.log(id, value);
    setState((prevState) => {
      return { ...prevState, [id]: value };
    });
  };
  return (
    <div className="flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
        {title && (
          <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>
        )}
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="block mb-1 text-sm text-gray-300"
              >
                {field.label}
              </label>
              <Input
                id={field.id}
                placeholder={field.placeholder}
                value={field.value}
                onChange={onChange}
              />
            </div>
          ))}
        </div>
        <div className="mt-6">
          <CTAButton onClick={onSubmit}>{submitLabel}</CTAButton>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;
