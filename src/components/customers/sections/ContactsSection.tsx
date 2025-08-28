import React from "react";
import TextInput from "components/form/TextInput";
import EmailsGrid, { EmailRow } from "components/form/EmailsGrid";
import AddressesGrid, { AddressRow } from "components/form/AddressesGrid";
import PhonesGrid, { PhoneRow } from "components/form/PhonesGrid";
import { useState } from "react";
import PhoneInput from "components/form/PhoneInput";

type Props = {
    register: any;
    errors: Record<string, any>;
};

export default function ContactsSection({ register, errors }: Props): JSX.Element {
    const [emailRows, setEmailRows] = useState<EmailRow[]>([]);
    const [addressRows, setAddressRows] = useState<AddressRow[]>([]);
    const [phoneRows, setPhoneRows] = useState<PhoneRow[]>([]);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <EmailsGrid label="E-postalar" rows={emailRows} onChange={setEmailRows} />
            </div>
            <div className="md:col-span-2">
                <AddressesGrid label="Adresler" rows={addressRows} onChange={setAddressRows} />
            </div>
            <div className="md:col-span-2">
                <PhonesGrid label="Telefonlar" rows={phoneRows} onChange={setPhoneRows} />
            </div>
            {/* Form uyumu için hidden inputlar */}
            <input type="hidden" value={emailRows.map(r => r.email).join(",")} {...register("emailSecondaryCsv")} />
            <input type="hidden" value={JSON.stringify(emailRows)} {...register("emailSecondaryJson")} />
            <input type="hidden" value={JSON.stringify(addressRows)} {...register("addressesJson")} />
            <input type="hidden" value={JSON.stringify(phoneRows)} {...register("phonesJson")} />
        </div>
    );
}


