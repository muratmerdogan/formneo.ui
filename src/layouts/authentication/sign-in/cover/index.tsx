/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.2
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// react-router-dom components
import { useNavigate, useLocation } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import { useMsal } from "@azure/msal-react";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Layout components
import PageLayout from "examples/LayoutContainers/PageLayout";

// Images
import formNeoLogo from "assets/images/logoson.svg";
import loginLeft from "assets/images/loginleft.png";

import { AuthApi, LoginDto, UserApi } from "api/generated";
import getConfiguration, { getConfigurationLogin } from "confiuration";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { MessageBoxType } from "@ui5/webcomponents-react";
import { useUser } from "layouts/pages/hooks/userName";
import { Typography, IconButton, Tooltip, InputAdornment } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LanguageIcon from "@mui/icons-material/Language";

// Styled components for Metronic-style layout
const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
}));

const LoginCard = styled(Card)(({ theme }) => ({
  borderRadius: "20px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  overflow: "hidden",
  maxWidth: "1000px",
  width: "100%",
  margin: "0 auto",
}));

const LeftSection = styled(Box)(({ theme }) => ({
  // Beyaz zemin + küçük sol alt köşe görseli (overlay yok)
  backgroundColor: "#ffffff",
  backgroundImage: `url(${loginLeft})`,
  backgroundSize: "min(28vw, 320px) auto",
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
  color: "inherit",
  padding: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  minHeight: "600px",
}));

const RightSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4.5),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  backgroundColor: "#ffffff",
  minHeight: "600px",
}));

const BrandLogo = styled(Box)(({ theme }) => ({
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(3),
  fontSize: "32px",
  fontWeight: "bold",
}));

function Cover(): JSX.Element {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { setuserUserAppDto } = useUser();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(newLang);
  };
  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const isEmailValid = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email || "");
  const [alert, setAlert] = useState<{
    alertType: string;
    message: string;
  }>({
    alertType: "",
    message: "",
  });


  const handleLoginWithFormneo = async () => {
    if (email && password) {
      const isLocalhost = window.location.hostname === "localhost";

      const scopes = isLocalhost
        ? "api://28116fc8-fd64-4ccb-ab4d-96d2f3653846/access_as_user" // Local
        : "api://1a4e7070-9c88-4097-9805-caf72e245e79/access_as_user"; // Production

      dispatchBusy({ isBusy: true });

      let loginDto: LoginDto = {
        email: email,
        password: password,
      };
      var conf = getConfigurationLogin();
      var api = new AuthApi(conf);
      try {
        var result = await api.apiAuthCreateTokenPostCreateTokenPostPost(loginDto);

        if (result?.data?.accessToken) {
          localStorage.setItem("accessToken", result.data.accessToken);
          // Login sonrası eski tenant seçimlerini temizle
          localStorage.removeItem("selectedTenantId");

          // Giriş sonrası tenant seçimi zorunlu
          navigate("/authentication/tenant-select");
        } else {
          throw new Error("Access token alınamadı. E-posta veya şifre hatalı.");
        }
      } catch (error) {
        dispatchAlert({
          message: "E-posta veya şifre hatalı!",
          type: MessageBoxType.Error,
        });
        dispatchBusy({ isBusy: false });
      }

      dispatchBusy({ isBusy: false });
    }
  };

  useEffect(() => {
    // Kayıt başarılı mesajını göster
    if (location.state?.message) {
      setAlert({
        alertType: "success",
        message: location.state.message,
      });
      if (location.state?.email) {
        setEmail(location.state.email);
      }
    }

    const interval = setInterval(() => {
      setAlert({
        alertType: "",
        message: "",
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [location.state]);

  return (
    <PageLayout>
      <LoginContainer>
        <Container maxWidth="lg">
          {/* Language Toggle */}
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Tooltip title={i18n.language === 'tr' ? 'Switch to English' : 'Türkçe\'ye Geç'}>
              <IconButton
                onClick={toggleLanguage}
                sx={{
                  color: "#1976d2",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  "&:hover": {
                    backgroundColor: "white",
                  }
                }}
              >
                <LanguageIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <LoginCard>
            <Grid container>
              {/* Sol Bölüm - Görsel */}
              <Grid item xs={12} md={6}>
                <LeftSection />
              </Grid>

              {/* Sağ Bölüm - Logo + Login Formu */}
              <Grid item xs={12} md={6}>
                <RightSection>
                  <Box display="flex" justifyContent="center" mb={2.5}>
                    <img src={formNeoLogo} alt="FormNeo Logo" style={{ height: "140px", width: "auto" }} />
                  </Box>
                  <MDBox mb={3}>
                    <MDTypography variant="h4" fontWeight="bold" color="dark" mb={1}>
                      Hoş Geldiniz
                    </MDTypography>
                    <MDTypography variant="body1" color="text" sx={{ opacity: 0.7 }}>
                      Hesabınıza giriş yaparak devam edin
                    </MDTypography>
                  </MDBox>

                  <MDBox component="form" role="form">
                    <MDBox mb={2}>
                      <MDTypography variant="body2" fontWeight="medium" color="dark" mb={1}>
                        E-posta Adresi
                      </MDTypography>
                    <MDInput
                      type="email"
                      value={email}
                      onChange={(e: any) => setEmail(e.target.value)}
                      variant="outlined"
                      fullWidth
                      placeholder="ornek@sirket.com"
                      error={!!email && !isEmailValid}
                      helperText={!!email && !isEmailValid ? "Geçerli bir e-posta girin" : ""}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#f8f9fa",
                          border: "1px solid #e9ecef",
                          "&:hover": {
                            borderColor: "#3e5d8f",
                          },
                          "&.Mui-focused": {
                            borderColor: "#3e5d8f",
                            boxShadow: "0 0 0 3px rgba(62, 93, 143, 0.1)",
                          }
                        }
                      }}
                    />
                    </MDBox>

                    <MDBox mb={2}>
                      <MDTypography variant="body2" fontWeight="medium" color="dark" mb={1}>
                        Şifre
                      </MDTypography>
                    <MDInput
                      value={password}
                      onChange={(e: any) => setPassword(e.target.value)}
                      onKeyDown={(e: any) => {
                        if (e.key === "Enter") {
                          if (email && password && isEmailValid) {
                            handleLoginWithFormneo();
                          } else {
                            if (!email || !isEmailValid) {
                              setAlert({
                                alertType: "error",
                                message: "Geçerli bir e-posta ve şifre giriniz",
                              });
                            }
                            if (!password) {
                              setAlert({
                                alertType: "error",
                                message: "Devam edebilmek için şifrenizi giriniz",
                              });
                            }
                          }
                        }
                      }}
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      fullWidth
                      placeholder="••••••••••"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword((p) => !p)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#f8f9fa",
                          border: "1px solid #e9ecef",
                          "&:hover": {
                            borderColor: "#3e5d8f",
                          },
                          "&.Mui-focused": {
                            borderColor: "#3e5d8f",
                            boxShadow: "0 0 0 3px rgba(62, 93, 143, 0.1)",
                          }
                        }
                      }}
                    />
                    </MDBox>

                    <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
                      <MDBox>
                        {alert.message && (
                          <Typography
                            variant="caption"
                            fontWeight="medium"
                            color={alert.alertType === "error" ? "error" : "success"}
                          >
                            {alert.message}
                          </Typography>
                        )}
                      </MDBox>
                      <MDButton
                        variant="text"
                        color="info"
                        onClick={() => navigate("/authentication/reset-password")}
                        sx={{
                          textTransform: "none",
                          fontSize: "14px",
                          fontWeight: "medium"
                        }}
                      >
                        Şifremi Unuttum
                      </MDButton>
                    </MDBox>

                    <MDBox mb={2.5}>
                      <MDButton
                      disabled={!email || !password || !isEmailValid}
                        onClick={handleLoginWithFormneo}
                        variant="gradient"
                        color="info"
                        fullWidth
                        size="large"
                        sx={{
                          backgroundColor: "#3e5d8f",
                          backgroundImage: "linear-gradient(135deg, #3e5d8f 0%, #2c4a7a 100%)",
                          borderRadius: "12px",
                          padding: "12px 24px",
                          fontSize: "16px",
                          fontWeight: "600",
                          textTransform: "none",
                          boxShadow: "0 8px 25px rgba(62, 93, 143, 0.3)",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 12px 35px rgba(62, 93, 143, 0.4)",
                          },
                          "&:disabled": {
                            opacity: 0.6,
                            transform: "none",
                            boxShadow: "0 4px 15px rgba(62, 93, 143, 0.2)",
                          }
                        }}
                      >
                        Giriş Yap
                      </MDButton>
                    </MDBox>

                    <MDBox textAlign="center">
                      <MDTypography variant="body2" color="text" sx={{ opacity: 0.7 }}>
                        Henüz hesabınız yok mu?{" "}
                        <Typography
                          component="span"
                          variant="body2"
                          color="info"
                          fontWeight="medium"
                          sx={{ cursor: "pointer", textDecoration: "underline" }}
                          onClick={() => navigate("/authentication/company-register")}
                        >
                          Şirket Kaydı Oluşturun
                        </Typography>
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </RightSection>
              </Grid>
            </Grid>
          </LoginCard>
        </Container>
      </LoginContainer>
    </PageLayout>
  );
}

export default Cover;
