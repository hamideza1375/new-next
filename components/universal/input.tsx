'use client';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { Input as NInput, InputProps as NInputProps } from '@nextui-org/react';
import React from 'react';

interface InputProps extends Omit<NInputProps, 'type'> {
   type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
   label?: string;
   variant?: 'bordered' | 'flat' | 'faded' | 'underlined';
   placeholder?: string;
   endContent?: React.ReactNode;
}

const Input = ({ type = 'text', label, variant = 'bordered', placeholder, endContent, ...props }: InputProps) => {
   const [isVisible, setIsVisible] = React.useState(false);

   const toggleVisibility = () => setIsVisible(!isVisible);

   const renderPasswordToggle = () => (
      <button
         className="focus:outline-none"
         type="button"
         onClick={toggleVisibility}
         aria-label={isVisible ? 'Hide password' : 'Show password'}>
         {isVisible ? (
            <EyeSlashIcon className="h-5 w-5 font-bold text-default-300 -ml-2 mr-1" />
         ) : (
            <EyeIcon className="h-5 w-5 font-bold text-default-300 -ml-2 mr-1" />
         )}
      </button>
   );

   return (
      <NInput
         label={label}
         variant={variant}
         placeholder={placeholder}
         endContent={
            <div className="-ml-2 mr-1">{type === 'password' ? renderPasswordToggle() : endContent}</div>
         }
         type={type === 'password' ? (isVisible ? 'text' : 'password') : type}
         className="max-w-xs"
         {...props}
      />
   );
};

Input.displayName = 'Input';
export default Input;
