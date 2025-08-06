/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-routers components
import { Link } from "react-router-dom";

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import { Divider, Icon } from "@mui/material";
import MessageBox from "layouts/pages/Components/MessageBox";
import { useState } from "react";

export interface ProfileDto {
  image?: string;
  name: string;
  description: string;
  id: string;
}

function ProfilesList({
  title,
  profiles,
  shadow,
  onDelete,
}: {
  title: string;
  profiles: ProfileDto[];
  shadow: boolean;
  onDelete: (id: string) => void;
}) {
  const [isQuestionMessageBoxOpen, setIsQuestionMessageBoxOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const renderProfiles = profiles.map(({ image, name, description, id }) => (
    <MDBox
      key={name}
      component="li"
      display="flex"
      alignItems="center"
      py={1}
      mb={1}
      position="relative"
      style={{ overflow: "auto",maxHeight: "100px" }}
    >
      <MDBox mr={2}>
        <MDAvatar src={`data:image/png;base64,${image}`} alt="something here" shadow="md" />
      </MDBox>
      <MDBox display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center">
        <MDTypography variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption" color="text">
          {description}
        </MDTypography>
      </MDBox>
      <MDBox
        sx={{
          position: "absolute",
          left: "400px", // Butonu sabit bir mesafede konumlandırır
        }}
      >
        <Icon
          onClick={() => handleOpenQuestionBox(id)}
          sx={{ cursor: "pointer", color: "red" }}
          style={{ marginRight: "8px" }}
        >
          delete
        </Icon>
      </MDBox>
    </MDBox>
  ));

  const handleOpenQuestionBox = (id: string) => {
    setSelectedProfileId(id);
    setIsQuestionMessageBoxOpen(true);
  };

  const handleCloseQuestionBox = (action: string, escPressed?: boolean) => {
    setIsQuestionMessageBoxOpen(false);
    if (action === "Yes" && selectedProfileId) {
      handleDelete(selectedProfileId);
    }
  };

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  return (
    <Card sx={{ height: "100%", boxShadow: !shadow && "none" }}>
      <MDBox pt={2} px={2} mb={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>

        
      </MDBox>
      
      <MDBox p={2}  style={{ overflow: "auto",maxHeight: "250px",width: "500px" }}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {renderProfiles}
        </MDBox>
      </MDBox>
      <MessageBox
        isQuestionmessageBoxOpen={isQuestionMessageBoxOpen}
        handleCloseQuestionBox={handleCloseQuestionBox}
      />
    </Card>
  );
}

// Setting default props for the ProfilesList
ProfilesList.defaultProps = {
  shadow: true,
};

// Typechecking props for the ProfilesList
ProfilesList.propTypes = {
  title: PropTypes.string.isRequired,
  profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  shadow: PropTypes.bool,
  onDelete: PropTypes.func.isRequired,
};

export default ProfilesList;
