import React from "react";

type Props = {
    label: string;
    name: string;
    register: any;
    error?: string;
    placeholder?: string;
    currency?: string;
    step?: number | string;
};

export default function MoneyInput({ label, name, register, error, placeholder, currency = "TRY", step = 0.01 }: Props): JSX.Element {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div className="flex items-center gap-2">
                <input type="number" step={step} {...register(name, { valueAsNumber: true })} className="w-full h-10 px-3 rounded-md border" placeholder={placeholder} />
                <span className="text-xs text-slate-500 min-w-[36px] text-right">{currency}</span>
            </div>
            {error ? <div className="text-xs text-red-600 mt-1">{error}</div> : null}
        </div>
    );
}


