import React from "react";
import TextInput from "components/form/TextInput";
import PhoneInput from "components/form/PhoneInput";

type Props = {
    register: any;
    errors: Record<string, any>;
};

export default function ContactsSection({ register, errors }: Props): JSX.Element {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Birincil E-posta" name="emailPrimary" register={register} error={errors?.emailPrimary?.message} placeholder="ornek@firma.com" />
            <TextInput label="İkincil E-postalar (virgülle)" name="emailSecondaryCsv" register={register} error={errors?.emailSecondaryCsv?.message} placeholder="ikincil1@..., ikincil2@..." />
            <PhoneInput label="Telefon" name="phone" register={register} error={errors?.phone?.message} />
            <PhoneInput label="Mobil" name="mobile" register={register} error={errors?.mobile?.message} />
            <TextInput label="Faks" name="fax" register={register} error={errors?.fax?.message} placeholder="" />
            <TextInput label="Tercih Edilen İletişim" name="preferredContact" register={register} error={errors?.preferredContact?.message} placeholder="email | phone" />
        </div>
    );
}


