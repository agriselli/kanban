"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Card, Column } from "@/lib/types";
import { AddCardForm } from "./AddCardForm";
import { EditableColumnTitle } from "./EditableColumnTitle";
import { KanbanCard } from "./KanbanCard";

type KanbanColumnProps = {
  column: Column;
  cards: Card[];
  onRename: (columnId: string, title: string) => void;
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDeleteCard: (cardId: string) => void;
};

export function KanbanColumn({
  column,
  cards,
  onRename,
  onAddCard,
  onDeleteCard,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <section
      data-testid={`column-${column.id}`}
      className="flex w-72 shrink-0 flex-col rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur min-[1400px]:min-w-0 min-[1400px]:flex-1 min-[1400px]:basis-0"
    >
      <div className="mb-3 border-b-2 border-accent pb-3">
        <EditableColumnTitle
          title={column.title}
          onRename={(title) => onRename(column.id, title)}
        />
        <p className="mt-1 text-xs text-gray-text">{cards.length} cards</p>
      </div>

      <div
        ref={setNodeRef}
        data-testid={`column-drop-${column.id}`}
        className={`flex min-h-32 flex-1 flex-col gap-3 rounded-xl p-1 transition-colors ${
          isOver ? "bg-primary/5 ring-2 ring-primary/20" : ""
        }`}
      >
        <SortableContext
          items={column.cardIds}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} onDelete={onDeleteCard} />
          ))}
        </SortableContext>
      </div>

      <AddCardForm onAdd={(title, details) => onAddCard(column.id, title, details)} />
    </section>
  );
}
