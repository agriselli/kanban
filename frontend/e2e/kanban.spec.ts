import { expect, test } from "@playwright/test";

test.describe("Kanban board", () => {
  test("loads with dummy cards in multiple columns", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("board-title")).toHaveText("Kanban");
    await expect(page.getByText("Research competitors")).toBeVisible();
    await expect(page.getByText("Ship MVP")).toBeVisible();
    await expect(page.getByTestId("column-col-1")).toBeVisible();
    await expect(page.getByTestId("column-col-5")).toBeVisible();
  });

  test("renames a column", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("column-col-1").getByTestId("column-title").click();
    const input = page.getByTestId("column-title-input");
    await input.fill("Ideas");
    await input.press("Enter");

    await expect(
      page.getByTestId("column-col-1").getByText("Ideas"),
    ).toBeVisible();
  });

  test("adds a new card", async ({ page }) => {
    await page.goto("/");

    const column = page.getByTestId("column-col-1");
    await column.getByTestId("add-card-title").fill("E2E task");
    await column.getByTestId("add-card-details").fill("Added by Playwright");
    await column.getByTestId("add-card-submit").click();

    await expect(page.getByText("E2E task")).toBeVisible();
    await expect(page.getByText("Added by Playwright")).toBeVisible();
  });

  test("deletes a card", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("delete-card-card-1").click();
    await expect(page.getByText("Research competitors")).toHaveCount(0);
  });

  test("drags a card to another column", async ({ page }) => {
    await page.goto("/");

    const dragHandle = page.getByTestId("drag-handle-card-1");
    const targetCard = page.getByTestId("card-card-4");

    const cardBox = await dragHandle.boundingBox();
    const targetBox = await targetCard.boundingBox();

    if (!cardBox || !targetBox) {
      throw new Error("Could not resolve drag coordinates");
    }

    await page.mouse.move(
      cardBox.x + cardBox.width / 2,
      cardBox.y + cardBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      { steps: 15 },
    );
    await page.mouse.up();

    await expect(
      page.getByTestId("column-col-2").getByText("Research competitors"),
    ).toBeVisible();
    await expect(
      page.getByTestId("column-col-1").getByText("Research competitors"),
    ).toHaveCount(0);
  });

  test("reorders a card within the same column", async ({ page }) => {
    await page.goto("/");

    const column = page.getByTestId("column-col-1");
    const dragHandle = page.getByTestId("drag-handle-card-1");
    const thirdCard = page.getByTestId("card-card-3");

    const handleBox = await dragHandle.boundingBox();
    const targetBox = await thirdCard.boundingBox();

    if (!handleBox || !targetBox) {
      throw new Error("Could not resolve drag coordinates");
    }

    await page.mouse.move(
      handleBox.x + handleBox.width / 2,
      handleBox.y + handleBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height + 8,
      { steps: 15 },
    );
    await page.mouse.up();

    const cardIds = await column
      .locator("[data-testid^='card-card-']")
      .evaluateAll((cards) =>
        cards.map((card) => card.getAttribute("data-testid")),
      );

    expect(cardIds).toEqual(["card-card-2", "card-card-3", "card-card-1"]);
  });
});
