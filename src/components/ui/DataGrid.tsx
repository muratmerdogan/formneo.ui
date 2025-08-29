import React, { useState, useMemo } from "react";
import { KeyboardArrowUp, KeyboardArrowDown, UnfoldMore, NavigateBefore, NavigateNext } from "@mui/icons-material";

export type ColumnDef<T = any> = {
    key: string;
    title: string;
    width?: string | number;
    sortable?: boolean;
    filterable?: boolean;
    render?: (value: any, row: T, index: number) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
    className?: string;
};

export type DataGridProps<T = any> = {
    data: T[];
    columns: ColumnDef<T>[];
    loading?: boolean;
    selectable?: boolean;
    selectedRows?: string[];
    onSelectionChange?: (selectedIds: string[]) => void;
    onRowClick?: (row: T, index: number) => void;
    onSort?: (key: string, direction: 'asc' | 'desc') => void;
    pagination?: {
        page: number;
        pageSize: number;
        total: number;
        onPageChange: (page: number) => void;
        onPageSizeChange: (size: number) => void;
    };
    className?: string;
    emptyMessage?: string;
    rowKey?: string; // default: 'id'
};

export default function DataGrid<T extends Record<string, any>>({
    data,
    columns,
    loading = false,
    selectable = false,
    selectedRows = [],
    onSelectionChange,
    onRowClick,
    onSort,
    pagination,
    className = "",
    emptyMessage = "Veri bulunamadı",
    rowKey = "id"
}: DataGridProps<T>) {
    const [sortKey, setSortKey] = useState<string>("");
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const allSelected = useMemo(() => {
        return data.length > 0 && data.every(row => selectedRows.includes(row[rowKey]));
    }, [data, selectedRows, rowKey]);

    const handleSort = (key: string) => {
        const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortKey(key);
        setSortDirection(newDirection);
        onSort?.(key, newDirection);
    };

    const handleSelectAll = () => {
        if (!onSelectionChange) return;
        if (allSelected) {
            onSelectionChange([]);
        } else {
            onSelectionChange(data.map(row => row[rowKey]));
        }
    };

    const handleRowSelect = (rowId: string) => {
        if (!onSelectionChange) return;
        if (selectedRows.includes(rowId)) {
            onSelectionChange(selectedRows.filter(id => id !== rowId));
        } else {
            onSelectionChange([...selectedRows, rowId]);
        }
    };

    const renderSortIcon = (columnKey: string, sortable: boolean = false) => {
        if (!sortable) return null;
        if (sortKey !== columnKey) {
            return <UnfoldMore className="h-4 w-4 text-gray-400" />;
        }
        return sortDirection === 'asc'
            ? <KeyboardArrowUp className="h-4 w-4 text-blue-600" />
            : <KeyboardArrowDown className="h-4 w-4 text-blue-600" />;
    };

    const getPaginationInfo = () => {
        if (!pagination) return null;
        const start = (pagination.page - 1) * pagination.pageSize + 1;
        const end = Math.min(pagination.page * pagination.pageSize, pagination.total);
        return `${start}-${end} / ${pagination.total}`;
    };

    const getPageNumbers = () => {
        if (!pagination) return [];
        const { page, total, pageSize } = pagination;
        const totalPages = Math.ceil(total / pageSize);
        const pages = [];

        // Simple pagination logic
        let startPage = Math.max(1, page - 2);
        let endPage = Math.min(totalPages, page + 2);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className={`bg-white rounded-lg shadow ${className}`}>
            {/* Table Container */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    {/* Header */}
                    <thead className="bg-gray-50">
                        <tr>
                            {selectable && (
                                <th className="px-6 py-3 w-12">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={handleSelectAll}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                    </div>
                                </th>
                            )}
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                                        } ${column.className || ''}`}
                                    style={{ width: column.width }}
                                    onClick={() => column.sortable && handleSort(column.key)}
                                >
                                    <div className={`flex items-center gap-1 ${column.align === 'center' ? 'justify-center' :
                                        column.align === 'right' ? 'justify-end' : 'justify-start'
                                        }`}>
                                        <span>{column.title}</span>
                                        {renderSortIcon(column.key, column.sortable)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-12 text-center">
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                        <span className="ml-2 text-gray-600">Yükleniyor...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-12 text-center text-gray-500">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, index) => (
                                <tr
                                    key={row[rowKey] || index}
                                    className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''} ${selectedRows.includes(row[rowKey]) ? 'bg-blue-50' : ''
                                        }`}
                                    onClick={() => onRowClick?.(row, index)}
                                >
                                    {selectable && (
                                        <td className="px-6 py-4 w-12">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.includes(row[rowKey])}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        handleRowSelect(row[rowKey]);
                                                    }}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                            </div>
                                        </td>
                                    )}
                                    {columns.map((column) => {
                                        const value = row[column.key];
                                        const content = column.render
                                            ? column.render(value, row, index)
                                            : value;

                                        return (
                                            <td
                                                key={column.key}
                                                className={`px-6 py-4 text-sm text-gray-900 ${column.align === 'center' ? 'text-center' :
                                                    column.align === 'right' ? 'text-right' : ''
                                                    } ${column.className || ''}`}
                                            >
                                                {content}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex-1 flex justify-between items-center sm:hidden">
                        <button
                            onClick={() => pagination.onPageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Önceki
                        </button>
                        <span className="text-sm text-gray-700">
                            {getPaginationInfo()}
                        </span>
                        <button
                            onClick={() => pagination.onPageChange(pagination.page + 1)}
                            disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
                            className="relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Sonraki
                        </button>
                    </div>

                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <p className="text-sm text-gray-700">
                                {getPaginationInfo()} kayıt gösteriliyor
                            </p>
                            <select
                                value={pagination.pageSize}
                                onChange={(e) => pagination.onPageSizeChange(Number(e.target.value))}
                                className="block w-auto rounded-md border-gray-300 py-1 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>

                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                                onClick={() => pagination.onPageChange(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Önceki</span>
                                <NavigateBefore className="h-5 w-5" />
                            </button>

                            {getPageNumbers().map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => pagination.onPageChange(pageNum)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageNum === pagination.page
                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            ))}

                            <button
                                onClick={() => pagination.onPageChange(pagination.page + 1)}
                                disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Sonraki</span>
                                <NavigateNext className="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
}
