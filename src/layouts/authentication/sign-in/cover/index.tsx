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
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import { useMsal } from "@azure/msal-react";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-profile.jpeg";
import startPageImg from "assets/images/startPageImg.png";
import MDSocialButton from "components/MDSocialButton";
import { AuthApi, LoginDto, LoginUserDto, SAPReportsApi, UserApi } from "api/generated";
import getConfiguration, { getConfigurationLogin } from "confiuration";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { MessageBoxType } from "@ui5/webcomponents-react";
import { useUser } from "layouts/pages/hooks/userName";
import MDAlert from "components/MDAlert";
import { Typography } from "@mui/material";

function Cover(): JSX.Element {
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const { instance } = useMsal();
  const navigate = useNavigate();
  const { username, setUsername, setuserUserAppDto, userAppDto } = useUser();
  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();
  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [alert, setAlert] = useState<{
    alertType: string;
    message: string;
  }>({
    alertType: "",
    message: "",
  });
  function handleLogin(event: any): void {
    const isLocalhost = window.location.hostname === "localhost";

    const scopes = isLocalhost
      ? "api://28116fc8-fd64-4ccb-ab4d-96d2f3653846/access_as_user" // Local
      : "api://1a4e7070-9c88-4097-9805-caf72e245e79/access_as_user"; // Production

    instance
      .loginPopup({
        scopes: [scopes], // Uygulama (İstemci) Kimliği
      })
      .then(async (response: { accessToken: string; account: any }) => {
        dispatchBusy({ isBusy: true });

        var conf = getConfigurationLogin();
        var api = new UserApi(conf);

        var result = await api.apiUserCheckSSOEmailControlGet(response!.account!.username);

        dispatchBusy({ isBusy: false });

        if (result.data.userName != undefined) {
          setuserUserAppDto(result.data);

          localStorage.setItem("accessToken", response.accessToken);
          localStorage.removeItem("menuNameSurmane");
          localStorage.setItem(
            "menuNameSurmane",
            result.data.firstName + " " + result.data.lastName
          );
          var sapReport = new SAPReportsApi(conf);
          // var sapInfo = await sapReport.apiSAPReportsGetSapInfoGet(result.data.email);
          // localStorage.setItem("userPhoto", sapInfo.data.photo);

          navigate("/tickets/statistic");
        } else {
          dispatchAlert({ message: "Giriş Başarılı Değil", type: MessageBoxType.Error });
        }
      })
      .catch((error: any) => {
        console.error("Login failed:", error);
      });
  }

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

          if (email.includes("vesacons")) {
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
    <CoverLayout image={startPageImg}>
      <Card sx={{ mb: "55.5%" }}>
        <MDBox
          variant="gradient"
          style={{ backgroundColor: "#3e5d8f" }}
          borderRadius="lg"
          coloredShadow="dark"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDBox mt={-1} />
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Giriş yap
          </MDTypography>
          <MDBox mt={2} />
          <MDButton
            component={Link}
            onClick={handleLogin}
            to="/authentication/sign-in/cover"
            fontWeight="light"
            color="white"
          >
            Vesa Hesabı ile giriş yap
          </MDButton>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                label="Email"
                variant="standard"
                fullWidth
                placeholder="example@vesacons.com"
                InputLabelProps={{ shrink: true }}
              />
            </MDBox>
            <MDBox mb={2}>
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
                label="Parola"
                variant="standard"
                fullWidth
                placeholder="************"
                InputLabelProps={{ shrink: true }}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" justifyContent="space-between" ml={-1}>
              <MDBox display="flex" alignItems="center">
                {/* <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color="text"
                  onClick={handleSetRememberMe}
                  sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                >
                  &nbsp;&nbsp;Beni Hatırla
                </MDTypography> */}
                {alert.message && (
                  <Typography
                    sx={{ ml: 1 }}
                    variant="caption"
                    fontWeight="medium"
                    color={alert.alertType === "error" ? "error" : "success"}
                  >
                    {alert.message}
                  </Typography>
                )}
              </MDBox>
            </MDBox>
            <MDBox>
              <MDButton
                size="small"
                variant="text"
                color="dark"
                onClick={() => navigate("/authentication/reset-password")}
                sx={{ ml: -2.8, mt: 1 }}
              >
                <MDTypography variant="caption" fontWeight="medium" color="text">
                  &nbsp;&nbsp;Şifremi Unuttum
                </MDTypography>
              </MDButton>
            </MDBox>

            <MDBox mt={2} mb={1}>
              <MDButton
                disabled={!email || !password}
                onClick={handleLoginWithVesa}
                variant="gradient"
                style={{ backgroundColor: "#3e5d8f", color: "white" }}
                fullWidth
              >
                Giriş
              </MDButton>
            </MDBox>

            <MDBox mt={2} mb={1} textAlign="center"></MDBox>
            <MDBox mt={2} mb={1} textAlign="center"></MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
