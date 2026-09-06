---
title: Home
layout: landing
---

<section class="landing-hero" id="top">
  <div class="landing-shell hero-grid">
    <div class="hero-message">
      <h1>Build fast.<br />Ship safely.</h1>
      <p class="hero-lede">Steno turns Markdown into a fast static site, and never leaves a broken build live. Start with a configured project for full control, or one file for a lightweight start.</p>
      <div class="hero-actions-row">
        <button class="copy-command command-button" type="button" aria-label="Copy initializer command">
          <code>deno create jsr:@steno/init</code>
          <span>Copy</span>
        </button>
      </div>
      <div class="trust-row" aria-label="Project highlights">
        <span>MIT licensed</span>
        <span>Powered by Deno</span>
        <span><a href="https://snugnook.org/">Snug Nook</a> Approved</span>
      </div>
    </div>
    <div class="build-demo" aria-label="A Markdown page being built into HTML">
      <div class="demo-toolbar">
        <div>
          <i></i><i></i><i></i></div>
        <span>my-steno-site</span>
        <small>ready</small>
      </div>
      <div class="demo-files">
        <span class="active">content/index.md</span>
        <span>content/.steno/config.yml</span>
      </div>
      <div class="build-pipeline" aria-label="Build pipeline">
        <span data-build-stage="scan">Scan</span>
        <i></i><span data-build-stage="parse">Parse</span>
        <i></i><span data-build-stage="tau">Tau</span>
        <i></i><span data-build-stage="stage">Stage</span>
        <i></i><span data-build-stage="publish">Publish</span>
      </div>
      <div class="demo-code">
        <pre><code><b>---</b>
<em>title:</em> Hello, Steno
<em>layout:</em> layout
<b>---</b>
<strong># A faster way to publish</strong>
Write Markdown. Ship a website.</code></pre>
      </div>
      <div class="demo-terminal">
        <code><span>$</span> deno task build</code>
        <button type="button" data-run-build>Run build</button>
        <p data-build-result><b>✓</b> Ready to build <span>1 page</span>
        </p>
      </div>
      <div class="demo-output">
        <span>dist/</span>
        <strong>index.html</strong>
        <i>atomic output</i>
      </div>
    </div>
  </div>
</section>

<section class="choice-section" id="start">
  <div class="landing-shell">
    <div class="section-intro choice-intro">
      <h2>As you wish.</h2>
    </div>
    <div class="choice-grid">
      <article class="choice-card choice-primary">
        <div class="choice-label">
          <span>Recommended</span>
          <small>Configured project</small>
        </div>
        <h3>Start with a complete foundation.</h3>
        <p>Use themes, plugins, collections, redirects, data files, and project-wide settings from day one.</p>
      </article>
      <article class="choice-card">
        <div class="choice-label">
          <span>Optional</span>
          <small>Zero-config mode</small>
        </div>
        <h3>Turn one Markdown file into a site.</h3>
        <p>Perfect for a single page, a small experiment, or any project that does not need explicit settings yet.</p>
      </article>
    </div>
  </div>
</section>

<section class="proof-section" id="proof">
  <div class="landing-shell proof-grid">
    <div class="proof-message">
      <h2>Fast?</h2>
    </div>
    <div class="metric-panel">
      <div class="primary-metric">
        <span>Cold build</span>
        <strong>405<small>ms</small>
        </strong>
        <p>4,000 Markdown pages</p>
      </div>
      <div class="metric-row">
        <article>
          <span>Cold build</span>
          <strong>102ms</strong><small>1,000 pages</small>
        </article>
        <article>
          <span>Warm build</span>
          <strong>32ms</strong><small>1,000 unchanged</small>
        </article>
        <article>
          <span>Tau render</span>
          <strong>902ns</strong><small>simple template</small>
        </article>
      </div>
      <p class="metric-note">Apple M5, Deno 2.9.4. Results vary by machine.</p>
    </div>
    <a class="benchmark-link" href="/docs/benchmarks/">Read the benchmark methodology <span>→</span>
    </a>
  </div>
</section>

<section class="assurance-section" id="features">
  <div class="landing-shell">
    <div class="section-intro centered-intro">
      <h2>Predictable.</h2>
      <p>Steno protects the site you already shipped while containing extension failures during the next build.</p>
    </div>
    <div class="assurance-grid">
      <article class="assurance-card transaction-card">
        <div class="card-icon">01</div>
        <h3>Transactional output</h3>
        <p>Pages, assets, redirects, and plugin output are completed in staging before the final site is replaced.</p>
        <div class="atomic-visual" data-atomic-demo>
          <div class="atomic-tree">
            <small>dist/</small>
            <span>index.html</span>
            <span>assets/site.css</span>
            <b>Current site</b></div>
          <div class="atomic-transfer">
            <i>→</i><strong data-atomic-status>Ready</strong></div>
          <div class="atomic-tree staging">
            <small>.dist.staging/</small>
            <span>index.html</span>
            <span>assets/site.css</span>
            <b>New build</b></div>
        </div>
        <div class="demo-controls">
          <button type="button" data-atomic-action="success">Successful build</button>
          <button type="button" data-atomic-action="failure">Failed build</button>
        </div>
        <p class="demo-live-status" data-atomic-message>Choose an outcome to inspect the transaction.</p>
      </article>
      <article class="assurance-card sandbox-card" id="security">
        <div class="card-icon">02</div>
        <h3>Isolated plugins</h3>
        <p>Run selected plugins in separate Deno processes with every runtime capability denied until explicitly granted.</p>
        <div class="permission-console" data-plugin-demo>
          <div class="permission-list">
            <button type="button" data-permission="filesystem">
              <b>✕</b> filesystem</button>
            <button type="button" data-permission="environment">
              <b>✕</b> environment</button>
            <button type="button" data-permission="network">
              <b>✕</b> network</button>
            <button type="button" data-permission="subprocess">
              <b>✕</b> subprocess</button>
            <button type="button" data-permission="ffi">
              <b>✕</b> FFI</button>
          </div>
          <div class="sandbox-terminal">
            <code data-plugin-log>DENIED network: permission not granted</code>
            <button type="button" data-plugin-run>Run plugin</button>
          </div>
        </div>
        <small>Select permissions, then run the simulated plugin request.</small>
      </article>
    </div>
  </div>
</section>

<section class="craft-section">
  <div class="landing-shell">
    <div class="tau-showcase">
      <div class="tau-copy">
        <span>Meet...</span>
        <img src="/assets/tau.svg" alt="Tau" width="114" height="42" />
        <h2>Markup that looks like the page it creates.</h2>
      </div>
      <article class="tau-island tau-layouts">
        <h3>Layouts &amp; components</h3>
        <p>Give every page a home. Reuse the parts that belong together.</p>
        <code>&lt;Header /&gt; · &lt;Footer /&gt;</code>
      </article>
      <article class="tau-island tau-collections">
        <h3>Content, connected.</h3>
        <p>Bring collections, conditions, and data into your templates.</p>
        <code>{#each posts as post}</code>
      </article>
      <article class="tau-island tau-escaping">
        <h3>Small syntax. Thoughtful defaults.</h3>
        <p>Compiled templates with filters and contextual escaping built in.</p>
        <code>{title | upper}</code>
      </article>
      <div class="tau-playground" data-tau-playground>
        <div class="playground-pane">
          <div class="code-tabs">
            <span>layouts/article.tau</span>
            <small>Editable</small>
          </div>
          <textarea aria-label="Tau template" data-tau-input>{#if title}
&lt;h1&gt;{title}&lt;/h1&gt;
{/if}
&lt;p&gt;{@html content}&lt;/p&gt;
{#each tags as tag}
&lt;span&gt;{tag | upper}&lt;/span&gt;
{/each}</textarea>
        </div>
        <div class="playground-pane preview-pane">
          <div class="code-tabs">
            <span>Rendered output</span>
            <small data-tau-status>Live</small>
          </div>
          <div class="tau-preview" data-tau-output>
          </div>
        </div>
      </div>
    </div>
    <a class="tau-explore" href="/docs/tau_syntax/">Explore Tau syntax <span>→</span>
    </a>
    <div class="theme-lab" data-theme-lab>
      <div class="theme-lab-heading">
        <h2>Themes...</h2>
        <div class="theme-controls">
          <div>
            <button class="active" type="button" data-theme-name="minimal">Minimal</button>
            <button type="button" data-theme-name="docs">Docs</button>
            <button type="button" data-theme-name="marketing">Marketing</button>
          </div>
          <div>
            <button class="active" type="button" data-theme-size="desktop">Desktop</button>
            <button type="button" data-theme-size="mobile">Mobile</button>
          </div>
        </div>
      </div>
      <div class="real-theme-preview">
        <iframe title="Live theme preview" data-theme-frame></iframe>
      </div>
      <div class="theme-package">
        <span data-theme-label>Minimal</span>
        <code data-theme-package>@steno/theme-minimal</code>
        <a href="/docs/theme_development/">Build your own <span>→</span>
        </a>
      </div>
    </div>
    <section class="plugin-showcase" aria-labelledby="plugin-heading">
      <div class="plugin-heading">
        <h2 id="plugin-heading">...and plugins.</h2>
      </div>
      <div class="plugin-stream">
        <div class="plugin-lane">
          <div class="plugin-track">
            <div class="plugin-group">
              <a class="plugin-chip" href="https://jsr.io/@steno/plugin-shiki">
                <span class="plugin-symbol" aria-hidden="true">&lt;/&gt;</span>
                <span>
                  <strong>Shiki</strong>
                  <small>Syntax highlighting</small>
                </span>
                <span aria-hidden="true">↗</span>
              </a>
              <a class="plugin-chip" href="https://jsr.io/@steno/plugin-tailwind">
                <span class="plugin-symbol" aria-hidden="true">~</span>
                <span>
                  <strong>Tailwind CSS</strong>
                  <small>Utility-first styles</small>
                </span>
                <span aria-hidden="true">↗</span>
              </a>
              <a class="plugin-chip" href="https://jsr.io/@steno/plugin-search">
                <span class="plugin-symbol" aria-hidden="true">⌕</span>
                <span>
                  <strong>Search</strong>
                  <small>Find every page</small>
                </span>
                <span aria-hidden="true">↗</span>
              </a>
              <a class="plugin-chip" href="https://jsr.io/@steno/plugin-seo">
                <span class="plugin-symbol" aria-hidden="true">↗</span>
                <span>
                  <strong>SEO</strong>
                  <small>Sitemaps & feeds</small>
                </span>
                <span aria-hidden="true">↗</span>
              </a>
              <a class="plugin-chip" href="https://jsr.io/@steno/plugin-image">
                <span class="plugin-symbol" aria-hidden="true">▧</span>
                <span>
                  <strong>Images</strong>
                  <small>Resize & optimize</small>
                </span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
        <div class="plugin-lane">
          <div class="plugin-track">
            <div class="plugin-group">
              <a class="plugin-chip" href="https://jsr.io/@steno/plugin-i18n">
                <span class="plugin-symbol" aria-hidden="true">文</span>
                <span>
                  <strong>i18n</strong>
                  <small>Go multilingual</small>
                </span>
                <span aria-hidden="true">↗</span>
              </a>
              <a class="plugin-chip" href="https://jsr.io/@steno/plugin-scss">
                <span class="plugin-symbol" aria-hidden="true">{ }</span>
                <span>
                  <strong>SCSS</strong>
                  <small>Your styles, compiled</small>
                </span>
                <span aria-hidden="true">↗</span>
              </a>
              <a class="plugin-chip" href="https://jsr.io/@steno/plugin-og">
                <span class="plugin-symbol" aria-hidden="true">▣</span>
                <span>
                  <strong>Open Graph</strong>
                  <small>Previews for sharing</small>
                </span>
                <span aria-hidden="true">↗</span>
              </a>
              <a class="plugin-chip" href="https://jsr.io/@steno/plugin-docs">
                <span class="plugin-symbol" aria-hidden="true">↻</span>
                <span>
                  <strong>Docs sync</strong>
                  <small>Keep content in sync</small>
                </span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <a class="plugin-more" href="/plugins/">See all plugins <span>→</span>
      </a>
    </section>
  </div>
</section>
