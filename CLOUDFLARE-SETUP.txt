JEIYIEN WEBSITE — CLOUDFLARE EDITION
===================================

This package preserves the supplied Jeiyien static website and converts its
PHP/JSON CMS into Cloudflare Pages Functions + D1 + R2.

WHAT IS ALREADY PREPARED
- Original website pages, styles, scripts, assets and project photographs.
- Homepage portfolio reads project records from /api/content.
- Project details page reads the same live project records.
- Cloudflare CMS at /admin/ for projects and homepage banners.
- D1 schema and seed data migrated from cms/data/projects.json and banners.json.
- R2 upload endpoint for banner/project images.
- Contact and newsletter endpoints use Resend and send to mcmugwe@gmail.com.

IMPORTANT: NOT YET DEPLOYED
You still need to create Cloudflare resources and configure secrets. Do not
publish this site until the setup below is complete. Protect /admin/* and
/api/content write + /api/upload using Cloudflare Access.

CLOUDFLARE SETUP (one-time)
1. Create a GitHub repository and push the contents of this JeiyienWebsite folder.
2. In Cloudflare, create a D1 database named jeiyien-content.
3. Run database/schema.sql, then database/seed.sql in that D1 database.
4. Create an R2 bucket named jeiyien-media.
5. Give the bucket a public custom domain (or public URL). Set Pages variable
   MEDIA_PUBLIC_BASE_URL to that base URL (without a trailing slash).
6. Create a Cloudflare Pages project connected to the GitHub repository.
   Framework preset: None. Build command: leave blank. Build output directory: /.
   If Cloudflare rejects / as output directory, use . (dot).
7. Set the D1 binding named DB and R2 binding named MEDIA in Pages Settings >
   Functions > Bindings, for Production and Preview.
8. Update wrangler.toml database_id with the real D1 database ID if using Wrangler.
9. Create a Cloudflare Access self-hosted application for:
   https://YOUR-DOMAIN/admin/*
   and protect write API paths: /api/content and /api/upload.
   Add your own login email to its allow policy. Do not leave the CMS publicly open.
10. Configure Resend (resend.com): verify a sending domain you control, create an
    API key, then set RESEND_API_KEY as a Pages secret. Set EMAIL_FROM to an
    address on your verified domain. The default onboarding sender is for testing
    and may not be accepted for production delivery.
11. Set custom domain in Pages and test the public site, admin, uploads and forms.

EMAIL
Both forms deliver to mcmugwe@gmail.com. Resend API key is NOT included; never
put API keys in source code or GitHub. The forms will return a configuration
error until RESEND_API_KEY and a verified EMAIL_FROM are configured.

CMS ACCESS
The CMS uses Cloudflare Access rather than a username/password stored in the
website. You must protect /admin/* and the CMS write APIs. Read-only public
project content remains available at /api/content.

PROJECT DATA
The D1 seed includes the supplied 17 project records. The Nanyuki Airstrip
Cabro Paving record remains Year 2025, Duration 1 month, Location Nanyuki
Airstrip. Its existing CMS seed image is assets/images/portfolio/cabro-2.jpg;
replace it in the CMS with the correct Nanyuki Airstrip photographs when ready.

TEST LOCALLY
- Install Node.js 22 or later.
- Open this folder in VS Code.
- In Command Prompt terminal run: npm install
- Then: npx wrangler pages dev .
Local D1/R2 bindings require Wrangler local configuration and are best tested
after Cloudflare resources are created. Do not expect the CMS API to work before
the D1 and R2 bindings exist.

ROLLBACK / SAFETY
Keep the original ZIP as a backup. This conversion does not change your live
hosting. No deployment or DNS change has been made.
