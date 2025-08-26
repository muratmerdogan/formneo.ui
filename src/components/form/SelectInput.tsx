import React from "react";

type Option = { value: string; label: string };

type Props = {
    label: string;
    name: string;
    register: any;
    error?: string;
    options: Option[];
    disabled?: boolean;
};

export default function SelectInput({ label, name, register, error, options, disabled }: Props): JSX.Element {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <select {...register(name)} name={name} disabled={disabled} className="w-full h-10 px-3 rounded-md border">
                {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
            {error && <div className="text-xs text-rose-600 mt-1">{error}</div>}
        </div>
    );
}


