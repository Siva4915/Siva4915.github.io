# Deployment and domain setup

Vuemora is a static React/Vite application. The production build is written to `dist/`; no Node server, database, or API is required.

## Build locally

```bash
npm install
npm run build
npm run preview
```

The preview runs at <http://127.0.0.1:4173>.

## GitHub Pages (free)

The free address is **https://siva4915.github.io/**.

- Source: **https://github.com/Siva4915/Siva4915.github.io** (branch `main`)
- Production build: branch `gh-pages`
- GitHub Pages serves the root of `gh-pages`

Full update instructions and custom-domain DNS records are in [GITHUB_PAGES.md](GITHUB_PAGES.md).

## Vercel

1. Create a Vercel account in the owner’s name and import the repository.
2. Framework preset: **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Deploy. `vercel.json` in this repository supplies the same settings and basic security headers.

## Netlify

1. Create a Netlify account in the owner’s name.
2. Add the repository or drag the generated `dist/` folder into Netlify Drop.
3. Build command: `npm run build`; publish directory: `dist`.
4. `netlify.toml` in this repository supplies the build and header settings.

## Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`
- Framework preset: Vite

## VPS with Nginx

1. Build locally with `npm run build`.
2. Upload the contents of `dist/` to the server, for example `/var/www/vuemora`.
3. Use [nginx.conf.example](nginx.conf.example) as a starting point.
4. Point the domain at the server and enable TLS (for example with Certbot).

The app uses hash-based routes (`#/watch/...`), so a static server does not need SPA fallback rewrites for normal navigation. The Nginx example still includes a safe `try_files` fallback.

## Domain checklist

- Register the domain in the owner’s registrar account.
- Add it as a custom domain in the hosting provider.
- Add the provider’s DNS records at the registrar or DNS host.
- Enable HTTPS and force a canonical hostname.
- Set up renewal reminders, registrar lock, and 2FA.
- Test the home page, a watch link, a Shorts link, and a deep-linked search URL on the live domain.

## Media and content before launch

The demo uses third-party stock media; see [CREDITS.md](CREDITS.md). Replace it with owned or explicitly licensed assets before a commercial launch, and update the credits. The brand name and logo also need a trademark check before launch.
