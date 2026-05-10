import type { ReactNode } from "react";
import clsx from "clsx";

// Renders inline emphasis markers used in mock + (future) MDX frontmatter:
//   *word*  → italic + coral-dark + bold (the signature emphasis)
//   **word** → background-coral highlight (used inside dek/lede strings)
// Anything else is passed through as plain text.
//
// The pattern matches CSS .it (italic, coral-dark, bold) and .dek em
// (coral background highlight) from the design HTML.
export function RichText({
  text,
  emClassName,
  highlightClassName,
}: {
  text: string;
  emClassName?: string;
  highlightClassName?: string;
}) {
  const tokens = tokenize(text);
  return (
    <>
      {tokens.map((t, i) => {
        if (t.type === "em") {
          return (
            <span
              key={i}
              className={clsx(
                "italic font-bold text-coral-dark",
                emClassName,
              )}
            >
              {t.text}
            </span>
          );
        }
        if (t.type === "highlight") {
          return (
            <em
              key={i}
              className={clsx(
                "not-italic rounded-[3px] bg-coral px-1 font-semibold text-paper",
                highlightClassName,
              )}
            >
              {t.text}
            </em>
          );
        }
        return <span key={i}>{t.text}</span>;
      })}
    </>
  );
}

type Token =
  | { type: "text"; text: string }
  | { type: "em"; text: string }
  | { type: "highlight"; text: string };

function tokenize(input: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < input.length) {
    if (input.startsWith("**", i)) {
      const end = input.indexOf("**", i + 2);
      if (end !== -1) {
        out.push({ type: "highlight", text: input.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (input[i] === "*") {
      const end = input.indexOf("*", i + 1);
      if (end !== -1) {
        out.push({ type: "em", text: input.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    // Text run until next marker
    let j = i;
    while (j < input.length && input[j] !== "*") j++;
    out.push({ type: "text", text: input.slice(i, j) });
    i = j;
  }
  return out;
}

// Strips markers entirely — used for plain-text contexts (alt text, meta tags).
export function plain(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1");
}

export function richNode(text: string): ReactNode {
  return <RichText text={text} />;
}
