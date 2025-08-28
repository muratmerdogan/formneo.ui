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

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import "i18n";

// Material Dashboard 2 PRO React TS Context Provider
import { MaterialUIControllerProvider } from "context";
const root = createRoot(document.getElementById("root"));
import './index.css';
import { BusyProvider } from "layouts/pages/hooks/useBusy";
import { AlertProvider } from "layouts/pages/hooks/useAlert";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { UserProvider } from "layouts/pages/hooks/userName";
import { Suspense, lazy } from "react";
const ChatBox = lazy(() => import("layouts/applications/chat/chatBox"));

import { QueryClient, QueryClientProvider } from 'react-query';
const isLocalhost = window.location.hostname === "localhost";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60 * 1000,
      cacheTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: 0,
    },
  },
});
const msalConfig = isLocalhost
  ? {
    auth: {
      clientId: "28116fc8-fd64-4ccb-ab4d-96d2f3653846", // Uygulama (istemci) kimliği
      authority: "https://login.microsoftonline.com/8b3326df-62dc-4c93-84c2-db8f6f28f4bb", // Kiracı ID'si (authority)
      redirectUri: "http://localhost:3000", // Azure portalda tanımlı geri dönüş URI'si
    },
  }
  : {
    auth: {
      clientId: "1a4e7070-9c88-4097-9805-caf72e245e79", // Uygulama (istemci) kimliği
      authority: "https://login.microsoftonline.com/8b3326df-62dc-4c93-84c2-db8f6f28f4bb", // Dizin (kiracı) kimliği
      redirectUri: "https://support.vesa-tech.com", // Azure portalda tanımlı SPA geri dönüş URI'si
    },
    cache: {
      cacheLocation: "localStorage", // Token'ları saklamak için kullanılacak yer (localStorage veya sessionStorage)
      storeAuthStateInCookie: true, // Çerez kullanımı (tarayıcı uyumluluğu için önerilir)
    },
  };



const msalInstance = new PublicClientApplication(msalConfig);
root.render(
  <BrowserRouter>
    <MaterialUIControllerProvider>
      <BusyProvider>
        <AlertProvider>
          <UserProvider>
            <MsalProvider instance={msalInstance}>
              <QueryClientProvider client={queryClient}>
                <App />
              </QueryClientProvider>
              <Suspense fallback={null}>
                <ChatBox />
              </Suspense>
            </MsalProvider>
          </UserProvider>
        </AlertProvider>
      </BusyProvider>
    </MaterialUIControllerProvider>
  </BrowserRouter>
);
