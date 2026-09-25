# The Forge website

A static website driven by [`content.md`](content.md). Edit that file to refine the group vision, lessons, and event plans. The site loads it when a visitor opens the page, so no build step is needed.

## Publish on GitHub Pages

1. Unzip this package. Create a **public** GitHub repository, for example `the-forge`.
2. Upload the files *inside* the unzipped folder to the repository's **root**, so `index.html` and `content.md` appear beside this README on the repository's main page. You can use **Add file → Upload files** in GitHub and drag in the visible site files. The included `.nojekyll` file is optional; if your file picker hides it, the site still works without it.
3. Open the repository's **Settings → Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, select `main` and `/ (root)`, then click **Save**.
4. After deployment finishes, use the **Visit site** link in Pages settings. The address usually looks like `https://YOUR-USERNAME.github.io/the-forge/`.

GitHub does not unpack a ZIP uploaded as a repository file. Upload the extracted files themselves, including `content.md`. The published site and its Markdown source are public. Do not add private contact information or anything else you do not want online.

When you change `content.md`, commit the change to `main`; GitHub Pages publishes the updated site. Keep the existing section headings if you want the top navigation links to continue targeting the same sections.

## Preview locally

From the folder containing `index.html`, run:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080/`. Opening `index.html` directly as a `file://` URL can prevent the browser from loading `content.md`.

## Site files

- `index.html`: page structure and hero
- `styles.css`: design, responsive layout, and motion
- `script.js`: Markdown rendering, navigation, and scroll effects
- `content.md`: content source
- `.nojekyll`: tells GitHub Pages to serve this as a plain static site

The site loads Google Fonts, Marked, and DOMPurify from external CDNs, so visitors need an internet connection for those resources.
