# Casa Miel Menu Contributor Guide

## Project at a glance

Casa Miel is a digital menu for a specialty coffee shop and pastry counter. The
application uses React Router, TypeScript, Tailwind CSS, and Cloudflare Workers.

## Project structure

- `app/routes/` contains route modules.
- `app/root.tsx` provides the document shell and shared external resources.
- `app/app.css` contains global application styles.
- `app/styles/tokens.css` is the source of truth for Casa Miel color and
  typography values.
- `workers/app.ts` is the Cloudflare Worker entry point.

## Styling and brand rules

- Add or change brand colors and font families only in `app/styles/tokens.css`.
- Use CSS custom properties there for plain CSS and the matching Tailwind theme
  tokens for utility classes. Do not repeat brand hex values in components.
- Use Oat (`#E1D5BF`) as the default page background and Espresso (`#392010`) as
  the default foreground.
- Use Astonpoliz for headings and DM Sans at `16px` for body copy.
- Keep global document rules in `app/app.css`; keep component-specific styles
  close to the component that needs them.

## Working conventions

- Use pnpm for dependency and script commands.
- Keep changes focused on the requested scope; do not introduce dependencies or
  restructure unrelated code without a clear need.
- Prefer semantic HTML and accessible names when building the menu interface.

## Verification

Run the relevant checks before handing off changes:

```bash
pnpm typecheck
pnpm build
```

For visual-foundation changes, also confirm `app/styles/tokens.css` remains the
only source of brand color and typography definitions.
