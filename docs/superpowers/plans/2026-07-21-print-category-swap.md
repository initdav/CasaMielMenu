# Print Category Swap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Swap `Bebidas frías sin café` and `Antojos dulces` positions in the two-page print layout.

**Architecture:** Update the `printPageCategoryIds` mapping in `script.js` to exchange `dulces` and `frias-sin-cafe`. Update the corresponding expected mapping in the print-layout test. No changes to `menu-data.js` or on-screen rendering.

**Tech Stack:** JavaScript, Node.js built-in test runner (`node --test`)

## Global Constraints

- Print-only change; do not modify `menu-data.js` category order.
- On-screen category navigation must remain unchanged.
- All existing print-layout test assertions (two pages, footers, unique IDs, CSS) must continue to pass.

---

### Task 1: Swap print category mapping and update test

**Files:**
- Modify: `script.js:13-22`
- Modify: `tests/print-layout.test.mjs:81-90`

- [ ] **Step 1: Run tests to confirm they pass before changes**

Run: `node --test tests/print-layout.test.mjs`
Expected: All tests PASS.

- [ ] **Step 2: Update the test expected mapping**

In `tests/print-layout.test.mjs`, replace the `expectedPages` array (lines 81-90) with:

```js
  const expectedPages = [
    [
      ['desayunos', 'frias-sin-cafe'],
      ['calientes-cafe', 'frias-cafe'],
    ],
    [
      ['filtrados', 'calientes-sin-cafe'],
      ['dulces', 'sodas'],
    ],
  ];
```

- [ ] **Step 3: Run tests to confirm the mapping test fails**

Run: `node --test tests/print-layout.test.mjs`
Expected: FAIL — `places every category in the intended print page and column` assertion mismatch.

- [ ] **Step 4: Update the print mapping in script.js**

In `script.js`, replace the `printPageCategoryIds` array (lines 13-22) with:

```js
const printPageCategoryIds = [
  [
    ['desayunos', 'frias-sin-cafe'],
    ['calientes-cafe', 'frias-cafe'],
  ],
  [
    ['filtrados', 'calientes-sin-cafe'],
    ['dulces', 'sodas'],
  ],
];
```

- [ ] **Step 5: Run tests to confirm all pass**

Run: `node --test tests/print-layout.test.mjs`
Expected: All tests PASS.

- [ ] **Step 6: Commit**

```bash
git add script.js tests/print-layout.test.mjs
git commit -m "Swap cold non-coffee and sweet treats in print layout"
```
