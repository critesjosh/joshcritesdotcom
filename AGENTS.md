# AGENTS.md

## Purpose

This is Josh Crites's personal website. It is an evolving personal artifact of
work, experiments, questions, books, and influences, not a resume, marketing
page, or conventional portfolio.

Preserve its character:

- Personal, thoughtful, curious, and handmade
- Technically literate without being promotional
- Broad enough for professional, intellectual, creative, and personal interests
- Coherent without forcing every interest into one career narrative

Guiding phrase: **Seeking high-potential realities.**

## Site Shape

Keep the site a lightweight, semantic, single-page static site unless Josh
explicitly requests a different architecture. Do not add a router, CMS,
database, framework, analytics, or dependency merely to anticipate growth.

Major sections and anchors are:

1. Introduction and `Explore` table of contents
2. `#questions` Questions I'm exploring
3. `#work` Work and experiments
4. `#ideas` Ideas and notes
5. `#library` Library
6. `#now` Now
7. `#about` About
8. `#contact` Contact

Keep sections modular enough to extract later, but do not create empty pages
or empty note links to simulate a larger publication.

## Content and Voice

Use a direct, reflective, technically literate voice. Prefer concrete nouns
and verbs over self-praise. Preserve open-endedness when the source material
is provisional.

Prefer: "I'm exploring...", "an experiment in...", "currently reading", and
"developing" when accurate.

Avoid corporate language, startup cliches, keyword stuffing, invented
outcomes, speculative metrics, generic AI copy, and repeated "coming soon"
labels. Do not present a book, question, or unfinished experiment as a settled
belief or accomplishment.

Professional work should be clear and credible without crowding out books,
questions, experiments, philosophy, dreams, music, learning, or community.
When adding an entry, provide one or two precise sentences that answer at
least one of: why it matters, what it explores, Josh's role, or how it connects
to broader interests.

Do not describe Josh as currently leading Developer Relations at Aztec. Use
past tense and do not invent dates, team sizes, metrics, or results.

Use **DreamsLens** consistently. Use **Can't See Past My Shades** with its
apostrophe.

## Questions

Do not change or expand the Questions section without an explicit request.
Its current four questions are:

1. How does software development change when agents become increasingly capable builders?
2. What forms of privacy and autonomy become necessary in an AI-mediated world?
3. What allows individuals, groups, and machines to become more intelligent together?
4. What does it mean to steward complexity rather than control it?

## Notes, Library, and Now

Notes may be essays, short reflections, seeds, diagrams, or open questions.
Publish only real content. A short, honest section is preferable to artificial
completeness. Do not update a note's meaningful-update date for formatting or
dependency-only changes.

The Library is an intellectual portrait, not an affiliate shelf or exhaustive
reading log. Annotations should explain why a work matters to Josh rather than
summarize it. Do not infer a favorite or a definitive interpretation from a
book marked "currently reading."

Keep the Now section a manually maintained snapshot. Do not generate its date
automatically; remove stale items rather than accumulating them.

## Design and Accessibility

Favor strong typography, generous whitespace, a readable text column, visible
links, restrained borders, semantic numbering, a single accent color, and the
existing blockie where appropriate. Do not turn every entry into a card.

Avoid generic SaaS styling, gradients, glassmorphism, stock or futuristic AI
imagery, skill bars, testimonial carousels, corporate timelines, heavy
animation, scroll-jacking, auto-rotating content, and a hamburger menu for the
one-page contents.

Every change must preserve or improve:

- Semantic landmarks and logical heading levels
- Keyboard navigation and visible focus states
- Reduced-motion support
- Color contrast and readable text at 200% zoom
- Mobile layout without horizontal scrolling
- Meaningful image alt text; decorative images use empty `alt`
- Native anchor navigation without JavaScript dependence

Use native elements such as `<header>`, `<nav>`, `<main>`, `<section>`, and
`<footer>`. Do not use clickable `<div>` elements when links or buttons apply.

## Links, Metadata, and Privacy

Use descriptive link text. Keep external-link treatment consistent, and do not
open links in new tabs without a clear reason. Verify new external URLs when
possible, but do not silently remove an explicitly requested legacy link just
because a destination is temporarily unavailable.

For major positioning changes, review the title, description, canonical URL,
Open Graph metadata, social card, favicon, `robots.txt`, `sitemap.xml`, and
accurate structured data.

Keep the site privacy-respecting: no behavioral analytics, session replay,
advertising, tracking pixels, or unnecessary third-party services.

## Working in This Repository

This is currently a plain static HTML site with no package manager, build
script, or test suite. Inspect the repository before assuming otherwise.

For changes:

1. Read the surrounding section before editing.
2. Make the smallest coherent change and preserve user-authored work.
3. Check for duplicated content, names, punctuation, tense, and internal anchors.
4. Run `git diff --check`.
5. When browser tooling is available, inspect desktop and narrow mobile layouts,
   keyboard focus, and anchor navigation.

Ask Josh before splitting into multiple pages; adding a framework, CMS,
database, analytics, newsletter, or contact form; removing a project or book;
publishing unfinished private notes; materially changing the visual identity;
or changing the four questions.

Routine copy corrections, accessibility fixes, responsive improvements, and
explicitly requested content updates do not require separate approval.
