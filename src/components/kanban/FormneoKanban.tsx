import React, { useMemo, useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, MouseSensor, TouchSensor, KeyboardSensor, closestCenter, useSensor, useSensors, Over, useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// MUI
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Icon from "@mui/material/Icon";

// Local UI
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import parse from "html-react-parser";

export type KanbanColumn = { id: string; title: string; icon?: React.ReactNode; color?: string };
export type KanbanCard = { id: string; title: string; description?: string; assigneeName?: string; dueDate?: string; tags?: string[] };
export type KanbanState = Record<string, KanbanCard[]>; // columnId -> cards

export type FormneoKanbanProps = {
  columns: KanbanColumn[];
  itemsByColumn: KanbanState;
  onChange: (next: KanbanState) => void;
  renderCard?: (card: KanbanCard) => React.ReactNode;
  onCardClick?: (card: KanbanCard, columnId: string) => void;
};

const CARD_PREFIX = "card:";
const COL_PREFIX = "column:";

function findCardLocation(state: KanbanState, cardId: string): { columnId: string; index: number } | null {
  for (const [colId, cards] of Object.entries(state)) {
    const idx = cards.findIndex((c) => c.id === cardId);
    if (idx !== -1) return { columnId: colId, index: idx };
  }
  return null;
}

function NormalCard({ card }: { card: KanbanCard }) {
  return (
    <Card sx={{ mb: 1, boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }}>
      <CardContent sx={{ p: 1.25 }}>
        <MDTypography variant="button" sx={{ fontWeight: 600 }}>{card.title}</MDTypography>
        {card.description && (
          <MDBox sx={{ mt: 0.5, color: 'text.secondary', fontSize: 12, lineHeight: 1.35,
            '& p': { m: 0 }, '& ul': { pl: 2, m: 0 }, '& ol': { pl: 2, m: 0 }, '& a': { color: 'primary.main' } }}>
            {parse(String(card.description))}
          </MDBox>
        )}
        <MDBox mt={1} display="flex" alignItems="center" gap={1} flexWrap="wrap">
          {card.tags?.slice(0, 3).map((t) => (
            <Chip key={t} size="small" label={t} variant="outlined" />
          ))}
          {card.dueDate && (
            <Chip size="small" label={card.dueDate} icon={<Icon sx={{ fontSize: 16 }}>event</Icon>} />
          )}
        </MDBox>
      </CardContent>
    </Card>
  );
}

function SortableCard({ card, renderCard }: { card: KanbanCard; renderCard?: (card: KanbanCard) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: CARD_PREFIX + card.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  } as React.CSSProperties;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {renderCard ? renderCard(card) : <NormalCard card={card} />}
    </div>
  );
}

function DroppableColumn({ columnId, children }: { columnId: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: COL_PREFIX + columnId });
  return (
    <div ref={setNodeRef} style={{ minHeight: 16, outline: isOver ? "2px dashed #93c5fd" : "none", outlineOffset: -8 }}>
      {children}
    </div>
  );
}

export default function FormneoKanban({ columns, itemsByColumn, onChange, renderCard, onCardClick }: FormneoKanbanProps): JSX.Element {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } }),
    useSensor(KeyboardSensor)
  );

  const allSortableIds = useMemo(() => {
    return Object.values(itemsByColumn).flat().map((c) => CARD_PREFIX + c.id);
  }, [itemsByColumn]);

  function getDropTargetColumnId(over: Over | null): string | null {
    if (!over) return null;
    const overId = String(over.id);
    if (overId.startsWith(CARD_PREFIX)) {
      const cardId = overId.replace(CARD_PREFIX, "");
      const loc = findCardLocation(itemsByColumn, cardId);
      return loc ? loc.columnId : null;
    }
    if (overId.startsWith(COL_PREFIX)) {
      return overId.replace(COL_PREFIX, "");
    }
    return null;
  }

  function handleDragStart(e: any) {
    const id = String(e?.active?.id || "");
    if (id.startsWith(CARD_PREFIX)) setActiveCardId(id.replace(CARD_PREFIX, ""));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCardId(null);
    if (!over) return;

    const activeId = String(active.id);
    if (!activeId.startsWith(CARD_PREFIX)) return;
    const cardId = activeId.replace(CARD_PREFIX, "");
    const fromLoc = findCardLocation(itemsByColumn, cardId);
    if (!fromLoc) return;

    const toColumnId = getDropTargetColumnId(over);
    if (!toColumnId) return;

    const next: KanbanState = Object.fromEntries(Object.entries(itemsByColumn).map(([k, v]) => [k, [...v]]));

    // Remove from source
    const [moved] = next[fromLoc.columnId].splice(fromLoc.index, 1);

    // Determine insert index
    let insertIndex = next[toColumnId].length;
    const overId = String(over.id);
    if (overId.startsWith(CARD_PREFIX)) {
      const overCardId = overId.replace(CARD_PREFIX, "");
      const overIdx = next[toColumnId].findIndex((c) => c.id === overCardId);
      if (overIdx >= 0) insertIndex = overIdx;
    }

    // Insert into destination
    next[toColumnId].splice(insertIndex, 0, moved);

    onChange(next);
  }

  const activeCard: KanbanCard | null = activeCardId ? (Object.values(itemsByColumn).flat().find((c) => c.id === activeCardId) || null) : null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Grid container spacing={2}>
        {columns.map((col, idx) => {
          const accent = col.color || ["#64748b", "#f59e0b", "#8b5cf6", "#22c55e", "#ef4444", "#06b6d4"][idx % 6];
          return (
          <Grid item xs={12} md={4} key={col.id}>
            <Card sx={{ background: (theme) => theme.palette.mode === "dark" ? "#141a2a" : "#f8fafc", borderTop: `3px solid ${accent}` }}>
              <CardHeader
                title={
                  <MDBox display="flex" alignItems="center" gap={1}>
                    {col.icon}
                    <MDTypography variant="button" sx={{ fontWeight: 700, color: accent }}>{col.title}</MDTypography>
                    <Chip size="small" label={(itemsByColumn[col.id] || []).length} sx={{ ml: 1, bgcolor: accent, color: '#fff' }} />
                  </MDBox>
                }
              />
              <CardContent sx={{ minHeight: 120 }}>
                <DroppableColumn columnId={col.id}>
                  <SortableContext items={(itemsByColumn[col.id] || []).map((c) => CARD_PREFIX + c.id)} strategy={verticalListSortingStrategy}>
                    {(itemsByColumn[col.id] || []).map((card) => (
                      <div key={card.id} onClick={() => onCardClick && onCardClick(card, col.id)}>
                        <div style={{ borderLeft: `3px solid ${accent}`, borderRadius: 4 }}>
                          <SortableCard card={card} renderCard={renderCard} />
                        </div>
                      </div>
                    ))}
                  </SortableContext>
                </DroppableColumn>
              </CardContent>
            </Card>
          </Grid>
        );})}
      </Grid>

      <DragOverlay>
        {activeCard ? <NormalCard card={activeCard} /> : null}
      </DragOverlay>
    </DndContext>
  );
}


