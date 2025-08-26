import React from "react";
import TextInput from "components/form/TextInput";
import SelectInput from "components/form/SelectInput";

type Props = {
    register: any;
    errors: Record<string, any>;
};

export default function BasicInfoSection({ register, errors }: Props): JSX.Element {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Ad" name="name" register={register} error={errors?.name?.message} placeholder="Müşteri adı" />
            <TextInput label="Sektör" name="sector" register={register} error={errors?.sector?.message} placeholder="Sektör" />
            <TextInput label="Ülke" name="country" register={register} error={errors?.country?.message} placeholder="Ülke" />
            <TextInput label="Şehir" name="city" register={register} error={errors?.city?.message} placeholder="Şehir" />
            <SelectInput label="Durum" name="status" register={register} error={errors?.status?.message} options={[{ value: "active", label: "Aktif" }, { value: "inactive", label: "Pasif" }]} />
        </div>
    );
}


