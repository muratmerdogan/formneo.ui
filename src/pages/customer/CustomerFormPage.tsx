import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CustomersApi } from "api/generated/api";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomerReferences } from "hooks/useCustomerReferences";
import { 
  createInsertDto, 
  createUpdateDto, 
  CustomerFormData
} from "utils/customerFormUtils";
import { convertApiLifecycleStageToForm, convertApiStatusToForm } from "constants/customerConstants";
// Toast sistemi için mevcut alert sistemi kullanılacak
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import getConfiguration from "confiuration";
import BasicInfoSection from "components/customers/sections/BasicInfoSection";
import MDSnackbar from "components/MDSnackbar";
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
    // Temel bilgiler - CustomerInsertDto ve CustomerUpdateDto'ya uygun
    name: z.string().min(2, "Zorunlu"),
    legalName: z.string().optional(),
    code: z.string().optional(),
    customerTypeId: z.string().optional(), // InsertDto'da string, UpdateDto'da number olacak
    categoryId: z.string().optional(), // InsertDto'da string, UpdateDto'da number olacak
    status: z.enum(["active", "inactive"]).optional(), // Sadece UpdateDto'da var
    lifecycleStage: z.enum(["lead", "mql", "sql", "opportunity", "customer"]).optional(),
    ownerId: z.string().optional(),
    nextActivityDate: z.string().optional(), // ISO date string
    isReferenceCustomer: z.boolean().optional(),
    
    // Logo
    logoFilePath: z.string().optional(),
    
    // Vergi bilgileri
    taxOffice: z.string().optional(),
    taxNumber: z.string().optional(),
    
    // Web sitesi
    website: z.string().url().optional().or(z.literal("")),
    
    // Sosyal medya
    twitterUrl: z.string().url().optional().or(z.literal("")),
    facebookUrl: z.string().url().optional().or(z.literal("")),
    linkedinUrl: z.string().url().optional().or(z.literal("")),
    instagramUrl: z.string().url().optional().or(z.literal("")),
    
    // UpdateDto'ya özel alanlar
    // defaultNotificationEmail alanı kaldırıldı
    
    // Optimistic locking için
    rowVersion: z.string().optional(),
    
    // InsertDto'da var ama şemada olmayan alanlar (opsiyonel)
    officials: z.array(z.any()).optional(),
    customFields: z.array(z.any()).optional(),
    documents: z.array(z.any()).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function CustomerFormPage(): JSX.Element {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, trigger, getValues } = useForm<FormValues>({
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
    
    // Toast state'leri
    const [successSB, setSuccessSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    
    // Reference yapısı kaldırıldı - sadece form değerleri kullanılıyor

    // Edit modunda müşteri verilerini yükle
    useEffect(() => {
        if (isEdit && id) {
            loadCustomerData(id);
        }
    }, [isEdit, id]);

    // customerTypeId set etmek için yardımcı fonksiyon
    const setCustomerTypeId = (id: string) => {
        setValue("customerTypeId", id);
        trigger("customerTypeId");
        console.log("customerTypeId set edildi:", id);
    };

    const loadCustomerData = async (customerId: string) => {
        setLoading(true);
        try {
            const api = new CustomersApi(getConfiguration());
            const response: any = await api.apiCustomersIdGet(customerId);
            const customer = response.data;

            // RowVersion backend'den geliyor ✅

            if (customer) {
                // Form alanlarını doldur
                setValue("name", customer.name || "");
                setValue("legalName", customer.legalName || "");
                setValue("code", customer.code || "");
                // Form alanlarına ID'leri set et
                setValue("customerTypeId", customer.customerTypeId?.toString() || undefined);
                setValue("categoryId", customer.categoryId?.toString() || undefined);
                
                // RowVersion'ı form'a set et (Optimistic locking için)
                setValue("rowVersion", customer.rowVersion || undefined);
                setValue("status", convertApiStatusToForm(customer.status === 1 ? 1 : 0));
                setValue("lifecycleStage", convertApiLifecycleStageToForm(customer.lifecycleStage || 0));
                setValue("ownerId", customer.ownerId || "");
                setValue("nextActivityDate", customer.nextActivityDate || "");
                setValue("isReferenceCustomer", !!customer.isReferenceCustomer);
                setValue("logoFilePath", customer.logoFilePath || "");
                setValue("website", customer.website || "");
                setValue("taxOffice", customer.taxOffice || "");
                setValue("taxNumber", customer.taxNumber || "");
                // tags alanı şemadan kaldırıldı
                // defaultNotificationEmail alanı kaldırıldı
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
                        isPrimary: !!e.isPrimary,
                        rowVersion: e.rowVersion // RowVersion alanı eklendi
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
                        isActive: !!a.isActive,
                        isPrimary: !!a.isPrimary,
                        rowVersion: a.rowVersion // RowVersion alanı eklendi
                    })));
                }

                if (customer.phones && Array.isArray(customer.phones) && customer.phones.length > 0) {
                    setPhoneRows(customer.phones.map((p: any) => ({
                        id: p.id || crypto.randomUUID(),
                        label: p.label || "",
                        number: p.number || "",
                        isPrimary: !!p.isPrimary,
                        isActive: !!p.isActive,
                        rowVersion: p.rowVersion // RowVersion alanı eklendi
                    })));
                }

                if (customer.notes) {
                    setNoteRows(customer.notes.map((n: any) => ({
                        id: n.id || crypto.randomUUID(),
                        date: n.date || "",
                        title: n.title || "",
                        note: n.content || "",
                        rowVersion: n.rowVersion // RowVersion alanı eklendi
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
        try {
            console.log("=== FORM SUBMISSION DEBUG ===");
            console.log("values.customerTypeId:", values.customerTypeId);
            console.log("values.categoryId:", values.categoryId);
            console.log("typeof customerTypeId:", typeof values.customerTypeId);
            
            // Test için alert
           
      
            const api = new CustomersApi(getConfiguration());
            
            // Prepare form data
            const formData: CustomerFormData = {
                ...values,
                status: values.status as "active" | "inactive",
            };
            
            if (isEdit && id) {
                // Update existing customer
                const updateDto = createUpdateDto(id, formData);
                console.log("Update DTO:", updateDto);
                console.log("Update DTO customerTypeId:", updateDto.customerTypeId);
                
                await api.apiCustomersPut(updateDto);
                
                // Başarılı güncelleme toast'ı
                setSuccessMessage("Müşteri bilgileri başarıyla güncellendi!");
                setSuccessSB(true);
                
                navigate(`/customers/${id}`);
            } else {
                // Create new customer
                const additionalData = {
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
                        isActive: a.isActive,
                        isPrimary: a.isPrimary
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
                    officials: values.officials || null,
                    customFields: values.customFields || null,
                    documents: values.documents || null,
                };
                
                const insertDto = createInsertDto(formData, additionalData);
                console.log("Insert DTO:", insertDto);
                console.log("Insert DTO customerTypeId:", insertDto.customerTypeId);
                
                const res: any = await api.apiCustomersPost(insertDto);
                const createdId = String(res?.data?.id ?? "");
                
                // Başarılı oluşturma toast'ı
                setSuccessMessage("Yeni müşteri başarıyla oluşturuldu!");
                setSuccessSB(true);
                
                navigate(`/customers/${createdId}`);
            }
        } catch (error) {
            console.error("Form submission error:", error);
            
            // Hata toast'ı
            setErrorMessage("Bir hata oluştu! Lütfen tekrar deneyin.");
            setErrorSB(true);
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
                                onCustomerTypeChange={(id, item) => {
                                    // Form'a ID'yi bağla (Müşteri Tipi alanı için)
                                    setValue("customerTypeId", id || undefined);
                                    trigger("customerTypeId"); // Form'u güncelle
    
                                   }}
                                categoryIdValue={watch("categoryId") || null}
                                onCategoryIdChange={(id, item) => {
                                    // Form'a ID'yi bağla (Kategori alanı için)
                                    setValue("categoryId", id || undefined);
                                    trigger("categoryId"); // Form'u güncelle
                       
                                    // Test için alert  alert(`Kategori Seçildi!\nID: ${id}\nAd: ${item?.name}\nKod: ${item?.code}\nForm'a bağlandı: ${id}`);
                                }}
                                sectorTypeValue={null}
                                onSectorTypeChange={(val) => {}}
                                sectorsValue={null}
                                onSectorsChange={(val) => {}}
                            />
                        </DraggableSection>
                        <DraggableSection id="emails" title="E-Postalar">
                            <EmailsGrid
                                label="E-Postalar"
                                rows={emailRows}
                                onChange={setEmailRows}
                                customerId={isEdit ? id : undefined}
                                autoSave={isEdit}
                            />
                        </DraggableSection>
                        <DraggableSection id="addresses" title="Adresler">
                            <AddressesGrid
                                label="Adresler"
                                rows={addressRows}
                                onChange={setAddressRows}
                                customerId={isEdit ? id : undefined}
                                autoSave={isEdit}
                            />
                        </DraggableSection>
                        <DraggableSection id="phones" title="Telefonlar">
                            <PhonesGrid
                                label="Telefonlar"
                                rows={phoneRows}
                                onChange={setPhoneRows}
                                customerId={isEdit ? id : undefined}
                                autoSave={isEdit}
                            />
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
                                {activeTab === 0 && <NotesSection
                                    register={register}
                                    errors={errors}
                                    rows={noteRows}
                                    onChange={setNoteRows}
                                    customerId={isEdit ? id : undefined}
                                    autoSave={isEdit}
                                />}
                                {activeTab === 1 && <SocialMediaSection register={register} errors={errors} />}
                            </Box>
                        </Box>
                    </DraggableSection>
                </DndContext>
            </form>
            <Footer />
            
            {/* Success Toast */}
            <MDSnackbar
                color="success"
                icon="check"
                title="🎉 Başarılı!"
                content={successMessage}
                dateTime="Şimdi"
                open={successSB}
                close={() => setSuccessSB(false)}
                autoHideDuration={3000}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                sx={{
                    "& .MuiSnackbar-root": {
                        top: "80px !important",
                    }
                }}
            />
            
            {/* Error Toast */}
            <MDSnackbar
                color="error"
                icon="warning"
                title="❌ Hata!"
                content={errorMessage}
                dateTime="Şimdi"
                open={errorSB}
                close={() => setErrorSB(false)}
                autoHideDuration={4000}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                sx={{
                    "& .MuiSnackbar-root": {
                        top: "80px !important",
                    }
                }}
            />
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


