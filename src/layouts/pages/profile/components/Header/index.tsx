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

import { useState, useEffect, ReactNode } from "react";
import ArrowBack from '@mui/icons-material/ArrowBack';

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 PRO React TS Base Styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import burceMars from "assets/images/bruce-mars.jpg";
import backgroundImage from "assets/images/bg-profile.jpeg";
import { useUser } from "layouts/pages/hooks/userName";
import { UserApi, UserAppDto } from "api/generated";
import getConfiguration from "confiuration";
import { useBusy } from "layouts/pages/hooks/useBusy";


interface HeaderProps {
  children?: ReactNode;
  profileData?: UserAppDto; // Yeni prop
  booleanControl?: boolean
  selectedUser?: (user: UserAppDto) => void
  headerControl?: boolean
}


function Header({ children, profileData, booleanControl, selectedUser,headerControl }: HeaderProps): JSX.Element {
  const [tabsOrientation, setTabsOrientation] = useState<"horizontal" | "vertical">("horizontal");
  const [tabValue, setTabValue] = useState(0);

  const handleLetEmptyUserSelect = () => {
    selectedUser(null);
  }


  const dispatchBusy = useBusy()
  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /**
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();
    // fetchDetail();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);


  // const fetchDetail = async () => {
  //   dispatchBusy({ isBusy: true });
  //   var conf = getConfiguration();
  //   var api = new UserApi(conf);
  //   var data = await api.apiUserGetLoginUserDetailGet();

  //   setProfileData(data.data);
  //   dispatchBusy({ isBusy: false });
  // };

  const handleSetTabValue = (event: any, newValue: any) => setTabValue(newValue);

  return (
    <MDBox position="relative" mb={5}>
  
      <Card
        style={
          headerControl ? {marginTop: "40px"} : {marginTop: "34px"}
      }
        sx={{
          position: "relative",
          
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        {
            booleanControl && (
              <MDBox mb={0} style={{ marginLeft: "10px", position: "absolute", top: 10, display: "flex", alignItems: "center" }}>
              <ArrowBack onClick={handleLetEmptyUserSelect} style={{ cursor: "pointer", color: "blue" }} />
              <MDBox style={{paddingLeft:"12px", paddingTop:"2px"}}>
              <MDTypography >Geri Dön</MDTypography>
              </MDBox>
            </MDBox>)
          }
        <Grid  container spacing={3} alignItems="center" mt={headerControl ? 0.5 : 4.5} mx={0.5} mb={headerControl ? 3.5 : 0}>
          
          <Grid item>
            <MDAvatar src={`data:image/png;base64,${profileData.photo}`} alt="profile-image" size="xxl" shadow="sm" />
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {profileData!.firstName + " " + profileData!.lastName}
              </MDTypography>
              <MDTypography variant="button" color="text" fontWeight="regular">
                {profileData!.title!}
              </MDTypography>
            </MDBox>
          </Grid>
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

// Declaring default props for Header
Header.defaultProps = {
  children: "",
};

export default Header;


