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

import { useState, useEffect, useMemo, JSXElementConstructor, Key, ReactElement, Suspense, lazy } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import "wx-react-gantt/dist/gantt.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";


// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";

// Material Dashboard 2 PRO React TS exampless
import Configurator from "examples/Configurator";

// Material Dashboard 2 PRO React TS themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 PRO React TS Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 PRO React TS routes
import routes from "routes";

// Material Dashboard 2 PRO React TS contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images

const NewUser = lazy(() => import("layouts/pages/users/new-user"));
const UserDetail = lazy(() => import("layouts/pages/users/userDetail/settings/index"));
const ActivityReports = lazy(() => import("layouts/pages/reports/activityReports/analytics/index"));
const AllDemos = lazy(() => import("layouts/pages/demos/all-projects"));
const Logout = lazy(() => import("layouts/authentication/sign-in/cover/Logout"));
import PrivateRoute from "layouts/authentication/sign-in/cover/PrivateRoute";
const Cover = lazy(() => import("layouts/authentication/sign-in/cover"));
const LandingPage = lazy(() => import("layouts/pages/landing"));
const CompanyRegister = lazy(() => import("layouts/authentication/company-register"));
const AllProjects = lazy(() => import("layouts/pages/profile/all-projects"));
const MessagePage = lazy(() => import("layouts/applications/chat/MessagePage"));
const MenuList = lazy(() => import("layouts/pages/menuDefination/MenuList"));
const MenuDetail = lazy(() => import("layouts/pages/menuDefination/MenuDetail"));
const ParametersPage = lazy(() => import("layouts/pages/settings/ParametersPage"));
const NotAuthorizationPage = lazy(() => import("layouts/pages/notAuthorizationPage"));
const ResetCover = lazy(() => import("layouts/authentication/reset-password/cover"));
const Sales = lazy(() => import("layouts/dashboards/sales"));
const CustomerSales = lazy(() => import("layouts/dashboards/customer"));
const QueryList = lazy(() => import("layouts/pages/queryBuild/queryList"));
const QueryDetail = lazy(() => import("layouts/pages/queryBuild/queryDetail/queryDetail"));
// import ChatPage from "layouts/applications/chat/chatpage";
const CalendarPage = lazy(() => import("layouts/pages/calendar"));
const CalendarList = lazy(() => import("layouts/pages/calendar/list"));
const PositionPage = lazy(() => import("layouts/pages/position"));
const PositionDetailPage = lazy(() => import("layouts/pages/position/details"));
const OrganizationalChart = lazy(() => import("layouts/pages/organizational-chart"));
const FormRoleList = lazy(() => import("layouts/pages/FormManagement/form-role/list"));
const FormRoleDetail = lazy(() => import("layouts/pages/FormManagement/form-role/detail"));
import { useTranslation } from "react-i18next";
const CompanyRelation = lazy(() => import("layouts/pages/companyRelation"));
const CompanyRelationDetail = lazy(() => import("layouts/pages/companyRelation/detail"));
const ProjectChart = lazy(() => import("layouts/pages/projectManagement/chart"));
const TicketProjects = lazy(() => import("layouts/pages/ticketProjects"));
const CreateTicketProject = lazy(() => import("layouts/pages/ticketProjects/createTicketProject"));
const FormAuth = lazy(() => import("layouts/pages/FormManagement/FormAuth/FormAuth"));
const FormAuthDetail = lazy(() => import("layouts/pages/FormManagement/FormAuth/FormAuthDetail"));
const FormList = lazy(() => import("layouts/pages/FormManagement/UsersForm/FormList"));
const ResumeBuild = lazy(() => import("layouts/pages/resumeBuilder"));
const MainScreen = lazy(() => import("layouts/pages/projectManagement"));
const Inventory = lazy(() => import("layouts/pages/inventory"));
const CreateInventory = lazy(() => import("layouts/pages/inventory/createInventory"));
const VpnDashboard = lazy(() => import("layouts/pages/vpnPage"));
const UserTasks = lazy(() => import("layouts/pages/userTasks"));
const UserProjects = lazy(() => import("layouts/pages/userProjects"));
const KanbanPage = lazy(() => import("layouts/pages/kanban"));
const TicketProjectProgress = lazy(() => import("layouts/pages/ticketProjectProgress"));
const CustomerList = lazy(() => import("layouts/pages/customer"));
const CustomerDetail = lazy(() => import("layouts/pages/customer/detail"));
const CustomersPage = lazy(() => import("pages/customers/CustomersPage"));
const CustomerDashboardPage = lazy(() => import("pages/customer/CustomerDashboardPage"));
const CustomerFormPage = lazy(() => import("pages/customer/CustomerFormPage"));
// axios interceptors (global) – must be imported once at startup
import "api/interceptors";
import { ActionBarProvider } from "context/ActionBarContext";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    direction,
    layout,
    openConfigurator,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const isTenantSelectRoute = pathname.startsWith('/authentication/tenant-select');

  // Cache for the rtl
  useMemo(() => {
    const pluginRtl: any = rtlPlugin;
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [pluginRtl],
    });

    setRtlCache(cacheRtl);
  }, []);

  // // Open sidenav when mouse enter on mini sidenav
  // const handleOnMouseEnter = () => {
  //   if (miniSidenav && !onMouseEnter) {
  //     setMiniSidenav(dispatch, false);
  //     setOnMouseEnter(true);
  //   }
  // };

  // // Close sidenav when mouse leave mini sidenav
  // const handleOnMouseLeave = () => {
  //   if (onMouseEnter) {
  //     setMiniSidenav(dispatch, true);
  //     setOnMouseEnter(false);
  //   }
  // };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes: any[]): any =>
    allRoutes.map(
      (route: {
        collapse: any;
        route: string;
        component: ReactElement<any, string | JSXElementConstructor<any>>;
        key: Key;
      }) => {
        if (route.collapse) {
          return getRoutes(route.collapse);
        }

        if (route.route) {
          return <Route path={route.route} element={route.component} key={route.key} />;
        }

        return null;
      }
    );

  // const configsButton = (
  //   // <MDBox
  //   //   display="flex"
  //   //   justifyContent="center"
  //   //   alignItems="center"
  //   //   width="3.25rem"
  //   //   height="3.25rem"
  //   //   bgColor="white"
  //   //   shadow="sm"
  //   //   borderRadius="50%"
  //   //   position="fixed"
  //   //   right="2rem"
  //   //   bottom="2rem"
  //   //   zIndex={99}
  //   //   color="dark"
  //   //   sx={{ cursor: "pointer" }}
  //   //   onClick={handleConfiguratorOpen}
  //   // >
  //   //   {/* <Icon fontSize="small" color="inherit">
  //   //     settings
  //   //   </Icon> */}
  //   // </MDBox>
  // );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        {/* Sidenav gizlendi */}
        {/* {layout === "vr" && <Configurator />}
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/dashboards/analytics" />} />
          <Route path="/userDetail" element={<Navigate to="/dashboards/analytics" />} />
        </Routes> */}
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {/* Sidenav gizlendi */}
      {layout === "vr" && <Configurator />}

      <ActionBarProvider>
        <Suspense fallback={<div style={{ padding: 24 }}>Yükleniyor…</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/authentication/sign-in/cover" element={<Cover />} />
            <Route path="/authentication/company-register" element={<CompanyRegister />} />
            <Route path="/LogOut" element={<Logout />} />
            <Route path="/authentication/reset-password" element={<ResetCover />} />
            <Route path="/tickets/customer" element={<CustomerSales />} />
            {/* Private Routes */}
            <Route element={<PrivateRoute />}>
              {getRoutes(routes)} {/* Tüm özel rotaları ekler */}
              <Route path="/dashboard" element={<Navigate to="/dashboards/analytics" />} />
              <Route path="*" element={<Navigate to="/dashboards/analytics" />} />
              <Route path="/users/detail" element={<UserDetail />} />
              <Route path="/ActivityReports" element={<ActivityReports />} />
              <Route path="/Messages" element={<MessagePage />} />
              <Route path="/Menus" element={<MenuList />} />
              <Route path="/MenuDetail" element={<MenuDetail />} />
              <Route path="/parameters" element={<ParametersPage />} />
              {/* <Route path="/mmessages" element={<ChatPage />} /> */}
            </Route>

            <Route path="/pages/demos/alldemos" element={<AllDemos />} />
            <Route path="/tickets/statistic" element={<Sales />} />
            <Route path="/queryBuild" element={<QueryList />} />
            <Route path="/queryBuild/detail" element={<QueryDetail />} />
            <Route path="/queryBuild/detail/:id" element={<QueryDetail />} />
            <Route path="/calendar" element={<CalendarList />} />
            <Route path="/calendar/detail" element={<CalendarPage />} />
            <Route path="/calendar/detail/:id" element={<CalendarPage />} />
            <Route path="/position" element={<PositionPage />} />
            <Route path="/position/detail" element={<PositionDetailPage />} />
            <Route path="/position/detail/:id" element={<PositionDetailPage />} />
            <Route path="/organizationalChart" element={<OrganizationalChart />} />
            <Route path="/form-role" element={<FormRoleList />} />
            <Route path="/form-role/detail" element={<FormRoleDetail />} />
            <Route path="/form-role/detail/:id" element={<FormRoleDetail />} />
            <Route path="/NotAuthorization" element={<NotAuthorizationPage />} />
            <Route path="/companyRelation" element={<CompanyRelation />} />
            <Route path="/companyRelation/detail" element={<CompanyRelationDetail />} />
            <Route path="/companyRelation/detail/:id" element={<CompanyRelationDetail />} />
            <Route path="/projectManagement" element={<MainScreen />} />
            <Route path="/projectManagement/chart" element={<ProjectChart />} />
            <Route path="/ticketProjects" element={<TicketProjects />} />
            <Route path="/ticketProjects/detail" element={<CreateTicketProject />} />
            <Route path="/ticketProjects/detail/:id" element={<CreateTicketProject />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/detail" element={<CreateInventory />} />
            <Route path="/inventory/detail/:id" element={<CreateInventory />} />
            <Route path="/resumeBuild" element={<ResumeBuild />} />
            <Route path="/userTasks" element={<UserTasks />} />
            <Route path="/userProjects" element={<UserProjects />} />
            <Route path="/vpn" element={<VpnDashboard />} />
            <Route path="/kanban" element={<KanbanPage />} />
            <Route path="/ticketProjectProgress" element={<TicketProjectProgress />} />

            <Route path="/customer" element={<CustomerList />} />
            <Route path="/customer/detail" element={<CustomerDetail />} />
            <Route path="/customer/detail/:id" element={<CustomerDetail />} />

            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/new" element={<CustomerFormPage />} />
            <Route path="/customers/:id" element={<CustomerFormPage />} />

            <Route path="/formAuth" element={<FormAuth />} />
            <Route path="/formAuth/detail" element={<FormAuthDetail />} />
            <Route path="/formAuth/detail/:id" element={<FormAuthDetail />} />

            <Route path="/formlist/:formId" element={<FormList />} />

            {/* Tüm Eşleşmeyen URL'ler için Yönlendirme */}
            {/* <Route path="*" element={<Navigate to="/dashboards/analytics" replace />} /> */}
          </Routes>
        </Suspense>
      </ActionBarProvider>
    </ThemeProvider>
  );
}
