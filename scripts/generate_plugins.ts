/**
 * Builds content/_data/plugins.yml from the per-plugin registry files in
 * registry/plugins/official/*.yml and registry/plugins/community/*.yml.
 *
 * content/_data/plugins.yml is fully generated (gitignored) - never hand-edit
 * it. To add a plugin, drop a new registry file instead; see README.md.
 *
 * Run automatically before every `deno task build`/`dev` (see deno.json).
 * Safe to run manually too: `deno run -A scripts/generate_plugins.ts`.
 *
 * @module
 */

import { parse as parseYaml } from "@std/yaml";

/** One plugin registry entry, hand-authored under registry/plugins/. */
interface PluginSpec {
  name: string;
  package: string;
  label: string;
  description: string;
  install: string;
  sourceUrl: string;
}

const REQUIRED_FIELDS: (keyof PluginSpec)[] = [
  "name",
  "package",
  "label",
  "description",
  "install",
  "sourceUrl",
];

const REGISTRY_ROOT = new URL("../registry/plugins/", import.meta.url);
const CATEGORIES = ["official", "community"] as const;
type Category = (typeof CATEGORIES)[number];

/** Reads and parses every `*.yml` registry file in a category, sorted by filename. */
async function loadCategory(
  category: Category,
): Promise<{ file: string; spec: PluginSpec }[]> {
  const dirUrl = new URL(`${category}/`, REGISTRY_ROOT);
  const entries: { file: string; spec: PluginSpec }[] = [];
  try {
    for await (const entry of Deno.readDir(dirUrl)) {
      if (!entry.isFile || !entry.name.endsWith(".yml")) continue;
      const fileUrl = new URL(entry.name, dirUrl);
      const text = await Deno.readTextFile(fileUrl);
      const spec = parseYaml(text) as PluginSpec;
      const file = `${category}/${entry.name}`;
      for (const field of REQUIRED_FIELDS) {
        if (!spec[field]) {
          throw new Error(
            `Registry file ${file} is missing required field "${field}"`,
          );
        }
      }
      entries.push({ file, spec });
    }
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) throw err;
  }
  entries.sort((a, b) => a.file.localeCompare(b.file));
  return entries;
}

/** Escapes a plain YAML scalar (double-quoted style, used for short fields). */
function yamlString(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

async function renderCategory(category: Category): Promise<string> {
  const registryEntries = await loadCategory(category);
  const entries = registryEntries.map(({ spec }) =>
    [
      `  - name: ${spec.name}`,
      `    package: ${yamlString(spec.package)}`,
      `    label: ${spec.label}`,
      `    description: ${spec.description}`,
      `    install: ${yamlString(spec.install)}`,
      `    sourceUrl: ${spec.sourceUrl}`,
    ].join("\n")
  );
  return entries.length > 0 ? entries.join("\n") : "";
}

async function main() {
  const sections: string[] = [];
  for (const category of CATEGORIES) {
    const body = await renderCategory(category);
    sections.push(body ? `${category}:\n${body}` : `${category}: []`);
  }

  const yaml = `# GENERATED FILE - do not hand-edit.
# Produced by scripts/generate_plugins.ts from the registry files in
# registry/plugins/official/ and registry/plugins/community/. To add or change
# a plugin, edit those files and rerun \`deno task plugins\` (also run
# automatically by \`deno task build\`/\`dev\`). See README.md.
${sections.join("\n")}
`;

  await Deno.writeTextFile("content/_data/plugins.yml", yaml);
  console.log("Wrote content/_data/plugins.yml");
}

if (import.meta.main) {
  await main();
}
