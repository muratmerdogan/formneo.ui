import React, { useMemo, useState, useEffect } from "react";
import {
    Autocomplete,
    Box,
    Card,
    Chip,
    Grid,
    Icon,
    MenuItem,
    Select,
    Tab,
    Tabs,
    TextField,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Switch,
    FormControlLabel,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CustomersApi } from "api/generated/api";
import getConfiguration from "confiuration";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import {
    ObjectPage,
    ObjectPageTitle,
    MessageBoxType,
} from "@ui5/webcomponents-react";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { useBusy } from "layouts/pages/hooks/useBusy";
// Toast sistemi için mevcut alert sistemi kullanılacak

type Address = {
    id: string;
    type: string;
    country: string;
    city: string;
    district: string;
    postalCode: string;
    line1: string;
    line2: string;
    isDefaultBilling: boolean;
    isDefaultShipping: boolean;
};

type Official = {
    id: string;
    fullName: string;
    title?: string;
    department?: string;
    email: string;
    phone?: string;
    role: string;
    isPrimary: boolean;
    kvkkConsent: boolean;
};

type CustomerForm = {
    // Kimlik
    customerType: string;
    category: string;
    status: string;
    name: string;
    code: string;
    sectors: string[];
    taxOffice?: string;
    taxNumber?: string;
    logoFile?: File | null;
    note?: string;
    // İletişim
    emailPrimary: string;
    emailSecondary: string[];
    phone: string;
    mobile?: string;
    fax?: string;
    website?: string;
    preferedContact?: string;
    tags: string[];
    // Sosyal medya
    twitterUrl?: string;
    facebookUrl?: string;
    linkedinUrl?: string;
    instagramUrl?: string;
    // Adresler
    addresses: Address[];
    // Yetkililer
    officials: Official[];
    // Finans
    paymentMethod?: string;
    termDays?: number | null;
    currency?: string;
    discount?: number | null;
    creditLimit?: number | null;
    eInvoice: boolean;
    iban?: string;
    taxExemptionCode?: string;
    // Belgeler
    contractNo?: string;
    contractStart?: string;
    contractEnd?: string;
    documents: File[];
    // Sektörel
    sectorDetails: Record<string, any>;
    // Özel Alanlar
    customFields: Array<{ id: string; type: string; label: string; value: any }>;
    // Notlar & Günlük
    richNote?: string;
};

const CUSTOMER_TYPES = ["Bireysel", "Kurumsal", "Kamu", "Diğer"];
const CATEGORIES = ["Standart", "Gold", "Premium", "VIP"];
const STATUSES = ["Aktif", "Pasif", "Potansiyel", "Kara Liste"];
const SECTORS = ["Sağlık", "Güzellik/Wellness", "Sigorta", "KOBİ", "Diğer"];
const ADDRESS_TYPES = ["Fatura", "Teslimat", "Merkez", "Şube", "Diğer"];
const CONTACT_PREFS = ["E-posta", "Telefon", "SMS", "WhatsApp"];
const ROLES = ["Satınalma", "Teknik", "Finans", "Karar Verici", "Diğer"];
const CURRENCIES = ["TRY", "USD", "EUR", "GBP"];

function a11yProps(index: number) {
    return {
        id: `customer-tab-${index}`,
        "aria-controls": `customer-tabpanel-${index}`,
    } as const;
}

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`customer-tabpanel-${index}`}
            aria-labelledby={`customer-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 2, px: 1 }}>{children}</Box>}
        </div>
    );
}

function CustomerDetail(): JSX.Element {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const customerId = searchParams.get("id");
    const dispatchAlert = useAlert();
    const dispatchBusy = useBusy();

    const [activeTab, setActiveTab] = useState(0);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [dirty, setDirty] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Veri yükleme
    useEffect(() => {
        if (customerId) {
            loadCustomerData(customerId);
        }
    }, [customerId]);

    const loadCustomerData = async (id: string) => {
        setLoading(true);
        try {
            const api = new CustomersApi(getConfiguration());
            const response: any = await api.apiCustomersIdGet(id);
            const customer = response.data;

            if (customer) {
                // Form alanlarını doldur
                setForm(prev => ({
                    ...prev,
                    name: customer.name || "",
                    code: customer.code || "",
                    status: customer.status === 1 ? "Aktif" : "Pasif",
                    taxOffice: customer.taxOffice || "",
                    taxNumber: customer.taxNumber || "",
                    website: customer.website || "",
                    // Sosyal medya bilgileri
                    twitterUrl: customer.twitterUrl || "",
                    facebookUrl: customer.facebookUrl || "",
                    linkedinUrl: customer.linkedinUrl || "",
                    instagramUrl: customer.instagramUrl || "",
                    // ID değerlerini string olarak set et
                    customerType: customer.customerTypeId?.toString() || "Bireysel",
                    category: customer.categoryId?.toString() || "Standart",
                    sectors: customer.sectors || [],
                }));
            }
        } catch (error) {
            console.error("Müşteri verisi yüklenemedi:", error);
            dispatchAlert({ type: MessageBoxType.Error, message: "Müşteri verisi yüklenemedi" });
        } finally {
            setLoading(false);
        }
    };

    // Klavye kısayolları
    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
                e.preventDefault();
                handleSave(false);
            }
            if (e.key === "Escape") {
                e.preventDefault();
                if (dirty) setConfirmOpen(true);
                else navigate(-1);
            }
            if (e.ctrlKey && e.altKey && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
                e.preventDefault();
                const total = 9;
                setActiveTab((prev) => {
                    if (e.key === "ArrowRight") return (prev + 1) % total;
                    const next = prev - 1;
                    return next < 0 ? total - 1 : next;
                });
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [dirty]);

    const [form, setForm] = useState<CustomerForm>({
        customerType: "Bireysel",
        category: "Standart",
        status: "Aktif",
        name: "",
        code: "",
        sectors: [],
        taxOffice: "",
        taxNumber: "",
        logoFile: null,
        note: "",
        emailPrimary: "",
        emailSecondary: [],
        phone: "",
        mobile: "",
        fax: "",
        website: "",
        preferedContact: "E-posta",
        tags: [],
        // Sosyal medya
        twitterUrl: "",
        facebookUrl: "",
        linkedinUrl: "",
        instagramUrl: "",
        addresses: [],
        officials: [],
        paymentMethod: "",
        termDays: null,
        currency: "TRY",
        discount: null,
        creditLimit: null,
        eInvoice: false,
        iban: "",
        taxExemptionCode: "",
        contractNo: "",
        contractStart: "",
        contractEnd: "",
        documents: [],
        sectorDetails: {},
        customFields: [],
        richNote: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }
    ) => {
        const { name, value } = (e as any).target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setDirty(true);
    };

    const handleSelectArray = (name: keyof CustomerForm, values: string[]) => {
        setForm((p) => ({ ...p, [name]: values } as CustomerForm));
        setErrors((prev) => ({ ...prev, [name as string]: "" }));
        setDirty(true);
    };

    const addAddress = () => {
        setForm((p) => ({
            ...p,
            addresses: [
                ...p.addresses,
                {
                    id: crypto.randomUUID(),
                    type: "Fatura",
                    country: "Türkiye",
                    city: "",
                    district: "",
                    postalCode: "",
                    line1: "",
                    line2: "",
                    isDefaultBilling: p.addresses.length === 0,
                    isDefaultShipping: p.addresses.length === 0,
                },
            ],
        }));
        setDirty(true);
    };

    const removeAddress = (id: string) => {
        setForm((p) => ({ ...p, addresses: p.addresses.filter((a) => a.id !== id) }));
        setDirty(true);
    };

    const updateAddress = (id: string, field: keyof Address, value: any) => {
        setForm((p) => ({
            ...p,
            addresses: p.addresses.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
        }));
        setDirty(true);
    };

    const addOfficial = () => {
        setForm((p) => ({
            ...p,
            officials: [
                ...p.officials,
                {
                    id: crypto.randomUUID(),
                    fullName: "",
                    title: "",
                    department: "",
                    email: "",
                    phone: "",
                    role: "Satınalma",
                    isPrimary: p.officials.length === 0,
                    kvkkConsent: false,
                },
            ],
        }));
        setDirty(true);
    };

    const removeOfficial = (id: string) => {
        setForm((p) => ({ ...p, officials: p.officials.filter((o) => o.id !== id) }));
        setDirty(true);
    };

    const updateOfficial = (id: string, field: keyof Official, value: any) => {
        setForm((p) => ({
            ...p,
            officials: p.officials.map((o) => (o.id === id ? { ...o, [field]: value } : o)),
        }));
        setDirty(true);
    };

    const validateEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || "").toLowerCase());

    const validateIBAN = (iban?: string) => {
        const val = (iban || "").replace(/\s+/g, "").toUpperCase();
        if (!val) return true;
        // Basit doğrulama: ülke kodu + uzunluk kontrolü (TR: 26)
        if (val.startsWith("TR") && val.length !== 26) return false;
        if (!/^[A-Z]{2}[0-9A-Z]{13,32}$/.test(val)) return false;
        return true;
    };

    const validateTab = (index: number): boolean => {
        const newErrors: Record<string, string> = {};
        if (index === 0) {
            if (!form.name) newErrors.name = "Zorunlu alan";
            if (!form.emailPrimary) newErrors.emailPrimary = "Zorunlu alan";
            if (form.emailPrimary && !validateEmail(form.emailPrimary)) newErrors.emailPrimary = "Geçersiz e-posta";
            if (!form.phone) newErrors.phone = "Zorunlu alan";
            if (form.eInvoice && !form.taxNumber) newErrors.taxNumber = "e-Fatura için vergi no zorunlu";
        }
        if (index === 2) {
            if (!form.addresses || form.addresses.length === 0) newErrors.addresses = "En az bir adres ekleyin";
            form.addresses.forEach((a, i) => {
                if (!a.line1) newErrors[`addr_${a.id}_line1`] = `Adres ${i + 1}: Adres Satırı 1 zorunlu`;
            });
        }
        if (index === 5) {
            if (form.contractStart && form.contractEnd && form.contractEnd < form.contractStart) {
                newErrors.contractEnd = "Bitiş tarihi başlangıçtan küçük olamaz";
            }
            if (!validateIBAN(form.iban)) newErrors.iban = "Geçersiz IBAN";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        // Geçerli sekmeyi doğrula ama geçişi engelleme
        validateTab(activeTab);
        setActiveTab(newValue);
    };

    const handleUploadLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!/(png|jpg|jpeg)$/i.test(file.name)) {
            setErrors((p) => ({ ...p, logoFile: "Sadece png/jpg/jpeg" } as any));
            return;
        }
        setForm((p) => ({ ...p, logoFile: file }));
    };

    const handleUploadDocuments = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const valid = files.filter((f) => /(pdf|png|jpg|jpeg)$/i.test(f.name));
        const limited = [...form.documents, ...valid].slice(0, 10);
        setForm((p) => ({ ...p, documents: limited }));
    };

    const handleSave = async (andNew?: boolean) => {
        if (!validateTab(activeTab) || !validateTab(2)) return; // kritik kontroller
        try {
            dispatchBusy({ isBusy: true });
            // API entegrasyonu burada yapılacak
            
            // Başarılı kaydetme mesajı
            alert("🎉 Müşteri bilgileri başarıyla kaydedildi!");
            
            dispatchAlert({ message: "Müşteri başarıyla kaydedildi", type: MessageBoxType.Success });
            setDirty(false);
            if (andNew) {
                navigate("/customer/detail");
            }
        } catch (error) {
            console.error("Save error:", error);
            
            // Hata mesajı
            alert("❌ Kaydetme sırasında bir hata oluştu! Lütfen tekrar deneyin.");
        } finally {
            dispatchBusy({ isBusy: false });
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ObjectPage
                mode="Default"
                hidePinButton
                style={{
                    height: "calc(100vh - 120px)",
                    maxHeight: "calc(100vh - 120px)",
                    overflowY: "auto",
                    marginTop: "-10px",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.1)",
                }}
                titleArea={
                    <ObjectPageTitle
                        style={{
                            paddingTop: "24px",
                            paddingLeft: "24px",
                            paddingRight: "24px",
                            backgroundColor: "#ffffff",
                            cursor: "default",
                        }}
                        actionsBar={
                            <MDBox style={{ marginTop: "15px", marginRight: "15px" }}>
                                <MDButton
                                    data-testid="save-btn"
                                    variant="gradient"
                                    color="info"
                                    onClick={() => handleSave(false)}
                                    size="small"
                                    startIcon={<Icon>save</Icon>}
                                    sx={{ mr: "8px" }}
                                >
                                    Kaydet
                                </MDButton>
                                <MDButton
                                    data-testid="save-new-btn"
                                    variant="outlined"
                                    color="info"
                                    onClick={() => handleSave(true)}
                                    size="small"
                                    startIcon={<Icon>add</Icon>}
                                >
                                    Kaydet & Yeni
                                </MDButton>
                                <MDButton
                                    data-testid="cancel-btn"
                                    variant="text"
                                    color="secondary"
                                    onClick={() => (dirty ? setConfirmOpen(true) : navigate(-1))}
                                    size="small"
                                    sx={{ ml: "8px" }}
                                >
                                    İptal
                                </MDButton>
                            </MDBox>
                        }
                    >
                        <MDBox>
                            <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: "#344767", mb: "4px" }}>
                                Müşteri Tanımlama
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#7b809a" }}>
                                Müşteri bilgilerini girin ve yönetin
                            </Typography>
                        </MDBox>
                    </ObjectPageTitle>
                }
            >
                <Card style={{ padding: 24 }}>
                    <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} aria-labelledby="unsaved-changes-title">
                        <DialogTitle id="unsaved-changes-title">Kaydedilmemiş değişiklikler var</DialogTitle>
                        <DialogContent>Sayfadan ayrılmak istediğinize emin misiniz?</DialogContent>
                        <DialogActions>
                            <MDButton onClick={() => setConfirmOpen(false)} color="secondary">Vazgeç</MDButton>
                            <MDButton onClick={() => { setConfirmOpen(false); navigate(-1); }} color="error">Ayrıl</MDButton>
                        </DialogActions>
                    </Dialog>
                    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                        <Tabs value={activeTab} onChange={handleTabChange} aria-label="müşteri sekmeleri" variant="scrollable" scrollButtons="auto">
                            <Tab label={`Kimlik${errors.name || errors.taxNumber ? " •" : ""}`} {...a11yProps(0)} />
                            <Tab label={`İletişim${errors.emailPrimary || errors.phone ? " •" : ""}`} {...a11yProps(1)} />
                            <Tab label={`Adresler${errors.addresses ? " •" : ""}`} {...a11yProps(2)} />
                            <Tab label={"Yetkililer"} {...a11yProps(3)} />
                            <Tab label={`Finans${errors.iban || errors.contractEnd ? " •" : ""}`} {...a11yProps(4)} />
                            <Tab label={"Belgeler"} {...a11yProps(5)} />
                            <Tab label={"Sektörel"} {...a11yProps(6)} />
                            <Tab label={"Özel Alanlar"} {...a11yProps(7)} />
                            <Tab label={"Notlar"} {...a11yProps(8)} />
                        </Tabs>
                    </Box>

                    <TabPanel value={activeTab} index={0}>
                        <Grid container spacing={{ xs: 2, md: 2.5 }}>
                            <Grid item xs={12} md={4} lg={3}>
                                <TextField
                                    select
                                    fullWidth
                                    name="customerType"
                                    label="Müşteri Tipi"
                                    value={form.customerType}
                                    onChange={handleChange}
                                    inputProps={{ "data-testid": "customerType" }}
                                >
                                    {CUSTOMER_TYPES.map((t) => (
                                        <MenuItem key={t} value={t}>{t}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={4} lg={3}>
                                <TextField
                                    select
                                    fullWidth
                                    name="category"
                                    label="Kategori"
                                    value={form.category}
                                    onChange={handleChange}
                                    inputProps={{ "data-testid": "category" }}
                                >
                                    {CATEGORIES.map((t) => (
                                        <MenuItem key={t} value={t}>{t}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={4} lg={3}>
                                <TextField
                                    select
                                    fullWidth
                                    name="status"
                                    label="Durum"
                                    value={form.status}
                                    onChange={handleChange}
                                    inputProps={{ "data-testid": "status" }}
                                >
                                    {STATUSES.map((t) => (
                                        <MenuItem key={t} value={t}>{t}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={6} lg={4}>
                                <MDInput
                                    label="Müşteri Adı"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    aria-required
                                    inputProps={{ "data-testid": "name" }}
                                    error={Boolean(errors.name)}
                                    helperText={errors.name}
                                />
                            </Grid>
                            <Grid item xs={12} md={3} lg={4}>
                                <MDInput
                                    label="Müşteri Kodu"
                                    name="code"
                                    value={form.code}
                                    onChange={handleChange}
                                    fullWidth
                                    inputProps={{ "data-testid": "code" }}
                                />
                            </Grid>
                            <Grid item xs={12} md={3} lg={4}>
                                <Autocomplete
                                    multiple
                                    options={SECTORS}
                                    value={form.sectors}
                                    onChange={(e, v) => handleSelectArray("sectors", v)}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Sektör" placeholder="Seçiniz" />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <MDInput
                                    label="Vergi Dairesi"
                                    name="taxOffice"
                                    value={form.taxOffice}
                                    onChange={handleChange}
                                    fullWidth
                                    inputProps={{ "data-testid": "taxOffice" }}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <MDInput
                                    label="Vergi No"
                                    name="taxNumber"
                                    value={form.taxNumber}
                                    onChange={handleChange}
                                    fullWidth
                                    inputProps={{ "data-testid": "taxNumber" }}
                                    error={Boolean(errors.taxNumber)}
                                    helperText={errors.taxNumber}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    type="file"
                                    fullWidth
                                    inputProps={{ accept: "image/png,image/jpeg", "data-testid": "logoFile" }}
                                    label="Logo / Profil Görseli"
                                    onChange={handleUploadLogo}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    label="Kısa Not"
                                    name="note"
                                    value={form.note}
                                    onChange={handleChange}
                                    fullWidth
                                    inputProps={{ maxLength: 280, "data-testid": "note" }}
                                    multiline
                                    minRows={1}
                                    maxRows={4}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    <TabPanel value={activeTab} index={1}>
                        <Grid container spacing={{ xs: 2, md: 2.5 }}>
                            <Grid item xs={12} md={4} lg={4}>
                                <MDInput
                                    label="Birincil E-posta"
                                    name="emailPrimary"
                                    value={form.emailPrimary}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    aria-required
                                    inputProps={{ "data-testid": "emailPrimary" }}
                                    error={Boolean(errors.emailPrimary)}
                                    helperText={errors.emailPrimary}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                                <Autocomplete
                                    multiple
                                    freeSolo
                                    value={form.emailSecondary}
                                    onChange={(e, v) => handleSelectArray("emailSecondary", v)}
                                    options={[]}
                                    renderTags={(value: readonly string[], getTagProps) =>
                                        value.map((option: string, index: number) => (
                                            <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                                        ))
                                    }
                                    renderInput={(params) => <TextField {...params} label="İkincil E-postalar" />}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                                <MDInput
                                    label="Telefon"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    aria-required
                                    inputProps={{ "data-testid": "phone" }}
                                    error={Boolean(errors.phone)}
                                    helperText={errors.phone}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                                <MDInput label="Mobil Telefon" name="mobile" value={form.mobile} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                                <MDInput label="Faks" name="fax" value={form.fax} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <MDInput label="Web Sitesi" name="website" value={form.website} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <MDInput label="Twitter URL" name="twitterUrl" value={form.twitterUrl} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <MDInput label="Facebook URL" name="facebookUrl" value={form.facebookUrl} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <MDInput label="LinkedIn URL" name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <MDInput label="Instagram URL" name="instagramUrl" value={form.instagramUrl} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    select
                                    fullWidth
                                    name="preferedContact"
                                    label="Tercih Edilen İletişim Yöntemi"
                                    value={form.preferedContact}
                                    onChange={handleChange}
                                >
                                    {CONTACT_PREFS.map((t) => (
                                        <MenuItem key={t} value={t}>{t}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={8} lg={8}>
                                <Autocomplete
                                    multiple
                                    freeSolo
                                    value={form.tags}
                                    onChange={(e, v) => handleSelectArray("tags", v)}
                                    options={[]}
                                    renderInput={(params) => <TextField {...params} label="Etiketler" placeholder="Etiket ekle" />}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    <TabPanel value={activeTab} index={2}>
                        <MDBox mb={1}>
                            <MDButton data-testid="add-address" variant="outlined" color="info" onClick={addAddress} startIcon={<Icon>add</Icon>}>
                                Adres Ekle
                            </MDButton>
                            {errors.addresses && (
                                <MDTypography color="error" variant="caption" ml={2}>{errors.addresses}</MDTypography>
                            )}
                        </MDBox>
                        <Grid container spacing={{ xs: 2, md: 2.5 }}>
                            {form.addresses.map((a) => (
                                <Grid item xs={12} key={a.id}>
                                    <Card style={{ padding: 12 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={3} lg={3}>
                                                <TextField select fullWidth label="Adres Türü" value={a.type} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAddress(a.id, "type", e.target.value)}>
                                                    {ADDRESS_TYPES.map((t) => (<MenuItem key={t} value={t}>{t}</MenuItem>))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} md={3} lg={3}>
                                                <MDInput label="Ülke" value={a.country} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateAddress(a.id, "country", e.target.value)} fullWidth />
                                            </Grid>
                                            <Grid item xs={12} md={3} lg={3}>
                                                <MDInput label="Şehir" value={a.city} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateAddress(a.id, "city", e.target.value)} fullWidth />
                                            </Grid>
                                            <Grid item xs={12} md={3} lg={3}>
                                                <MDInput label="İlçe" value={a.district} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateAddress(a.id, "district", e.target.value)} fullWidth />
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <MDInput label="Posta Kodu" value={a.postalCode} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateAddress(a.id, "postalCode", e.target.value)} fullWidth />
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={6}>
                                                <MDInput
                                                    label="Adres Satırı 1"
                                                    value={a.line1}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateAddress(a.id, "line1", e.target.value)}
                                                    fullWidth
                                                    required
                                                    aria-required
                                                    inputProps={{ "data-testid": `addr-${a.id}-line1` }}
                                                    error={Boolean(errors[`addr_${a.id}_line1`])}
                                                    helperText={errors[`addr_${a.id}_line1`]}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={6}>
                                                <MDInput label="Adres Satırı 2" value={a.line2} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateAddress(a.id, "line2", e.target.value)} fullWidth />
                                            </Grid>

                                            <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                                                <Box>
                                                    <MDButton size="small" variant="outlined" color={a.isDefaultBilling ? "info" : "secondary"} onClick={() => updateAddress(a.id, "isDefaultBilling", !a.isDefaultBilling)} sx={{ mr: 1 }}>
                                                        Varsayılan Fatura
                                                    </MDButton>
                                                    <MDButton size="small" variant="outlined" color={a.isDefaultShipping ? "info" : "secondary"} onClick={() => updateAddress(a.id, "isDefaultShipping", !a.isDefaultShipping)}>
                                                        Varsayılan Teslimat
                                                    </MDButton>
                                                </Box>
                                                <MDButton size="small" color="error" variant="text" onClick={() => removeAddress(a.id)} startIcon={<Icon>delete</Icon>}>
                                                    Sil
                                                </MDButton>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </TabPanel>

                    <TabPanel value={activeTab} index={3}>
                        <MDBox mb={1}>
                            <MDButton data-testid="add-official" variant="outlined" color="info" onClick={addOfficial} startIcon={<Icon>add</Icon>}>
                                Yetkili Ekle
                            </MDButton>
                        </MDBox>
                        <Grid container spacing={{ xs: 2, md: 2.5 }}>
                            {form.officials.map((o) => (
                                <Grid item xs={12} key={o.id}>
                                    <Card style={{ padding: 12 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={4}>
                                                <MDInput label="Ad Soyad" value={o.fullName} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateOfficial(o.id, "fullName", e.target.value)} fullWidth required aria-required />
                                            </Grid>
                                            <Grid item xs={12} md={2}>
                                                <MDInput label="Ünvan" value={o.title} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateOfficial(o.id, "title", e.target.value)} fullWidth />
                                            </Grid>
                                            <Grid item xs={12} md={2}>
                                                <MDInput label="Departman" value={o.department} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateOfficial(o.id, "department", e.target.value)} fullWidth />
                                            </Grid>
                                            <Grid item xs={12} md={2}>
                                                <MDInput label="E-posta" value={o.email} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateOfficial(o.id, "email", e.target.value)} fullWidth required aria-required />
                                            </Grid>
                                            <Grid item xs={12} md={2}>
                                                <MDInput label="Telefon" value={o.phone} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateOfficial(o.id, "phone", e.target.value)} fullWidth />
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <TextField select fullWidth label="Rol/İlişki" value={o.role} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateOfficial(o.id, "role", e.target.value)}>
                                                    {ROLES.map((t) => (<MenuItem key={t} value={t}>{t}</MenuItem>))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} md={9} display="flex" justifyContent="space-between" alignItems="center">
                                                <Box>
                                                    <MDButton size="small" variant="outlined" color={o.isPrimary ? "info" : "secondary"} onClick={() => updateOfficial(o.id, "isPrimary", !o.isPrimary)} sx={{ mr: 1 }}>
                                                        Birincil İrtibat
                                                    </MDButton>
                                                    <MDButton size="small" variant="outlined" color={o.kvkkConsent ? "info" : "secondary"} onClick={() => updateOfficial(o.id, "kvkkConsent", !o.kvkkConsent)}>
                                                        KVKK Onam
                                                    </MDButton>
                                                </Box>
                                                <MDButton size="small" color="error" variant="text" onClick={() => removeOfficial(o.id)} startIcon={<Icon>delete</Icon>}>
                                                    Sil
                                                </MDButton>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </TabPanel>

                    <TabPanel value={activeTab} index={4}>
                        <Grid container spacing={{ xs: 2, md: 2.5 }}>
                            <Grid item xs={12} md={3} lg={3}>
                                <MDInput label="Ödeme Yöntemi" name="paymentMethod" value={form.paymentMethod} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12} md={3} lg={3}>
                                <MDInput type="number" label="Vade (gün)" name="termDays" value={form.termDays ?? ""} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12} md={3} lg={3}>
                                <TextField select fullWidth name="currency" label="Para Birimi" value={form.currency} onChange={handleChange}>
                                    {CURRENCIES.map((t) => (<MenuItem key={t} value={t}>{t}</MenuItem>))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={3} lg={3}>
                                <MDInput type="number" label="İskonto (%)" name="discount" value={form.discount ?? ""} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12} md={3} lg={3}>
                                <MDInput type="number" label="Kredi Limiti" name="creditLimit" value={form.creditLimit ?? ""} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12} md={3} lg={3}>
                                <MDButton size="small" variant="outlined" color={form.eInvoice ? "info" : "secondary"} onClick={() => setForm((p) => ({ ...p, eInvoice: !p.eInvoice }))}>
                                    e-Fatura: {form.eInvoice ? "Aktif" : "Pasif"}
                                </MDButton>
                            </Grid>
                            <Grid item xs={12} md={3} lg={3}>
                                <MDInput label="IBAN" name="iban" value={form.iban} onChange={handleChange} fullWidth error={Boolean(errors.iban)} helperText={errors.iban} />
                            </Grid>
                            <Grid item xs={12} md={3} lg={3}>
                                <MDInput label="Vergi Muafiyet Kodu" name="taxExemptionCode" value={form.taxExemptionCode} onChange={handleChange} fullWidth />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    <TabPanel value={activeTab} index={5}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3} lg={3}>
                                <MDInput label="Sözleşme No" name="contractNo" value={form.contractNo} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField type="date" label="Başlangıç Tarihi" name="contractStart" value={form.contractStart} onChange={handleChange as any} InputLabelProps={{ shrink: true }} fullWidth />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField type="date" label="Bitiş Tarihi" name="contractEnd" value={form.contractEnd} onChange={handleChange as any} InputLabelProps={{ shrink: true }} fullWidth error={Boolean(errors.contractEnd)} helperText={errors.contractEnd} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField type="file" fullWidth inputProps={{ multiple: true, accept: ".pdf,image/png,image/jpeg" }} label="Belge Yükle" onChange={handleUploadDocuments} />
                            </Grid>
                        </Grid>
                        {form.documents.length > 0 && (
                            <MDBox mt={2}>
                                <MDTypography variant="button">Yüklü Belgeler ({form.documents.length}/10)</MDTypography>
                            </MDBox>
                        )}
                    </TabPanel>

                    <TabPanel value={activeTab} index={6}>
                        {form.sectors.includes("Sağlık") && (
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={3}><MDInput label="Branş" name="health_branch" value={form.sectorDetails.health_branch || ""} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, sectorDetails: { ...p.sectorDetails, health_branch: e.target.value } }))} fullWidth /></Grid>
                                <Grid item xs={12} md={3}><MDInput label="Sicil No" name="health_reg" value={form.sectorDetails.health_reg || ""} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, sectorDetails: { ...p.sectorDetails, health_reg: e.target.value } }))} fullWidth /></Grid>
                                <Grid item xs={12} md={3}><MDInput label="Randevu Saatleri" name="health_hours" value={form.sectorDetails.health_hours || ""} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, sectorDetails: { ...p.sectorDetails, health_hours: e.target.value } }))} fullWidth /></Grid>
                                <Grid item xs={12} md={3}><MDInput label="Sigorta Anlaşmaları" name="health_ins" value={form.sectorDetails.health_ins || ""} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, sectorDetails: { ...p.sectorDetails, health_ins: e.target.value } }))} fullWidth /></Grid>
                            </Grid>
                        )}
                        {form.sectors.includes("Güzellik/Wellness") && (
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}><MDInput label="Hizmet Türleri" name="well_services" value={form.sectorDetails.well_services || ""} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, sectorDetails: { ...p.sectorDetails, well_services: e.target.value } }))} fullWidth /></Grid>
                                <Grid item xs={12} md={4}><MDInput label="Lisans Belgeleri" name="well_licenses" value={form.sectorDetails.well_licenses || ""} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, sectorDetails: { ...p.sectorDetails, well_licenses: e.target.value } }))} fullWidth /></Grid>
                            </Grid>
                        )}
                        {form.sectors.includes("Sigorta") && (
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={3}><MDInput label="Poliçe No" name="ins_policy" value={form.sectorDetails.ins_policy || ""} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, sectorDetails: { ...p.sectorDetails, ins_policy: e.target.value } }))} fullWidth /></Grid>
                                <Grid item xs={12} md={3}><MDInput label="Sigorta Şirketi" name="ins_company" value={form.sectorDetails.ins_company || ""} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, sectorDetails: { ...p.sectorDetails, ins_company: e.target.value } }))} fullWidth /></Grid>
                                <Grid item xs={12} md={3}><MDInput label="Branş" name="ins_branch" value={form.sectorDetails.ins_branch || ""} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, sectorDetails: { ...p.sectorDetails, ins_branch: e.target.value } }))} fullWidth /></Grid>
                                <Grid item xs={12} md={3}><MDInput label="Teminat Özeti" name="ins_cover" value={form.sectorDetails.ins_cover || ""} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, sectorDetails: { ...p.sectorDetails, ins_cover: e.target.value } }))} fullWidth /></Grid>
                            </Grid>
                        )}
                        {form.sectors.includes("KOBİ") && (
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={3}><MDInput label="MERSİS No" name="sme_mersis" value={form.sectorDetails.sme_mersis || ""} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, sectorDetails: { ...p.sectorDetails, sme_mersis: e.target.value } }))} fullWidth /></Grid>
                                <Grid item xs={12} md={3}><MDInput type="number" label="Çalışan Sayısı" name="sme_employees" value={form.sectorDetails.sme_employees || ""} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, sectorDetails: { ...p.sectorDetails, sme_employees: (e.target as HTMLInputElement).value } }))} fullWidth /></Grid>
                                <Grid item xs={12} md={3}><MDInput type="number" label="Yıllık Ciro" name="sme_revenue" value={form.sectorDetails.sme_revenue || ""} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, sectorDetails: { ...p.sectorDetails, sme_revenue: (e.target as HTMLInputElement).value } }))} fullWidth /></Grid>
                            </Grid>
                        )}
                    </TabPanel>

                    <TabPanel value={activeTab} index={7}>
                        <MDBox mb={1}>
                            <MDButton size="small" variant="outlined" color="info" startIcon={<Icon>add</Icon>} onClick={() => setForm((p) => ({ ...p, customFields: [...p.customFields, { id: crypto.randomUUID(), type: "metin", label: "Yeni Alan", value: "" }] }))}>
                                Özel Alan Ekle
                            </MDButton>
                        </MDBox>
                        <Grid container spacing={2}>
                            {form.customFields.map((f, idx) => (
                                <Grid item xs={12} md={4} key={f.id}>
                                    <Card style={{ padding: 12 }}>
                                        <MDInput label="Etiket" value={f.label} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, customFields: p.customFields.map((x) => x.id === f.id ? { ...x, label: e.target.value } : x) }))} fullWidth />
                                        <TextField select fullWidth label="Tür" value={f.type} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, customFields: p.customFields.map((x) => x.id === f.id ? { ...x, type: e.target.value } : x) }))} sx={{ mt: 1 }}>
                                            <MenuItem value="metin">Metin</MenuItem>
                                            <MenuItem value="sayi">Sayı</MenuItem>
                                            <MenuItem value="tarih">Tarih</MenuItem>
                                            <MenuItem value="secim">Seçim</MenuItem>
                                        </TextField>
                                        <MDButton size="small" color="error" variant="text" startIcon={<Icon>delete</Icon>} onClick={() => setForm((p) => ({ ...p, customFields: p.customFields.filter((x) => x.id !== f.id) }))} sx={{ mt: 1 }}>
                                            Sil
                                        </MDButton>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </TabPanel>

                    <TabPanel value={activeTab} index={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    multiline
                                    minRows={4}
                                    label="Serbest Not"
                                    name="richNote"
                                    value={form.richNote}
                                    onChange={handleChange}
                                    fullWidth
                                    inputProps={{ "data-testid": "richNote" }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Card style={{ padding: 12 }}>
                                    <MDTypography variant="button">İşlem Geçmişi</MDTypography>
                                    <Box component="ul" sx={{ pl: 3, mb: 0 }}>
                                        <li>01.01.2025 - Müşteri oluşturuldu</li>
                                        <li>05.01.2025 - Adres eklendi</li>
                                        <li>12.01.2025 - Not güncellendi</li>
                                    </Box>
                                </Card>
                            </Grid>
                        </Grid>
                    </TabPanel>
                </Card>
            </ObjectPage>
            <Footer />
        </DashboardLayout>
    );
}

export default CustomerDetail;


