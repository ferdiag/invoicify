import React from "react";

type InputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
};

const Input = (props: InputProps) => {
  return (
    <input
      type="text"
      placeholder={props.placeholder}
      id={props.id}
      value={props.value}
      onChange={props.onChange}
      className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  );
};

export default Input;
