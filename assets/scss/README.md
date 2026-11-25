# SCSS source for the Dewi website

The original ZIP supplied `assets/css/main.css` but did not include the template's SCSS source. These SCSS files have therefore been reconstructed from that CSS. They preserve the existing selectors and layout; the design tokens at the top of `_settings.scss` are exposed as Sass variables for easier editing.

## Compile the SCSS

From the `JeiyienWebsite` project folder, install Sass once:

```bash
npm install
```

Then compile:

```bash
npm run build:css
```

This writes the compiled stylesheet to `assets/css/main.css`, which is already linked by all four HTML pages. To compile in watch mode while editing:

```bash
npm run watch:css
```

You can also use the Sass CLI directly:

```bash
npx sass assets/scss/main.scss assets/css/main.css --style=expanded
```

## Where to edit

- `_settings.scss`: fonts, global colours and navigation colours.
- `_header-navigation.scss`: header and menus.
- `_global-components.scss`: preloader, scroll-to-top, breadcrumbs and global section styles.
- The remaining partials: individual page sections such as hero, about, services, portfolio, team and contact.
- `main.scss`: imports the partials in the required output order.

The vendor stylesheets under `assets/vendor/` are separate libraries and are intentionally not rebuilt from this SCSS.
