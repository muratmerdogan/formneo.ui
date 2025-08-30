/**
 * FormNeo Landing Page - SaaS Ürün Tanıtım Sayfası
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import PageLayout from "examples/LayoutContainers/PageLayout";

// Images
import formNeoLogo from "assets/images/logoson.svg";

// Icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BusinessIcon from "@mui/icons-material/Business";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import CloudIcon from "@mui/icons-material/Cloud";
import SupportIcon from "@mui/icons-material/Support";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ApprovalIcon from "@mui/icons-material/Approval";
import WorkflowIcon from "@mui/icons-material/AccountTree";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LanguageIcon from "@mui/icons-material/Language";

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
    background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
    color: "#2c3e50",
    padding: theme.spacing(20, 0, 12, 0),
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"50\" cy=\"50\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>') repeat",
        opacity: 0.1,
    }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(4),
    textAlign: "center",
    height: "100%",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    }
}));

const PricingCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(4),
    textAlign: "center",
    height: "100%",
    position: "relative",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    }
}));

const PopularBadge = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: -12,
    left: "50%",
    transform: "translateX(-50%)",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: theme.spacing(0.5, 2),
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
}));

const CarouselContainer = styled(Box)(({ theme }) => ({
    position: "relative",
    overflow: "hidden",
    borderRadius: "20px",
    backgroundColor: "#f8f9fa",
    padding: theme.spacing(6),
    margin: theme.spacing(8, 0),
}));

const CarouselSlide = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "400px",
    transition: "all 0.5s ease",
    [theme.breakpoints.down('md')]: {
        flexDirection: "column",
        textAlign: "center",
        gap: theme.spacing(4),
    }
}));

const CarouselButton = styled(MDButton)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 2,
    minWidth: "50px",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    color: "#667eea",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    "&:hover": {
        backgroundColor: "white",
        transform: "translateY(-50%) scale(1.1)",
    }
}));

const IndicatorDots = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing(1),
    marginTop: theme.spacing(4),
}));

const Dot = styled(Box)(({ active }: { active: boolean }) => ({
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: active ? "#667eea" : "#e0e0e0",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
        backgroundColor: active ? "#667eea" : "#bdbdbd",
    }
}));

function LandingPage(): JSX.Element {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [selectedPlan, setSelectedPlan] = useState<string>("professional");
    const [currentSlide, setCurrentSlide] = useState(0);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'tr' ? 'en' : 'tr';
        i18n.changeLanguage(newLang);
    };

    const features = [
        {
            icon: <BusinessIcon sx={{ fontSize: 48, color: "#667eea" }} />,
            title: t('ns1:LandingPage.Features.CustomerManagement.Title'),
            description: t('ns1:LandingPage.Features.CustomerManagement.Description')
        },
        {
            icon: <SpeedIcon sx={{ fontSize: 48, color: "#667eea" }} />,
            title: t('ns1:LandingPage.Features.ActivityTracking.Title'),
            description: t('ns1:LandingPage.Features.ActivityTracking.Description')
        },
        {
            icon: <SecurityIcon sx={{ fontSize: 48, color: "#667eea" }} />,
            title: t('ns1:LandingPage.Features.SalesProcess.Title'),
            description: t('ns1:LandingPage.Features.SalesProcess.Description')
        },
        {
            icon: <CloudIcon sx={{ fontSize: 48, color: "#667eea" }} />,
            title: t('ns1:LandingPage.Features.Reporting.Title'),
            description: t('ns1:LandingPage.Features.Reporting.Description')
        },
        {
            icon: <SupportIcon sx={{ fontSize: 48, color: "#667eea" }} />,
            title: t('ns1:LandingPage.Features.UserManagement.Title'),
            description: t('ns1:LandingPage.Features.UserManagement.Description')
        },
        {
            icon: <IntegrationInstructionsIcon sx={{ fontSize: 48, color: "#667eea" }} />,
            title: t('ns1:LandingPage.Features.DataSecurity.Title'),
            description: t('ns1:LandingPage.Features.DataSecurity.Description')
        }
    ];

    const carouselSlides = [
        {
            icon: <DragIndicatorIcon sx={{ fontSize: 80, color: "#667eea" }} />,
            title: t('ns1:LandingPage.AdvancedFeatures.DragDrop.Title'),
            description: t('ns1:LandingPage.AdvancedFeatures.DragDrop.Description'),
            features: [
                t('ns1:LandingPage.AdvancedFeatures.DragDrop.Features.VisualPipeline'),
                t('ns1:LandingPage.AdvancedFeatures.DragDrop.Features.DragDrop'),
                t('ns1:LandingPage.AdvancedFeatures.DragDrop.Features.AutoUpdate'),
                t('ns1:LandingPage.AdvancedFeatures.DragDrop.Features.StageReporting')
            ]
        },
        {
            icon: <ApprovalIcon sx={{ fontSize: 80, color: "#667eea" }} />,
            title: t('ns1:LandingPage.AdvancedFeatures.SmartApproval.Title'),
            description: t('ns1:LandingPage.AdvancedFeatures.SmartApproval.Description'),
            features: [
                t('ns1:LandingPage.AdvancedFeatures.SmartApproval.Features.AutoRules'),
                t('ns1:LandingPage.AdvancedFeatures.SmartApproval.Features.MultiLevel'),
                t('ns1:LandingPage.AdvancedFeatures.SmartApproval.Features.EmailNotifications'),
                t('ns1:LandingPage.AdvancedFeatures.SmartApproval.Features.ApprovalHistory')
            ]
        },
        {
            icon: <WorkflowIcon sx={{ fontSize: 80, color: "#667eea" }} />,
            title: t('ns1:LandingPage.AdvancedFeatures.CustomWorkflows.Title'),
            description: t('ns1:LandingPage.AdvancedFeatures.CustomWorkflows.Description'),
            features: [
                t('ns1:LandingPage.AdvancedFeatures.CustomWorkflows.Features.CustomDesign'),
                t('ns1:LandingPage.AdvancedFeatures.CustomWorkflows.Features.ConditionalTriggers'),
                t('ns1:LandingPage.AdvancedFeatures.CustomWorkflows.Features.AutoAssignment'),
                t('ns1:LandingPage.AdvancedFeatures.CustomWorkflows.Features.ProcessAnalysis')
            ]
        }
    ];

    const plans = [
        {
            name: t('ns1:LandingPage.Pricing.Plans.Starter.Name'),
            price: t('ns1:LandingPage.Pricing.Plans.Starter.Price'),
            period: t('ns1:LandingPage.Pricing.Plans.Starter.Period'),
            description: t('ns1:LandingPage.Pricing.Plans.Starter.Description'),
            features: [
                t('ns1:LandingPage.Pricing.Plans.Starter.Features.Customers'),
                t('ns1:LandingPage.Pricing.Plans.Starter.Features.Users'),
                t('ns1:LandingPage.Pricing.Plans.Starter.Features.BasicCRM'),
                t('ns1:LandingPage.Pricing.Plans.Starter.Features.BasicReports'),
                t('ns1:LandingPage.Pricing.Plans.Starter.Features.EmailSupport')
            ],
            buttonText: t('ns1:LandingPage.Pricing.Plans.Starter.Button'),
            popular: false
        },
        {
            name: t('ns1:LandingPage.Pricing.Plans.Professional.Name'),
            price: t('ns1:LandingPage.Pricing.Plans.Professional.Price'),
            period: t('ns1:LandingPage.Pricing.Plans.Professional.Period'),
            description: t('ns1:LandingPage.Pricing.Plans.Professional.Description'),
            features: [
                t('ns1:LandingPage.Pricing.Plans.Professional.Features.Customers'),
                t('ns1:LandingPage.Pricing.Plans.Professional.Features.Users'),
                t('ns1:LandingPage.Pricing.Plans.Professional.Features.AllFeatures'),
                t('ns1:LandingPage.Pricing.Plans.Professional.Features.Pipeline'),
                t('ns1:LandingPage.Pricing.Plans.Professional.Features.AdvancedReports'),
                t('ns1:LandingPage.Pricing.Plans.Professional.Features.PrioritySupport'),
                t('ns1:LandingPage.Pricing.Plans.Professional.Features.AutoBackup')
            ],
            buttonText: t('ns1:LandingPage.Pricing.Plans.Professional.Button'),
            popular: true
        },
        {
            name: t('ns1:LandingPage.Pricing.Plans.Enterprise.Name'),
            price: t('ns1:LandingPage.Pricing.Plans.Enterprise.Price'),
            period: t('ns1:LandingPage.Pricing.Plans.Enterprise.Period'),
            description: t('ns1:LandingPage.Pricing.Plans.Enterprise.Description'),
            features: [
                t('ns1:LandingPage.Pricing.Plans.Enterprise.Features.UnlimitedCustomers'),
                t('ns1:LandingPage.Pricing.Plans.Enterprise.Features.UnlimitedUsers'),
                t('ns1:LandingPage.Pricing.Plans.Enterprise.Features.CustomIntegrations'),
                t('ns1:LandingPage.Pricing.Plans.Enterprise.Features.CustomTraining'),
                t('ns1:LandingPage.Pricing.Plans.Enterprise.Features.SLA'),
                t('ns1:LandingPage.Pricing.Plans.Enterprise.Features.CustomSecurity')
            ],
            buttonText: t('ns1:LandingPage.Pricing.Plans.Enterprise.Button'),
            popular: false
        }
    ];

    const handleGetStarted = () => {
        navigate("/authentication/sign-in/cover");
    };

    const handleRegister = () => {
        navigate("/authentication/company-register");
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    // Otomatik carousel
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000); // 5 saniyede bir değişir

        return () => clearInterval(interval);
    }, [currentSlide]);

    return (
        <PageLayout>
            {/* Navigation */}
            <MDBox
                position="fixed"
                top={0}
                left={0}
                right={0}
                zIndex={1000}
                bgcolor="white"
                boxShadow="0 2px 20px rgba(0, 0, 0, 0.1)"
                py={4}
                px={3}
            >
                <Container maxWidth="lg">
                    <MDBox display="flex" justifyContent="space-between" alignItems="center">
                        <MDBox display="flex" alignItems="center">
                            <img
                                src={formNeoLogo}
                                alt="FormNeo Logo"
                                style={{ height: "150px" }}
                            />
                        </MDBox>
                        <MDBox display="flex" alignItems="center" gap={2}>
                            <Tooltip title={i18n.language === 'tr' ? 'Switch to English' : 'Türkçe\'ye Geç'}>
                                <IconButton
                                    onClick={toggleLanguage}
                                    sx={{
                                        color: "#1976d2",
                                        backgroundColor: "rgba(25, 118, 210, 0.1)",
                                        "&:hover": {
                                            backgroundColor: "rgba(25, 118, 210, 0.2)",
                                        }
                                    }}
                                >
                                    <LanguageIcon />
                                </IconButton>
                            </Tooltip>
                            <MDButton
                                variant="text"
                                color="dark"
                                onClick={handleGetStarted}
                                sx={{ textTransform: "none" }}
                            >
                                {t('ns1:LandingPage.Navigation.Login')}
                            </MDButton>
                            <MDButton
                                variant="gradient"
                                color="info"
                                onClick={handleRegister}
                                sx={{ textTransform: "none" }}
                            >
                                {t('ns1:LandingPage.Navigation.FreeTrial')}
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </Container>
            </MDBox>

            {/* Hero Section */}
            <HeroSection>
                <Container maxWidth="lg">
                    <MDBox position="relative" zIndex={1}>
                        <MDTypography variant="h1" fontWeight="bold" mb={3} sx={{ fontSize: { xs: "2.5rem", md: "3.5rem" } }}>
                            {t('ns1:LandingPage.Hero.Title')}
                            <br />
                            <Box component="span" sx={{ color: "#1976d2" }}>{t('ns1:LandingPage.Hero.Subtitle')}</Box>
                        </MDTypography>

                        <MDTypography variant="h5" mb={5} sx={{ opacity: 0.9, maxWidth: "600px", mx: "auto" }}>
                            {t('ns1:LandingPage.Hero.Description')}
                        </MDTypography>

                        <MDBox display="flex" gap={3} justifyContent="center" flexWrap="wrap">
                            <MDButton
                                variant="gradient"
                                color="info"
                                size="large"
                                onClick={handleRegister}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontSize: "1.1rem",
                                    textTransform: "none",
                                    boxShadow: "0 8px 25px rgba(255, 215, 0, 0.3)"
                                }}
                            >
                                {t('ns1:LandingPage.Hero.StartFree')}
                            </MDButton>
                            <MDButton
                                variant="outlined"
                                color="info"
                                size="large"
                                onClick={handleGetStarted}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontSize: "1.1rem",
                                    textTransform: "none",
                                    borderColor: "rgba(255, 255, 255, 0.5)",
                                    color: "white",
                                    "&:hover": {
                                        borderColor: "white",
                                        backgroundColor: "rgba(255, 255, 255, 0.1)"
                                    }
                                }}
                            >
                                {t('ns1:LandingPage.Hero.WatchDemo')}
                            </MDButton>
                        </MDBox>

                        <MDBox mt={6} display="flex" justifyContent="center" alignItems="center" gap={4} flexWrap="wrap">
                            <MDTypography variant="body2" sx={{ opacity: 0.8 }}>
                                ✓ {t('ns1:LandingPage.Hero.Features.FreeTrial')}
                            </MDTypography>
                            <MDTypography variant="body2" sx={{ opacity: 0.8 }}>
                                ✓ {t('ns1:LandingPage.Hero.Features.NoCredit')}
                            </MDTypography>
                            <MDTypography variant="body2" sx={{ opacity: 0.8 }}>
                                ✓ {t('ns1:LandingPage.Hero.Features.InstantSetup')}
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Container>
            </HeroSection>

            {/* Features Section */}
            <Container maxWidth="lg">
                <MDBox py={12}>
                    <MDBox textAlign="center" mb={8}>
                        <MDTypography variant="h2" fontWeight="bold" color="dark" mb={3}>
                            {t('ns1:LandingPage.Features.Title')}
                        </MDTypography>
                        <MDTypography variant="h6" color="text" sx={{ maxWidth: "600px", mx: "auto" }}>
                            {t('ns1:LandingPage.Features.Subtitle')}
                        </MDTypography>
                    </MDBox>

                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} md={6} lg={4} key={index}>
                                <FeatureCard>
                                    <MDBox mb={3}>
                                        {feature.icon}
                                    </MDBox>
                                    <MDTypography variant="h5" fontWeight="bold" mb={2}>
                                        {feature.title}
                                    </MDTypography>
                                    <MDTypography variant="body1" color="text">
                                        {feature.description}
                                    </MDTypography>
                                </FeatureCard>
                            </Grid>
                        ))}
                    </Grid>
                </MDBox>
            </Container>

            {/* Advanced Features Carousel */}
            <Container maxWidth="lg">
                <MDBox textAlign="center" mb={4}>
                    <MDTypography variant="h2" fontWeight="bold" color="dark" mb={3}>
                        {t('ns1:LandingPage.AdvancedFeatures.Title')}
                    </MDTypography>
                    <MDTypography variant="h6" color="text" sx={{ maxWidth: "600px", mx: "auto" }}>
                        {t('ns1:LandingPage.AdvancedFeatures.Subtitle')}
                    </MDTypography>
                </MDBox>

                <CarouselContainer>
                    <CarouselButton
                        onClick={prevSlide}
                        sx={{ left: "20px" }}
                    >
                        <ArrowBackIcon />
                    </CarouselButton>

                    <CarouselButton
                        onClick={nextSlide}
                        sx={{ right: "20px" }}
                    >
                        <ArrowForwardIcon />
                    </CarouselButton>

                    <CarouselSlide>
                        <MDBox flex={1} pr={{ xs: 0, md: 4 }}>
                            <MDBox display="flex" alignItems="center" mb={3}>
                                {carouselSlides[currentSlide].icon}
                                <MDTypography variant="h3" fontWeight="bold" color="dark" ml={2}>
                                    {carouselSlides[currentSlide].title}
                                </MDTypography>
                            </MDBox>

                            <MDTypography variant="h6" color="text" mb={4} lineHeight={1.6}>
                                {carouselSlides[currentSlide].description}
                            </MDTypography>

                            <MDBox>
                                {carouselSlides[currentSlide].features.map((feature, index) => (
                                    <MDBox key={index} display="flex" alignItems="center" mb={2}>
                                        <CheckCircleIcon sx={{ color: "#4caf50", fontSize: 20, mr: 2 }} />
                                        <MDTypography variant="body1" color="text">
                                            {feature}
                                        </MDTypography>
                                    </MDBox>
                                ))}
                            </MDBox>
                        </MDBox>

                        <MDBox
                            flex={1}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                backgroundColor: "rgba(102, 126, 234, 0.1)",
                                borderRadius: "16px",
                                padding: 4,
                                minHeight: "300px"
                            }}
                        >
                            <MDBox textAlign="center">
                                {carouselSlides[currentSlide].icon}
                                <MDTypography variant="h4" fontWeight="bold" color="info" mt={2}>
                                    {t('ns1:LandingPage.AdvancedFeatures.DemoSoon')}
                                </MDTypography>
                                <MDTypography variant="body1" color="text" mt={1}>
                                    {t('ns1:LandingPage.AdvancedFeatures.DemoDescription')}
                                </MDTypography>
                            </MDBox>
                        </MDBox>
                    </CarouselSlide>

                    <IndicatorDots>
                        {carouselSlides.map((_, index) => (
                            <Dot
                                key={index}
                                active={currentSlide === index}
                                onClick={() => goToSlide(index)}
                            />
                        ))}
                    </IndicatorDots>
                </CarouselContainer>
            </Container>

            {/* Pricing Section */}
            <MDBox bgcolor="#f8f9fa" py={12}>
                <Container maxWidth="lg">
                    <MDBox textAlign="center" mb={8}>
                        <MDTypography variant="h2" fontWeight="bold" color="dark" mb={3}>
                            {t('ns1:LandingPage.Pricing.Title')}
                        </MDTypography>
                        <MDTypography variant="h6" color="text" sx={{ maxWidth: "600px", mx: "auto" }}>
                            {t('ns1:LandingPage.Pricing.Subtitle')}
                        </MDTypography>
                    </MDBox>

                    <Grid container spacing={4} justifyContent="center">
                        {plans.map((plan, index) => (
                            <Grid item xs={12} md={6} lg={4} key={index}>
                                <PricingCard sx={{
                                    border: plan.popular ? "2px solid #667eea" : "1px solid #e0e0e0",
                                    transform: plan.popular ? "scale(1.05)" : "scale(1)"
                                }}>
                                    {plan.popular && <PopularBadge>{t('ns1:LandingPage.Pricing.Plans.Professional.Popular')}</PopularBadge>}

                                    <MDBox mb={3}>
                                        <MDTypography variant="h4" fontWeight="bold" color="dark" mb={1}>
                                            {plan.name}
                                        </MDTypography>
                                        <MDTypography variant="body2" color="text">
                                            {plan.description}
                                        </MDTypography>
                                    </MDBox>

                                    <MDBox mb={4}>
                                        <MDBox display="flex" alignItems="baseline" justifyContent="center" mb={1}>
                                            <MDTypography variant="h2" fontWeight="bold" color="info">
                                                {plan.price === t('ns1:LandingPage.Pricing.Plans.Enterprise.Price') ? plan.price : `₺${plan.price}`}
                                            </MDTypography>
                                            {plan.price !== t('ns1:LandingPage.Pricing.Plans.Enterprise.Price') && (
                                                <MDTypography variant="body1" color="text" ml={1}>
                                                    /{plan.period}
                                                </MDTypography>
                                            )}
                                        </MDBox>
                                    </MDBox>

                                    <MDBox mb={4}>
                                        {plan.features.map((feature, featureIndex) => (
                                            <MDBox key={featureIndex} display="flex" alignItems="center" mb={1}>
                                                <CheckCircleIcon sx={{ color: "#4caf50", fontSize: 20, mr: 1 }} />
                                                <MDTypography variant="body2" color="text">
                                                    {feature}
                                                </MDTypography>
                                            </MDBox>
                                        ))}
                                    </MDBox>

                                    <MDButton
                                        variant={plan.popular ? "gradient" : "outlined"}
                                        color="info"
                                        fullWidth
                                        size="large"
                                        onClick={handleRegister}
                                        sx={{ textTransform: "none", py: 1.5 }}
                                    >
                                        {plan.buttonText}
                                    </MDButton>
                                </PricingCard>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </MDBox>

            {/* CTA Section */}
            <Container maxWidth="lg">
                <MDBox py={12} textAlign="center">
                    <MDTypography variant="h2" fontWeight="bold" color="dark" mb={3}>
                        {t('ns1:LandingPage.CTA.Title')}
                    </MDTypography>
                    <MDTypography variant="h6" color="text" mb={5} sx={{ maxWidth: "600px", mx: "auto" }}>
                        {t('ns1:LandingPage.CTA.Subtitle')}
                    </MDTypography>

                    <MDBox display="flex" gap={3} justifyContent="center" flexWrap="wrap">
                        <MDButton
                            variant="gradient"
                            color="info"
                            size="large"
                            onClick={handleRegister}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: "1.1rem",
                                textTransform: "none"
                            }}
                        >
                            {t('ns1:LandingPage.CTA.CreateAccount')}
                        </MDButton>
                        <MDButton
                            variant="outlined"
                            color="info"
                            size="large"
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: "1.1rem",
                                textTransform: "none"
                            }}
                        >
                            {t('ns1:LandingPage.CTA.ContactSales')}
                        </MDButton>
                    </MDBox>
                </MDBox>
            </Container>

            {/* Footer */}
            <MDBox bgcolor="#2c3e50" color="white" py={6}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <MDBox display="flex" alignItems="center" mb={2}>
                                <img
                                    src={formNeoLogo}
                                    alt="FormNeo Logo"
                                    style={{
                                        height: "60px",
                                        width: "auto"
                                    }}
                                />
                            </MDBox>
                            <MDTypography variant="body2" sx={{ opacity: 0.8, maxWidth: "400px" }}>
                                {t('ns1:LandingPage.Footer.Description')}
                            </MDTypography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MDBox display="flex" justifyContent={{ xs: "flex-start", md: "flex-end" }} gap={4}>
                                <MDBox>
                                    <MDTypography variant="h6" fontWeight="bold" mb={2}>
                                        {t('ns1:LandingPage.Footer.Product.Title')}
                                    </MDTypography>
                                    <MDTypography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                                        {t('ns1:LandingPage.Footer.Product.Features')}
                                    </MDTypography>
                                    <MDTypography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                                        {t('ns1:LandingPage.Footer.Product.Pricing')}
                                    </MDTypography>
                                    <MDTypography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                                        {t('ns1:LandingPage.Footer.Product.API')}
                                    </MDTypography>
                                </MDBox>
                                <MDBox>
                                    <MDTypography variant="h6" fontWeight="bold" mb={2}>
                                        {t('ns1:LandingPage.Footer.Support.Title')}
                                    </MDTypography>
                                    <MDTypography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                                        {t('ns1:LandingPage.Footer.Support.HelpCenter')}
                                    </MDTypography>
                                    <MDTypography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                                        {t('ns1:LandingPage.Footer.Support.Contact')}
                                    </MDTypography>
                                    <MDTypography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                                        {t('ns1:LandingPage.Footer.Support.Status')}
                                    </MDTypography>
                                </MDBox>
                            </MDBox>
                        </Grid>
                    </Grid>

                    <MDBox borderTop="1px solid rgba(255,255,255,0.1)" mt={4} pt={4} textAlign="center">
                        <MDTypography variant="body2" sx={{ opacity: 0.6 }}>
                            {t('ns1:LandingPage.Footer.Copyright')}
                        </MDTypography>
                    </MDBox>
                </Container>
            </MDBox>
        </PageLayout>
    );
}

export default LandingPage;
