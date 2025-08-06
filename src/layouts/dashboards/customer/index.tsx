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

import { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDBadgeDot from "components/MDBadgeDot";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DefaultStatisticsCard from "examples/Cards/StatisticsCards/DefaultStatisticsCard";
import DefaultLineChart from "examples/Charts/LineCharts/DefaultLineChart";
import HorizontalBarChart from "examples/Charts/BarCharts/HorizontalBarChart";
import SalesTable from "examples/Tables/SalesTable";
import DataTable from "examples/Tables/DataTable";

// Sales dashboard components
import ChannelsChart from "layouts/dashboards/customer/components/ChannelsChart";

// Data
import defaultLineChartData from "layouts/dashboards/sales/data/defaultLineChartData";
import horizontalBarChartData from "layouts/dashboards/sales/data/horizontalBarChartData";
import salesTableData from "layouts/dashboards/sales/data/salesTableData";
import dataTableData from "layouts/dashboards/sales/data/dataTableData";
import MDInput from "components/MDInput";
import { Autocomplete } from "@mui/material";
import MDAvatar from "components/MDAvatar";
import { DashboardsApi, GetSumTicketDto, GetTicketCustomerOpenCloseDto, TicketApi, UserApi, UserAppDto } from "api/generated/api";
import getConfiguration from "confiuration";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { MessageBoxType } from "@ui5/webcomponents-react";
import TotalChart from "layouts/dashboards/customer/components/TotalChart";
import { useNavigate } from "react-router-dom";
function CustomerSales(): JSX.Element {
  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();
  const navigate = useNavigate();
  const [selectedKullanici, setSelectedKullanici] = useState<UserAppDto>(null);
  const [selectionKullaniciId, setSelectionKullaniciId] = useState<string>();
  const [namesOfSelected, setNamesOfSelected] = useState<string>();
  const [searchByName, setSearchByName] = useState<UserAppDto[]>([]);

  const [openTicketCount, setopenTicketCount] = useState<string>();
  const [closeTicketCount, setcloseTicketCount] = useState<string>();

  const [ticketCountData, setTicketCountData] = useState<GetSumTicketDto>({
    sumCount: 0,
    openCount: 0,
    resolvedCount: 0,
  });
  const [tableData, setTableData] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [formData, setFormData] = useState<any>({
    startDate: "",
    endDate: "",
    selectedKullaniciId: null,
  });

  // DefaultStatisticsCard state for the dropdown value
  const [salesDropdownValue, setSalesDropdownValue] = useState<string>("6 May - 7 May");
  const [customersDropdownValue, setCustomersDropdownValue] = useState<string>("6 May - 7 May");
  const [revenueDropdownValue, setRevenueDropdownValue] = useState<string>("6 May - 7 May");

  // DefaultStatisticsCard state for the dropdown action
  const [salesDropdown, setSalesDropdown] = useState<string | null>(null);
  const [customersDropdown, setCustomersDropdown] = useState<string | null>(null);
  const [revenueDropdown, setRevenueDropdown] = useState<string | null>(null);

  // DefaultStatisticsCard handler for the dropdown action
  const openSalesDropdown = ({ currentTarget }: any) => setSalesDropdown(currentTarget);
  const closeSalesDropdown = ({ currentTarget }: any) => {
    setSalesDropdown(null);
    setSalesDropdownValue(currentTarget.innerText || salesDropdownValue);
  };
  const openCustomersDropdown = ({ currentTarget }: any) => setCustomersDropdown(currentTarget);
  const closeCustomersDropdown = ({ currentTarget }: any) => {
    setCustomersDropdown(null);
    setCustomersDropdownValue(currentTarget.innerText || salesDropdownValue);
  };
  const openRevenueDropdown = ({ currentTarget }: any) => setRevenueDropdown(currentTarget);
  const closeRevenueDropdown = ({ currentTarget }: any) => {
    setRevenueDropdown(null);
    setRevenueDropdownValue(currentTarget.innerText || salesDropdownValue);
  };

  const handleSearchByName = async (value: string) => {
    // if (value === "") {
    //   setSearchByName([]);
    // } else {
    //   try {
    //     dispatchBusy({ isBusy: true });

    //     var conf = getConfiguration();
    //     var api = new UserApi(conf);
    //     var data = await api.apiUserGetAllUsersAsyncWitNameGet(value);
    //     var pureData = data.data;
    //     setSearchByName(pureData);

    //     dispatchBusy({ isBusy: false });
    //   } catch (error) {
    //     console.log("error", error);
    //   } finally {
    //     dispatchBusy({ isBusy: false });
    //   }
    // }
  };

  useEffect(() => {
    const fetchUserAppName = async () => {
      try {
        dispatchBusy({ isBusy: true });
        const conf = getConfiguration();
        const api = new TicketApi(conf);
        const data = await api.apiTicketCheckPermGet();

        var splittedName = data.data.name.split(" ");

        let firstName = splittedName[0];
        let lastName = "";

        // ad soyad 2 kelimeden uzunsa bu şekilde bir kontrol
        if (splittedName.length > 1) {
          lastName = splittedName.slice(1).join(" ");
        }
        setFormData({
          ...formData,
          selectedKullaniciId: data.data.id,
          startDate: "",
          endDate: "",
        });
        setSelectedKullanici({
          id: data.data.id,
          firstName: firstName,
          lastName: lastName,
        });

        if (data.data.id) {
          try {
            setTableData([]); // Clear existing data
            const conf = getConfiguration();
            const api = new DashboardsApi(conf);
            const data1 = await api.apiDashboardsCustomerAssignTeamInfoGet(
              data.data.id,
              formatDate(startDate),
              formatDate(endDate)
            );



            const openCloseData = await api.apiDashboardsGetCustomerOpenCloseeGet(
              data.data.id,
              formatDate(startDate),
              formatDate(endDate)
            );

            const openCount = openCloseData.data.filter(item => item.name === "Açık")[0].count;
            const closeCount = openCloseData.data.filter(item => item.name === "Kapalı")[0].count;


            setopenTicketCount(openCount.toString());
            setcloseTicketCount(closeCount.toString());

            console.log("API Response:", data1); // Debug log

            if (data1?.data && data1.data.length > 0) {
              const newTableData = data1.data.map((item) => ({
                Temsilci: item.name,
                "Toplam Talep": item.totalCount,
                "Açık Talep": item.openCount,
                "Birim Testi": item.unitTest,
                "Müşteri Testi": item.customerTest,
              }));
              setTableData(newTableData);
            } else {
              setTableData([
                {
                  Temsilci: "Veri yok",
                  "Toplam Talep": 0,
                  "Açık Talep": 0,
                  "Çözümlü Talep": 0,
                },
              ]);
            }
          } catch (error) {
            dispatchAlert({
              message: "Hata oluştu : " + error,
              type: MessageBoxType.Error,
            });
            setTableData([
              {
                Müşteri: "Hata oluştu",
                "Toplam Talep": 0,
                "Açık Talep": 0,
                "Çözümlü Talep": 0,
              },
            ]);
          }
        } else {
          setTableData([
            {
              Müşteri: "Veri yok",
              "Toplam Talep": 0,
              "Açık Talep": 0,
              "Çözümlü Talep": 0,
            },
          ]);
        }

        if (data.data.id) {
          const conf = getConfiguration();
          const api = new DashboardsApi(conf);
          const data2 = await api.apiDashboardsGetTicketAsyncGet(
            data.data.id,
            formatDate(startDate),
            formatDate(endDate)
          );

          const acikTalep =
            data2.data.sumCount -
            data2.data.closedCount -
            data2.data.draftCount -
            data2.data.canceledCount;

          setTicketCountData({
            sumCount: data2.data.sumCount,
            openCount: data2.data.openCount,
            resolvedCount: data2.data.resolvedCount,
          });
        } else if (!selectedKullanici) {
          setTicketCountData({
            sumCount: 0,
            openCount: 0,
            resolvedCount: 0,
          });
        }
      } catch (error) {
        dispatchAlert({
          message: "Hata oluştu : " + error,
          type: MessageBoxType.Error,
        });
      } finally {
        dispatchBusy({ isBusy: false });
      }
    };

    fetchUserAppName();
  }, []);

  const formatDate = (date: string): string => {
    if (!date) return null;
    return new Date(date).toISOString().split("T")[0];
  };

  const handleSave = async () => {
    try {
      dispatchBusy({ isBusy: true });
      if (!selectedKullanici?.id) {
        return;
      }

      setTableData([]);
      // Format dates to YYYY-MM-DD
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);

      if (selectedKullanici) {
        try {





          setTableData([]); // Clear existing data
          const conf = getConfiguration();
          const api = new DashboardsApi(conf);

          const data = await api.apiDashboardsCustomerAssignTeamInfoGet(
            selectedKullanici?.id,
            formattedStartDate,
            formattedEndDate
          );

          setFormData({
            selectedKullaniciId: selectedKullanici.id,
            startDate: startDate,
            endDate: endDate,
          });



          const openCloseData = await api.apiDashboardsGetCustomerOpenCloseeGet(
            selectedKullanici?.id,
            formattedStartDate,
            formattedEndDate
          );

          const openCount = openCloseData.data.filter(item => item.name === "Açık")[0].count;
          const closeCount = openCloseData.data.filter(item => item.name === "Kapalı")[0].count;

          setopenTicketCount(openCount.toString());
          setcloseTicketCount(closeCount.toString());


          if (data?.data && data.data.length > 0) {
            const newTableData = data.data.map((item) => ({
              Temsilci: item.name,
              "Toplam Talep": item.totalCount,
              "Açık Talep": item.openCount,
              "Birim Testi": item.unitTest,
              "Müşteri Testi": item.customerTest,
            }));
            setTableData(newTableData);
          } else {
            setTableData([
              {
                Temsilci: "Veri yok",
                "Toplam Talep": 0,
                "Açık Talep": 0,
                "Çözümlü Talep": 0,
              },
            ]);
          }

          if (selectedKullanici?.id) {
            const data2 = await api.apiDashboardsGetTicketAsyncGet(
              selectedKullanici?.id,
              formattedStartDate,
              formattedEndDate
            );

            const acikTalep =
              data2.data.sumCount -
              data2.data.closedCount -
              data2.data.draftCount -
              data2.data.canceledCount;

            setTicketCountData({
              sumCount: data2.data.sumCount,
              openCount: acikTalep,
              resolvedCount: data2.data.resolvedCount,
            });
          } else if (!selectedKullanici) {
            setTicketCountData({
              sumCount: 0,
              openCount: 0,
              resolvedCount: 0,
            });
          }
        } catch (error) {
          setTableData([
            {
              Müşteri: "Hata oluştu",
              "Toplam Talep": 0,
              "Açık Talep": 0,
              "Çözümlü Talep": 0,
            },
          ]);
        }
      } else {
        setTableData([]);
      }
    } catch (error) {
      dispatchAlert({
        message: "Hata oluştu : " + error,
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  // Dropdown menu template for the DefaultStatisticsCard
  const renderMenu = (state: any, close: any) => (
    <Menu
      anchorEl={state}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      open={Boolean(state)}
      onClose={close}
      keepMounted
      disableAutoFocusItem
    >
      <MenuItem onClick={close}>Last 7 days</MenuItem>
      <MenuItem onClick={close}>Last week</MenuItem>
      <MenuItem onClick={close}>Last 30 days</MenuItem>
    </Menu>
  );

  const navigateToCustomerStatistics = () => {
    navigate("/tickets/statistic");
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <b>Talep Açma İstatistikleri</b>
      <MDBox py={3}>
        <MDBox mb={3}>
          <Card
            sx={{
              p: 3,
              mb: 3,
              boxShadow: "0 2px 12px 0 rgba(0,0,0,0.1)",
              borderRadius: "12px",
            }}
          >
            <Grid container spacing={3} alignItems="center">
              {/* User Search */}
              <Grid item xs={12} md={5}>
                <Autocomplete
                  disabled={true}
                  key={selectedKullanici?.id}
                  options={searchByName}
                  getOptionLabel={(option: UserAppDto) => {
                    if (typeof option === "string") return option;
                    return option?.firstName && option?.lastName
                      ? `${option.firstName} ${option.lastName}`
                      : "";
                  }}
                  value={selectedKullanici}
                  isOptionEqualToValue={(option: UserAppDto, value: UserAppDto) =>
                    option?.id === value?.id
                  }
                  onChange={(event, newValues: UserAppDto) => {
                    if (!newValues) {
                      setSelectedKullanici(null);
                      setSelectionKullaniciId(null);
                      setNamesOfSelected("");
                      return;
                    }
                    setSelectedKullanici(newValues);
                    setSelectionKullaniciId(newValues.id);
                    setNamesOfSelected(`${newValues.firstName} ${newValues.lastName}`);
                  }}
                  onInputChange={(event, newInputValue) => {
                    handleSearchByName(newInputValue);
                  }}
                  renderInput={(params) => (
                    <MDInput
                      {...params}
                      label="Kullanıcı Ara"
                      placeholder="İsim ile arama yapın..."
                      InputLabelProps={{
                        shrink: true,
                        sx: {
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          color: "text.primary",
                          mb: 0.5,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                          borderRadius: "8px",
                          transition: "all 0.2s ease",
                          "& fieldset": {
                            borderWidth: "1px",
                            borderColor: "rgba(0, 0, 0, 0.1)",
                          },
                          "& input": {
                            color: "text.disabled",
                            cursor: "not-allowed",
                            WebkitTextFillColor: "rgba(0, 0, 0, 0.38)",
                            "&::placeholder": {
                              color: "rgba(0, 0, 0, 0.38)",
                              opacity: 1,
                            },
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(0, 0, 0, 0.1) !important",
                            borderWidth: "1px",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "rgba(0, 0, 0, 0.1) !important",
                            borderWidth: "1px",
                          },
                          "&.Mui-disabled": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                            "& fieldset": {
                              borderColor: "rgba(0, 0, 0, 0.1) !important",
                            },
                          },
                        },
                        "&.Mui-disabled": {
                          opacity: 0.7,
                          cursor: "not-allowed",
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      <MDBox
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 1.5,
                          borderRadius: "8px",
                          mx: 1,
                          my: 0.5,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.04)",
                            transform: "translateX(4px)",
                          },
                        }}
                      >
                        <MDAvatar
                          src={`data:image/png;base64,${option.photo}`}
                          alt={option.firstName}
                          sx={{
                            width: 40,
                            height: 40,
                            border: "2px solid",
                            borderColor: "background.paper",
                          }}
                        />
                        <MDBox>
                          <MDTypography variant="button" fontWeight="medium">
                            {option.firstName} {option.lastName}
                          </MDTypography>
                          <MDTypography variant="caption" color="text.secondary" display="block">
                            {option.email}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    </li>
                  )}
                />
              </Grid>

              {/* Date Range */}
              <Grid item xs={12} md={5}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <MDInput
                      type="date"
                      label="Başlangıç Tarihi"
                      value={startDate}
                      onChange={(e: any) => setStartDate(e.target.value)}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                        sx: {
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          color: "text.primary",
                          mb: 0.5,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: "background.paper",
                          transition: "all 0.2s ease",
                          "& fieldset": {
                            borderWidth: "1px",
                            borderColor: "rgba(0,0,0,0.1)",
                          },
                          "&:hover fieldset": {
                            borderColor: "primary.main",
                            borderWidth: "1px",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "primary.main",
                            borderWidth: "2px",
                          },
                        },
                        "& input": {
                          py: 1.5,
                          cursor: "pointer",
                        },
                      }}
                      inputProps={{
                        min: "2000-01-01",
                        max: endDate || "2099-12-31",
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <MDInput
                      type="date"
                      label="Bitiş Tarihi"
                      value={endDate}
                      onChange={(e: any) => setEndDate(e.target.value)}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                        sx: {
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          color: "text.primary",
                          mb: 0.5,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: "background.paper",
                          transition: "all 0.2s ease",
                          "& fieldset": {
                            borderWidth: "1px",
                            borderColor: "rgba(0,0,0,0.1)",
                          },
                          "&:hover fieldset": {
                            borderColor: "primary.main",
                            borderWidth: "1px",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "primary.main",
                            borderWidth: "2px",
                          },
                        },
                        "& input": {
                          py: 1.5,
                          cursor: "pointer",
                        },
                      }}
                      inputProps={{
                        min: startDate || "2000-01-01",
                        max: "2099-12-31",
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Search Button */}
              <Grid item xs={12} md={2} display="flex" gap={2}>
                <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  onClick={handleSave}
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    transition: "all 0.2s ease",
                    backgroundColor: "primary.main",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 20px -6px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <Icon>search</Icon>
                  Görüntüle
                </MDButton>
                <MDButton
                  variant="gradient"
                  color="primary"
                  fullWidth
                  onClick={navigateToCustomerStatistics}
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    transition: "all 0.2s ease",
                    backgroundColor: "success.main",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 20px -6px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <Icon>arrow_backward</Icon>
                  Çözümleme İstatistikleri
                </MDButton>
              </Grid>
            </Grid>
          </Card>
          {namesOfSelected && (
            <MDBox mb={3} p={3} pl={1}>
              <MDTypography variant="h4" color="dark">
                {namesOfSelected} Adlı Kişiye Ait Talep İstatistikleri
              </MDTypography>
            </MDBox>
          )}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <MDBox display="flex" flexDirection="column" justifyContent="space-between">
                <DefaultStatisticsCard
                  title="Toplam Talep"
                  count={ticketCountData.sumCount ? ticketCountData.sumCount : 0}
                  percentage={{
                    color: "success",
                    value: ticketCountData.sumCount ? ticketCountData.sumCount : 0,
                    label: "adet toplam talep",
                  }}
                  dropdown={{
                    action: openSalesDropdown,
                    menu: renderMenu(salesDropdown, closeSalesDropdown),
                    value: salesDropdownValue,
                  }}
                />
                <MDBox sx={{ marginTop: "20px" }}>
                  <ChannelsChart
                    id={formData.selectedKullaniciId}
                    startDate={formatDate(formData.startDate)}
                    endDate={formatDate(formData.endDate)}
                  />

                </MDBox>
              </MDBox>
            </Grid>
            <Grid item xs={12} sm={4}>
              <MDBox display="flex" flexDirection="column" justifyContent="space-between">
                <DefaultStatisticsCard
                  title="Açık / Kapalı Talep Durumu"
                  count={`${openTicketCount || 0} / ${closeTicketCount || 0}`}
                  percentage={{
                    color: "success",
                    value: `${openTicketCount} Açık / ${closeTicketCount} Kapalı`,
                    label: "Toplam talepler",
                  }}

                />
                <MDBox sx={{ marginTop: "20px" }}>
                  <TotalChart
                    id={formData.selectedKullaniciId}
                    isAllData={true}
                    startDate={formatDate(formData.startDate)}
                    endDate={formatDate(formData.endDate)}
                  />
                </MDBox>
              </MDBox>

            </Grid>
            <Grid item xs={12} sm={4}>
              {/* <DefaultStatisticsCard
                title="Çözümlü Talep"
                count={ticketCountData.resolvedCount? ticketCountData.resolvedCount : 0}
                percentage={{
                  color: "success",
                  value: ticketCountData.resolvedCount? ticketCountData.resolvedCount : 0,
                  label: "adet çözümlenen talep",
                }}
                dropdown={{
                  action: openRevenueDropdown,
                  menu: renderMenu(revenueDropdown, closeRevenueDropdown),
                  value: revenueDropdownValue,
                }}
              /> */}
              <SalesTable title="Taleplerimin Durumları" rows={tableData} />
            </Grid>
          </Grid>

        </MDBox>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            {/* <Grid item xs={12} sm={6} lg={4}>
              <ChannelsChart id={selectedKullanici?.id} />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <ChannelsChart id={selectedKullanici?.id} isAllData={true} />
            </Grid>  */}

            {/* <Grid item xs={12} sm={6} lg={4}>
              <ChannelsChart id={selectedKullanici?.id} />
            </Grid> */}
            {/* <Grid item xs={12} sm={6} lg={8}>
              <DefaultLineChart
                title="Revenue"
                description={
                  <MDBox display="flex" justifyContent="space-between">
                    <MDBox display="flex" ml={-1}>
                      <MDBadgeDot color="info" size="sm" badgeContent="Facebook Ads" />
                      <MDBadgeDot color="dark" size="sm" badgeContent="Google Ads" />
                    </MDBox>
                    <MDBox mt={-4} mr={-1} position="absolute" right="1.5rem">
                      <Tooltip title="See which ads perform better" placement="left" arrow>
                        <MDButton
                          variant="outlined"
                          color="secondary"
                          size="small"
                          circular
                          iconOnly
                        >
                          <Icon>priority_high</Icon>
                        </MDButton>
                      </Tooltip>
                    </MDBox>
                  </MDBox>
                }
                chart={defaultLineChartData}
              />
            </Grid> */}
          </Grid>
        </MDBox>
        {/* <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <HorizontalBarChart title="Sales by age" chart={horizontalBarChartData} />
            </Grid>
            <Grid item xs={12} lg={4}>
              <SalesTable title="Sales by Country" rows={salesTableData} />
            </Grid>
          </Grid>
        </MDBox> */}
        {/* <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox pt={3} px={3}>
                <MDTypography variant="h6" fontWeight="medium">
                  Top Selling Products
                </MDTypography>
              </MDBox>
              <MDBox py={1}>
                <DataTable
                  table={dataTableData}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  isSorted={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid> */}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default CustomerSales;
