// =============================================================================
// MOCK CONTENT — DELETE IN PHASE 2
// =============================================================================
//
// Everything in this file is placeholder content that mirrors what real MDX
// posts and projects will look like. It exists so the homepage (Phase 1) and
// archives (Phase 3) can render against realistic data before the MDX loaders
// land in Phase 2.
//
// To remove: delete this file, then change lib/content.ts to import from the
// MDX loaders instead. The component layer never imports from here directly —
// it goes through lib/content.ts — so swapping is one-file-touch.
// =============================================================================

import type { Post, Project } from "./types";

const POSTS_EL: Post[] = [
  {
    slug: "kv-store",
    locale: "el",
    title: "Γιατί έγραψα τον δικό μου *key-value store*",
    description:
      "Όχι επειδή χρειαζόταν. Επειδή ήθελα να καταλάβω **τι κάνει η Redis** όταν δεν την κοιτάζω.",
    date: "2026-05-02",
    tags: ["project"],
    readingTime: 12,
    featured: true,
    cover: { kind: "color", tone: "c-coral" },
  },
  {
    slug: "hackathon-48",
    locale: "el",
    title: "48 ώρες, 3 άνθρωποι, ένα demo που *σχεδόν* δούλεψε",
    description:
      "— τι κερδίζεις πραγματικά σε ένα hackathon, εκτός από το t-shirt.",
    date: "2026-04-28",
    tags: ["competition"],
    readingTime: 5,
    cover: { kind: "color", tone: "c-mint", deco: "{ }" },
  },
  {
    slug: "side-project-syndrome",
    locale: "el",
    title: "Σύντομες σκέψεις για το *side-project syndrome*",
    description: "— έχεις 14 unfinished repos. καλώς ήρθες στο club.",
    date: "2026-04-19",
    tags: ["notes"],
    readingTime: 2,
    cover: { kind: "color", tone: "c-pattern" },
  },
  {
    slug: "coffee-and-cocoa",
    locale: "el",
    title: "Coffee + ζεστή σοκολάτα, *a defense.*",
    description:
      "— δύο σελίδες υπερασπίζοντας μια κακή ιδέα που τελικά είναι καλή.",
    date: "2026-04-11",
    tags: ["life"],
    readingTime: 3,
    cover: { kind: "color", tone: "c-butter", deco: "☕", decoColor: "ink" },
  },
  {
    slug: "rust-borrow-checker",
    locale: "el",
    title: "Rust borrow checker, *ένα έτος μετά*",
    description: "— σταμάτησα να τον μισώ. δεν είμαι σίγουρος αν είναι καλό σημάδι.",
    date: "2026-04-02",
    tags: ["learning"],
    readingTime: 8,
    cover: { kind: "color", tone: "c-coral", deco: "🦀" },
  },
  {
    slug: "mu-compiler",
    locale: "el",
    title: "Building a small *μ-compiler* for fun",
    description: "— δεν λειτουργεί ακόμα. αλλά ξέρω τώρα τι είναι ένα AST.",
    date: "2026-03-22",
    tags: ["project"],
    readingTime: 10,
    cover: { kind: "color", tone: "c-dark", deco: "μ→", decoColor: "coral" },
  },
  {
    slug: "postgres-first-db",
    locale: "el",
    title: "Why I think *Postgres* is a perfect first DB",
    description:
      "— καλά, μπορεί να μην είναι perfect. αλλά είναι αρκετά καλό για όλα.",
    date: "2026-03-14",
    tags: ["notes"],
    readingTime: 4,
    cover: { kind: "color", tone: "c-mix" },
  },
];

const POSTS_EN: Post[] = [
  {
    slug: "kv-store",
    locale: "en",
    title: "Why I wrote my own *key-value store*",
    description:
      "Not because I needed to. Because I wanted to understand **what Redis does** when I'm not looking at it.",
    date: "2026-05-02",
    tags: ["project"],
    readingTime: 12,
    featured: true,
    cover: { kind: "color", tone: "c-coral" },
  },
  {
    slug: "hackathon-48",
    locale: "en",
    title: "48 hours, 3 people, a demo that *almost* worked",
    description:
      "— what you actually take home from a hackathon, besides the t-shirt.",
    date: "2026-04-28",
    tags: ["competition"],
    readingTime: 5,
    cover: { kind: "color", tone: "c-mint", deco: "{ }" },
  },
  {
    slug: "side-project-syndrome",
    locale: "en",
    title: "Short thoughts on *side-project syndrome*",
    description: "— you have 14 unfinished repos. welcome to the club.",
    date: "2026-04-19",
    tags: ["notes"],
    readingTime: 2,
    cover: { kind: "color", tone: "c-pattern" },
  },
  {
    slug: "coffee-and-cocoa",
    locale: "en",
    title: "Coffee + hot chocolate, *a defense.*",
    description:
      "— two pages defending a bad idea that turns out to be good.",
    date: "2026-04-11",
    tags: ["life"],
    readingTime: 3,
    cover: { kind: "color", tone: "c-butter", deco: "☕", decoColor: "ink" },
  },
  {
    slug: "rust-borrow-checker",
    locale: "en",
    title: "The Rust borrow checker, *one year in*",
    description: "— I stopped hating it. Not sure if that's a good sign.",
    date: "2026-04-02",
    tags: ["learning"],
    readingTime: 8,
    cover: { kind: "color", tone: "c-coral", deco: "🦀" },
  },
  {
    slug: "mu-compiler",
    locale: "en",
    title: "Building a small *μ-compiler* for fun",
    description: "— it doesn't work yet. but at least now I know what an AST is.",
    date: "2026-03-22",
    tags: ["project"],
    readingTime: 10,
    cover: { kind: "color", tone: "c-dark", deco: "μ→", decoColor: "coral" },
  },
  {
    slug: "postgres-first-db",
    locale: "en",
    title: "Why I think *Postgres* is a perfect first DB",
    description: "— ok, maybe not perfect. but good enough for almost everything.",
    date: "2026-03-14",
    tags: ["notes"],
    readingTime: 4,
    cover: { kind: "color", tone: "c-mix" },
  },
];

const PROJECTS_EL: Project[] = [
  {
    slug: "crowdless",
    locale: "el",
    title: "Crowd*less*",
    tagline:
      "Σε στέλνει σε όμορφα ήσυχα μέρη — όχι απλά ήσυχα. Κρυφά διαμάντια.",
    year: 2026,
    status: "live",
    statusLabel: "ΖΩΝΤΑΝΟ",
    stack: ["rust", "wasm", "leaflet"],
    order: 1,
  },
  {
    slug: "hackathens",
    locale: "el",
    title: "Hack*athens* '25",
    tagline:
      "48 ώρες, 3 άνθρωποι, ένα ML model που προβλέπει λάθος πράγματα με ύφος. 2nd place.",
    year: 2025,
    status: "award",
    statusLabel: "2ND PLACE",
    stack: ["python", "fastapi", "pytorch"],
    order: 2,
  },
  {
    slug: "mu-compiler",
    locale: "el",
    title: "μ-*compiler*",
    tagline:
      "Compiler από το μηδέν, σε OCaml. Δεν λειτουργεί ακόμα. Αλλά μαθαίνω.",
    year: 2026,
    status: "wip",
    statusLabel: "WIP",
    stack: ["ocaml", "llvm"],
    order: 3,
  },
];

const PROJECTS_EN: Project[] = [
  {
    slug: "crowdless",
    locale: "en",
    title: "Crowd*less*",
    tagline:
      "Sends you to beautifully quiet places — not just quiet. Hidden gems.",
    year: 2026,
    status: "live",
    statusLabel: "LIVE",
    stack: ["rust", "wasm", "leaflet"],
    order: 1,
  },
  {
    slug: "hackathens",
    locale: "en",
    title: "Hack*athens* '25",
    tagline:
      "48 hours, 3 people, an ML model that predicts wrong things with style. 2nd place.",
    year: 2025,
    status: "award",
    statusLabel: "2ND PLACE",
    stack: ["python", "fastapi", "pytorch"],
    order: 2,
  },
  {
    slug: "mu-compiler",
    locale: "en",
    title: "μ-*compiler*",
    tagline:
      "Compiler from scratch, in OCaml. Doesn't work yet. But I'm learning.",
    year: 2026,
    status: "wip",
    statusLabel: "WIP",
    stack: ["ocaml", "llvm"],
    order: 3,
  },
];

export const MOCK_POSTS = { el: POSTS_EL, en: POSTS_EN } as const;
export const MOCK_PROJECTS = { el: PROJECTS_EL, en: PROJECTS_EN } as const;
export const MOCK_TOTAL_POSTS = POSTS_EL.length + 7; // pretend the archive has 14
export const MOCK_TOTAL_PROJECTS = PROJECTS_EL.length;
