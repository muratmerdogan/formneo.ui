import React from 'react';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Box, Chip, Avatar, Typography } from '@mui/material';
import { Customer } from '../../types/customer';

interface MuiCustomerGridProps {
    customers: Customer[];
    loading?: boolean;
    total: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onRowClick?: (customer: Customer) => void;
}

export default function MuiCustomerGrid({
    customers,
    loading = false,
    total,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
    onRowClick
}: MuiCustomerGridProps) {
    
    const columns: GridColDef[] = [
        {
            field: 'avatar',
            headerName: '',
            width: 60,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Avatar 
                    sx={{ width: 32, height: 32, fontSize: '0.875rem' }}
                    src={params.row.logoFilePath}
                >
                    {params.row.name?.charAt(0)?.toUpperCase()}
                </Avatar>
            ),
        },
        {
            field: 'name',
            headerName: 'Müşteri Adı',
            flex: 1,
            minWidth: 200,
            renderCell: (params) => (
                <Box>
                    <Typography variant="body2" fontWeight="medium">
                        {params.row.name}
                    </Typography>
                    {params.row.code && (
                        <Typography variant="caption" color="text.secondary">
                            {params.row.code}
                        </Typography>
                    )}
                </Box>
            ),
        },
        {
            field: 'customerType',
            headerName: 'Müşteri Tipi',
            width: 120,
            renderCell: (params) => (
                <Chip 
                    label={params.row.customerType || '-'} 
                    size="small" 
                    variant="outlined"
                    color="primary"
                />
            ),
        },
        {
            field: 'category',
            headerName: 'Kategori',
            width: 100,
            renderCell: (params) => (
                <Typography variant="body2" color="text.secondary">
                    {params.row.category || '-'}
                </Typography>
            ),
        },
        {
            field: 'lifecycleStage',
            headerName: 'Yaşam Döngüsü',
            width: 130,
            renderCell: (params) => {
                const stageMap: Record<string, { label: string; color: string }> = {
                    lead: { label: "Lead", color: "#64748b" },
                    mql: { label: "MQL", color: "#0ea5e9" },
                    sql: { label: "SQL", color: "#6366f1" },
                    opportunity: { label: "Opportunity", color: "#f59e0b" },
                    customer: { label: "Customer", color: "#10b981" },
                };
                const stage = stageMap[params.row.lifecycleStage] || { label: params.row.lifecycleStage || "-", color: "#94a3b8" };
                
                return (
                    <Chip 
                        label={stage.label}
                        size="small"
                        sx={{
                            backgroundColor: `${stage.color}1a`,
                            color: stage.color,
                            fontWeight: 'medium'
                        }}
                    />
                );
            },
        },
        {
            field: 'status',
            headerName: 'Durum',
            width: 100,
            renderCell: (params) => (
                <Chip 
                    label={params.row.status === 'active' ? 'Aktif' : 'Pasif'} 
                    size="small" 
                    color={params.row.status === 'active' ? 'success' : 'default'}
                />
            ),
        },
        {
            field: 'taxNumber',
            headerName: 'Vergi No',
            width: 120,
            renderCell: (params) => (
                <Typography variant="body2" color="text.secondary">
                    {params.row.taxNumber || '-'}
                </Typography>
            ),
        },
        {
            field: 'website',
            headerName: 'Website',
            width: 150,
            renderCell: (params) => (
                params.row.website ? (
                    <Typography 
                        variant="body2" 
                        color="primary" 
                        sx={{ cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(params.row.website, '_blank');
                        }}
                    >
                        {params.row.website.replace('https://', '').replace('http://', '')}
                    </Typography>
                ) : (
                    <Typography variant="body2" color="text.secondary">-</Typography>
                )
            ),
        },
    ];

    const handlePaginationModelChange = (model: GridPaginationModel) => {
        if (model.page + 1 !== page) {
            onPageChange(model.page + 1); // MUI uses 0-based, we use 1-based
        }
        if (model.pageSize !== pageSize) {
            onPageSizeChange(model.pageSize);
        }
    };

    const handleRowClick = (params: any) => {
        if (onRowClick) {
            onRowClick(params.row);
        }
    };

    // Debug logs removed - search functionality ready

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={customers}
                columns={columns}
                loading={loading}
                pagination
                paginationMode="server"
                rowCount={total}
                paginationModel={{
                    page: page - 1, // MUI uses 0-based, we use 1-based
                    pageSize: pageSize
                }}
                hideFooterSelectedRowCount
                disableRowSelectionOnClick
                onPaginationModelChange={handlePaginationModelChange}
                pageSizeOptions={[10, 20, 50, 100]}
                onRowClick={handleRowClick}
                sx={{
                    '& .MuiDataGrid-cell:focus': {
                        outline: 'none',
                    },
                    '& .MuiDataGrid-row:hover': {
                        cursor: 'pointer',
                    },
                }}
                getRowId={(row) => row.id}
                localeText={{
                    noRowsLabel: 'Müşteri bulunamadı',
                    footerRowSelected: (count) => `${count} satır seçildi`,
                    footerTotalRows: 'Toplam satır:',
                    footerTotalVisibleRows: (visibleCount, totalCount) =>
                        `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`,
                }}
            />
        </Box>
    );
}
