import React from "react";
import AllTickets from "../allTickets";
import {
  MessageBoxType,
  ObjectPage,
  ObjectPageTitle,
  ObjectPageHeader,
  MessageBoxAction,
  MessageBox,
} from "@ui5/webcomponents-react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import {
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Icon,
  Tooltip,
  Typography,
} from "@mui/material";
import MDButton from "components/MDButton";
import DataTable from "examples/Tables/DataTable";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { TicketApi, TicketAssigneListDto, UserApi } from "api/generated/api";
import getConfiguration from "confiuration";
import { useLocation, useNavigate } from "react-router-dom";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { useState, useEffect } from "react";
import GlobalCell from "../allTickets/tableData/globalCell";
import FilterTableMethod from "../components";
import HistoryDialog from "components/HistoryDialog/HistoryDialog";
import ShowHistory from "layouts/pages/WorkFlow/ShowHistory";
import "./index.css";
import ReactPaginate from "react-paginate";

import * as XLSX from "xlsx";
import { TabMenu } from "primereact/tabmenu";
import TicketGraphic from "../components/Graphics";
import { useTranslation } from "react-i18next";

function solveAllTicket() {
  const navigate = useNavigate();
  const [ticketRowData, setTicketRowData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();
  const { t } = useTranslation();
  const { onlyAllTicket, workCompanyId, workCompanyName, projectId, projectName, projectSubName } = useLocation().state || {};

  const [selectedTicket, setselectedTicket] = useState<any>(null);
  const [historyDialogOpen, sethistoryDialogOpen] = useState<boolean>(false);
  const [msgOpen, setmsgOpen] = useState(false);

  const [selectedAprHis, setselectedAprHis] = useState<any>(null);
  const [aprHistoryOpen, setaprHistoryOpen] = useState(false);

  const [isRefresh, setisRefresh] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState(0);
  var [totalListCount, settotalListCount] = useState(0);
  var [itemOffset, setItemOffset] = useState(0);
  // const itemsPerPage = 7;
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const endOffset = itemOffset + itemsPerPage;

  const [activeIndex, setActiveIndex] = useState(0);
  const items = [
    { label: t("ns1:TicketPage.TicketTablePage.Talepler"), icon: "pi pi-check" },
    { label: t("ns1:TicketPage.TicketTablePage.Grafik"), icon: "pi pi-chart-line" },
  ].filter(Boolean);
  const [createGraph, setCreateGraph] = useState<boolean>(false);
  const [graphicData, setgraphicData] = useState<any[]>([]);

  const fetchTicketData = async () => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new TicketApi(conf);
      // var data = await api.apiTicketGetAssignTicketsGet();
      // setTicketRowData(data.data as any);
      // setFilteredData(data.data as any);
      // console.log(data.data);
    } catch (error) {
      dispatchAlert({
        message: "Hata oluştu" + error,
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  // useEffect(() => {
  //   // fetchTicketData();
  //   setPageCount(Math.ceil(filteredData.length / itemsPerPage));
  // }, [filteredData]);

  useEffect(() => {
    setisRefresh(true);
  }, [itemsPerPage]);

  const column = [
    {
      accessor: "actions",

      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:TicketPage.TicketTablePage.TableColumnProps.Islemler")}
        </div>
      ),
      Cell: ({ row }: any) => (
        <MDBox mx={2}>
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
                // getHistory(row.original.id);
                setselectedTicket(row.original.id);
                sethistoryDialogOpen(true);
              }}
            >
              personSearch
            </Icon>
          </Tooltip>
          <Tooltip title={t("ns1:TicketPage.TicketTablePage.Incele")}>
            <Icon
              style={{ marginRight: "8px", cursor: "pointer" }}
              onClick={() => {
                // navigate(`/tickets/solveTicket/${row.original.id}`);
                 sessionStorage.setItem("ticketId", row.original.id);
                navigate("/solveAllTicket/solveTicket", {
                  state: { ticketId: row.original.id, review: true },
                });
              }}
            >
              visibility
            </Icon>
          </Tooltip>
          {/* <Tooltip title={t("ns1:TicketPage.TicketTablePage.TalebiDuzenle")}>
            <Icon
              style={{ marginRight: "8px", cursor: "pointer" }}
              onClick={() => {
                // navigate(`/tickets/solveTicket/${row.original.id}`);
                navigate("/solveAllTicket/solveTicket", {
                  state: { ticketId: row.original.id },
                });
              }}
            >
              edit
            </Icon>
          </Tooltip> */}
          <Tooltip title="Talebi Düzenle">
            <Icon
              style={{ marginRight: "8px", cursor: "pointer" }}
              onClick={() => {
                const ticketId = row.original.id;
                sessionStorage.setItem("ticketId", ticketId);
                const url = "/solveAllTicket/solveTicket";

                window.open(url, "_blank");
              }}
            >
              edit
            </Icon>

          </Tooltip>
          {/* <Tooltip title="Talebi Sil">
            <Icon
              style={{ marginRight: "8px", cursor: "pointer" }}
              // onClick={() => handleDelete(row.original.id)}
              onClick={() => {
                setselectedTicket(row.original.id);
                setmsgOpen(true);
              }}
            >
              delete
            </Icon>
          </Tooltip> */}
        </MDBox>
      ),
    },
    {
      accessor: "ticketNumber",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:TicketPage.TicketTablePage.TableColumnProps.TalepNo")}
        </div>
      ),
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      accessor: "statusText",
      width: "10%",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:TicketPage.TicketTablePage.TableColumnProps.Durum")}
        </div>
      ),
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
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:TicketPage.TicketTablePage.TableColumnProps.Baslik")}
        </div>
      ),
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      accessor: "customerRefName",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:TicketPage.TicketTablePage.TableColumnProps.Musteri")}
        </div>
      ),
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      accessor: "ticketAssigneText",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:TicketPage.TicketTablePage.TableColumnProps.Atanan")}
        </div>
      ),
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      accessor: "userAppName",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:TicketPage.TicketTablePage.TableColumnProps.Olusturan")}
        </div>
      ),
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      accessor: "createdDate",
      Header: (
        <MDBox style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:TicketPage.TicketTablePage.TableColumnProps.Tarih")}
        </MDBox>
      ),
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      accessor: "ticketDepartmentText",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:TicketPage.TicketTablePage.TableColumnProps.Departman")}
        </div>
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
    //   accessor: "userAppUserName",
    //   Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>E-mail</div>,
    //   Cell: ({ row, value, column }: any) => (
    //     <GlobalCell value={value} columnName={column.id} testRow={row.original} />
    //   ),
    // },
    // {
    //   accessor: "workCompanyName",
    //   Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>ŞİRKET</div>,
    //   Cell: ({ row, value, column }: any) => (
    //     <GlobalCell value={value} columnName={column.id} testRow={row.original} />
    //   ),
    // },
    // {
    //   accessor: "typeText",
    //   width: "10%",
    //   Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>TİP</div>,
    //   Cell: ({ row, value, column }: any) => (
    //     <GlobalCell value={value} columnName={column.id} testRow={row.original} />
    //   ),
    // },
  ];

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
                {t("ns1:TicketPage.TicketTablePage.TicketTitle2")}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#7b809a",
                }}
              >
                {t("ns1:TicketPage.TicketTablePage.TicketSubTitle2")}
              </Typography>
            </MDBox>
          </ObjectPageTitle>
        }
      >
        <Grid xs={12} lg={6} sx={{ paddingLeft: "3px" }}>
          <Card>
            <FilterTableMethod
              ticketRowData={ticketRowData}
              setFilteredData={setFilteredData}
              pageDesc="solveAllTicket"
              isSolveAllTicket={true}
              isrefresh={isRefresh}
              setisrefresh={setisRefresh}
              handleSearch={filterethod}
              skip={itemOffset}
              top={itemsPerPage}
              setPageCount={setPageCount}
              setTotalCount={settotalListCount}
              createGraph={createGraph}
              setcreateGraph={setCreateGraph}
              setgraphicData={setgraphicData}
              onlyAll={onlyAllTicket}
              fromDashboard={{
                workCompanyId: workCompanyId || "",
                workCompanyName: workCompanyName || "",
                projectId: projectId || "",
                projectName: projectName || "",
                projectSubName: projectSubName || "",
              }}
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
              <MDBox height="100%">
                <DataTable
                  table={{
                    columns: column,
                    rows: filteredData,
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
              <TicketGraphic
                pageDesc="solveAllTicket"
                createGraphic={setCreateGraph}
                ticketsData={graphicData}
              />
            )}
          </Card>
        </Grid>
      </ObjectPage>

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

      <Footer />
    </DashboardLayout>
  );
}

export default solveAllTicket;
