import React, { useState } from "react";
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
import OtherInfoSection from "components/customers/sections/OtherInfoSection";
// import ContactsSection from "components/customers/sections/ContactsSection";
import EmailsGrid, { EmailRow } from "components/form/EmailsGrid";
import AddressesGrid, { AddressRow } from "components/form/AddressesGrid";
import PhonesGrid, { PhoneRow } from "components/form/PhonesGrid";
import ContractSection from "components/customers/sections/ContractSection";
import NotesSection from "components/customers/sections/NotesSection";
import SocialMediaSection from "components/customers/sections/SocialMediaSection";
import { Box, Tabs, Tab } from "@mui/material";
import LookupSelect from "components/form/LookupSelect";
import { DndContext, closestCenter } from "@dnd-kit/core";
import DraggableSection from "components/customers/sections/DraggableSection";

const schema = z.object({
    // Kimlik/Temel
    name: z.string().min(2, "Zorunlu"),
    legalName: z.string().optional(),
    code: z.string().optional(),
    customerType: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(["active", "inactive"]),
    sectorsCsv: z.string().optional(),
    isReferenceCustomer: z.boolean().optional(),
    // İletişim
    emailPrimary: z.string().email().optional().or(z.literal("")),
    emailSecondaryCsv: z.string().optional(),
    phone: z.string().optional(),
    mobile: z.string().optional(),
    fax: z.string().optional(),
    preferredContact: z.string().optional(),
    // Adres
    country: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    postalCode: z.string().optional(),
    line1: z.string().optional(),
    line2: z.string().optional(),
    // Diğer
    website: z.string().url().optional().or(z.literal("")),
    taxOffice: z.string().optional(),
    taxNumber: z.string().optional(),
    tagsCsv: z.string().optional(),
    defaultNotificationEmail: z.string().email().optional().or(z.literal("")),
    twitterUrl: z.string().url().optional().or(z.literal("")),
    facebookUrl: z.string().url().optional().or(z.literal("")),
    linkedinUrl: z.string().url().optional().or(z.literal("")),
    instagramUrl: z.string().url().optional().or(z.literal("")),
    // Finans
    paymentMethod: z.string().optional(),
    termDays: z.number().optional(),
    currency: z.string().optional(),
    discount: z.number().optional(),
    creditLimit: z.number().optional(),
    eInvoice: z.boolean().optional(),
    iban: z.string().optional(),
    taxExemptionCode: z.string().optional(),
    // Sözleşme
    contractNo: z.string().optional(),
    contractStart: z.string().optional(),
    contractEnd: z.string().optional(),
    // Notlar
    note: z.string().optional(),
    richNote: z.string().optional(),
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

    // Action bar sadece yeni müşteri (customers/new) ekranında
    useRegisterActions(
        !isEdit ? [
            { id: "cancel", label: "Vazgeç", icon: <CloseIcon fontSize="small" />, onClick: () => navigate(-1) },
            { id: "save", label: "Kaydet", icon: <SaveIcon fontSize="small" />, onClick: () => handleSubmit(onSubmit)(), disabled: isSubmitting },
        ] : [],
        [isEdit, isSubmitting]
    );

    const [activeTab, setActiveTab] = useState(0);
    const [emailRows, setEmailRows] = useState<EmailRow[]>([]);
    const [addressRows, setAddressRows] = useState<AddressRow[]>([]);
    const [phoneRows, setPhoneRows] = useState<PhoneRow[]>([]);

    const onSubmit = async (values: FormValues) => {
        const api = new CustomersApi(getConfiguration());
        if (isEdit) {
            const dto: any = {
                id,
                name: values.name,
                code: values.code || null,
                customerType: values.customerType ? Number(values.customerType) : undefined,
                category: values.category ? Number(values.category) : undefined,
                sectors: values.sectorsCsv ? values.sectorsCsv.split(',').map((s) => s.trim()).filter(Boolean) : null,
                status: values.status === "active" ? 1 : 0,
                emailPrimary: values.emailPrimary || null,
                emailSecondary: values.emailSecondaryCsv ? values.emailSecondaryCsv.split(',').map((s) => s.trim()).filter(Boolean) : null,
                phone: values.phone || null,
                mobile: values.mobile || null,
                fax: values.fax || null,
                preferredContact: values.preferredContact || null,
                website: values.website || null,
                taxOffice: values.taxOffice || null,
                taxNumber: values.taxNumber || null,
                tags: values.tagsCsv ? values.tagsCsv.split(",").map((s) => s.trim()).filter(Boolean) : null,
                paymentMethod: values.paymentMethod || null,
                termDays: values.termDays ?? null,
                currency: values.currency || null,
                discount: values.discount ?? null,
                creditLimit: values.creditLimit ?? null,
                eInvoice: values.eInvoice ?? false,
                iban: values.iban || null,
                taxExemptionCode: values.taxExemptionCode || null,
                contractNo: values.contractNo || null,
                contractStart: values.contractStart || null,
                contractEnd: values.contractEnd || null,
                note: values.note || null,
                richNote: values.richNote || null,
            };
            await api.apiCustomersPut(dto);
            navigate(`/customers/${id}`);
        } else {
            const dto: any = {
                name: values.name,
                legalName: values.legalName || null,
                code: values.code || null,
                customerType: values.customerType ? Number(values.customerType) : undefined,
                category: values.category ? Number(values.category) : undefined,
                sectors: values.sectorsCsv ? values.sectorsCsv.split(',').map((s) => s.trim()).filter(Boolean) : null,
                status: values.status === "active" ? 1 : 0,
                emailPrimary: values.emailPrimary || null,
                emailSecondary: values.emailSecondaryCsv ? values.emailSecondaryCsv.split(',').map((s) => s.trim()).filter(Boolean) : null,
                phone: values.phone || null,
                mobile: values.mobile || null,
                fax: values.fax || null,
                preferredContact: values.preferredContact || null,
                website: values.website || null,
                taxOffice: values.taxOffice || null,
                taxNumber: values.taxNumber || null,
                isReferenceCustomer: !!values.isReferenceCustomer,
                tags: values.tagsCsv ? values.tagsCsv.split(",").map((s) => s.trim()).filter(Boolean) : null,
                addresses: values.country || values.city || values.line1 ? [{
                    country: values.country || null,
                    city: values.city || null,
                    district: values.district || null,
                    postalCode: values.postalCode || null,
                    line1: values.line1 || null,
                    line2: values.line2 || null,
                    isDefaultBilling: true,
                    isDefaultShipping: true,
                }] : [],
                paymentMethod: values.paymentMethod || null,
                termDays: values.termDays ?? null,
                currency: values.currency || null,
                discount: values.discount ?? null,
                creditLimit: values.creditLimit ?? null,
                eInvoice: values.eInvoice ?? false,
                iban: values.iban || null,
                taxExemptionCode: values.taxExemptionCode || null,
                contractNo: values.contractNo || null,
                contractStart: values.contractStart || null,
                contractEnd: values.contractEnd || null,
                note: values.note || null,
                richNote: values.richNote || null,
            };
            const res: any = await api.apiCustomersPost(dto);
            const createdId = String(res?.data?.id ?? "");
            navigate(`/customers/${createdId}`);
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <form onSubmit={handleSubmit(onSubmit)} className="px-6 lg:px-10 py-6 space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="text-xl font-semibold">{isEdit ? "Müşteri Düzenle" : "Yeni Müşteri"}</div>
                        <div className="text-sm text-slate-500">CustomerInsertDto ile uyumlu alanlar</div>
                    </div>
                </div>

                <DndContext collisionDetection={closestCenter}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <DraggableSection id="basic" title="Temel Bilgiler">
                            <BasicInfoSection
                                register={register}
                                errors={errors}
                                customerTypeValue={watch("customerType") || null}
                                onCustomerTypeChange={(val) => setValue("customerType", val || "")}
                            />
                        </DraggableSection>
                        <DraggableSection id="emails" title="E-Postalar">
                            <div className="space-y-2">
                                <EmailsGrid label="E-Postalar" rows={emailRows} onChange={setEmailRows} />
                                {/* Form saklama alanları */}
                                <input type="hidden" value={emailRows.map(r => r.email).join(",")} {...register("emailSecondaryCsv")} />
                                <input type="hidden" value={JSON.stringify(emailRows)} name="emailSecondaryJson" />
                            </div>
                        </DraggableSection>
                        <DraggableSection id="addresses" title="Adresler">
                            <div className="space-y-2">
                                <AddressesGrid label="Adresler" rows={addressRows} onChange={setAddressRows} />
                                <input type="hidden" value={JSON.stringify(addressRows)} name="addressesJson" />
                            </div>
                        </DraggableSection>
                        <DraggableSection id="phones" title="Telefonlar">
                            <div className="space-y-2">
                                <PhonesGrid label="Telefonlar" rows={phoneRows} onChange={setPhoneRows} />
                                <input type="hidden" value={JSON.stringify(phoneRows)} name="phonesJson" />
                            </div>
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
                                <Tab label="Sözleşme" />
                                <Tab label="Diğer" />
                                <Tab label="Notlar" />
                                <Tab label="Sosyal Medya" />
                            </Tabs>
                            <Box sx={{ p: 2, flex: 1 }}>
                                {activeTab === 0 && <ContractSection register={register} errors={errors} />}
                                {activeTab === 1 && <OtherInfoSection register={register} errors={errors} />}
                                {activeTab === 2 && <NotesSection register={register} errors={errors} />}
                                {activeTab === 3 && <SocialMediaSection register={register} errors={errors} />}
                            </Box>
                        </Box>
                    </DraggableSection>
                </DndContext>
            </form>
            <Footer />
        </DashboardLayout>
    );
}


