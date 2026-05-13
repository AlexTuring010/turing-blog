import clsx from "clsx";

type CoverProject = { slug: string; cover?: string };

// CSS-gradient cover styles per slug, ported from design-references/work.html.
// Real images (project.cover) take precedence; otherwise a project that has
// a hand-tuned gradient here gets it; otherwise a deterministic fallback
// based on the slug hash.
const NAMED: Record<string, React.CSSProperties> = {
  crowdless: {
    background:
      "linear-gradient(135deg,#1a3a2a 0%,#0d1f15 50%,#1a3a2a 100%)",
  },
  hackathens: {
    background: "linear-gradient(180deg,#2a1f3a 0%,#15101f 100%)",
  },
  "mu-compiler": {
    background: "#0f1115",
  },
};

const NAMED_OVERLAY: Record<string, React.ReactNode> = {
  crowdless: (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at 30% 40%,rgba(135,207,64,0.4) 0%,transparent 30%), radial-gradient(circle at 70% 60%,rgba(135,207,64,0.3) 0%,transparent 25%), radial-gradient(circle at 50% 80%,rgba(135,207,64,0.2) 0%,transparent 20%)",
      }}
    />
  ),
  hackathens: (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent 0, transparent 18px, rgba(135,207,64,0.08) 18px, rgba(135,207,64,0.08) 19px)",
      }}
    />
  ),
  "mu-compiler": (
    <>
      <pre
        aria-hidden="true"
        className="absolute left-8 top-[30%] m-0 font-mono text-[0.85rem] text-[rgba(135,207,64,0.5)]"
      >
        let rec eval = function | Int n -&gt; n
      </pre>
      <pre
        aria-hidden="true"
        className="absolute left-8 top-[48%] m-0 font-mono text-[0.85rem] text-[rgba(192,184,168,0.4)]"
      >
        | Add (a,b) -&gt; eval a + eval b
      </pre>
    </>
  ),
};

const FALLBACK_BACKGROUNDS = [
  "linear-gradient(135deg,#1a2a1f 0%,#0d1714 100%)",
  "linear-gradient(135deg,#3a2a1f 0%,#1f1510 100%)",
  "linear-gradient(135deg,#1a3a2a 0%,#0d1f15 100%)",
  "linear-gradient(135deg,#2a1f3a 0%,#15101f 100%)",
];

function pickFallback(slug: string): string {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return FALLBACK_BACKGROUNDS[h % FALLBACK_BACKGROUNDS.length];
}

export function ProjectCover({
  project,
  children,
}: {
  project: CoverProject;
  children?: React.ReactNode;
}) {
  // Priority: explicit image cover > named gradient > slug-hashed fallback.
  if (project.cover) {
    return (
      <div
        className={clsx(
          "relative aspect-[16/9] overflow-hidden border-b-[1.5px] border-rule",
        )}
        style={{
          backgroundImage: `url(${project.cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {children}
      </div>
    );
  }
  const named = NAMED[project.slug];
  const overlay = NAMED_OVERLAY[project.slug];
  const style = named ?? { background: pickFallback(project.slug) };

  return (
    <div
      className="relative aspect-[16/9] overflow-hidden border-b-[1.5px] border-rule bg-paper-3"
      style={style}
    >
      {overlay}
      {children}
    </div>
  );
}
