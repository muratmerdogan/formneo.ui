import React, { useCallback, useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import MDBox from "components/MDBox";
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import OverdueTasksWidget from "layouts/dashboards/analytics/components/widgets/OverdueTasksWidget";
import TodayTasksWidget from "layouts/dashboards/analytics/components/widgets/TodayTasksWidget";
import NextWeekTasksWidget from "layouts/dashboards/analytics/components/widgets/NextWeekTasksWidget";
import PendingApprovalsWidget from "layouts/dashboards/analytics/components/widgets/PendingApprovalsWidget";
import ReportsWidget from "layouts/dashboards/analytics/components/widgets/ReportsWidget";

type WidgetId = "overdue" | "today" | "nextweek" | "pending" | "reports";

type WidgetDef = {
    id: WidgetId;
    title: string;
    element: React.ReactNode;
};

function SortableCard({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.85 : 1,
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card sx={{ height: "100%" }}>
                <CardHeader title={title} sx={{ cursor: "grab", userSelect: "none" }} />
                <CardContent sx={{ pt: 0 }}>
                    {children}
                </CardContent>
            </Card>
        </div>
    );
}

export default function TaskDashboard(): JSX.Element {
    const initial: WidgetId[] = ["overdue", "today", "nextweek", "pending", "reports"];
    const [order, setOrder] = useState<WidgetId[]>(initial);

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
    );

    const widgets: Record<WidgetId, WidgetDef> = useMemo(() => ({
        overdue: { id: "overdue", title: "Günü Geçmiş Görevler", element: <OverdueTasksWidget /> },
        today: { id: "today", title: "Bugünün Görevleri", element: <TodayTasksWidget /> },
        nextweek: { id: "nextweek", title: "Önümüzdeki Hafta", element: <NextWeekTasksWidget /> },
        pending: { id: "pending", title: "Onay Bekleyen Formlar", element: <PendingApprovalsWidget /> },
        reports: { id: "reports", title: "Raporlar", element: <ReportsWidget /> },
    }), []);

    const onDragEnd = useCallback((e: DragEndEvent) => {
        const { active, over } = e;
        if (!over || active.id === over.id) return;
        setOrder((prev) => {
            const oldIndex = prev.indexOf(active.id as WidgetId);
            const newIndex = prev.indexOf(over.id as WidgetId);
            const next = [...prev];
            next.splice(oldIndex, 1);
            next.splice(newIndex, 0, active.id as WidgetId);
            return next;
        });
    }, []);

    return (
        <MDBox>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={order} strategy={rectSortingStrategy}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                            gap: 16,
                            alignItems: "stretch",
                        }}
                    >
                        {order.map((id) => (
                            <SortableCard key={id} id={id} title={widgets[id].title}>
                                {widgets[id].element}
                            </SortableCard>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </MDBox>
    );
}


