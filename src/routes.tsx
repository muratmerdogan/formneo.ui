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

/**
  All of the routes for the Material Dashboard 2 PRO React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav.
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that contains other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 PRO React layouts
import Analytics from "layouts/dashboards/analytics";
import Sales from "layouts/dashboards/sales";
import ProfileOverview from "layouts/pages/profile/profile-overview";
import AllProjects from "layouts/pages/profile/all-projects";
import NewUser from "layouts/pages/users/new-user";
import ListUser from "layouts/pages/users/list-user";

import Billing from "layouts/pages/account/billing";
import Invoice from "layouts/pages/account/invoice";
import Timeline from "layouts/pages/projects/timeline";
import PricingPage from "layouts/pages/pricing-page";
import Widgets from "layouts/pages/widgets";
import RTL from "layouts/pages/rtl";
import Charts from "layouts/pages/charts";
import Notifications from "layouts/pages/notifications";
import Kanban from "layouts/applications/kanban";
import Wizard from "layouts/applications/wizard";

import Calendar from "layouts/applications/calendar";
import NewProduct from "layouts/ecommerce/products/new-product";
import EditProduct from "layouts/ecommerce/products/edit-product";
import ProductPage from "layouts/ecommerce/products/product-page";
import OrderList from "layouts/ecommerce/orders/order-list";
import OrderDetails from "layouts/ecommerce/orders/order-details";
import SignInBasic from "layouts/authentication/sign-in/basic";
import SignInCover from "layouts/authentication/sign-in/cover";
import SignInIllustration from "layouts/authentication/sign-in/illustration";
import SignUpCover from "layouts/authentication/sign-up/cover";
import ResetCover from "layouts/authentication/reset-password/cover";

// Material Dashboard 2 PRO React TS components
import MDAvatar from "components/MDAvatar";

// @mui icons
import Icon from "@mui/material/Icon";

// Images
import profilePicture from "assets/images/team-3.jpg";
import { useUser } from "layouts/pages/hooks/userName";
import Logout from "layouts/authentication/sign-in/cover/Logout";
import EditProject from "layouts/pages/profile/all-projects/edit-product";
import TalepOlustur from "layouts/pages/talepYonetimi/createTicket";
import CreateRequest from "layouts/pages/talepYonetimi/createTicket";
import AllTickets from "layouts/pages/talepYonetimi/allTickets";
import Departmens from "layouts/pages/users/departments";
import CreateDepartment from "layouts/pages/users/departments/createDepartment";
import MenuList from "layouts/pages/menuDefination/MenuList";
import MenuDetail from "layouts/pages/menuDefination/MenuDetail";
import ListForm from "layouts/pages/FormManagement/listForm";
import CreateForm from "layouts/pages/FormManagement/ParamtetersDefination";
import ParameterEdit from "layouts/pages/FormManagement/ParameterEdit";

import UserFormList from "layouts/pages/FormManagement/UsersForm/UserForms";

import Teams from "layouts/pages/teams";
import CreateTeams from "layouts/pages/teams/createTeam";


import RolesDefination from "layouts/pages/roles/RoleList";
import RoleScreenDefination from "layouts/pages/roles/RoleScreen";
import RolesList from "layouts/pages/roles/RoleList";
import NotAuthorizationPage from "layouts/pages/notAuthorizationPage";
import DataTables from "layouts/pages/users/list-user";
import Settings from "layouts/pages/users/userDetail/settings";
import WorkCompanyCE from "layouts/pages/workCompany/ce";
import WorkCompany from "layouts/pages/workCompany";
import WorkCompanySystem from "layouts/pages/workCompanySystem";
import WorkCompanySystemCE from "layouts/pages/workCompanySystem/ce";
import SolveTicket from "layouts/pages/talepYonetimi/solveTicket";
import SolveAllTicket from "layouts/pages/talepYonetimi/solveAllTicket";

import WorkFlowList from "layouts/pages/WorkFlow/WorkFlowList";
import WorkFlowDetail from "layouts/pages/WorkFlow/WorkFlowDetail.jsx";
import ApproveList from "layouts/pages/WorkFlow/ApproveList";
import ParameterView from "layouts/pages/FormManagement/listForm/ParameterView";
// const { userAppDto } = useUser(); // Context'ten veriyi alıyoruz


const routes = [
  {
    type: "collapse",
    name: "User Form List",
    key: "userFormList",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "userFormList",
        key: "userFormList",
        route: "/userFormList",
        component: <UserFormList />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Work Company System",
    key: "workflowList",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "workflowList",
        key: "workflowList",
        route: "/workflowList",
        component: <WorkFlowList />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Work Company System",
    key: "workflowdetail",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "workflowdetail",
        key: "workflowdetail",
        route: "/WorkFlowList/detail/:id",
        component: <WorkFlowDetail />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Work Company System",
    key: "workflowdetailCreate",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "workflowdetail",
        key: "workflowdetail",
        route: "/WorkFlowList/detail",
        component: <WorkFlowDetail />,
      },


    ],
  },

  {
    type: "collapse",
    name: "Onay",
    key: "approve",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "approve",
        key: "approve",
        route: "/approve",
        component: <ApproveList />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Work Company System",
    key: "workCompanySystemList",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "workCompanySystemList",
        key: "workCompanySystemList",
        route: "/workCompanySystem",
        component: <WorkCompanySystem />,
      },
    ],
  },

  {
    type: "collapse",
    name: "Work Company System Edit Create",
    key: "workCompanySystemEditCreate",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Work Company System Edit Create",
        key: "workCompanySystemEditCreate",
        route: "/workCompanySystem/detail",
        component: <WorkCompanySystemCE />,
      },


    ],
  },
  {
    type: "collapse",
    name: "Work Company System Edit ",
    key: "workCompanySystemEdit",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Work Company System Edit ",
        key: "workCompanySystemEdit",
        route: "/workCompanySystem/detail/:id",
        component: <WorkCompanySystemCE />,

      },



    ],
  },
  {
    type: "collapse",
    name: "Work Company",
    key: "workCompany",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Work Company",
        key: "workCompany",
        route: "/workCompany",
        component: <WorkCompany />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Work Company Edit Create",
    key: "workCompanyEditCreate",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Work Company Edit Create",
        key: "workCompanyEditCreate",
        route: "/workCompany/detail",
        component: <WorkCompanyCE />,
      },

    ],
  },
  {
    type: "collapse",
    name: "Work Company Edit Create",
    key: "workCompanyEditCreate",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Work Company Edit Create",
        key: "workCompanyEditCreate",
        route: "/workCompany/detail/:id",
        component: <WorkCompanyCE />,
      },
    ],
  },



  {
    type: "collapse",
    name: "My Profile",
    key: "my-profile",
    icon: <MDAvatar src={profilePicture} alt="Brooklyn Alice" size="sm" />,
    collapse: [
      {
        name: "My Profile",
        key: "my-profile",
        route: "/pages/profile/profile-overview",
        component: <ProfileOverview />,

      },
      {
        name: "Settings",
        key: "profile-settings",
        route: "/pages/account/settings",
        component: <Settings />,
      },
      {
        name: "Logout",
        key: "logout",
        route: "/LogOut",
        component: <Logout />,
      },
    ],
  },
  {
    type: "hidden",
    name: "Menüler",
    key: "menus",
    icon: <Icon fontSize="medium">menu</Icon>,
    collapse: [
      {
        name: "Menü Listesi",
        key: "menu-list",
        route: "/menus",
        component: <MenuList />,
      },
    ],
  },
  {
    type: "hidden",
    name: "Menü Detayları",
    key: "menu-detail",
    icon: <Icon fontSize="medium">menu</Icon>,
    collapse: [
      {
        name: "Menü Detayları",
        key: "menu-detail",
        route: "/menus/detail",
        component: <MenuDetail />,
      },
    ],
  },
  {
    type: "hidden",
    name: "Menü Detayları With Params",
    key: "menu-detail-with-params",
    icon: <Icon fontSize="medium">menu</Icon>,
    collapse: [
      {
        name: "Menü Detayları With Params",
        key: "menu-detail-with-params",
        route: "/menus/detail/:id",
        component: <MenuDetail />,

      },
    ],
  },
  {
    type: "hidden",
    name: "Projeler",
    key: "projects",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Proje Detayları",
        key: "edit-product",
        route: "/profile/all-projects/edit-project/:id", // Düzenleme rotası
        icon: <Icon fontSize="small">edit</Icon>, // Düzenleme ikonu
        component: <EditProject />, // EditProduct bileşeni
      },
      {
        name: "Proje Detayları",
        key: "edit-product",
        route: "/profile/all-projects/edit-project/", // Düzenleme rotası
        icon: <Icon fontSize="small">edit</Icon>, // Düzenleme ikonu
        component: <EditProject />, // EditProduct bileşeni
      },
    ],
  },
  {
    type: "hidden",
    name: "Roles List",
    key: "rolesList",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Roles List",
        key: "rolesList",
        route: "/roles",
        component: <RolesList />,
      },
    ],
  },
  {
    type: "hidden",
    name: "edit Roles",
    key: "editRoles",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "edit Roles",
        key: "editRoles",
        route: "/roles/detail/:id",
        component: <RoleScreenDefination />,

      },
    ],
  },
  {
    type: "hidden",
    name: "Role Screen",
    key: "roleScreen",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Role Screen",
        key: "roleScreen",
        route: "/roles/detail",
        component: <RoleScreenDefination />,

      },
    ],
  },
  {
    type: "hidden",
    name: "Form Management",
    key: "formManagement",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "List Parameters",
        key: "listParameters",
        route: "/parameters",
        component: <ListForm />,
      },
    ],
  },
  {
    type: "hidden",
    name: "Create Form",
    key: "createForm",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Create Form",
        key: "createForm",
        route: "/parameters/detail",
        component: <CreateForm />,

      },
    ],
  },

  {
    type: "hidden",
    name: "Create Form",
    key: "createForm",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Create Form",
        key: "createForm",
        route: "/ParameterEdit/",
        component: <ParameterEdit />,

      },
    ],
  },

  {
    type: "hidden",
    name: "Create Form",
    key: "createForm",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Create Form",
        key: "createForm",
        route: "/parameters/view/:formId/:formRunId?/:isVisibility?",
        component: <ParameterView />,

      },
    ],
  },
  {
    type: "hidden",
    name: "Create Form With Params",
    key: "createFormWithParams",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Create Form With Params",
        key: "createFormWithParams",
        route: "/parameters/detail/:id",
        component: <CreateForm />,

      },
    ],
  },
  {
    type: "hidden",
    name: "all Projects w/Params",
    key: "projectsID",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "All Projects",
        key: "all-projects-id",
        route: "/profile/all-projects/:id",
        component: <AllProjects />,
      },
    ],
  },
  {
    type: "hidden",
    name: "Departments",
    key: "departments",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Departments",
        key: "departments",
        route: "/departments",
        component: <Departmens />,
      },
    ],
  },
  {
    type: "hidden",
    name: "Create Department",
    key: "createDepartment",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Create Department",
        key: "Create-Department",
        route: "/departments/detail",
        component: <CreateDepartment />,
      },
    ],
  },
  {
    type: "hidden",
    name: "Create Department",
    key: "createDepartmentWithParams",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Create Department",
        key: "Create-Department",
        route: "/departments/detail/:id",
        component: <CreateDepartment />,

      },
    ],
  },
  {
    type: "hidden",
    name: "Teams",
    key: "teams",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Teams",
        key: "teams",
        route: "/teams",
        component: <Teams />,
      },
    ],
  },

  {
    type: "hidden",
    name: "Create Team",
    key: "createTeam",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Create Team",
        key: "Create-Team",
        route: "/teams/createTeam",
        component: <CreateTeams />,
      },
    ],
  },
  {
    type: "hidden",
    name: "Create Team",
    key: "createTeamWithParams",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Create Team",
        key: "Create-Team",
        route: "/teams/createTeam/:id",
        component: <CreateTeams />,
      },
    ],
  },
  {
    type: "hidden",
    name: "Solve All Ticket",
    key: "solveAllTicket",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Solve All Ticket",
        key: "solveAllTicket",
        route: "/solveAllTicket/",
        component: <SolveAllTicket />,
      },
    ],
  },
  {
    type: "hidden",
    name: "Solve Ticket",
    key: "solveTicket",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Solve Ticket",
        key: "solveTicket",
        route: "/solveAllTicket/solveTicket/",
        component: <SolveTicket />,
      },
    ],
  },

  {
    type: "hidden",
    name: "Create Ticket",
    key: "createTicket",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Create Request",
        key: "Create-Request",
        route: "/tickets/detail",
        component: <CreateRequest />,
      },
    ],
  },
  {
    type: "hidden",
    name: "Edit Ticket",
    key: "editTicket",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "Edit Ticket",
        key: "Edit-Ticket",
        route: "/tickets/detail/",
        component: <CreateRequest />,
      },
    ],
  },

  {
    type: "hidden",
    name: "All Tickets",
    key: "showTickets",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "All Tickets",
        key: "All-Tickets",
        route: "/tickets/",
        component: <AllTickets />,


      },
    ],
  },
  {
    type: "hidden",
    name: "User List",
    key: "userList",
    icon: <Icon fontSize="medium">memory</Icon>,
    collapse: [
      {
        name: "User List",
        key: "userList",
        route: "/users",
        component: <DataTables />,
      },
    ],
  },
  {
    type: "hidden",
    name: "User Create",
    key: "userCreate",
    icon: <Icon fontSize="medium">memory</Icon>,

    collapse: [
      {
        name: "User Create",
        key: "userCreate",
        route: "/users/detail",
        component: <Settings />,
      },

    ],
  },
  {
    type: "hidden",
    name: "User Edit",
    key: "userEdit",
    icon: <Icon fontSize="medium">memory</Icon>,

    collapse: [
      {
        name: "User Edit",
        key: "userEdit",
        route: "/users/detail/?id",
        component: <Settings />,

      },
    ],
  },


  {
    type: "collapse",


    name: "Dashboards",
    key: "dashboards",
    icon: <Icon fontSize="medium">dashboard</Icon>,
    collapse: [
      {
        name: "Analytics",
        key: "analytics",
        route: "/dashboards/analytics",
        component: <Analytics />,
      },
      {
        name: "Sales",
        key: "sales",
        route: "/dashboards/sales",
        component: <Sales />,
      },
    ],
  },

  { type: "title", title: "Pages", key: "title-pages" },
  {
    type: "collapse",
    name: "Vesa Destek Yönetim",
    key: "pages",
    icon: <Icon fontSize="medium">image</Icon>,
    collapse: [
      {
        name: "Profile",
        key: "profile",
        collapse: [
          {
            name: "Profile Overview",
            key: "profile-overview",
            route: "/profile/profile-overview",
            component: <ProfileOverview />,
          },
          {
            name: "All Projects",
            key: "all-projects",
            route: "/profile/all-projects",
            component: <AllProjects />,
          },
        ],
      },
      {
        name: "Users",
        key: "users",
        collapse: [
          {
            name: "Kullanıcı Listesi",
            key: "users",
            route: "users",
            component: <ListUser />,
          },
        ],
      },
      {
        name: "Account",
        key: "account",
        collapse: [
          {
            name: "Settings",
            key: "settings",
            route: "/pages/account/settings",
            component: <Settings />,
          },
          {
            name: "Billing",
            key: "billing",
            route: "/pages/account/billing",
            component: <Billing />,
          },
          {
            name: "Invoice",
            key: "invoice",
            route: "/pages/account/invoice",
            component: <Invoice />,
          },
        ],
      },
      {
        name: "Projects",
        key: "projects",
        collapse: [
          {
            name: "Timeline",
            key: "timeline",
            route: "/pages/projects/timeline",
            component: <Timeline />,
          },
        ],
      },
      {
        name: "Pricing Page",
        key: "pricing-page",
        route: "/pages/pricing-page",
        component: <PricingPage />,
      },
      { name: "RTL", key: "rtl", route: "/pages/rtl", component: <RTL /> },
      { name: "Widgets", key: "widgets", route: "/pages/widgets", component: <Widgets /> },
      { name: "Charts", key: "charts", route: "/pages/charts", component: <Charts /> },
      {
        name: "Notfications",
        key: "notifications",
        route: "/pages/notifications",
        component: <Notifications />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Applications",
    key: "applications",
    icon: <Icon fontSize="medium">apps</Icon>,
    collapse: [
      {
        name: "Kanban",
        key: "kanban",
        route: "/applications/kanban",
        component: <Kanban />,
      },
      {
        name: "Wizard",
        key: "wizard",
        route: "/applications/wizard",
        component: <Wizard />,
      },
      {
        name: "Data Tables",
        key: "data-tables",
        route: "/applications/data-tables",
        component: <DataTables />,
      },
      {
        name: "Calendar",
        key: "calendar",
        route: "/applications/calendar",
        component: <Calendar />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Ecommerce",
    key: "ecommerce",
    icon: <Icon fontSize="medium">shopping_basket</Icon>,
    collapse: [
      {
        name: "Products",
        key: "products",
        collapse: [
          {
            name: "New Product",
            key: "new-product",
            route: "/ecommerce/products/new-product",
            component: <NewProduct />,
          },
          {
            name: "Edit Product",
            key: "edit-product",
            route: "/ecommerce/products/edit-product",
            component: <EditProduct />,
          },
          {
            name: "Product Page",
            key: "product-page",
            route: "/ecommerce/products/product-page",
            component: <ProductPage />,
          },
        ],
      },
      {
        name: "Orders",
        key: "orders",
        collapse: [
          {
            name: "Order List",
            key: "order-list",
            route: "/ecommerce/orders/order-list",
            component: <OrderList />,
          },
          {
            name: "Order Details",
            key: "order-details",
            route: "/ecommerce/orders/order-details",
            component: <OrderDetails />,
          },
        ],
      },
    ],
  },
  {
    type: "collapse",
    name: "Authentication",
    key: "authentication",
    icon: <Icon fontSize="medium">content_paste</Icon>,
    collapse: [
      {
        name: "Sign In",
        key: "sign-in",
        collapse: [
          {
            name: "Basic",
            key: "basic",
            route: "/authentication/sign-in/basic",
            component: <SignInBasic />,
          },
          {
            name: "Illustration",
            key: "illustration",
            route: "/authentication/sign-in/illustration",
            component: <SignInIllustration />,
          },
        ],
      },
      {
        name: "Sign Up",
        key: "sign-up",
        collapse: [
          {
            name: "Cover",
            key: "cover",
            route: "/authentication/sign-up/cover",
            component: <SignUpCover />,
          },
        ],
      },
      {
        name: "Reset Password",
        key: "reset-password",
        collapse: [
          {
            name: "Cover",
            key: "cover",
            route: "/authentication/reset-password",
            component: <ResetCover />,
          },
        ],
      },
    ],
  },
  { type: "divider", key: "divider-1" },
  { type: "title", title: "Docs", key: "title-docs" },
  {
    type: "collapse",
    name: "Basic",
    key: "basic",
    icon: <Icon fontSize="medium">upcoming</Icon>,
    collapse: [
      {
        name: "Getting Started",
        key: "getting-started",
        collapse: [
          {
            name: "Overview",
            key: "overview",
            href: "https://www.creative-tim.com/learning-lab/react/overview/material-dashboard/",
          },
          {
            name: "License",
            key: "license",
            href: "https://www.creative-tim.com/learning-lab/react/license/material-dashboard/",
          },
          {
            name: "Quick Start",
            key: "quick-start",
            href: "https://www.creative-tim.com/learning-lab/react/quick-start/material-dashboard/",
          },
          {
            name: "Build Tools",
            key: "build-tools",
            href: "https://www.creative-tim.com/learning-lab/react/build-tools/material-dashboard/",
          },
        ],
      },
      {
        name: "Foundation",
        key: "foundation",
        collapse: [
          {
            name: "Colors",
            key: "colors",
            href: "https://www.creative-tim.com/learning-lab/react/colors/material-dashboard/",
          },
          {
            name: "Grid",
            key: "grid",
            href: "https://www.creative-tim.com/learning-lab/react/grid/material-dashboard/",
          },
          {
            name: "Typography",
            key: "base-typography",
            href: "https://www.creative-tim.com/learning-lab/react/base-typography/material-dashboard/",
          },
          {
            name: "Borders",
            key: "borders",
            href: "https://www.creative-tim.com/learning-lab/react/borders/material-dashboard/",
          },
          {
            name: "Box Shadows",
            key: "box-shadows",
            href: "https://www.creative-tim.com/learning-lab/react/box-shadows/material-dashboard/",
          },
          {
            name: "Functions",
            key: "functions",
            href: "https://www.creative-tim.com/learning-lab/react/functions/material-dashboard/",
          },
          {
            name: "Routing System",
            key: "routing-system",
            href: "https://www.creative-tim.com/learning-lab/react/routing-system/material-dashboard/",
          },
        ],
      },
    ],
  },
  {
    type: "collapse",
    name: "Components",
    key: "components",
    icon: <Icon fontSize="medium">view_in_ar</Icon>,
    collapse: [
      {
        name: "Alerts",
        key: "alerts",
        href: "https://www.creative-tim.com/learning-lab/react/alerts/material-dashboard/",
      },
      {
        name: "Avatar",
        key: "avatar",
        href: "https://www.creative-tim.com/learning-lab/react/avatar/material-dashboard/",
      },
      {
        name: "Badge",
        key: "badge",
        href: "https://www.creative-tim.com/learning-lab/react/badge/material-dashboard/",
      },
      {
        name: "Badge Dot",
        key: "badge-dot",
        href: "https://www.creative-tim.com/learning-lab/react/badge-dot/material-dashboard/",
      },
      {
        name: "Box",
        key: "box",
        href: "https://www.creative-tim.com/learning-lab/react/box/material-dashboard/",
      },
      {
        name: "Buttons",
        key: "buttons",
        href: "https://www.creative-tim.com/learning-lab/react/buttons/material-dashboard/",
      },
      {
        name: "Date Picker",
        key: "date-picker",
        href: "https://www.creative-tim.com/learning-lab/react/datepicker/material-dashboard/",
      },
      {
        name: "Dropzone",
        key: "dropzone",
        href: "https://www.creative-tim.com/learning-lab/react/dropzone/material-dashboard/",
      },
      {
        name: "Editor",
        key: "editor",
        href: "https://www.creative-tim.com/learning-lab/react/quill/material-dashboard/",
      },
      {
        name: "Input",
        key: "input",
        href: "https://www.creative-tim.com/learning-lab/react/input/material-dashboard/",
      },
      {
        name: "Pagination",
        key: "pagination",
        href: "https://www.creative-tim.com/learning-lab/react/pagination/material-dashboard/",
      },
      {
        name: "Progress",
        key: "progress",
        href: "https://www.creative-tim.com/learning-lab/react/progress/material-dashboard/",
      },
      {
        name: "Snackbar",
        key: "snackbar",
        href: "https://www.creative-tim.com/learning-lab/react/snackbar/material-dashboard/",
      },
      {
        name: "Social Button",
        key: "social-button",
        href: "https://www.creative-tim.com/learning-lab/react/social-buttons/material-dashboard/",
      },
      {
        name: "Typography",
        key: "typography",
        href: "https://www.creative-tim.com/learning-lab/react/typography/material-dashboard/",
      },
    ],
  },
  {
    type: "collapse",
    name: "Change Log",
    key: "changelog",
    href: "https://github.com/creativetimofficial/ct-material-dashboard-pro-react/blob/main/CHANGELOG.md",
    icon: <Icon fontSize="medium">receipt_long</Icon>,
    noCollapse: true,
  },
];

export default routes;
function GetFullName() {
  return localStorage.getItem("menuNameSurmane");

  return Math.floor(Math.random() * 100); // 0 ile 99 arasında rastgele sayı

  return "33";
  // // const fullName = useFullName(); // Custom hook'u çağırıyoruz

  // // return fullName;
}
