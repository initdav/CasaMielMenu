# Two-Page Print Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an explicit two-page US Letter print menu with a repeated normal-flow olive footer, no white page-edge strips, and no footer/content overlap in Firefox/Zen.

**Architecture:** Keep the current interactive menu as the screen representation. During the existing data render, generate a separate print-only DOM tree containing two fixed-size pages, two category columns per page, and one footer row per page; print CSS hides the interactive tree and prints only these pages.

**Tech Stack:** Static HTML, CSS paged media, browser JavaScript, Node.js built-in test runner, headless Chrome for DOM/PDF regression checks.

## Global Constraints

- Target exactly two US Letter pages measuring 8.5 × 11 inches.
- Repeat the olive “Qué bueno tenerte en casa” footer on both pages.
- Use `window.menuData.categories` as the only menu content source.
- Keep the interactive screen menu and search behavior unchanged.
- Use zero `@page` margin; place all spacing inside the cream page surface.
- Preserve Casa Miel colors: paper `#F7F1E5`, olive `#7B8149`, brown `#392010`, and cream `#E1D5BF`.
- Do not overwrite unrelated existing changes in `.gitignore`, `index.html`, or `styles.css`.

---

### Task 1: Generate Explicit Print Pages From Menu Data

**Files:**
- Create: `tests/print-layout.test.mjs`
- Modify: `index.html:32-35,100-106`
- Modify: `script.js:24-88,242-246`

**Interfaces:**
- Consumes: `window.menuData.categories`, where each category has `id`, `name`, and `items`.
- Produces: `createMenuSection(category, { print }) -> HTMLElement` and `renderPrintMenu(categories) -> void`.
- Produces DOM: `.print-menu` containing two `.print-page[data-print-page]` elements, each with two `.print-column` elements and one `.print-page-footer`.
- Produces category markers: `.print-menu-section[data-print-category="<category-id>"]` without duplicate HTML IDs.

- [ ] **Step 1: Create the dependency-free browser regression test**

Create `tests/print-layout.test.mjs`:

```js
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import test, { after, before } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const chrome = process.env.CHROME_BIN ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
};

let server;
let pageHtml;

before(async () => {
  server = createServer(async (request, response) => {
    const requestPath = new URL(request.url, 'http://127.0.0.1').pathname;
    const relativePath = requestPath === '/' ? 'index.html' : requestPath.slice(1);
    const filePath = normalize(join(root, relativePath));

    if (!filePath.startsWith(root)) {
      response.writeHead(403).end();
      return;
    }

    try {
      const body = await readFile(filePath);
      response.writeHead(200, { 'content-type': mimeTypes[extname(filePath)] || 'application/octet-stream' });
      response.end(body);
    } catch {
      response.writeHead(404).end();
    }
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const result = spawnSync(chrome, [
    '--headless',
    '--disable-gpu',
    '--dump-dom',
    '--virtual-time-budget=3000',
    `http://127.0.0.1:${port}/index.html`,
  ], { encoding: 'utf8' });

  assert.equal(result.status, 0, result.stderr);
  pageHtml = result.stdout;
});

after(() => server?.close());

test('renders exactly two print pages with a footer on each page', () => {
  assert.equal((pageHtml.match(/class="print-page"/g) || []).length, 2);
  assert.equal((pageHtml.match(/class="print-page-footer"/g) || []).length, 2);
});

test('places every category in the intended print page and column', () => {
  const expectedPages = [
    [
      ['desayunos', 'dulces'],
      ['calientes-cafe', 'frias-cafe'],
    ],
    [
      ['filtrados', 'calientes-sin-cafe'],
      ['frias-sin-cafe', 'sodas'],
    ],
  ];

  expectedPages.forEach((columns, pageIndex) => {
    const pageStart = pageHtml.indexOf(
      `<section class="print-page" data-print-page="${pageIndex + 1}">`
    );
    const nextPageStart = pageHtml.indexOf(
      `<section class="print-page" data-print-page="${pageIndex + 2}">`,
      pageStart + 1
    );
    const printMenuEnd = pageHtml.indexOf('<a class="back-to-top"', pageStart);
    const pageEnd = nextPageStart === -1 ? printMenuEnd : nextPageStart;
    const pageMarkup = pageHtml.slice(pageStart, pageEnd);
    const renderedIds = [...pageMarkup.matchAll(/data-print-category="([^"]+)"/g)]
      .map((match) => match[1]);

    assert.deepEqual(renderedIds, columns.flat());
    assert.equal((pageMarkup.match(/class="print-column"/g) || []).length, 2);
  });
});

test('keeps unique IDs on the interactive menu sections', () => {
  const categoryIds = [
    'desayunos',
    'dulces',
    'calientes-cafe',
    'frias-cafe',
    'filtrados',
    'calientes-sin-cafe',
    'frias-sin-cafe',
    'sodas',
  ];

  categoryIds.forEach((id) => {
    assert.equal((pageHtml.match(new RegExp(`id="${id}"`, 'g')) || []).length, 1);
  });
});
```

- [ ] **Step 2: Run the test and verify the missing print compositor fails**

Run:

```bash
node --test tests/print-layout.test.mjs
```

Expected: FAIL because the rendered DOM contains zero `.print-page` and `.print-page-footer` elements.

- [ ] **Step 3: Add the print mount to the document**

In `index.html`, add the print mount immediately after the existing screen footer and bump the script cache key:

```html
    <footer>
      <img src="assets/house-mark.svg" alt="" />
      <p>Qué bueno tenerte en casa</p>
    </footer>

    <div class="print-menu" aria-hidden="true"></div>

    <a class="back-to-top" href="#top" aria-label="Volver arriba" hidden>↑</a>
```

```html
    <script src="script.js?v=20260721-5" defer></script>
```

- [ ] **Step 4: Extract reusable section rendering and generate the print pages**

In `script.js`, add the print mount query near the existing element queries:

```js
const printMenu = document.querySelector('.print-menu');
```

Add the page map near `titleConnectors`:

```js
const printPageCategoryIds = [
  [
    ['desayunos', 'dulces'],
    ['calientes-cafe', 'frias-cafe'],
  ],
  [
    ['filtrados', 'calientes-sin-cafe'],
    ['frias-sin-cafe', 'sodas'],
  ],
];
```

Add reusable section and footer builders after `createMenuItem`:

```js
function createMenuSection(category, { print = false } = {}) {
  const section = document.createElement('section');
  section.className = print ? 'print-menu-section' : 'menu-section';

  if (print) section.dataset.printCategory = category.id;
  else section.id = category.id;

  const heading = document.createElement('header');
  heading.className = 'section-heading';
  const title = document.createElement('h3');
  title.textContent = keepConnectorsTogether(category.name);
  heading.append(title);

  const items = document.createElement('div');
  items.className = 'items-grid';
  category.items.forEach((item) => items.append(createMenuItem(item)));

  section.append(heading, items);
  return section;
}

function createPrintFooter() {
  const footer = document.createElement('footer');
  footer.className = 'print-page-footer';
  const mark = document.createElement('img');
  mark.src = 'assets/house-mark.svg';
  mark.alt = '';
  const message = document.createElement('p');
  message.textContent = 'Qué bueno tenerte en casa';
  footer.append(mark, message);
  return footer;
}

function renderPrintMenu(categories) {
  const categoriesById = new Map(categories.map((category) => [category.id, category]));
  const fragment = document.createDocumentFragment();

  printPageCategoryIds.forEach((columnIds, pageIndex) => {
    const page = document.createElement('section');
    page.className = 'print-page';
    page.dataset.printPage = pageIndex + 1;

    const content = document.createElement('div');
    content.className = 'print-page-content';

    columnIds.forEach((categoryIds) => {
      const column = document.createElement('div');
      column.className = 'print-column';
      categoryIds.forEach((categoryId) => {
        const category = categoriesById.get(categoryId);
        if (category) column.append(createMenuSection(category, { print: true }));
      });
      content.append(column);
    });

    page.append(content, createPrintFooter());
    fragment.append(page);
  });

  printMenu.replaceChildren(fragment);
}
```

Replace the duplicated section construction inside `renderMenu` with:

```js
    sectionsFragment.append(createMenuSection(category));
```

After replacing the category nav and screen sections, render the print tree:

```js
  categoryNav.replaceChildren(navFragment);
  menuSections.replaceChildren(sectionsFragment);
  renderPrintMenu(categories);
```

- [ ] **Step 5: Run the browser regression tests**

Run:

```bash
node --test tests/print-layout.test.mjs
```

Expected: 3 tests pass, 0 fail.

- [ ] **Step 6: Commit the print compositor**

```bash
git add index.html script.js tests/print-layout.test.mjs
git commit -m "Add explicit print page compositor"
```

---

### Task 2: Replace Fragmented Print CSS With Page-Sized Layout

**Files:**
- Modify: `styles.css:22-26,115-266`
- Modify: `index.html:32`
- Modify: `tests/print-layout.test.mjs`

**Interfaces:**
- Consumes DOM from Task 1: `.print-menu`, `.print-page`, `.print-page-content`, `.print-column`, `.print-menu-section`, and `.print-page-footer`.
- Produces paged media: two zero-margin US Letter pages with a `14mm` in-flow footer row.
- Produces screen behavior: `.print-menu` remains `display: none` outside print media.

- [ ] **Step 1: Add failing print CSS assertions**

Append to `tests/print-layout.test.mjs`:

```js
test('defines zero-margin Letter pages with in-flow footers', async () => {
  const css = await readFile(join(root, 'styles.css'), 'utf8');

  assert.match(css, /\.print-menu\s*\{\s*display:\s*none;\s*\}/);
  assert.match(css, /@page\s*\{[^}]*size:\s*Letter;[^}]*margin:\s*0;/s);
  assert.match(css, /\.print-page\s*\{[^}]*width:\s*8\.5in;[^}]*height:\s*11in;[^}]*grid-template-rows:\s*1fr 14mm;/s);
  assert.match(css, /\.print-page-footer\s*\{[^}]*position:\s*static;/s);
  assert.doesNotMatch(css, /@media print[\s\S]*?footer\s*\{[^}]*position:\s*fixed;/);
});
```

- [ ] **Step 2: Run the CSS test and verify it fails against the fixed-footer layout**

Run:

```bash
node --test tests/print-layout.test.mjs
```

Expected: 1 failure because `@page` still has a `15mm` top margin and the print footer is fixed.

- [ ] **Step 3: Hide the print representation on screen**

Add near the base `main` and footer rules in `styles.css`:

```css
.print-menu { display: none; }
```

- [ ] **Step 4: Replace the existing `@media print` block with explicit page styles**

Replace the current print block with:

```css
@media print {
  @page { size: Letter; margin: 0; }

  html, body {
    width: 8.5in;
    margin: 0;
    background: var(--paper) !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  body > :not(.print-menu) {
    display: none !important;
  }

  .print-menu {
    display: block;
    width: 8.5in;
    background: var(--paper);
  }

  .print-page {
    width: 8.5in;
    height: 11in;
    display: grid;
    grid-template-rows: 1fr 14mm;
    overflow: hidden;
    break-after: page;
    background: var(--paper);
    color: var(--brown);
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .print-page:last-child {
    break-after: auto;
  }

  .print-page-content {
    min-height: 0;
    padding: 15mm 15mm 8mm;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15mm;
  }

  .print-column {
    min-width: 0;
  }

  .print-menu-section {
    padding: 0 0 7mm;
    break-inside: avoid;
  }

  .print-menu-section + .print-menu-section {
    padding-top: 3mm;
    border-top: 1px solid rgba(57,32,16,.2);
  }

  .print-menu-section .section-heading h3 {
    margin: 0 0 2mm;
    font-size: 1.8rem;
    line-height: .98;
    letter-spacing: -.02em;
  }

  .print-menu-section .items-grid {
    display: block;
  }

  .print-menu-section .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    padding: .5rem 0;
    border-bottom: 1px dashed var(--cream);
    break-inside: avoid;
  }

  .print-menu-section .menu-item:first-child {
    padding-top: 0;
  }

  .print-menu-section .menu-item:last-child {
    border-bottom: 0;
  }

  .print-menu-section .menu-item h4 {
    margin: 0 0 .1rem;
    font-size: 1rem;
  }

  .print-menu-section .menu-item p {
    margin: 0;
    font-size: .85rem;
  }

  .print-menu-section .price {
    flex: 0 0 auto;
    padding-top: 0;
    font-size: .95rem;
    white-space: nowrap;
  }

  .print-page-footer {
    position: static;
    min-height: 0;
    padding: 0 15mm;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .6rem;
    border-top: 2px solid var(--olive);
    background: var(--olive);
    color: var(--paper);
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .print-page-footer img {
    width: 1.1rem;
    filter: invert(92%) sepia(23%) saturate(592%) hue-rotate(353deg) brightness(103%);
  }

  .print-page-footer p {
    margin: 0;
    font: 600 1.2rem var(--display);
    letter-spacing: -.02em;
  }

  *, *::before, *::after {
    box-shadow: none !important;
    text-shadow: none !important;
  }
}
```

- [ ] **Step 5: Bump the stylesheet cache key**

In `index.html`, update the stylesheet URL without changing the existing path:

```html
    <link rel="stylesheet" href="styles.css?v=20260721-13" />
```

- [ ] **Step 6: Run all automated checks**

Run:

```bash
node --test tests/print-layout.test.mjs
git diff --check
```

Expected: 4 tests pass, 0 fail; `git diff --check` prints no output.

- [ ] **Step 7: Generate a fresh PDF for physical-page verification**

Ensure the temporary output parent exists:

```bash
ls "/var/folders/qr/p77xn5ps4630r2f0jsfsk5940000gn/T/opencode"
```

Start the local server if it is not already running:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

In another shell, generate the PDF:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="/var/folders/qr/p77xn5ps4630r2f0jsfsk5940000gn/T/opencode/casamiel-two-page-print.pdf" \
  "http://127.0.0.1:8765/index.html?print-test=final"
```

Expected: Chrome reports that it wrote `casamiel-two-page-print.pdf`.

- [ ] **Step 8: Inspect both PDF pages**

Open/read `/var/folders/qr/p77xn5ps4630r2f0jsfsk5940000gn/T/opencode/casamiel-two-page-print.pdf` and confirm:

- Exactly two pages are present.
- Both pages begin with cream, not white.
- Both pages end with the olive footer at the physical bottom edge.
- No item name, description, or price intersects a footer.
- Page 1 and page 2 category groupings match the design spec.

Then open Zen print preview and confirm the same output with margins set to the browser default; the CSS `@page` rule must still produce edge-to-edge preview pages.

- [ ] **Step 9: Commit the page-sized print layout**

```bash
git add styles.css index.html tests/print-layout.test.mjs
git commit -m "Fix two-page printed menu layout"
```
