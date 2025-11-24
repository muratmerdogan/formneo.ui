import React, { useEffect, useState, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FormDataApi, WorkFlowApi, UserApi, WorkFlowStartApiDto, AlertNodeInfo } from "api/generated";
import getConfiguration from "confiuration";
import { showWorkflowAlert } from "./utils/workflowAlert";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Button, Card, CardContent, Typography, Box } from "@mui/material";

// Formily render
import "antd/dist/antd.css";
import { createForm } from "@formily/core";
import { FormProvider, createSchemaField } from "@formily/react";
import * as AntdFormily from "@formily/antd";
import { Button as AntButton, message, Card as AntdCard, Slider as AntdSlider, Rate as AntdRate } from "antd";
import * as Icons from "@ant-design/icons";
import { WorkFlowContiuneApiDto } from "api/generated";


interface FormButton {
  id: string;
  label: string;
  type?: "primary" | "default" | "dashed" | "link" | "text";
  icon?: string;
  action?: string;
}

/**
 * ✅ Workflow Runtime Sayfası
 * 
 * Bu sayfa workflow instance'ını çalıştırır ve formu gösterir.
 * Form butonlarına göre workflow ilerletilir.
 */
export default function WorkflowRuntime(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schema, setSchema] = useState<any>(null);
  const [formName, setFormName] = useState<string>("");
  const [formButtons, setFormButtons] = useState<FormButton[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>("");

  // Workflow instance bilgisi (location.state'den gelir)
  const workflowInstance = location.state?.workflowInstance;
  const isNewInstance = location.state?.isNewInstance || false;

  const form = useMemo(() => createForm(), []);
  const SchemaField = useMemo(() => createSchemaField({ components: { ...(AntdFormily as any), Card: AntdCard, Slider: AntdSlider, Rate: AntdRate } }), []);

  // Kullanıcı bilgisini yükle
  useEffect(() => {
    const loadUser = async () => {
      try {
        const conf = getConfiguration();
        const userApi = new UserApi(conf);
        const userResponse = await userApi.apiUserGetLoginUserDetailGet();
        setCurrentUser(userResponse.data?.userName || "");
      } catch (err) {
        // Kullanıcı bilgisi yüklenemedi - sessizce devam et
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!workflowInstance?.formId) {
        setError("Workflow instance bilgisi bulunamadı");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const conf = getConfiguration();
        const formApi = new FormDataApi(conf);

        // Form bilgisini çek
        const response = await formApi.apiFormDataIdGet(workflowInstance.formId);
        const form = response.data;

        if (!form?.formDesign) {
          setError("Form tasarımı bulunamadı");
          setLoading(false);
          return;
        }

        setFormName(form.formName || "İsimsiz Form");

        // Form design'ı parse et
        const parsed = typeof form.formDesign === "string" 
          ? JSON.parse(form.formDesign) 
          : form.formDesign;


        // Schema'yı oluştur
        if (parsed.schema) {
          setSchema(parsed.schema);
        } else {
          // Eski format için schema oluştur
          const schema = {
            type: "object",
            properties: {},
          };
          setSchema(schema);
        }

        // Button panel'i yükle
        if (parsed.buttonPanel?.buttons && Array.isArray(parsed.buttonPanel.buttons)) {
          setFormButtons(parsed.buttonPanel.buttons);
        }

      } catch (err: any) {
        let errorMsg = "Form yüklenirken bir hata oluştu";
        
        if (err.response) {
          errorMsg = err.response.data?.message || err.response.data || errorMsg;
        } else if (err.message) {
          errorMsg = err.message;
        }
        
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [workflowInstance?.formId]);

  /**
   * ✅ Form butonuna tıklandığında - Backend'e workflow başlatma isteği gönder
   * BMP Modülü için: Hangi butondan tıklandıysa o butonun action kodu gönderilir
   * 
   * Eğer instance ID varsa (devam eden workflow), continue eder
   * Eğer instance ID yoksa (yeni workflow), start eder
   */
  const handleButtonClick = async (button: FormButton) => {
    if (submitting) {
      return; // Çift tıklamayı önle
    }

    // ✅ Action kod kontrolü - BMP modülü için zorunlu
    if (!button.action || !button.action.trim()) {
      message.error("Bu buton için Action Code tanımlanmamış! Lütfen form tasarımcısında Action Code ekleyin.", 5);
      return;
    }

    try {
      setSubmitting(true);

      // Form validasyonu
      await form.validate();
      const formValues = form.values;

      // ✅ Workflow ID kontrolü
      if (!workflowInstance?.workflowId) {
        throw new Error("Workflow ID bulunamadı");
      }

      const conf = getConfiguration();
      const workflowApi = new WorkFlowApi(conf);

      // ✅ BMP Modülü için: Action kodunu normalize et (büyük harf, underscore ile ayır)
      const normalizedAction = button.action.trim().toUpperCase().replace(/\s+/g, "_");

      // ✅ WorkFlowInfo oluştur
      const workFlowInfo = JSON.stringify({
        formData: formValues,
        buttonAction: normalizedAction, // ✅ BMP modülü için normalize edilmiş action kodu
        buttonLabel: button.label,
        formId: workflowInstance.formId,
        timestamp: new Date().toISOString(),
      });

      // ✅ Instance ID kontrolü - Varsa continue, yoksa start
      const instanceId = id && id !== "new" ? id : workflowInstance?.id;

      if (instanceId && instanceId !== "new") {
        // ✅ Mevcut instance varsa - Workflow devam ettir
        const continueDto: WorkFlowContiuneApiDto = {
          workFlowItemId: instanceId,
          userName: currentUser || undefined,
          input: workFlowInfo,
          note: normalizedAction,
        };

        const response = await workflowApi.apiWorkFlowContiunePost(continueDto);
        
        if (!response || !response.data) {
          throw new Error("Backend'den geçersiz yanıt alındı");
        }

        const result = response.data;

        // ✅ Response'dan gelen alertInfo varsa göster
        if (result.alertInfo) {
          const alertInfo: AlertNodeInfo = result.alertInfo;
          showWorkflowAlert({
            title: alertInfo.title || "Bildirim",
            message: alertInfo.message || "Mesaj yok",
            type: (alertInfo.type as any) || "info",
          });
        } else {
          // Alert yoksa normal başarı mesajı göster
          message.success(
            `${button.label} butonuna tıklandı (Action: ${normalizedAction}). Workflow devam ediyor.`,
            3
          );
        }
      } else {
        // ✅ Yeni instance - Workflow başlat
        const startDto: WorkFlowStartApiDto = {
          definationId: workflowInstance.workflowId,
          userName: currentUser || undefined,
          workFlowInfo: workFlowInfo,
          action: normalizedAction, // ✅ BMP modülü için action kodu (doğrudan alan olarak)
          formData: JSON.stringify(formValues), // ✅ Form verileri (ayrı bir alan olarak da gönderiliyor)
        };

        const response = await workflowApi.apiWorkFlowStartPost(startDto);
        
        if (!response || !response.data) {
          throw new Error("Backend'den geçersiz yanıt alındı");
        }

        const result = response.data;

        // ✅ Response'dan gelen alertInfo varsa göster
        if (result.alertInfo) {
          const alertInfo: AlertNodeInfo = result.alertInfo;
          showWorkflowAlert({
            title: alertInfo.title || "Bildirim",
            message: alertInfo.message || "Mesaj yok",
            type: (alertInfo.type as any) || "info",
          });
        } else {
          // Alert yoksa normal başarı mesajı göster
          message.success(
            `${button.label} butonuna tıklandı (Action: ${normalizedAction}). Workflow başlatıldı.`,
            3
          );
        }

        // ✅ Response'dan gelen diğer bilgileri logla (gerekirse)
        // result.workFlowStatus - Workflow durumu
        // result.pendingNodeId - Bekleyen node ID
        // result.formNodeCompleted - Form node tamamlandı mı
        // result.completedFormNodeId - Tamamlanan form node ID

        // Yeni instance ID ile görevlerim sayfasına yönlendir
        setTimeout(() => {
          navigate("/workflows/my-tasks", {
            state: {
              newInstanceId: result.id,
              buttonAction: normalizedAction,
              workflowStatus: result.workFlowStatus,
              pendingNodeId: result.pendingNodeId,
            },
          });
        }, result.alertInfo ? 3000 : 1500); // Alert varsa biraz daha bekleyelim
        return;
      }

      // Görevlerim sayfasına yönlendir (continue durumu için)
      setTimeout(() => {
        navigate("/workflows/my-tasks", {
          state: {
            buttonAction: normalizedAction,
          },
        });
      }, 1500);
    } catch (error: any) {
      // ✅ Detaylı hata mesajı oluştur
      let errorMessage = "Workflow başlatılırken bir hata oluştu";
      
      if (error.response) {
        // Backend'den gelen hata
        const responseData = error.response.data;
        
        if (responseData?.message) {
          errorMessage = responseData.message;
        } else if (typeof responseData === "string") {
          errorMessage = responseData;
        } else if (responseData?.errors && Array.isArray(responseData.errors)) {
          errorMessage = `Validasyon hataları: ${responseData.errors.join(", ")}`;
        } else if (responseData?.title) {
          errorMessage = responseData.title;
        }
        
        // HTTP status koduna göre ek bilgi
        const status = error.response.status;
        if (status === 400) {
          errorMessage = `Geçersiz istek: ${errorMessage}`;
        } else if (status === 401) {
          errorMessage = "Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.";
        } else if (status === 403) {
          errorMessage = "Bu işlem için yetkiniz bulunmuyor.";
        } else if (status === 404) {
          errorMessage = "Workflow tanımı bulunamadı.";
        } else if (status === 500) {
          errorMessage = `Sunucu hatası: ${errorMessage}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Kullanıcıya detaylı hata mesajı göster
      message.error(
        `❌ ${errorMessage}\n\nButon: ${button.label}\nAction: ${button.action || "Tanımlı değil"}`,
        8
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox my={3}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <Typography>Form yükleniyor...</Typography>
            </CardContent>
          </Card>
        </MDBox>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox my={3}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <Typography color="error">{error}</Typography>
              <Button onClick={() => navigate("/workflows/my-tasks")} sx={{ mt: 2 }}>
                Geri Dön
              </Button>
            </CardContent>
          </Card>
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <>
      {/* Footer'ı gizle ve scroll bar sorununu çöz */}
      <style>{`
        footer,
        [class*="Footer"],
        [id*="footer"] {
          display: none !important;
        }
        body {
          overflow-x: hidden !important;
        }
        html {
          overflow-x: hidden !important;
        }
      `}</style>
      
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DashboardLayout>
          <DashboardNavbar />
          <MDBox 
            my={3} 
            sx={{ 
              paddingBottom: formButtons.length > 0 ? "100px" : "20px",
              overflowY: "auto",
              overflowX: "hidden",
              flex: 1,
              width: "100%",
              maxHeight: "calc(100vh - 150px)",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <MDTypography variant="h4" fontWeight={600} gutterBottom>
                {formName}
              </MDTypography>
              {workflowInstance?.workflowName && (
                <MDTypography variant="body2" color="textSecondary">
                  Workflow: {workflowInstance.workflowName}
                </MDTypography>
              )}
            </Box>

            <MDBox 
              p={2} 
              sx={{ 
                backgroundColor: "#fff", 
                borderRadius: 2, 
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)" 
              }}
            >
              <FormProvider form={form}>
                <AntdFormily.Form>
                  <AntdFormily.FormLayout layout="horizontal" labelAlign="left" labelCol={6} wrapperCol={18} size="default">
                    <SchemaField schema={schema} />
                  </AntdFormily.FormLayout>
                </AntdFormily.Form>
              </FormProvider>
            </MDBox>
          </MDBox>
        </DashboardLayout>

        {/* Button Panel - En altta sabit */}
        {formButtons.length > 0 && (
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              width: "100%",
              backgroundColor: "#ffffff",
              borderTop: "2px solid #e0e0e0",
              padding: "20px 24px",
              boxShadow: "0 -4px 16px rgba(0,0,0,0.2)",
              zIndex: 1300,
              display: "flex",
              gap: 2,
              justifyContent: "center",
              alignItems: "center",
              minHeight: "80px",
              overflowX: "hidden",
            }}
          >
            {formButtons.map((button) => {
              const IconComponent = button.icon
                ? (Icons as any)[button.icon] || Icons.CheckOutlined
                : null;

              // ✅ Action kod kontrolü - BMP modülü için
              const hasAction = button.action && button.action.trim();
              const buttonDisabled = submitting || !hasAction;

              return (
                <AntButton
                  key={button.id}
                  type={button.type || "primary"}
                  icon={IconComponent ? <IconComponent /> : null}
                  onClick={() => handleButtonClick(button)}
                  size="large"
                  style={{ margin: "0 8px" }}
                  loading={submitting}
                  disabled={buttonDisabled}
                  title={hasAction ? `Action: ${button.action}` : "Action Code tanımlanmamış!"}
                >
                  {submitting ? "Gönderiliyor..." : button.label}
                  {hasAction && (
                    <span style={{ fontSize: "0.7em", marginLeft: "4px", opacity: 0.7 }}>
                      ({button.action})
                    </span>
                  )}
                </AntButton>
              );
            })}
          </Box>
        )}
      </Box>
    </>
  );
}
