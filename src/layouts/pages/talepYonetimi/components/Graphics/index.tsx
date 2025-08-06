import { Dialog, DialogActions, DialogContent, Grid, Icon, Tooltip } from '@mui/material';
import { Label } from '@ui5/webcomponents-react';
import { ColumnChart, PieChart } from '@ui5/webcomponents-react-charts';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import DataTable from 'examples/Tables/DataTable';
import * as React from 'react';
import { useEffect, useState } from 'react';
import GlobalCell from '../../allTickets/tableData/globalCell';
import { useNavigate } from 'react-router-dom';
import ShowHistory from 'layouts/pages/WorkFlow/ShowHistory';
import HistoryDialog from 'components/HistoryDialog/HistoryDialog';
import { useTranslation } from 'react-i18next';


function TicketGraphic({
    ticketsData,
    createGraphic,
    pageDesc
}: {
    ticketsData: any[];
    createGraphic?: (data: any) => void;
    pageDesc: string;
}) {

    const navigate = useNavigate();
    const { t } = useTranslation();
    const [statuData, setStatuData] = useState([]);
    const [companyData, setCompanyData] = useState([]);
    const [assignData, setAssignData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);

    const [filteredData, setfilteredData] = useState([]);
    const [selectedAprHis, setselectedAprHis] = useState<any>(null);
    const [aprHistoryOpen, setaprHistoryOpen] = useState(false);
    const [historyDialogOpen, sethistoryDialogOpen] = useState<boolean>(false);
    const [selectedTicket, setselectedTicket] = useState<any>(null);
    const column = [
        {
            accessor: "actions",

            Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>{t("ns1:TicketPage.TicketTablePage.TableColumnProps.Islemler")}</div>,
            Cell: ({ row }: any) => (
                <MDBox mx={2}>
                    <Tooltip title="Onay Geçmişi">
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

                    <Tooltip title="Talep Geçmişi">
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
                    <Tooltip title="İncele">
                        <Icon
                            style={{ marginRight: "8px", cursor: "pointer" }}
                            onClick={() => {
                                 sessionStorage.setItem("ticketId", row.original.id);
                                if (pageDesc == "solveAllTicket") {
                                    navigate("/solveAllTicket/solveTicket", {
                                        state: { ticketId: row.original.id, review: true },
                                    });
                                }
                                else {
                                    navigate("/tickets/detail/", {
                                        state: { ticketId: row.original.id, review: true },
                                    });
                                }

                            }}
                        >
                            visibility
                        </Icon>
                    </Tooltip>
                    <Tooltip title="Talebi Düzenle">
                        <Icon
                            style={{ marginRight: "8px", cursor: "pointer" }}
                            onClick={() => {
                                sessionStorage.setItem("ticketId", row.original.id);
                                if (pageDesc == "solveAllTicket") {
                                    navigate("/solveAllTicket/solveTicket", {
                                        state: { ticketId: row.original.id },
                                    });
                                }
                                else {
                                    navigate("/tickets/detail/", {
                                        state: { ticketId: row.original.id },
                                    });
                                }
                            }}
                        >
                            edit
                        </Icon>
                    </Tooltip>
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
            width: "10%",
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
            Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>{t("ns1:TicketPage.TicketTablePage.TableColumnProps.Departman")}</div>,
            Cell: ({ row, value, column }: any) => (
                <GlobalCell value={value} columnName={column.id} testRow={row.original} />
            ),
        },


    ];

    const [openTicketsDialog, setopenTicketsDialog] = useState(false);

    const groupByStatu = () => {
        const grouped = ticketsData.reduce((acc: Record<string, { count: number; statusText: string }>, ticket) => {
            const status = ticket.status || "Bilinmiyor";
            const statusText = ticket.statusText || "Bilinmeyen";

            if (!acc[status]) {
                acc[status] = { count: 0, statusText };
            }

            acc[status].count += 1;

            return acc;
        }, {} as Record<string, { count: number; statusText: string }>);

        const data = Object.entries(grouped).map(([status, { count, statusText }]) => ({
            status,
            statusText,
            count,
            chartName: "statuChart"
        }));

        setStatuData(data);

    }
    const groupByDepartment = () => {
        const grouped = ticketsData.reduce((acc: Record<string, { count: number; ticketDepartmentText: string }>, ticket) => {
            const ticketDepartmentId = ticket.ticketDepartmentId || "Bilinmiyor";
            const ticketDepartmentText = ticket.ticketDepartmentText || "Bilinmeyen";

            if (!acc[ticketDepartmentId]) {
                acc[ticketDepartmentId] = { count: 0, ticketDepartmentText };
            }

            acc[ticketDepartmentId].count += 1;

            return acc;
        }, {} as Record<string, { count: number; ticketDepartmentText: string }>);

        const data = Object.entries(grouped).map(([ticketDepartmentId, { count, ticketDepartmentText }]) => ({
            ticketDepartmentId,
            ticketDepartmentText,
            count,
            chartName: "dptChart"
        }));

        setDepartmentData(data);

    }

    const groupByCompany = () => {

        const grouped = ticketsData.reduce((acc: Record<string, { count: number; customerRefName: string }>, ticket) => {
            const customerRefId = ticket.customerRefId || "Bilinmiyor";
            const customerRefName = ticket.customerRefName || "Bilinmeyen";

            if (!acc[customerRefId]) {
                acc[customerRefId] = { count: 0, customerRefName };
            }

            acc[customerRefId].count += 1;

            return acc;
        }, {} as Record<string, { count: number; customerRefName: string }>);

        const data = Object.entries(grouped).map(([customerRefId, { count, customerRefName }]) => ({
            customerRefId,
            customerRefName,
            count,
            chartName: "customerChart"
        }));
        setCompanyData(data);
    }

    const groupByAssigng = () => {

        const grouped = ticketsData.reduce((acc: Record<string, { count: number; ticketAssigneText: string }>, ticket) => {
            const ticketAssigneId = ticket.ticketAssigneId || "Bilinmiyor";
            const ticketAssigneText = ticket.ticketAssigneText || "Bilinmeyen";

            if (!acc[ticketAssigneId]) {
                acc[ticketAssigneId] = { count: 0, ticketAssigneText };
            }

            acc[ticketAssigneId].count += 1;

            return acc;
        }, {} as Record<string, { count: number; ticketAssigneText: string }>);

        const data = Object.entries(grouped).map(([ticketAssigneId, { count, ticketAssigneText }]) => ({
            ticketAssigneId,
            ticketAssigneText,
            count,
            chartName: "assignChart"
        }));
        setAssignData(data);
    }

    useEffect(() => {
        if (ticketsData && ticketsData.length > 0) {
            groupByStatu();
            groupByCompany();
            groupByAssigng();
            groupByDepartment();
        }
    }, [ticketsData]);

    const onDataPointClick = (oEvent: any) => {
        console.log("onDataPointClick", oEvent);
        var selectedChart = oEvent.detail.payload.chartName;
        console.log("selectedChart", selectedChart)
        
        if (selectedChart == "statuChart") {
            var selectedStatu = oEvent.detail.payload.status;
            var filteredData = ticketsData.filter(e => e.status == selectedStatu);
            console.log("filteredData", filteredData)
            
            setfilteredData(filteredData);
        }
        else if (selectedChart == "dptChart") {
            var selecteddpt = oEvent.detail.payload.ticketDepartmentId;
            var filteredData = ticketsData.filter(e => e.ticketDepartmentId == selecteddpt);
            console.log("filteredData", filteredData)
           
            setfilteredData(filteredData);
        }
        else if (selectedChart == "customerChart") {
            var selectedcustomer = oEvent.detail.payload.customerRefId;
            var filteredData = ticketsData.filter(e => e.customerRefId == selectedcustomer);
            console.log("filteredData", filteredData)
            
            setfilteredData(filteredData);
        }
        else if (selectedChart == "assignChart") {
            var selectedAssign = oEvent.detail.payload.ticketAssigneId;
            if(selectedAssign == "Bilinmiyor"){
                var filteredData = ticketsData.filter(e => e.ticketAssigneText == "Atama Yok");
            }else{
                var filteredData = ticketsData.filter(e => e.ticketAssigneId == selectedAssign);
            }
            console.log("filteredData", filteredData)
            
            setfilteredData(filteredData);
        }

        setopenTicketsDialog(true);
    }

    const onCloseSearchDialog = () => {
        setopenTicketsDialog(false);
        setfilteredData([]);
    }

    return (
        <>
            <MDButton
                sx={{
                    marginLeft: "0.5rem",
                    bottom: "11px",
                    height: "2.25rem",
                    width: "15rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.26)",
                    },
                }}
                variant="contained"
                color="light"
                onClick={() => createGraphic(true)}
            >
                {t("ns1:TicketPage.TicketTablePage.GrafikOlusturYenile")}
            </MDButton>
            {ticketsData.length > 0 && (
                <>
                    <MDBox
                        id="myMDBox"
                        className="filter-row"
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                            gap: 3,
                        }}
                    >
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%"
                        }}>
                            <Label style={{ fontSize: "16px", fontWeight: "bold" }}>{t("ns1:TicketPage.TicketTablePage.GraphProps.DurumGrafigi")}</Label>
                            <PieChart
                                style={{ width: "20rem", height: "20rem" }}
                                dataset={statuData}
                                dimension={{
                                    accessor: 'statusText'
                                }}
                                measure={{
                                    accessor: 'count'
                                }}
                                onDataPointClick={onDataPointClick}
                            />
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%"
                        }}>
                            <Label style={{ fontSize: "16px", fontWeight: "bold" }}>{t("ns1:TicketPage.TicketTablePage.GraphProps.MusteriGrafigi")}</Label>
                            <PieChart
                                style={{ width: "20rem", height: "20rem" }}
                                dataset={companyData}
                                dimension={{
                                    accessor: 'customerRefName'
                                }}
                                measure={{
                                    accessor: 'count'
                                }}
                                onDataPointClick={onDataPointClick}
                            />
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%"
                        }}>
                            <Label style={{ fontSize: "16px", fontWeight: "bold" }}>{t("ns1:TicketPage.TicketTablePage.GraphProps.AtananGrafigi")}</Label>
                            {/* <PieChart
                                dataset={assignData}
                                dimension={{
                                    accessor: 'ticketAssigneText'
                                }}
                                measure={{
                                    accessor: 'count'
                                }}
                                onClick={function Xs() { }}
                                onDataPointClick={function Xs() { }}
                                onLegendClick={function Xs() { }}
                            /> */}
                            <ColumnChart
                                style={{ width: "30rem", height: "20rem" }}
                                dataset={assignData}
                                dimensions={[
                                    {
                                        accessor: 'ticketAssigneText'
                                    }
                                ]}
                                measures={[
                                    {
                                        accessor: 'count',
                                        label: "Talep Sayısı",
                                    }
                                ]}
                                noLegend={true}
                                onDataPointClick={onDataPointClick}
                            />
                        </div>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%"
                        }}>
                            <Label style={{ fontSize: "16px", fontWeight: "bold" }}>{t("ns1:TicketPage.TicketTablePage.GraphProps.DepartmanGrafigi")}</Label>
                            <PieChart
                                style={{ width: "20rem", height: "20rem" }}
                                dataset={departmentData}
                                dimension={{
                                    accessor: 'ticketDepartmentText'
                                }}
                                measure={{
                                    accessor: 'count'
                                }}
                                onDataPointClick={onDataPointClick}
                            />
                        </div>



                    </MDBox>

                </>
            )}


            <Dialog open={openTicketsDialog} maxWidth="xl" fullWidth>
                <DialogContent dividers>
                    <DataTable
                        table={{
                            columns: column,
                            rows: filteredData,
                        }}
                    ></DataTable>
                </DialogContent>
                <DialogActions>
                    <MDButton
                        sx={{ mr: 2 }}
                        variant="outlined"
                        color="primary"
                        onClick={onCloseSearchDialog}
                    >
                        Kapat
                    </MDButton>
                </DialogActions>
            </Dialog>

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
        </>
    )
}

export default TicketGraphic;
