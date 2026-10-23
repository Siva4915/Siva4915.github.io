# Ownership and handover

Status: **owner recorded; GitHub Pages live** — copyright holder **Chukka Siva**; site published at **https://siva4915.github.io/**. A custom domain and formal trademark clearance are still open.

This document is a practical checklist, not legal advice. Copyright, contract, and trademark rules depend on your jurisdiction and on the terms of the tools used to create the work. Consult a qualified IP lawyer before relying on any ownership claim.

## 1. Copyright and project ownership

I cannot assign copyright, sign an assignment, or act as a legal owner. I am an AI assistant and do not hold legal title to the project. I can only hand over the files in this workspace and document what is in them.

### What is in the handover

- The project-specific React/TypeScript/CSS source code in `src/`, the build configuration, and the product copy written for this demo.
- The layout, component structure, interaction design, and demo data created for Vuemora.
- Local media files used for the demo. These are **not** owned by the project; see [CREDITS.md](CREDITS.md).
- A production-ready static build in `dist/` after running `npm run build`.

### What limits a claim of full ownership

1. **AI-assisted material.** Copyright in AI-assisted output is jurisdiction-dependent. In some countries, a work must have sufficient human authorship to be protected. The selection, arrangement, editing, and original code you add can still matter, but this needs local legal review.
2. **Third-party code.** React, Vite, TypeScript, lucide-react and other packages remain under their own licenses (MIT, Apache-2.0, ISC). They are not transferred to you.
3. **Stock photography and video.** The Unsplash, Pexels, Samplelib, MDN and Blender Foundation media remain with their respective rights holders. Their licenses allow use, but they do not transfer copyright. Some photos may also involve model or property rights.
4. **Brand and trade dress.** “YouTube” is a Google trademark. The name “Vuemora,” the logo, and the visual design need a trademark search before launch. Do not copy YouTube’s logo, wordmark, or other protected brand assets.
5. **Contributors.** If anyone else writes code, design, copy, or media for the project, get a written IP assignment or work-for-hire agreement.

### Brand note: “Vuemora”

“Vuemora” was selected as a coined name that avoids YouTube’s “tube” naming pattern. Initial screening on 23 October 2026 found that `vuemora.com`, `vuemora.in`, `vuemora.tv` and `vuemora.app` appeared unregistered, and no exact-name product or app showed up in a quick web search. That is a useful starting point, **not trademark clearance**.

Before a public launch, search the mark in India for classes 9, 38, 41 and 42, check the app stores and social handles, and have a trademark lawyer review it. The selected identity uses a teal-to-indigo **V** mark rather than a red play button, which reduces visual similarity to YouTube. Do not describe the brand as risk-free.

### Steps to make the ownership record clean

- [x] Owner recorded as **Chukka Siva** in [LICENSE](LICENSE) and `package.json`.
- [ ] Confirm whether the owner should be a company instead of an individual.
- [ ] Add the repository owner in your Git host and keep the licence with the repository.
- [ ] If a company owns the app, have the founder/contractors sign IP assignments in the company’s favour.
- [ ] Replace stock thumbnails, avatars, and video clips with assets you own or have explicitly licensed for commercial use; keep receipts and model/property releases.
- [ ] Record the source and license of every new asset in [CREDITS.md](CREDITS.md).
- [ ] Run a trademark and company-name search for the final brand and domain.
- [ ] Add a privacy policy and terms of use before collecting accounts, analytics, payments, or personal data.
- [ ] Keep the dependency license notices with the distributed build.

### Short contributor assignment template

Have a lawyer adapt this before use:

> For good and valuable consideration, the receipt and sufficiency of which are acknowledged, **[Contributor]** assigns to **[Owner]** all right, title, and interest in the contributions described in Schedule A, including copyright and all related rights, and agrees to execute any documents reasonably required to record or perfect that assignment.

## 2. Hosting access

The app is currently published on **GitHub Pages** from the owner-controlled repository **Siva4915/Siva4915.github.io**. There are no VPS or cloud-server credentials in this project, and no database or application server is required.

The free Pages URL is **https://siva4915.github.io/**. A custom domain is a separate purchase (see section 3). GitHub account access and 2FA remain in the owner’s control.

### Recommended hosting

| Option | Best for | Notes |
| --- | --- | --- |
| Vercel | Fastest deployment, previews | Import the repository, framework preset Vite, output `dist` |
| Netlify | Drag-and-drop or Git deploy | `netlify.toml` is included |
| Cloudflare Pages | Global static hosting | Build command `npm run build`, output `dist` |
| VPS / Nginx | Full control | Serve `dist/` with the included `nginx.conf.example` |

### Access rules

- Create the hosting account in the owner’s name, with the owner’s email and 2FA.
- Do not share account passwords in chat. Use the host’s invitation/team features or a deploy token stored in a password manager.
- Keep DNS and hosting in the same owner-controlled accounts.
- If a freelancer deploys it, give them a scoped role and remove it after handover.

### What I can prepare for you

- Build and deployment configuration.
- A ZIP of the production build.
- The exact host settings, DNS records, and a launch checklist.
- I cannot purchase, own, or recover accounts for you.

## 3. Domain access

The free GitHub Pages address **https://siva4915.github.io/** is live. No separate custom domain has been registered; a domain must be purchased by you or your company through a registrar, in an account you control.

### Steps

1. Choose an available name and run a trademark search.
2. Register it at a registrar such as Cloudflare Registrar, Namecheap, or Squarespace Domains.
3. Use the owner’s email, billing details, and 2FA; enable registrar lock.
4. Add the domain in your hosting dashboard.
5. Create the DNS records the host gives you. Common patterns:
   - Apex/root: an `A` or `ALIAS` record to the host.
   - `www`: a `CNAME` to the host’s target.
6. Wait for DNS propagation, enable HTTPS/automatic certificates, and choose the canonical hostname (for example `www` redirecting to the apex, or the reverse).
7. Verify the live site and set up renewal reminders and expiry protection.

Do not transfer a domain to an AI assistant. Keep the registrar login, recovery email, and 2FA in the owner’s control.

## 4. What is still needed

- The domain you will register, and where it will be registered.
- The hosting provider you prefer (or “not sure”).
- Whether you want the stock demo media kept, or replaced with owned media.
- A formal trademark search and decision on **Vuemora** before any public commercial launch.
- Registration of `vuemora.com` and the relevant social handles in the owner's name.

Once the domain and host are known, the deployment notes can be turned into exact DNS records and commands.
