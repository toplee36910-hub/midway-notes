import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentBase = resolve(__dirname, 'content');

const schema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  summary: z.string(),
  tags: z.array(z.string()).default([]),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: resolve(contentBase, 'projects') }),
  schema,
});

const howto = defineCollection({
  loader: glob({ pattern: '**/*.md', base: resolve(contentBase, 'howto') }),
  schema,
});

const pitfalls = defineCollection({
  loader: glob({ pattern: '**/*.md', base: resolve(contentBase, 'pitfalls') }),
  schema,
});

const thoughts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: resolve(contentBase, 'thoughts') }),
  schema,
});

export const collections = { projects, howto, pitfalls, thoughts };
