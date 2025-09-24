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
            headerName: 'Tip',
            width: 120,
            renderCell: (params) => (
                <Chip 
                    label={params.row.customerType || 'Bireysel'} 
                    size="small" 
                    variant="outlined"
                    color="primary"
                />
            ),
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
            field: 'category',
            headerName: 'Kategori',
            width: 120,
            renderCell: (params) => (
                <Typography variant="body2" color="text.secondary">
                    {params.row.category || 'Standart'}
                </Typography>
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
        console.log("=== PAGINATION MODEL CHANGE ===");
        console.log("New model:", model);
        console.log("Current page:", page);
        console.log("Model page (0-based):", model.page);
        console.log("Model page (1-based):", model.page + 1);
        
        if (model.page + 1 !== page) {
            console.log("Page changing from", page, "to", model.page + 1);
            onPageChange(model.page + 1); // MUI uses 0-based, we use 1-based
        }
        if (model.pageSize !== pageSize) {
            console.log("PageSize changing from", pageSize, "to", model.pageSize);
            onPageSizeChange(model.pageSize);
        }
    };

    const handleRowClick = (params: any) => {
        if (onRowClick) {
            onRowClick(params.row);
        }
    };

    console.log("=== MUI DATAGRID DEBUG ===");
    console.log("Total (TotalCount):", total, "(300 kayıt)");
    console.log("Page (1-based):", page);
    console.log("PageSize:", pageSize);
    console.log("Customers length:", customers.length);
    console.log("MUI PaginationModel (0-based):", { page: page - 1, pageSize });
    console.log("Total pages calculated:", Math.ceil(total / pageSize), "(15 sayfa)");
    console.log("Can go next:", page < Math.ceil(total / pageSize));
    console.log("Can go prev:", page > 1);

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
