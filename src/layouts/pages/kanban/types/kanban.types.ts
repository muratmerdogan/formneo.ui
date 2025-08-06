export interface KanbanCard {
    Id: number;
    Status: 'Open' | 'InProgress' | 'Testing' | 'InReview' | 'Close';
    Summary: string;
    Description?: string;
    Type: 'Story' | 'Bug' | 'Epic' | 'Task' | 'Improvement';
    Priority: 'Low' | 'Normal' | 'High' | 'Critical' | 'Release Breaker';
    Tags: string;
    Assignee: string;
    AssigneeId: string;
    RankId: number;
}

export interface KanbanColumn {
    headerText: string;
    keyField: string;
    allowToggle?: boolean;
    isExpanded?: boolean;
    minCount?: number;
    maxCount?: number;
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
    { headerText: 'Backlog', keyField: 'Open', allowToggle: true },
    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, maxCount: 3 },
    { headerText: 'In Review', keyField: 'InReview', allowToggle: true, maxCount: 2 },
    { headerText: 'Testing', keyField: 'Testing', allowToggle: true },
    { headerText: 'Done', keyField: 'Close', allowToggle: true }
];

export const STATUS_OPTIONS = ['Open', 'InProgress', 'InReview', 'Testing', 'Close'];
export const PRIORITY_OPTIONS = ['Low', 'Normal', 'High', 'Critical', 'Release Breaker'];
export const TYPE_OPTIONS = ['Story', 'Bug', 'Epic', 'Task', 'Improvement'];