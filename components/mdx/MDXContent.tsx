import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import clsx from "clsx";

// Renders an MDX body string with our typography + Shiki-highlighted code.
//
// The component map below mirrors design-references/post.html: every prose
// element is restyled to match the reading column (h2 with coral # prefix,
// inline code in coral-on-paper-2, blockquote with coral left border, etc.).
//
// rehype-pretty-code applies Shiki to fenced code blocks and emits
// `data-language` on <pre>; CodeBlock reads that to render a header bar.
export async function MDXContent({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={MDX_COMPONENTS}
      options={{
        mdxOptions: {
          rehypePlugins: [
            [
              rehypePrettyCode,
              {
                theme: "github-dark-default",
                keepBackground: false, // we paint our own background
                defaultLang: "plaintext",
              },
            ],
          ],
        },
      }}
    />
  );
}

// ─── Custom components ───────────────────────────────────────────────

const MDX_COMPONENTS = {
  h1: (p: ComponentPropsWithoutRef<"h1">) => (
    // h1 is the post title — rendered by the page layout, not by MDX.
    // If a body uses # we still want it to not collide with the title.
    <h2
      {...p}
      className={clsx(
        "mt-10 text-[1.6rem] font-bold tracking-[-0.01em] text-ink",
        p.className,
      )}
      style={{ fontVariationSettings: '"opsz" 64' }}
    />
  ),
  h2: ({ children, ...p }: ComponentPropsWithoutRef<"h2">) => (
    <h2
      {...p}
      className="mt-10 mb-2 text-[1.6rem] font-bold tracking-[-0.01em] text-ink"
      style={{ fontVariationSettings: '"opsz" 64' }}
    >
      {children}
    </h2>
  ),
  h3: (p: ComponentPropsWithoutRef<"h3">) => (
    <h3
      {...p}
      className="mt-8 mb-2 text-[1.2rem] font-bold text-ink"
    />
  ),
  p: (p: ComponentPropsWithoutRef<"p">) => (
    <p {...p} className="text-[18px] leading-[1.7] text-ink font-normal" />
  ),
  a: (p: ComponentPropsWithoutRef<"a">) => (
    <a
      {...p}
      className="text-coral underline decoration-[1.5px] underline-offset-[3px] transition-colors hover:text-coral-dark"
    />
  ),
  ul: (p: ComponentPropsWithoutRef<"ul">) => (
    <ul {...p} className="ml-6 list-disc text-[18px] leading-[1.7] [&_li::marker]:text-coral" />
  ),
  ol: (p: ComponentPropsWithoutRef<"ol">) => (
    <ol {...p} className="ml-6 list-decimal text-[18px] leading-[1.7] [&_li::marker]:text-coral" />
  ),
  li: (p: ComponentPropsWithoutRef<"li">) => (
    <li {...p} className="mb-[0.4em]" />
  ),
  blockquote: (p: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      {...p}
      className="border-l-[3px] border-coral pl-6 py-2 italic text-[1.1em] text-ink-soft"
    />
  ),
  em: (p: ComponentPropsWithoutRef<"em">) => (
    <em {...p} className="italic text-ink" />
  ),
  strong: (p: ComponentPropsWithoutRef<"strong">) => (
    <strong {...p} className="font-bold text-ink" />
  ),
  hr: () => (
    <hr className="my-12 h-6 border-none bg-none text-center before:content-['❋_❋_❋'] before:tracking-[14px] before:text-sm before:text-ink-mute" />
  ),
  // Inline `code` (not inside <pre>). When rehype-pretty-code runs, fenced
  // code blocks compose <pre><code>... so this only fires for inline.
  code: (props: ComponentPropsWithoutRef<"code"> & { "data-language"?: string }) => {
    // rehype-pretty-code adds data-language on the <code> inside <pre>;
    // when that's set, it's a code BLOCK child — render plain so the parent
    // <pre> styling wins. Otherwise this is inline.
    if ("data-language" in props && props["data-language"]) {
      return <code {...props} />;
    }
    return (
      <code
        {...props}
        className="rounded border border-rule bg-paper-2 px-[6px] py-[2px] font-mono text-[0.88em] text-coral"
      />
    );
  },
  pre: CodeBlock,
  Callout,
  // Image rendered as figure for nicer captions (alt as caption).
  img: (props: ComponentPropsWithoutRef<"img">) => (
    <figure className="my-10 overflow-hidden rounded-[10px] border-[1.5px] border-rule bg-paper-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...props} alt={props.alt ?? ""} className="block w-full" />
      {props.alt && (
        <figcaption className="border-t border-rule px-4 py-3 text-center text-[13px] italic text-ink-mute">
          {props.alt}
        </figcaption>
      )}
    </figure>
  ),
};

function CodeBlock({
  children,
  ...rest
}: ComponentPropsWithoutRef<"pre"> & { "data-language"?: string }) {
  const lang = (rest as Record<string, string | undefined>)["data-language"];
  return (
    <div className="my-8 overflow-hidden rounded-[10px] border-[1.5px] border-rule bg-paper-2 shadow-[3px_3px_0_var(--coral)]">
      {lang && (
        <div className="flex items-center justify-between border-b border-rule bg-paper-3 px-4 py-[10px]">
          <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-mute">
            {lang}
          </span>
        </div>
      )}
      <pre
        {...rest}
        className="overflow-x-auto px-5 py-[18px] font-mono text-[0.86em] leading-[1.65] text-ink [&_.line]:block [&_[data-line]]:block"
      >
        {children}
      </pre>
    </div>
  );
}

// MDX-callable component used inside post bodies (see kv-store.{el,en}.mdx).
function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-[8px] border-[1.5px] border-rule border-l-[3px] border-l-coral bg-paper-2 px-[22px] py-[18px] text-[0.95em] text-ink-soft [&_strong]:font-bold [&_strong]:text-coral">
      {children}
    </div>
  );
}
