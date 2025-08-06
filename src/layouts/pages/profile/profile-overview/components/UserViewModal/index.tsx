import { Close, Dashboard, Delete, Height } from "@mui/icons-material";
import { Grid, IconButton, Modal } from "@mui/material";
import { UserAppDto } from "api/generated";
import MDAvatar from "components/MDAvatar";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React from "react";
import index0png from "assets/images/Fiori-Logo-750x410.png";

interface UserViewModalProps {
  user: UserAppDto;
  open: boolean;
  onClose: () => void;
}
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1700,
  height: 900,
  p: 4,
};

function UserViewModal({ user, open, onClose }: UserViewModalProps) {
  return (
    <DashboardLayout>
      <Modal open={open} onClose={onClose}>
        <MDBox sx={style} style={{ backgroundColor: "white",borderRadius:"20px" }}>
          <MDBox style={{ justifyContent: "end", display: "flex" }}>
            <IconButton onClick={onClose} sx={{ color: "red" }}>
              <Close />
            </IconButton>
          </MDBox>

          <MDBox>
            <MDBox display="flex" mr={2}>
              <Grid container spacing={3} alignItems="center">
                <Grid item>
                  <MDAvatar src={index0png} alt="profile-image" size="xl" shadow="sm" />
                </Grid>
                <Grid item>
                  <MDBox height="100%" mt={0.5} lineHeight={1}>
                    <MDTypography variant="h5" fontWeight="medium">
                      {user.firstName + " " + user.lastName}
                    </MDTypography>
                    <MDTypography variant="button" color="text" fontWeight="regular">
                      {user!.title!}
                    </MDTypography>
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
            <MDBox
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
            ></MDBox>
          </MDBox>
          <MDBox mt={4}>
          <MDTypography variant="h6">ID: {user.id}</MDTypography>
            <MDTypography variant="h6">First Name: {user.firstName}</MDTypography>
            <MDTypography variant="h6">Last Name: {user.lastName}</MDTypography>
            <MDTypography variant="h6">Email: {user.email}</MDTypography>
            
          </MDBox>
        </MDBox>
      </Modal>
    </DashboardLayout>
  );
}

export default UserViewModal;
