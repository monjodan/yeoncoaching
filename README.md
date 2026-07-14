# Yeon Studio website

Static bilingual website for Yeon Studio by Rebecca, deployed with GitHub Pages.

## Contact form setup

The form is ready for Formspree but intentionally uses a placeholder endpoint. To connect it:

1. Create a form at [Formspree](https://formspree.io/).
2. In `index.html`, replace `YOUR_FORM_ID` in `https://formspree.io/f/YOUR_FORM_ID` with the supplied form ID.
3. Commit and push the change to `main`.

The form sends `name`, `email`, `inquiry_type`, `message`, and `language`, and includes a honeypot field.

## Local preview

From this folder, run:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8765/`.

## Deployment

Pushing to `main` runs the GitHub Pages workflow in `.github/workflows/deploy-pages.yml`. The production URL is:

<https://monjodan.github.io/yeoncoaching/>
