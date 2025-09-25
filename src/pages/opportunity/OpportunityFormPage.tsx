import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { OpportunitiesApi } from "api/generated/api";
import { useNavigate, useParams } from "react-router-dom";
import { 
  createInsertDto, 
  createUpdateDto, 
  OpportunityFormData,
  createOpportunityFormData
} from "../../utils/opportunityFormUtils";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import getConfiguration from "confiuration";
import MDSnackbar from "components/MDSnackbar";
import { useRegisterActions } from "context/ActionBarContext";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Tabs, Tab, Card, Grid, Typography } from "@mui/material";
import BasicOpportunityInfoSection from "components/opportunities/sections/BasicOpportunityInfoSection";

const schema = z.object({
    // Temel bilgiler - OpportunityInsertDto ve OpportunityUpdateDto'ya uygun
    customerId: z.string().min(1, "Müşteri seçimi zorunlu"),
    title: z.string().min(2, "Başlık zorunlu"),
    stage: z.number().optional(),
    amount: z.number().nullable().optional(),
    currency: z.string().nullable().optional(),
    probability: z.number().min(0).max(100).nullable().optional(),
    expectedCloseDate: z.string().nullable().optional(),
    source: z.string().nullable().optional(),
    ownerUserId: z.string().min(1, "Sahip seçimi zorunlu"),
    description: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function OpportunityFormPage(): JSX.Element {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, trigger, getValues } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { 
            stage: 1, // Yeni fırsat için default stage
            probability: 10,
        },
    });

    // Action bar hem yeni hem edit sayfalarında
    useRegisterActions([
        { id: "cancel", label: "Vazgeç", icon: <CloseIcon fontSize="small" />, onClick: () => navigate(-1) },
        { id: "save", label: isEdit ? "Güncelle" : "Kaydet", icon: <SaveIcon fontSize="small" />, onClick: () => handleSubmit(onSubmit)(), disabled: isSubmitting },
    ], [isEdit, isSubmitting]);

    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [rowVersion, setRowVersion] = useState("");
    
    // Toast state'leri
    const [successSB, setSuccessSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Edit modunda fırsat verilerini yükle
    useEffect(() => {
        if (isEdit && id) {
            loadOpportunityData(id);
        }
    }, [isEdit, id]);

    const loadOpportunityData = async (opportunityId: string) => {
        try {
            setLoading(true);
            const api = new OpportunitiesApi(getConfiguration());
            const response = await api.apiCrmOpportunitiesIdGet(opportunityId);
            const opportunityData = response?.data as any;
            if (opportunityData && typeof opportunityData === 'object') {
                
                // Backend'den gelen veriyi form formatına çevir
                const formData = createOpportunityFormData(opportunityData);
                
                // Form alanlarını doldur
                Object.entries(formData).forEach(([key, value]) => {
                    setValue(key as keyof FormValues, value);
                });
                
                // Row version'ı sakla (güncelleme için gerekli)
                setRowVersion(opportunityData.rowVersion || "");
            }
        } catch (error) {
            console.error("Fırsat verisi yüklenirken hata:", error);
            setErrorMessage("Fırsat verisi yüklenirken hata oluştu");
            setErrorSB(true);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: FormValues) => {
        try {
            const api = new OpportunitiesApi(getConfiguration());
            
            if (isEdit && id) {
                // Güncelleme
                const updateDto = createUpdateDto(id, data, rowVersion);
                await api.apiCrmOpportunitiesIdPut(id, updateDto);
                setSuccessMessage("Fırsat başarıyla güncellendi");
            } else {
                // Yeni oluşturma
                const insertDto = createInsertDto(data);
                await api.apiCrmOpportunitiesPost(insertDto);
                setSuccessMessage("Fırsat başarıyla oluşturuldu");
            }
            
            setSuccessSB(true);
            
            // Başarılı işlem sonrası yönlendirme
            setTimeout(() => {
                navigate("/opportunities");
            }, 2000);
            
        } catch (error) {
            console.error("Fırsat kaydedilirken hata:", error);
            setErrorMessage(isEdit ? "Fırsat güncellenirken hata oluştu" : "Fırsat oluşturulurken hata oluştu");
            setErrorSB(true);
        }
    };

    const tabs = [
        { label: "Genel Bilgiler", value: 0 },
        { label: "Notlar", value: 1 },
        { label: "Aktiviteler", value: 2 },
        { label: "Dosyalar", value: 3 },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 0:
                return (
                    <BasicOpportunityInfoSection
                        register={register}
                        errors={errors}
                        watch={watch}
                        setValue={setValue}
                        trigger={trigger}
                        getValues={getValues}
                    />
                );
            case 1:
                return (
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Notlar
                        </Typography>
                        <Typography color="text.secondary">
                            Notlar bölümü yakında eklenecek...
                        </Typography>
                    </Card>
                );
            case 2:
                return (
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Aktiviteler
                        </Typography>
                        <Typography color="text.secondary">
                            Aktiviteler bölümü yakında eklenecek...
                        </Typography>
                    </Card>
                );
            case 3:
                return (
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Dosyalar
                        </Typography>
                        <Typography color="text.secondary">
                            Dosyalar bölümü yakında eklenecek...
                        </Typography>
                    </Card>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <DashboardNavbar />
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <Typography>Yükleniyor...</Typography>
                </Box>
                <Footer />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                            <Tabs 
                                value={activeTab} 
                                onChange={(_, newValue) => setActiveTab(newValue)}
                                variant="scrollable"
                                scrollButtons="auto"
                            >
                                {tabs.map((tab) => (
                                    <Tab 
                                        key={tab.value} 
                                        label={tab.label} 
                                        value={tab.value}
                                    />
                                ))}
                            </Tabs>
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                        {renderTabContent()}
                    </Grid>
                </Grid>
            </Box>
            
            {/* Success Snackbar */}
            <MDSnackbar
                color="success"
                icon="check"
                title="Başarılı!"
                content={successMessage}
                dateTime="Şimdi"
                open={successSB}
                onClose={() => setSuccessSB(false)}
                close={() => setSuccessSB(false)}
                bgWhite
            />
            
            {/* Error Snackbar */}
            <MDSnackbar
                color="error"
                icon="warning"
                title="Hata!"
                content={errorMessage}
                dateTime="Şimdi"
                open={errorSB}
                onClose={() => setErrorSB(false)}
                close={() => setErrorSB(false)}
                bgWhite
            />
            
            <Footer />
        </DashboardLayout>
    );
}
