import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { KanbanBoard } from "./KanbanBoard";

describe("KanbanBoard", () => {
  it("renders dummy data across columns", () => {
    render(<KanbanBoard />);

    expect(screen.getByTestId("board-title")).toHaveTextContent("Kanban");
    expect(screen.getByText("Research competitors")).toBeInTheDocument();
    expect(screen.getByText("Ship MVP")).toBeInTheDocument();
    expect(screen.getAllByTestId(/^column-col-/)).toHaveLength(5);
  });

  it("renames a column", async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    const backlogTitle = screen.getAllByTestId("column-title")[0];
    await user.click(backlogTitle);

    const input = screen.getByTestId("column-title-input");
    await user.clear(input);
    await user.type(input, "Ideas{Enter}");

    expect(screen.getByText("Ideas")).toBeInTheDocument();
  });

  it("adds a card to a column", async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    const titleInput = screen.getAllByTestId("add-card-title")[0];
    const detailsInput = screen.getAllByTestId("add-card-details")[0];
    const submit = screen.getAllByTestId("add-card-submit")[0];

    await user.type(titleInput, "New feature");
    await user.type(detailsInput, "Build the login flow");
    await user.click(submit);

    expect(screen.getByText("New feature")).toBeInTheDocument();
    expect(screen.getByText("Build the login flow")).toBeInTheDocument();
  });

  it("deletes a card", async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    const deleteButton = screen.getByTestId("delete-card-card-1");
    await user.click(deleteButton);

    expect(screen.queryByText("Research competitors")).not.toBeInTheDocument();
  });
});
