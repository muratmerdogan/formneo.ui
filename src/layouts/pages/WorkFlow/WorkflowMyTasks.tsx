import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  AccessTime as AccessTimeIcon,
  PlayArrow as PlayArrowIcon,
  AddCircle as AddCircleIcon,
  List as ListIcon,
} from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { WorkFlowDefinationApi, FormDataApi, WorkFlowApi, UserApi } from "api/generated";
import getConfiguration from "confiuration";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

/**
 * ✅ Workflow Runtime - Kullanıcının Görevleri
 * 
 * Bu sayfa iki ana bölümden oluşur:
 * 
 * 1. DEVAM EDEN GÖREVLERİM:
 *    - Kullanıcıya atanmış devam eden workflow instance'ları
 *    - Form adı, workflow adı, durum, tarih bilgileri
 *    - Tıklayınca form açılır ve workflow devam eder
 * 
 * 2. YENİ SÜREÇ BAŞLAT:
 *    - Tüm tanımlı workflow'ları listeler
 *    - Form ile başlayan workflow'lar gösterilir
 *    - Tıklayınca yeni instance oluşturulur ve form açılır
 */

interface WorkflowInstance {
  id: string;
  workflowId: string;
  workflowName: string;
  formId: string;
  formName: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  startDate: string;
  lastUpdateDate: string;
  currentStep?: string;
  assignedUserId?: string;
}

function WorkflowMyTasks() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0); // 0: Devam Eden Görevlerim, 1: Yeni Süreç Başlat
  const [workflowInstances, setWorkflowInstances] = useState<WorkflowInstance[]>([]);
  const [availableWorkflows, setAvailableWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingWorkflows, setLoadingWorkflows] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "in-progress" | "completed">("all");

  useEffect(() => {
    if (activeTab === 0) {
      fetchWorkflowInstances();
    } else {
      fetchAvailableWorkflows();
    }
  }, [activeTab]);

  /**
   * ✅ Kullanıcıya atanmış workflow instance'larını çek
   * 
   * NOT: Backend'de workflow instance API'si hazır olduğunda bu fonksiyon güncellenecek
   * Örnek: apiWorkFlowGetWorkflowHeadsGet() veya apiWorkFlowGetWorkflowHeadsByUserGet(userId)
   */
  const fetchWorkflowInstances = async () => {
    setLoading(true);
    try {
      const conf = getConfiguration();
      const workflowApi = new WorkFlowApi(conf);
      const userApi = new UserApi(conf);

      // ✅ Kullanıcı bilgisini al
      let currentUserId: string | null = null;
      try {
        const userResponse = await userApi.apiUserGetLoginUserDetailGet();
        currentUserId = (userResponse.data as any)?.id || (userResponse.data as any)?.userId || null;
      } catch (error) {
        console.warn("Kullanıcı bilgisi alınamadı:", error);
      }

      // ✅ Backend'den workflow instance'ları çek
      // NOT: Backend API'si hazır olduğunda aşağıdaki satırı aktif edin:
      // const response = await workflowApi.apiWorkFlowGetWorkflowHeadsGet();
      // const instances = response.data || [];
      
      // Şimdilik boş liste döndür (backend hazır olana kadar)
      const instances: WorkflowInstance[] = [];

      setWorkflowInstances(instances);
    } catch (error) {
      console.error("Workflow instance'ları çekilirken hata:", error);
      setWorkflowInstances([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ Mevcut workflow'ları çek (yeni süreç başlatmak için)
   * 
   * Workflow tablosundaki tüm workflow'ları listeler.
   * Her workflow için form bilgisini çeker (eğer varsa).
   */
  const fetchAvailableWorkflows = async () => {
    setLoadingWorkflows(true);
    try {
      const conf = getConfiguration();
      const workflowApi = new WorkFlowDefinationApi(conf);
      const formApi = new FormDataApi(conf);

      // ✅ Tüm workflow'ları çek
      const workflowsResponse = await workflowApi.apiWorkFlowDefinationGet();
      const workflows = workflowsResponse.data || [];

      console.log("📋 Toplam workflow sayısı:", workflows.length);

      const workflowsWithForms: any[] = [];

      for (const workflow of workflows) {
        let formId: string | null = null;
        let formName: string = "";

        // ✅ Önce workflow'un kendi formId'sine bak (eğer varsa)
        // NOT: WorkFlowDefinationListDto'da formId yok, ama WorkFlowDefination'da olabilir
        // Detaylı bilgi için tek tek çekmek gerekebilir
        
        // ✅ Workflow detayını çek (formId için)
        try {
          const workflowDetail = await workflowApi.apiWorkFlowDefinationIdGet(workflow.id || "");
          formId = (workflowDetail.data as any)?.formId || null;
        } catch (error) {
          // Detay çekilemezse devam et
        }

        // ✅ Eğer workflow'da formId yoksa, defination'dan node'lardan bul
        if (!formId && workflow.defination) {
          try {
            const parsedDefination = JSON.parse(workflow.defination);
            
            // FormNode'dan formId'yi bul
            const formNode = parsedDefination.nodes?.find(
              (n: any) => n.type === "formNode" && n.data?.selectedFormId
            );

            if (formNode?.data?.selectedFormId) {
              formId = formNode.data.selectedFormId;
              formName = formNode.data.selectedFormName || formNode.data.name || "";
            }
          } catch (error) {
            // Parse hatası varsa devam et
          }
        }

        // ✅ Form bilgisini çek
        if (formId) {
          try {
            const formResponse = await formApi.apiFormDataIdGet(formId);
            formName = formResponse.data?.formName || formName;
          } catch (error) {
            console.warn(`Form ${formId} çekilemedi:`, error);
          }
        }

        // ✅ Tüm workflow'ları ekle (formId olsun ya da olmasın)
        workflowsWithForms.push({
          id: workflow.id,
          workflowName: workflow.workflowName || "İsimsiz Workflow",
          formId: formId || null,
          formName: formName || (formId ? "İsimsiz Form" : "Form bulunamadı"),
          defination: workflow.defination,
          hasForm: !!formId,
        });
      }

      console.log(`📊 Toplam ${workflowsWithForms.length} workflow listelendi`);
      setAvailableWorkflows(workflowsWithForms);
    } catch (error) {
      console.error("Workflow'lar çekilirken hata:", error);
    } finally {
      setLoadingWorkflows(false);
    }
  };

  /**
   * ✅ Devam eden workflow instance'a tıklandığında form sayfasına yönlendir
   */
  const handleWorkflowClick = (instance: WorkflowInstance) => {
    // Workflow runtime sayfasına yönlendir (form ile birlikte)
    navigate(`/workflows/runtime/${instance.id}`, {
      state: {
        workflowInstance: instance,
      },
    });
  };

  /**
   * ✅ Yeni workflow için form göster
   * 
   * Workflow instance oluşturmaz, sadece form sayfasına yönlendirir.
   * Workflow, form butonuna basınca başlatılacak.
   */
  const handleStartNewWorkflow = async (workflow: any) => {
    if (!workflow.formId) {
      alert("Bu workflow için form tanımlanmamış!");
      return;
    }

    // ✅ Sadece form sayfasına yönlendir (instance ID yok, workflow başlatılmadı)
    // Form butonuna basınca workflow başlatılacak
    navigate(`/workflows/runtime/new`, {
      state: {
        workflowInstance: {
          workflowId: workflow.id,
          workflowName: workflow.workflowName,
          formId: workflow.formId,
          formName: workflow.formName,
        },
        isNewInstance: true,
      },
    });
  };

  /**
   * ✅ Durum rengi
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "in-progress":
        return "info";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  /**
   * ✅ Durum metni
   */
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Beklemede";
      case "in-progress":
        return "Devam Ediyor";
      case "completed":
        return "Tamamlandı";
      case "cancelled":
        return "İptal Edildi";
      default:
        return status;
    }
  };

  /**
   * ✅ Filtrelenmiş instance'lar
   */
  const filteredInstances =
    filter === "all"
      ? workflowInstances
      : workflowInstances.filter((instance) => instance.status === filter);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            İş Akışları
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Devam eden görevlerinizi görüntüleyin veya yeni süreç başlatın
          </Typography>
        </Box>

        {/* Sekmeler */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab
              icon={<ListIcon />}
              iconPosition="start"
              label="Devam Eden Görevlerim"
              sx={{ textTransform: "none", fontSize: "1rem" }}
            />
            <Tab
              icon={<AddCircleIcon />}
              iconPosition="start"
              label="Yeni Süreç Başlat"
              sx={{ textTransform: "none", fontSize: "1rem" }}
            />
          </Tabs>
        </Box>

        {/* Devam Eden Görevlerim Sekmesi */}
        {activeTab === 0 && (
          <>
            {/* Filtreler */}
            <Box sx={{ mb: 3, display: "flex", gap: 1 }}>
              <Chip
                label="Tümü"
                onClick={() => setFilter("all")}
                color={filter === "all" ? "primary" : "default"}
                clickable
              />
              <Chip
                label="Beklemede"
                onClick={() => setFilter("pending")}
                color={filter === "pending" ? "warning" : "default"}
                clickable
              />
              <Chip
                label="Devam Ediyor"
                onClick={() => setFilter("in-progress")}
                color={filter === "in-progress" ? "info" : "default"}
                clickable
              />
              <Chip
                label="Tamamlandı"
                onClick={() => setFilter("completed")}
                color={filter === "completed" ? "success" : "default"}
                clickable
              />
            </Box>

            {/* Workflow Instance Listesi */}
            {loading ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography>Yükleniyor...</Typography>
              </Box>
            ) : filteredInstances.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <AssignmentIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    Görev bulunamadı
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Size atanmış bir iş akışı bulunmamaktadır.
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={2}>
                {filteredInstances.map((instance) => (
                  <Grid item xs={12} md={6} lg={4} key={instance.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          boxShadow: 6,
                          transform: "translateY(-2px)",
                        },
                      }}
                      onClick={() => handleWorkflowClick(instance)}
                    >
                      <CardContent sx={{ flex: 1 }}>
                        {/* Başlık */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                              {instance.formName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {instance.workflowName}
                            </Typography>
                          </Box>
                          <Chip
                            label={getStatusText(instance.status)}
                            color={getStatusColor(instance.status) as any}
                            size="small"
                          />
                        </Box>

                        <Box sx={{ borderTop: 1, borderColor: "divider", my: 2 }} />

                        {/* Detaylar */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography variant="caption" color="textSecondary">
                              Başlangıç: {format(new Date(instance.startDate), "dd MMM yyyy HH:mm", { locale: tr })}
                            </Typography>
                          </Box>
                          {instance.currentStep && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <PlayArrowIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                              <Typography variant="caption" color="textSecondary">
                                Adım: {instance.currentStep}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </CardContent>

                      {/* Footer */}
                      <Box sx={{ p: 2, pt: 0 }}>
                        <MDButton
                          variant="gradient"
                          color="info"
                          fullWidth
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWorkflowClick(instance);
                          }}
                        >
                          Devam Et
                        </MDButton>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {/* Yeni Süreç Başlat Sekmesi */}
        {activeTab === 1 && (
          <>
            {loadingWorkflows ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography>Yükleniyor...</Typography>
              </Box>
            ) : availableWorkflows.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <AddCircleIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    Workflow bulunamadı
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Başlatılabilecek aktif workflow bulunmamaktadır.
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={2}>
                {availableWorkflows.map((workflow) => (
                  <Grid item xs={12} md={6} lg={4} key={workflow.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          boxShadow: 6,
                          transform: "translateY(-2px)",
                        },
                      }}
                      onClick={() => handleStartNewWorkflow(workflow)}
                    >
                      <CardContent sx={{ flex: 1 }}>
                        {/* Başlık */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                              {workflow.workflowName}
                            </Typography>
                            {workflow.hasForm ? (
                              <Typography variant="body2" color="textSecondary">
                                Form: {workflow.formName}
                              </Typography>
                            ) : (
                              <Typography variant="body2" color="error">
                                Form bulunamadı
                              </Typography>
                            )}
                          </Box>
                          <Chip 
                            label={workflow.hasForm ? "Yeni" : "Form Yok"} 
                            color={workflow.hasForm ? "primary" : "default"} 
                            size="small" 
                          />
                        </Box>

                        <Box sx={{ borderTop: 1, borderColor: "divider", my: 2 }} />

                        {/* Açıklama */}
                        <Typography variant="body2" color="textSecondary">
                          {workflow.hasForm 
                            ? "Bu workflow'u başlatmak için tıklayın. Form açılacak ve süreç başlayacaktır."
                            : "Bu workflow için form tanımlanmamış. Önce workflow'a form ekleyin."
                          }
                        </Typography>
                      </CardContent>

                      {/* Footer */}
                      <Box sx={{ p: 2, pt: 0 }}>
                        <MDButton
                          variant="gradient"
                          color={workflow.hasForm ? "success" : "secondary"}
                          fullWidth
                          startIcon={<AddCircleIcon />}
                          disabled={!workflow.hasForm}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (workflow.hasForm) {
                              handleStartNewWorkflow(workflow);
                            }
                          }}
                        >
                          {workflow.hasForm ? "Başlat" : "Form Gerekli"}
                        </MDButton>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default WorkflowMyTasks;
