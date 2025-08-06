import React from 'react';
import MDBox from "components/MDBox";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import MDButton from 'components/MDButton';

interface KanbanToolbarProps {
    onAddCard: () => void;
    onFilterChange: (filter: string) => void;
    onSearch: (searchTerm: string) => void;
}

const KanbanToolbar: React.FC<KanbanToolbarProps> = ({ onAddCard, onFilterChange, onSearch }) => {
    const filterOptions = ['All', 'Story', 'Bug', 'Epic', 'Task', 'Improvement'];
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    return (
        <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
            p={2}
            sx={{
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                flexWrap: 'wrap',
                gap: 2
            }}
        >
            <MDBox display="flex" alignItems="center" gap={2}>
                <button
                    onClick={onAddCard}
                    style={{
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                        transition: 'all 0.3s ease',
                        minWidth: '120px'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                    }}
                >
                    + New Task
                </button>

                <div style={{ minWidth: '150px' }}>
                    <DropDownListComponent
                        id="filter"
                        dataSource={filterOptions}
                        placeholder="Filter by Type"
                        value="All"
                        change={(args: any) => onFilterChange(args.value)}
                        cssClass="e-outline"
                    />
                </div>
            </MDBox>

            <MDBox display="flex" alignItems="center" gap={2}>
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        minWidth: '200px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#667eea';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#ddd';
                    }}
                />

                <button
                    onClick={() => {
                        setSearchTerm('');
                        onSearch('');
                        onFilterChange('All');
                    }}
                    style={{
                        padding: '8px 16px',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        background: '#f8f9fa',
                        color: '#495057',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#e9ecef';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                    }}
                >
                    Clear
                </button>
            </MDBox>
        </MDBox>
    );
};

export default KanbanToolbar;