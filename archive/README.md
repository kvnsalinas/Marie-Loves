# Archive

Nothing in here is loaded by the live site. It is kept, not deleted.

## `pages/`

Four finished anniversary sub-experiences that work but were never linked from
anywhere — `index.html` had no route to them, so visitors could not reach them:

| File | What it is |
|---|---|
| `anniversary-gallery.html`  | "The Gallery 🖼️" |
| `anniversary-letter.html`   | "A Love Letter 💌" |
| `anniversary-scrapbook.html`| "Our Scrapbook 📔" |
| `anniversary-stars.html`    | "Starry Night 🌌" |

**Their asset paths are relative to the repo root** (`images/…`, `2nd anniv/…`),
so opening them from inside `archive/pages/` shows the layout without images or
music. To bring one back to life, move it to the repo root and add an entry to
`js/occasions.js` — that's all the wiring it needs.

## `audio/`

Two songs no page ever referenced. Candidates for a future occasion page.

## `images/`

- `mariebg.png`, `hug.gif`, `hmp.png`, `mariewalk.png`, `mariepixel.png`, `cina.png`
  — unreferenced by any live page.
- `bloopers.jpg`, `candid.jpg`, `flowers.jpg`, `horse.jpg`, `morning.jpg`
  — byte-identical duplicates of `images/photo16/15/14/18/17.jpg`, which are the
  copies the gallery actually uses. Verified with `md5sum` before moving.

## `resume.py`

A PDF resume generator. Unrelated to this website; it was just sitting in the repo root.

---

## What was deleted outright (recoverable via `git log`)

- `anniversary-backup.html`, `anniversary-cinema.html` — byte-identical to `anniversary.html`
- `message.html`, `message-new.html`, `message-backup.html` — orphaned; pointed at the dead `index-new.html`
- `index-backup.html`, `index-new.html`, `index-old-backup.html`, `index-v2.html` — superseded generations
- `surprise-backup.html`, `surprise-new.html` — orphaned copies
- `style.css` — 1381 dead lines; only the deleted backups linked it
- 12 zero-byte `.md` stubs and a 12-byte file named `wow`
- `send-coupon.php`, `composer.json`, `composer.lock`, `vendor/` — PHP cannot run on
  GitHub Pages, so this never worked in production. It also contained a plaintext
  Gmail app password. **That credential is still in git history — rotate it.**
