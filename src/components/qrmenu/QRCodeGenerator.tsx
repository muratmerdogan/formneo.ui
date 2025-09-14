import React, { useState, useEffect } from "react";
import {
    Box,
    Card,
    Typography,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    Switch,
    FormControlLabel,
    Divider
} from "@mui/material";
import {
    Download as DownloadIcon,
    Refresh as RefreshIcon,
    Share as ShareIcon
} from "@mui/icons-material";
import QRCode from "qrcode";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

interface QRCodeGeneratorProps {
    menuId: string;
    menuName: string;
    baseUrl?: string;
    onQRGenerated?: (qrCodeUrl: string, menuUrl: string) => void;
}

interface QROptions {
    size: number;
    margin: number;
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
    color: {
        dark: string;
        light: string;
    };
    includeMenuName: boolean;
    includeLogo: boolean;
    logoUrl?: string;
}

const defaultOptions: QROptions = {
    size: 300,
    margin: 4,
    errorCorrectionLevel: 'M',
    color: {
        dark: '#000000',
        light: '#FFFFFF'
    },
    includeMenuName: true,
    includeLogo: false
};

export default function QRCodeGenerator({
    menuId,
    menuName,
    baseUrl = window.location.origin,
    onQRGenerated
}: QRCodeGeneratorProps): JSX.Element {
    const [qrOptions, setQrOptions] = useState<QROptions>(defaultOptions);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
    const [menuUrl, setMenuUrl] = useState<string>("");
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const url = `${baseUrl}/menu/${menuId}`;
        setMenuUrl(url);
        generateQRCode(url);
    }, [menuId, baseUrl, qrOptions]);

    const generateQRCode = async (url: string) => {
        setIsGenerating(true);
        try {
            const qrCodeUrl = await QRCode.toDataURL(url, {
                width: qrOptions.size,
                margin: qrOptions.margin,
                errorCorrectionLevel: qrOptions.errorCorrectionLevel,
                color: qrOptions.color
            });

            setQrCodeDataUrl(qrCodeUrl);
            onQRGenerated?.(qrCodeUrl, url);
        } catch (error) {
            console.error('QR kod oluşturma hatası:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleOptionChange = (key: keyof QROptions, value: any) => {
        setQrOptions(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleColorChange = (colorType: 'dark' | 'light', color: string) => {
        setQrOptions(prev => ({
            ...prev,
            color: {
                ...prev.color,
                [colorType]: color
            }
        }));
    };

    const downloadQRCode = () => {
        if (!qrCodeDataUrl) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = qrOptions.includeMenuName ? img.height + 60 : img.height;

            // QR kodu çiz
            ctx?.drawImage(img, 0, 0);

            // Menü adını ekle
            if (qrOptions.includeMenuName && ctx) {
                ctx.fillStyle = qrOptions.color.dark;
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(menuName, canvas.width / 2, canvas.height - 20);
            }

            // İndir
            const link = document.createElement('a');
            link.download = `qr-menu-${menuName.replace(/\s+/g, '-').toLowerCase()}.png`;
            link.href = canvas.toDataURL();
            link.click();
        };

        img.src = qrCodeDataUrl;
    };

    const shareQRCode = async () => {
        if (navigator.share && qrCodeDataUrl) {
            try {
                // Canvas'tan blob oluştur
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();

                img.onload = async () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx?.drawImage(img, 0, 0);

                    canvas.toBlob(async (blob) => {
                        if (blob) {
                            const file = new File([blob], `qr-menu-${menuName}.png`, { type: 'image/png' });
                            await navigator.share({
                                title: `QR Menü - ${menuName}`,
                                text: `${menuName} menüsüne erişmek için QR kodu`,
                                files: [file]
                            });
                        }
                    });
                };

                img.src = qrCodeDataUrl;
            } catch (error) {
                console.error('Paylaşım hatası:', error);
                // Fallback: URL'yi kopyala
                navigator.clipboard.writeText(menuUrl);
                alert('Menü URL\'si panoya kopyalandı!');
            }
        } else {
            // Fallback: URL'yi kopyala
            navigator.clipboard.writeText(menuUrl);
            alert('Menü URL\'si panoya kopyalandı!');
        }
    };

    return (
        <Card>
            <MDBox p={3}>
                <MDTypography variant="h5" mb={3}>
                    QR Kod Oluşturucu
                </MDTypography>

                <Grid container spacing={3}>
                    {/* QR Kod Önizleme */}
                    <Grid item xs={12} md={6}>
                        <MDBox textAlign="center">
                            <MDTypography variant="h6" mb={2}>
                                Önizleme
                            </MDTypography>

                            {qrCodeDataUrl && (
                                <MDBox mb={2}>
                                    <img
                                        src={qrCodeDataUrl}
                                        alt="QR Kod"
                                        style={{
                                            maxWidth: '100%',
                                            height: 'auto',
                                            border: '1px solid #ddd',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    {qrOptions.includeMenuName && (
                                        <MDTypography variant="body2" mt={1} fontWeight="bold">
                                            {menuName}
                                        </MDTypography>
                                    )}
                                </MDBox>
                            )}

                            <MDBox display="flex" gap={1} justifyContent="center" flexWrap="wrap">
                                <MDButton
                                    variant="gradient"
                                    color="success"
                                    startIcon={<DownloadIcon />}
                                    onClick={downloadQRCode}
                                    disabled={!qrCodeDataUrl}
                                >
                                    İndir
                                </MDButton>
                                <MDButton
                                    variant="outlined"
                                    color="info"
                                    startIcon={<ShareIcon />}
                                    onClick={shareQRCode}
                                    disabled={!qrCodeDataUrl}
                                >
                                    Paylaş
                                </MDButton>
                                <MDButton
                                    variant="outlined"
                                    color="dark"
                                    startIcon={<RefreshIcon />}
                                    onClick={() => generateQRCode(menuUrl)}
                                    disabled={isGenerating}
                                >
                                    Yenile
                                </MDButton>
                            </MDBox>

                            <MDBox mt={2}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Menü URL'si"
                                    value={menuUrl}
                                    InputProps={{ readOnly: true }}
                                    onClick={(e) => (e.target as HTMLInputElement).select()}
                                />
                            </MDBox>
                        </MDBox>
                    </Grid>

                    {/* QR Kod Ayarları */}
                    <Grid item xs={12} md={6}>
                        <MDTypography variant="h6" mb={2}>
                            QR Kod Ayarları
                        </MDTypography>

                        <MDBox display="flex" flexDirection="column" gap={2}>
                            {/* Boyut */}
                            <MDBox>
                                <MDTypography variant="caption" fontWeight="medium" mb={1}>
                                    Boyut: {qrOptions.size}px
                                </MDTypography>
                                <Slider
                                    value={qrOptions.size}
                                    onChange={(_, value) => handleOptionChange('size', value)}
                                    min={200}
                                    max={800}
                                    step={50}
                                    marks
                                    valueLabelDisplay="auto"
                                />
                            </MDBox>

                            {/* Kenar Boşluğu */}
                            <MDBox>
                                <MDTypography variant="caption" fontWeight="medium" mb={1}>
                                    Kenar Boşluğu: {qrOptions.margin}
                                </MDTypography>
                                <Slider
                                    value={qrOptions.margin}
                                    onChange={(_, value) => handleOptionChange('margin', value)}
                                    min={0}
                                    max={10}
                                    step={1}
                                    marks
                                    valueLabelDisplay="auto"
                                />
                            </MDBox>

                            {/* Hata Düzeltme Seviyesi */}
                            <FormControl fullWidth size="small">
                                <InputLabel>Hata Düzeltme Seviyesi</InputLabel>
                                <Select
                                    value={qrOptions.errorCorrectionLevel}
                                    onChange={(e) => handleOptionChange('errorCorrectionLevel', e.target.value)}
                                    label="Hata Düzeltme Seviyesi"
                                >
                                    <MenuItem value="L">Düşük (L)</MenuItem>
                                    <MenuItem value="M">Orta (M)</MenuItem>
                                    <MenuItem value="Q">Yüksek (Q)</MenuItem>
                                    <MenuItem value="H">En Yüksek (H)</MenuItem>
                                </Select>
                            </FormControl>

                            <Divider />

                            {/* Renkler */}
                            <MDTypography variant="subtitle2" fontWeight="medium">
                                Renkler
                            </MDTypography>

                            <MDBox display="flex" gap={2}>
                                <MDBox flex={1}>
                                    <MDTypography variant="caption" mb={1}>
                                        Ön Plan Rengi
                                    </MDTypography>
                                    <MDBox display="flex" alignItems="center" gap={1}>
                                        <Box
                                            sx={{
                                                width: 30,
                                                height: 30,
                                                backgroundColor: qrOptions.color.dark,
                                                border: '1px solid #ddd',
                                                borderRadius: 1,
                                                cursor: 'pointer'
                                            }}
                                        />
                                        <TextField
                                            size="small"
                                            value={qrOptions.color.dark}
                                            onChange={(e) => handleColorChange('dark', e.target.value)}
                                            sx={{ flex: 1 }}
                                        />
                                    </MDBox>
                                </MDBox>

                                <MDBox flex={1}>
                                    <MDTypography variant="caption" mb={1}>
                                        Arka Plan Rengi
                                    </MDTypography>
                                    <MDBox display="flex" alignItems="center" gap={1}>
                                        <Box
                                            sx={{
                                                width: 30,
                                                height: 30,
                                                backgroundColor: qrOptions.color.light,
                                                border: '1px solid #ddd',
                                                borderRadius: 1,
                                                cursor: 'pointer'
                                            }}
                                        />
                                        <TextField
                                            size="small"
                                            value={qrOptions.color.light}
                                            onChange={(e) => handleColorChange('light', e.target.value)}
                                            sx={{ flex: 1 }}
                                        />
                                    </MDBox>
                                </MDBox>
                            </MDBox>

                            <Divider />

                            {/* Ek Seçenekler */}
                            <MDTypography variant="subtitle2" fontWeight="medium">
                                Ek Seçenekler
                            </MDTypography>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={qrOptions.includeMenuName}
                                        onChange={(e) => handleOptionChange('includeMenuName', e.target.checked)}
                                    />
                                }
                                label="Menü adını ekle"
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={qrOptions.includeLogo}
                                        onChange={(e) => handleOptionChange('includeLogo', e.target.checked)}
                                    />
                                }
                                label="Logo ekle (yakında)"
                                disabled
                            />
                        </MDBox>
                    </Grid>
                </Grid>
            </MDBox>
        </Card>
    );
}
