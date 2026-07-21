# Two-Page Print Layout Design

## Goal

Produce a reliable two-page US Letter menu in Firefox/Zen print preview with no white strip at the top or bottom, no menu content behind the footer, and the olive Casa Miel footer repeated on both pages.

## Root Cause

The current print layout relies on a `position: fixed` footer. Browsers repeat fixed elements on printed pages, but the footer is removed from normal flow, so paginated menu content does not reserve space for it. The existing `@page` top margin avoids some collisions by changing where content fragments, but Firefox renders that unpainted margin as a white strip. Removing the margin exposes the underlying footer overlap.

## Architecture

Keep the interactive screen menu unchanged. Add a separate print-only representation generated from the same `window.menuData.categories` source during `renderMenu`.

The print representation contains exactly two `.print-page` elements. Each page is sized for US Letter and uses a full-height grid with:

- A two-column menu content area.
- A normal-flow olive footer as the final row.

Because each footer participates in its page's grid, menu content cannot render behind it. The page background and footer both reach their respective page edges without relying on browser margin painting or repeated fixed positioning.

## Page Composition

Page 1:

- Left column: `desayunos`, `dulces`.
- Right column: `calientes-cafe`, `frias-cafe`.

Page 2:

- Left column: `filtrados`, `calientes-sin-cafe`.
- Right column: `frias-sin-cafe`, `sodas`.

Category IDs are the stable mapping interface. If an expected category is missing, generation skips only that category rather than failing the whole menu.

## Rendering

Reuse the existing menu section and item creation logic so screen and print output share names, descriptions, prices, connector handling, and future data updates. Print nodes are separate DOM elements rather than moving or cloning the interactive nodes, so search filtering and category navigation remain isolated from print output.

The print page container is hidden during normal browsing and exposed only by `@media print`. The hero, tools, interactive menu, screen footer, and back-to-top control remain hidden in print.

## Print Styling

- Set `@page` to US Letter with zero margin.
- Give each `.print-page` the full page dimensions and force a page break after the first page.
- Use paper cream for the page and content background.
- Reserve a fixed footer row within each page grid.
- Keep the existing 15 mm horizontal content inset inside the page, not in `@page`, so it remains cream rather than becoming an unpainted printer margin.
- Preserve print color adjustment declarations for cream and olive backgrounds.

## Verification

Automated checks will verify:

- Exactly two print pages are generated.
- Each expected category appears on the intended page and column.
- Each print page contains one footer.
- Screen rendering still contains one section per menu category.

Generated PDF verification will confirm:

- The document is exactly two US Letter pages.
- No menu text intersects either footer.
- Cream reaches the top edge of each page.
- Olive reaches the bottom edge of each page.
- Existing screen layout remains unchanged outside print media.
