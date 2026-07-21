# Print Page Logo Header

**Date:** 2026-07-21  
**Status:** Draft

## Overview

Add a centered house mark logo header to the top of every print page in the Casa Miel menu.

## Requirements

- Display the house mark icon (`assets/house-mark.svg`) at the top of each printed page
- Logo appears on every print page, not just the first page
- House mark only (no wordmark)
- Centered alignment, no divider line

## Design

### Structure

Each `.print-page` gains a `<header>` element as its first child, before `.print-page-content`:

```html
<section class="print-page">
  <header class="print-page-header">
    <img src="assets/house-mark.svg" alt="" />
  </header>
  <div class="print-page-content">
    <!-- existing columns -->
  </div>
  <footer class="print-page-footer">
    <!-- existing footer -->
  </footer>
</section>
```

### Styling

**Print page grid:**
- Change from `grid-template-rows: 1fr 14mm` to `auto 1fr 14mm`
- Three rows: header (auto height), content (fills remaining space), footer (14mm)

**Header:**
- `padding: 15mm 15mm 4mm` (top/sides match content area, bottom provides breathing room)
- `display: flex; justify-content: center; align-items: center`
- House mark image: `width: 28px; height: auto`
- No border or background

**Visual hierarchy:**
- House mark renders in brown `#392010` (default SVG color)
- Matches footer's restrained branding approach
- Centered horizontally, minimal vertical footprint

### Implementation

**JavaScript (`script.js`):**

Add `createPrintHeader()` function:

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

Modify `renderPrintMenu()` to prepend header to each page:

```javascript
page.append(createPrintHeader(), content, createPrintFooter());
```

**CSS (`styles.css`):**

Update `.print-page` grid:

```css
.print-page {
  grid-template-rows: auto 1fr 14mm;
}
```

Add header styles:

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

## Testing

- Print preview shows house mark centered at top of each page
- Logo does not overlap with menu content
- Footer remains aligned to bottom
- House mark renders in correct brown color
- No visual regression in screen view (print-menu remains hidden)

## Out of Scope

- Logo on screen view (web menu)
- Wordmark or text in header
- Different logo sizes per page
- Logo variations (color, style)
