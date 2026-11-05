# Portrait screenshot

`record.mjs` records the animated portrait at the top of the WeClone README. It builds the WeClone web UI with `screenshot.patch` in a temporary worktree of a WeClone checkout, serves it there with the synthetic demo portrait, and steps the map through one wave cycle in headless Chrome into a WebP that loops without a seam. The checkout itself is left untouched, and the same checkout always gives the same picture.

```sh
node scripts/portrait-screenshot/record.mjs ~/WeClone docs/public/img/screenshots/atlas-light-en.webp
node scripts/portrait-screenshot/record.mjs ~/WeClone docs/public/img/screenshots/atlas-dark.webp --locale zh-CN --theme dark
```

The pictures are `docs/public/img/screenshots/atlas-{light,dark}{,-en}.webp`, with `-en` for English. `--still` writes a PNG instead.

The script needs:

- Node 22 or later
- the checkout's web dependencies (`pnpm --dir web install`)
- WeClone's Python environment (set `PYTHON` when `python3` is not its interpreter)
- Chrome or chrome-headless-shell (set `CHROME` when neither is on `PATH`)
- ffmpeg with libwebp

## The patch

With the patch, `?screenshot` in the address shows the map alone and skips the intro, laid out with its labels in heavier, larger type. `labels` then draws the labels that many times their size without moving the nodes. It also exposes `window.atlasCapture`, through which the script frames the map, draws other names on its nodes and steps it frame by frame. It is kept here so that none of it reaches the app.

The script serves the English demo portrait of the WeClone revision `--layout`, whose map the first published picture showed, opens it in English and frames it as that picture did. It then draws the root and the dimensions with their names in `--locale`, and each dimension's children with the names of the checkout's demo in that language as it is on disk, committed or not, the child with the most facts with the name of the one with the most facts now, and so on down. Every language so shows the same picture, which keeps its layout, sizes and halos when the demo changes; only the names follow it. Chinese labels are drawn 0.9 times as large, as Han characters fill their em box and would otherwise look larger than English.

## The showcase portrait

`showcase.py` writes a portrait for screenshots only: 75 sections under the dimensions, each a life area seen from its dimension rather than a single attribute or event, and each under one dimension only, so no name repeats on the map. The sections are listed at the top of the file in Chinese and English; below them are placeholder facts that only give the nodes their sizes, lines and halos. With `--names showcase` the script draws its names on the map of the `--layout` demo as above, with `--showcase` it lays the map out from this portrait instead, drawn smaller to fit:

```sh
node scripts/portrait-screenshot/record.mjs ~/WeClone atlas-showcase-en.webp --showcase
```

To look at it in the browser, serve it like `weclone-cli server --demo` (password `demo`) with WeClone's Python environment:

```sh
python scripts/portrait-screenshot/showcase.py ~/WeClone --serve zh --port 5175
```

When the patch no longer applies to WeClone, apply it in a worktree, resolve the conflicts and write it back:

```sh
git -C ~/WeClone worktree add --detach /tmp/weclone-screenshot
git -C /tmp/weclone-screenshot apply --3way "$PWD/scripts/portrait-screenshot/screenshot.patch"
# resolve the conflicts in /tmp/weclone-screenshot/web/src, then:
git -C /tmp/weclone-screenshot add web/src
git -C /tmp/weclone-screenshot diff --cached --full-index HEAD -- web/src > scripts/portrait-screenshot/screenshot.patch
git -C ~/WeClone worktree remove --force /tmp/weclone-screenshot
```
