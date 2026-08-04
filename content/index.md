---
title: Home
layout: landing
---

<section class="landing-hero" id="top">
  <div class="landing-shell hero-grid">
    <div class="hero-pixel-mark" aria-hidden="true"><span>S</span></div>
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
        <span>Snug Nook Approved</span>
      </div>
    </div>
    <div class="build-demo" aria-label="A Markdown page being built into HTML">
      <div class="demo-toolbar">
        <div><i></i><i></i><i></i></div>
        <span>my-steno-site</span>
        <small>ready</small>
      </div>
      <div class="demo-files">
        <span class="active">content/index.md</span>
        <span>content/.steno/config.yml</span>
      </div>
      <div class="build-pipeline" aria-label="Build pipeline">
        <span data-build-stage="scan">Scan</span><i></i><span data-build-stage="parse">Parse</span><i></i><span data-build-stage="tau">Tau</span><i></i><span data-build-stage="stage">Stage</span><i></i><span data-build-stage="publish">Publish</span>
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
<p data-build-result><b>✓</b> Ready to build <span>1 page</span></p>
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
    <div class="section-intro split-intro">
      <div>
        <h2>Structure when you want it. Simplicity when you do not.</h2>
      </div>
      <p>Both modes use the same build pipeline, default theme, transactional output, and production guarantees.</p>
    </div>
    <div class="choice-grid">
      <article class="choice-card choice-primary">
        <div class="choice-label"><span>Recommended</span><small>Configured project</small></div>
        <h3>Start with a complete foundation.</h3>
        <p>Use themes, plugins, collections, redirects, data files, and project-wide settings from day one.</p>
        <ul>
          <li>Interactive setup</li>
          <li>Official themes</li>
          <li>Optional Shiki and Tailwind plugins</li>
        </ul>
      </article>
      <article class="choice-card">
        <div class="choice-label"><span>Optional</span><small>Zero-config mode</small></div>
        <h3>Turn one Markdown file into a site.</h3>
        <p>Perfect for a single page, a small experiment, or any project that does not need explicit settings yet.</p>
        <div class="mini-editor"><code><b># Hello from Steno</b><br /><br />No config file required.</code></div>
        <ul>
          <li>Automatic project discovery</li>
          <li>Default theme included</li>
          <li>Add configuration whenever needed</li>
        </ul>
      </article>
    </div>
</div>
</section>

<section class="proof-section" id="proof">
  <div class="landing-shell proof-grid">
    <div class="proof-message">
      <h2>Four thousand pages. Less than half a second.</h2>
      <p>Steno tracks cold, warm, incremental, pipeline, and Tau performance in CI. Results are recorded with the test machine and Deno version, so the numbers stay honest.</p>
      <a href="/docs/benchmarks/">Read the benchmark methodology <span>→</span></a>
    </div>
    <div class="metric-panel">
      <div class="primary-metric">
        <span>Cold build</span>
        <strong>454<small>ms</small></strong>
        <p>4,000 Markdown pages</p>
      </div>
      <div class="metric-row">
        <article><span>Cold build</span><strong>124ms</strong><small>1,000 pages</small></article>
        <article><span>Warm build</span><strong>31ms</strong><small>1,000 unchanged</small></article>
        <article><span>Tau render</span><strong>927ns</strong><small>simple template</small></article>
      </div>
      <p class="metric-note">Apple M5, Deno 2.9.2. Results vary by machine.</p>
    </div>
  </div>
</section>

<section class="assurance-section" id="features">
  <div class="landing-shell">
    <div class="section-intro centered-intro">
      <h2>Fast is useful. Predictable is essential.</h2>
      <p>Steno protects the site you already shipped while containing extension failures during the next build.</p>
    </div>
    <div class="assurance-grid">
      <article class="assurance-card transaction-card">
        <div class="card-icon">01</div>
        <h3>Transactional output</h3>
        <p>Pages, assets, redirects, and plugin output are completed in staging before the final site is replaced.</p>
        <div class="atomic-visual" data-atomic-demo>
          <div class="atomic-tree"><small>dist/</small><span>index.html</span><span>assets/site.css</span><b>Current site</b></div>
          <div class="atomic-transfer"><i>→</i><strong data-atomic-status>Ready</strong></div>
          <div class="atomic-tree staging"><small>.dist.staging/</small><span>index.html</span><span>assets/site.css</span><b>New build</b></div>
        </div>
        <div class="demo-controls"><button type="button" data-atomic-action="success">Successful build</button><button type="button" data-atomic-action="failure">Failed build</button></div>
        <p class="demo-live-status" data-atomic-message>Choose an outcome to inspect the transaction.</p>
      </article>
      <article class="assurance-card sandbox-card" id="security">
        <div class="card-icon">02</div>
        <h3>Isolated plugins</h3>
        <p>Run selected plugins in separate Deno processes with every runtime capability denied until explicitly granted.</p>
        <div class="permission-console" data-plugin-demo>
          <div class="permission-list">
            <button type="button" data-permission="filesystem"><b>✕</b> filesystem</button>
            <button type="button" data-permission="environment"><b>✕</b> environment</button>
            <button type="button" data-permission="network"><b>✕</b> network</button>
            <button type="button" data-permission="subprocess"><b>✕</b> subprocess</button>
            <button type="button" data-permission="ffi"><b>✕</b> FFI</button>
          </div>
          <div class="sandbox-terminal"><code data-plugin-log>DENIED network: permission not granted</code><button type="button" data-plugin-run>Run plugin</button></div>
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
        <img src="/assets/tau.svg" alt="Tau" />
        <h2>Markup that looks like the page it creates.</h2>
        <p>Tau combines layouts, components, conditions, collections, includes, filters, and contextual escaping in a compact compiled template language.</p>
        <a href="/docs/tau_syntax/">Explore Tau syntax <span>→</span></a>
      </div>
      <div class="tau-playground" data-tau-playground>
        <div class="playground-pane"><div class="code-tabs"><span>layouts/article.tau</span><small>Editable</small></div><textarea aria-label="Tau template" data-tau-input>{#if title}
&lt;h1&gt;{title}&lt;/h1&gt;
{/if}
&lt;p&gt;{@html content}&lt;/p&gt;
{#each tags as tag}
&lt;span&gt;{tag | upper}&lt;/span&gt;
{/each}</textarea></div>
        <div class="playground-pane preview-pane"><div class="code-tabs"><span>Rendered output</span><small data-tau-status>Live</small></div><div class="tau-preview" data-tau-output></div></div>
</div>
</div>
    <div class="theme-lab" data-theme-lab>
      <div class="theme-lab-heading"><h2>Begin with a theme. Make it yours.</h2><div class="theme-controls"><div><button class="active" type="button" data-theme-name="minimal">Minimal</button><button type="button" data-theme-name="docs">Docs</button><button type="button" data-theme-name="marketing">Marketing</button></div><div><button class="active" type="button" data-theme-size="desktop">Desktop</button><button type="button" data-theme-size="mobile">Mobile</button></div></div></div>
      <div class="real-theme-preview"><iframe title="Live theme preview" data-theme-frame></iframe></div>
      <div class="theme-package"><span data-theme-label>Minimal</span><code data-theme-package>@steno/theme-minimal</code><a href="/docs/theme_development/">Build your own <span>→</span></a></div>
    </div>
</div>
</section>
