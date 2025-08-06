import React from 'react';
import { KanbanCard as KanbanCardType } from '../types/kanban.types';

interface KanbanCardProps {
    data: KanbanCardType;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ data }) => {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Low': return { bg: '#e8f5e8', text: '#2d5a2d', border: '#4caf50' };
            case 'Normal': return { bg: '#e3f2fd', text: '#1565c0', border: '#2196f3' };
            case 'High': return { bg: '#fff3e0', text: '#e65100', border: '#ff9800' };
            case 'Critical': return { bg: '#fce4ec', text: '#c2185b', border: '#e91e63' };
            case 'Release Breaker': return { bg: '#ffebee', text: '#d32f2f', border: '#f44336' };
            default: return { bg: '#f5f5f5', text: '#616161', border: '#9e9e9e' };
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Story': return (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
            );
            case 'Bug': return (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="8" y="6" width="8" height="14" rx="4" />
                    <path d="M19 7c0-1.1-.9-2-2-2h-2" />
                    <path d="M5 7c0-1.1.9-2 2-2h2" />
                    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                    <path d="M8 21a2 2 0 0 1-2-2" />
                    <path d="M16 21a2 2 0 0 0 2-2" />
                </svg>
            );
            case 'Epic': return (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
                </svg>
            );
            case 'Task': return (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,11 12,14 22,4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
            );
            case 'Improvement': return (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            );
            default: return (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10,9 9,9 8,9" />
                </svg>
            );
        }
    };

    const priorityColors = getPriorityColor(data.Priority);

    return (
        <div
            className="kanban-card"
            style={{
                padding: '16px',
                // borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
                margin: '0px 0',
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{
                margin: '0 0 12px 0',
                fontSize: '15px',
                fontWeight: '600',
                color: '#111827',
                lineHeight: '1.4'
            }}>
                {data.Summary}
            </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        color: '#6b7280',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        {getTypeIcon(data.Type)}
                    </div>
                    <span
                        style={{
                            fontSize: '11px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            backgroundColor: priorityColors.bg,
                            color: priorityColors.text,
                            fontWeight: '600',
                            border: `1px solid ${priorityColors.border}20`
                        }}
                    >
                        {data.Priority}
                    </span>
                </div>
            </div>


            

            {/* Description */}
            {data.Description && (
                <p style={{
                    margin: '0 0 12px 0',
                    fontSize: '13px',
                    color: '#6b7280',
                    lineHeight: '1.5'
                }}>
                    {data.Description.length > 80 ? `${data.Description.substring(0, 80)}...` : data.Description}
                </p>
            )}

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {data.Tags.split(',').map((tag, index) => (
                    <span
                        key={index}
                        style={{
                            fontSize: '11px',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            fontWeight: '500',
                            border: '1px solid #e5e7eb'
                        }}
                    >
                        {tag.trim()}
                    </span>
                ))}
            </div>

            {/* Footer */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '8px',
                borderTop: '1px solid #f3f4f6'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: '600',
                        color: '#374151'
                    }}>
                        {data.Assignee.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                        {data.Assignee}
                    </span>
                </div>
                <span style={{
                    fontSize: '11px',
                    color: '#9ca3af',
                    fontWeight: '500'
                }}>
                    {data.Type}
                </span>
            </div>
        </div>
    );
};

export default KanbanCard;