# English Nuance Glossary

Static Swedish-to-English glossary for GitHub Pages.

## Files
- `index.html` – page structure
- `style.css` – appearance
- `script.js` – loading, Swedish alphabetical sorting, search and active navigation
- `glossary.json` – glossary content
- `.github/workflows/deploy-pages.yml` – automatic GitHub Pages deployment

## Updating the glossary
Edit `glossary.json`, commit, and push to `main`. GitHub Actions will deploy the new version automatically.

The left navigation is always sorted using Swedish collation (including Å, Ä and Ö).
