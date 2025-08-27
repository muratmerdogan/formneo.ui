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
            <TextInput label="Kod" name="code" register={register} error={errors?.code?.message} placeholder="Müşteri kodu" />
            <TextInput label="Sektörler (virgülle)" name="sectorsCsv" register={register} error={errors?.sectorsCsv?.message} placeholder="Üretim, Perakende" />
            <SelectInput label="Durum" name="status" register={register} error={errors?.status?.message} options={[{ value: "active", label: "Aktif" }, { value: "inactive", label: "Pasif" }]} />
            <TextInput label="Müşteri Tipi" name="customerType" register={register} error={errors?.customerType?.message} placeholder="(sayı)" />
            <TextInput label="Kategori" name="category" register={register} error={errors?.category?.message} placeholder="(sayı)" />
            <TextInput label="Vergi Dairesi" name="taxOffice" register={register} error={errors?.taxOffice?.message} placeholder="Vergi dairesi" />
            <TextInput label="Vergi No" name="taxNumber" register={register} error={errors?.taxNumber?.message} placeholder="1234567890" />
        </div>
    );
}


