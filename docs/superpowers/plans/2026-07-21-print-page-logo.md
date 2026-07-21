# Print Page Logo Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a centered house mark logo header to the top of every print page.

**Architecture:** A new `createPrintHeader()` function in `script.js` generates a `<header>` element containing the house mark SVG. It is prepended to each `.print-page` alongside existing content and footer. CSS updates the print page grid to accommodate the new header row.

**Tech Stack:** Vanilla JavaScript, CSS, Node.js test runner with Chrome headless

## Global Constraints

- House mark icon only (`assets/house-mark.svg`), no wordmark
- Logo appears on every print page
- Centered alignment, no divider line
- Header padding: `15mm 15mm 4mm` (top/sides match content, bottom for breathing room)
- House mark width: `28px`
- Print page grid changes from `1fr 14mm` to `auto 1fr 14mm`

---

### Task 1: Add test for print page header

**Files:**
- Modify: `tests/print-layout.test.mjs`

**Interfaces:**
- Consumes: `pageHtml` (rendered DOM string from Chrome headless)
- Produces: Test assertions that verify header presence and structure

- [ ] **Step 1: Write the failing test**

Add a new test to `tests/print-layout.test.mjs`:

```javascript
test('renders a centered header with house mark on each print page', () => {
  assert.equal((pageHtml.match(/class="print-page-header"/g) || []).length, 2);
  assert.equal((pageHtml.match(/class="print-page-header">\s*<img src="assets\/house-mark.svg"/g) || []).length, 2);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/print-layout.test.mjs`
Expected: FAIL — `print-page-header` not found in DOM

- [ ] **Step 3: Commit the failing test**

```bash
git add tests/print-layout.test.mjs
git commit -m "test: add print page header test"
```

---

### Task 2: Implement createPrintHeader function

**Files:**
- Modify: `script.js:84-94` (near `createPrintFooter`)
- Modify: `script.js:118` (in `renderPrintMenu`)

**Interfaces:**
- Consumes: `assets/house-mark.svg`
- Produces: `createPrintHeader()` returns a `<header>` element with class `print-page-header` containing an `<img>` of the house mark

- [ ] **Step 1: Add createPrintHeader function**

Add this function in `script.js` right before `createPrintFooter()`:

```javascript
function createPrintHeader() {
  const header = document.createElement('header');
  header.className = 'print-page-header';
  const mark = document.createElement('img');
  mark.src = 'assets/house-mark.svg';
  mark.alt = '';
  header.append(mark);
  return header;
}
```

- [ ] **Step 2: Update renderPrintMenu to prepend header**

Change line 118 in `script.js` from:

```javascript
page.append(content, createPrintFooter());
```

to:

```javascript
page.append(createPrintHeader(), content, createPrintFooter());
```

- [ ] **Step 3: Run test to verify it passes**

Run: `node --test tests/print-layout.test.mjs`
Expected: PASS — header test passes, all existing tests still pass

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "feat: add print page header with house mark"
```

---

### Task 3: Add print page header CSS

**Files:**
- Modify: `styles.css:137-148` (`.print-page` grid)
- Modify: `styles.css` (add `.print-page-header` styles after `.print-page-content`)

**Interfaces:**
- Consumes: `.print-page-header` class from Task 2
- Produces: Centered header with correct padding and image sizing

- [ ] **Step 1: Add test for header CSS**

Add a new test to `tests/print-layout.test.mjs`:

```javascript
test('defines print page header with centered layout', async () => {
  const css = await readFile(join(root, 'styles.css'), 'utf8');

  assert.match(css, /\.print-page\s*\{[^}]*grid-template-rows:\s*auto 1fr 14mm;/s);
  assert.match(css, /\.print-page-header\s*\{[^}]*padding:\s*15mm 15mm 4mm;/s);
  assert.match(css, /\.print-page-header\s*\{[^}]*justify-content:\s*center;/s);
  assert.match(css, /\.print-page-header img\s*\{[^}]*width:\s*28px;/s);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/print-layout.test.mjs`
Expected: FAIL — CSS assertions fail

- [ ] **Step 3: Update print page grid**

Change `.print-page` in `styles.css` from:

```css
grid-template-rows: 1fr 14mm;
```

to:

```css
grid-template-rows: auto 1fr 14mm;
```

- [ ] **Step 4: Add print page header styles**

Add these rules in `styles.css` after `.print-page-content` block (around line 160):

```css
.print-page-header {
  padding: 15mm 15mm 4mm;
  display: flex;
  justify-content: center;
  align-items: center;
}

.print-page-header img {
  width: 28px;
  height: auto;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test tests/print-layout.test.mjs`
Expected: PASS — all tests pass including new CSS test

- [ ] **Step 6: Commit**

```bash
git add styles.css tests/print-layout.test.mjs
git commit -m "feat: add print page header styles"
```

---

### Task 4: Verify print preview

**Files:**
- None (manual verification)

- [ ] **Step 1: Open print preview**

Open `index.html` in a browser and trigger print preview (Ctrl/Cmd+P). Verify:
- House mark appears centered at top of each page
- Logo does not overlap with menu content
- Footer remains aligned to bottom
- House mark renders in brown color

- [ ] **Step 2: Run all tests one final time**

Run: `node --test tests/print-layout.test.mjs`
Expected: All tests pass
