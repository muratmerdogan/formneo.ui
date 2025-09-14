import React, { useState } from "react";
import {
    Box,
    Card,
    Typography,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Switch,
    FormControlLabel,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Chip,
    Avatar,
    Divider,
    Grid,
    Alert
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    DragIndicator as DragIcon,
    Image as ImageIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon
} from "@mui/icons-material";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { MenuCategory, CategoryFormData } from "types/qrmenu";

interface CategoryManagerProps {
    menuId: string;
    categories: MenuCategory[];
    onCategoriesChange: (categories: MenuCategory[]) => void;
}

interface CategoryFormProps {
    open: boolean;
    category?: MenuCategory | null;
    onClose: () => void;
    onSave: (categoryData: CategoryFormData) => void;
}

function CategoryForm({ open, category, onClose, onSave }: CategoryFormProps) {
    const [formData, setFormData] = useState<CategoryFormData>({
        name: category?.name || "",
        description: category?.description || "",
        order: category?.order || 0,
        isActive: category?.isActive ?? true,
        image: category?.image || ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Kategori adı zorunludur";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSave(formData);
        onClose();
        setFormData({
            name: "",
            description: "",
            order: 0,
            isActive: true,
            image: ""
        });
        setErrors({});
    };

    const handleClose = () => {
        onClose();
        setFormData({
            name: "",
            description: "",
            order: 0,
            isActive: true,
            image: ""
        });
        setErrors({});
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {category ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
            </DialogTitle>
            <DialogContent>
                <MDBox display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField
                        fullWidth
                        label="Kategori Adı *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        error={!!errors.name}
                        helperText={errors.name}
                    />

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Açıklama"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Kategori hakkında kısa bir açıklama..."
                    />

                    <TextField
                        fullWidth
                        label="Resim URL'si"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            />
                        }
                        label="Kategori aktif"
                    />
                </MDBox>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>İptal</Button>
                <Button onClick={handleSubmit} variant="contained">
                    {category ? "Güncelle" : "Ekle"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function CategoryManager({
    menuId,
    categories,
    onCategoriesChange
}: CategoryManagerProps): JSX.Element {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<MenuCategory | null>(null);

    const handleAddCategory = () => {
        setEditingCategory(null);
        setDialogOpen(true);
    };

    const handleEditCategory = (category: MenuCategory) => {
        setEditingCategory(category);
        setDialogOpen(true);
    };

    const handleSaveCategory = (categoryData: CategoryFormData) => {
        if (editingCategory) {
            // Güncelleme
            const updatedCategories = categories.map(cat =>
                cat.id === editingCategory.id
                    ? {
                        ...cat,
                        ...categoryData,
                        updatedAt: new Date().toISOString()
                    }
                    : cat
            );
            onCategoriesChange(updatedCategories);
        } else {
            // Yeni ekleme
            const newCategory: MenuCategory = {
                id: `category-${Date.now()}`,
                ...categoryData,
                order: categories.length,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            onCategoriesChange([...categories, newCategory]);
        }
    };

    const handleDeleteCategory = (category: MenuCategory) => {
        setCategoryToDelete(category);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (categoryToDelete) {
            const updatedCategories = categories.filter(cat => cat.id !== categoryToDelete.id);
            onCategoriesChange(updatedCategories);
            setDeleteDialogOpen(false);
            setCategoryToDelete(null);
        }
    };

    const toggleCategoryStatus = (categoryId: string) => {
        const updatedCategories = categories.map(cat =>
            cat.id === categoryId
                ? { ...cat, isActive: !cat.isActive, updatedAt: new Date().toISOString() }
                : cat
        );
        onCategoriesChange(updatedCategories);
    };

    // Drag and drop functionality will be added when types are available
    // const handleDragEnd = (result: any) => {
    //   if (!result.destination) return;
    //   const items = Array.from(categories);
    //   const [reorderedItem] = items.splice(result.source.index, 1);
    //   items.splice(result.destination.index, 0, reorderedItem);
    //   const updatedCategories = items.map((cat, index) => ({
    //     ...cat,
    //     order: index,
    //     updatedAt: new Date().toISOString()
    //   }));
    //   onCategoriesChange(updatedCategories);
    // };

    return (
        <Card>
            <MDBox p={3}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <MDTypography variant="h5">
                        Menü Kategorileri
                    </MDTypography>
                    <MDButton
                        variant="gradient"
                        color="info"
                        startIcon={<AddIcon />}
                        onClick={handleAddCategory}
                    >
                        Kategori Ekle
                    </MDButton>
                </MDBox>

                {categories.length === 0 ? (
                    <MDBox textAlign="center" py={4}>
                        <ImageIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                        <MDTypography variant="h6" color="text" mb={1}>
                            Henüz kategori eklenmemiş
                        </MDTypography>
                        <MDTypography variant="body2" color="text" mb={3}>
                            Menünüzü organize etmek için kategoriler ekleyin
                        </MDTypography>
                        <MDButton
                            variant="gradient"
                            color="info"
                            startIcon={<AddIcon />}
                            onClick={handleAddCategory}
                        >
                            İlk Kategoriyi Ekle
                        </MDButton>
                    </MDBox>
                ) : (
                    <>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Kategoriler listeleniyor. Sürükle-bırak özelliği yakında eklenecek.
                        </Alert>

                        <List>
                            {categories
                                .sort((a, b) => a.order - b.order)
                                .map((category) => (
                                    <ListItem
                                        key={category.id}
                                        sx={{
                                            mb: 1,
                                            border: "1px solid #e0e0e0",
                                            borderRadius: 1,
                                            "&:hover": {
                                                backgroundColor: "#f9f9f9"
                                            }
                                        }}
                                    >
                                        <Box sx={{ mr: 2, cursor: "grab" }}>
                                            <DragIcon color="action" />
                                        </Box>

                                        {category.image && (
                                            <Avatar
                                                src={category.image}
                                                sx={{ mr: 2, width: 40, height: 40 }}
                                            >
                                                <ImageIcon />
                                            </Avatar>
                                        )}

                                        <ListItemText
                                            primary={
                                                <MDBox display="flex" alignItems="center" gap={1}>
                                                    <MDTypography variant="h6">
                                                        {category.name}
                                                    </MDTypography>
                                                    <Chip
                                                        label={category.isActive ? "Aktif" : "Pasif"}
                                                        color={category.isActive ? "success" : "default"}
                                                        size="small"
                                                    />
                                                </MDBox>
                                            }
                                            secondary={category.description}
                                        />

                                        <ListItemSecondaryAction>
                                            <MDBox display="flex" gap={1}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => toggleCategoryStatus(category.id)}
                                                    color={category.isActive ? "success" : "default"}
                                                >
                                                    {category.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEditCategory(category)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteCategory(category)}
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </MDBox>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                        </List>

                        <Divider sx={{ my: 2 }} />

                        <MDBox display="flex" justifyContent="space-between" alignItems="center">
                            <MDTypography variant="body2" color="text">
                                Toplam {categories.length} kategori • {categories.filter(c => c.isActive).length} aktif
                            </MDTypography>
                            <MDButton
                                variant="outlined"
                                color="info"
                                startIcon={<AddIcon />}
                                onClick={handleAddCategory}
                            >
                                Kategori Ekle
                            </MDButton>
                        </MDBox>
                    </>
                )}
            </MDBox>

            {/* Kategori Formu */}
            <CategoryForm
                open={dialogOpen}
                category={editingCategory}
                onClose={() => setDialogOpen(false)}
                onSave={handleSaveCategory}
            />

            {/* Silme Onayı */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Kategoriyi Sil</DialogTitle>
                <DialogContent>
                    <MDTypography variant="body1">
                        &ldquo;{categoryToDelete?.name}&rdquo; kategorisini silmek istediğinizden emin misiniz?
                        Bu kategorideki tüm ürünler de silinecektir.
                    </MDTypography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
                    <Button onClick={confirmDelete} color="error">
                        Sil
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}
