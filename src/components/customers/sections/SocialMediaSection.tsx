import React from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
// MailOutlineIcon kaldırıldı - defaultNotificationEmail alanı kaldırıldı

type Props = {
    register: any;
    errors: Record<string, any>;
};

export default function SocialMediaSection({ register, errors }: Props): JSX.Element {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2"><TwitterIcon fontSize="small" className="text-sky-500" /> Twitter Url</label>
                <input {...register("twitterUrl")} name="twitterUrl" type="url" className="w-full h-10 px-3 rounded-md border" placeholder="https://twitter.com/..." />
                {errors?.twitterUrl?.message && <div className="text-xs text-rose-600 mt-1">{String(errors?.twitterUrl?.message)}</div>}
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2"><FacebookIcon fontSize="small" className="text-blue-600" /> Facebook Url</label>
                <input {...register("facebookUrl")} name="facebookUrl" type="url" className="w-full h-10 px-3 rounded-md border" placeholder="https://facebook.com/..." />
                {errors?.facebookUrl?.message && <div className="text-xs text-rose-600 mt-1">{String(errors?.facebookUrl?.message)}</div>}
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2"><LinkedInIcon fontSize="small" className="text-sky-700" /> LinkedIn Url</label>
                <input {...register("linkedinUrl")} name="linkedinUrl" type="url" className="w-full h-10 px-3 rounded-md border" placeholder="https://linkedin.com/company/..." />
                {errors?.linkedinUrl?.message && <div className="text-xs text-rose-600 mt-1">{String(errors?.linkedinUrl?.message)}</div>}
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2"><InstagramIcon fontSize="small" className="text-pink-500" /> Instagram Url</label>
                <input {...register("instagramUrl")} name="instagramUrl" type="url" className="w-full h-10 px-3 rounded-md border" placeholder="https://instagram.com/..." />
                {errors?.instagramUrl?.message && <div className="text-xs text-rose-600 mt-1">{String(errors?.instagramUrl?.message)}</div>}
            </div>
            {/* defaultNotificationEmail alanı kaldırıldı */}
        </div>
    );
}


