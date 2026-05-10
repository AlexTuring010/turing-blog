import { z } from "zod";

const POST_TAGS = ["project", "competition", "learning", "life", "notes"] as const;
const PROJECT_STATUSES = ["live", "wip", "archived", "award"] as const;

export const PostFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD"),
  tags: z.array(z.enum(POST_TAGS)).min(1),
  readingTime: z.number().int().positive(),
  featured: z.boolean().optional(),
  cover: z.string().optional(),
});

export const ProjectFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  year: z.number().int().min(2000).max(2100),
  status: z.enum(PROJECT_STATUSES),
  statusLabel: z.string().min(1),
  stack: z.array(z.string().min(1)).min(1),
  links: z
    .object({
      live: z.string().url().optional(),
      github: z.string().url().optional(),
    })
    .optional(),
  order: z.number().int(),
  cover: z.string().optional(),
});

export type ParsedPostFrontmatter = z.infer<typeof PostFrontmatterSchema>;
export type ParsedProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>;

// Parses raw frontmatter (already extracted from MDX) and returns either the
// validated object or a thrown error tagged with the file path.
export function parsePostFrontmatter(
  raw: unknown,
  source: string,
): ParsedPostFrontmatter {
  const r = PostFrontmatterSchema.safeParse(raw);
  if (!r.success) {
    throw new Error(
      `Invalid post frontmatter in ${source}:\n${formatZodIssues(r.error.issues)}`,
    );
  }
  return r.data;
}

export function parseProjectFrontmatter(
  raw: unknown,
  source: string,
): ParsedProjectFrontmatter {
  const r = ProjectFrontmatterSchema.safeParse(raw);
  if (!r.success) {
    throw new Error(
      `Invalid project frontmatter in ${source}:\n${formatZodIssues(r.error.issues)}`,
    );
  }
  return r.data;
}

function formatZodIssues(issues: z.ZodIssue[]): string {
  return issues
    .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
}
