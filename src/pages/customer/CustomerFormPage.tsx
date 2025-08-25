import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Customer } from "../../types/customer";
import { createCustomer, updateCustomer } from "../../lib/api";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

const schema = z.object({
    name: z.string().min(2, "Zorunlu"),
    sector: z.string().min(1, "Zorunlu"),
    country: z.string().min(1, "Zorunlu"),
    city: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    status: z.enum(["active", "inactive"]),
    tags: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function CustomerFormPage(): JSX.Element {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { status: "active" },
    });

    const onSubmit = async (values: FormValues) => {
        if (isEdit) {
            const payload = { ...(values as any), id } as Customer;
            await updateCustomer(payload);
            navigate(`/customers/${id}`);
        } else {
            const payload = {
                name: values.name,
                sector: values.sector,
                country: values.country,
                city: values.city,
                email: values.email || undefined,
                phone: values.phone,
                status: values.status,
                tags: values.tags || [],
                health: "good",
                lastContactAt: new Date().toISOString(),
                kpis: { totalRevenue: 0, openOpportunities: 0, arRisk: 0 },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            } as any;
            const c = await createCustomer(payload);
            navigate(`/customers/${c.id}`);
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <form onSubmit={handleSubmit(onSubmit)} className="px-6 lg:px-10 py-6 space-y-4">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="text-xl font-semibold">{isEdit ? "Müşteri Düzenle" : "Yeni Müşteri"}</div>
                        <div className="text-sm text-slate-500">Temel bilgiler</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => navigate(-1)} className="h-9 px-3 rounded-md border">Vazgeç</button>
                        <button disabled={isSubmitting} type="submit" className="h-9 px-4 rounded-md border bg-slate-900 text-white hover:bg-slate-800">Kaydet</button>
                    </div>
                </div>

                <div className="rounded-2xl border bg-white shadow-sm p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Ad</label>
                        <input {...register("name")} className="w-full h-10 px-3 rounded-md border" placeholder="Müşteri adı" />
                        {errors.name && <div className="text-xs text-rose-600 mt-1">{errors.name.message}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Sektör</label>
                        <input {...register("sector")} className="w-full h-10 px-3 rounded-md border" placeholder="Sektör" />
                        {errors.sector && <div className="text-xs text-rose-600 mt-1">{errors.sector.message}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Ülke</label>
                        <input {...register("country")} className="w-full h-10 px-3 rounded-md border" placeholder="Ülke" />
                        {errors.country && <div className="text-xs text-rose-600 mt-1">{errors.country.message}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Şehir</label>
                        <input {...register("city")} className="w-full h-10 px-3 rounded-md border" placeholder="Şehir" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">E-posta</label>
                        <input {...register("email")} className="w-full h-10 px-3 rounded-md border" placeholder="ornek@firma.com" />
                        {errors.email && <div className="text-xs text-rose-600 mt-1">{errors.email.message}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Telefon</label>
                        <input {...register("phone")} className="w-full h-10 px-3 rounded-md border" placeholder="+90 ..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Durum</label>
                        <select {...register("status")} className="w-full h-10 px-3 rounded-md border">
                            <option value="active">Aktif</option>
                            <option value="inactive">Pasif</option>
                        </select>
                    </div>
                </div>
            </form>
            <Footer />
        </DashboardLayout>
    );
}


