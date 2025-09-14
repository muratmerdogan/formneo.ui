import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Chip,
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Switch,
    FormControlLabel
} from "@mui/material";
import {
    MoreVert as MoreVertIcon,
    Add as AddIcon,
    QrCode as QrCodeIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    GetApp as DownloadIcon
} from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { Menu as QRMenu } from "types/qrmenu";
import { useRegisterActions } from "context/ActionBarContext";

// Mock data - gerçek uygulamada API'den gelecek
const mockMenus: QRMenu[] = [
    {
        id: "1",
        customerId: "customer-1",
        name: "Ana Menü - Restoran XYZ",
        description: "Geleneksel Türk mutfağı menümüz",
        isActive: true,
        qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=menu-1",
        qrCodeUrl: "https://menu.example.com/menu/1",
        theme: {
            primaryColor: "#2196F3",
            secondaryColor: "#FF9800",
            backgroundColor: "#FFFFFF",
            textColor: "#333333",
            fontFamily: "Roboto"
        },
        settings: {
            showPrices: true,
            showImages: true,
            showDescription: true,
            showNutrition: false,
            showAllergens: true,
            showPreparationTime: true,
            allowOrdering: false,
            currency: "TRY",
            language: "tr"
        },
        categories: [],
        items: [],
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z"
    },
    {
        id: "2",
        customerId: "customer-2",
        name: "Kahvaltı Menüsü - Kafe ABC",
        description: "Özel kahvaltı seçeneklerimiz",
        isActive: false,
        theme: {
            primaryColor: "#4CAF50",
            secondaryColor: "#FFC107",
            backgroundColor: "#F5F5F5",
            textColor: "#2E2E2E",
            fontFamily: "Open Sans"
        },
        settings: {
            showPrices: true,
            showImages: true,
            showDescription: true,
            showNutrition: true,
            showAllergens: true,
            showPreparationTime: false,
            allowOrdering: true,
            currency: "TRY",
            language: "tr"
        },
        categories: [],
        items: [],
        createdAt: "2024-01-10T08:30:00Z",
        updatedAt: "2024-01-12T14:20:00Z"
    }
];

export default function QRMenuListPage(): JSX.Element {
    const navigate = useNavigate();
    const [menus, setMenus] = useState<QRMenu[]>(mockMenus);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedMenu, setSelectedMenu] = useState<QRMenu | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [qrDialogOpen, setQrDialogOpen] = useState(false);

    // Action bar
    useRegisterActions([
        {
            id: "add-menu",
            label: "Yeni Menü",
            icon: <AddIcon fontSize="small" />,
            onClick: () => navigate("/qrmenu/new")
        }
    ], []);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, menu: QRMenu) => {
        setAnchorEl(event.currentTarget);
        setSelectedMenu(menu);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedMenu(null);
    };

    const handleEdit = () => {
        if (selectedMenu) {
            navigate(`/qrmenu/edit/${selectedMenu.id}`);
        }
        handleMenuClose();
    };

    const handlePreview = () => {
        if (selectedMenu) {
            window.open(`/qrmenu/preview/${selectedMenu.id}`, '_blank');
        }
        handleMenuClose();
    };

    const handleShowQR = () => {
        setQrDialogOpen(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const confirmDelete = () => {
        if (selectedMenu) {
            setMenus(menus.filter(menu => menu.id !== selectedMenu.id));
            setDeleteDialogOpen(false);
            setSelectedMenu(null);
        }
    };

    const toggleMenuStatus = (menuId: string) => {
        setMenus(menus.map(menu =>
            menu.id === menuId
                ? { ...menu, isActive: !menu.isActive }
                : menu
        ));
    };

    const downloadQR = () => {
        if (selectedMenu?.qrCode) {
            const link = document.createElement('a');
            link.href = selectedMenu.qrCode;
            link.download = `qr-menu-${selectedMenu.name}.png`;
            link.click();
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox py={3}>
                <MDBox mb={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <MDBox display="flex" justifyContent="space-between" alignItems="center">
                                <MDTypography variant="h4" fontWeight="medium">
                                    QR Menü Yönetimi
                                </MDTypography>
                                <MDButton
                                    variant="gradient"
                                    color="info"
                                    startIcon={<AddIcon />}
                                    onClick={() => navigate("/qrmenu/new")}
                                >
                                    Yeni Menü Oluştur
                                </MDButton>
                            </MDBox>
                        </Grid>
                    </Grid>
                </MDBox>

                <Grid container spacing={3}>
                    {menus.map((menu) => (
                        <Grid item xs={12} sm={6} md={4} key={menu.id}>
                            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                <MDBox p={2} flexGrow={1}>
                                    <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                        <MDTypography variant="h6" fontWeight="medium" sx={{ flexGrow: 1, mr: 1 }}>
                                            {menu.name}
                                        </MDTypography>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuClick(e, menu)}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </MDBox>

                                    {menu.description && (
                                        <MDTypography variant="body2" color="text" mb={2}>
                                            {menu.description}
                                        </MDTypography>
                                    )}

                                    <MDBox display="flex" flexWrap="wrap" gap={1} mb={2}>
                                        <Chip
                                            label={menu.isActive ? "Aktif" : "Pasif"}
                                            color={menu.isActive ? "success" : "default"}
                                            size="small"
                                        />
                                        <Chip
                                            label={`${menu.categories.length} Kategori`}
                                            variant="outlined"
                                            size="small"
                                        />
                                        <Chip
                                            label={`${menu.items.length} Ürün`}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </MDBox>

                                    <MDTypography variant="caption" color="text">
                                        Son güncelleme: {new Date(menu.updatedAt).toLocaleDateString('tr-TR')}
                                    </MDTypography>
                                </MDBox>

                                <MDBox p={2} pt={0}>
                                    <MDBox display="flex" gap={1}>
                                        <MDButton
                                            variant="outlined"
                                            color="info"
                                            size="small"
                                            startIcon={<QrCodeIcon />}
                                            onClick={() => {
                                                setSelectedMenu(menu);
                                                setQrDialogOpen(true);
                                            }}
                                        >
                                            QR Kod
                                        </MDButton>
                                        <MDButton
                                            variant="outlined"
                                            color="dark"
                                            size="small"
                                            startIcon={<VisibilityIcon />}
                                            onClick={() => window.open(`/qrmenu/preview/${menu.id}`, '_blank')}
                                        >
                                            Önizle
                                        </MDButton>
                                    </MDBox>

                                    <MDBox mt={1}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={menu.isActive}
                                                    onChange={() => toggleMenuStatus(menu.id)}
                                                    size="small"
                                                />
                                            }
                                            label="Aktif"
                                            sx={{ fontSize: "0.875rem" }}
                                        />
                                    </MDBox>
                                </MDBox>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {menus.length === 0 && (
                    <MDBox textAlign="center" py={6}>
                        <QrCodeIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                        <MDTypography variant="h5" color="text" mb={1}>
                            Henüz menü oluşturulmamış
                        </MDTypography>
                        <MDTypography variant="body2" color="text" mb={3}>
                            İlk QR menünüzü oluşturmak için aşağıdaki butona tıklayın
                        </MDTypography>
                        <MDButton
                            variant="gradient"
                            color="info"
                            startIcon={<AddIcon />}
                            onClick={() => navigate("/qrmenu/new")}
                        >
                            İlk Menüyü Oluştur
                        </MDButton>
                    </MDBox>
                )}
            </MDBox>

            {/* Context Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEdit}>
                    <EditIcon sx={{ mr: 1 }} fontSize="small" />
                    Düzenle
                </MenuItem>
                <MenuItem onClick={handlePreview}>
                    <VisibilityIcon sx={{ mr: 1 }} fontSize="small" />
                    Önizle
                </MenuItem>
                <MenuItem onClick={handleShowQR}>
                    <QrCodeIcon sx={{ mr: 1 }} fontSize="small" />
                    QR Kodu Göster
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
                    <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
                    Sil
                </MenuItem>
            </Menu>

            {/* QR Code Dialog */}
            <Dialog open={qrDialogOpen} onClose={() => setQrDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>QR Kod - {selectedMenu?.name}</DialogTitle>
                <DialogContent>
                    <MDBox textAlign="center" py={2}>
                        {selectedMenu?.qrCode && (
                            <img
                                src={selectedMenu.qrCode}
                                alt="QR Kod"
                                style={{ maxWidth: "200px", width: "100%" }}
                            />
                        )}
                        <MDTypography variant="body2" color="text" mt={2}>
                            Müşterileriniz bu QR kodu okutarak menünüze erişebilir
                        </MDTypography>
                        {selectedMenu?.qrCodeUrl && (
                            <TextField
                                fullWidth
                                value={selectedMenu.qrCodeUrl}
                                margin="normal"
                                label="Menü URL'si"
                                InputProps={{
                                    readOnly: true,
                                }}
                                onClick={(e) => (e.target as HTMLInputElement).select()}
                            />
                        )}
                    </MDBox>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setQrDialogOpen(false)}>Kapat</Button>
                    <Button onClick={downloadQR} startIcon={<DownloadIcon />}>
                        QR Kodu İndir
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Menüyü Sil</DialogTitle>
                <DialogContent>
                    <MDTypography variant="body1">
                        &ldquo;{selectedMenu?.name}&rdquo; menüsünü silmek istediğinizden emin misiniz?
                        Bu işlem geri alınamaz.
                    </MDTypography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
                    <Button onClick={confirmDelete} color="error">
                        Sil
                    </Button>
                </DialogActions>
            </Dialog>

            <Footer />
        </DashboardLayout>
    );
}
