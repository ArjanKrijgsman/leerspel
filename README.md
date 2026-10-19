# Leerspel

Leerspel voor een kind van 5: tellen en klanken oefenen met Olli de uil, in de stijl "Vrolijk plat".
Het is een web-app (PWA) zonder bouwstap: gewone HTML, CSS en JavaScript-modules in `app/`.

## Lokaal starten

```bash
py -m http.server 8123 --directory app
```

Open daarna http://localhost:8123.

## Mappen

- `app/` – de app zelf (dit is wat er online komt)
  - `js/main.js` – schermen, navigatie, ouderhoek
  - `js/games/` – één bestand per minigame
  - `js/progress.js` – voortgang, niveaus, stickers (lokaal opgeslagen)
  - `js/art.js` – alle tekeningen als SVG
  - `sw.js` – offline werken
- `prototype/stijlproef.html` – de stijlvergelijking waaruit "Vrolijk plat" is gekozen
- `tools/make_icons.py` – maakt de PNG-app-iconen opnieuw

## Op de iPad

Installeren als app en offline werken kan alleen via https. Zet de map `app/` daarvoor op
een gratis host (bijvoorbeeld GitHub Pages of Netlify), open de link in Safari en kies
Delen > Zet op beginscherm.

## Een minigame toevoegen

Maak een bestand in `js/games/` dat een functie exporteert die `{ stage(), click(el) }` teruggeeft
(zie `tellen.js`), en voeg het toe aan `GAMES` in `js/main.js` en aan `SHELL` in `sw.js`.
