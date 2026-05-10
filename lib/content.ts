// Content API consumed by every component that needs posts or projects.
//
// Phase 1: backed by lib/mocks.ts (placeholder data).
// Phase 2: replace the bodies below with MDX loaders that read content/posts/
//   and content/projects/. The function signatures stay the same, so no
//   component needs to change.

import type { Locale } from "@/i18n/routing";
import {
  MOCK_POSTS,
  MOCK_PROJECTS,
  MOCK_TOTAL_POSTS,
  MOCK_TOTAL_PROJECTS,
} from "./mocks";
import type { Post, Project } from "./types";

export function getAllPosts(locale: Locale): Post[] {
  return [...MOCK_POSTS[locale]].sort((a, b) => b.date.localeCompare(a.date));
}

export function getFeaturedPost(locale: Locale): Post | undefined {
  return getAllPosts(locale).find((p) => p.featured);
}

export function getRecentPosts(locale: Locale, limit: number): Post[] {
  // Excludes the featured post — it gets its own block on the homepage.
  return getAllPosts(locale)
    .filter((p) => !p.featured)
    .slice(0, limit);
}

export function getTotalPostsCount(_locale: Locale): number {
  return MOCK_TOTAL_POSTS;
}

export function getAllProjects(locale: Locale): Project[] {
  return [...MOCK_PROJECTS[locale]].sort((a, b) => a.order - b.order);
}

export function getFeaturedProjects(locale: Locale, limit: number): Project[] {
  return getAllProjects(locale).slice(0, limit);
}

export function getTotalProjectsCount(_locale: Locale): number {
  return MOCK_TOTAL_PROJECTS;
}
