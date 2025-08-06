// NotAuthorizationPage.jsx
import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import "./index.css";
import { useBusy } from "../hooks/useBusy";
import { useTranslation } from "react-i18next";

function NotAuthorizationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const dispatchBusy = useBusy();
  const { t } = useTranslation();

  useEffect(() => {
    dispatchBusy({ isBusy: true });
    setTimeout(() => {
      setLoading(false);
      dispatchBusy({ isBusy: false });
      setShowError(true);
    }, 800);
  }, []);

  const handleGoBack = () => {
    setLoading(true);
    dispatchBusy({ isBusy: true });
    setTimeout(() => {
      navigate(-1);
    }, 300);
  };

  if (loading) {
    return <></>;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="not-auth-container">
        <div className="not-auth-content">
          <div className="not-auth-icon-wrapper">
            <i className="pi pi-ban not-auth-icon"></i>
            <div className="not-auth-icon-ripple"></div>
          </div>

          <MDTypography variant="h3" className="not-auth-title" mb={1}>
            {t("ns1:AuthPage.NotAuth.YetkisizErisim")}
          </MDTypography>

          {showError && (
            <Message
              severity="error"
              text={t("ns1:AuthPage.NotAuth.ErisimReddedildi")}
              className="not-auth-error-message"
            />
          )}

          <MDTypography variant="h6" color="text" className="not-auth-message" mt={1}>
            {t("ns1:AuthPage.NotAuth.YetkiYok")}
          </MDTypography>

          <MDTypography variant="h6" color="text" className="not-auth-submessage">
            {t("ns1:AuthPage.NotAuth.YoneticiBilgi")}
          </MDTypography>

          <MDBox className="not-auth-buttons" mt={3}>
            <Button
              icon="pi pi-arrow-left"
              label={t("ns1:AuthPage.NotAuth.GeriDon")}
              className="p-button-text p-button-danger not-auth-button"
              onClick={handleGoBack}
            />
          </MDBox>

          <div className="not-auth-info">
            <i className="pi pi-info-circle"></i>
            <span>{t("ns1:AuthPage.NotAuth.YetkiTalep")}</span>
          </div>
        </div>
      </div>
      <Footer />
    </DashboardLayout>
  );
}

export default NotAuthorizationPage;
