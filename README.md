# RITSUKI - Personal Terminal

Personal site as a retro CRT terminal (`RK/OS 9000`), built with SvelteKit 2 + Svelte 5 (runes) + TypeScript. Inspired by the terminals in Fallout 4 - see [Inspiration](#inspiration).

All copy lives in `src/lib/data/content.ts` - components never hold text.

## Run

```sh
pnpm install
pnpm dev      # dev server
pnpm check    # svelte-check
pnpm lint     # Prettier, check only
pnpm test     # build, preview, then the Playwright e2e suite
pnpm build    # production build
pnpm og       # re-render static/og.png (link preview) from scripts/og.html
```

## Navigation

| Context      | Keys                                   |
| ------------ | -------------------------------------- |
| Menu         | `1`–`5`, `↑`/`↓` (or `j`/`k`), `Enter` |
| Any screen   | `Esc` / `Backspace` / `←` → back       |
| Work archive | `↑`/`↓` select, `Enter` open entry     |
| Anywhere     | `S` → speaker on/off, `T` → theme      |

Everything is also clickable. State lives in the URL - `?screen=identity`,
`?screen=archive&entry=keuangan` - so every screen is linkable and server-rendered.

## Themes

Every colour derives from a handful of tokens in `src/app.css`. A theme swaps only those:

| Theme           | Phosphor  | Wordmark |
| --------------- | --------- | -------- |
| green (default) | `#4ade80` | red      |
| amber (P3)      | `#ffb000` | blue     |
| white (P4)      | `#cfd6dc` | blue     |

The wordmark sits opposite the phosphor on the colour wheel. The choice is remembered in `localStorage` and applied by a small script in `app.html` before first paint, so a returning visitor never sees the default flash first.

## Structure

```
src/
  app.css                  palette tokens, themes, shared atoms
  app.html                 fonts, pre-paint theme script
  lib/
    data/content.ts        ← ALL COPY LIVES HERE
    audio.svelte.ts        synthesised UI sounds; muted until [S]
    theme.svelte.ts        theme state; [T] cycles
    assets/                favicon, portrait
    components/            Header, Wordmark, Menu, ChannelRow
    screens/               Identity, Capabilities, Archive, Transmission, Status
  routes/
    +layout.svelte         global CSS + CRT overlay
    +page.svelte           terminal shell: URL state, keyboard, screen switching
    site.e2e.ts            Playwright suite
```

The terminal components (`Typed`, `Crt`, `Meter`, `Boot`, `ScreenFrame`) come from
[`@ritsuki.kagerou/crt-ui`](https://www.npmjs.com/package/@ritsuki.kagerou/crt-ui)
([repo](https://github.com/ritsuki-kagerou/crt-ui)). `pnpm-workspace.yaml` exempts its
current release from pnpm's `minimumReleaseAge`, so a fresh publish installs straight away.

## Making it your own

Start at the top of `src/lib/data/content.ts`:

- `PROFILE` - name, role, city, timezone, mail and handles. Written once; the wordmark, header, records, channels and meta description all read from it.
- `IDENTITY`, `CAPABILITIES`, `ARCHIVE`, `TRANSMISSION`, `STATUS` - one block per screen.
- `UI` - the interface's own words (labels, key hints), so a translation never opens a component.

Replace `src/lib/assets/portrait.webp` and the favicon with your own.

## Inspiration

- **The terminals in Fallout 4** - the in-game RobCo terminals are where the feel comes from: phosphor text on a dark tube, a boot log before anything else, lines that type themselves out, an inverted bar marking the selected row, and a machine you drive entirely from the keyboard. The speaker is modelled on them too: the keystroke and menu clicks in `src/lib/audio.svelte.ts` were matched against measurements of a reference clip of a Fallout 4 terminal (decay, spectral centroid, body harmonics, typing rate), then synthesised from scratch in WebAudio. No sound, image or other asset from the game is used.

Fallout is a trademark of Bethesda Softworks LLC. This project is a fan-inspired personal site and is not affiliated with or endorsed by Bethesda.

## License & credit

You are welcome to use this site as the starting point for your own - fork it, change it, ship it. The **code** is released under the [MIT License](LICENSE), and its one condition is the credit: keep the copyright notice (`Copyright (c) 2026 Ritsuki`) and the license text in your copy of the code.

If your site is built on this one, a visible credit is appreciated as well, for example in the footer or your own README:

> Based on [ritsuki-profile](https://github.com/ritsuki-kagerou/ritsuki-profile) by Ritsuki.

What the license does **not** cover is the personal content - it describes one person and is not yours to reuse:

- the name, bio, project descriptions and other copy in `src/lib/data/content.ts`
- the avatar artwork in `src/lib/assets/portrait.webp`

Replace those with your own before publishing.
