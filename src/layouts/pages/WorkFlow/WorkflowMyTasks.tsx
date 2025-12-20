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
import { WorkFlowDefinationApi, FormDataApi, WorkFlowApi, UserApi, MyTasksDto, FormTaskItemDto, UserTaskItemDto, FormItemStatus, ApproverStatus, TaskFormDto } from "api/generated";
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

interface WorkflowTask {
  id: string;
  workflowItemId?: string;
  workflowHeadId?: string;
  shortId?: string | null;
  type: "formTask" | "userTask";
  formId?: string | null;
  formName?: string;
  workflowName?: string;
  message?: string | null;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  createdDate?: string;
  uniqNumber?: number;
  // FormTask için
  formDesign?: string | null;
  formTaskMessage?: string | null;
  formDescription?: string | null;
  // UserTask için
  approveUser?: string | null;
  approveUserNameSurname?: string | null;
}

function WorkflowMyTasks() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0); // 0: Devam Eden Görevlerim, 1: Yeni Süreç Başlat
  const [workflowTasks, setWorkflowTasks] = useState<WorkflowTask[]>([]);
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
   * ✅ Kullanıcıya atanmış workflow görevlerini çek
   * /api/WorkFlow/GetMyTasks/my-tasks endpoint'ini kullanır
   */
  const fetchWorkflowInstances = async () => {
    setLoading(true);
    try {
      const conf = getConfiguration();
      const workflowApi = new WorkFlowApi(conf);

      // ✅ API'den kullanıcının görevlerini çek
      const response = await workflowApi.apiWorkFlowGetMyTasksMyTasksGet();
      const myTasks: MyTasksDto = response.data || {};

      const tasks: WorkflowTask[] = [];

      // FormTask'ları ekle
      if (myTasks.formTasks && Array.isArray(myTasks.formTasks)) {
        myTasks.formTasks.forEach((formTask: FormTaskItemDto) => {
          // FormItemStatus: 0=Pending, 1=InProgress, 2=Completed
          let status: "pending" | "in-progress" | "completed" | "cancelled" = "pending";
          if (formTask.formItemStatus === FormItemStatus.NUMBER_2) {
            status = "completed";
          } else if (formTask.formItemStatus === FormItemStatus.NUMBER_1) {
            status = "in-progress";
          } else {
            status = "pending";
          }

          // FormTask için form bilgisi - workFlowHead yoksa formTask'tan al
          const formTaskFormId = formTask.formId || null;
          // workFlowHead varsa ondan al, yoksa formTask'tan al
          const formTaskFormName = formTask.workFlowHead?.workFlowDefination?.form?.formName || 
                                  formTask.formDescription || 
                                  formTask.formTaskMessage || 
                                  "Form Görevi";
          const workflowName = formTask.workFlowHead?.workflowName || "İş Akışı";

          tasks.push({
            id: formTask.id || "",
            workflowItemId: formTask.workflowItemId,
            workflowHeadId: formTask.workflowHeadId,
            shortId: formTask.shortId,
            type: "formTask",
            formId: formTaskFormId,
            formName: formTaskFormName,
            workflowName: workflowName,
            message: formTask.formTaskMessage || formTask.formDescription || null,
            status,
            createdDate: formTask.createdDate,
            uniqNumber: formTask.uniqNumber,
            formDesign: formTask.formDesign,
            formTaskMessage: formTask.formTaskMessage,
            formDescription: formTask.formDescription,
          });
        });
      }

      // UserTask'ları ekle
      if (myTasks.userTasks && Array.isArray(myTasks.userTasks)) {
        myTasks.userTasks.forEach((userTask: UserTaskItemDto) => {
          // ApproverStatus: 0=Pending, 1=InProgress, 2=Approved, 3=Rejected
          let status: "pending" | "in-progress" | "completed" | "cancelled" = "pending";
          if (userTask.approverStatus === ApproverStatus.NUMBER_2 || userTask.approverStatus === ApproverStatus.NUMBER_3) {
            status = "completed";
          } else if (userTask.approverStatus === ApproverStatus.NUMBER_1) {
            status = "in-progress";
          } else {
            status = "pending";
          }

          // UserTask için form bilgisi - workFlowHead yoksa varsayılan değerler kullan
          const formId = userTask.workFlowHead?.workFlowDefination?.formId || null;
          const formName = userTask.workFlowHead?.workFlowDefination?.form?.formName || 
                          "Kullanıcı Görevi";
          const workflowName = userTask.workFlowHead?.workflowName || "İş Akışı";

          tasks.push({
            id: userTask.id || "",
            workflowItemId: userTask.workflowItemId,
            workflowHeadId: userTask.workflowHeadId,
            shortId: userTask.shortId,
            type: "userTask",
            formId: formId,
            formName: formName,
            workflowName: workflowName,
            message: null,
            status,
            createdDate: userTask.createdDate,
            uniqNumber: userTask.uniqNumber,
            approveUser: userTask.approveUser,
            approveUserNameSurname: userTask.approveUserNameSurname,
          });
        });
      }

      setWorkflowTasks(tasks);
    } catch (error) {
      console.error("Workflow görevleri çekilirken hata:", error);
      setWorkflowTasks([]);
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
   * ✅ Devam eden workflow görevine tıklandığında API'den detay çek ve form/userTask göster
   */
  const handleWorkflowClick = async (task: WorkflowTask) => {
    try {
      const conf = getConfiguration();
      const workflowApi = new WorkFlowApi(conf);

      // workflowItemId'yi al (task'tan veya id'den)
      const workflowItemId = task.workflowItemId || task.id;
      
      if (!workflowItemId) {
        console.error("WorkflowItemId bulunamadı");
        alert("Görev detayı alınamadı: WorkflowItemId bulunamadı");
        return;
      }

      // ✅ API'den görev detayını çek
      const response = await workflowApi.apiWorkFlowGetTaskDetailByWorkflowItemIdWorkflowitemWorkflowItemIdTaskDetailGet(workflowItemId);
      const taskDetail: TaskFormDto = response.data;

      console.log("✅ Görev detayı alındı:", taskDetail);

      // ✅ taskType veya nodeType'a göre formTask mı userTask mı belirle
      const isFormTask = taskDetail.formItemId !== null && taskDetail.formItemId !== undefined;
      const isUserTask = taskDetail.approveItemId !== null && taskDetail.approveItemId !== undefined;
      
      // Alternatif olarak taskType veya nodeType'a bak
      const taskType = taskDetail.taskType || taskDetail.nodeType || "";
      const isFormTaskByType = taskType?.toLowerCase().includes("form") || taskDetail.nodeType?.toLowerCase() === "formtasknode";
      const isUserTaskByType = taskType?.toLowerCase().includes("user") || taskDetail.nodeType?.toLowerCase() === "usertasknode";

      // Son karar: önce itemId'lere bak, yoksa type'a bak
      const finalIsFormTask = isFormTask || (isFormTaskByType && !isUserTask);
      const finalIsUserTask = isUserTask || (isUserTaskByType && !isFormTask);

      const workflowInstanceId = taskDetail.workflowHeadId || task.workflowHeadId || task.workflowItemId || task.id;

      // ✅ FormTask ise runtime sayfasına yönlendir
      if (finalIsFormTask) {
        navigate(`/workflows/runtime/${workflowInstanceId}`, {
          state: {
            workflowInstance: {
              id: workflowInstanceId,
              workflowId: taskDetail.workflowHeadId || task.workflowHeadId || "",
              workflowName: task.workflowName || "İş Akışı",
              formId: taskDetail.formId || task.formId || "",
              formName: task.formName || "Form",
              taskId: taskDetail.formItemId || task.id,
              taskType: "formTask",
              formDesign: taskDetail.formDesign || task.formDesign,
              formData: taskDetail.formData,
              workflowItemId: taskDetail.workflowItemId || workflowItemId,
            },
            task: task,
            taskDetail: taskDetail,
          },
        });
      } 
      // ✅ UserTask ise userTask sayfasına yönlendir (veya runtime'da userTask göster)
      else if (finalIsUserTask) {
        navigate(`/workflows/runtime/${workflowInstanceId}`, {
          state: {
            workflowInstance: {
              id: workflowInstanceId,
              workflowId: taskDetail.workflowHeadId || task.workflowHeadId || "",
              workflowName: task.workflowName || "İş Akışı",
              formId: taskDetail.formId || task.formId || "",
              formName: task.formName || "Kullanıcı Görevi",
              taskId: taskDetail.approveItemId || task.id,
              taskType: "userTask",
              workflowItemId: taskDetail.workflowItemId || workflowItemId,
              approveUser: taskDetail.approveUser,
              approveUserNameSurname: taskDetail.approveUserNameSurname,
              approverStatus: taskDetail.approverStatus,
            },
            task: task,
            taskDetail: taskDetail,
          },
        });
      } 
      // ✅ Belirlenemezse runtime'a git (mevcut mantık)
      else {
        console.warn("Görev tipi belirlenemedi, varsayılan olarak runtime'a yönlendiriliyor");
        navigate(`/workflows/runtime/${workflowInstanceId}`, {
          state: {
            workflowInstance: {
              id: workflowInstanceId,
              workflowId: task.workflowHeadId || "",
              workflowName: task.workflowName || "İş Akışı",
              formId: task.formId || "",
              formName: task.formName || "Form",
              taskId: task.id,
              taskType: task.type,
              formDesign: task.formDesign,
            },
            task: task,
            taskDetail: taskDetail,
          },
        });
      }
    } catch (error) {
      console.error("Görev detayı çekilirken hata:", error);
      alert("Görev detayı alınamadı. Lütfen tekrar deneyin.");
    }
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
   * ✅ Filtrelenmiş görevler
   */
  const filteredTasks =
    filter === "all"
      ? workflowTasks
      : workflowTasks.filter((task) => task.status === filter);

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

            {/* Workflow Görev Listesi */}
            {loading ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography>Yükleniyor...</Typography>
              </Box>
            ) : filteredTasks.length === 0 ? (
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
                {filteredTasks.map((task) => (
                  <Grid item xs={12} md={6} lg={4} key={task.id}>
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
                      onClick={() => handleWorkflowClick(task)}
                    >
                      <CardContent sx={{ flex: 1 }}>
                        {/* Başlık */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                              {task.formName || "Görev"}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {task.workflowName || "İş Akışı"}
                            </Typography>
                            {task.type === "formTask" && (
                              <Chip 
                                label="Form Görevi" 
                                size="small" 
                                color="primary" 
                                sx={{ mt: 0.5, fontSize: "0.7rem" }} 
                              />
                            )}
                            {task.type === "userTask" && (
                              <Chip 
                                label="Kullanıcı Görevi" 
                                size="small" 
                                color="secondary" 
                                sx={{ mt: 0.5, fontSize: "0.7rem" }} 
                              />
                            )}
                          </Box>
                          <Chip
                            label={getStatusText(task.status)}
                            color={getStatusColor(task.status) as any}
                            size="small"
                          />
                        </Box>

                        {/* Mesaj */}
                        {task.message && (
                          <Box sx={{ mb: 2, p: 1.5, bgcolor: "grey.50", borderRadius: 1 }}>
                            <Typography variant="body2" color="textSecondary">
                              {task.message}
                            </Typography>
                          </Box>
                        )}

                        <Box sx={{ borderTop: 1, borderColor: "divider", my: 2 }} />

                        {/* Detaylar */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          {task.createdDate && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                              <Typography variant="caption" color="textSecondary">
                                Oluşturulma: {format(new Date(task.createdDate), "dd MMM yyyy HH:mm", { locale: tr })}
                              </Typography>
                            </Box>
                          )}
                          {task.shortId && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <PlayArrowIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                              <Typography variant="caption" color="textSecondary">
                                ID: {task.shortId}
                              </Typography>
                            </Box>
                          )}
                          {task.type === "userTask" && task.approveUserNameSurname && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <AssignmentIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                              <Typography variant="caption" color="textSecondary">
                                Atanan: {task.approveUserNameSurname}
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
                            handleWorkflowClick(task);
                          }}
                        >
                          {task.type === "formTask" ? "Formu Aç" : "Görevi Görüntüle"}
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
