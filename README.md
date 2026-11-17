# Claude Workspace: an unofficial concept

An independent concept by Deva Anandhan: what if the size of your ambition was no longer limited by the size of the team you can afford?

**This is not an Anthropic product.** It is a thought experiment. None of the products shown exist, and it is not made, endorsed or announced by Anthropic. Claude is a trademark of Anthropic.

## What is here

- `index.html`: the home page.
- `essay.html`: the essay behind the idea.
- `app/`: a clickable front-end demo with five areas: Chat, Mail, Bots, Browser and Settings.

The demo is plain HTML, CSS and JavaScript with no build step and no backend. Its AI responses are scripted. Larkfield and every person, vendor, price and message in it are invented.

## Run it locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. The app is designed for a desktop-width window.
