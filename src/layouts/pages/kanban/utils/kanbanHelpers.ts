import { KanbanCard } from '../types/kanban.types';

export const generateNextId = (data: KanbanCard[]): number => {
    return Math.max(...data.map(item => item.Id), 0) + 1;
};

export const formatDate = (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const getPriorityWeight = (priority: string): number => {
    const weights = {
        'Low': 1,
        'Normal': 2,
        'High': 3,
        'Critical': 4,
        'Release Breaker': 5
    };
    return weights[priority as keyof typeof weights] || 0;
};

export const sortCardsByPriority = (cards: KanbanCard[]): KanbanCard[] => {
    return [...cards].sort((a, b) => getPriorityWeight(b.Priority) - getPriorityWeight(a.Priority));
};

export const getStatusProgress = (status: string): number => {
    const progress = {
        'Open': 0,
        'InProgress': 25,
        'InReview': 50,
        'Testing': 75,
        'Close': 100
    };
    return progress[status as keyof typeof progress] || 0;
};

export const calculateTeamWorkload = (cards: KanbanCard[]): Record<string, number> => {
    const workload: Record<string, number> = {};

    cards.forEach(card => {
        if (card.Status !== 'Close') {
            const assignee = card.Assignee;
            workload[assignee] = (workload[assignee] || 0) + 1; // Count tasks instead of hours
        }
    });

    return workload;
};

export const getHighPriorityCards = (cards: KanbanCard[]): KanbanCard[] => {
    return cards.filter(card =>
        card.Priority === 'Critical' || card.Priority === 'Release Breaker'
    );
};