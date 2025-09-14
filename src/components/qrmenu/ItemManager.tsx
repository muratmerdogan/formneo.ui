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
    Alert,
    MenuItem,
    InputAdornment,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Rating
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    DragIndicator as DragIcon,
    Image as ImageIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    ExpandMore as ExpandMoreIcon,
    Restaurant as RestaurantIcon,
    LocalOffer as PriceIcon,
    Schedule as TimeIcon,
    // Eco as VeganIcon, // Not available in this version
    Warning as AllergenIcon
} from "@mui/icons-material";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { MenuItem as MenuItemType, MenuCategory, ItemFormData, NutritionInfo } from "types/qrmenu";

interface ItemManagerProps {
    menuId: string;
    categories: MenuCategory[];
    items: MenuItemType[];
    onItemsChange: (items: MenuItemType[]) => void;
}

interface ItemFormProps {
    open: boolean;
    item?: MenuItemType | null;
    categories: MenuCategory[];
    onClose: () => void;
    onSave: (itemData: ItemFormData) => void;
}

function ItemForm({ open, item, categories, onClose, onSave }: ItemFormProps) {
    const [formData, setFormData] = useState<ItemFormData>({
        categoryId: item?.categoryId || "",
        name: item?.name || "",
        description: item?.description || "",
        price: item?.price || 0,
        currency: item?.currency || "TRY",
        image: item?.image || "",
        ingredients: item?.ingredients || [],
        allergens: item?.allergens || [],
        nutritionInfo: item?.nutritionInfo || {},
        isAvailable: item?.isAvailable ?? true,
        isVegetarian: item?.isVegetarian || false,
        isVegan: item?.isVegan || false,
        isGlutenFree: item?.isGlutenFree || false,
        spicyLevel: item?.spicyLevel || undefined,
        preparationTime: item?.preparationTime || undefined,
        order: item?.order || 0,
        tags: item?.tags || []
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [newIngredient, setNewIngredient] = useState("");
    const [newAllergen, setNewAllergen] = useState("");
    const [newTag, setNewTag] = useState("");

    const handleSubmit = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Ürün adı zorunludur";
        }
        if (!formData.categoryId) {
            newErrors.categoryId = "Kategori seçimi zorunludur";
        }
        if (formData.price < 0) {
            newErrors.price = "Fiyat 0'dan küçük olamaz";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSave(formData);
        onClose();
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            categoryId: "",
            name: "",
            description: "",
            price: 0,
            currency: "TRY",
            image: "",
            ingredients: [],
            allergens: [],
            nutritionInfo: {},
            isAvailable: true,
            isVegetarian: false,
            isVegan: false,
            isGlutenFree: false,
            spicyLevel: undefined,
            preparationTime: undefined,
            order: 0,
            tags: []
        });
        setErrors({});
        setNewIngredient("");
        setNewAllergen("");
        setNewTag("");
    };

    const handleClose = () => {
        onClose();
        resetForm();
    };

    const addIngredient = () => {
        if (newIngredient.trim() && !formData.ingredients.includes(newIngredient.trim())) {
            setFormData({
                ...formData,
                ingredients: [...formData.ingredients, newIngredient.trim()]
            });
            setNewIngredient("");
        }
    };

    const removeIngredient = (ingredient: string) => {
        setFormData({
            ...formData,
            ingredients: formData.ingredients.filter(i => i !== ingredient)
        });
    };

    const addAllergen = () => {
        if (newAllergen.trim() && !formData.allergens.includes(newAllergen.trim())) {
            setFormData({
                ...formData,
                allergens: [...formData.allergens, newAllergen.trim()]
            });
            setNewAllergen("");
        }
    };

    const removeAllergen = (allergen: string) => {
        setFormData({
            ...formData,
            allergens: formData.allergens.filter(a => a !== allergen)
        });
    };

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, newTag.trim()]
            });
            setNewTag("");
        }
    };

    const removeTag = (tag: string) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(t => t !== tag)
        });
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {item ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
            </DialogTitle>
            <DialogContent>
                <MDBox display="flex" flexDirection="column" gap={2} mt={1}>
                    {/* Temel Bilgiler */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Ürün Adı *"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                label="Kategori *"
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                error={!!errors.categoryId}
                                helperText={errors.categoryId}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Açıklama"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Ürün hakkında detaylı açıklama..."
                    />

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Fiyat *"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                error={!!errors.price}
                                helperText={errors.price}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">₺</InputAdornment>
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Hazırlık Süresi (dk)"
                                value={formData.preparationTime || ""}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    preparationTime: e.target.value ? parseInt(e.target.value) : undefined
                                })}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">dk</InputAdornment>
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Resim URL'si"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                            />
                        </Grid>
                    </Grid>

                    {/* Özel Özellikler */}
                    <MDBox>
                        <MDTypography variant="h6" mb={1}>Özel Özellikler</MDTypography>
                        <Grid container spacing={2}>
                            <Grid item xs={6} md={3}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isVegetarian}
                                            onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                                        />
                                    }
                                    label="Vejetaryen"
                                />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isVegan}
                                            onChange={(e) => setFormData({ ...formData, isVegan: e.target.checked })}
                                        />
                                    }
                                    label="Vegan"
                                />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isGlutenFree}
                                            onChange={(e) => setFormData({ ...formData, isGlutenFree: e.target.checked })}
                                        />
                                    }
                                    label="Glütensiz"
                                />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isAvailable}
                                            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                        />
                                    }
                                    label="Mevcut"
                                />
                            </Grid>
                        </Grid>
                    </MDBox>

                    {/* Acılık Seviyesi */}
                    <MDBox>
                        <MDTypography variant="body2" mb={1}>Acılık Seviyesi</MDTypography>
                        <Rating
                            value={formData.spicyLevel || 0}
                            onChange={(_, value) => setFormData({ ...formData, spicyLevel: value as any })}
                            max={5}
                            icon={<span>🌶️</span>}
                            emptyIcon={<span style={{ opacity: 0.3 }}>🌶️</span>}
                        />
                    </MDBox>

                    {/* İçerikler */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <MDTypography variant="h6">İçerikler ve Alerjenler</MDTypography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <MDTypography variant="subtitle2" mb={1}>İçerikler</MDTypography>
                                    <MDBox display="flex" gap={1} mb={1}>
                                        <TextField
                                            size="small"
                                            label="İçerik ekle"
                                            value={newIngredient}
                                            onChange={(e) => setNewIngredient(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                                        />
                                        <Button onClick={addIngredient}>Ekle</Button>
                                    </MDBox>
                                    <MDBox display="flex" flexWrap="wrap" gap={1}>
                                        {formData.ingredients.map((ingredient) => (
                                            <Chip
                                                key={ingredient}
                                                label={ingredient}
                                                onDelete={() => removeIngredient(ingredient)}
                                                size="small"
                                            />
                                        ))}
                                    </MDBox>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <MDTypography variant="subtitle2" mb={1}>Alerjenler</MDTypography>
                                    <MDBox display="flex" gap={1} mb={1}>
                                        <TextField
                                            size="small"
                                            label="Alerjen ekle"
                                            value={newAllergen}
                                            onChange={(e) => setNewAllergen(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && addAllergen()}
                                        />
                                        <Button onClick={addAllergen}>Ekle</Button>
                                    </MDBox>
                                    <MDBox display="flex" flexWrap="wrap" gap={1}>
                                        {formData.allergens.map((allergen) => (
                                            <Chip
                                                key={allergen}
                                                label={allergen}
                                                onDelete={() => removeAllergen(allergen)}
                                                size="small"
                                                color="warning"
                                            />
                                        ))}
                                    </MDBox>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>

                    {/* Etiketler */}
                    <MDBox>
                        <MDTypography variant="subtitle2" mb={1}>Etiketler</MDTypography>
                        <MDBox display="flex" gap={1} mb={1}>
                            <TextField
                                size="small"
                                label="Etiket ekle"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                            />
                            <Button onClick={addTag}>Ekle</Button>
                        </MDBox>
                        <MDBox display="flex" flexWrap="wrap" gap={1}>
                            {formData.tags.map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onDelete={() => removeTag(tag)}
                                    size="small"
                                    variant="outlined"
                                />
                            ))}
                        </MDBox>
                    </MDBox>
                </MDBox>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>İptal</Button>
                <Button onClick={handleSubmit} variant="contained">
                    {item ? "Güncelle" : "Ekle"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function ItemManager({
    menuId,
    categories,
    items,
    onItemsChange
}: ItemManagerProps): JSX.Element {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItemType | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<MenuItemType | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");

    const handleAddItem = () => {
        setEditingItem(null);
        setDialogOpen(true);
    };

    const handleEditItem = (item: MenuItemType) => {
        setEditingItem(item);
        setDialogOpen(true);
    };

    const handleSaveItem = (itemData: ItemFormData) => {
        if (editingItem) {
            // Güncelleme
            const updatedItems = items.map(item =>
                item.id === editingItem.id
                    ? {
                        ...item,
                        ...itemData,
                        updatedAt: new Date().toISOString()
                    }
                    : item
            );
            onItemsChange(updatedItems);
        } else {
            // Yeni ekleme
            const newItem: MenuItemType = {
                id: `item-${Date.now()}`,
                ...itemData,
                order: items.filter(i => i.categoryId === itemData.categoryId).length,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            onItemsChange([...items, newItem]);
        }
    };

    const handleDeleteItem = (item: MenuItemType) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            const updatedItems = items.filter(item => item.id !== itemToDelete.id);
            onItemsChange(updatedItems);
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        }
    };

    const toggleItemStatus = (itemId: string) => {
        const updatedItems = items.map(item =>
            item.id === itemId
                ? { ...item, isAvailable: !item.isAvailable, updatedAt: new Date().toISOString() }
                : item
        );
        onItemsChange(updatedItems);
    };

    const filteredItems = items.filter(item => {
        const matchesCategory = selectedCategory === "all" || item.categoryId === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getCategoryName = (categoryId: string) => {
        return categories.find(cat => cat.id === categoryId)?.name || "Bilinmeyen Kategori";
    };

    return (
        <Card>
            <MDBox p={3}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <MDTypography variant="h5">
                        Menü Ürünleri
                    </MDTypography>
                    <MDButton
                        variant="gradient"
                        color="info"
                        startIcon={<AddIcon />}
                        onClick={handleAddItem}
                    >
                        Ürün Ekle
                    </MDButton>
                </MDBox>

                {/* Filtreler */}
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Ürün ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Kategori filtrele"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <MenuItem value="all">Tüm Kategoriler</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>

                {filteredItems.length === 0 ? (
                    <MDBox textAlign="center" py={4}>
                        <RestaurantIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                        <MDTypography variant="h6" color="text" mb={1}>
                            {searchTerm || selectedCategory !== "all" ? "Ürün bulunamadı" : "Henüz ürün eklenmemiş"}
                        </MDTypography>
                        <MDTypography variant="body2" color="text" mb={3}>
                            {searchTerm || selectedCategory !== "all"
                                ? "Arama kriterlerinizi değiştirmeyi deneyin"
                                : "Menünüze ürün ekleyerek başlayın"
                            }
                        </MDTypography>
                        {!searchTerm && selectedCategory === "all" && (
                            <MDButton
                                variant="gradient"
                                color="info"
                                startIcon={<AddIcon />}
                                onClick={handleAddItem}
                            >
                                İlk Ürünü Ekle
                            </MDButton>
                        )}
                    </MDBox>
                ) : (
                    <>
                        <List>
                            {filteredItems.map((item) => (
                                <ListItem
                                    key={item.id}
                                    sx={{
                                        mb: 1,
                                        border: "1px solid #e0e0e0",
                                        borderRadius: 1,
                                        "&:hover": {
                                            backgroundColor: "#f9f9f9"
                                        }
                                    }}
                                >
                                    {item.image && (
                                        <Avatar
                                            src={item.image}
                                            sx={{ mr: 2, width: 50, height: 50 }}
                                        >
                                            <RestaurantIcon />
                                        </Avatar>
                                    )}

                                    <ListItemText
                                        primary={
                                            <MDBox display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                                <MDTypography variant="h6">
                                                    {item.name}
                                                </MDTypography>
                                                <Chip
                                                    label={getCategoryName(item.categoryId)}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                                <Chip
                                                    label={item.isAvailable ? "Mevcut" : "Tükendi"}
                                                    color={item.isAvailable ? "success" : "error"}
                                                    size="small"
                                                />
                                                {item.isVegetarian && <Chip label="Vejetaryen" size="small" color="success" />}
                                                {item.isVegan && <Chip label="Vegan" size="small" color="success" />}
                                                {item.isGlutenFree && <Chip label="Glütensiz" size="small" color="info" />}
                                                {item.spicyLevel && (
                                                    <Chip
                                                        label={`${'🌶️'.repeat(item.spicyLevel)}`}
                                                        size="small"
                                                        color="warning"
                                                    />
                                                )}
                                            </MDBox>
                                        }
                                        secondary={
                                            <MDBox>
                                                {item.description && (
                                                    <MDTypography variant="body2" color="text" mb={1}>
                                                        {item.description}
                                                    </MDTypography>
                                                )}
                                                <MDBox display="flex" alignItems="center" gap={2} flexWrap="wrap">
                                                    <MDBox display="flex" alignItems="center" gap={0.5}>
                                                        <PriceIcon fontSize="small" />
                                                        <MDTypography variant="body2" fontWeight="bold">
                                                            ₺{item.price.toFixed(2)}
                                                        </MDTypography>
                                                    </MDBox>
                                                    {item.preparationTime && (
                                                        <MDBox display="flex" alignItems="center" gap={0.5}>
                                                            <TimeIcon fontSize="small" />
                                                            <MDTypography variant="body2">
                                                                {item.preparationTime} dk
                                                            </MDTypography>
                                                        </MDBox>
                                                    )}
                                                    {item.allergens && item.allergens.length > 0 && (
                                                        <MDBox display="flex" alignItems="center" gap={0.5}>
                                                            <AllergenIcon fontSize="small" color="warning" />
                                                            <MDTypography variant="body2">
                                                                Alerjen içerir
                                                            </MDTypography>
                                                        </MDBox>
                                                    )}
                                                </MDBox>
                                            </MDBox>
                                        }
                                    />

                                    <ListItemSecondaryAction>
                                        <MDBox display="flex" gap={1}>
                                            <IconButton
                                                size="small"
                                                onClick={() => toggleItemStatus(item.id)}
                                                color={item.isAvailable ? "success" : "default"}
                                            >
                                                {item.isAvailable ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditItem(item)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteItem(item)}
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
                                Toplam {items.length} ürün • {items.filter(i => i.isAvailable).length} mevcut
                            </MDTypography>
                            <MDButton
                                variant="outlined"
                                color="info"
                                startIcon={<AddIcon />}
                                onClick={handleAddItem}
                            >
                                Ürün Ekle
                            </MDButton>
                        </MDBox>
                    </>
                )}
            </MDBox>

            {/* Ürün Formu */}
            <ItemForm
                open={dialogOpen}
                item={editingItem}
                categories={categories}
                onClose={() => setDialogOpen(false)}
                onSave={handleSaveItem}
            />

            {/* Silme Onayı */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Ürünü Sil</DialogTitle>
                <DialogContent>
                    <MDTypography variant="body1">
                        &ldquo;{itemToDelete?.name}&rdquo; ürününü silmek istediğinizden emin misiniz?
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
        </Card>
    );
}
