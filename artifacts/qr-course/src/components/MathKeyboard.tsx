import React from "react";

export interface MathKey {
  label: string;
  insert: string;
  cursorBack?: number;
  title?: string;
}

const DEFAULT_KEYS: MathKey[] = [
  { label: "+", insert: "+" },
  { label: "−", insert: "−", title: "minus" },
  { label: "×", insert: "×", title: "times" },
  { label: "÷", insert: "÷", title: "divided by" },
  { label: "=", insert: "=" },
  { label: "≠", insert: "≠", title: "not equal" },
  { label: "<", insert: "<" },
  { label: ">", insert: ">" },
  { label: "≤", insert: "≤", title: "less than or equal" },
  { label: "≥", insert: "≥", title: "greater than or equal" },
  { label: "≈", insert: "≈", title: "approximately" },
  { label: "±", insert: "±", title: "plus or minus" },
  { label: "%", insert: "%", title: "percent" },
  { label: "( )", insert: "()", cursorBack: 1, title: "parentheses" },
  { label: "a/b", insert: "/", title: "fraction / divide" },
  { label: "x²", insert: "²", title: "squared" },
  { label: "x³", insert: "³", title: "cubed" },
  { label: "√", insert: "√", title: "square root" },
  { label: "x̄", insert: "x̄", title: "mean (x-bar)" },
  { label: "Σ", insert: "Σ", title: "sum" },
  { label: "π", insert: "π", title: "pi" },
  { label: "°", insert: "°", title: "degrees" },
  { label: "½", insert: "½" },
  { label: "→", insert: "→", title: "leads to" },
];

interface MathKeyboardProps {
  onInsert: (text: string, cursorBack?: number) => void;
  keys?: MathKey[];
  className?: string;
}

/**
 * A compact symbol palette for entering math/stat notation. Buttons use
 * onMouseDown + preventDefault so the associated textarea keeps focus and its
 * caret position when a symbol is inserted.
 */
export function MathKeyboard({ onInsert, keys = DEFAULT_KEYS, className }: MathKeyboardProps) {
  return (
    <div
      className={`flex flex-wrap gap-1 ${className || ""}`}
      role="group"
      aria-label="Math symbol keyboard"
      data-testid="math-keyboard"
    >
      {keys.map((k) => (
        <button
          key={k.label}
          type="button"
          title={k.title || k.label}
          aria-label={k.title || k.label}
          onMouseDown={(e) => {
            e.preventDefault();
            onInsert(k.insert, k.cursorBack);
          }}
          className="min-w-[2.25rem] h-9 px-2 flex items-center justify-center rounded-md border border-input bg-card text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors select-none"
        >
          {k.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Splices `text` into a textarea at the current caret/selection and returns the
 * resulting value together with the caret position that should follow.
 */
export function insertAtTextareaCursor(
  el: HTMLTextAreaElement,
  text: string,
  cursorBack = 0,
): { value: string; cursor: number } {
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? el.value.length;
  const value = el.value.slice(0, start) + text + el.value.slice(end);
  const cursor = start + text.length - cursorBack;
  return { value, cursor };
}
