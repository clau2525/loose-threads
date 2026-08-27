# Loose Threads — two-file build

`index.html` is the whole app: markup, styling, logic, icons and manifest, all inline.
`sw.js` is the service worker. It has to be its own file — that's a browser rule, not a choice.
`schema.sql` is only needed if you later want your phone and laptop to share one pile.

Offline-tested: with the network fully cut, a cold load makes **one** request, and it's answered from the cache.

---

## Put it on GitHub Pages

```sh
cd loose-threads
git init && git add -A && git commit -m "Loose Threads"
gh repo create loose-threads --public --source=. --push
```

Then: repo → **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**. A minute later you're live at:

```
https://<your-username>.github.io/loose-threads/
```

The repo can be private on a paid plan; on a free plan Pages needs it public. That's fine — the code is public, your thoughts never are. They live in your browser's storage, and (if you turn on sync) in your own Supabase project behind row-level security. Nothing you write is ever in the repo.

Open the URL once with a connection so the service worker installs. Check `•••` → "Offline copy: ready — opens with no signal". After that you can be anywhere.

**When you change something:** bump `CACHE` in `sw.js` (`lt-1` → `lt-2`) before pushing, or browsers keep serving the cached copy.

---

## The capture URL

Everything below is built on one thing — the app captures straight from a URL:

```
https://<you>.github.io/loose-threads/#add=buy%20stamps
```

It saves the text, clears the URL, says "Caught it." Works offline, and works whether the app is already open or not.

---

## iPhone

Build the shortcut once, then attach it wherever you like:

**Shortcuts → + → name it `Dump`**
1. **Ask for Input** — Text, prompt: "what came to mind?"
2. **URL Encode** — input: Provided Input
3. **Text** — `https://<you>.github.io/loose-threads/#add=` then the URL-Encoded variable
4. **Open URLs** — input: that Text

Now pick your triggers (you can use several at once):

| Where | How | Feels like |
|---|---|---|
| **Lock Screen widget** | Long-press Lock Screen → Customize → add Shortcuts widget → Dump | Tap, type, done |
| **Action Button** | Settings → Action Button → Shortcut → Dump | Squeeze, type — fastest |
| **Control Centre** | Swipe down → edit → add a Shortcut control | Always two swipes away |
| **Back Tap** | Settings → Accessibility → Touch → Back Tap → Double Tap → Dump | Tap the back of the phone without looking |
| **"Hey Siri, Dump"** | Works automatically — the shortcut's name is the phrase | Hands-free, walking, cooking |
| **Home Screen icon** | Safari → Share → Add to Home Screen | Opens the app itself |
| **Share sheet** | Add "Receive text and URLs from Share Sheet" to the shortcut | Catch links from other apps |

Siri and Back Tap are worth setting up even if the widget is your main route — they're the ones that work when your hands are full, which is often exactly when a thought arrives.

> **The iOS quirk:** every URL route above opens **Safari**. If you also Add to Home Screen, iOS gives that copy its own separate storage, so you'd end up with two piles. Pick one — Safari alone works offline just as well — or turn on syncing so both land in the same place.

---

## Mac

| Option | How | Notes |
|---|---|---|
| **Raycast Quicklink** | New Quicklink → URL: `https://<you>.github.io/loose-threads/#add={argument name="thought"}` → assign a hotkey | Best. Type the thought into Raycast itself; never look at the browser |
| **Spotlight** | Make the same shortcut in Shortcuts.app | ⌘Space, "dump", Enter. Free, nothing to install |
| **Shortcuts hotkey** | Shortcuts.app → shortcut details → Add Keyboard Shortcut | Built-in global hotkey |
| **Menu bar** | Shortcuts.app → details → Pin in Menu Bar | Always visible, one click |
| **A real app window** | Safari → File → Add to Dock | The field takes focus whenever the window comes forward |

For the Mac shortcut, the same four actions as iPhone work — Shortcuts is the same app on both.

The combination I'd start with: **Raycast hotkey on the laptop, Action Button or Back Tap on the phone.** Both put a thought in the pile in under two seconds without breaking what you were doing, which is the whole point.
