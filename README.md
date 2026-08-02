# Casa Miel Menu

Casa Miel's digital menu is a warm, focused home for specialty coffee and the
pastries that belong beside it. This project is the foundation for an
easy-to-browse menu that feels as considered as the counter experience.

## Visual language

The interface begins with the tones that define Casa Miel:

| Token | Color | Role |
| --- | --- | --- |
| Olive | `#7B8149` | Natural accent |
| Honey | `#BF8412` | Warm highlight |
| Cream | `#F2DC99` | Light supporting surface |
| Oat | `#E1D5BF` | Default page background |
| Espresso | `#392010` | Default text and foreground |

Headings use Astonpoliz, self-hosted from `public/Astonpoliz.ttf`. Body copy
uses [DM Sans](https://fonts.google.com/specimen/DM+Sans) at `16px`. Shared
color and typography values live in `app/styles/tokens.css`.

## Stack

- React Router and React
- TypeScript
- Tailwind CSS
- Cloudflare Workers and Wrangler
- pnpm

## Getting started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

The app is available at `http://localhost:5173`.

## Quality checks

Check generated types and TypeScript:

```bash
pnpm typecheck
```

Create a production build:

```bash
pnpm build
```

Preview that build locally:

```bash
pnpm preview
```

## Deployment

Deploy the Worker through Wrangler:

```bash
pnpm deploy
```

The menu interface and menu content are still to come; this repository now
provides the visual and technical foundation for building them consistently.
