import React from "react";
import TextInput from "components/form/TextInput";

type Props = {
    register: any;
    errors: Record<string, any>;
};

export default function EmailInfoSection({ register, errors }: Props): JSX.Element {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="E-posta" name="email" register={register} error={errors?.email?.message} placeholder="ornek@firma.com" type="email" />
        </div>
    );
}


