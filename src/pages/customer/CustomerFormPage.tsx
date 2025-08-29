import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CustomersApi } from "api/generated/api";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import getConfiguration from "confiuration";
import BasicInfoSection from "components/customers/sections/BasicInfoSection";
// import AddressInfoSection from "components/customers/sections/AddressInfoSection";
import { useRegisterActions } from "context/ActionBarContext";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
// import ContactsSection from "components/customers/sections/ContactsSection";
import EmailsGrid, { EmailRow } from "components/form/EmailsGrid";
import AddressesGrid, { AddressRow } from "components/form/AddressesGrid";
import PhonesGrid, { PhoneRow } from "components/form/PhonesGrid";
import { NoteRow } from "components/form/NotesGrid";
import NotesSection from "components/customers/sections/NotesSection";
import SocialMediaSection from "components/customers/sections/SocialMediaSection";
import { Box, Tabs, Tab, Avatar, Chip, Menu, MenuItem } from "@mui/material";
import LookupSelect from "components/form/LookupSelect";
import { DndContext, closestCenter } from "@dnd-kit/core";
import DraggableSection from "components/customers/sections/DraggableSection";

const schema = z.object({
    // Temel bilgiler
    name: z.string().min(2, "Zorunlu"),
    legalName: z.string().optional(),
    code: z.string().optional(),
    customerTypeId: z.string().optional(),
    categoryId: z.string().optional(),
    status: z.enum(["active", "inactive"]),
    lifecycleStage: z.enum(["lead", "mql", "sql", "opportunity", "customer"]).optional(),
    ownerId: z.string().optional(),
    nextActivityDate: z.string().optional(), // ISO date string
    sectors: z.array(z.string()).optional(),
    isReferenceCustomer: z.boolean().optional(),
    // İletişim
    emailPrimary: z.string().email().optional().or(z.literal("")),
    emailSecondary: z.array(z.string()).optional(),
    // Diğer
    website: z.string().url().optional().or(z.literal("")),
    taxOffice: z.string().optional(),
    taxNumber: z.string().optional(),
    tags: z.array(z.string()).optional(),
    defaultNotificationEmail: z.string().email().optional().or(z.literal("")),
    twitterUrl: z.string().url().optional().or(z.literal("")),
    facebookUrl: z.string().url().optional().or(z.literal("")),
    linkedinUrl: z.string().url().optional().or(z.literal("")),
    instagramUrl: z.string().url().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export default function CustomerFormPage(): JSX.Element {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { status: "active" },
    });

    // Action bar hem yeni hem edit sayfalarında
    useRegisterActions([
        { id: "cancel", label: "Vazgeç", icon: <CloseIcon fontSize="small" />, onClick: () => navigate(-1) },
        { id: "save", label: isEdit ? "Güncelle" : "Kaydet", icon: <SaveIcon fontSize="small" />, onClick: () => handleSubmit(onSubmit)(), disabled: isSubmitting },
    ], [isEdit, isSubmitting]);

    const [activeTab, setActiveTab] = useState(0);
    const [ownerAnchor, setOwnerAnchor] = useState<null | HTMLElement>(null);
    const [owner, setOwner] = useState<{ id: string; name: string; email?: string } | null>(null);
    const [emailRows, setEmailRows] = useState<EmailRow[]>([]);
    const [addressRows, setAddressRows] = useState<AddressRow[]>([]);
    const [phoneRows, setPhoneRows] = useState<PhoneRow[]>([]);
    const [noteRows, setNoteRows] = useState<NoteRow[]>([]);
    const [loading, setLoading] = useState(false);

    // Edit modunda müşteri verilerini yükle
    useEffect(() => {
        if (isEdit && id) {
            loadCustomerData(id);
        }
    }, [isEdit, id]);

    const loadCustomerData = async (customerId: string) => {
        setLoading(true);
        try {
            const api = new CustomersApi(getConfiguration());
            const response: any = await api.apiCustomersIdGet(customerId);
            const customer = response.data;



            if (customer) {
                // Form alanlarını doldur
                setValue("name", customer.name || "");
                setValue("legalName", customer.legalName || "");
                setValue("code", customer.code || "");
                setValue("customerTypeId", customer.customerTypeId?.toString() || "");
                setValue("categoryId", customer.categoryId?.toString() || "");
                setValue("status", customer.status === 1 ? "active" : "inactive");
                const lifecycleValues = ["lead", "mql", "sql", "opportunity", "customer"] as const;
                setValue("lifecycleStage", customer.lifecycleStage !== null && customer.lifecycleStage >= 0 && customer.lifecycleStage < lifecycleValues.length ? lifecycleValues[customer.lifecycleStage] : undefined);
                setValue("ownerId", customer.ownerId || "");
                setValue("nextActivityDate", customer.nextActivityDate || "");
                setValue("sectors", customer.sectors || []);
                setValue("isReferenceCustomer", !!customer.isReferenceCustomer);
                setValue("emailPrimary", customer.emailPrimary || "");
                setValue("emailSecondary", customer.emailSecondary || []);
                setValue("website", customer.website || "");
                setValue("taxOffice", customer.taxOffice || "");
                setValue("taxNumber", customer.taxNumber || "");
                setValue("tags", customer.tags || []);
                setValue("defaultNotificationEmail", customer.defaultNotificationEmail || "");
                setValue("twitterUrl", customer.twitterUrl || "");
                setValue("facebookUrl", customer.facebookUrl || "");
                setValue("linkedinUrl", customer.linkedinUrl || "");
                setValue("instagramUrl", customer.instagramUrl || "");

                // Gridleri doldur
                if (customer.emails && Array.isArray(customer.emails) && customer.emails.length > 0) {
                    setEmailRows(customer.emails.map((e: any) => ({
                        id: e.id || crypto.randomUUID(),
                        email: e.email || "",
                        description: e.description || "",
                        notify: !!e.notify,
                        bulk: !!e.bulk,
                        isActive: !!e.isActive,
                        isPrimary: !!e.isPrimary
                    })));
                }

                if (customer.addresses && Array.isArray(customer.addresses) && customer.addresses.length > 0) {
                    setAddressRows(customer.addresses.map((a: any) => ({
                        id: a.id || crypto.randomUUID(),
                        country: a.country || "",
                        city: a.city || "",
                        district: a.district || "",
                        postalCode: a.postalCode || "",
                        line1: a.line1 || "",
                        line2: a.line2 || "",
                        isBilling: !!a.isBilling,
                        isShipping: !!a.isShipping,
                        isActive: !!a.isActive
                    })));
                }

                if (customer.phones && Array.isArray(customer.phones) && customer.phones.length > 0) {
                    setPhoneRows(customer.phones.map((p: any) => ({
                        id: p.id || crypto.randomUUID(),
                        label: p.label || "",
                        number: p.number || "",
                        isPrimary: !!p.isPrimary,
                        isActive: !!p.isActive
                    })));
                }

                if (customer.notes) {
                    setNoteRows(customer.notes.map((n: any) => ({
                        id: n.id || crypto.randomUUID(),
                        date: n.date || "",
                        title: n.title || "",
                        note: n.content || ""
                    })));
                }

                // Owner'ı set et
                if (customer.ownerId) {
                    const ownerUser = mockOwners.find(u => u.id === customer.ownerId);
                    if (ownerUser) {
                        setOwner(ownerUser);
                    }
                }
            }
        } catch (error) {
            console.error("Müşteri verisi yüklenemedi:", error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values: FormValues) => {
        const api = new CustomersApi(getConfiguration());
        const dto: any = {
            name: values.name,
            legalName: values.legalName || null,
            code: values.code || null,
            customerTypeId: values.customerTypeId ? Number(values.customerTypeId) : null,
            categoryId: values.categoryId ? Number(values.categoryId) : null,
            status: values.status === "active" ? 1 : 0,
            lifecycleStage: values.lifecycleStage ? ["lead", "mql", "sql", "opportunity", "customer"].indexOf(values.lifecycleStage) : null,
            ownerId: values.ownerId || null,
            nextActivityDate: values.nextActivityDate || null,
            sectors: values.sectors || null,
            isReferenceCustomer: !!values.isReferenceCustomer,
            emailPrimary: values.emailPrimary || null,
            emailSecondary: values.emailSecondary || null,
            emails: emailRows.map(e => ({
                id: e.id,
                email: e.email,
                description: e.description || null,
                notify: e.notify,
                bulk: e.bulk,
                isActive: e.isActive,
                isPrimary: e.isPrimary
            })),
            addresses: addressRows.map(a => ({
                id: a.id,
                country: a.country || null,
                city: a.city || null,
                district: a.district || null,
                postalCode: a.postalCode || null,
                line1: a.line1 || null,
                line2: a.line2 || null,
                isBilling: a.isBilling,
                isShipping: a.isShipping,
                isActive: a.isActive
            })),
            phones: phoneRows.map(p => ({
                id: p.id,
                label: p.label || null,
                number: p.number,
                isPrimary: p.isPrimary,
                isActive: p.isActive
            })),
            notes: noteRows.map(n => ({
                id: n.id,
                date: n.date,
                title: n.title,
                content: n.note
            })),
            website: values.website || null,
            taxOffice: values.taxOffice || null,
            taxNumber: values.taxNumber || null,
            tags: values.tags || null,
            defaultNotificationEmail: values.defaultNotificationEmail || null,
            twitterUrl: values.twitterUrl || null,
            facebookUrl: values.facebookUrl || null,
            linkedinUrl: values.linkedinUrl || null,
            instagramUrl: values.instagramUrl || null,
        };

        if (isEdit) {
            dto.id = id;
            await api.apiCustomersPut(dto);
            navigate(`/customers/${id}`);
        } else {
            const res: any = await api.apiCustomersPost(dto);
            const createdId = String(res?.data?.id ?? "");
            navigate(`/customers/${createdId}`);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <DashboardNavbar />
                <div className="px-6 lg:px-10 py-6 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                        <div className="text-slate-600">Müşteri bilgileri yükleniyor...</div>
                    </div>
                </div>
                <Footer />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <form onSubmit={handleSubmit(onSubmit)} className="px-6 lg:px-10 py-6 space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="text-xl font-semibold">{isEdit ? "Müşteri Düzenle" : "Yeni Müşteri"}</div>
                            {/* Owner chip */}
                            <Chip
                                avatar={<Avatar sx={{ width: 24, height: 24 }}>{(owner?.name || "").charAt(0) || "U"}</Avatar>}
                                label={owner?.name || "Sahip atanmamış"}
                                variant="outlined"
                                onClick={(e) => setOwnerAnchor(e.currentTarget)}
                                size="small"
                            />
                            <Menu anchorEl={ownerAnchor} open={Boolean(ownerAnchor)} onClose={() => setOwnerAnchor(null)}>
                                {mockOwners.map(u => (
                                    <MenuItem key={u.id} onClick={() => { setOwner(u); setValue("ownerId", u.id); setOwnerAnchor(null); }}>{u.name}</MenuItem>
                                ))}
                            </Menu>
                        </div>
                        <div className="text-sm text-slate-500">CustomerInsertDto ile uyumlu alanlar</div>
                    </div>
                    {/* Lifecycle Stage pill */}
                    <div className="flex items-center gap-2">
                        {lifecyclePill(watch("lifecycleStage"))}
                    </div>
                </div>

                <DndContext collisionDetection={closestCenter}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <DraggableSection id="basic" title="Temel Bilgiler">
                            <BasicInfoSection
                                register={register}
                                errors={errors}
                                customerTypeValue={watch("customerTypeId") || null}
                                onCustomerTypeChange={(val) => setValue("customerTypeId", val || "")}
                                sectorTypeValue={watch("sectors")?.join(",") || null}
                                onSectorTypeChange={(val) => setValue("sectors", val ? val.split(",").map(s => s.trim()).filter(Boolean) : [])}
                                sectorsValue={watch("sectors")?.join(",") || null}
                                onSectorsChange={(val) => setValue("sectors", val ? val.split(",").map(s => s.trim()).filter(Boolean) : [])}
                            />
                        </DraggableSection>
                        <DraggableSection id="emails" title="E-Postalar">
                            <EmailsGrid label="E-Postalar" rows={emailRows} onChange={setEmailRows} />
                        </DraggableSection>
                        <DraggableSection id="addresses" title="Adresler">
                            <AddressesGrid label="Adresler" rows={addressRows} onChange={setAddressRows} />
                        </DraggableSection>
                        <DraggableSection id="phones" title="Telefonlar">
                            <PhonesGrid label="Telefonlar" rows={phoneRows} onChange={setPhoneRows} />
                        </DraggableSection>

                    </div>

                    <DraggableSection id="extra" title="Ek Bilgiler">
                        <Box sx={{ display: 'flex' }}>
                            <Tabs
                                orientation="vertical"
                                variant="scrollable"
                                value={activeTab}
                                onChange={(_, v) => setActiveTab(v)}
                                sx={{ borderRight: 1, borderColor: 'divider', minWidth: 220 }}
                            >
                                <Tab label="Notlar" />
                                <Tab label="Sosyal Medya" />
                            </Tabs>
                            <Box sx={{ p: 2, flex: 1 }}>
                                {activeTab === 0 && <NotesSection register={register} errors={errors} rows={noteRows} onChange={setNoteRows} />}
                                {activeTab === 1 && <SocialMediaSection register={register} errors={errors} />}
                            </Box>
                        </Box>
                    </DraggableSection>
                </DndContext>
            </form>
            <Footer />
        </DashboardLayout>


    );
}

function lifecyclePill(stage?: "lead" | "mql" | "sql" | "opportunity" | "customer") {
    const map: Record<string, { label: string; color: string }> = {
        lead: { label: "Lead", color: "#64748b" },
        mql: { label: "MQL", color: "#0ea5e9" },
        sql: { label: "SQL", color: "#6366f1" },
        opportunity: { label: "Opportunity", color: "#f59e0b" },
        customer: { label: "Customer", color: "#10b981" },
    };
    const info = stage ? map[stage] : { label: "Stage Yok", color: "#94a3b8" };
    return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${info.color}1a`, color: info.color }}>
            {info.label}
        </span>
    );
}

const mockOwners = [
    { id: "1", name: "Ahmet Yılmaz" },
    { id: "2", name: "Ayşe Demir" },
    { id: "3", name: "Mehmet Kaya" },
];


