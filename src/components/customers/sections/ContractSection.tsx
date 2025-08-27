import React from "react";

type Props = {
    register: any;
    errors: Record<string, any>;
};

export default function ContractSection({ register, errors }: Props): JSX.Element {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">Sözleşme No</label>
                <input {...register("contractNo")} className="w-full h-10 px-3 rounded-md border" placeholder="" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Başlangıç</label>
                <input type="date" {...register("contractStart")} className="w-full h-10 px-3 rounded-md border" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Bitiş</label>
                <input type="date" {...register("contractEnd")} className="w-full h-10 px-3 rounded-md border" />
            </div>
        </div>
    );
}


