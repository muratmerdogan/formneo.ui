import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import getConfiguration from "confiuration";
import { OpportunitiesApi } from "api/generated/api";
import { useNavigate } from "react-router-dom";

type Row = {
  id: string;
  title: string;
  customerName?: string;
  stage?: number;
  amount?: number | null;
  currency?: string | null;
};

export default function OpportunitiesListPage(): JSX.Element {
  const navigate = useNavigate();
  const api = useMemo(() => new OpportunitiesApi(getConfiguration()), []);
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (p: number, size: number, q?: string) => {
    setLoading(true);
    try {
      const res: any = await api.apiCrmOpportunitiesPagedGet(p + 1, size, q || undefined);
      const list: any[] = res?.data?.items ?? res?.data?.list ?? [];
      const count: number = res?.data?.totalCount ?? res?.data?.count ?? list.length;
      const mapped: Row[] = list.map((dto: any) => ({
        id: String(dto?.id ?? ""),
        title: String(dto?.title ?? ""),
        customerName: String(dto?.customerName ?? dto?.customer?.name ?? ""),
        stage: dto?.stage,
        amount: dto?.amount ?? null,
        currency: dto?.currency ?? null,
      }));
      setRows(mapped);
      setTotal(count);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, pageSize, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const handleSearch = () => {
    setPage(0);
    fetchData(0, pageSize, search);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box className="px-6 lg:px-10 py-6">
        <Box display="flex" gap={1} alignItems="center" mb={2}>
          <TextField
            placeholder="Başlık veya müşteri ara"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <IconButton onClick={handleSearch}><SearchIcon /></IconButton>
          <IconButton onClick={() => fetchData(page, pageSize, search)} disabled={loading}><RefreshIcon /></IconButton>
          <Box flexGrow={1} />
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/opportunities/new")}>Yeni Fırsat</Button>
        </Box>
        <Paper>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Başlık</TableCell>
                  <TableCell>Müşteri</TableCell>
                  <TableCell>Aşama</TableCell>
                  <TableCell align="right">Tutar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id} hover onClick={() => navigate(`/opportunities/${r.id}`)} style={{ cursor: "pointer" }}>
                    <TableCell>{r.title}</TableCell>
                    <TableCell>{r.customerName}</TableCell>
                    <TableCell>{r.stage ?? "-"}</TableCell>
                    <TableCell align="right">{r.amount != null ? `${r.amount} ${r.currency ?? ""}` : "-"}</TableCell>
                  </TableRow>
                ))}
                {!loading && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">Kayıt bulunamadı</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={pageSize}
            onRowsPerPageChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </Paper>
      </Box>
      <Footer />
    </DashboardLayout>
  );
}


