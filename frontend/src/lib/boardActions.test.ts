import { describe, expect, it } from "vitest";
import { initialBoard } from "./dummyData";
import {
  addCard,
  deleteCard,
  findColumnByCardId,
  moveCard,
  renameColumn,
} from "./boardActions";

describe("boardActions", () => {
  it("renames a column", () => {
    const board = renameColumn(initialBoard, "col-1", "Ideas");
    expect(board.columns[0].title).toBe("Ideas");
  });

  it("adds a card to a column", () => {
    const board = addCard(initialBoard, "col-1", "New task", "Some details");
    const column = board.columns.find((col) => col.id === "col-1");

    expect(column?.cardIds).toHaveLength(4);
    const newId = column?.cardIds.at(-1);
    expect(newId).toBeDefined();
    expect(board.cards[newId!]).toEqual({
      id: newId,
      title: "New task",
      details: "Some details",
    });
  });

  it("deletes a card and removes it from its column", () => {
    const board = deleteCard(initialBoard, "card-1");

    expect(board.cards["card-1"]).toBeUndefined();
    expect(
      board.columns.find((col) => col.id === "col-1")?.cardIds,
    ).not.toContain("card-1");
  });

  it("reorders a card within the same column", () => {
    const board = moveCard(initialBoard, "card-1", "col-1", "card-3");
    const cardIds = board.columns.find((col) => col.id === "col-1")?.cardIds;

    expect(cardIds).toEqual(["card-2", "card-3", "card-1"]);
  });

  it("moves a card to another column at a specific position", () => {
    const board = moveCard(initialBoard, "card-1", "col-2", "card-5");
    const backlog = board.columns.find((col) => col.id === "col-1")?.cardIds;
    const ready = board.columns.find((col) => col.id === "col-2")?.cardIds;

    expect(backlog).toEqual(["card-2", "card-3"]);
    expect(ready).toEqual(["card-4", "card-1", "card-5"]);
  });

  it("moves a card to an empty column area", () => {
    const emptied = deleteCard(initialBoard, "card-9");
    const board = moveCard(emptied, "card-1", "col-4");

    expect(findColumnByCardId(board, "card-1")?.id).toBe("col-4");
    expect(board.columns.find((col) => col.id === "col-4")?.cardIds).toEqual([
      "card-1",
    ]);
  });

  it("deletes the last card in a column", () => {
    const board = deleteCard(initialBoard, "card-9");
    expect(board.columns.find((col) => col.id === "col-4")?.cardIds).toEqual([]);
  });
});
