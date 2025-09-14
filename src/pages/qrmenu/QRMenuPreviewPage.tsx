import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Card,
    Typography,
    Grid,
    Chip,
    Avatar,
    Divider,
    IconButton,
    Fab,
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Rating,
    AppBar,
    Toolbar,
    Container,
    CardMedia,
    CardContent,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import {
    Phone as PhoneIcon,
    Email as EmailIcon,
    Language as WebsiteIcon,
    LocationOn as LocationIcon,
    Instagram as InstagramIcon,
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    Schedule as TimeIcon,
    Restaurant as RestaurantIcon,
    Warning as AllergenIcon,
    // Eco as VeganIcon, // Not available in this version
    ExpandMore as ExpandMoreIcon,
    Close as CloseIcon
} from "@mui/icons-material";
import { Menu as QRMenu, MenuItem as MenuItemType, MenuCategory } from "types/qrmenu";

// Mock data - gerçek uygulamada API'den gelecek
const mockMenu: QRMenu = {
    id: "1",
    customerId: "customer-1",
    name: "Restoran XYZ - Ana Menü",
    description: "Geleneksel Türk mutfağının en lezzetli yemekleri",
    isActive: true,
    theme: {
        primaryColor: "#D32F2F",
        secondaryColor: "#FF9800",
        backgroundColor: "#FFFFFF",
        textColor: "#333333",
        fontFamily: "Roboto",
        logoUrl: "https://via.placeholder.com/200x80/D32F2F/FFFFFF?text=LOGO"
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
        language: "tr",
        contactInfo: {
            phone: "+90 555 123 45 67",
            email: "info@restoranxyz.com",
            address: "Atatürk Caddesi No: 123, Kadıköy/İstanbul",
            website: "https://www.restoranxyz.com",
            socialMedia: {
                instagram: "@restoranxyz",
                facebook: "restoranxyz",
                twitter: "@restoranxyz"
            }
        }
    },
    categories: [
        {
            id: "cat-1",
            name: "Çorbalar",
            description: "Geleneksel Türk çorbaları",
            order: 0,
            isActive: true,
            image: "https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Çorbalar",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z"
        },
        {
            id: "cat-2",
            name: "Ana Yemekler",
            description: "Et ve tavuk yemekleri",
            order: 1,
            isActive: true,
            image: "https://via.placeholder.com/300x200/D32F2F/FFFFFF?text=Ana+Yemekler",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z"
        },
        {
            id: "cat-3",
            name: "Tatlılar",
            description: "Geleneksel ve modern tatlılar",
            order: 2,
            isActive: true,
            image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Tatlılar",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z"
        }
    ],
    items: [
        {
            id: "item-1",
            categoryId: "cat-1",
            name: "Mercimek Çorbası",
            description: "Geleneksel kırmızı mercimek çorbası, limon ve baharatlarla",
            price: 25.00,
            currency: "TRY",
            image: "https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Mercimek+Çorbası",
            ingredients: ["Kırmızı mercimek", "Soğan", "Havuç", "Baharatlar"],
            allergens: ["Glüten"],
            isAvailable: true,
            isVegetarian: true,
            isVegan: false,
            isGlutenFree: false,
            preparationTime: 15,
            order: 0,
            tags: ["Sıcak", "Geleneksel"],
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z"
        },
        {
            id: "item-2",
            categoryId: "cat-2",
            name: "Adana Kebap",
            description: "Özel baharatlarla hazırlanmış acılı kıyma kebabı, pilav ve salata ile",
            price: 85.00,
            currency: "TRY",
            image: "https://via.placeholder.com/300x200/D32F2F/FFFFFF?text=Adana+Kebap",
            ingredients: ["Dana kıyma", "Özel baharatlar", "Pilav", "Salata"],
            allergens: [],
            isAvailable: true,
            isVegetarian: false,
            isVegan: false,
            isGlutenFree: true,
            spicyLevel: 3,
            preparationTime: 25,
            order: 0,
            tags: ["Acılı", "Izgara"],
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z"
        },
        {
            id: "item-3",
            categoryId: "cat-3",
            name: "Baklava",
            description: "Antep fıstıklı geleneksel baklava, şerbetli",
            price: 45.00,
            currency: "TRY",
            image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Baklava",
            ingredients: ["Yufka", "Antep fıstığı", "Şerbet", "Tereyağı"],
            allergens: ["Glüten", "Süt", "Fındık"],
            isAvailable: true,
            isVegetarian: true,
            isVegan: false,
            isGlutenFree: false,
            preparationTime: 5,
            order: 0,
            tags: ["Tatlı", "Geleneksel"],
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z"
        }
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
};

interface MenuItemDetailProps {
    item: MenuItemType;
    open: boolean;
    onClose: () => void;
    settings: QRMenu['settings'];
    theme: QRMenu['theme'];
}

function MenuItemDetail({ item, open, onClose, settings, theme }: MenuItemDetailProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogContent sx={{ p: 0 }}>
                {settings.showImages && item.image && (
                    <CardMedia
                        component="img"
                        height="200"
                        image={item.image}
                        alt={item.name}
                    />
                )}

                <Box p={3}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Typography variant="h5" fontWeight="bold" color={theme.primaryColor}>
                            {item.name}
                        </Typography>
                        <IconButton onClick={onClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {settings.showPrices && (
                        <Typography variant="h6" color={theme.secondaryColor} mb={2}>
                            ₺{item.price.toFixed(2)}
                        </Typography>
                    )}

                    {settings.showDescription && item.description && (
                        <Typography variant="body1" color="text.secondary" mb={2}>
                            {item.description}
                        </Typography>
                    )}

                    {/* Özellikler */}
                    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                        {item.isVegetarian && (
                            <Chip label="Vejetaryen" size="small" color="success" />
                        )}
                        {item.isVegan && (
                            <Chip label="Vegan" size="small" color="success" />
                        )}
                        {item.isGlutenFree && (
                            <Chip label="Glütensiz" size="small" color="info" />
                        )}
                        {item.spicyLevel && (
                            <Chip
                                label={`Acılık: ${'🌶️'.repeat(item.spicyLevel)}`}
                                size="small"
                                color="warning"
                            />
                        )}
                    </Box>

                    {settings.showPreparationTime && item.preparationTime && (
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <TimeIcon fontSize="small" />
                            <Typography variant="body2">
                                Hazırlık süresi: {item.preparationTime} dakika
                            </Typography>
                        </Box>
                    )}

                    {/* İçerikler */}
                    {item.ingredients && item.ingredients.length > 0 && (
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle2">İçerikler</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                    {item.ingredients.map((ingredient) => (
                                        <Chip
                                            key={ingredient}
                                            label={ingredient}
                                            size="small"
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    )}

                    {/* Alerjenler */}
                    {settings.showAllergens && item.allergens && item.allergens.length > 0 && (
                        <Box mt={2}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <AllergenIcon color="warning" fontSize="small" />
                                <Typography variant="subtitle2" color="warning.main">
                                    Alerjen Uyarısı
                                </Typography>
                            </Box>
                            <Box display="flex" flexWrap="wrap" gap={1}>
                                {item.allergens.map((allergen) => (
                                    <Chip
                                        key={allergen}
                                        label={allergen}
                                        size="small"
                                        color="warning"
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* Etiketler */}
                    {item.tags && item.tags.length > 0 && (
                        <Box mt={2}>
                            <Typography variant="subtitle2" mb={1}>Etiketler</Typography>
                            <Box display="flex" flexWrap="wrap" gap={1}>
                                {item.tags.map((tag) => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        size="small"
                                        variant="outlined"
                                        sx={{ color: theme.primaryColor, borderColor: theme.primaryColor }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default function QRMenuPreviewPage(): JSX.Element {
    const { id } = useParams();
    const [menu, setMenu] = useState<QRMenu | null>(null);
    const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
    const [contactDialogOpen, setContactDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gerçek uygulamada API'den menü verisi yüklenecek
        setTimeout(() => {
            setMenu(mockMenu);
            setLoading(false);
        }, 1000);
    }, [id]);

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                bgcolor="#f5f5f5"
            >
                <Typography variant="h6">Menü yükleniyor...</Typography>
            </Box>
        );
    }

    if (!menu) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                bgcolor="#f5f5f5"
            >
                <Typography variant="h6">Menü bulunamadı</Typography>
            </Box>
        );
    }

    const { theme, settings } = menu;

    const getItemsByCategory = (categoryId: string) => {
        return menu.items
            .filter(item => item.categoryId === categoryId && item.isAvailable)
            .sort((a, b) => a.order - b.order);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                fontFamily: theme.fontFamily
            }}
        >
            {/* Header */}
            <AppBar
                position="sticky"
                sx={{
                    backgroundColor: theme.primaryColor,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
            >
                <Toolbar>
                    <Container maxWidth="md">
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            {theme.logoUrl ? (
                                <img
                                    src={theme.logoUrl}
                                    alt={menu.name}
                                    style={{ height: 40, objectFit: "contain" }}
                                />
                            ) : (
                                <Typography variant="h6" fontWeight="bold">
                                    {menu.name}
                                </Typography>
                            )}

                            {settings.contactInfo && (
                                <IconButton
                                    color="inherit"
                                    onClick={() => setContactDialogOpen(true)}
                                >
                                    <PhoneIcon />
                                </IconButton>
                            )}
                        </Box>
                    </Container>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ py: 3 }}>
                {/* Menü Başlığı */}
                <Box textAlign="center" mb={4}>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        color={theme.primaryColor}
                        mb={1}
                    >
                        {menu.name}
                    </Typography>
                    {menu.description && (
                        <Typography variant="body1" color="text.secondary">
                            {menu.description}
                        </Typography>
                    )}
                </Box>

                {/* Kategoriler ve Ürünler */}
                {menu.categories
                    .filter(category => category.isActive)
                    .sort((a, b) => a.order - b.order)
                    .map((category) => {
                        const categoryItems = getItemsByCategory(category.id);

                        if (categoryItems.length === 0) return null;

                        return (
                            <Box key={category.id} mb={4}>
                                {/* Kategori Başlığı */}
                                <Card
                                    sx={{
                                        mb: 2,
                                        background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                                        color: "white"
                                    }}
                                >
                                    <CardContent>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            {settings.showImages && category.image && (
                                                <Avatar
                                                    src={category.image}
                                                    sx={{ width: 60, height: 60 }}
                                                >
                                                    <RestaurantIcon />
                                                </Avatar>
                                            )}
                                            <Box>
                                                <Typography variant="h5" fontWeight="bold">
                                                    {category.name}
                                                </Typography>
                                                {settings.showDescription && category.description && (
                                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                        {category.description}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>

                                {/* Kategori Ürünleri */}
                                <Grid container spacing={2}>
                                    {categoryItems.map((item) => (
                                        <Grid item xs={12} sm={6} key={item.id}>
                                            <Card
                                                sx={{
                                                    height: "100%",
                                                    cursor: "pointer",
                                                    transition: "transform 0.2s, box-shadow 0.2s",
                                                    "&:hover": {
                                                        transform: "translateY(-2px)",
                                                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                                                    }
                                                }}
                                                onClick={() => setSelectedItem(item)}
                                            >
                                                {settings.showImages && item.image && (
                                                    <CardMedia
                                                        component="img"
                                                        height="140"
                                                        image={item.image}
                                                        alt={item.name}
                                                    />
                                                )}

                                                <CardContent>
                                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                                        <Typography variant="h6" fontWeight="bold">
                                                            {item.name}
                                                        </Typography>
                                                        {settings.showPrices && (
                                                            <Typography
                                                                variant="h6"
                                                                color={theme.secondaryColor}
                                                                fontWeight="bold"
                                                            >
                                                                ₺{item.price.toFixed(2)}
                                                            </Typography>
                                                        )}
                                                    </Box>

                                                    {settings.showDescription && item.description && (
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            mb={2}
                                                            sx={{
                                                                display: "-webkit-box",
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: "vertical",
                                                                overflow: "hidden"
                                                            }}
                                                        >
                                                            {item.description}
                                                        </Typography>
                                                    )}

                                                    {/* Ürün Özellikleri */}
                                                    <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
                                                        {item.isVegetarian && (
                                                            <Chip label="🌱" size="small" />
                                                        )}
                                                        {item.isVegan && (
                                                            <Chip label="🌿" size="small" />
                                                        )}
                                                        {item.isGlutenFree && (
                                                            <Chip label="GF" size="small" color="info" />
                                                        )}
                                                        {item.spicyLevel && (
                                                            <Chip
                                                                label={'🌶️'.repeat(item.spicyLevel)}
                                                                size="small"
                                                            />
                                                        )}
                                                    </Box>

                                                    {settings.showPreparationTime && item.preparationTime && (
                                                        <Box display="flex" alignItems="center" gap={0.5}>
                                                            <TimeIcon fontSize="small" color="action" />
                                                            <Typography variant="caption" color="text.secondary">
                                                                {item.preparationTime} dk
                                                            </Typography>
                                                        </Box>
                                                    )}

                                                    {settings.showAllergens && item.allergens && item.allergens.length > 0 && (
                                                        <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                                                            <AllergenIcon fontSize="small" color="warning" />
                                                            <Typography variant="caption" color="warning.main">
                                                                Alerjen içerir
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        );
                    })}

                {/* Footer */}
                <Box textAlign="center" mt={6} py={3}>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                        Bu menü QR kod ile oluşturulmuştur
                    </Typography>
                </Box>
            </Container>

            {/* İletişim FAB */}
            {settings.contactInfo && (
                <Fab
                    color="primary"
                    sx={{
                        position: "fixed",
                        bottom: 16,
                        right: 16,
                        backgroundColor: theme.secondaryColor,
                        "&:hover": {
                            backgroundColor: theme.primaryColor
                        }
                    }}
                    onClick={() => setContactDialogOpen(true)}
                >
                    <PhoneIcon />
                </Fab>
            )}

            {/* Ürün Detay Dialog */}
            {selectedItem && (
                <MenuItemDetail
                    item={selectedItem}
                    open={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                    settings={settings}
                    theme={theme}
                />
            )}

            {/* İletişim Dialog */}
            <Dialog
                open={contactDialogOpen}
                onClose={() => setContactDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogContent>
                    <Typography variant="h6" mb={3} color={theme.primaryColor}>
                        İletişim Bilgileri
                    </Typography>

                    {settings.contactInfo && (
                        <Box display="flex" flexDirection="column" gap={2}>
                            {settings.contactInfo.phone && (
                                <Box display="flex" alignItems="center" gap={2}>
                                    <PhoneIcon color="primary" />
                                    <Typography>{settings.contactInfo.phone}</Typography>
                                </Box>
                            )}

                            {settings.contactInfo.email && (
                                <Box display="flex" alignItems="center" gap={2}>
                                    <EmailIcon color="primary" />
                                    <Typography>{settings.contactInfo.email}</Typography>
                                </Box>
                            )}

                            {settings.contactInfo.address && (
                                <Box display="flex" alignItems="center" gap={2}>
                                    <LocationIcon color="primary" />
                                    <Typography>{settings.contactInfo.address}</Typography>
                                </Box>
                            )}

                            {settings.contactInfo.website && (
                                <Box display="flex" alignItems="center" gap={2}>
                                    <WebsiteIcon color="primary" />
                                    <Typography>{settings.contactInfo.website}</Typography>
                                </Box>
                            )}

                            {settings.contactInfo.socialMedia && (
                                <Box>
                                    <Typography variant="subtitle2" mb={1}>Sosyal Medya</Typography>
                                    <Box display="flex" gap={1}>
                                        {settings.contactInfo.socialMedia.instagram && (
                                            <IconButton color="primary">
                                                <InstagramIcon />
                                            </IconButton>
                                        )}
                                        {settings.contactInfo.socialMedia.facebook && (
                                            <IconButton color="primary">
                                                <FacebookIcon />
                                            </IconButton>
                                        )}
                                        {settings.contactInfo.socialMedia.twitter && (
                                            <IconButton color="primary">
                                                <TwitterIcon />
                                            </IconButton>
                                        )}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setContactDialogOpen(false)}>Kapat</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
