# Yeon Studio website

Static bilingual website for Yeon Studio by Rebecca, deployed with GitHub Pages.

## Public website

The site is public at <https://yeoncoaching.com/>. The preview password gate has been removed, and search indexing is enabled.

The GitHub Pages custom domain is `yeoncoaching.com`; `www.yeoncoaching.com` redirects to the canonical domain. HTTPS is managed by GitHub Pages.

## Photography

The homepage uses Rebecca’s `IMG_4407.jpg` workshop photo; the story section uses `IMG_4451.jpg` coaching photo from her supplied September 2026 folder. WebP copies preserve the original composition and use responsive CSS positioning. The workshop JPEG is used for social sharing.

## Contact

The contact section links directly to Rebecca’s LinkedIn profile in a new tab. There is no enquiry form or form-processing service to configure.

## Local preview

From this folder, run:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8765/`.

## Deployment

Pushing to `main` runs the GitHub Pages workflow in `.github/workflows/deploy-pages.yml`. The production URL is:

<https://yeoncoaching.com/>
