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

// @mui material components
import Card from "@mui/material/Card";

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
import { useEffect, useState } from "react";
import { getAccessToken } from "confiuration";
import { Configuration, ForgotPasswordApi, UserApi } from "api/generated";
import { MessageBox, MessageBoxAction, MessageBoxType } from "@ui5/webcomponents-react";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { useBusy } from "layouts/pages/hooks/useBusy";

function Cover(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [resetCode, setresetCode] = useState<string>("");
  const [showPsw, setShowPsw] = useState(true);
  const [pswTrue, setPswTrue] = useState(true);
  const [showNewPswVisible, setshowNewPswVisible] = useState(false);

  const [newPw, setnewPw] = useState<string>("");
  const [newPwConfirm, setnewPwConfirm] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [infoMsg, setinfoMsg] = useState<string>("Şifrenizi sıfırlamak için mail adresinizi giriniz.");
  const [msgOpen, setmsgOpen] = useState(false);


  const dispatchAlert = useAlert();
  const dispatchBusy = useBusy();



  const getConfiguration = () => {

    const accessToken = getAccessToken();
    return new Configuration({
      basePath: process.env.REACT_APP_BASE_PATH || '',
      accessToken: accessToken || "",
    });
  };

  useEffect(() => {
  }, []);

  const handleResetPassword = async () => {
    try {
      dispatchBusy({ isBusy: true });
      console.log("email", email);
      var conf = getConfiguration();
      var api = new ForgotPasswordApi(conf);
      var res = await api.apiForgotPasswordForgotPasswordPost(email);
      console.log(res);
      setShowPsw(false);
      setinfoMsg("Mail adresinize gelen kodu giriniz.")

    } catch (error: any) {
      console.error("Hata:", error);
      setShowPsw(true);
      dispatchAlert({ message: "Hata : " + error.response.data.errors, type: MessageBoxType.Error });
      dispatchBusy({ isBusy: false });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const verifyResetCode = async () => {
    try {
      dispatchBusy({ isBusy: true });
      console.log("email", resetCode);
      console.log("resetCode", resetCode);
      var conf = getConfiguration();
      var api = new ForgotPasswordApi(conf);
      var res = await api.apiForgotPasswordVerifyResetCodePost(email, resetCode);
      console.log(res);
      setshowNewPswVisible(true);

      setinfoMsg("Yeni şifrenizi tanımlayınız.")

    } catch (error: any) {
      console.error("Hata:", error);
      dispatchAlert({ message: "Hata : " + error.response.data.errors, type: MessageBoxType.Error });
      dispatchBusy({ isBusy: false });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };
  const changePassword = async () => {
    try {
      var validateRes = validatePassword(newPw)
      if (validateRes != "") {
        dispatchAlert({ message: "Password is not valid : " + validateRes, type: MessageBoxType.Error });
        return;
      }

      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new ForgotPasswordApi(conf);
      var res = await api.apiForgotPasswordChangePwPost(email, resetCode, newPw);
      setmsgOpen(true);

    } catch (error) {
      console.error("Hata:", error);
      dispatchAlert({ message: "Bir hata oluştu.", type: MessageBoxType.Error });
      dispatchBusy({ isBusy: false });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };
  const checkValidateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // validate email
    return !emailRegex.test(email.trim());
  };

  async function handleMsgDialog(event: any) {
    setmsgOpen(false);
    if (event === MessageBoxAction.OK) {
      window.location.href = "/authentication/sign-in/cover";
    } else {
      return;
    }
  }

  const validatePassword = (password: string): string => {
    if (password.length < 6) {
      return "Parola en az 6 karakter uzunluğunda olmalıdır";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Parola en az bir özel karakter içermelidir";
    }
    if (!/\d/.test(password)) {
      return "Parola en az bir rakam içermelidir";
    }
    if (!/[A-Z]/.test(password)) {
      return "Parola en az bir büyük harf (A-Z) içermelidir";
    }
    return "";
  };

  const handlePasswordChange = (pw: string) => {
    const newPass = pw;
    setnewPw(newPass);

    const validationError = validatePassword(newPass);
    if (validationError) {
      setPasswordError(validationError);
    }
    else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (pw: string) => {
    const confirmPass = pw;
    setnewPwConfirm(confirmPass);

    const validationError = validatePassword(confirmPass);
    if (validationError) {
      setPasswordError(validationError);
      setPswTrue(true);
    }
    else if (newPw && confirmPass !== newPw) {
      setPasswordError("Şifreler eşleşmiyor..!");
      setPswTrue(true);
    }
    else {
      setPasswordError("");
      setPswTrue(false);
    }
  };

  // TODO: Backend ile bağlantı kurulacak
  const passwordRequirements = [
    "Parola en az 6 karakter uzunluğunda olmalıdır",
    "Parola en az bir özel karakter içermelidir",
    "Parola en az bir rakam içermelidir",
    "Parola en az bir büyük harf (A-Z) içermelidir"
  ];
  const renderPasswordRequirements = passwordRequirements.map((item, key) => {
    const itemKey = `element-${key}`;

    return (
      <MDBox key={itemKey} component="li" color="text" fontSize="8px" lineHeight={1}>
        <MDTypography variant="button" color="text" fontWeight="regular" verticalAlign="middle">
          {item}
        </MDTypography>
      </MDBox>
    );
  });


  return (
    <CoverLayout image={startPageImg}>
      <Card sx={{ mb: "84%" }}>
        <MDBox
          variant="gradient"
          style={{ backgroundColor: "#3e5d8f" }}
          borderRadius="lg"
          coloredShadow="dark"
          mx={2}
          mt={-3}
          py={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
            Şifremi Sıfırla
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            {infoMsg}
          </MDTypography>
        </MDBox>
        {!showNewPswVisible ? (
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={4}>
                <MDInput
                  type="email"
                  label="Email"
                  variant="standard"
                  fullWidth
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                />
              </MDBox>
              <MDBox mb={4}>
                <MDInput
                  label="Kod"
                  variant="standard"
                  hidden={showPsw}
                  fullWidth
                  value={resetCode}
                  onChange={(e: any) => setresetCode(e.target.value)}
                />
              </MDBox>
              <MDBox mt={6} mb={1}>
                <MDButton
                  variant="gradient"
                  style={{ backgroundColor: "#3e5d8f", color: "white" }}
                  fullWidth
                  hidden={!showPsw}
                  onClick={handleResetPassword}
                  disabled={checkValidateEmail()}
                >
                  Sıfırla
                </MDButton>
              </MDBox>
              <MDBox mt={6} mb={1}>
                <MDButton
                  variant="gradient"
                  style={{ backgroundColor: "#3e5d8f", color: "white" }}
                  fullWidth
                  hidden={showPsw}
                  onClick={verifyResetCode}
                >
                  Kodu Doğrula
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        ) :
          (
            <MDBox pt={4} pb={3} px={3}>
              <MDBox component="form" role="form">
                <MDBox mb={4}>
                  <MDInput
                    label="Yeni Şifre"
                    variant="standard"
                    fullWidth
                    type="Password"
                    value={newPw}
                    error={!!passwordError}
                    onChange={(e: any) => handlePasswordChange(e.target.value)}
                  />
                  <MDInput
                    label="Yeni Şifreyi Doğrula"
                    variant="standard"
                    fullWidth
                    type="Password"
                    value={newPwConfirm}
                    error={!!passwordError}
                    onChange={(e: any) => handleConfirmPasswordChange(e.target.value)}
                  />
                </MDBox>
                <MDBox component="ul" m={0} pl={3.25} mb={{ xs: 8, sm: 0 }}>
                  {renderPasswordRequirements}
                </MDBox>
                <MDBox mt={6} mb={1}>
                  <MDButton
                    variant="gradient"
                    style={{ backgroundColor: "#3e5d8f", color: "white" }}
                    fullWidth
                    hidden={showPsw}
                    disabled={pswTrue}
                    onClick={changePassword}
                  >
                    Şifreyi Değiştir
                  </MDButton>
                </MDBox>
              </MDBox>
            </MDBox>
          )}

      </Card>
      <MessageBox
        type="Information"
        open={msgOpen}
        onClose={handleMsgDialog}
        titleText="Bilgi"
        actions={[MessageBoxAction.OK]}
      >
        Şifreniz başarıyla değiştirilmiştir
      </MessageBox>
    </CoverLayout>
  );
}

export default Cover;
