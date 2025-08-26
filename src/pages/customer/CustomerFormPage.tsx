import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Customer } from "../../types/customer";
import { CustomersApi } from "api/generated/api";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import getConfiguration from "confiuration";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import DraggableSection from "components/customers/sections/DraggableSection";
import BasicInfoSection from "components/customers/sections/BasicInfoSection";
import EmailInfoSection from "components/customers/sections/EmailInfoSection";
import AddressInfoSection from "components/customers/sections/AddressInfoSection";
import PhoneInfoSection from "components/customers/sections/PhoneInfoSection";

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

    const [sectionOrder, setSectionOrder] = useState<string[]>(["basic", "email", "address", "phone"]);
    const orderStorageKey = "customerForm:sectionOrder";

    // İlk yüklemede sürükle-bırak sırasını localStorage'dan yükle
    useEffect(() => {
        try {
            const raw = localStorage.getItem(orderStorageKey);
            if (!raw) return;
            const saved: unknown = JSON.parse(raw);
            if (!Array.isArray(saved)) return;
            const ids = ["basic", "email", "address", "phone"];
            const valid = (saved as unknown[]).map(String).filter((id) => ids.includes(id));
            const withoutBasic = valid.filter((x) => x !== "basic");
            const missing = ids.filter((x) => !valid.includes(x) && x !== "basic");
            setSectionOrder(["basic", ...withoutBasic, ...missing]);
        } catch { }
    }, []);

    type SectionDef = { id: string; title: string; color?: string; content: JSX.Element };
    const sections: SectionDef[] = useMemo(() => ([
        { id: "basic", title: "Temel Firma Bilgileri", content: <BasicInfoSection register={register} errors={errors} /> },
        { id: "email", title: "E-posta Bilgileri", content: <EmailInfoSection register={register} errors={errors} /> },
        { id: "address", title: "Adres Bilgileri", content: <AddressInfoSection register={register} errors={errors} /> },
        { id: "phone", title: "Telefon Bilgileri", content: <PhoneInfoSection register={register} errors={errors} /> },
    ]), [register, errors]);

    const orderedSections = sectionOrder
        .map((id) => sections.find((s) => s.id === id))
        .filter(Boolean) as { id: string; title: string; content: JSX.Element }[];

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;
        const activeId = String(active.id);
        const overId = String(over.id).replace(/^drop-/, "");
        if (activeId === overId) return;
        const oldIndex = sectionOrder.indexOf(activeId);
        const newIndex = sectionOrder.indexOf(overId);
        if (oldIndex === -1 || newIndex === -1) return;
        setSectionOrder((items) => {
            const moved = arrayMove(items, oldIndex, newIndex);
            // 'basic' her zaman en başta kalsın
            const withoutBasic = moved.filter((x) => x !== "basic");
            const next = ["basic", ...withoutBasic];
            try { localStorage.setItem(orderStorageKey, JSON.stringify(next)); } catch { }
            return next;
        });
    };

    const onSubmit = async (values: FormValues) => {
        const api = new CustomersApi(getConfiguration());
        if (isEdit) {
            const dto: any = {
                id,
                name: values.name,
                sectors: values.sector ? [values.sector] : [],
                status: values.status === "active" ? 1 : 0,
                emailPrimary: values.email || null,
                phone: values.phone || null,
                tags: values.tags || [],
            };
            await api.apiCustomersPut(dto);
            navigate(`/customers/${id}`);
        } else {
            const dto: any = {
                name: values.name,
                sectors: values.sector ? [values.sector] : [],
                status: values.status === "active" ? 1 : 0,
                emailPrimary: values.email || null,
                phone: values.phone || null,
                tags: values.tags || [],
                addresses: values.country ? [{ country: values.country, city: values.city || null }] : [],
            };
            const res: any = await api.apiCustomersPost(dto);
            const createdId = String(res?.data?.id ?? "");
            navigate(`/customers/${createdId}`);
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

                <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                    <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {orderedSections.map((s) => (
                                <DraggableSection key={s.id} id={s.id} title={s.title}>
                                    {s.content}
                                </DraggableSection>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </form>
            <Footer />
        </DashboardLayout>
    );
}


