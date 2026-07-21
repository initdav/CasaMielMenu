# Print Category Swap Design

## Goal

Swap `Bebidas frías sin café` and `Antojos dulces` in the two-page print/PDF menu while preserving every other category position and the on-screen category order.

## Print Composition

Page 1:

- Left column: `desayunos`, `frias-sin-cafe`.
- Right column: `calientes-cafe`, `frias-cafe`.

Page 2:

- Left column: `filtrados`, `calientes-sin-cafe`.
- Right column: `dulces`, `sodas`.

## Implementation

Update only the two stable category IDs in the existing `printPageCategoryIds` mapping. Do not reorder `window.menuData.categories`, because that array controls the on-screen navigation and menu sections.

## Verification

Update the print-layout test's expected page and column mapping. Run the automated test suite to verify the literal swap, two-page structure, repeated footers, unique interactive section IDs, and existing print CSS requirements.
