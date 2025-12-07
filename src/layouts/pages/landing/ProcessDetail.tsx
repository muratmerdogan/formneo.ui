/**
 * FormNeo BPM - Süreç Detay Sayfası
 * Her süreç için SEO optimize edilmiş detay sayfası
 */

import { useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { styled } from "@mui/material/styles";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import PageLayout from "examples/LayoutContainers/PageLayout";

// Icons
import BusinessIcon from "@mui/icons-material/Business";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ScienceIcon from "@mui/icons-material/Science";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";

// Styled components
const ProcessHero = styled(Box)(({ theme }) => ({
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    padding: theme.spacing(8, 0),
    borderRadius: "24px",
    marginBottom: theme.spacing(6),
}));

const FeatureCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3),
    height: "100%",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    transition: "all 0.3s ease",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 24px rgba(102, 126, 234, 0.15)",
    },
}));

const sectionKeys = [
    "HR_Recruitment", "HR_Leave", "HR_Performance", "HR_Promotion", "HR_Training",
    "HR_AccidentReport", "HR_Disciplinary", "HR_Resignation", "HR_SalaryIncrease", "HR_Transfer", "HR_TravelExpense",
    "Production_Order", "Production_Material", "Production_Quality", "Production_Maintenance", "Production_LineChange",
    "Production_Recall", "Production_Stop", "Production_Improvement", "Production_StockTransfer", "Production_Report",
    "Quality_ControlReport", "Quality_Compliance", "Quality_Supplier", "Quality_Improvement", "Quality_Complaint",
    "Quality_Audit", "Quality_StandardChange", "Quality_Training", "Quality_Certification", "Quality_Metrics",
];

const iconFor = (key: string) => {
    if (key.startsWith("HR_")) return <BusinessIcon sx={{ fontSize: 40, color: "#667eea" }} />;
    if (key.startsWith("Production_")) return <DashboardIcon sx={{ fontSize: 40, color: "#667eea" }} />;
    if (key.startsWith("Quality_")) return <ScienceIcon sx={{ fontSize: 40, color: "#667eea" }} />;
    return <BusinessIcon sx={{ fontSize: 40, color: "#667eea" }} />;
};

// Süreç kategorilerine göre detaylı açıklamalar
const getProcessDescription = (key: string, t: any): string => {
    const descriptions: Record<string, string> = {
        HR_Recruitment: "İşe alım sürecinizi dijitalleştirerek CV değerlendirmeden işe başlangıca kadar tüm adımları otomatikleştirin. Aday takibi, mülakat planlama ve onay süreçlerini tek platformda yönetin.",
        HR_Leave: "Çalışan izin taleplerini dijital ortamda yönetin. Otomatik izin hesaplama, yönetici onay süreçleri ve bordro entegrasyonu ile zamandan tasarruf edin.",
        HR_Performance: "Performans değerlendirme süreçlerinizi standartlaştırın. 360 derece geri bildirim, KPI takibi ve gelişim planları ile çalışan performansını artırın.",
        HR_Promotion: "Terfi başvurularını sistematik bir şekilde yönetin. Performans geçmişi kontrolü, çok seviyeli onay süreçleri ve maaş artış hesaplamalarını otomatikleştirin.",
        HR_Training: "Eğitim planlama ve takip süreçlerinizi dijitalleştirin. Eğitim talepleri, bütçe onayları ve katılım takibi ile eğitim yönetimini kolaylaştırın.",
        HR_AccidentReport: "İş kazası bildirimlerini hızlı ve sistematik bir şekilde kaydedin. Yasal gereklilikleri karşılayın ve kaza analizlerini kolaylaştırın.",
        HR_Disciplinary: "Disiplin süreçlerini şeffaf ve dokümantasyonlu bir şekilde yönetin. Süreç takibi ve arşivleme ile yasal uyumluluğu sağlayın.",
        HR_Resignation: "İşten ayrılma süreçlerini otomatikleştirin. Çıkış görüşmeleri, vize işlemleri ve bilgi transferi süreçlerini yönetin.",
        HR_SalaryIncrease: "Maaş artış taleplerini sistematik bir şekilde değerlendirin. Performans kriterleri, bütçe kontrolü ve onay süreçlerini yönetin.",
        HR_Transfer: "Departman ve pozisyon transferlerini dijital ortamda yönetin. Onay süreçleri, bilgi transferi ve sistem güncellemelerini otomatikleştirin.",
        HR_TravelExpense: "Seyahat masraflarını dijital ortamda yönetin. Ulaşım, konaklama ve yemek giderlerini takip edin, fatura yükleme ve onay süreçlerini otomatikleştirin.",
        Production_Order: "Üretim siparişlerini dijital ortamda yönetin. Sipariş takibi, malzeme planlama ve üretim süreçlerini entegre edin.",
        Production_Material: "Malzeme taleplerini ve stok yönetimini otomatikleştirin. Talep onayları, satın alma süreçleri ve stok takibi ile verimliliği artırın.",
        Production_Quality: "Kalite kontrol süreçlerini standartlaştırın. Test sonuçları, uygunluk değerlendirmeleri ve raporlama ile kaliteyi artırın.",
        Production_Maintenance: "Bakım planlama ve takip süreçlerini dijitalleştirin. Bakım talepleri, onay süreçleri ve bakım geçmişi takibi ile makine verimliliğini artırın.",
        Production_LineChange: "Üretim hattı değişikliklerini sistematik bir şekilde yönetin. Değişiklik talepleri, onay süreçleri ve dokümantasyon ile süreçleri optimize edin.",
        Production_Recall: "Ürün geri çağırma süreçlerini hızlı ve etkili bir şekilde yönetin. Müşteri bildirimleri, stok takibi ve raporlama ile kriz yönetimini kolaylaştırın.",
        Production_Stop: "Üretim durdurma kararlarını sistematik bir şekilde yönetin. Durum analizi, onay süreçleri ve yeniden başlatma prosedürlerini takip edin.",
        Production_Improvement: "Üretim iyileştirme önerilerini toplayın ve değerlendirin. Öneri takibi, uygulama süreçleri ve sonuç analizi ile sürekli iyileştirme sağlayın.",
        Production_StockTransfer: "Stok transferlerini dijital ortamda yönetin. Transfer talepleri, onay süreçleri ve stok güncellemelerini otomatikleştirin.",
        Production_Report: "Üretim raporlarını otomatik olarak oluşturun ve paylaşın. Veri toplama, analiz ve raporlama süreçlerini kolaylaştırın.",
        Quality_ControlReport: "Kalite kontrol raporlarını sistematik bir şekilde oluşturun. Test sonuçları, uygunluk değerlendirmeleri ve raporlama ile kalite standartlarını koruyun.",
        Quality_Compliance: "Uyumluluk süreçlerini dijital ortamda yönetin. Denetimler, uyumluluk kontrolleri ve raporlama ile yasal gereklilikleri karşılayın.",
        Quality_Supplier: "Tedarikçi kalite değerlendirmelerini sistematik bir şekilde yönetin. Tedarikçi performans takibi, değerlendirme süreçleri ve raporlama ile tedarikçi kalitesini artırın.",
        Quality_Improvement: "Kalite iyileştirme önerilerini toplayın ve uygulayın. Öneri takibi, uygulama süreçleri ve sonuç analizi ile kaliteyi sürekli iyileştirin.",
        Quality_Complaint: "Müşteri şikayetlerini hızlı ve etkili bir şekilde yönetin. Şikayet kaydı, analiz süreçleri ve çözüm takibi ile müşteri memnuniyetini artırın.",
        Quality_Audit: "Kalite denetimlerini sistematik bir şekilde planlayın ve yönetin. Denetim planlama, uygulama ve raporlama süreçlerini dijitalleştirin.",
        Quality_StandardChange: "Kalite standart değişikliklerini sistematik bir şekilde yönetin. Değişiklik talepleri, onay süreçleri ve dokümantasyon ile standartları güncelleyin.",
        Quality_Training: "Kalite eğitimlerini planlayın ve takip edin. Eğitim talepleri, katılım takibi ve sertifikasyon süreçlerini yönetin.",
        Quality_Certification: "Sertifikasyon süreçlerini dijital ortamda yönetin. Sertifikasyon talepleri, değerlendirme süreçleri ve belgelendirme ile kalite standartlarını koruyun.",
        Quality_Metrics: "Kalite metriklerini otomatik olarak toplayın ve analiz edin. Performans takibi, trend analizi ve raporlama ile kalite yönetimini iyileştirin.",
    };
    return descriptions[key] || "Bu süreç ile iş operasyonlarınızı dijitalleştirin ve verimliliği artırın.";
};

const getProcessBenefits = (key: string): string[] => {
    const benefits: Record<string, string[]> = {
        HR_Recruitment: [
            "Aday takip süresini %60 azaltın",
            "Mülakat koordinasyonunu otomatikleştirin",
            "İşe alım süresini kısaltın",
            "Aday deneyimini iyileştirin"
        ],
        HR_Leave: [
            "İzin taleplerini anında işleyin",
            "Kalan izin hesaplamalarını otomatikleştirin",
            "Onay süreçlerini hızlandırın",
            "Bordro entegrasyonu ile hata riskini azaltın"
        ],
        Production_Order: [
            "Sipariş takibini gerçek zamanlı yapın",
            "Malzeme planlamasını optimize edin",
            "Üretim süreçlerini entegre edin",
            "Müşteri memnuniyetini artırın"
        ],
        Quality_ControlReport: [
            "Kalite kontrol süreçlerini standartlaştırın",
            "Test sonuçlarını otomatik kaydedin",
            "Raporlama süresini %70 azaltın",
            "Kalite standartlarını koruyun"
        ],
    };
    return benefits[key] || [
        "Süreç verimliliğini artırın",
        "Manuel hataları azaltın",
        "Süreç takibini kolaylaştırın",
        "Raporlama ve analiz yapın"
    ];
};

function ProcessDetail(): JSX.Element {
    const { key } = useParams<{ key: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const process = useMemo(() => {
        if (!key || !sectionKeys.includes(key)) return null;
        const titleKey = `landing:Sections.${key}.Title` as any;
        const bulletsKey = `landing:Sections.${key}.Bullets` as any;
        const implementationKey = `landing:Sections.${key}.Implementation` as any;
        const bullets = (t(bulletsKey, { returnObjects: true }) as unknown as string[]) || [];
        const implementation = t(implementationKey) as unknown as string;
        return {
            key,
            icon: iconFor(key),
            title: t(titleKey) as unknown as string,
            bullets,
            implementation,
            description: getProcessDescription(key, t),
            benefits: getProcessBenefits(key),
        };
    }, [key, t]);

    useEffect(() => {
        if (!process) {
            navigate("/", { replace: true });
        }
    }, [process, navigate]);

    if (!process) {
        return <div>Yükleniyor...</div>;
    }

    const handleRegister = () => {
        navigate("/authentication/company-register");
    };

    const processTitle = process.title.replace(/[🎯📅📊📈🎓⚠️⚖️👋💰🔄📦🏭🔧📋🔍📊✅📝🔬📈⚠️📋🎓✅📊✈️]/g, "").trim();
    // SEO için optimize edilmiş title ve description
    const metaTitle = `${processTitle} Süreci | BMP Yazılımı ve Süreç Yazılımı - FormNeo BPM`;
    const metaDescription = `${processTitle} sürecini BMP yazılımı ve süreç yazılımı olarak FormNeo BPM ile ${process.implementation} içinde dijitalleştirin. ${process.description}`;

    useEffect(() => {
        const baseUrl = window.location.origin;
        const currentUrl = `${baseUrl}/processes/${process.key}`;
        
        // SEO için document title ve meta tags güncelle
        document.title = metaTitle;
        
        // Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', currentUrl);
        
        // Meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', metaDescription);

        // Meta keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.setAttribute('name', 'keywords');
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', `${processTitle}, BPM, iş süreci, dijitalleştirme, workflow, FormNeo, ${process.key}, iş süreci yönetimi, süreç otomasyonu`);

        // OG tags
        const ogTags = [
            { property: 'og:title', content: metaTitle },
            { property: 'og:description', content: metaDescription },
            { property: 'og:type', content: 'article' },
            { property: 'og:url', content: currentUrl },
            { property: 'og:site_name', content: 'FormNeo BPM' },
            { property: 'og:locale', content: 'tr_TR' },
        ];

        ogTags.forEach(({ property, content }) => {
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute('property', property);
                document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
        });

        // Twitter tags
        const twitterTags = [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: metaTitle },
            { name: 'twitter:description', content: metaDescription },
        ];

        twitterTags.forEach(({ name, content }) => {
            let tag = document.querySelector(`meta[name="${name}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute('name', name);
                document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
        });

        // Structured Data (JSON-LD) - Article Schema
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": metaTitle,
            "description": metaDescription,
            "author": {
                "@type": "Organization",
                "name": "FormNeo",
                "url": "https://formneo.com"
            },
            "publisher": {
                "@type": "Organization",
                "name": "FormNeo",
                "url": "https://formneo.com",
                "logo": {
                    "@type": "ImageObject",
                    "url": `${baseUrl}/favicon.png`
                }
            },
            "datePublished": new Date().toISOString(),
            "dateModified": new Date().toISOString(),
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": currentUrl
            },
            "about": {
                "@type": "Service",
                "name": processTitle,
                "description": process.description,
                "provider": {
                    "@type": "Organization",
                    "name": "FormNeo",
                    "url": "https://formneo.com"
                },
                "serviceType": "Business Process Management",
                "areaServed": {
                    "@type": "Country",
                    "name": "Turkey"
                }
            },
            "keywords": `${processTitle}, BMP yazılımı, süreç yazılımı, BPM, iş süreci, dijitalleştirme, workflow, ${processTitle} süreci`,
            "inLanguage": "tr-TR"
        };

        // Eski structured data'yı kaldır ve yenisini ekle
        let existingScript = document.querySelector('script[type="application/ld+json"][data-process]');
        if (existingScript) {
            existingScript.remove();
        }

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-process', process.key);
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }, [metaTitle, metaDescription, processTitle, process.key, process.description]);

    return (
        <PageLayout>
                <Container maxWidth="lg">
                    {/* Breadcrumbs */}
                    <MDBox mb={4} mt={4}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link to="/" style={{ textDecoration: "none", color: "#667eea" }}>
                                <MDBox display="flex" alignItems="center" gap={0.5}>
                                    <HomeIcon fontSize="small" />
                                    <MDTypography variant="body2" color="info">Ana Sayfa</MDTypography>
                                </MDBox>
                            </Link>
                            <MDTypography variant="body2" color="text">Süreçler</MDTypography>
                            <MDTypography variant="body2" color="text">{processTitle}</MDTypography>
                        </Breadcrumbs>
                    </MDBox>

                    {/* Hero Section */}
                    <ProcessHero>
                        <Container maxWidth="lg">
                            <MDBox display="flex" alignItems="center" gap={2} mb={3}>
                                <MDButton
                                    variant="text"
                                    onClick={() => navigate("/")}
                                    startIcon={<ArrowBackIcon />}
                                    sx={{ color: "#ffffff" }}
                                >
                                    Geri Dön
                                </MDButton>
                            </MDBox>
                            <MDBox display="flex" alignItems="center" gap={3} mb={3}>
                                <Box component="span" aria-hidden="true">{process.icon}</Box>
                                <MDBox>
                                    <MDTypography component="h1" variant="h2" fontWeight="bold" color="inherit" mb={1}>
                                        {processTitle} Süreci - BMP Yazılımı ve Süreç Yazılımı
                                    </MDTypography>
                                    <MDBox 
                                        sx={{ 
                                            display: 'inline-block',
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            color: '#ffffff',
                                            padding: '6px 16px',
                                            borderRadius: '12px',
                                            fontSize: '14px',
                                            fontWeight: 700,
                                        }}
                                    >
                                        ⚡ {process.implementation} içinde hazır
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                            <MDTypography variant="h6" color="inherit" sx={{ opacity: 0.95, maxWidth: "800px", lineHeight: 1.8 }}>
                                FormNeo BPM, BMP yazılımı ve süreç yazılımı olarak {processTitle.toLowerCase()} sürecinizi dijitalleştirin. {process.description}
                            </MDTypography>
                        </Container>
                    </ProcessHero>

                    {/* Süreç Özellikleri */}
                    <MDBox component="section" mb={6} aria-labelledby="process-features">
                        <MDTypography 
                            component="h2"
                            id="process-features"
                            variant="h4" 
                            fontWeight="bold" 
                            color="dark" 
                            mb={3}
                        >
                            {processTitle} Süreci Özellikleri - BMP Yazılımı
                        </MDTypography>
                        <Grid container spacing={3}>
                            {process.bullets.map((bullet: string, index: number) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <FeatureCard>
                                        <MDBox display="flex" alignItems="flex-start" gap={2}>
                                            <CheckCircleIcon sx={{ color: "#667eea", mt: 0.5 }} />
                                            <MDTypography variant="body1" color="text" sx={{ lineHeight: 1.8 }}>
                                                {bullet}
                                            </MDTypography>
                                        </MDBox>
                                    </FeatureCard>
                                </Grid>
                            ))}
                        </Grid>
                    </MDBox>

                    {/* Faydalar */}
                    <MDBox component="section" mb={6} aria-labelledby="process-benefits">
                        <MDTypography 
                            component="h2"
                            id="process-benefits"
                            variant="h4" 
                            fontWeight="bold" 
                            color="dark" 
                            mb={3}
                        >
                            Bu Süreçle Neler Kazanırsınız?
                        </MDTypography>
                        <Grid container spacing={3}>
                            {process.benefits.map((benefit: string, index: number) => (
                                <Grid item xs={12} md={6} lg={3} key={index}>
                                    <FeatureCard>
                                        <MDBox display="flex" alignItems="center" gap={2}>
                                            <SpeedIcon sx={{ color: "#667eea" }} />
                                            <MDTypography variant="body1" color="text" fontWeight={600}>
                                                {benefit}
                                            </MDTypography>
                                        </MDBox>
                                    </FeatureCard>
                                </Grid>
                            ))}
                        </Grid>
                    </MDBox>

                    {/* Nasıl Başlarım */}
                    <MDBox component="section" mb={6} aria-labelledby="how-to-start">
                        <Card sx={{ p: 4, background: "linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%)", borderRadius: 3 }}>
                            <MDTypography 
                                component="h2"
                                id="how-to-start"
                                variant="h4" 
                                fontWeight="bold" 
                                color="dark" 
                                mb={2}
                            >
                                Nasıl Başlarım?
                            </MDTypography>
                            <MDTypography variant="body1" color="text" sx={{ mb: 3, lineHeight: 1.8 }}>
                                {processTitle} süreci için BMP yazılımı ve süreç yazılımı çözümümüzü kullanarak hızlıca başlayabilirsiniz. 
                                FormNeo BPM platformu ile görsel workflow tasarımcısı kullanarak sürecinizi özelleştirebilir, form alanlarını 
                                düzenleyebilir ve onay akışlarını yapılandırabilirsiniz. Kod yazmaya gerek yok, 
                                sürükle-bırak arayüzü ile {process.implementation} içinde kullanıma hazır hale getirin.
                            </MDTypography>
                            <MDBox display="flex" gap={2} flexWrap="wrap">
                                <MDButton
                                    variant="gradient"
                                    color="info"
                                    size="large"
                                    onClick={handleRegister}
                                >
                                    Ücretsiz Başla
                                </MDButton>
                                <MDButton
                                    variant="outlined"
                                    color="info"
                                    size="large"
                                    onClick={() => window.open('mailto:info@formneo.com?subject=' + encodeURIComponent(`${processTitle} Süreci Hakkında Bilgi`))}
                                >
                                    Detaylı Bilgi Al
                                </MDButton>
                            </MDBox>
                        </Card>
                    </MDBox>

                    {/* İlgili Süreçler */}
                    <MDBox component="section" mb={6} aria-labelledby="related-processes">
                        <MDTypography 
                            component="h2"
                            id="related-processes"
                            variant="h4" 
                            fontWeight="bold" 
                            color="dark" 
                            mb={3}
                        >
                            İlgili Süreçler
                        </MDTypography>
                        <Grid container spacing={3}>
                            {sectionKeys
                                .filter(k => k.startsWith(process.key.split("_")[0] + "_") && k !== process.key)
                                .slice(0, 3)
                                .map((relatedKey) => {
                                    const titleKey = `landing:Sections.${relatedKey}.Title` as any;
                                    const relatedTitle = t(titleKey) as unknown as string;
                                    return (
                                        <Grid item xs={12} md={4} key={relatedKey}>
                                            <Card
                                                component={Link}
                                                to={`/processes/${relatedKey}`}
                                                sx={{
                                                    p: 3,
                                                    textDecoration: "none",
                                                    borderRadius: 2,
                                                    border: "1px solid #e2e8f0",
                                                    transition: "all 0.3s ease",
                                                    "&:hover": {
                                                        transform: "translateY(-4px)",
                                                        boxShadow: "0 12px 24px rgba(102, 126, 234, 0.15)",
                                                        borderColor: "#667eea",
                                                    },
                                                }}
                                            >
                                                <MDBox display="flex" alignItems="center" gap={2} mb={1}>
                                                    <Box component="span" aria-hidden="true">
                                                        {iconFor(relatedKey)}
                                                    </Box>
                                                    <MDTypography component="h3" variant="h6" fontWeight="bold" color="dark">
                                                        {relatedTitle.replace(/[🎯📅📊📈🎓⚠️⚖️👋💰🔄📦🏭🔧📋🔍📊✅📝🔬📈⚠️📋🎓✅📊]/g, "").trim()}
                                                    </MDTypography>
                                                </MDBox>
                                                <MDTypography variant="body2" color="text">
                                                    Detaylar için tıklayın →
                                                </MDTypography>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                        </Grid>
                    </MDBox>
                </Container>
            </PageLayout>
    );
}

export default ProcessDetail;

