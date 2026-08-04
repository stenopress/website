const reducedMotion = globalThis.matchMedia("(prefers-reduced-motion: reduce)");

const wait = (milliseconds) =>
  new Promise((resolve) => globalThis.setTimeout(resolve, milliseconds));

function loopInView(element, cycle, pause = 3200) {
  if (reducedMotion.matches) {
    cycle(true);
    return;
  }

  let run = 0;
  let visible = false;
  const start = async () => {
    const currentRun = ++run;
    await wait(320);
    while (visible && currentRun === run) {
      await cycle(false);
      if (!visible || currentRun !== run) break;
      await wait(pause);
    }
  };

  new IntersectionObserver((entries) => {
    const nextVisible = entries[0]?.isIntersecting ?? false;
    if (nextVisible === visible) return;
    visible = nextVisible;
    if (visible) start();
    else run++;
  }, { threshold: 0.3 }).observe(element);
}

for (const button of document.querySelectorAll("[data-run-build]")) {
  const demo = button.closest(".build-demo");
  let building = false;
  const runBuild = async (instant = false) => {
    if (building) return;
    building = true;
    const stages = [...demo.querySelectorAll("[data-build-stage]")];
    const result = demo.querySelector("[data-build-result]");
    button.disabled = true;
    result.innerHTML = "<b>•</b> Building <span>staging output</span>";
    for (const stage of stages) stage.classList.remove("active", "done");
    for (const stage of stages) {
      stage.classList.add("active");
      if (!instant) await wait(480);
      stage.classList.remove("active");
      stage.classList.add("done");
    }
    result.innerHTML = "<b>✓</b> Build complete <span>1 page in 8ms</span>";
    button.disabled = false;
    building = false;
  };
  button.addEventListener("click", () => runBuild());
  loopInView(demo, runBuild, 3800);
}

for (const demo of document.querySelectorAll("[data-atomic-demo]")) {
  const card = demo.closest(".transaction-card");
  const status = card.querySelector("[data-atomic-status]");
  const message = card.querySelector("[data-atomic-message]");
  const showOutcome = (outcome) => {
    const success = outcome === "success";
    card.dataset.atomicState = success ? "success" : "failure";
    status.textContent = success ? "Promoted" : "Rolled back";
    message.textContent = success
      ? "Validation passed. The complete staging tree replaced dist/."
      : "The build failed. Staging was discarded and dist/ stayed untouched.";
  };
  for (const button of card.querySelectorAll("[data-atomic-action]")) {
    button.addEventListener(
      "click",
      () => showOutcome(button.dataset.atomicAction),
    );
  }
  let nextOutcome = "success";
  loopInView(card, async (instant) => {
    showOutcome(nextOutcome);
    nextOutcome = nextOutcome === "success" ? "failure" : "success";
    if (!instant) await wait(1500);
  }, 3000);
}

for (const demo of document.querySelectorAll("[data-plugin-demo]")) {
  const granted = new Set();
  const log = demo.querySelector("[data-plugin-log]");
  const permissionButtons = [...demo.querySelectorAll("[data-permission]")];
  const setPermission = (button, allowed) => {
    const permission = button.dataset.permission;
    if (allowed) granted.add(permission);
    else granted.delete(permission);
    button.classList.toggle("granted", allowed);
    button.querySelector("b").textContent = allowed ? "✓" : "✕";
  };
  const runPlugin = () => {
    const requests = ["filesystem", "environment", "network"];
    const denied = requests.filter((permission) => !granted.has(permission));
    log.className = denied.length ? "denied" : "allowed";
    log.textContent = denied.length
      ? `DENIED ${denied[0]}: permission not granted`
      : "ALLOWED plugin completed inside isolated worker";
  };
  for (const button of demo.querySelectorAll("[data-permission]")) {
    button.addEventListener("click", () => {
      const permission = button.dataset.permission;
      setPermission(button, !granted.has(permission));
    });
  }
  demo.querySelector("[data-plugin-run]").addEventListener("click", runPlugin);
  let allowDemo = false;
  loopInView(demo, async (instant) => {
    for (const button of permissionButtons) setPermission(button, false);
    runPlugin();
    if (!instant) await wait(1200);
    if (allowDemo) {
      for (const button of permissionButtons.slice(0, 3)) {
        setPermission(button, true);
        await wait(320);
      }
      runPlugin();
    }
    allowDemo = !allowDemo;
  }, 3200);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderTau(template) {
  const context = {
    title: "Hello from Tau",
    content: "A compiled template with contextual escaping.",
    tags: ["fast", "safe", "small"],
  };
  let output = template.replace(
    /{#if title}([\s\S]*?){\/if}/g,
    context.title ? "$1" : "",
  );
  output = output.replace(
    /{#each tags as tag}([\s\S]*?){\/each}/g,
    (_match, block) =>
      context.tags.map((tag) =>
        block
          .replaceAll(/{tag\s*\|\s*upper}/g, escapeHtml(tag.toUpperCase()))
          .replaceAll(/{tag}/g, escapeHtml(tag))
      ).join(""),
  );
  output = output
    .replaceAll(/{title}/g, escapeHtml(context.title))
    .replaceAll(/{@html content}/g, context.content);
  return output;
}

for (const playground of document.querySelectorAll("[data-tau-playground]")) {
  const input = playground.querySelector("[data-tau-input]");
  const output = playground.querySelector("[data-tau-output]");
  const status = playground.querySelector("[data-tau-status]");
  const update = () => {
    try {
      output.innerHTML = renderTau(input.value);
      status.textContent = "Live";
      status.classList.remove("error");
    } catch {
      status.textContent = "Invalid";
      status.classList.add("error");
    }
  };
  input.addEventListener("input", update);
  update();
  loopInView(playground, async (instant) => {
    output.classList.remove("replaying");
    void output.offsetWidth;
    output.classList.add("replaying");
    update();
    if (!instant) await wait(1400);
  }, 3400);
}

const themeDocuments = {
  minimal:
    `<!doctype html><style>*{box-sizing:border-box}body{margin:0;padding:9%;font:16px Georgia,serif;color:#29252a;background:#f8f6f1}nav{display:flex;justify-content:space-between;border-bottom:1px solid #d8d2ca;padding-bottom:18px;font:12px Arial}main{max-width:620px;margin:12% auto}small{font:10px Arial;color:#7760a9;letter-spacing:.12em}h1{font-size:48px;line-height:1.05;margin:18px 0}p{font-size:18px;line-height:1.7;color:#625b63}</style><nav><b>STENO JOURNAL</b><span>Writing &nbsp; About</span></nav><main><small>APRIL 18, 2026</small><h1>A quiet place for words.</h1><p>A clean, focused starting point for personal sites, journals, portfolios, and blogs.</p></main>`,
  docs:
    `<!doctype html><style>*{box-sizing:border-box}body{margin:0;font:14px Arial;color:#20232a;background:#fff;display:grid;grid-template-columns:190px 1fr;min-height:100vh}aside{padding:32px 24px;background:#f3f4f6;border-right:1px solid #dfe1e5}aside b{display:block;margin-bottom:30px}aside span{display:block;margin:14px 0;color:#69707d}main{padding:9%}small{color:#6551e8;font-weight:bold}h1{font-size:42px;letter-spacing:-.04em}p{max-width:600px;color:#606775;line-height:1.7}pre{margin-top:30px;padding:18px;background:#19171f;color:#ddd;border-radius:6px}</style><aside><b>STENO DOCS</b><span>Introduction</span><span>Configuration</span><span>Themes</span><span>Plugins</span></aside><main><small>GETTING STARTED</small><h1>Build your first Steno site</h1><p>Everything you need to go from Markdown to a production-ready static website.</p><pre>deno task dev</pre></main>`,
  marketing:
    `<!doctype html><style>*{box-sizing:border-box}body{margin:0;font:15px Arial;color:#f4f2f7;background:#17151d}header{padding:24px 8%;display:flex;justify-content:space-between;border-bottom:1px solid #34303c}main{padding:10% 8%;background:radial-gradient(circle at 70% 20%,#4932a3 0,transparent 35%)}small{color:#b6a5ff;font-weight:bold}h1{max-width:620px;font-size:58px;letter-spacing:-.05em;line-height:1;margin:20px 0}p{max-width:540px;color:#aaa4b3;line-height:1.7}button{margin-top:22px;padding:12px 18px;border:0;background:#8b70ef;color:white}</style><header><b>STENO</b><span>Docs &nbsp; GitHub</span></header><main><small>POWERED BY DENO</small><h1>Build fast. Ship safely.</h1><p>Fast, configurable static site generation with transactional output.</p><button>Get started</button></main>`,
};

const themeMetadata = {
  minimal: { label: "Minimal", package: "@steno/theme-minimal" },
  docs: { label: "Docs Minimal", package: "@steno/theme-docs-minimal" },
  marketing: {
    label: "Marketing Minimal",
    package: "@steno/theme-marketing-minimal",
  },
};

for (const lab of document.querySelectorAll("[data-theme-lab]")) {
  const frame = lab.querySelector("[data-theme-frame]");
  const label = lab.querySelector("[data-theme-label]");
  const packageName = lab.querySelector("[data-theme-package]");
  const render = (name) => {
    frame.srcdoc = themeDocuments[name];
    label.textContent = themeMetadata[name].label;
    packageName.textContent = themeMetadata[name].package;
    for (const button of lab.querySelectorAll("[data-theme-name]")) {
      button.classList.toggle("active", button.dataset.themeName === name);
    }
  };
  for (const button of lab.querySelectorAll("[data-theme-name]")) {
    button.addEventListener("click", () => render(button.dataset.themeName));
  }
  for (const button of lab.querySelectorAll("[data-theme-size]")) {
    button.addEventListener("click", () => {
      lab.classList.toggle(
        "mobile-preview",
        button.dataset.themeSize === "mobile",
      );
      for (const peer of lab.querySelectorAll("[data-theme-size]")) {
        peer.classList.toggle("active", peer === button);
      }
    });
  }
  render("minimal");
  const themeNames = ["minimal", "docs", "marketing"];
  let themeIndex = 0;
  loopInView(lab, async (instant) => {
    render(themeNames[themeIndex]);
    themeIndex = (themeIndex + 1) % themeNames.length;
    if (!instant) await wait(1500);
  }, 3400);
}

let searchIndex;
async function getSearchIndex() {
  searchIndex ??= fetch("/assets/docs-search.json").then((response) =>
    response.json()
  );
  return await searchIndex;
}

const searchDialog = document.querySelector("[data-search-dialog]");
if (searchDialog) {
  const input = searchDialog.querySelector("[data-search-input]");
  const results = searchDialog.querySelector("[data-search-results]");
  const openSearch = async () => {
    searchDialog.showModal();
    input.focus();
    await getSearchIndex();
  };
  for (const button of document.querySelectorAll("[data-search-open]")) {
    button.addEventListener("click", openSearch);
  }
  searchDialog.querySelector("[data-search-close]").addEventListener(
    "click",
    () => searchDialog.close(),
  );
  input.addEventListener("input", async () => {
    const query = input.value.trim().toLowerCase();
    if (!query) {
      results.innerHTML =
        "<p>Type to search guides, configuration, Tau, plugins, and API references.</p>";
      return;
    }
    const matches = (await getSearchIndex()).filter((entry) =>
      `${entry.title} ${entry.excerpt} ${entry.headings.join(" ")}`
        .toLowerCase()
        .includes(query)
    ).slice(0, 8);
    results.replaceChildren(...matches.map((entry) => {
      const link = document.createElement("a");
      link.href = entry.route;
      const title = document.createElement("strong");
      title.textContent = entry.title;
      const excerpt = document.createElement("span");
      excerpt.textContent = entry.excerpt;
      link.append(title, excerpt);
      return link;
    }));
    if (!matches.length) {
      results.innerHTML = "<p>No documentation matched that search.</p>";
    }
  });
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openSearch();
    }
    if (event.key === "Escape" && searchDialog.open) searchDialog.close();
  });
}

const currentPath = globalThis.location.pathname;
for (const link of document.querySelectorAll(".docs-sidebar a")) {
  if (link.getAttribute("href") === currentPath) {
    link.setAttribute("aria-current", "page");
  }
}

const pageToc = document.querySelector("[data-page-toc]");
if (pageToc) {
  const headings = [
    ...document.querySelectorAll(".docs-content h2, .docs-content h3"),
  ];
  for (const heading of headings) {
    if (!heading.id) {
      heading.id = heading.textContent.toLowerCase().replaceAll(
        /[^a-z0-9]+/g,
        "-",
      ).replaceAll(/(^-|-$)/g, "");
    }
    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    if (heading.tagName === "H3") link.classList.add("nested");
    pageToc.append(link);
  }
}
