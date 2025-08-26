import React from "react";
import TextInput from "components/form/TextInput";

type Props = {
    register: any;
    errors: Record<string, any>;
};

export default function PhoneInfoSection({ register, errors }: Props): JSX.Element {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Telefon" name="phone" register={register} error={errors?.phone?.message} placeholder="+90 ..." />
            <TextInput label="Telefon (İkincil)" name="phone2" register={register} error={errors?.phone2?.message} placeholder="+90 ..." />
        </div>
    );
}


