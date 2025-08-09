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

// react-router-dom components
import { useNavigate } from "react-router-dom";

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

import { AuthApi, LoginDto, SAPReportsApi, UserApi } from "api/generated";
import getConfiguration, { getConfigurationLogin } from "confiuration";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { MessageBoxType } from "@ui5/webcomponents-react";
import { useUser } from "layouts/pages/hooks/userName";
import { Typography } from "@mui/material";

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
  background: "linear-gradient(135deg, #3e5d8f 0%, #2c4a7a 100%)",
  color: "white",
  padding: theme.spacing(6),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  minHeight: "600px",
}));

const RightSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6),
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
  const { setuserUserAppDto } = useUser();
  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [alert, setAlert] = useState<{
    alertType: string;
    message: string;
  }>({
    alertType: "",
    message: "",
  });


  const handleLoginWithVesa = async () => {
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

          if (email.includes("formneo")) {
            navigate("/tickets/statistic");
          } else {
            navigate("/tickets/customer");
          }
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
    const interval = setInterval(() => {
      setAlert({
        alertType: "",
        message: "",
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageLayout>
      <LoginContainer>
        <Container maxWidth="lg">
          <LoginCard>
            <Grid container>
              {/* Sol Bölüm - Marka ve Açıklama */}
              <Grid item xs={12} md={6}>
                <LeftSection>
                  <BrandLogo>
                    <Typography variant="h4" fontWeight="bold" color="inherit">
                      F
                    </Typography>
                  </BrandLogo>

                  <MDTypography variant="h3" fontWeight="bold" color="white" mb={2}>
                    FormNeo
                  </MDTypography>

                  <MDTypography variant="h6" color="white" mb={4} textAlign="center" sx={{ opacity: 0.8 }}>
                    Modern form yönetimi ve iş akışı çözümünüz
                  </MDTypography>

                  <MDTypography variant="body1" color="white" textAlign="center" lineHeight={1.6} sx={{ opacity: 0.7 }}>
                    Güçlü form builder, otomatik iş akışları ve detaylı raporlama
                    özellikleri ile işlerinizi dijitalleştirin.
                  </MDTypography>

                  <Box mt={4}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box
                        width="8px"
                        height="8px"
                        borderRadius="50%"
                        bgcolor="rgba(255,255,255,0.8)"
                        mr={2}
                      />
                      <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                        Sürükle-bırak form editörü
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box
                        width="8px"
                        height="8px"
                        borderRadius="50%"
                        bgcolor="rgba(255,255,255,0.8)"
                        mr={2}
                      />
                      <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                        Gerçek zamanlı işbirliği
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Box
                        width="8px"
                        height="8px"
                        borderRadius="50%"
                        bgcolor="rgba(255,255,255,0.8)"
                        mr={2}
                      />
                      <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                        Gelişmiş analitik ve raporlar
                      </Typography>
                    </Box>
                  </Box>
                </LeftSection>
              </Grid>

              {/* Sağ Bölüm - Login Formu */}
              <Grid item xs={12} md={6}>
                <RightSection>
                  <MDBox mb={4}>
                    <MDTypography variant="h4" fontWeight="bold" color="dark" mb={1}>
                      Hoş Geldiniz
                    </MDTypography>
                    <MDTypography variant="body1" color="text" sx={{ opacity: 0.7 }}>
                      Hesabınıza giriş yaparak devam edin
                    </MDTypography>
                  </MDBox>

                  <MDBox component="form" role="form">
                    <MDBox mb={3}>
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

                    <MDBox mb={3}>
                      <MDTypography variant="body2" fontWeight="medium" color="dark" mb={1}>
                        Şifre
                      </MDTypography>
                      <MDInput
                        value={password}
                        onChange={(e: any) => setPassword(e.target.value)}
                        onKeyDown={(e: any) => {
                          if (e.key === "Enter") {
                            if (email && password) {
                              handleLoginWithVesa();
                            } else {
                              if (!email) {
                                setAlert({
                                  alertType: "error",
                                  message: "Devam edebilmek için mail adresinizi giriniz",
                                });
                              }
                              if (!password) {
                                setAlert({
                                  alertType: "error",
                                  message: "Devam edebilmek için şifrenizi giriniz",
                                });
                              }
                              if (!email && !password) {
                                setAlert({
                                  alertType: "error",
                                  message: "Devam edebilmek için mail adresinizi ve şifrenizi giriniz",
                                });
                              }
                            }
                          }
                        }}
                        type="password"
                        variant="outlined"
                        fullWidth
                        placeholder="••••••••••"
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

                    <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
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

                    <MDBox mb={3}>
                      <MDButton
                        disabled={!email || !password}
                        onClick={handleLoginWithVesa}
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
                        >
                          Destek ekibiyle iletişime geçin
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
