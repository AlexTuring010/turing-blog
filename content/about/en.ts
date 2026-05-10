// =============================================================================
// ABOUT PAGE — English content
// =============================================================================
// Edit freely. No frontmatter validation runs against this file.
// Markers: `*word*` → italic + coral-dark, `**word**` → coral highlight.
// =============================================================================

import type { AboutContent } from "./types";

const TODO_EMAIL = "TODO_EMAIL";
const TODO_GITHUB_URL = "https://github.com/AlexTuring010";
const TODO_LINKEDIN_URL = "TODO_LINKEDIN";
const TODO_CV_URL = "TODO_CV_URL";

export const aboutEn: AboutContent = {
  hero: {
    eyebrowAvailability: "Available · Sept 2026",
    eyebrowLocation: "Athens, GR",
    title: "Hi, I'm *Alex.*",
    intro:
      "CS student in Athens, freelance web dev, and someone who *can't stand* not knowing how things work underneath. I write here about compilers, side projects, and the kind of thoughts that show up at 3am.",
  },
  sectionTitles: {
    now: "Now*.*",
    arc: "The *arc.*",
    stack: "Stack*.*",
    reading: "Reading*.*",
    reach: "Reach *me.*",
  },
  nowMeta: "updated Feb 2026",
  nowItems: [
    {
      label: "Studying",
      content: "3rd-year CS @ NTUA. Compilers, OS, distributed systems this semester.",
    },
    {
      label: "Building",
      content:
        "μ-compiler in OCaml. A toy database in Rust to actually understand B-trees.",
    },
    {
      label: "Reading",
      content:
        "Crafting Interpreters (Nystrom) · Designing Data-Intensive Applications (Kleppmann).",
    },
    {
      label: "Looking for",
      content: "SWE internship for summer '26. Backend or systems-y stuff.",
    },
  ],
  arcParagraphs: [
    "I started programming at **14**, writing Lua to mod a game I was playing. The mods were terrible but I was hooked. By the end of high school I knew I wanted to study CS — even though no one in my family had ever touched a computer professionally.",
    "I got into **NTUA** in 2023. The first two years I did the usual: learned Java for course credit, did assignments the night before, thought I was the smartest one in the room. I wasn't.",
    "The realization came when I tried to build my first *real* project — a site for a friend. I didn't know what deployment was. Didn't know what DNS was. Didn't know why we needed a database. Four years of graph theory, and I couldn't get an HTML file online.",
    "Since then I've been trying to learn **real** things. Not just for exams. For the joy of actually understanding. How a compiler works from the inside. Why Postgres is the way it is. How to write code that won't need a rewrite in six months.",
    "Now I write here. I work on side projects. I take freelance gigs to pay rent. In parallel I'm looking for an internship — somewhere I can learn from people smarter than me and write code used by *actual* users.",
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
      title: "Crafting Interpreters _— building a language from scratch_",
      author: "Robert Nystrom",
    },
    {
      status: "now",
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
    },
    {
      status: "done",
      title: "Brave New World _— rereading after 6 years_",
      author: "Aldous Huxley",
    },
    {
      status: "done",
      title: "The Pragmatic Programmer (20th anniv. ed.)",
      author: "Hunt & Thomas",
    },
    {
      status: "done",
      title: "Project Hail Mary _— sci-fi because the brain needs a break_",
      author: "Andy Weir",
    },
    {
      status: "done",
      title: "The Rust Programming Language",
      author: "Klabnik & Nichols",
    },
  ],
  reachLede:
    "If you're a recruiter, a founder, or someone who read a post and wants to talk — *write to me*. I don't bite. Usually.",
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
  responseTime: "24 hours",
  responseNote: "I usually reply within {responseTime}. If not, ping again — I probably missed it.",
};
