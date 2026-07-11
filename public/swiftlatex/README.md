# Self-hosted SwiftLaTeX engine + TeXLive subset

Everything the in-browser CV compiler needs, served same-origin. No external
network dependency at compile time.

## Engine (`swiftlatexpdftex.js`, `swiftlatexpdftex.wasm`)

pdfTeX 1.40.21 compiled to WebAssembly, from the official SwiftLaTeX release
[v20022022](https://github.com/SwiftLaTeX/SwiftLaTeX/releases/tag/v20022022).

**Local patch** (one line) in `swiftlatexpdftex.js`: the worker saves downloaded
TeXLive files under the name given by the `fileid` response header, which only
SwiftLaTeX's dynamic server sent. Static hosting has no such header, so the
patch falls back to the URL basename:

```js
const fileid=xhr.getResponseHeader("fileid")||remote_url.split("/").pop();
```

## TeXLive files (`texlive/pdftex/…`)

Layout mirrors the kpathsea request URL: `pdftex/{kpse-format-code}/{filename}`.

| Dir | Contents | Source |
|-----|----------|--------|
| `10/` | `swiftlatexpdftex.fmt` — precompiled LaTeX format (kernel 2020-02-02) | [SwiftLaTeX/Texlive-Ondemand](https://github.com/SwiftLaTeX/Texlive-Ondemand) repo root |
| `26/` | `.sty`/`.cls`/`.clo`/`.def`/`.dfu`/`.cfg` runtime files | TeX Live 2020 `tlnet-final` archives (historic mirror) |
| `3/` | `.tfm` font metrics — each stored with **and without** extension (the engine requests bare names) | TeX Live 2020 (`cm`, `latex-fonts`, `amsfonts`) |
| `32/` | `.pfb` Type1 outlines | TeX Live 2020 (`amsfonts`) |
| `11/` | `pdftex.map` — generated: one line per shipped `.pfb`, PS name = uppercase basename | generated locally |

One exception: `26/l3backend-pdfmode.def` comes from TeX Live **2019** —
the format's L3 layer (2020-02-14) predates the file's rename to
`l3backend-pdftex.def`, so the older file is required.

Packages were chosen to cover the CV template's preamble
(`geometry`, `hyperref` + its dependency tree, `enumitem`, `parskip`,
`titlesec`, `inputenc`) with the era matching the format's kernel. If a future
template change needs another package, grab it from
`https://ftp.tu-chemnitz.de/pub/tug/historic/systems/texlive/2020/tlnet-final/archive/{pkg}.tar.xz`
and drop the runtime files into the matching directory (watch the dev-server
404 log to see exactly which files the engine asks for).

Note: the template avoids TS1 (text-companion) glyphs — e.g. bullets are
`$\bullet$` — so the huge `cm-super` font set is not needed. Keep it that way.

Why self-hosted: SwiftLaTeX's own package mirror (`texlive2.swiftlatex.com`)
is dead (checked 2026-07), so the stock "fetch from CDN" mode cannot work.
