import React from "react";
import TextInput from "components/form/TextInput";
import SelectInput from "components/form/SelectInput";

type Props = {
    id: string;
    type: "string" | "number" | "boolean" | "select" | "multiselect" | "json";
    name: string;
    description?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
    register: any;
    control?: any;
    errors: Record<string, any>;
};

export default function ParameterField({ id, type, name, description, required, options, register, errors }: Props): JSX.Element {
    const error = errors?.[id]?.message as string | undefined;
    if (type === "boolean") {
        return (
            <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                    <div className="text-sm font-medium">{name}</div>
                    {description && <div className="text-xs text-slate-500">{description}</div>}
                </div>
                <input type="checkbox" {...register(id)} className="h-4 w-4" />
            </div>
        );
    }
    if (type === "select") {
        return (
            <div className="p-3 rounded-lg border">
                <SelectInput label={name} name={id} register={register} error={error} options={options || []} />
                {description && <div className="text-xs text-slate-500 mt-1">{description}</div>}
            </div>
        );
    }
    if (type === "multiselect") {
        return (
            <div className="p-3 rounded-lg border">
                <label className="block text-sm font-medium mb-1">{name}</label>
                <select multiple {...register(id)} className="w-full h-24 px-3 rounded-md border">
                    {(options || []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                {description && <div className="text-xs text-slate-500 mt-1">{description}</div>}
                {error && <div className="text-xs text-rose-600 mt-1">{error}</div>}
            </div>
        );
    }
    if (type === "json") {
        return (
            <div className="p-3 rounded-lg border">
                <label className="block text-sm font-medium mb-1">{name}</label>
                <textarea
                    {...register(id)}
                    rows={6}
                    className="w-full px-3 py-2 rounded-md border font-mono text-xs"
                    placeholder={'{\n  "key": "value"\n}'}
                />
                {description && <div className="text-xs text-slate-500 mt-1">{description}</div>}
                {error && <div className="text-xs text-rose-600 mt-1">{error}</div>}
            </div>
        );
    }
    // string/number default
    return (
        <div className="p-3 rounded-lg border">
            <TextInput label={name} name={id} register={register} error={error} />
            {description && <div className="text-xs text-slate-500 mt-1">{description}</div>}
        </div>
    );
}


