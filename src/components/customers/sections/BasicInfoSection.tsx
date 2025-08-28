import React from "react";
import TextInput from "components/form/TextInput";
import SelectInput from "components/form/SelectInput";
import LookupSelect from "components/form/LookupSelect";

type Props = {
    register: any;
    errors: Record<string, any>;
    customerTypeValue?: string | null;
    onCustomerTypeChange?: (value: string | null) => void;
    sectorTypeValue?: string | null;
    onSectorTypeChange?: (value: string | null) => void;
    sectorsValue?: string | null;
    onSectorsChange?: (value: string | null) => void;
};

export default function BasicInfoSection({ register, errors, customerTypeValue, onCustomerTypeChange, sectorTypeValue, onSectorTypeChange, sectorsValue, onSectorsChange }: Props): JSX.Element {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Firma/Şirket Adı" name="name" register={register} error={errors?.name?.message} placeholder="Müşteri adı" maxLength={120} />
            <TextInput label="Resmi Adı" name="legalName" register={register} error={errors?.legalName?.message} placeholder="Resmi adı" maxLength={160} />
            <TextInput label="Kod" name="code" register={register} error={errors?.code?.message} placeholder="Firma kodu" maxLength={40} />
            <LookupSelect
                categoryKey="SectorType"
                moduleKey="CRM"
                label="Sektörler"
                placeholder="Seçiniz"
                value={sectorsValue || null}
                onChange={(val) => onSectorsChange && onSectorsChange(val)}
                allowCreate
            />
            <SelectInput label="Durum" name="status" register={register} error={errors?.status?.message} options={[{ value: "active", label: "Aktif" }, { value: "inactive", label: "Pasif" }]} />
            <LookupSelect
                categoryKey="CustomerType"
                moduleKey="CRM"
                label="Müşteri Tipi"
                placeholder="Seçiniz"
                value={customerTypeValue || null}
                onChange={(val) => onCustomerTypeChange && onCustomerTypeChange(val)}
                allowCreate
            />
            <TextInput label="Vergi Dairesi" name="taxOffice" register={register} error={errors?.taxOffice?.message} placeholder="Vergi dairesi" maxLength={100} />
            <TextInput label="VKN / TC" name="taxNumber" register={register} error={errors?.taxNumber?.message} placeholder="1234567890" maxLength={20} />

        </div>
    );
}


