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

import { useMemo } from "react";

// @mui material components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// Material Dashboard 2 PRO React TS components
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

// Material Dashboard 2 PRO React TS examples components
import SalesTableCell from "examples/Tables/SalesTable/SalesTableCell";
import MDButton from "components/MDButton";
import { Icon, Tooltip } from "@mui/material";
// Declaring props types for SalesTable
interface Props {
  title?: string;
  rows?: {
    [key: string]: string | number | (string | number)[];
  }[];
  shadow?: boolean;
}

function SalesTable({ title, rows, shadow }: Props): JSX.Element {
  const renderTableCells = rows.map((row, rowIndex) => (
    <TableRow key={rowIndex}>
      {Object.entries(row).map(([key, value], cellIndex) => (
        <SalesTableCell
          key={cellIndex}
          title={key}
          content={value as string | number}
          index={rowIndex}
          noBorder={cellIndex === Object.entries(row).length - 1}
        />
      ))}
    </TableRow>
  ));

  return (
    <TableContainer sx={{ height: "100%", boxShadow: !shadow && "none" }}>
      <Table>
        {title ? (
          <TableHead sx={{ mb: 2 }}>
            <MDBox component="tr" width="max-content" display="block" mb={1.5}>
              <MDTypography variant="h6" component="td">
                {title}
              </MDTypography>
            </MDBox>
          </TableHead>
        ) : null}

        <TableBody>{useMemo(() => renderTableCells, [rows])}</TableBody>
      </Table>
    </TableContainer>
  );
}

// Declaring default props for SalesTable
SalesTable.defaultProps = {
  title: "",
  rows: [{}],
  shadow: true,
};

export default SalesTable;
