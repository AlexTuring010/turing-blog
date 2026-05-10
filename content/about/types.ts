// Types for the About page content. The page renders a typed object from
// content/about/{el,en}.ts — keeping structure in code but prose strings
// hand-edited per locale. Replace freely; no validation runs against this.

export type ReadingStatus = "now" | "done";

export type AboutHero = {
  eyebrowAvailability: string; // e.g. "Available · Sept 2026"
  eyebrowLocation: string; // e.g. "Athens, GR"
  title: string; // e.g. "Hi, είμαι ο *Αλέξανδρος.*" — uses `*word*` markers
  intro: string; // first paragraph; supports *word* markers
};

export type NowItem = {
  label: string; // monospace eyebrow
  content: string; // body text
};

export type StackGroup = {
  label: string; // e.g. "Languages"
  chips: { label: string; fav?: boolean }[];
};

export type ReadingItem = {
  status: ReadingStatus;
  title: string; // can include `_em_` for italic suffix
  author: string;
};

export type ContactLink = {
  kind: "email" | "github" | "linkedin" | "cv";
  href: string;
  label: string; // e.g. "alex@gkiafis.gr" or "GitHub"
  primary?: boolean;
};

export type AboutContent = {
  hero: AboutHero;
  nowMeta: string; // e.g. "updated Φεβ 2026"
  nowItems: NowItem[];
  arcParagraphs: string[]; // each supports **bold** and *italic-coral*
  stackMeta: string; // e.g. "★ = daily driver"
  stackGroups: StackGroup[];
  readingMeta: string; // e.g. "recent + current"
  readingItems: ReadingItem[];
  reachLede: string; // contact card lede; supports *italic*
  contactLinks: ContactLink[];
  responseNote: string; // includes a {responseTime} placeholder
  responseTime: string; // e.g. "24 hours"
  sectionTitles: {
    now: string;
    arc: string;
    stack: string;
    reading: string;
    reach: string;
  };
};
