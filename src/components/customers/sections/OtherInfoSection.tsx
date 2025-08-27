import React from "react";
import TextInput from "components/form/TextInput";

type Props = {
    register: any;
    errors: Record<string, any>;
};

export default function OtherInfoSection({ register, errors }: Props): JSX.Element {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Web Sitesi" name="website" register={register} error={errors?.website?.message} placeholder="https://" />
            <TextInput label="Vergi Dairesi" name="taxOffice" register={register} error={errors?.taxOffice?.message} placeholder="Vergi dairesi" />
            <TextInput label="Vergi No" name="taxNumber" register={register} error={errors?.taxNumber?.message} placeholder="1234567890" />
            <TextInput label="Etiketler (virgülle)" name="tagsCsv" register={register} error={errors?.tagsCsv?.message} placeholder="VIP, Öncelikli" />
        </div>
    );
}


