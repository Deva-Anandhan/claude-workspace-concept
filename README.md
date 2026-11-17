# Claude Workspace: an unofficial concept

What if a company ran by asking? This repository holds an independent concept of an agent with its own identity, keys, browser, mail and wallet, so that a person asks, approves, and the work gets done.

**This is not an Anthropic product.** It is a thought experiment. None of the products shown exist, and it is not made, endorsed or announced by Anthropic. Claude is a trademark of Anthropic.

## What is here

- `index.html`: the landing page that explains the idea.
- `app/`: a clickable front-end demo with five areas: Chat, Mail, Bots, Browser and Settings.

The demo is plain HTML, CSS and JavaScript with no build step and no backend. Its AI responses are scripted. Larkfield and every person, vendor, price and message in it are invented.

## Run it locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. The app is designed for a desktop-width window.
