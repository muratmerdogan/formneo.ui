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
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import BookingCard from "examples/Cards/BookingCard";

// Anaytics dashboard components
import SalesByCountry from "layouts/dashboards/analytics/components/SalesByCountry";

// Data
import reportsBarChartData from "layouts/dashboards/analytics/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboards/analytics/data/reportsLineChartData";

// Images
import booking1 from "assets/images/products/product-1-min.jpg";
import booking2 from "assets/images/products/product-2-min.jpg";
import booking3 from "assets/images/products/product-3-min.jpg";
import { ComboBox, ComboBoxDomRef, ComboBoxItem, MultiComboBox, MultiComboBoxItem, Select, Ui5CustomEvent } from "@ui5/webcomponents-react";
import { useEffect, useState } from "react";
import { CustomerListDto, EmployeeDto, ProjectListDto, SAPReportsApi } from "api/generated";
import getConfiguration from "confiuration";
import ReportsLineChart from "../LineCharts/ReportsLineChart"
import ReportsBarChart from "../BarCharts/ReportsBarChart";
import { ComboBoxSelectionChangeEventDetail } from "@ui5/webcomponents/dist/ComboBox";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { da } from "date-fns/locale";
import ChannelsChart from "../ChannelChart";
import select from "assets/theme/components/form/select";

class SelectedEmployee {
  personelName: string;
  charts: {
    labels: string[];  // Aylar
    datasets: {
      label: string;
      data: number[];  // Satış verileri
    };
  };
  average: number;
  photo: string;
  customerText: string;
  employeeText: string;
  persId: string;


}
function ActivityReports(): JSX.Element {
  const { sales, tasks } = reportsLineChartData;
  const dispatchBusy = useBusy()

  const [globalselectedItems, setglobalselectedItems] = useState([]); // Seçili değerleri saklamak için state

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: { label: "", data: [] },
  });
  const [projectChartData, setChartProjectData] = useState({
    labels: [],
    datasets: { label: "", data: [] },
  });
  const [EmployeeChartData, setEmployeeChartData] = useState({
    labels: [],
    datasets: { label: "", data: [] },
  });



  type ChartData = {
    labels: string[];  // Aylar
    datasets: {
      label: string;
      data: number[];  // Satış verileri
    };
  };


  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedCustomerText, setselectedCustomerText] = useState<string | null>(null);
  const [selectedEmployeeId, setselectedEmployeeId] = useState<string | null>(null);
  const [selectedEmployeeText, setselectedEmployeeText] = useState<string | null>(null);
  const [selectedProjectText, setselectedProjectText] = useState<string | null>(null);
  const [EmployeePhoto, setEmployeePhoto] = useState<string | null>(null);
  const [last12, setlast12] = useState<any>(null);

  const [customers, setCustomers] = useState<CustomerListDto[]>([]);
  const [employees, setemployees] = useState<EmployeeDto[]>([]);
  const [projectList, setProjectList] = useState<ProjectListDto[]>([]);


  const [customerAvg, setcustomerAvg] = useState<string | null>(null);
  const [projectAvg, setprojectAvg] = useState<string | null>(null);
  const [employeeAvg, setemployeeAvg] = useState<string | null>(null);


  const [selectedEmployees, setSelectedEmployees] = useState<SelectedEmployee[]>([]);

  var SelectedEmployeeConst: SelectedEmployee[] = [];
  useEffect(() => {
    const fetchCustomers = async () => {
      try {

        var conf = getConfiguration();
        var api = new SAPReportsApi(conf);
        const response = await api.apiSAPReportsGetCustomerListGet();

        response.data.unshift({ cusid: -99, custx: "Tüm" });
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    const fetchEmployee = async () => {
      try {

        var conf = getConfiguration();
        var api = new SAPReportsApi(conf);
        const response = await api.apiSAPReportsGetEmployeeListGet();

        setemployees(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };



    fetchCustomers();
    fetchEmployee();
  }, []);

  const handleChange = (event: Ui5CustomEvent<ComboBoxDomRef, ComboBoxSelectionChangeEventDetail>) => {

    const selectedItem = event.detail?.item; // Seçilen öğe
    const selectedKey = selectedItem?.getAttribute("data-key"); // data-key değerini alıyoruz


    setProjectList([]);
    console.log(selectedKey);
    setSelectedCustomer(selectedKey);
    setselectedCustomerText(selectedItem.text)

    fetchSelectedCustomer(selectedKey);

    fetchProjectByCustomer(selectedKey);


    if (selectedEmployeeId != null) {
      fetchSelectedEmployee(selectedKey, selectedEmployeeId);
    }


    handleSelectionChange(null, selectedKey, selectedItem.text);
  };
  const handleProjectChange = (event: Ui5CustomEvent<ComboBoxDomRef, ComboBoxSelectionChangeEventDetail>) => {

    const selectedItem = event.detail?.item; // Seçilen öğe
    const selectedKey = selectedItem?.getAttribute("data-key"); // data-key değerini alıyoruz

    setselectedProjectText(selectedItem.text);
    fetchSelectedProject(selectedCustomer, selectedKey);
  };

  const handleEmployeeChange = (event: Ui5CustomEvent<ComboBoxDomRef, ComboBoxSelectionChangeEventDetail>) => {

    const selectedItem = event.detail?.item; // Seçilen öğe
    const selectedKey = selectedItem?.getAttribute("data-key"); // data-key değerini alıyoruz

    setselectedEmployeeId(selectedKey);
    setselectedEmployeeText(selectedItem.text);

    fetchSelectedEmployee(selectedCustomer, selectedKey);

    fetchEmployeePhoto(selectedKey);
  };


  const fetchEmployeePhoto = async (id: any) => {

    var conf = getConfiguration();
    var api = new SAPReportsApi(conf);

    var photo = await api.apiSAPReportsGetEmployeePictureAsBase64ByUserGet(id);

    setEmployeePhoto(photo.data);
  }


  const fetchProjectByCustomer = async (id: any) => {
    var conf = getConfiguration();
    var api = new SAPReportsApi(conf);
    var project = await api.apiSAPReportsGetProjectListGet(id);
    setProjectList(project.data);


  }
  const fetchSelectedCustomer = async (id: any) => {


    dispatchBusy({ isBusy: true });

    setChartData({
      labels: [],
      datasets: { label: "", data: [] },
    });
    var conf = getConfiguration();
    var api = new SAPReportsApi(conf);
    var data = await api.apiSAPReportsCustomerLast12MonthInvoiceListPost(id);


    setcustomerAvg(null);

    setChartData({
      labels: data.data.map((item: any) => item.month.slice(0, 3)).reverse(), // A
      datasets: {
        label: "Aktivite",
        data: data.data.map((item: any) => item.act).reverse(),
      },
    });


    const totalAct = data.data.reduce((sum: number, item: any) => sum + item.act, 0);
    const averageAct = totalAct / data.data.length;

    setcustomerAvg(averageAct.toFixed(2));

    dispatchBusy({ isBusy: false });
  }


  const fetchSelectedProject = async (id: any, projectId: any = null) => {

    dispatchBusy({ isBusy: true });
    var conf = getConfiguration();
    var api = new SAPReportsApi(conf);
    var data = await api.apiSAPReportsProjectLast12MonthInvoicePost(projectId, id);

    setChartProjectData({
      labels: data.data.map((item: any) => item.month.slice(0, 3)).reverse(), // A
      datasets: {
        label: "Aktivite",
        data: data.data.map((item: any) => item.act).reverse(),
      },
    });



    const totalAct = data.data.reduce((sum: number, item: any) => sum + item.act, 0);
    const averageAct = totalAct / data.data.length;

    setprojectAvg(averageAct.toFixed(2));


    dispatchBusy({ isBusy: false });
  }

  const fetchSelectedEmployee = async (customerId: any = null, employeeId: any) => {



    if (customerId == null) {
      customerId = "";
    }

    dispatchBusy({ isBusy: true });
    var conf = getConfiguration();
    var api = new SAPReportsApi(conf);
    var data = await api.apiSAPReportsEmoloyeeLast12MonthInvoiceListPost(customerId, employeeId);


    setEmployeeChartData({
      labels: data.data.map((item: any) => item.month.slice(0, 3)).reverse(), // A
      datasets: {
        label: "Aktivite",
        data: data.data.map((item: any) => item.act).reverse(),
      },
    });



    const totalAct = data.data.reduce((sum: number, item: any) => sum + item.act, 0);
    const averageAct = totalAct / data.data.length;

    setemployeeAvg(averageAct.toFixed(2));

    dispatchBusy({ isBusy: false });
  }


  const handleSelectionChange = (event: any, paramCustomerId: any = null, paramCustomerText: any = null) => {

    var localselectedItems: any = [];
    if (event != null) {
      const selectedItems = event.detail.items;

      var selectedNames = selectedItems.map((item: any) => item.text); // Seçilenlerin text değerlerini al
      const selectedKey = selectedItems.map((item: any) => item.key); // Seçilenlerin text değerlerini al
      var selectedKeys = selectedItems.map((item: any) => {
        return {
          key: item.dataset.key,
          text: item.text,
        };
      });
      const removedItems = selectedItems.filter((key: any) => !selectedKeys.includes(key));

      localselectedItems = selectedKeys;
      setglobalselectedItems(selectedKeys);
    }
    else {

      localselectedItems = globalselectedItems;
    }


    let i = 0;
    SelectedEmployeeConst.pop();
    setSelectedEmployees([]);

    localselectedItems.forEach(async (item: { key: any; text: string }, index: number) => {

      if (!SelectedEmployeeConst.some(e => e.persId === item.key)) {


        var conf = getConfiguration();
        var api = new SAPReportsApi(conf);
        dispatchBusy({ isBusy: true });



        // if (selectedCustomer == "-99")
        //   paramCustomerId = "";


        var data = await api.apiSAPReportsEmoloyeeLast12MonthInvoiceListPost(paramCustomerId == null ? selectedCustomer : paramCustomerId, item.key);

        dispatchBusy({ isBusy: false });
        var charttData = {
          labels: data.data.map((item: any) => item.month.slice(0, 3)).reverse(), // A
          datasets: {
            label: "Aktivite",
            data: data.data.map((item: any) => item.act).reverse(),
          },
        };

        var photo = await api.apiSAPReportsGetEmployeePictureAsBase64ByUserGet(item.key);

        const totalAct = data.data.reduce((sum: number, item: any) => sum + item.act, 0);
        const averageAct = totalAct / data.data.length;

        let resItem: SelectedEmployee;
        resItem = new SelectedEmployee();
        resItem.average = averageAct;
        resItem.charts = charttData;
        resItem.employeeText = item.text;
        resItem.persId = item.key;
        resItem.customerText = paramCustomerText == null ? selectedCustomerText : paramCustomerText;
        resItem.photo = photo.data;
        SelectedEmployeeConst.push(resItem)
        setSelectedEmployees((prev) => {
          // Önceki öğelerde `persId`'sine göre kontrol et
          const isAlreadySelected = prev.some((e) => e.persId === resItem.persId);

          // Eğer daha önce eklenmemişse, yeni öğeyi ekleyin
          if (!isAlreadySelected) {
            return [...prev, resItem];
          } else {
            // Zaten eklenmişse, mevcut öğe ile devam edin
            return prev;
          }
        });

      }
      i = i + 1;
    });

    // alert(selectedNames);
  };


  // Action buttons for the BookingCard
  const actionButtons = (
    <>
      <Tooltip title="Refresh" placement="bottom">
        <MDTypography
          variant="body1"
          color="primary"
          lineHeight={1}
          sx={{ cursor: "pointer", mx: 3 }}
        >
          <Icon color="inherit">refresh</Icon>
        </MDTypography>
      </Tooltip>
      <Tooltip title="Edit" placement="bottom">
        <MDTypography variant="body1" color="info" lineHeight={1} sx={{ cursor: "pointer", mx: 3 }}>
          <Icon color="inherit">edit</Icon>
        </MDTypography>
      </Tooltip>
    </>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />


      <MDBox py={3}>


        <Grid container spacing={1}>
          <Grid item xs={12} >
            <Grid container spacing={1}>
              <Grid item xs sm={2} md={4} lg={2} xl={2}>
                <h5>Müşteri</h5>
                <ComboBox onSelectionChange={handleChange}>
                  {customers.map((customer) => (
                    <ComboBoxItem
                      data-key={customer.cusid} // Özel data-key özelliği ekleniyor
                      key={customer.cusid}
                      text={customer.custx}
                    />
                  ))}
                </ComboBox>


              </Grid>

              {/* <Grid item xs={2}>
                <h5>Proje</h5>
                <ComboBox onSelectionChange={handleProjectChange}>
                  {projectList.map((customer) => (
                    <ComboBoxItem
                      data-key={customer.vprid} // Özel data-key özelliği ekleniyor
                      key={customer.vprid}
                      text={customer.vprtx}
                    />
                  ))}
                </ComboBox>
              </Grid> */}

              <Grid item xs sm={2} md={4} lg={2} xl={2}>
                <h5>Personel</h5>
                {/* <ComboBox onSelectionChange={handleEmployeeChange}>
                  {employees.map((customer) => (
                    <ComboBoxItem
                      data-key={customer.pernr} // Özel data-key özelliği ekleniyor
                      key={customer.pernr}
                      text={customer.ename}

                    />
                  ))}
                </ComboBox> */}

                <MultiComboBox

                  onChange={function Ki() { }}
                  onClose={function Ki() { }}
                  onInput={function Ki() { }}
                  onOpen={function Ki() { }}
                  onSelectionChange={handleSelectionChange}
                  valueState="None"
                >
                  {employees.map((customer) => (
                    <MultiComboBoxItem data-key={customer.pernr} key={customer.pernr} text={customer.ename} />
                  ))}

                </MultiComboBox>
              </Grid>
              <Grid item xs={2}>
                {EmployeePhoto != undefined ? <img style={{ marginBottom: "10px", width: 100, height: 100 }} alt="Employee Photo" src={EmployeePhoto ? `data:image/png;base64,${EmployeePhoto}` : null} /> : null}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox style={{ marginTop: "0px" }} py={3}>
        <h3>Yıllık Gösterimler</h3>Müşteri
        <MDBox mt={6} >

          <Grid style={{ marginLeft: "10px" }} container spacing={3}>
            <Grid item xs sm={6} md={4} lg={4} xl={4} mt={2} >
              {chartData != null ? (
                <MDBox mb={3}>
                  <ReportsLineChart
                    color="success"
                    title={`${selectedCustomerText} Yıllık Aktivite`}
                    description={
                      <>
                        Veri Ortalaması {customerAvg}
                      </>
                    }
                    date=""
                    chart={chartData}
                  />
                </MDBox>
              ) : (
                <p>Yükleniyor...</p>
              )}
            </Grid>


            <Grid container spacing={2} style={{ marginLeft: "-16px" }}>
              {selectedEmployees.map((item, index) => (
                <Grid
                  style={{ marginTop: "20px" }}

                  item xs={12} sm={6} md={4} lg={4} xl={4}
                  key={index}
                >
                  <MDBox mb={3} mt={3}>
                    <ReportsLineChart
                      color="dark"
                      title={`${item.customerText} ${item.employeeText} Yıllık Aktivite`}
                      description={
                        <span
                          style={{
                            color: item.average < 20 ? "red" : "inherit", // Koşullu renk
                          }}
                        >
                          Veri Ortalaması {item.average.toFixed(2)}
                        </span>
                      }
                      date="just updated"
                      chart={item.charts}
                      photo={item.photo}
                    />
                  </MDBox>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </MDBox>


      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ActivityReports;














// <MDBox mt={1.5}>

// <Grid item xs={2}>
//   <h5>Tarih Aralığı</h5>
//   <ComboBox onSelectionChange={handleChange}>
//     {customers.map((customer) => (
//       <ComboBoxItem
//         data-key={customer.cusid} // Özel data-key özelliği ekleniyor
//         key={customer.cusid}
//         text={customer.custx}
//       />
//     ))}
//   </ComboBox>
// </Grid>
// <Grid container spacing={3}>
//   <Grid item xs={12} md={6} lg={3}>
//     <MDBox mb={1.5}>
//       <ChannelsChart />
//     </MDBox>
//   </Grid>
//   <Grid item xs={12} md={6} lg={3}>
//     <MDBox mb={1.5}>
//       <ChannelsChart />
//     </MDBox>
//   </Grid>
//   <Grid item xs={12} md={6} lg={3}>
//     <MDBox mb={1.5}>
//       <ChannelsChart />
//     </MDBox>
//   </Grid>
//   <Grid item xs={12} md={6} lg={3}>
//     <MDBox mb={1.5}>
//       {/* <ComplexStatisticsCard
//         color="primary"
//         icon="person_add"
//         title="Followers"
//         count="+91"
//         percentage={{
//           color: "success",
//           amount: "",
//           label: "Just updated",
//         }}
//       /> */}
//     </MDBox>
//   </Grid>
// </Grid>
// </MDBox>
