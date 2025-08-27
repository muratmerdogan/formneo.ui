import React from "react";
import NumberInput from "components/form/NumberInput";
import MoneyInput from "components/form/MoneyInput";

type Props = {
    register: any;
    errors: Record<string, any>;
};

export default function FinanceSection({ register, errors }: Props): JSX.Element {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">Ödeme Yöntemi</label>
                <input {...register("paymentMethod")} className="w-full h-10 px-3 rounded-md border" placeholder="Havale/EFT" />
            </div>
            <NumberInput label="Vade (gün)" name="termDays" register={register} error={errors?.termDays?.message} placeholder="30" step={1} />
            <div>
                <label className="block text-sm font-medium mb-1">Para Birimi</label>
                <input {...register("currency")} className="w-full h-10 px-3 rounded-md border" placeholder="TRY" />
            </div>
            <NumberInput label="İskonto (%)" name="discount" register={register} error={errors?.discount?.message} placeholder="0" step={0.01} />
            <MoneyInput label="Kredi Limiti" name="creditLimit" register={register} error={errors?.creditLimit?.message} placeholder="0" />
            <div className="flex items-center gap-2">
                <input type="checkbox" {...register("eInvoice")} id="eInvoice" />
                <label htmlFor="eInvoice" className="text-sm">E-Fatura</label>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">IBAN</label>
                <input {...register("iban")} className="w-full h-10 px-3 rounded-md border" placeholder="TR.." />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Vergi Muafiyet Kodu</label>
                <input {...register("taxExemptionCode")} className="w-full h-10 px-3 rounded-md border" placeholder="" />
            </div>
        </div>
    );
}


