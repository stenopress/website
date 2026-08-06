/**
 * Builds content/_data/themes.yml from the per-theme registry files in
 * registry/themes/official/*.yml and registry/themes/community/*.yml, rendering
 * each theme's `previewHtml` with the real Tau engine - not a hand-typed
 * HTML/CSS approximation of what the theme looks like.
 *
 * content/_data/themes.yml is fully generated (gitignored) - never hand-edit
 * it. To add a theme, drop a new registry file instead; see README.md.
 *
 * Run automatically before every `deno task build`/`dev` (see deno.json).
 * Safe to run manually too: `deno run -A scripts/generate_theme_previews.ts`.
 *
 * @module
 */

import { parse as parseYaml } from "@std/yaml";
import { Theme } from "@steno/steno";
import type { StenoTheme } from "@steno/steno";
import { marked } from "marked";

/** One theme registry entry, hand-authored under registry/themes/. */
interface ThemeSpec {
  name: string;
  package: string;
  label: string;
  description: string;
  install: string;
  sourceUrl: string;
  /** Full `jsr:`/`npm:` specifier, resolved with dynamic `import()` - no
   * import-map entry needed, so community themes never touch deno.json. */
  moduleSpecifier: string;
  /** Sample frontmatter + Markdown body rendered through the theme's `layout`. */
  demoFrontmatter: Record<string, unknown>;
  demoBody: string;
}

const REGISTRY_ROOT = new URL("../registry/themes/", import.meta.url);
const CATEGORIES = ["official", "community"] as const;
type Category = (typeof CATEGORIES)[number];

/** Reads and parses every `*.yml` registry file in a category, sorted by filename. */
async function loadCategory(
  category: Category,
): Promise<{ file: string; spec: ThemeSpec }[]> {
  const dirUrl = new URL(`${category}/`, REGISTRY_ROOT);
  const entries: { file: string; spec: ThemeSpec }[] = [];
  try {
    for await (const entry of Deno.readDir(dirUrl)) {
      if (!entry.isFile || !entry.name.endsWith(".yml")) continue;
      const fileUrl = new URL(entry.name, dirUrl);
      const text = await Deno.readTextFile(fileUrl);
      const spec = parseYaml(text) as ThemeSpec;
      entries.push({ file: `${category}/${entry.name}`, spec });
    }
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) throw err;
  }
  entries.sort((a, b) => a.file.localeCompare(b.file));
  return entries;
}

/** Strips <script>...</script> tags - dead weight in a static thumbnail. */
function stripScripts(html: string): string {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
}

/** Inlines the theme's compiled CSS, dropping the external <link> tag. */
function inlineStylesheet(html: string, css: string): string {
  return html.replace(
    /<link[^>]*rel="stylesheet"[^>]*>/i,
    `<style>${css}</style>`,
  );
}

async function renderPreview(spec: ThemeSpec): Promise<string> {
  const themeModule = await import(spec.moduleSpecifier);
  const themeData = themeModule.default as StenoTheme;
  const theme = new Theme(themeData, {});

  const contentHtml = await marked.parse(spec.demoBody);

  const tmpDir = await Deno.makeTempDir({ prefix: "steno-theme-preview-" });
  let css = "";
  try {
    const manifest = await theme.copyAssets(tmpDir, new Set(), false);
    const cssRelPath = Object.keys(manifest).find((p) => p.endsWith(".css"));
    if (cssRelPath) {
      css = await Deno.readTextFile(`${tmpDir}/assets/${manifest[cssRelPath]}`);
    }
  } finally {
    await Deno.remove(tmpDir, { recursive: true });
  }

  const html = await theme.renderLayout("layout", contentHtml, {
    ...spec.demoFrontmatter,
    site: { title: spec.name },
    theme: theme.config,
    assets: Object.fromEntries(
      Object.keys(themeData.assets ?? {}).map((k) => [k, k]),
    ),
  });

  return stripScripts(inlineStylesheet(html, css)).trim();
}

/** Escapes a plain YAML scalar (double-quoted style, used for short fields). */
function yamlString(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/** Indents every line of a block-literal scalar's content by `spaces`. */
function indentBlock(text: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => (line.length > 0 ? pad + line : line))
    .join("\n");
}

async function renderCategory(category: Category): Promise<string> {
  const registryEntries = await loadCategory(category);
  const entries: string[] = [];
  for (const { file, spec } of registryEntries) {
    console.log(`Rendering preview: ${category}/${spec.name} (${file})...`);
    let previewHtml: string;
    try {
      previewHtml = await renderPreview(spec);
    } catch (err) {
      throw new Error(`Failed to render theme registry file ${file}: ${err}`, {
        cause: err,
      });
    }
    entries.push(
      [
        `  - name: ${spec.name}`,
        `    package: ${yamlString(spec.package)}`,
        `    label: ${spec.label}`,
        `    description: ${spec.description}`,
        `    install: ${yamlString(spec.install)}`,
        `    sourceUrl: ${spec.sourceUrl}`,
        `    previewHtml: |`,
        indentBlock(previewHtml, 6),
      ].join("\n"),
    );
  }
  return entries.length > 0 ? entries.join("\n") : "";
}

async function main() {
  const sections: string[] = [];
  for (const category of CATEGORIES) {
    const body = await renderCategory(category);
    sections.push(body ? `${category}:\n${body}` : `${category}: []`);
  }

  const yaml = `# GENERATED FILE - do not hand-edit.
# Produced by scripts/generate_theme_previews.ts from the registry files in
# registry/themes/official/ and registry/themes/community/. To add or change a
# theme, edit those files and rerun \`deno task previews\` (also run
# automatically by \`deno task build\`/\`dev\`). See README.md.
${sections.join("\n")}
`;

  await Deno.writeTextFile("content/_data/themes.yml", yaml);
  console.log("Wrote content/_data/themes.yml");
}

if (import.meta.main) {
  await main();
}
