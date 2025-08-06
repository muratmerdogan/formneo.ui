import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import React from 'react'
interface Props {
    name: string,
    checked?: boolean
}

function NameCell({name , checked} : Props) {
  return (
    <MDBox display="flex" alignItems="center">
      
      <MDBox ml={1}>
        <MDTypography variant="caption" fontWeight="medium" color="text">
          {name}
        </MDTypography>
      </MDBox>
    </MDBox>
  )
}
export default NameCell