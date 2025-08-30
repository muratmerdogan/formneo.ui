/**
 * FormNeo Şirket Kayıt Sayfası
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// @mui material components
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { styled } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import PageLayout from "examples/LayoutContainers/PageLayout";

// Images
import formNeoLogo from "assets/images/logoson.svg";

// Icons
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import PaymentIcon from "@mui/icons-material/Payment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LanguageIcon from "@mui/icons-material/Language";

// Styled components
const RegisterContainer = styled(MDBox)(({ theme }) => ({
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
    padding: theme.spacing(6, 0),
}));

const StepCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3),
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    backgroundColor: "white",
    border: "1px solid rgba(25, 118, 210, 0.1)",
}));

const PlanCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "2px solid transparent",
    borderRadius: "16px",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 24px rgba(25, 118, 210, 0.15)",
        borderColor: "#1976d2",
    }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    "& .MuiInputLabel-root": {
        color: "#666",
        fontSize: "16px",
        fontWeight: 500,
        transform: "translate(14px, 16px) scale(1)",
        "&.Mui-focused": {
            color: "#1976d2",
        },
        "&.MuiInputLabel-shrink": {
            transform: "translate(14px, -9px) scale(0.75)",
            backgroundColor: "white",
            padding: "0 8px",
        }
    },
    "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        backgroundColor: "#f8f9fa",
        transition: "all 0.3s ease",
        fontSize: "16px",
        minHeight: "56px",
        "&:hover": {
            backgroundColor: "#f0f2f5",
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1976d2",
            }
        },
        "&.Mui-focused": {
            backgroundColor: "white",
            boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.1)",
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1976d2",
                borderWidth: "2px",
            }
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#e0e6ed",
            borderWidth: "1px",
        },
        "& .MuiSelect-select": {
            padding: "16px 14px",
            display: "flex",
            alignItems: "center",
        }
    }
}));

const StyledMDInput = styled(MDInput)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        backgroundColor: "#f8f9fa",
        transition: "all 0.3s ease",
        "&:hover": {
            backgroundColor: "#f0f2f5",
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1976d2",
            }
        },
        "&.Mui-focused": {
            backgroundColor: "white",
            boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.1)",
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1976d2",
                borderWidth: "2px",
            }
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#e0e6ed",
            borderWidth: "1px",
        }
    }
}));

interface CompanyData {
    companyName: string;
    companyEmail: string;
    companyPhone: string;
    companyAddress: string;
    taxNumber: string;
    sector: string;
    employeeCount: string;
}

interface AdminData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

function CompanyRegister(): JSX.Element {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [activeStep, setActiveStep] = useState(0);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'tr' ? 'en' : 'tr';
        i18n.changeLanguage(newLang);
    };
    const [selectedPlan, setSelectedPlan] = useState<string>("professional");
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const [companyData, setCompanyData] = useState<CompanyData>({
        companyName: "",
        companyEmail: "",
        companyPhone: "",
        companyAddress: "",
        taxNumber: "",
        sector: "",
        employeeCount: ""
    });

    const [adminData, setAdminData] = useState<AdminData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const steps = [
        t('ns1:CompanyRegister.Steps.CompanyInfo'),
        t('ns1:CompanyRegister.Steps.AdminUser'),
        t('ns1:CompanyRegister.Steps.PlanSelection')
    ];

    const plans = [
        {
            id: "starter",
            name: "Başlangıç",
            price: "99",
            period: "ay",
            description: "Küçük ekipler için",
            features: [
                "5 aktif form",
                "100 form gönderimi/ay",
                "Temel raporlar",
                "E-posta desteği"
            ],
            recommended: false
        },
        {
            id: "professional",
            name: "Profesyonel",
            price: "299",
            period: "ay",
            description: "Büyüyen işletmeler için",
            features: [
                "Sınırsız form",
                "5,000 form gönderimi/ay",
                "Gelişmiş raporlar",
                "Öncelikli destek",
                "API erişimi"
            ],
            recommended: true
        },
        {
            id: "enterprise",
            name: "Kurumsal",
            price: "Özel",
            period: "fiyat",
            description: "Büyük organizasyonlar için",
            features: [
                "Sınırsız her şey",
                "Özel sunucu",
                "SLA garantisi",
                "Özel eğitim"
            ],
            recommended: false
        }
    ];

    const sectors = [
        "Teknoloji",
        "Finans",
        "Sağlık",
        "Eğitim",
        "Perakende",
        "İmalat",
        "İnşaat",
        "Turizm",
        "Lojistik",
        "Diğer"
    ];

    const employeeCounts = [
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "500+"
    ];

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(activeStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handleSubmit = async () => {
        // Burada API çağrısı yapılacak
        console.log("Şirket Kayıt Verileri:", {
            company: companyData,
            admin: adminData,
            plan: selectedPlan,
            agreedToTerms
        });

        // Başarılı kayıt sonrası login sayfasına yönlendir
        navigate("/authentication/sign-in/cover", {
            state: {
                message: "Kayıt işleminiz başarıyla tamamlandı! Giriş yapabilirsiniz.",
                email: adminData.email
            }
        });
    };

    const isStepValid = () => {
        switch (activeStep) {
            case 0:
                return companyData.companyName &&
                    companyData.companyEmail &&
                    companyData.taxNumber &&
                    companyData.sector &&
                    companyData.employeeCount;
            case 1:
                return adminData.firstName &&
                    adminData.lastName &&
                    adminData.email &&
                    adminData.password &&
                    adminData.confirmPassword &&
                    adminData.password === adminData.confirmPassword;
            case 2:
                return selectedPlan && agreedToTerms;
            default:
                return false;
        }
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <StepCard>
                        <MDBox display="flex" alignItems="center" mb={3}>
                            <BusinessIcon sx={{ fontSize: 32, color: "#1976d2", mr: 2 }} />
                            <MDTypography variant="h4" fontWeight="bold">
                                Şirket Bilgileri
                            </MDTypography>
                        </MDBox>

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <StyledMDInput
                                    label={t('ns1:CompanyRegister.CompanyInfo.CompanyName') + ' *'}
                                    fullWidth
                                    value={companyData.companyName}
                                    onChange={(e: any) => setCompanyData({ ...companyData, companyName: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledMDInput
                                    label={t('ns1:CompanyRegister.AdminUser.Email') + ' *'}
                                    type="email"
                                    fullWidth
                                    value={companyData.companyEmail}
                                    onChange={(e: any) => setCompanyData({ ...companyData, companyEmail: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledMDInput
                                    label="Telefon"
                                    fullWidth
                                    value={companyData.companyPhone}
                                    onChange={(e: any) => setCompanyData({ ...companyData, companyPhone: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledMDInput
                                    label="Vergi Numarası *"
                                    fullWidth
                                    value={companyData.taxNumber}
                                    onChange={(e: any) => setCompanyData({ ...companyData, taxNumber: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <StyledMDInput
                                    label="Adres"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    value={companyData.companyAddress}
                                    onChange={(e: any) => setCompanyData({ ...companyData, companyAddress: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledFormControl fullWidth>
                                    <InputLabel>Sektör *</InputLabel>
                                    <Select
                                        value={companyData.sector}
                                        onChange={(e) => setCompanyData({ ...companyData, sector: e.target.value })}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    borderRadius: "12px",
                                                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                                                    marginTop: "8px",
                                                    "& .MuiMenuItem-root": {
                                                        padding: "12px 16px",
                                                        fontSize: "16px",
                                                        borderRadius: "8px",
                                                        margin: "4px 8px",
                                                        transition: "all 0.2s ease",
                                                        "&:hover": {
                                                            backgroundColor: "rgba(25, 118, 210, 0.08)",
                                                            transform: "translateX(4px)",
                                                        },
                                                        "&.Mui-selected": {
                                                            backgroundColor: "rgba(25, 118, 210, 0.12)",
                                                            color: "#1976d2",
                                                            fontWeight: 600,
                                                            "&:hover": {
                                                                backgroundColor: "rgba(25, 118, 210, 0.16)",
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        {sectors.map((sector) => (
                                            <MenuItem key={sector} value={sector}>
                                                {sector}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </StyledFormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledFormControl fullWidth>
                                    <InputLabel>Çalışan Sayısı *</InputLabel>
                                    <Select
                                        value={companyData.employeeCount}
                                        onChange={(e) => setCompanyData({ ...companyData, employeeCount: e.target.value })}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    borderRadius: "12px",
                                                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                                                    marginTop: "8px",
                                                    "& .MuiMenuItem-root": {
                                                        padding: "12px 16px",
                                                        fontSize: "16px",
                                                        borderRadius: "8px",
                                                        margin: "4px 8px",
                                                        transition: "all 0.2s ease",
                                                        "&:hover": {
                                                            backgroundColor: "rgba(25, 118, 210, 0.08)",
                                                            transform: "translateX(4px)",
                                                        },
                                                        "&.Mui-selected": {
                                                            backgroundColor: "rgba(25, 118, 210, 0.12)",
                                                            color: "#1976d2",
                                                            fontWeight: 600,
                                                            "&:hover": {
                                                                backgroundColor: "rgba(25, 118, 210, 0.16)",
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        {employeeCounts.map((count) => (
                                            <MenuItem key={count} value={count}>
                                                {count}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </StyledFormControl>
                            </Grid>
                        </Grid>
                    </StepCard>
                );

            case 1:
                return (
                    <StepCard>
                        <MDBox display="flex" alignItems="center" mb={3}>
                            <PersonIcon sx={{ fontSize: 32, color: "#1976d2", mr: 2 }} />
                            <MDTypography variant="h4" fontWeight="bold">
                                Yönetici Hesabı
                            </MDTypography>
                        </MDBox>

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <StyledMDInput
                                    label="Ad *"
                                    fullWidth
                                    value={adminData.firstName}
                                    onChange={(e: any) => setAdminData({ ...adminData, firstName: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledMDInput
                                    label="Soyad *"
                                    fullWidth
                                    value={adminData.lastName}
                                    onChange={(e: any) => setAdminData({ ...adminData, lastName: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledMDInput
                                    label="E-posta *"
                                    type="email"
                                    fullWidth
                                    value={adminData.email}
                                    onChange={(e: any) => setAdminData({ ...adminData, email: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledMDInput
                                    label="Telefon"
                                    fullWidth
                                    value={adminData.phone}
                                    onChange={(e: any) => setAdminData({ ...adminData, phone: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledMDInput
                                    label="Şifre *"
                                    type="password"
                                    fullWidth
                                    value={adminData.password}
                                    onChange={(e: any) => setAdminData({ ...adminData, password: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledMDInput
                                    label="Şifre Tekrar *"
                                    type="password"
                                    fullWidth
                                    value={adminData.confirmPassword}
                                    onChange={(e: any) => setAdminData({ ...adminData, confirmPassword: e.target.value })}
                                    error={adminData.confirmPassword && adminData.password !== adminData.confirmPassword}
                                />
                                {adminData.confirmPassword && adminData.password !== adminData.confirmPassword && (
                                    <MDTypography variant="caption" color="error" mt={1}>
                                        Şifreler eşleşmiyor
                                    </MDTypography>
                                )}
                            </Grid>
                        </Grid>
                    </StepCard>
                );

            case 2:
                return (
                    <StepCard>
                        <MDBox display="flex" alignItems="center" mb={3}>
                            <PaymentIcon sx={{ fontSize: 32, color: "#1976d2", mr: 2 }} />
                            <MDTypography variant="h4" fontWeight="bold">
                                Plan Seçimi
                            </MDTypography>
                        </MDBox>

                        <Grid container spacing={3}>
                            {plans.map((plan) => (
                                <Grid item xs={12} md={4} key={plan.id}>
                                    <PlanCard
                                        onClick={() => setSelectedPlan(plan.id)}
                                        sx={{
                                            borderColor: selectedPlan === plan.id ? "#667eea" : "transparent",
                                            backgroundColor: selectedPlan === plan.id ? "rgba(102, 126, 234, 0.05)" : "white"
                                        }}
                                    >
                                        {plan.recommended && (
                                            <MDBox
                                                bgcolor="warning.main"
                                                color="white"
                                                px={2}
                                                py={0.5}
                                                borderRadius="12px"
                                                display="inline-block"
                                                mb={2}
                                            >
                                                <MDTypography variant="caption" fontWeight="bold">
                                                    ÖNERİLEN
                                                </MDTypography>
                                            </MDBox>
                                        )}

                                        <MDTypography variant="h5" fontWeight="bold" mb={1}>
                                            {plan.name}
                                        </MDTypography>

                                        <MDTypography variant="body2" color="text" mb={2}>
                                            {plan.description}
                                        </MDTypography>

                                        <MDBox mb={3}>
                                            <MDTypography variant="h3" fontWeight="bold" color="info">
                                                {plan.price === "Özel" ? plan.price : `₺${plan.price}`}
                                            </MDTypography>
                                            {plan.price !== "Özel" && (
                                                <MDTypography variant="body2" color="text">
                                                    /{plan.period}
                                                </MDTypography>
                                            )}
                                        </MDBox>

                                        <MDBox textAlign="left">
                                            {plan.features.map((feature, index) => (
                                                <MDBox key={index} display="flex" alignItems="center" mb={1}>
                                                    <CheckCircleIcon sx={{ color: "#4caf50", fontSize: 16, mr: 1 }} />
                                                    <MDTypography variant="body2">
                                                        {feature}
                                                    </MDTypography>
                                                </MDBox>
                                            ))}
                                        </MDBox>
                                    </PlanCard>
                                </Grid>
                            ))}
                        </Grid>

                        <MDBox mt={4}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    />
                                }
                                label={
                                    <MDTypography variant="body2">
                                        <MDTypography component="span" variant="body2" color="info" sx={{ textDecoration: "underline", cursor: "pointer" }}>
                                            Kullanım Koşulları
                                        </MDTypography>
                                        {" ve "}
                                        <MDTypography component="span" variant="body2" color="info" sx={{ textDecoration: "underline", cursor: "pointer" }}>
                                            Gizlilik Politikası
                                        </MDTypography>
                                        &apos;nı okudum ve kabul ediyorum.
                                    </MDTypography>
                                }
                            />
                        </MDBox>
                    </StepCard>
                );

            default:
                return null;
        }
    };

    return (
        <PageLayout>
            <RegisterContainer>
                <Container maxWidth="lg">
                    {/* Language Toggle */}
                    <MDBox display="flex" justifyContent="flex-end" mb={2}>
                        <Tooltip title={i18n.language === 'tr' ? 'Switch to English' : 'Türkçe\'ye Geç'}>
                            <IconButton
                                onClick={toggleLanguage}
                                sx={{
                                    color: "#1976d2",
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                    "&:hover": {
                                        backgroundColor: "white",
                                    }
                                }}
                            >
                                <LanguageIcon />
                            </IconButton>
                        </Tooltip>
                    </MDBox>

                    {/* Header */}
                    <MDBox textAlign="center" mb={6} position="relative" zIndex={1}>
                        <MDBox
                            mb={4}
                            sx={{
                                backgroundColor: "white",
                                borderRadius: "16px",
                                padding: "20px",
                                display: "inline-block",
                                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                                border: "1px solid rgba(25, 118, 210, 0.1)"
                            }}
                        >
                            <img
                                src={formNeoLogo}
                                alt="FormNeo Logo"
                                style={{ height: "100px", width: "auto" }}
                            />
                        </MDBox>
                                        <MDTypography variant="h2" fontWeight="bold" color="dark" mb={3}>
                    {t('ns1:CompanyRegister.Title')}
                </MDTypography>
                <MDTypography variant="h5" color="text" sx={{ opacity: 0.8 }}>
                    {t('ns1:CompanyRegister.Subtitle')}
                </MDTypography>
                    </MDBox>

                    {/* Stepper */}
                    <Card sx={{
                        mb: 4,
                        p: 3,
                        borderRadius: "16px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                        backgroundColor: "white",
                        border: "1px solid rgba(25, 118, 210, 0.1)"
                    }}>
                        <Stepper
                            activeStep={activeStep}
                            alternativeLabel
                            sx={{
                                "& .MuiStepLabel-root .Mui-completed": {
                                    color: "#4caf50",
                                },
                                "& .MuiStepLabel-root .Mui-active": {
                                    color: "#1976d2",
                                },
                                "& .MuiStepLabel-label": {
                                    fontSize: "16px",
                                    fontWeight: 500,
                                },
                                "& .MuiStepConnector-line": {
                                    borderColor: "#e0e6ed",
                                    borderTopWidth: "2px",
                                }
                            }}
                        >
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Card>

                    {/* Step Content */}
                    {renderStepContent()}

                    {/* Navigation Buttons */}
                    <MDBox
                        display="flex"
                        justifyContent="space-between"
                        mt={4}
                        sx={{
                            backgroundColor: "white",
                            borderRadius: "16px",
                            padding: "20px",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                            border: "1px solid rgba(25, 118, 210, 0.1)"
                        }}
                    >
                        <MDButton
                            variant="outlined"
                            color="info"
                            onClick={activeStep === 0 ? () => navigate("/") : handleBack}
                            sx={{
                                px: 6,
                                py: 1.5,
                                borderRadius: "12px",
                                fontSize: "16px",
                                fontWeight: 600,
                                textTransform: "none",
                                borderWidth: "2px",
                                "&:hover": {
                                    borderWidth: "2px",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 8px 25px rgba(25, 118, 210, 0.3)"
                                }
                            }}
                        >
                            {activeStep === 0 ? "Ana Sayfaya Dön" : "Geri"}
                        </MDButton>

                        <MDButton
                            variant="gradient"
                            color="info"
                            onClick={handleNext}
                            disabled={!isStepValid()}
                            sx={{
                                px: 6,
                                py: 1.5,
                                borderRadius: "12px",
                                fontSize: "16px",
                                fontWeight: 600,
                                textTransform: "none",
                                background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                                boxShadow: "0 8px 25px rgba(25, 118, 210, 0.4)",
                                "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 12px 35px rgba(25, 118, 210, 0.5)"
                                },
                                "&:disabled": {
                                    opacity: 0.6,
                                    transform: "none",
                                    boxShadow: "0 4px 15px rgba(25, 118, 210, 0.2)"
                                }
                            }}
                        >
                            {activeStep === steps.length - 1 ? "Kayıt Ol" : "İleri"}
                        </MDButton>
                    </MDBox>

                    {/* Login Link */}
                    <MDBox
                        textAlign="center"
                        mt={3}
                        sx={{
                            backgroundColor: "white",
                            borderRadius: "12px",
                            padding: "16px",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                            border: "1px solid rgba(25, 118, 210, 0.1)"
                        }}
                    >
                        <MDTypography variant="body1" color="dark" sx={{ fontSize: "16px" }}>
                            Zaten hesabınız var mı?{" "}
                            <MDTypography
                                component="span"
                                variant="body1"
                                color="info"
                                fontWeight="bold"
                                sx={{
                                    cursor: "pointer",
                                    textDecoration: "none",
                                    fontSize: "16px",
                                    "&:hover": {
                                        textDecoration: "underline",
                                        color: "#5a67d8"
                                    }
                                }}
                                onClick={() => navigate("/authentication/sign-in/cover")}
                            >
                                Giriş Yap
                            </MDTypography>
                        </MDTypography>
                    </MDBox>
                </Container>
            </RegisterContainer>
        </PageLayout>
    );
}

export default CompanyRegister;
