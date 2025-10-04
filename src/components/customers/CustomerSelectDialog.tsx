import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Button,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import getConfiguration from "confiuration";
import { CustomersApi } from "api/generated/api";

type CustomerRow = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (customer: CustomerRow) => void;
};

export default function CustomerSelectDialog({ open, onClose, onSelect }: Props): JSX.Element {
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const api = useMemo(() => new CustomersApi(getConfiguration()), []);

  const fetchData = async (pageIndex: number, size: number, q?: string) => {
    try {
      setLoading(true);
      const res: any = await api.apiCustomersPagedGet(pageIndex + 1, size, false, q || undefined);
      const list: any[] = res?.data?.items ?? res?.data?.list ?? [];
      const count: number = res?.data?.totalCount ?? res?.data?.count ?? list.length;
      const mapped: CustomerRow[] = list.map((dto: any) => ({
        id: String(dto?.id ?? dto?.customerId ?? dto?.cusid ?? ""),
        name: String(dto?.name ?? dto?.title ?? dto?.custx ?? ""),
        email: dto?.emailPrimary ?? dto?.email,
        phone: dto?.phone ?? dto?.mobile,
      }));
      setRows(mapped);
      setTotal(count);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData(page, pageSize, search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, page, pageSize]);

  const handleSearch = () => {
    setPage(0);
    fetchData(0, pageSize, search);
  };

  const handleClear = () => {
    setSearch("");
    setPage(0);
    fetchData(0, pageSize, "");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Müşteri Seç</DialogTitle>
      <DialogContent>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="İsim, e-posta veya telefon ile ara"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <IconButton aria-label="ara" onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
          <IconButton aria-label="temizle" onClick={handleClear}>
            <ClearIcon />
          </IconButton>
        </div>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Müşteri</TableCell>
              <TableCell>E-posta</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell align="right">Seç</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email || "-"}</TableCell>
                <TableCell>{row.phone || "-"}</TableCell>
                <TableCell align="right">
                  <Button variant="contained" size="small" onClick={() => onSelect(row)}>
                    Seç
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Kayıt bulunamadı
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => {
            setPageSize(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Kapat</Button>
      </DialogActions>
    </Dialog>
  );
}


