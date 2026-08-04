/**
 * Keeps content/_data/docs_navigation.yml in sync with docs-source/*.md
 * after an automated docs-source sync (see .github/workflows/sync-docs.yml).
 *
 * A page upstream steno adds or removes doesn't automatically appear or
 * disappear from the hand-curated sidebar nav - this reconciles the two:
 *
 * - A docs-source file with no matching nav entry gets appended under an
 *   "Unsorted (needs placement)" section, so a new page is never silently
 *   orphaned (buildable but unreachable from the sidebar). A human still
 *   decides where it *should* live; this only guarantees it's linked.
 * - A nav entry pointing at a docs-source file that no longer exists
 *   (upstream renamed or removed it) is dropped, so the sidebar doesn't
 *   grow dead links.
 *
 * Exits 0 with no changes if nav already matches docs-source. Run from the
 * repo root.
 */
import {
  parse as parseYaml,
  stringify as stringifyYaml,
} from "jsr:@std/yaml@^1.1.2";
import { basename, join } from "jsr:@std/path@^1.1.6";

interface NavLink {
  title: string;
  href: string;
}

interface NavSection {
  label: string;
  links: NavLink[];
}

const UNSORTED_LABEL = "Unsorted (needs placement)";
const NAV_PATH = "content/_data/docs_navigation.yml";
const DOCS_SOURCE_DIR = "docs-source";

function slugFromFilename(fileName: string): string {
  const base = basename(fileName, ".md");
  return base === "README" ? "" : base;
}

function titleFromSlug(slug: string): string {
  return slug
    .replaceAll(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function hrefForSlug(slug: string): string {
  return slug ? `/docs/${slug}/` : "/docs/";
}

async function currentDocsSlugs(): Promise<Set<string>> {
  const slugs = new Set<string>();
  for await (const entry of Deno.readDir(DOCS_SOURCE_DIR)) {
    if (entry.isFile && entry.name.endsWith(".md")) {
      slugs.add(slugFromFilename(entry.name));
    }
  }
  return slugs;
}

async function main(): Promise<void> {
  const docsSlugs = await currentDocsSlugs();
  const navText = await Deno.readTextFile(NAV_PATH);
  const nav = parseYaml(navText) as NavSection[];

  const linkedSlugs = new Set<string>();
  let changed = false;

  // Drop nav links pointing at docs-source files that no longer exist.
  for (const section of nav) {
    const before = section.links.length;
    section.links = section.links.filter((link) => {
      const slug = link.href.replace(/^\/docs\//, "").replace(/\/$/, "");
      const stillExists = docsSlugs.has(slug);
      if (stillExists) linkedSlugs.add(slug);
      return stillExists;
    });
    if (section.links.length !== before) changed = true;
  }
  const prunedSections = nav.filter((section) => section.links.length > 0);
  if (prunedSections.length !== nav.length) changed = true;

  // Append any docs-source file missing from the nav entirely.
  const missing = [...docsSlugs].filter((slug) => !linkedSlugs.has(slug))
    .sort();
  if (missing.length > 0) {
    changed = true;
    let unsorted = prunedSections.find((s) => s.label === UNSORTED_LABEL);
    if (!unsorted) {
      unsorted = { label: UNSORTED_LABEL, links: [] };
      prunedSections.push(unsorted);
    }
    for (const slug of missing) {
      unsorted.links.push({
        title: titleFromSlug(slug),
        href: hrefForSlug(slug),
      });
    }
  }

  if (!changed) {
    console.log(
      "docs_navigation.yml already matches docs-source/ - no changes.",
    );
    return;
  }

  const output = stringifyYaml(prunedSections, { lineWidth: -1 });
  await Deno.writeTextFile(join(Deno.cwd(), NAV_PATH), output);

  if (missing.length > 0) {
    console.log(
      `Added ${missing.length} page(s) to the "${UNSORTED_LABEL}" section: ${
        missing.join(", ")
      }. Move them into the right section before merging.`,
    );
  }
}

await main();
