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
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React TS Base Styles
import typography from "assets/theme/base/typography";
import { useTranslation } from "react-i18next";

// Declaring props types for Footer
interface Props {
  company?: {
    href: string;
    name: string;
  };
  links?: {
    href: string;
    name: string;
  }[];
  [key: string]: any;
}

function Footer({ company, links }: Props): JSX.Element {
  const { href, name } = company;
  const { size } = typography;
  const { t } = useTranslation();
  const renderLinks = () =>
    links.map((link) => (
      <MDBox key={link.name} component="li" px={2} lineHeight={1}>
        <Link href={link.href} target="_blank">
          <MDTypography variant="button" fontWeight="regular" color="text">
            {link.name === "Vesacons"
              ? link.name
              : link.name === "Hakkimizda"
              ? t("ns1:FooterPage.Hakkimizda")
              : link.name === "Blog"
              ? t("ns1:FooterPage.Blog")
              : link.name === "Lisans"
              ? t("ns1:FooterPage.Lisans")
              : link.name}
          </MDTypography>
        </Link>
      </MDBox>
    ));

  return (
    <MDBox
      style={{ marginTop: "10px" }}
      width="100%"
      display="flex"
      flexDirection={{ xs: "column", lg: "row" }}
      justifyContent="space-between"
      alignItems="center"
      px={1.5}
    >
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        color="text"
        fontSize={size.sm}
        px={1.5}
      >
        &copy; {new Date().getFullYear()},
        <MDBox fontSize={size.md} color="text" mb={-0.5} mx={0.25}>
          <Icon color="inherit" fontSize="inherit"></Icon>
        </MDBox>
        <Link href="https://vesacons.com/" target="_blank">
          <MDTypography variant="button" fontWeight="medium">
            {t("ns1:FooterPage.VesaconsSoftwareDevelopment")}
          </MDTypography>
        </Link>
      </MDBox>
      <MDBox
        component="ul"
        sx={({ breakpoints }) => ({
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          listStyle: "none",
          mt: 3,
          mb: 0,
          p: 0,

          [breakpoints.up("lg")]: {
            mt: 0,
          },
        })}
      >
        {renderLinks()}
      </MDBox>
    </MDBox>
  );
}

// Declaring default props for Footer
Footer.defaultProps = {
  company: { href: "https://vesacons.com/", name: "Vesacons" },
  links: [
    { href: "https://vesacons.com/", name: "Vesacons" },
    { href: "https://vesacons.com/", name: "Hakkimizda" },
    { href: "https://vesacons.com/", name: "Blog" },
    { href: "https://vesacons.com/", name: "Lisans" },
  ],
};

export default Footer;
