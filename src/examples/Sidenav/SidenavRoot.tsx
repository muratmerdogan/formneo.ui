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
import Drawer from "@mui/material/Drawer";
import { styled, Theme } from "@mui/material/styles";

export default styled(Drawer)(({ theme, ownerState }: { theme?: Theme; ownerState: any }) => {
  const { palette, boxShadows, transitions, breakpoints, functions } = theme;
  const { transparentSidenav, whiteSidenav, miniSidenav, darkMode } = ownerState;

  // Sidebar dimensions
  const sidebarWidth = 260; // Full width when open
  const miniSidebarWidth = 80; // Collapsed width

  // SuccessFactors colors
  const successFactorsBlue = "#0f74bc"; // Primary blue
  const successFactorsLightBlue = "#e8f4fc"; // Light blue

  // Background color logic
  let backgroundValue = darkMode
    ? successFactorsBlue // Dark mode uses primary blue
    : successFactorsLightBlue; // Light mode uses light blue

  if (transparentSidenav) {
    backgroundValue = palette.transparent.main; // Transparent background
  } else if (whiteSidenav) {
    backgroundValue = palette.white.main; // White background
  }

  // Styles for the sidenav when miniSidenav={false}
  const drawerOpenStyles = () => ({
    transform: "translateX(0)",
    transition: transitions.create("transform", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),
    // marginLeft: "0px",
    borderRadius: "0px",
    marginRight: "0px",
    [breakpoints.up("xl")]: {
      boxShadow: transparentSidenav ? "none" : boxShadows.xxl,
      marginBottom: transparentSidenav ? 0 : "inherit",
      left: "0",
      width: sidebarWidth,
      marginTop: "24px",
      height: "calc(100% - 48px) !important",
      // borderRadius: "15px", // Rounded corners
      transform: "translateX(0)",
      transition: transitions.create(["width", "background-color"], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.enteringScreen,
      }),
    },
  });

  // Styles for the sidenav when miniSidenav={true}
  const drawerCloseStyles = () => ({
    // background: "#212121", // Dark background
    transform: `translateX(${functions.pxToRem(-320)})`,
    transition: transitions.create("transform", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),
    [breakpoints.up("xl")]: {
      boxShadow: transparentSidenav ? "none" : boxShadows.xxl,
      marginBottom: transparentSidenav ? 0 : "inherit",
      left: "0",
      width: miniSidebarWidth,
      marginTop: "24px",
      height: "calc(100% - 48px) !important",
      // borderRadius: "15px", // Rounded corners
      overflowX: "hidden",
      transform: "translateX(0)",
      transition: transitions.create(["width", "background-color"], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.shorter,
      }),
    },
  });

  return {
    "& .MuiDrawer-paper": {
      border: "none",
      boxShadow: boxShadows.xxl,
      ...(miniSidenav ? drawerCloseStyles() : drawerOpenStyles()),
    },
  };
});