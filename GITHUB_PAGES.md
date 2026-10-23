# GitHub and GitHub Pages

The project is published from the **Siva4915** GitHub account:

- Repository: **https://github.com/Siva4915/Siva4915.github.io**
- Live site: **https://siva4915.github.io/**
- Owner/copyright holder: **Chukka Siva**

## How this deployment is structured

- **main** contains the source code and documentation.
- **gh-pages** contains only the built site from the dist folder.
- GitHub Pages serves the gh-pages branch from its root.

The repository name **Siva4915.github.io** is GitHub's special user-site repository. It serves at the root URL, so the existing absolute media paths in the source work without a base-path rewrite.

## Publishing an update

After changing the source and committing to main, run the included script:

    powershell -ExecutionPolicy Bypass -File scripts/deploy-pages.ps1

The script:

1. Runs npm run build.
2. Copies the production build into a temporary repository.
3. Force-pushes that snapshot to the gh-pages branch.
4. Leaves the source repository on main untouched.

GitHub Pages rebuilds within about a minute. The script uses the local Git credential helper; if Git asks you to sign in, complete the browser prompt.

The script lives at **scripts/deploy-pages.ps1**. It is safe to run repeatedly.

## Optional: automate with GitHub Actions

A ready-to-use workflow template is kept at **docs/github-actions-example.yml**. It requires the GitHub CLI token to have the **workflow** scope. To enable it later:

1. Grant the scope:

    gh auth refresh -h github.com -s workflow

2. Restore the workflow:

    mkdir -p .github/workflows
    cp docs/github-actions-example.yml .github/workflows/deploy-pages.yml
    git add .github/workflows/deploy-pages.yml
    git commit -m "Add GitHub Pages workflow"
    git push

3. On GitHub: **Settings → Pages → Source → GitHub Actions**.

The workflow builds with npm ci and npm run build, then deploys dist.

## Custom domain (optional, paid)

GitHub's free URL is **https://siva4915.github.io/**. A custom domain such as **vuemora.com** must be registered separately in your name; GitHub does not register domains.

1. Buy the domain in your name and enable 2FA/lock.
2. Create **public/CNAME** containing only the domain, for example:

    vuemora.com

   **public/CNAME.example** is provided as a template.
3. Rebuild and republish the gh-pages branch.
4. Add these DNS records at the registrar/DNS host:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | siva4915.github.io |

5. In GitHub: **Settings → Pages**, set the custom domain and enable **Enforce HTTPS**.
6. GitHub will verify the domain; DNS can take up to 24–48 hours.

The CNAME file must be inside public/ so Vite copies it into dist on every build.

## Domain note

The free GitHub Pages domain belongs to the repository and is controlled by the GitHub account. The custom domain remains a separate purchase and must be registered in the owner's name.
