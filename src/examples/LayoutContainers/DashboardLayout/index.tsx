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

import { useEffect, ReactNode, useState } from "react";

// react-router-dom components

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";

// Material Dashboard 2 PRO React context
import { useMaterialUIController, setLayout } from "context";
import { useLocation } from "react-router-dom";
import { createChat } from "@n8n/chat";
import "@n8n/chat/style.css";
import getConfiguration from "confiuration";
import { UserApi } from "api/generated";
function DashboardLayout({ children }: { children: ReactNode }): JSX.Element {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname]);

  useEffect(() => {
    const fetchUserIsAdmin = async () => {
      try {
        const config = getConfiguration();
        let api = new UserApi(config);
        await api.apiUserCheckIsAdminGet().then((res) => {
          if (res.data){
            createChat({
              webhookUrl: "https://n8n.vesa-tech.com/webhook/85f1f01d-a39d-42df-8ac5-832cd4b8a212/chat",
              mode: "window",
              defaultLanguage: "en",
              showWelcomeScreen: false,
              initialMessages: ["Merhaba Ben Vesa Danışmanlık'ın yapay zeka asistanıyım"],
              webhookConfig: {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              },
              loadPreviousSession: false,
              i18n: {
                en: {
                  title: "Vesa Destek",
                  subtitle: "Bir sohbet başlatın. 7/24 yardım alabilirsiniz.",
                  footer: "",
                  getStarted: "Yeni Sohbet",
                  inputPlaceholder: "Sorunuzu yazın..",
                  closeButtonTooltip: "Kapat",
                  welcomeScreen: "Merhaba Ben Vesa Danışmanlık'ın yapay zeka asistanıyım",
                },
                tr: {
                  title: "Vesa Destek",
                  subtitle: "Bir sohbet başlatın. 7/24 yardım alabilirsiniz.",
                  footer: "",
                  getStarted: "Yeni Sohbet",
                  inputPlaceholder: "Sorunuzu yazın..",
                  closeButtonTooltip: "Kapat",
                  welcomeScreen:
                    "Vesa Destek! 👋\nBir sohbet başlatın. Size 7/24 yardımcı olmak için buradayız.",
                },
              },
            });
          } else {
            
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserIsAdmin();
  }, []);

  return (
    <MDBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        p: 3,
        position: "relative",

        [breakpoints.up("xl")]: {
          marginLeft: miniSidenav ? pxToRem(120) : pxToRem(274),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
    >
      {children}
    </MDBox>
  );
}

export default DashboardLayout;
