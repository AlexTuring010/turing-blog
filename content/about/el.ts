// =============================================================================
// ABOUT PAGE — Greek content
// =============================================================================
// Edit freely. No frontmatter validation runs against this file.
// Markers: `*word*` → italic + coral-dark, `**word**` → coral highlight.
// =============================================================================

import type { AboutContent } from "./types";

const TODO_EMAIL = "TODO_EMAIL";
const TODO_GITHUB_URL = "https://github.com/AlexTuring010";
const TODO_LINKEDIN_URL = "TODO_LINKEDIN";
const TODO_CV_URL = "TODO_CV_URL";

export const aboutEl: AboutContent = {
  hero: {
    eyebrowAvailability: "Available · Σεπ 2026",
    eyebrowLocation: "Athens, GR",
    title: "Hi, είμαι ο *Αλέξανδρος.*",
    intro:
      "CS student στην Αθήνα, freelance web dev, και κάποιος που *δεν αντέχει* να μην καταλάβει πώς δουλεύουν τα πράγματα από κάτω. Γράφω εδώ για compilers, side projects, και τις σκέψεις που έρχονται γύρω στις 3 το πρωί.",
  },
  sectionTitles: {
    now: "Now*.*",
    arc: "The *arc.*",
    stack: "Stack*.*",
    reading: "Reading*.*",
    reach: "Reach *me.*",
  },
  nowMeta: "updated Φεβ 2026",
  nowItems: [
    {
      label: "Studying",
      content:
        "3rd year CS @ NTUA. Compilers, OS, distributed systems αυτό το semester.",
    },
    {
      label: "Building",
      content:
        "μ-compiler σε OCaml. Ένα toy database σε Rust για να καταλάβω B-trees.",
    },
    {
      label: "Reading",
      content:
        "Crafting Interpreters (Nystrom) · Designing Data-Intensive Applications (Kleppmann).",
    },
    {
      label: "Looking for",
      content: "SWE internship για το καλοκαίρι του '26. Backend ή systems-y stuff.",
    },
  ],
  arcParagraphs: [
    "Άρχισα να προγραμματίζω στα **14**, γράφοντας Lua για να φτιάξω εξωτερικά mods σε ένα παιχνίδι που έπαιζα. Τα mods ήταν χάλια αλλά είχα κολλήσει. Όταν τέλειωσα το γυμνάσιο, ήξερα ότι ήθελα να σπουδάσω CS — αν και κανείς στην οικογένεια μου δεν είχε ξανα-ασχοληθεί με υπολογιστές.",
    "Πέρασα στο **NTUA** το 2023. Τα πρώτα δύο χρόνια έκανα τα συνηθισμένα: μάθαινα Java για το course, έκανα assignments τη νύχτα πριν την παράδοση, νόμιζα ότι ήμουν ο πιο έξυπνος της παρέας. Δεν ήμουν.",
    "Το realization ήρθε όταν προσπάθησα να φτιάξω το πρώτο μου *πραγματικό* project — ένα site για έναν φίλο μου. Δεν ήξερα τι είναι deployment. Δεν ήξερα τι είναι DNS. Δεν ήξερα γιατί χρειαζόμασταν database. Τέσσερα χρόνια θεωρίας γραφημάτων, και δεν μπορούσα να βγάλω ένα HTML αρχείο online.",
    "Από τότε προσπαθώ να μάθω **πραγματικά** πράγματα. Όχι μόνο για exams. Για τη χαρά του να καταλαβαίνεις. Πώς δουλεύει ένας compiler από μέσα. Γιατί η Postgres είναι έτσι. Πώς να γράφεις κώδικα που δεν θα χρειάζεται rewrite σε 6 μήνες.",
    "Τώρα γράφω εδώ. Δουλεύω σε side projects. Παίρνω freelance δουλειές για να πληρώνω το νοίκι. Παράλληλα ψάχνω για internship — κάπου που να μπορώ να μάθω από ανθρώπους πιο έξυπνους από εμένα και να γράφω κώδικα που χρησιμοποιείται από *πραγματικούς* users.",
  ],
  stackMeta: "★ = daily driver",
  stackGroups: [
    {
      label: "Languages",
      chips: [
        { label: "typescript", fav: true },
        { label: "python", fav: true },
        { label: "rust", fav: true },
        { label: "ocaml" },
        { label: "go" },
        { label: "c" },
        { label: "sql" },
      ],
    },
    {
      label: "Frontend",
      chips: [
        { label: "nextjs", fav: true },
        { label: "react", fav: true },
        { label: "tailwind", fav: true },
        { label: "astro" },
        { label: "svelte" },
      ],
    },
    {
      label: "Backend / Data",
      chips: [
        { label: "postgres", fav: true },
        { label: "fastapi", fav: true },
        { label: "redis" },
        { label: "prisma" },
        { label: "pytorch" },
        { label: "sqlite" },
      ],
    },
    {
      label: "Infra / Tools",
      chips: [
        { label: "vercel", fav: true },
        { label: "neovim", fav: true },
        { label: "git", fav: true },
        { label: "docker" },
        { label: "cloudflare" },
        { label: "linux" },
        { label: "tmux" },
      ],
    },
  ],
  readingMeta: "recent + current",
  readingItems: [
    {
      status: "now",
      title: "Crafting Interpreters _— χτίζοντας μια γλώσσα από το μηδέν_",
      author: "Robert Nystrom",
    },
    {
      status: "now",
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
    },
    {
      status: "done",
      title: "Brave New World _— ξανά μετά από 6 χρόνια_",
      author: "Aldous Huxley",
    },
    {
      status: "done",
      title: "The Pragmatic Programmer (20th anniv. ed.)",
      author: "Hunt & Thomas",
    },
    {
      status: "done",
      title: "Project Hail Mary _— sci-fi γιατί το brain χρειάζεται break_",
      author: "Andy Weir",
    },
    {
      status: "done",
      title: "The Rust Programming Language",
      author: "Klabnik & Nichols",
    },
  ],
  reachLede:
    "Αν είσαι recruiter, founder, ή απλά κάποιος που διάβασε ένα post και θέλει να μιλήσει — *γράψε μου*. Δεν δαγκώνω. Συνήθως.",
  contactLinks: [
    {
      kind: "email",
      href: `mailto:${TODO_EMAIL}`,
      label: TODO_EMAIL,
      primary: true,
    },
    { kind: "github", href: TODO_GITHUB_URL, label: "GitHub" },
    { kind: "linkedin", href: TODO_LINKEDIN_URL, label: "LinkedIn" },
    { kind: "cv", href: TODO_CV_URL, label: "CV (PDF)" },
  ],
  responseTime: "24 ώρες",
  responseNote:
    "Συνήθως απαντάω εντός {responseTime}. Αν όχι, ξαναγράψε — μάλλον το έχασα.",
};
