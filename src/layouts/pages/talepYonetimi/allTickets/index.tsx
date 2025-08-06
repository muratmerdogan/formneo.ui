import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Autocomplete,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Icon,
  Menu,
  Paper,
  Popover,
  Popper,
  Tooltip,
  Typography,
} from "@mui/material";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";
import NameCell from "./tableData/nameCell";
import GlobalCell from "./tableData/globalCell";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import {
  MessageBox,
  MessageBoxAction,
  MessageBoxType,
  ObjectPage,
  ObjectPageHeader,
  ObjectPageTitle,
  Toolbar,
  ToolbarButton,
} from "@ui5/webcomponents-react";
import Footer from "examples/Footer";
import getConfiguration from "confiuration";
import { TicketApi, TicketAssigneListDto } from "api/generated/api";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { useAlert } from "layouts/pages/hooks/useAlert";
import FilterTableMethod from "../components";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import HistoryDialog from "components/HistoryDialog/HistoryDialog";
import ShowHistory from "layouts/pages/WorkFlow/ShowHistory";
import "../solveAllTicket/index.css";
import ReactPaginate from "react-paginate";
import TicketGraphic from "../components/Graphics";
import { TabMenu } from "primereact/tabmenu";
import { useTranslation } from "react-i18next";

interface AllTicketsProps {
  isSolveAllTicket?: boolean;
}

function AllTickets({ isSolveAllTicket }: AllTicketsProps) {
  const navigate = useNavigate();
  const [ticketRowData, setTicketRowData] = useState<any[]>([]);
  const [isRefresh, setisRefresh] = useState<boolean>(false);
  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();
  const [pageCount, setPageCount] = useState(0);
  var [itemOffset, setItemOffset] = useState(0);
  var [totalListCount, settotalListCount] = useState(0);
  // const itemsPerPage = 7;
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const endOffset = Math.min(itemOffset + itemsPerPage, ticketRowData.length);
  const [filters, setFilters] = useState({
    assignee: "",
    creator: "",
    department: "",
    company: "",
    startDate: "",
    endDate: "",
  });
  const [uniqueAssignee, setUniqueAssignee] = useState<string[]>([]);
  const [uniqueCreator, setUniqueCreator] = useState<string[]>([]);
  const [uniqueDepartments, setUniqueDepartments] = useState<string[]>([]);
  const [uniqueCompanies, setUniqueCompanies] = useState<string[]>([]);

  const [selectedTicket, setselectedTicket] = useState<any>(null);
  const [historyDialogOpen, sethistoryDialogOpen] = useState<boolean>(false);
  const [msgOpen, setmsgOpen] = useState(false);

  const [selectedAprHis, setselectedAprHis] = useState<any>(null);
  const [aprHistoryOpen, setaprHistoryOpen] = useState(false);

  const { t } = useTranslation();

  const [activeIndex, setActiveIndex] = useState(0);
  const items = [
    { label: t("ns1:TicketPage.TicketTablePage.Talepler"), icon: "pi pi-check" },
    { label: t("ns1:TicketPage.TicketTablePage.Grafik"), icon: "pi pi-chart-line" }
  ].filter(Boolean);
  const [createGraph, setCreateGraph] = useState<boolean>(false);
  const [graphicData, setgraphicData] = useState<any[]>([]);


  const fetchTicketData = async () => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new TicketApi(conf);
      var data = await api.apiTicketGet();
      setTicketRowData(data.data as any);
    } catch (error) {
      dispatchAlert({
        message: "Hata oluştu" + error,
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  useEffect(() => {
    // fetchTicketData();
  }, []);

  useEffect(() => {
    setisRefresh(true);
  }, [itemsPerPage]);

  const column = [
    {
      accessor: "actions",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>{t("ns1:TicketPage.TicketTablePage.TableColumnProps.Islemler")}</div>,
      Cell: ({ row }: any) => (
        <MDBox mx={0}>
          <Tooltip title={t("ns1:TicketPage.TicketTablePage.OnayGecmisi")}>
            <Icon
              style={{ marginRight: "8px", cursor: "pointer" }}
              onClick={() => {
                setselectedAprHis(row.original.workFlowHeadId);
                setaprHistoryOpen(true);
              }}
            >
              history
            </Icon>
          </Tooltip>

          <Tooltip title={t("ns1:TicketPage.TicketTablePage.TalepGecmisi")}>
            <Icon
              style={{ marginRight: "8px", cursor: "pointer" }}
              onClick={() => {
                setselectedTicket(row.original.id);
                sethistoryDialogOpen(true);
              }}
            >
              personSearch
            </Icon>
          </Tooltip>

          {/* <Tooltip title={t("ns1:TicketPage.TicketTablePage.TalebiDuzenle")}>
            <Icon
              style={{ marginRight: "8px", cursor: "pointer" }}
              onClick={() => {
                // isSolveAllTicket
                //   ? navigate(`/tickets/solveTicket/${row.original.id}`)
                //   : navigate(`/tickets/detail/${row.original.id}`);
                isSolveAllTicket
                  ? navigate("/solveAllTicket/solveTicket", {
                    state: { ticketId: row.original.id },
                  })
                  : navigate("/tickets/detail/", {
                    state: { ticketId: row.original.id },
                  });
              }}
            >
              edit
            </Icon>
          </Tooltip> */}
          <Tooltip title={t("ns1:TicketPage.TicketTablePage.TalebiDuzenle")}>
  <Icon
    style={{ marginRight: "8px", cursor: "pointer" }}
    onClick={() => {
      const ticketId = row.original.id;
      sessionStorage.setItem("ticketId", ticketId);
      const url = isSolveAllTicket
        ? `/solveAllTicket/solveTicket`
        : `/tickets/detail`;

      window.open(url, "_blank");
    }}
  >
    edit
  </Icon>
</Tooltip>

          
          <Tooltip title={t("ns1:TicketPage.TicketTablePage.Incele")}>
            <Icon
              style={{ marginRight: "8px", cursor: "pointer" }}
              onClick={() => {
                sessionStorage.setItem("ticketId", row.original.id);
                // isSolveAllTicket
                //   ? navigate(`/tickets/solveTicket/${row.original.id}`)
                //   : navigate(`/tickets/detail/${row.original.id}`);
                isSolveAllTicket
                  ? 
                  navigate("/solveAllTicket/solveTicket", {
                    state: { ticketId: row.original.id, review: true },
                  })
                  : navigate("/tickets/detail/", {
                    state: { ticketId: row.original.id, review: true },
                  });
              }}
            >
              visibility
            </Icon>
          </Tooltip>

          {row.original.status === 1 && (
            <Tooltip title={t("ns1:TicketPage.TicketTablePage.TalebiSil")}>
              <Icon
                style={{ marginRight: "0px", cursor: "pointer" }}
                // onClick={() => handleDelete(row.original.id)}
                onClick={() => {
                  setselectedTicket(row.original.id);
                  setmsgOpen(true);
                }}
              >
                delete
              </Icon>
            </Tooltip>
          )}
        </MDBox>
      ),
    },
    {
      accessor: "ticketNumber",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>{t("ns1:TicketPage.TicketTablePage.TableColumnProps.TalepNo")}</div>,
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      accessor: "statusText",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>{t("ns1:TicketPage.TicketTablePage.TableColumnProps.Durum")}</div>,
      Cell: ({ row, value, column }: any) => (
        <GlobalCell
          value={value}
          statusId={row.original.status}
          columnName={column.id}
          testRow={row.original}
        />
      ),
    },
    {
      accessor: "title",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>{t("ns1:TicketPage.TicketTablePage.TableColumnProps.Baslik")}</div>,
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      accessor: "customerRefName",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>{t("ns1:TicketPage.TicketTablePage.TableColumnProps.Musteri")}</div>,
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      accessor: "ticketAssigneText",
      Header: (
        <MDBox style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:TicketPage.TicketTablePage.TableColumnProps.Atanan")}
        </MDBox>
      ),
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      accessor: "userAppName",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>{t("ns1:TicketPage.TicketTablePage.TableColumnProps.Olusturan")}</div>,
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      accessor: "createdDate",
      Header: <MDBox style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>{t("ns1:TicketPage.TicketTablePage.TableColumnProps.Tarih")}</MDBox>,
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      accessor: "ticketDepartmentText",
      Header: (
        <MDBox style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>{t("ns1:TicketPage.TicketTablePage.TableColumnProps.Departman")}</MDBox>
      ),
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
     {
          accessor: "ticketprojectName",
          Header: (
            <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
              Proje
            </div>
          ),
          Cell: ({ row, value, column }: any) => (
            <GlobalCell value={value} columnName={column.id} testRow={row.original} />
          ),
        },
    // {
    //   accessor: "workCompanyName",
    //   Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>ŞİRKET</div>,
    //   Cell: ({ row, value, column }: any) => (
    //     <GlobalCell value={value} columnName={column.id} testRow={row.original} />
    //   ),
    // },
    // {
    //   accessor: "typeText",
    //   Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>TİP</div>,
    //   Cell: ({ row, value, column }: any) => (
    //     <GlobalCell value={value} columnName={column.id} testRow={row.original} />
    //   ),
    // },


  ];

  // useEffect(() => {
  //   setPageCount(Math.ceil(ticketRowData.length / itemsPerPage));
  // }, [ticketRowData]);

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % totalListCount;
    setItemOffset(newOffset);
    itemOffset = newOffset;

    setisRefresh(true);
  };

  const handleDelete = async (id: string) => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new TicketApi(conf);
      await api.apiTicketIdDelete(id);
      // fetchTicketData();
      setisRefresh(true);
      dispatchAlert({ message: "Talep başarıyla silindi", type: MessageBoxType.Success });
    } catch (error: any) {
      dispatchAlert({
        message: "Hata : " + error.response.data.errors,
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  useEffect(() => {
    if (ticketRowData.length > 0) {
      const departments = [
        ...new Set(ticketRowData.map((ticket: any) => ticket.ticketDepartmentText)),
      ];
      const companies = [...new Set(ticketRowData.map((ticket: any) => ticket.workCompanyName))];
      const creators = [...new Set(ticketRowData.map((ticket: any) => ticket.userAppName))];
      const assignees = [...new Set(ticketRowData.map((ticket: any) => ticket.ticketAssigneText))];
      setUniqueDepartments(departments);
      setUniqueCompanies(companies);
      setUniqueCreator(creators);
      setUniqueAssignee(assignees);
    }
  }, [ticketRowData]);

  // const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  //   setFilters((prev) => ({ ...prev, [name]: value }));

  //   const filtered = ticketRowData.filter((ticket: any) => {
  //     const ticketDate = new Date(ticket.createdDate);
  //     const matchesStartDate = !filters.startDate || ticketDate >= new Date(filters.startDate);
  //     const matchesEndDate = !filters.endDate || ticketDate <= new Date(filters.endDate);

  //     return (
  //       (!filters.department || ticket.ticketDepartmentText === filters.department) &&
  //       (!filters.company || ticket.workCompanyName === filters.company) &&
  //       (!filters.creator || ticket.userAppName === filters.creator) &&
  //       (!filters.assignee || ticket.ticketAssigneText === filters.assignee) &&
  //       matchesStartDate &&
  //       matchesEndDate
  //     );
  //   });

  //   setTicketRowData(filtered as any);
  // };

  async function filterethod(event: any) {
    console.log(event);
    // alert("filterethod")
    setTicketRowData(event);
  }

  async function handleMsgDialog(event: any) {
    setmsgOpen(false);
    if (event === MessageBoxAction.Yes) {
      handleDelete(selectedTicket);
    } else {
      return;
    }
  }
const clearSession = () => {
  sessionStorage.removeItem('ticketId');
  console.log('Session temizlendi');
};
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ObjectPage
        imageShapeCircle
        mode="Default"
        hidePinButton
        selectedSectionId="goals"
        style={{
          height: "100%",
          // maxHeight: "795px",
          marginTop: "-25px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.1)",
          overflow: "hidden",
          overflowY: "scroll",
        }}
        className="scrollbar-hide"
        titleArea={
          <ObjectPageTitle
            style={{
              paddingTop: "24px",
              paddingLeft: "24px",
              paddingRight: "24px",
              backgroundColor: "#ffffff",
              cursor: "default",
            }}
            actionsBar={
              <MDBox style={{ marginTop: "15px", marginRight: "15px" }}>
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={() => {
  clearSession(); // önce metodu çağır
  navigate(`/tickets/detail`); // sonra yönlendirme yap
}}
                  size="small"
                  startIcon={<Icon>add</Icon>}
                  sx={{
                    marginRight: "0.5rem",
                    bottom: "11px",
                    height: "2.25rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {t("ns1:TicketPage.TicketTablePage.YeniTalep")}
                </MDButton>
              </MDBox>
            }
          >
            <MDBox>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 600,
                  color: "#344767",
                  marginBottom: "4px",
                }}
              >
                {t("ns1:TicketPage.TicketTablePage.TicketTitle")}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#7b809a",
                }}
              >
                {t("ns1:TicketPage.TicketTablePage.TicketSubTitle")}
              </Typography>
            </MDBox>
          </ObjectPageTitle>
        }
      >
        <Grid xs={12} lg={6} sx={{ paddingLeft: "3px" }}>
          <Card>
            <FilterTableMethod
              ticketRowData={ticketRowData}
              setFilteredData={setTicketRowData}
              handleSearch={filterethod}
              pageDesc="tickets"
              isrefresh={isRefresh}
              setisrefresh={setisRefresh}
              isSolveAllTicket={false}
              skip={itemOffset}
              top={itemsPerPage}
              setPageCount={setPageCount}
              setTotalCount={settotalListCount}
              createGraph={createGraph}
              setcreateGraph={setCreateGraph}
              setgraphicData={setgraphicData}
            />
            <TabMenu
              model={items}
              className="custom-tab-menu"
              style={{
                border: "none",
                backgroundColor: "transparent",
                borderRadius: "8px",
              }}
              activeIndex={activeIndex}
              onTabChange={(e) => setActiveIndex(e.index)}
            />

            {activeIndex == 0 && (
              <MDBox paddingTop={1} height="100%">
                <DataTable

                  table={{
                    columns: column,
                    rows: ticketRowData,
                  }}
                  setItemsPerPage={setItemsPerPage}
                  totalRowCount={totalListCount}
                ></DataTable>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "sticky",
                    bottom: 0,
                    backgroundColor: "white",
                    zIndex: 10,
                    padding: "10px 0",
                  }}
                >
                  <ReactPaginate
                    previousLabel="Geri"
                    nextLabel="İleri"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName="pagination"
                    activeClassName="active"
                  />
                </div>
              </MDBox>
            )}
            {activeIndex == 1 && (
              <TicketGraphic pageDesc="allTickets" createGraphic={setCreateGraph} ticketsData={graphicData} />
            )}
          </Card>
        </Grid>
      </ObjectPage>
      <Footer />

      {historyDialogOpen && (
        <HistoryDialog
          ticketId={selectedTicket}
          isOpen={historyDialogOpen}
          onClose={() => sethistoryDialogOpen(false)}
        />
      )}

      {aprHistoryOpen && (
        <ShowHistory
          approveId={selectedAprHis}
          open={aprHistoryOpen}
          onClose={() => setaprHistoryOpen(false)}
        />
      )}

      <MessageBox
        open={msgOpen}
        onClose={handleMsgDialog}
        titleText="DİKKAT"
        actions={[MessageBoxAction.Yes, MessageBoxAction.No]}
      >
        Talep silinecektir, devam edilsin mi?
      </MessageBox>
    </DashboardLayout>
  );
}

export default AllTickets;
