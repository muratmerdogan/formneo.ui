import React from "react";
import TextInput from "components/form/TextInput";

type Props = {
    register: any;
    errors: Record<string, any>;
};

export default function AddressInfoSection({ register, errors }: Props): JSX.Element {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Ülke" name="country" register={register} error={errors?.country?.message} placeholder="Ülke" />
            <TextInput label="Şehir" name="city" register={register} error={errors?.city?.message} placeholder="Şehir" />
            <TextInput label="İlçe" name="district" register={register} error={errors?.district?.message} placeholder="İlçe" />
            <TextInput label="Posta Kodu" name="postalCode" register={register} error={errors?.postalCode?.message} placeholder="00000" />
            <TextInput label="Adres Satırı 1" name="line1" register={register} error={errors?.line1?.message} placeholder="Adres" />
            <TextInput label="Adres Satırı 2" name="line2" register={register} error={errors?.line2?.message} placeholder="Adres (opsiyonel)" />
        </div>
    );
}


