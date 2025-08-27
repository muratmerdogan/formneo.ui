import React from "react";

type Props = {
    label: string;
    name: string;
    register: any;
    error?: string;
    placeholder?: string;
    step?: number | string;
};

export default function NumberInput({ label, name, register, error, placeholder, step = 1 }: Props): JSX.Element {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input type="number" step={step} {...register(name, { valueAsNumber: true })} className="w-full h-10 px-3 rounded-md border" placeholder={placeholder} />
            {error ? <div className="text-xs text-red-600 mt-1">{error}</div> : null}
        </div>
    );
}


