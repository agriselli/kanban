import type { Board } from "./types";

export const initialBoard: Board = {
  columns: [
  {
    id: "col-1",
    title: "Backlog",
    cardIds: ["card-1", "card-2", "card-3"],
  },
  {
    id: "col-2",
    title: "Ready",
    cardIds: ["card-4", "card-5"],
  },
  {
    id: "col-3",
    title: "In Progress",
    cardIds: ["card-6", "card-7", "card-8"],
  },
  {
    id: "col-4",
    title: "Review",
    cardIds: ["card-9"],
  },
  {
    id: "col-5",
    title: "Done",
    cardIds: ["card-10", "card-11"],
  },
  ],
  cards: {
    "card-1": {
      id: "card-1",
      title: "Research competitors",
      details: "Review top 5 Kanban tools and note standout UX patterns.",
    },
    "card-2": {
      id: "card-2",
      title: "Define color palette",
      details: "Finalize brand colors for headings, accents, and actions.",
    },
    "card-3": {
      id: "card-3",
      title: "Sketch board layout",
      details: "Wireframe the five-column layout with card placement.",
    },
    "card-4": {
      id: "card-4",
      title: "Set up project",
      details: "Scaffold Next.js app with TypeScript and Tailwind.",
    },
    "card-5": {
      id: "card-5",
      title: "Create data model",
      details: "Define Board, Column, and Card types with dummy data.",
    },
    "card-6": {
      id: "card-6",
      title: "Build column components",
      details: "Implement renameable column headers and card lists.",
    },
    "card-7": {
      id: "card-7",
      title: "Add drag and drop",
      details: "Integrate dnd-kit for moving cards between columns.",
    },
    "card-8": {
      id: "card-8",
      title: "Style the board",
      details: "Apply brand colors, shadows, and responsive layout.",
    },
    "card-9": {
      id: "card-9",
      title: "Write unit tests",
      details: "Cover board actions and key component interactions.",
    },
    "card-10": {
      id: "card-10",
      title: "Ship MVP",
      details: "Deploy the single-board Kanban app for the team.",
    },
    "card-11": {
      id: "card-11",
      title: "Gather feedback",
      details: "Share with stakeholders and collect improvement ideas.",
    },
  },
};
