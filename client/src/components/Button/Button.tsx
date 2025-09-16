// components/Button.tsx
import type { ReactNode } from 'react';
import type { ButtonHTMLAttributes } from 'react';

type CTAButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'danger';
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const CTAButton = ({ children, variant = 'primary', className = '', ...rest }: CTAButtonProps) => {
  const base = 'px-4 py-2 rounded font-semibold transition duration-200';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    ghost: 'bg-gray-800 hover:bg-gray-700 text-gray-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default CTAButton;
