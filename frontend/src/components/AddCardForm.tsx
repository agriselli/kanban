"use client";

import { FormEvent, useState } from "react";

type AddCardFormProps = {
  onAdd: (title: string, details: string) => void;
};

export function AddCardForm({ onAdd }: AddCardFormProps) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    onAdd(trimmedTitle, details.trim());
    setTitle("");
    setDetails("");
  }

  return (
    <form
      data-testid="add-card-form"
      onSubmit={handleSubmit}
      className="mt-3 space-y-2 rounded-xl border border-dashed border-accent/50 bg-white/70 p-3"
    >
      <input
        data-testid="add-card-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Card title"
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <textarea
        data-testid="add-card-details"
        value={details}
        onChange={(event) => setDetails(event.target.value)}
        placeholder="Details"
        rows={2}
        className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <button
        type="submit"
        data-testid="add-card-submit"
        className="w-full rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary/90"
      >
        Add card
      </button>
    </form>
  );
}
