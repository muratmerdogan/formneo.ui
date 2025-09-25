import React from "react";
import {
    Card,
    CardContent,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Typography,
    InputAdornment,
} from "@mui/material";
import { STAGE_LABELS } from "../../../utils/opportunityFormUtils";

interface BasicOpportunityInfoSectionProps {
    register: any;
    errors: any;
    watch: any;
    setValue: any;
    trigger: any;
    getValues: any;
}

export default function BasicOpportunityInfoSection({
    register,
    errors,
    watch,
    setValue,
    trigger,
    getValues,
}: BasicOpportunityInfoSectionProps): JSX.Element {
    const watchedStage = watch("stage");
    const watchedCurrency = watch("currency");

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                    Temel Bilgiler
                </Typography>
                
                <Grid container spacing={3}>
                    {/* Başlık */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Fırsat Başlığı"
                            required
                            error={!!errors.title}
                            helperText={errors.title?.message}
                            {...register("title")}
                        />
                    </Grid>

                    {/* Müşteri Seçimi */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Müşteri ID"
                            required
                            error={!!errors.customerId}
                            helperText={errors.customerId?.message || "Müşteri seçimi için lookup bileşeni eklenecek"}
                            {...register("customerId")}
                        />
                    </Grid>

                    {/* Aşama */}
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={!!errors.stage}>
                            <InputLabel>Aşama</InputLabel>
                            <Select
                                value={watchedStage || 1}
                                label="Aşama"
                                onChange={(e) => setValue("stage", Number(e.target.value))}
                            >
                                {Object.entries(STAGE_LABELS).map(([key, label]) => (
                                    <MenuItem key={key} value={Number(key)}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.stage && (
                                <FormHelperText>{errors.stage.message}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    {/* Sahip */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Sahip Kullanıcı ID"
                            required
                            error={!!errors.ownerUserId}
                            helperText={errors.ownerUserId?.message || "Kullanıcı seçimi için lookup bileşeni eklenecek"}
                            {...register("ownerUserId")}
                        />
                    </Grid>

                    {/* Tutar */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Tutar"
                            type="number"
                            InputProps={{
                                inputProps: { min: 0, step: 0.01 }
                            }}
                            error={!!errors.amount}
                            helperText={errors.amount?.message}
                            {...register("amount", { 
                                setValueAs: (value: string) => value === "" ? null : Number(value) 
                            })}
                        />
                    </Grid>

                    {/* Para Birimi */}
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth error={!!errors.currency}>
                            <InputLabel>Para Birimi</InputLabel>
                            <Select
                                value={watchedCurrency || "TRY"}
                                label="Para Birimi"
                                onChange={(e) => setValue("currency", e.target.value)}
                            >
                                <MenuItem value="TRY">TRY</MenuItem>
                                <MenuItem value="USD">USD</MenuItem>
                                <MenuItem value="EUR">EUR</MenuItem>
                                <MenuItem value="GBP">GBP</MenuItem>
                            </Select>
                            {errors.currency && (
                                <FormHelperText>{errors.currency.message}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    {/* Olasılık */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Olasılık"
                            type="number"
                            InputProps={{
                                inputProps: { min: 0, max: 100 },
                                endAdornment: <InputAdornment position="end">%</InputAdornment>
                            }}
                            error={!!errors.probability}
                            helperText={errors.probability?.message}
                            {...register("probability", { 
                                setValueAs: (value: string) => value === "" ? null : Number(value) 
                            })}
                        />
                    </Grid>

                    {/* Beklenen Kapanış Tarihi */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Beklenen Kapanış Tarihi"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            error={!!errors.expectedCloseDate}
                            helperText={errors.expectedCloseDate?.message}
                            {...register("expectedCloseDate")}
                        />
                    </Grid>

                    {/* Kaynak */}
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={!!errors.source}>
                            <InputLabel>Kaynak</InputLabel>
                            <Select
                                value={watch("source") || ""}
                                label="Kaynak"
                                onChange={(e) => setValue("source", e.target.value)}
                            >
                                <MenuItem value="">Seçiniz</MenuItem>
                                <MenuItem value="website">Web Sitesi</MenuItem>
                                <MenuItem value="referral">Referans</MenuItem>
                                <MenuItem value="cold_call">Soğuk Arama</MenuItem>
                                <MenuItem value="trade_show">Fuar</MenuItem>
                                <MenuItem value="partner">Partner</MenuItem>
                                <MenuItem value="other">Diğer</MenuItem>
                            </Select>
                            {errors.source && (
                                <FormHelperText>{errors.source.message}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    {/* Açıklama */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Açıklama"
                            multiline
                            rows={4}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            {...register("description")}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
