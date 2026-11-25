JEIYIEN BRAND COLOURS
=====================

The site has been updated to use this brand palette:

* Navy:       #0C356A (headings and strong brand elements)
* Cyan:       #40F8FF (interactive accents, buttons and supporting highlights)

EDITING THE COLOURS
-------------------
Open assets/scss/_settings.scss and edit the four variables near the top:
$brand-navy, $brand-blue, $brand-cyan and $brand-light-green.

BUILDING CSS
------------
From the JeiyienWebsite folder, run:
  npm install
  npm run build:css

To automatically rebuild CSS while editing SCSS:
  npm run watch:css

The HTML pages load assets/css/main.css, not SCSS directly. Always compile
SCSS after making changes so the browser receives the updated CSS.

OPTIONAL UTILITY CLASSES
------------------------
Add class="jeiyien-light-highlight" to an element for a light-green background.
Add class="jeiyien-cyan-highlight" for a subtle cyan underline highlight.


## Homepage hero
The homepage hero now uses Jeiyien company messaging, a navy gradient overlay, cyan eyebrow/highlights, and calls to action linking to Projects and Contact. Edit the hero markup in `index.html` and styles in `assets/scss/_hero.scss`; recompile with `npm run build:css`.
