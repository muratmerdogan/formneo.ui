import React from "react";
import TextInput from "components/form/TextInput";

type Props = {
    register: any;
    errors: Record<string, any>;
};

export default function SocialMediaSection({ register, errors }: Props): JSX.Element {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Twitter Url" name="twitterUrl" register={register} error={errors?.twitterUrl?.message} placeholder="https://twitter.com/..." />
            <TextInput label="Facebook Url" name="facebookUrl" register={register} error={errors?.facebookUrl?.message} placeholder="https://facebook.com/..." />
            <TextInput label="LinkedIn Url" name="linkedinUrl" register={register} error={errors?.linkedinUrl?.message} placeholder="https://linkedin.com/company/..." />
            <TextInput label="Instagram Url" name="instagramUrl" register={register} error={errors?.instagramUrl?.message} placeholder="https://instagram.com/..." />
            <TextInput label="Varsayılan Bildirim E-postası" name="defaultNotificationEmail" register={register} error={errors?.defaultNotificationEmail?.message} placeholder="bildirim@ornek.com" />
        </div>
    );
}


