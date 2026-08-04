import { mergeTheme, type StenoTheme } from "@steno/steno";
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

const header = await Deno.readTextFile(
  new URL("./components/Header.tau", import.meta.url),
);
const footer = await Deno.readTextFile(
  new URL("./components/Footer.tau", import.meta.url),
);
const searchDialog = await Deno.readTextFile(
  new URL("./components/SearchDialog.tau", import.meta.url),
);

const theme: StenoTheme = mergeTheme(baseTheme, {
  name: "steno-website",
  layouts: { landing, docs, themes, plugins },
  components: { header, footer, searchDialog },
  assets: {
    "website.css": new URL("./assets/website.css", import.meta.url),
    "website.js": new URL("./assets/website.js", import.meta.url),
  },
});

export default theme;
