import { TicketApi, TicketAssigneListDto } from "api/generated";
import getConfiguration from "confiuration";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import GlobalCell from "layouts/pages/talepYonetimi/allTickets/tableData/globalCell";
import { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";

interface Props {
    ticketId: string;
    isOpen: boolean;
    onClose: () => void;
}
function HistoryDialog({ ticketId, isOpen, onClose }: Props) {

    const [historyOpen, sethistoryOpen] = useState(false);
    const [historyData, setHistoryData] = useState<TicketAssigneListDto[]>([]);
    const historyColumn = [
        {
            accessor: "name",
            Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Atanılan Kişi</div>,
            Cell: ({ row, value, column }: any) => (
                <GlobalCell value={value} columnName={column.id} testRow={row.original} />
            ),
        },
        {
            accessor: "createDate",
            Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>İşlem Tarihi</div>,
            Cell: ({ row, value, column }: any) => (
                <GlobalCell value={value} columnName={column.id} testRow={row.original} />
            ),
        },
        {
            accessor: "status",
            Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Durum</div>,
            Cell: ({ row, value, column }: any) => {
                return <GlobalCell value={value} columnName={column.id} testRow={row.original} />;
            },

        },
        // {
        //     accessor: "description",
        //     Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Güncelleme Nedeni</div>,
        //     Cell: ({ row, value, column }: any) => (
        //         <GlobalCell value={value} columnName={column.id} testRow={row.original} />
        //     ),

        // },
        {
            accessor: "createdBy",
            Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>İşlem Yapan Kişi</div>,
            Cell: ({ row, value, column }: any) => (
                <GlobalCell value={value} columnName={column.id} testRow={row.original} />
            ),

        },
    ];

    useEffect(() => {
        getHistory();
        sethistoryOpen(isOpen);
    }, []);

    const getHistory = (async () => {
        const conf = getConfiguration();
        const ticketApi = new TicketApi(conf);
        
        var res = await ticketApi.apiTicketGetAssingListGet(ticketId);
        console.log("HISTORY>>>", res);
        res.data.forEach(item => {
            item.createDate = format(new Date(item.createDate), "dd.MM.yyyy HH:mm:ss", { locale: tr })
        });
        setHistoryData(res.data);

    });

    return (
        <Dialog open={historyOpen} maxWidth="md" fullWidth>
            <DialogTitle>Talep Geçmişi</DialogTitle>
            <DialogContent dividers>
                {historyData.length === 0 ? (
                    <Typography variant="body1" align="center">Talep geçmişi bulunmamaktadır.</Typography>
                ) : (
                    <DataTable
                        table={{
                            columns: historyColumn,
                            rows: historyData,
                        }}
                    ></DataTable>
                )}
            </DialogContent>
            <DialogActions>
                <MDButton
                    sx={{ mr: 2 }}
                    variant="outlined"
                    color="primary"
                    onClick={onClose}
                >
                    Kapat
                </MDButton>
            </DialogActions>
        </Dialog>
    )
}

export default HistoryDialog;
