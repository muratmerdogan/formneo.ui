import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Form } from "@formio/react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Typography, Card } from "@mui/material";

const StartForm: React.FC = () => {
  const location = useLocation();
  const { selectedForm, workflowId } = location.state || {};
  const [formDesign, setFormDesign] = useState<any>(null);

  useEffect(() => {
    if (selectedForm?.formDesign) {
      try {
        const parsedDesign = JSON.parse(selectedForm.formDesign);
        setFormDesign(parsedDesign);
      } catch (err) {
        console.error("❌ Form design parse edilemedi:", err);
      }
    }
  }, [selectedForm]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card style={{ margin: 24, padding: 24 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Seçilen İş Akışı ID: {workflowId}
        </Typography>

        {formDesign ? (
          <Form form={formDesign} />
        ) : (
          <Typography>Form yükleniyor veya bulunamadı...</Typography>
        )}
      </Card>
      <Footer />
    </DashboardLayout>
  );
};

export default StartForm;
