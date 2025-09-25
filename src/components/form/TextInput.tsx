import React from "react";

type Props = {
    label: string;
    name: string;
    register: any;
    error?: string;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    maxLength?: number;
    helperText?: string;
};

export default function TextInput({ label, name, register, error, placeholder, type = "text", disabled, maxLength, helperText }: Props): JSX.Element {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input 
                {...register(name)} 
                name={name} 
                type={type} 
                disabled={disabled} 
                className={`w-full h-10 px-3 rounded-md border ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`} 
                placeholder={placeholder} 
                maxLength={maxLength} 
            />
            {error && <div className="text-xs text-rose-600 mt-1">{error}</div>}
            {helperText && !error && <div className="text-xs text-gray-500 mt-1">{helperText}</div>}
        </div>
    );
}


