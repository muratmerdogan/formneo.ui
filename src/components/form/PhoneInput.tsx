import React from "react";

type Props = {
    label: string;
    name: string;
    register: any;
    error?: string;
    placeholder?: string;
};

export default function PhoneInput({ label, name, register, error, placeholder }: Props): JSX.Element {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input {...register(name)} className="w-full h-10 px-3 rounded-md border" placeholder={placeholder || "+90 ..."} inputMode="tel" />
            {error ? <div className="text-xs text-red-600 mt-1">{error}</div> : null}
        </div>
    );
}


