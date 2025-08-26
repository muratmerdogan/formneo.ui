import React from "react";
import TextInput from "components/form/TextInput";

type Props = {
    register: any;
    errors: Record<string, any>;
};

export default function AddressInfoSection({ register, errors }: Props): JSX.Element {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Adres Satırı 1" name="address1" register={register} error={errors?.address1?.message} placeholder="Adres" />
            <TextInput label="Adres Satırı 2" name="address2" register={register} error={errors?.address2?.message} placeholder="Adres (opsiyonel)" />
            <TextInput label="Posta Kodu" name="postalCode" register={register} error={errors?.postalCode?.message} placeholder="00000" />
        </div>
    );
}


