<!--suppress HtmlDeprecatedAttribute -->

<div align="center">
    <a href="https://tiny-blocks.github.io/">
        <img alt="Tiny Blocks" src="public/logo.png" width="120">
    </a>
</div>

# Tiny Blocks site

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

* [Overview](#overview)
    + [How it works](#how-it-works)
    + [Adding a library](#adding-a-library)
* [Installation](#installation)
    + [Repository](#repository)
    + [Configuration](#configuration)
    + [Tests](#tests)
    + [Review](#review)
    + [Maintenance](#maintenance)
* [Environment setup](#environment-setup)
    + [Access URLs](#access-urls)
* [Deployment](#deployment)
* [License](#license)

## Overview

The documentation site of [Tiny Blocks](https://github.com/tiny-blocks), a set of small, focused, framework-agnostic PHP
libraries, published at [tiny-blocks.github.io](https://tiny-blocks.github.io/).

### How it works

The site holds no documentation of its own. When it is built, it reads the `README.md` and the `composer.json` of every
library from its repository, and its latest release and downloads from Packagist. Each README becomes the page of its
library, and the `require` sections of the `composer.json` files become the dependency graph the home draws as a wall
of blocks and every page lists as what the library stands on and what stands on it.

### Adding a library

Add one line to `CATALOG` in `src/content/catalog.ts`, with the name of the repository and the area the home lists it
under. Everything else is read from the library itself.

## Installation

### Repository

To clone the repository using the command line, run:

```bash
git clone https://github.com/tiny-blocks/tiny-blocks.github.io.git
```

### Configuration

To install project dependencies locally, run:

```bash
make configure
```

To start the development server with live reload, run:

```bash
make start
```

To stop the development server, run:

```bash
make stop
```

To build the site and its search index into `dist/`, run:

```bash
make build
```

To serve the built site, search included, as it is published, run:

```bash
make preview
```

To draw the link-preview cards, `public/og-image.png` and one per library in `public/og/`, run the command
below. Run it again after adding a library to the catalog:

```bash
make og-image
```

### Tests

Run the unit tests:

```bash
make tests
```

Check the script every built page ships against its budget (run after `make build`):

```bash
make budgets
```

### Review

Run the linter, the formatter check and the Astro and TypeScript checks:

```bash
make review
```

Fix linter and formatter issues:

```bash
make fix-review
```

### Maintenance

Remove dependencies and generated artifacts:

```bash
make clean
```

> You can check other available commands by running `make help`.

## Environment setup

### Access URLs

| Environment  | URL                                |
|:-------------|:-----------------------------------|
| `Local`      | http://localhost:4321/             |
| `Production` | https://tiny-blocks.github.io/     |

## Deployment

The `Deploy site` workflow builds the site and publishes it on GitHub Pages on every push to `main`, every day to pick up
new releases of the libraries, on demand from the Actions tab, and when a library sends a `repository_dispatch` of type
`library-released`.

## License

Licensed under [MIT](LICENSE).
