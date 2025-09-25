import React from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Chip,
    Box,
    Avatar,
    Skeleton,
    IconButton,
    Tooltip,
} from "@mui/material";
import { Edit, Visibility } from "@mui/icons-material";
import { STAGE_LABELS, STAGE_COLORS } from "../../utils/opportunityFormUtils";
import { currency } from "../../lib/format";

interface OpportunityGridProps {
    opportunities: any[];
    loading?: boolean;
    onOpportunityClick?: (id: string) => void;
    onEditClick?: (id: string) => void;
}

export default function MuiOpportunityGrid({
    opportunities,
    loading = false,
    onOpportunityClick,
    onEditClick,
}: OpportunityGridProps): JSX.Element {
    if (loading) {
        return (
            <Grid container spacing={3}>
                {Array.from({ length: 6 }).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardContent>
                                <Skeleton variant="text" width="60%" height={32} />
                                <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
                                <Skeleton variant="text" width="80%" height={20} sx={{ mt: 2 }} />
                                <Box display="flex" justifyContent="space-between" mt={2}>
                                    <Skeleton variant="rectangular" width={80} height={24} />
                                    <Skeleton variant="rectangular" width={60} height={24} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    }

    if (opportunities.length === 0) {
        return (
            <Card>
                <CardContent>
                    <Box textAlign="center" py={4}>
                        <Typography variant="h6" color="text.secondary">
                            Henüz fırsat bulunmuyor
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={1}>
                            Yeni fırsat oluşturmak için &quot;Yeni Fırsat&quot; butonunu kullanın.
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Grid container spacing={3}>
            {opportunities.map((opportunity) => (
                <Grid item xs={12} sm={6} md={4} key={opportunity.id}>
                    <Card 
                        sx={{ 
                            height: '100%',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 4,
                            }
                        }}
                        onClick={() => onOpportunityClick?.(opportunity.id)}
                    >
                        <CardContent>
                            {/* Header */}
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                <Typography 
                                    variant="h6" 
                                    component="div" 
                                    sx={{ 
                                        fontWeight: 600,
                                        fontSize: '1.1rem',
                                        lineHeight: 1.3,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                    }}
                                >
                                    {opportunity.title}
                                </Typography>
                                
                                <Box display="flex" gap={0.5}>
                                    <Tooltip title="Görüntüle">
                                        <IconButton 
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onOpportunityClick?.(opportunity.id);
                                            }}
                                        >
                                            <Visibility fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Düzenle">
                                        <IconButton 
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEditClick?.(opportunity.id);
                                            }}
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>

                            {/* Customer */}
                            <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                gutterBottom
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {opportunity.customerName || "Müşteri belirtilmemiş"}
                            </Typography>

                            {/* Stage */}
                            <Box mb={2}>
                                <Chip
                                    label={STAGE_LABELS[opportunity.stage as keyof typeof STAGE_LABELS] || "Bilinmiyor"}
                                    size="small"
                                    sx={{
                                        backgroundColor: STAGE_COLORS[opportunity.stage as keyof typeof STAGE_COLORS] || '#2196F3',
                                        color: 'white',
                                        fontWeight: 500,
                                    }}
                                />
                            </Box>

                            {/* Amount and Probability */}
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                                    {opportunity.amount 
                                        ? currency(opportunity.amount)
                                        : "Tutar belirtilmemiş"
                                    }
                                </Typography>
                                {opportunity.probability && (
                                    <Chip 
                                        label={`%${opportunity.probability}`}
                                        variant="outlined"
                                        size="small"
                                        color="primary"
                                    />
                                )}
                            </Box>

                            {/* Expected Close Date */}
                            {opportunity.expectedCloseDate && (
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Beklenen Kapanış: {new Date(opportunity.expectedCloseDate).toLocaleDateString("tr-TR")}
                                </Typography>
                            )}

                            {/* Owner */}
                            <Box display="flex" alignItems="center" mt={2}>
                                <Avatar 
                                    sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}
                                >
                                    {opportunity.ownerName?.charAt(0)?.toUpperCase() || "?"}
                                </Avatar>
                                <Typography variant="body2" color="text.secondary">
                                    {opportunity.ownerName || "Sahip belirtilmemiş"}
                                </Typography>
                            </Box>

                            {/* Description */}
                            {opportunity.description && (
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary" 
                                    sx={{ 
                                        mt: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                    }}
                                >
                                    {opportunity.description}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
