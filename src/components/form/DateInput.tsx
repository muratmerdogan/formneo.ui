import React from "react";

type Props = {
    label: string;
    name: string;
    register: any;
    error?: string;
    disabled?: boolean;
};

export default function DateInput({ label, name, register, error, disabled }: Props): JSX.Element {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input {...register(name)} name={name} type="date" disabled={disabled} className="w-full h-10 px-3 rounded-md border" />
            {error && <div className="text-xs text-rose-600 mt-1">{error}</div>}
        </div>
    );
}


