# Vidyayan

## Translation setup (LibreTranslate)

The "Change language" / "Translate a lesson" screen calls a real translation engine — [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) — through a small local proxy, so no cloud API key or billing is needed.

```text
React frontend  →  local proxy (server/index.js)  →  LibreTranslate  →  translation
```

The frontend never calls LibreTranslate directly. That keeps things working after you deploy the site — visitors' browsers only ever talk to your proxy's URL, not to "localhost".

**1. Install and start LibreTranslate** (needs Python):

```bash
pip install libretranslate
libretranslate
```

This starts a server at `http://localhost:5000`. The first run downloads language models, so give it a minute.

**2. Install this project's dependencies** (adds the small `express`/`cors` proxy):

```bash
npm install
```

**3. Start the proxy** (in its own terminal):

```bash
npm run server
```

This listens on `http://localhost:4000` and forwards requests to LibreTranslate.

**4. Start the frontend as usual**:

```bash
npm run dev
```

Open the Translation page and translate something — it now goes through LibreTranslate for real. If you ever move LibreTranslate elsewhere, set `LIBRETRANSLATE_URL` before starting the proxy, e.g. `LIBRETRANSLATE_URL=http://localhost:5000 npm run server`.

