import React, { useEffect, useState, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FormDataApi, WorkFlowApi, UserApi } from "api/generated";
import getConfiguration from "confiuration";

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
import { Button as AntButton, message } from "antd";
import * as Icons from "@ant-design/icons";

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
  const SchemaField = useMemo(() => createSchemaField({ components: AntdFormily as any }), []);

  // Kullanıcı bilgisini yükle
  useEffect(() => {
    const loadUser = async () => {
      try {
        const conf = getConfiguration();
        const userApi = new UserApi(conf);
        const userResponse = await userApi.apiUserGetLoginUserDetailGet();
        setCurrentUser(userResponse.data?.userName || "");
      } catch (err) {
        console.warn("Kullanıcı bilgisi yüklenemedi:", err);
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

        console.log("📋 Parsed formDesign:", parsed);
        console.log("📋 buttonPanel:", parsed.buttonPanel);
        console.log("📋 buttons:", parsed.buttonPanel?.buttons);

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
          console.log("✅ Butonlar yüklendi:", parsed.buttonPanel.buttons);
          setFormButtons(parsed.buttonPanel.buttons);
        } else {
          console.warn("⚠️ ButtonPanel bulunamadı veya buttons array değil");
          console.warn("parsed:", parsed);
          console.warn("parsed.buttonPanel:", parsed.buttonPanel);
        }

      } catch (err: any) {
        console.error("Form yüklenirken hata:", err);
        setError(err.message || "Form yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [workflowInstance?.formId]);

  /**
   * ✅ Form butonuna tıklandığında - Backend'e workflow başlatma isteği gönder
   */
  const handleButtonClick = async (button: FormButton) => {
    if (submitting) {
      return; // Çift tıklamayı önle
    }

    try {
      setSubmitting(true);

      // Form validasyonu
      await form.validate();
      const formValues = form.values;

      // Workflow instance bilgilerini kontrol et
      if (!workflowInstance?.workflowId) {
        throw new Error("Workflow ID bulunamadı");
      }

      const conf = getConfiguration();
      const workflowApi = new WorkFlowApi(conf);

      // ✅ WorkFlowStartApiDto oluştur
      // workFlowInfo içinde form verilerini ve buton action'ını JSON olarak gönder
      const workFlowInfo = JSON.stringify({
        formData: formValues,
        buttonAction: button.action || button.id,
        buttonLabel: button.label,
        formId: workflowInstance.formId,
        timestamp: new Date().toISOString(),
      });

      const startDto = {
        definationId: workflowInstance.workflowId,
        userName: currentUser || undefined,
        workFlowInfo: workFlowInfo,
      };

      console.log("🚀 Workflow başlatılıyor:", {
        definationId: startDto.definationId,
        buttonAction: button.action,
        formDataKeys: Object.keys(formValues),
      });

      // ✅ Backend'e workflow başlatma isteği gönder
      const response = await workflowApi.apiWorkFlowStartPost(startDto);
      const result = response.data;

      console.log("✅ Workflow başlatıldı:", result);

      // Başarılı mesajı göster
      message.success(
        `${button.label} butonuna tıklandı. Workflow başlatıldı.`,
        3
      );

      // Workflow instance ID'si varsa güncelle
      if (result?.id) {
        // Yeni instance ID ile görevlerim sayfasına yönlendir
        setTimeout(() => {
          navigate("/workflows/my-tasks", {
            state: {
              newInstanceId: result.id,
              buttonAction: button.action,
            },
          });
        }, 1500);
      } else {
        // Instance ID yoksa direkt görevlerim sayfasına dön
        setTimeout(() => {
          navigate("/workflows/my-tasks");
        }, 1500);
      }
    } catch (error: any) {
      console.error("❌ Workflow başlatılırken hata:", error);
      
      // Hata mesajını göster
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Workflow başlatılırken bir hata oluştu";
      
      message.error(errorMessage, 5);
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

            <Card>
              <CardContent>
                <FormProvider form={form}>
                  <AntdFormily.Form>
                    <AntdFormily.FormLayout layout="horizontal" labelAlign="left" labelCol={6} wrapperCol={18} size="default">
                      <SchemaField schema={schema} />
                    </AntdFormily.FormLayout>
                  </AntdFormily.Form>
                </FormProvider>
              </CardContent>
            </Card>
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

              return (
                <AntButton
                  key={button.id}
                  type={button.type || "primary"}
                  icon={IconComponent ? <IconComponent /> : null}
                  onClick={() => handleButtonClick(button)}
                  size="large"
                  style={{ margin: "0 8px" }}
                  loading={submitting}
                  disabled={submitting}
                >
                  {submitting ? "Gönderiliyor..." : button.label}
                </AntButton>
              );
            })}
          </Box>
        )}
      </Box>
    </>
  );
}
