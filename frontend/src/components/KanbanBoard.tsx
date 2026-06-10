"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { initialBoard } from "@/lib/dummyData";
import {
  addCard,
  boardCardIdsEqual,
  deleteCard,
  findColumnByCardId,
  moveCard,
  renameColumn,
} from "@/lib/boardActions";
import type { Board } from "@/lib/types";
import { KanbanCard } from "./KanbanCard";
import { KanbanColumn } from "./KanbanColumn";

function applyBoardUpdate(
  current: Board,
  updater: (board: Board) => Board,
): Board {
  const next = updater(current);
  return boardCardIdsEqual(current, next) ? current : next;
}

export function KanbanBoard() {
  const [mounted, setMounted] = useState(false);
  const [board, setBoard] = useState<Board>(initialBoard);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeCard = activeCardId ? board.cards[activeCardId] : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveCardId(String(event.active.id));
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) {
      return;
    }

    setBoard((current) =>
      applyBoardUpdate(current, (boardState) => {
        const activeColumn = findColumnByCardId(boardState, activeId);
        const overColumn =
          boardState.columns.find((column) => column.id === overId) ??
          findColumnByCardId(boardState, overId);

        if (!activeColumn || !overColumn) {
          return boardState;
        }

        // Same-column reordering is handled visually by dnd-kit; commit on drag end.
        if (activeColumn.id === overColumn.id) {
          return boardState;
        }

        // Avoid column droppable bounce when the target column already has cards.
        const isOverCard = Boolean(boardState.cards[overId]);
        if (!isOverCard && overColumn.cardIds.length > 0) {
          return boardState;
        }

        return moveCard(
          boardState,
          activeId,
          overColumn.id,
          isOverCard ? overId : undefined,
        );
      }),
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCardId(null);

    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) {
      return;
    }

    setBoard((current) =>
      applyBoardUpdate(current, (boardState) => {
        const activeColumn = findColumnByCardId(boardState, activeId);
        const overColumn =
          boardState.columns.find((column) => column.id === overId) ??
          findColumnByCardId(boardState, overId);

        if (!activeColumn || !overColumn) {
          return boardState;
        }

        const isOverCard = boardState.cards[overId] !== undefined;

        return moveCard(
          boardState,
          activeId,
          overColumn.id,
          isOverCard ? overId : undefined,
        );
      }),
    );
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen min-w-0 flex-col">
        <header className="border-b border-gray-200 bg-white px-6 py-6 shadow-sm">
          <div className="w-full">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Project Board
            </p>
            <h1 className="mt-1 text-3xl font-bold text-navy">Kanban</h1>
            <div className="mt-3 h-1 w-16 rounded-full bg-accent" />
          </div>
        </header>
        <main className="flex-1 overflow-x-auto px-6 py-8 min-[1400px]:overflow-x-hidden">
          <div className="flex w-full gap-5 max-[1399px]:w-max max-[1399px]:min-w-full min-[1400px]:min-w-0">
            {initialBoard.columns.map((column) => (
              <div
                key={column.id}
                className="h-96 w-72 shrink-0 animate-pulse rounded-2xl bg-white/80 min-[1400px]:min-w-0 min-[1400px]:flex-1 min-[1400px]:basis-0 min-[1400px]:shrink"
              />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen min-w-0 flex-col">
      <header className="border-b border-gray-200 bg-white px-6 py-6 shadow-sm">
        <div className="w-full">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Project Board
          </p>
          <h1
            data-testid="board-title"
            className="mt-1 text-3xl font-bold text-navy"
          >
            Kanban
          </h1>
          <div className="mt-3 h-1 w-16 rounded-full bg-accent" />
        </div>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <main
          data-testid="kanban-board"
          className="flex-1 overflow-x-auto px-6 py-8 min-[1400px]:overflow-x-hidden"
        >
          <div className="flex w-full gap-5 max-[1399px]:w-max max-[1399px]:min-w-full min-[1400px]:min-w-0">
            {board.columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                cards={column.cardIds.map((id) => board.cards[id])}
                onRename={(columnId, title) =>
                  setBoard((current) => renameColumn(current, columnId, title))
                }
                onAddCard={(columnId, title, details) =>
                  setBoard((current) =>
                    addCard(current, columnId, title, details),
                  )
                }
                onDeleteCard={(cardId) =>
                  setBoard((current) => deleteCard(current, cardId))
                }
              />
            ))}
          </div>
        </main>

        <DragOverlay dropAnimation={null}>
          {activeCard ? (
            <KanbanCard card={activeCard} onDelete={() => {}} overlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
