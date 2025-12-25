import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  AccountTree as AccountTreeIcon,
} from "@mui/icons-material";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import {
  WorkFlowDefinationApi,
  WorkFlowDefinationListDto,
} from "api/generated";
import getConfiguration from "confiuration";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { message } from "antd";

function WorkFlowList() {
  const navigate = useNavigate();
  const [gridData, setGridData] = useState<WorkFlowDefinationListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkFlowDefinationListDto | null>(null);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      setLoading(true);
      const conf = getConfiguration();
      const api = new WorkFlowDefinationApi(conf);
      const data = await api.apiWorkFlowDefinationGet();
      setGridData(data.data || []);
    } catch (error) {
      console.error("Workflow listesi çekilirken hata:", error);
      message.error("Workflow listesi yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  function handleNew() {
    navigate("/WorkFlowList/detail");
  }

  function handleEdit(id: string) {
    navigate(`/WorkFlowList/detail/${id}`);
  }

  function handleDeleteClick(workflow: WorkFlowDefinationListDto) {
    setSelectedWorkflow(workflow);
    setDeleteDialogOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!selectedWorkflow) return;

    try {
      const conf = getConfiguration();
      const api = new WorkFlowDefinationApi(conf);
      
      // DELETE endpoint'i yoksa, isDelete flag'i ile soft delete yapılabilir
      // veya backend'e DELETE endpoint eklenmesi gerekebilir
      // Şimdilik hata mesajı gösterelim
      message.warning("Silme işlemi için backend'de DELETE endpoint'i tanımlanmalıdır");
      
      // Eğer backend'de DELETE endpoint varsa:
      // await api.apiWorkFlowDefinationIdDelete(selectedWorkflow.id || "");
      // message.success("Workflow başarıyla silindi");
      // getData(); // Listeyi yenile
      
      setDeleteDialogOpen(false);
      setSelectedWorkflow(null);
    } catch (error: any) {
      console.error("Workflow silinirken hata:", error);
      message.error(error?.response?.data?.message || "Workflow silinirken bir hata oluştu");
    }
  }

  const columns: GridColDef[] = [
    {
      field: "workflowName",
      headerName: "İş Akışı Adı",
      width: 300,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccountTreeIcon sx={{ fontSize: 20, color: "primary.main" }} />
          <Typography variant="body2" fontWeight={600}>
            {params.value || "-"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "isActive",
      headerName: "Durum",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Aktif" : "Pasif"}
          color={params.value ? "success" : "default"}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: "createdDate",
      headerName: "Oluşturulma Tarihi",
      width: 180,
      renderCell: (params) =>
        params.value ? (
          <Typography variant="body2" color="textSecondary">
            {format(new Date(params.value), "dd MMM yyyy HH:mm", { locale: tr })}
          </Typography>
        ) : (
          "-"
        ),
    },
    {
      field: "actions",
      headerName: "İşlemler",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row.id);
            }}
            sx={{
              "&:hover": {
                backgroundColor: "primary.lighter",
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(params.row);
            }}
            sx={{
              "&:hover": {
                backgroundColor: "error.lighter",
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        {/* Header */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{
                    fontWeight: 600,
                    color: "#344767",
                    marginBottom: "4px",
                  }}
                >
                  Onay Akışı Yönetimi
                </Typography>
                <Typography variant="body2" sx={{ color: "#7b809a" }}>
                  Onay akışlarını görüntüleyin, oluşturun ve yönetin
                </Typography>
              </Box>
              <MDButton
                variant="gradient"
                color="info"
                onClick={handleNew}
                startIcon={<AddIcon />}
                sx={{
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Yeni Onay Akışı
              </MDButton>
            </Box>
          </CardContent>
        </Card>

        {/* DataGrid */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            <div style={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={gridData}
                columns={columns}
                loading={loading}
                onRowClick={(params: GridRowParams) => {
                  handleEdit(params.row.id as string);
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 25 },
                  },
                }}
                sx={{
                  "& .MuiDataGrid-row": {
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  },
                  "& .MuiDataGrid-cell:focus": {
                    outline: "none",
                  },
                }}
                localeText={{
                  noRowsLabel: "Workflow bulunamadı",
                  noResultsOverlayLabel: "Sonuç bulunamadı",
                }}
              />
            </div>
          </CardContent>
        </Card>
      </MDBox>

      {/* Silme Onay Dialog'u */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedWorkflow(null);
        }}
      >
        <DialogTitle>Workflow Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>{selectedWorkflow?.workflowName}</strong> adlı workflow&apos;u silmek istediğinize
            emin misiniz?
            <br />
            <br />
            Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton
            onClick={() => {
              setDeleteDialogOpen(false);
              setSelectedWorkflow(null);
            }}
            color="secondary"
          >
            İptal
          </MDButton>
          <MDButton
            onClick={handleDeleteConfirm}
            variant="gradient"
            color="error"
            autoFocus
          >
            Sil
          </MDButton>
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default WorkFlowList;
