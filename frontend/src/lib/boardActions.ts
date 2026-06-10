import { arrayMove } from "@dnd-kit/sortable";
import type { Board } from "./types";

function cardIdsEqual(left: string[], right: string[]) {
  return (
    left.length === right.length && left.every((id, index) => id === right[index])
  );
}

export function boardCardIdsEqual(left: Board, right: Board) {
  return left.columns.every((column, index) =>
    cardIdsEqual(column.cardIds, right.columns[index].cardIds),
  );
}

export function findColumnByCardId(board: Board, cardId: string) {
  return board.columns.find((column) => column.cardIds.includes(cardId));
}

export function renameColumn(
  board: Board,
  columnId: string,
  title: string,
): Board {
  return {
    ...board,
    columns: board.columns.map((column) =>
      column.id === columnId ? { ...column, title } : column,
    ),
  };
}

export function addCard(
  board: Board,
  columnId: string,
  title: string,
  details: string,
): Board {
  const id = crypto.randomUUID();
  const card = { id, title, details };

  return {
    ...board,
    cards: { ...board.cards, [id]: card },
    columns: board.columns.map((column) =>
      column.id === columnId
        ? { ...column, cardIds: [...column.cardIds, id] }
        : column,
    ),
  };
}

export function deleteCard(board: Board, cardId: string): Board {
  const { [cardId]: removed, ...remainingCards } = board.cards;
  void removed;

  return {
    cards: remainingCards,
    columns: board.columns.map((column) => ({
      ...column,
      cardIds: column.cardIds.filter((id) => id !== cardId),
    })),
  };
}

export function moveCard(
  board: Board,
  activeId: string,
  overColumnId: string,
  overCardId?: string,
): Board {
  const activeColumn = findColumnByCardId(board, activeId);
  const overColumn = board.columns.find((column) => column.id === overColumnId);

  if (!activeColumn || !overColumn) {
    return board;
  }

  const activeIndex = activeColumn.cardIds.indexOf(activeId);
  if (activeIndex === -1) {
    return board;
  }

  if (activeColumn.id === overColumn.id) {
    if (!overCardId || overCardId === activeId) {
      return board;
    }

    const overIndex = overColumn.cardIds.indexOf(overCardId);
    if (overIndex === -1 || activeIndex === overIndex) {
      return board;
    }

    const nextCardIds = arrayMove(overColumn.cardIds, activeIndex, overIndex);
    if (cardIdsEqual(overColumn.cardIds, nextCardIds)) {
      return board;
    }

    return {
      ...board,
      columns: board.columns.map((column) =>
        column.id === activeColumn.id
          ? { ...column, cardIds: nextCardIds }
          : column,
      ),
    };
  }

  const overIndex =
    overCardId !== undefined
      ? overColumn.cardIds.indexOf(overCardId)
      : overColumn.cardIds.length;

  const nextOverIndex = overIndex === -1 ? overColumn.cardIds.length : overIndex;
  const sourceCardIds = activeColumn.cardIds.filter((id) => id !== activeId);
  const targetCardIds = [...overColumn.cardIds];
  targetCardIds.splice(nextOverIndex, 0, activeId);

  if (
    cardIdsEqual(activeColumn.cardIds, sourceCardIds) &&
    cardIdsEqual(overColumn.cardIds, targetCardIds)
  ) {
    return board;
  }

  return {
    ...board,
    columns: board.columns.map((column) => {
      if (column.id === activeColumn.id) {
        return { ...column, cardIds: sourceCardIds };
      }

      if (column.id === overColumn.id) {
        return { ...column, cardIds: targetCardIds };
      }

      return column;
    }),
  };
}
