"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "@/lib/types";

type KanbanCardProps = {
  card: Card;
  onDelete: (cardId: string) => void;
  overlay?: boolean;
};

function DragHandleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-4 w-4"
      fill="currentColor"
    >
      <circle cx="5" cy="4" r="1.25" />
      <circle cx="11" cy="4" r="1.25" />
      <circle cx="5" cy="8" r="1.25" />
      <circle cx="11" cy="8" r="1.25" />
      <circle cx="5" cy="12" r="1.25" />
      <circle cx="11" cy="12" r="1.25" />
    </svg>
  );
}

export function KanbanCard({ card, onDelete, overlay = false }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, disabled: overlay });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={overlay ? undefined : setNodeRef}
      style={overlay ? undefined : style}
      data-testid={`card-${card.id}`}
      className={`group rounded-xl border bg-white p-4 shadow-sm transition-all ${
        overlay
          ? "rotate-1 border-accent/60 shadow-xl ring-2 ring-accent/40"
          : isDragging
            ? "border-primary/30 opacity-50 shadow-md"
            : "border-gray-200 hover:border-primary/40 hover:shadow-md hover:ring-2 hover:ring-primary/15"
      }`}
    >
      <div className="mb-2 flex items-start gap-2">
        {!overlay && (
          <button
            type="button"
            data-testid={`drag-handle-${card.id}`}
            className="-ml-1 mt-0.5 flex min-h-11 min-w-11 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg p-2 text-gray-text/50 transition-colors hover:bg-primary/10 hover:text-primary active:cursor-grabbing group-hover:text-primary/70"
            aria-label={`Drag ${card.title}`}
            {...attributes}
            {...listeners}
          >
            <DragHandleIcon />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              data-testid="card-title"
              className="text-sm font-semibold text-navy"
            >
              {card.title}
            </h3>
            {!overlay && (
              <button
                type="button"
                data-testid={`delete-card-${card.id}`}
                onPointerDown={(event) => event.stopPropagation()}
                onTouchStart={(event) => event.stopPropagation()}
                onClick={() => onDelete(card.id)}
                aria-label={`Delete ${card.title}`}
                className="shrink-0 rounded-md px-2 py-1 text-xs text-gray-text transition-colors hover:bg-red-50 hover:text-red-600"
              >
                Delete
              </button>
            )}
          </div>
          {!overlay && (
            <p className="mt-1 text-[11px] text-gray-text opacity-100 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
              Press and hold handle to move
            </p>
          )}
        </div>
      </div>
      {card.details && (
        <p
          data-testid="card-details"
          className={`text-sm leading-relaxed text-gray-text ${overlay ? "" : "pl-10"}`}
        >
          {card.details}
        </p>
      )}
    </article>
  );
}
