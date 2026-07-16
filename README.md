# joshcrites.com

This is a lightweight Jekyll site hosted at [joshcrites.com](https://joshcrites.com). The homepage remains a hand-authored static page; Jekyll is used only to turn Markdown essays into consistent article pages. Netlify runs the build defined in `netlify.toml` and publishes the generated `_site/` directory.

## Project structure

```text
index.html          Homepage and index of ideas
_posts/             Markdown source for published essays
_layouts/post.html  Shared semantic article layout and metadata
assets/post.css     Article typography and responsive styles
favicon/            Site icons
_config.yml         URL, Markdown, and permalink settings
Gemfile             Reproducible Jekyll dependency
netlify.toml        Netlify build and publish settings
sitemap.xml         Public URLs for search engines
```

## Add a post

Create `_posts/YYYY-MM-DD-post-slug.md` with this front matter:

```yaml
---
layout: post
title: A precise title
subtitle: A one-sentence frame for the essay
description: A concise description for search and social previews.
---
```

Write the body in Markdown beginning with an introductory paragraph; the layout supplies the article's `<h1>`, publication date, navigation, and metadata. Jekyll publishes it at `/posts/post-slug/`.

Add a short, honest entry linking the essay from the homepage's “Ideas and notes” section, then add its public URL to `sitemap.xml`.

Install the Ruby dependencies with `bundle install`, then preview with `bundle exec jekyll serve` and open `http://localhost:4000`. GitHub Pages can build the Jekyll structure directly; Netlify uses the checked-in build configuration.
