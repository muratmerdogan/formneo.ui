import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form } from "@formio/react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import { Typography, Card, IconButton, Tooltip, Icon } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import MDButton from "components/MDButton";
import getConfiguration from "confiuration";
import { useAlert } from "../hooks/useAlert";
import { useBusy } from "../hooks/useBusy";
import { useUser } from "../hooks/userName";

// API import
import { WorkFlowApi } from "api/generated";

const WorkflowFormApprovalDetail = () => {
  const { workflowHeadId } = useParams();
  const navigate = useNavigate();

  const [formDesign, setFormDesign] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { username } = useUser();
  const dispatchAlert = useAlert();
  const dispatchBusy = useBusy();
  const configuration = getConfiguration();

  useEffect(() => {
    if (workflowHeadId) {
      fetchFormDetail();
    }
  }, [workflowHeadId]);

  const fetchFormDetail = async () => {
    setLoading(true);
    dispatchBusy({ isBusy: true });

    try {
      const api = new WorkFlowApi(configuration);

      // ✅ YENİ - Generate edilmiş API fonksiyonunu kullan
      const response = await api.apiWorkFlowGetWorkflowDetailWorkflowHeadIdGet(workflowHeadId);
      const res = response.data; // Axios response'dan data'yı al

      console.log("✅ API Response alındı:");
      console.log("📦 Full Response:", response);
      console.log("📦 Response Status:", response.status);
      console.log("📦 Response Headers:", response.headers);
      console.log("📦 Response Data:", response.data);

      if (res?.formDesign) {
        console.log("🎨 FormDesign parse ediliyor...");
        setFormDesign(JSON.parse(res.formDesign));
      }

      if (res?.payloadJson) {
        console.log("📊 PayloadJson parse ediliyor...");
        setFormData(JSON.parse(res.payloadJson));
      }
    } catch (error) {
      console.error("API Error:", error);
      dispatchAlert({
        message:
          "Form detayları yüklenirken hata oluştu: " +
          (error?.response?.data?.message || error.message),
        type: "error",
      });
    } finally {
      setLoading(false);
      dispatchBusy({ isBusy: false });
    }
  };

  const handleGoBack = () => navigate(-1);

  console.log("🎭 Render durumu:");
  console.log("📋 Loading:", loading);
  console.log("🎨 FormDesign:", formDesign);
  console.log("📊 FormData:", formData);

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <Card sx={{ margin: 3, p: 3 }}>
          <Typography>Form detayları yükleniyor...</Typography>
        </Card>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox sx={{ margin: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        {/* Header */}
        <Card sx={{ mb: 2, p: 3 }}>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 400, color: "#333" }}>
              Form Onay Detayı
            </Typography>
            <MDButton
              variant="outlined"
              color="secondary"
              onClick={handleGoBack}
              startIcon={<Icon>arrow_back</Icon>}
            >
              Geri Dön
            </MDButton>
          </MDBox>
        </Card>

        {/* Form Content */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            📋 Form İçeriği - DOLU HALİ
          </Typography>
          {formDesign && formData ? (
            <Form
              form={formDesign}
              submission={{ data: formData }}
              options={{ readOnly: true, language: "tr" }}
            />
          ) : (
            <Typography>Form verileri bulunamadı.</Typography>
          )}
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default WorkflowFormApprovalDetail;
