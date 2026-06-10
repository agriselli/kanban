"use client";

import { useEffect, useRef, useState } from "react";

type EditableColumnTitleProps = {
  title: string;
  onRename: (title: string) => void;
};

export function EditableColumnTitle({
  title,
  onRename,
}: EditableColumnTitleProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(title);
  }, [title]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function save() {
    const trimmed = value.trim();
    if (trimmed) {
      onRename(trimmed);
    } else {
      setValue(title);
    }
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        data-testid="column-title-input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={save}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            save();
          }
          if (event.key === "Escape") {
            setValue(title);
            setEditing(false);
          }
        }}
        className="w-full rounded-md border border-primary/30 bg-white px-2 py-1 text-sm font-semibold text-navy outline-none ring-primary/40 focus:ring-2"
      />
    );
  }

  return (
    <button
      type="button"
      data-testid="column-title"
      onClick={() => setEditing(true)}
      className="w-full text-left text-sm font-semibold tracking-wide text-navy transition-colors hover:text-primary"
      aria-label={`Rename column ${title}`}
    >
      {title}
    </button>
  );
}
