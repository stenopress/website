import { basename, dirname, fromFileUrl, join } from "@std/path";

const projectRoot = dirname(dirname(fromFileUrl(import.meta.url)));
const sourceDir = join(projectRoot, "docs-source");
const targetDir = join(projectRoot, "content", "docs");
const searchIndexPath = join(
  projectRoot,
  "theme",
  "assets",
  "docs-search.json",
);

function titleFromMarkdown(markdown: string, fileName: string): string {
  const heading = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (heading) return heading;
  return basename(fileName, ".md")
    .replaceAll(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function websiteLinks(markdown: string): string {
  return markdown
    .replaceAll("{@include", "&#123;@include")
    .replace(
      /\]\((?!https?:|#)([^)]+?)\.md(#[^)]+)?\)/g,
      (_match, path: string, anchor = "") => {
        const name = basename(path);
        const route = name === "README" ? "/docs/" : `/docs/${name}/`;
        return `](${route}${anchor})`;
      },
    );
}

await Deno.mkdir(targetDir, { recursive: true });
const searchEntries: Array<{
  title: string;
  route: string;
  excerpt: string;
  headings: string[];
}> = [];

for await (const entry of Deno.readDir(targetDir)) {
  if (entry.isFile && entry.name.endsWith(".md")) {
    await Deno.remove(join(targetDir, entry.name));
  }
}

for await (const entry of Deno.readDir(sourceDir)) {
  if (!entry.isFile || !entry.name.endsWith(".md")) continue;

  const source = await Deno.readTextFile(join(sourceDir, entry.name));
  const title = titleFromMarkdown(source, entry.name);
  const outputName = entry.name === "README.md" ? "index.md" : entry.name;
  const generated = `---
title: ${JSON.stringify(title)}
description: ${JSON.stringify(`${title}, from the Steno documentation.`)}
layout: docs
---

${websiteLinks(source)}
`;
  await Deno.writeTextFile(join(targetDir, outputName), generated);
  const route = entry.name === "README.md"
    ? "/docs/"
    : `/docs/${basename(entry.name, ".md")}/`;
  const plain = source
    .replaceAll(/```[\s\S]*?```/g, " ")
    .replaceAll(/[#>*_`\[\]()]/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim();
  searchEntries.push({
    title,
    route,
    excerpt: plain.slice(0, 180),
    headings: [...source.matchAll(/^#{2,3}\s+(.+)$/gm)].map((match) =>
      match[1].trim()
    ),
  });
}

await Deno.writeTextFile(
  searchIndexPath,
  JSON.stringify(searchEntries.sort((a, b) => a.title.localeCompare(b.title))),
);
