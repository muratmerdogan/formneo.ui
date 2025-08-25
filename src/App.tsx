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

import { useState, useEffect, useMemo, JSXElementConstructor, Key, ReactElement } from "react";

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
import Sidenav from "examples/Sidenav";
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
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import NewUser from "layouts/pages/users/new-user";
import UserDetail from "layouts/pages/users/userDetail/settings/index";
import ActivityReports from "layouts/pages/reports/activityReports/analytics/index";
import AllDemos from "layouts/pages/demos/all-projects";
import Logout from "layouts/authentication/sign-in/cover/Logout";
import PrivateRoute from "layouts/authentication/sign-in/cover/PrivateRoute";
import Cover from "layouts/authentication/sign-in/cover";
import AllProjects from "layouts/pages/profile/all-projects";
import MessagePage from "layouts/applications/chat/MessagePage";
import MenuList from "layouts/pages/menuDefination/MenuList";
import MenuDetail from "layouts/pages/menuDefination/MenuDetail";
import CreateForm from "layouts/pages/FormManagement/ParamtetersDefination";
import NotAuthorizationPage from "layouts/pages/notAuthorizationPage";
import ResetCover from "layouts/authentication/reset-password/cover";
import Sales from "layouts/dashboards/sales";
import CustomerSales from "layouts/dashboards/customer";
import QueryList from "layouts/pages/queryBuild/queryList";
import QueryDetail from "layouts/pages/queryBuild/queryDetail/queryDetail";
// import ChatPage from "layouts/applications/chat/chatpage";
import CalendarPage from "layouts/pages/calendar";
import CalendarList from "layouts/pages/calendar/list";
import PositionPage from "layouts/pages/position";
import PositionDetailPage from "layouts/pages/position/details";
import OrganizationalChart from "layouts/pages/organizational-chart";
import FormRoleList from "layouts/pages/FormManagement/form-role/list";
import FormRoleDetail from "layouts/pages/FormManagement/form-role/detail";
import { useTranslation } from "react-i18next";
import CompanyRelation from "layouts/pages/companyRelation";
import CompanyRelationDetail from "layouts/pages/companyRelation/detail";
import ProjectChart from "layouts/pages/projectManagement/chart";
import TicketProjects from "layouts/pages/ticketProjects";
import CreateTicketProject from "layouts/pages/ticketProjects/createTicketProject";
import FormAuth from "layouts/pages/FormManagement/FormAuth/FormAuth";
import FormAuthDetail from "layouts/pages/FormManagement/FormAuth/FormAuthDetail";
import FormList from "layouts/pages/FormManagement/UsersForm/FormList";
import ResumeBuild from "layouts/pages/resumeBuilder";
import MainScreen from "layouts/pages/projectManagement";
import Inventory from "layouts/pages/inventory";
import CreateInventory from "layouts/pages/inventory/createInventory";
import VpnDashboard from "layouts/pages/vpnPage";
import UserTasks from "layouts/pages/userTasks";
import UserProjects from "layouts/pages/userProjects";
import KanbanPage from "layouts/pages/kanban";
import TicketProjectProgress from "layouts/pages/ticketProjectProgress";
import CustomerList from "layouts/pages/customer";
import CustomerDetail from "layouts/pages/customer/detail";
// axios interceptors (global) – must be imported once at startup
import "api/interceptors";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
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
        {layout === "dashboard" && !isTenantSelectRoute && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="FormNeo"
              routes={routes}
            // onMouseEnter={handleOnMouseEnter}
            // onMouseLeave={handleOnMouseLeave}
            />
            {/* <Configurator /> */}
            {/* {configsButton} */}
          </>
        )}
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
      {layout === "dashboard" && !isTenantSelectRoute && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="FormNeo"
            routes={routes}
          // onMouseEnter={handleOnMouseEnter}
          // onMouseLeave={handleOnMouseLeave}
          />
          {/* <Configurator /> */}
          {/* {configsButton} */}
        </>
      )}
      {layout === "vr" && <Configurator />}

      <Routes>
        {/* Login Sayfası (Herkese Açık) */}
        <Route path="/authentication/sign-in/cover" element={<Cover />} />
        <Route path="/LogOut" element={<Logout />} />
        <Route path="/authentication/reset-password" element={<ResetCover />} />
        <Route path="/tickets/customer" element={<CustomerSales />} />
        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          {getRoutes(routes)} {/* Tüm özel rotaları ekler */}
          <Route path="*" element={<Navigate to="/ActivityReports" />} />
          <Route path="/users/detail" element={<UserDetail />} />
          <Route path="/ActivityReports" element={<ActivityReports />} />
          <Route path="/Messages" element={<MessagePage />} />
          <Route path="/Menus" element={<MenuList />} />
          <Route path="/MenuDetail" element={<MenuDetail />} />
          <Route path="/parameters" element={<CreateForm />} />
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

        <Route path="/formAuth" element={<FormAuth />} />
        <Route path="/formAuth/detail" element={<FormAuthDetail />} />
        <Route path="/formAuth/detail/:id" element={<FormAuthDetail />} />

        <Route path="/formlist/:formId" element={<FormList />} />

        {/* Tüm Eşleşmeyen URL'ler için Yönlendirme */}
        {/* <Route path="*" element={<Navigate to="/dashboards/analytics" replace />} /> */}
      </Routes>
    </ThemeProvider>
  );
}
