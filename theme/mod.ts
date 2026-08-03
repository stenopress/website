import type { StenoTheme } from "@steno/steno";
import baseTheme from "@steno/theme-marketing-minimal";

const landing = await Deno.readTextFile(
  new URL("./layouts/landing.tau", import.meta.url),
);
const docs = await Deno.readTextFile(
  new URL("./layouts/docs.tau", import.meta.url),
);
const themes = await Deno.readTextFile(
  new URL("./layouts/themes.tau", import.meta.url),
);
const plugins = await Deno.readTextFile(
  new URL("./layouts/plugins.tau", import.meta.url),
);

const theme: StenoTheme = {
  ...baseTheme,
  name: "steno-website",
  layouts: { landing, docs, themes, plugins },
  assets: {
    ...baseTheme.assets,
    "concept.css": new URL("./assets/concept.css", import.meta.url),
    "concept.js": new URL("./assets/concept.js", import.meta.url),
    "docs-search.json": new URL(
      "./assets/docs-search.json",
      import.meta.url,
    ),
  },
};

export default theme;
