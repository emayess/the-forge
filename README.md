# The Forge website

Live: https://emayess.github.io/the-forge/

`content.md` is the single source of content for the homepage, event pages, vision, formation, dads, and full working plan. No build step is required.

## Editing content

Each section starts with `<!-- page:slug -->`. Keep those markers intact. The homepage reads the `home` section; each event reads its matching section. The vision page combines vision, identity, and bigger-idea sections. The formation page combines rhythm, formation, year, and progression. `plan.html` shows the full document except its homepage summary.

Edit the event summaries in the home section when changing their introductions. Add a new event by adding a marked section, a homepage card with its link, and an HTML shell using that section's slug in `data-page`. Event shells use `<base href="../">` so shared assets and Markdown load from the repository root.

Commit changes to `main` to update GitHub Pages. All site paths are relative and work under `/the-forge/`.

## Preview

Run `python3 -m http.server 8080` from this folder and open http://localhost:8080/. Opening the HTML directly can prevent Markdown loading.

The site uses Google Fonts, Marked, and DOMPurify from CDNs. The layouts work at mobile and desktop widths and respect reduced-motion preferences.
