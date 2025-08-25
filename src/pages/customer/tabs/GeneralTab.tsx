import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { Customer } from "../../../types/customer";

const schema = z.object({
    name: z.string().min(2, "Zorunlu"),
    sector: z.string().min(1, "Zorunlu"),
    status: z.enum(["active", "inactive"]),
    email: z.string().email("Geçersiz e-posta").optional().or(z.literal("")),
    phone: z.string().optional(),
    website: z.string().url("Geçersiz URL").optional().or(z.literal("")),
    country: z.string().min(1, "Zorunlu"),
    city: z.string().optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function GeneralTab({ customer }: { customer: Customer }): JSX.Element {
    const [subTab, setSubTab] = useState<"kimlik" | "iletisim" | "adres" | "etiketler">("kimlik");
    const [tags, setTags] = useState<string[]>(customer.tags || []);
    const [tagInput, setTagInput] = useState("");
    const { register, setValue, formState: { errors } } = useFormContext<FormValues>();

    useEffect(() => {
        setValue("tags", tags, { shouldDirty: true });
    }, [tags, setValue]);

    return (
        <React.Fragment>
            <div className="mt-4 grid grid-cols-1 gap-4">
                {subTab === "kimlik" && (
                    <section className="rounded-2xl border bg-white shadow-sm p-4 space-y-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Ad</label>
                            <input {...register("name")} className="w-full h-10 px-3 rounded-md border" placeholder="Müşteri adı" />
                            {errors.name && <div className="text-xs text-rose-600 mt-1">{errors.name.message}</div>}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Sektör</label>
                                <input {...register("sector")} className="w-full h-10 px-3 rounded-md border" placeholder="Sektör" />
                                {errors.sector && <div className="text-xs text-rose-600 mt-1">{errors.sector.message}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Durum</label>
                                <select {...register("status")} className="w-full h-10 px-3 rounded-md border">
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Pasif</option>
                                </select>
                            </div>
                        </div>
                    </section>
                )}

                {subTab === "iletisim" && (
                    <section className="rounded-2xl border bg-white shadow-sm p-4 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">E-posta</label>
                                <input {...register("email")} className="w-full h-10 px-3 rounded-md border" placeholder="ornek@firma.com" />
                                {errors.email && <div className="text-xs text-rose-600 mt-1">{errors.email.message}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Telefon</label>
                                <input {...register("phone")} className="w-full h-10 px-3 rounded-md border" placeholder="+90 ..." />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Web Sitesi</label>
                            <input {...register("website")} className="w-full h-10 px-3 rounded-md border" placeholder="https://" />
                            {errors.website && <div className="text-xs text-rose-600 mt-1">{errors.website.message}</div>}
                        </div>
                    </section>
                )}

                {subTab === "adres" && (
                    <section className="rounded-2xl border bg-white shadow-sm p-4 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Ülke</label>
                                <input {...register("country")} className="w-full h-10 px-3 rounded-md border" placeholder="Ülke" />
                                {errors.country && <div className="text-xs text-rose-600 mt-1">{errors.country.message}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Şehir</label>
                                <input {...register("city")} className="w-full h-10 px-3 rounded-md border" placeholder="Şehir" />
                            </div>
                        </div>
                    </section>
                )}

                {subTab === "etiketler" && (
                    <section className="rounded-2xl border bg-white shadow-sm p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Etiketler</label>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((t, idx) => (
                                    <span key={`${t}-${idx}`} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border bg-slate-50 text-slate-700 border-slate-200">
                                        {t}
                                        <button type="button" className="ml-1 text-slate-500 hover:text-slate-700" onClick={() => setTags(tags.filter((x, i) => i !== idx))}>×</button>
                                    </span>
                                ))}
                                <input
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === ",") {
                                            e.preventDefault();
                                            const v = tagInput.trim().replace(/,$/, "");
                                            if (v && !tags.includes(v)) setTags([...tags, v]);
                                            setTagInput("");
                                        } else if (e.key === "Backspace" && !tagInput && tags.length) {
                                            setTags(tags.slice(0, -1));
                                        }
                                    }}
                                    className="h-8 px-2 rounded-md border text-sm"
                                    placeholder="Etiket ekle ve Enter'a bas"
                                />
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1">Enter veya virgül ile ekleyin, Backspace ile silin</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Not</label>
                            <textarea {...register("notes")} rows={4} className="w-full px-3 py-2 rounded-md border" placeholder="Kısa not" />
                        </div>
                    </section>
                )}
            </div>
        </React.Fragment>
    );
}


