import React, { useState } from "react";

type Props = {
    label: string;
    values: string[];
    onChange: (emails: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailsInput({ label, values, onChange, placeholder, disabled }: Props): JSX.Element {
    const [input, setInput] = useState("");
    const [error, setError] = useState<string | null>(null);

    const addEmail = () => {
        const value = input.trim();
        if (!value) return;
        if (!emailRegex.test(value)) { setError("Geçersiz e-posta"); return; }
        if (values.includes(value)) { setError("Zaten ekli"); return; }
        onChange([...values, value]);
        setInput("");
        setError(null);
    };

    const removeEmail = (v: string) => {
        onChange(values.filter(e => e !== v));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addEmail();
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div className="w-full rounded-md border px-2 py-2 bg-white">
                <div className="flex flex-wrap gap-2">
                    {values.map((v) => (
                        <span key={v} className="inline-flex items-center gap-1 rounded-full bg-slate-100 border px-2 py-1 text-xs">
                            {v}
                            {!disabled && (
                                <button type="button" onClick={() => removeEmail(v)} className="text-slate-500 hover:text-slate-700">×</button>
                            )}
                        </span>
                    ))}
                    {!disabled && (
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder || "E-posta ekleyin ve Enter"}
                            className="flex-1 min-w-[160px] h-7 outline-none"
                        />
                    )}
                </div>
            </div>
            {error && <div className="text-xs text-rose-600 mt-1">{error}</div>}
        </div>
    );
}


