'use client';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { Input as NInput } from '@nextui-org/react';
import React from 'react';

const Input = ({ type = 'text', label, variant, placeholder, endContent, ref, ...props }) => {
    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <NInput
            label={label}
            variant={variant}
            placeholder={placeholder}
            endContent={<div className="-ml-2 mr-1">{endContent}</div>}
            {...(type === 'password' && {
                endContent: (
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                        {isVisible ? (
                            <EyeSlashIcon className="h-5 w-5 font-bold text-default-300 -ml-2 mr-1" />
                        ) : (
                            <EyeIcon className="h-5 w-5 font-bold text-default-300 -ml-2 mr-1" />
                        )}
                    </button>
                )
            })}
            {...(type === 'password' ? { type: isVisible ? 'text' : 'password' } : { type })}
            className="max-w-xs"
            ref={ref}
            baseRef={ref}
            {...props}
        />
    );
}
Input.displayName = 'Input';
export default Input;
