import React from "react";
import { Card, Grid, TextField, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { STAGE_LABELS } from "../../utils/opportunityFormUtils";

interface OpportunityFiltersProps {
    q: string;
    stage: string;
    source: string;
    ownerId: string;
    sort: string;
    onFilter: (filters: Record<string, string>) => void;
}

export default function OpportunityFilters({
    q,
    stage,
    source,
    ownerId,
    sort,
    onFilter,
}: OpportunityFiltersProps): JSX.Element {
    return (
        <Card sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Ara"
                        placeholder="Başlık, müşteri, açıklama..."
                        value={q}
                        onChange={(e) => onFilter({ q: e.target.value })}
                    />
                </Grid>
                
                <Grid item xs={12} sm={6} md={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Aşama</InputLabel>
                        <Select
                            value={stage}
                            label="Aşama"
                            onChange={(e) => onFilter({ stage: e.target.value })}
                        >
                            <MenuItem value="">Tümü</MenuItem>
                            {Object.entries(STAGE_LABELS).map(([key, label]) => (
                                <MenuItem key={key} value={key}>
                                    {String(label)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Kaynak</InputLabel>
                        <Select
                            value={source}
                            label="Kaynak"
                            onChange={(e) => onFilter({ source: e.target.value })}
                        >
                            <MenuItem value="">Tümü</MenuItem>
                            <MenuItem value="website">Web Sitesi</MenuItem>
                            <MenuItem value="referral">Referans</MenuItem>
                            <MenuItem value="cold_call">Soğuk Arama</MenuItem>
                            <MenuItem value="trade_show">Fuar</MenuItem>
                            <MenuItem value="partner">Partner</MenuItem>
                            <MenuItem value="other">Diğer</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Sahip</InputLabel>
                        <Select
                            value={ownerId}
                            label="Sahip"
                            onChange={(e) => onFilter({ ownerId: e.target.value })}
                        >
                            <MenuItem value="">Tümü</MenuItem>
                            {/* Burada kullanıcı listesi dinamik olarak gelecek */}
                        </Select>
                    </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Sıralama</InputLabel>
                        <Select
                            value={sort}
                            label="Sıralama"
                            onChange={(e) => onFilter({ sort: e.target.value })}
                        >
                            <MenuItem value="recent">En Yeni</MenuItem>
                            <MenuItem value="amount">Tutara Göre</MenuItem>
                            <MenuItem value="probability">Olasılığa Göre</MenuItem>
                            <MenuItem value="title">Başlığa Göre</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Card>
    );
}
