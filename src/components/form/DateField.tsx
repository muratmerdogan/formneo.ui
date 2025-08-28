import React from "react";

type Props = {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
};

export default function DateField({ label, value, onChange, disabled, className, placeholder }: Props): JSX.Element {
    return (
        <div className={className}>
            {label && <label className="block text-sm font-medium mb-1">{label}</label>}
            <input
                type="date"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                placeholder={placeholder}
                className="w-full h-9 px-3 rounded-md border"
            />
        </div>
    );
}



