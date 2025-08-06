import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// NewUser page components
import FormGenericSelect from "../FormField/FormGenericSelect";
import { GenericList } from "api/generated";
import { SelectDialog } from "layouts/UserComponents/GenericSelectDialogWithInputEnum";
import FormField from "../FormField";

function Organization({ formData }: any): JSX.Element {
  const { formField, values } = formData;
  const { department, manager1, manager2, title } = formField;
  const { manager1: manager1V, department: departmentV, manager2: manager2V, title: titleV } = values;

  const [displayValuedepartment, setDisplayValuedepartment] = useState<string>(""); //
  const [displayValuemanager1, setDisplayValuemanager1] = useState<string>(""); //
  const [displayValuemanager2, setDisplayValuemanager2] = useState<string>(""); //


  useEffect(() => {



  }, []);
  return (
    <MDBox>
      <MDTypography variant="h5" fontWeight="bold">
        Organization
      </MDTypography>
      <MDBox mt={1.625}>
        <Grid container spacing={3}>
          {/* Sol Sütun */}
          <Grid item xs={12} md={6}>
            {/* Departman Alanı */}
            <FormGenericSelect
              displayValue={departmentV}
              value={department}
              label={department.label}
              name={department.name}
              dataId={GenericList.NUMBER_17} // 1. Yönetici için dataId
              headerText="Select First Manager"
            />

          </Grid>
          {/* 1. Yönetici Alanı */}
          <Grid item xs={12} md={6}>
            <FormGenericSelect
              displayValue={manager1V}
              value={manager1}
              label={manager1.label}
              name={manager1.name}
              dataId={GenericList.NUMBER_101} // 1. Yönetici için dataId
              headerText="Select First Manager"
            />


          </Grid>
          {/* Sağ Sütun */}
          <Grid item xs={12} md={6}>
            {/* 2. Yönetici Alanı */}
            <FormGenericSelect
              displayValue={manager2V}
              value={manager2}
              label={manager2.label}
              name={manager2.name}
              dataId={GenericList.NUMBER_101} // 1. Yönetici için dataId
              headerText="Select Second Manager"
            />

          </Grid>
          <Grid item xs={12} md={6}>
            {/* Başlık Alanı */}
            <FormGenericSelect
              displayValue={titleV}
              value={title}
              label={title.label}
              name={title.name}
              dataId={GenericList.NUMBER_10} // Başlık için dataId
              headerText="Select Title"
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default React.memo(Organization);
