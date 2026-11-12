# Sahir Portfolio

Dark / crimson single-page portfolio (Hero, About, Flagships with 7-layer inspector, Systems Matrix with filters, Contact) plus a small Express API that stores contact-form messages.

## Run
```bash
cd sahir-portfolio
npm install
npm start
# open http://localhost:3000
```
Requires Node 18+. Messages sent from the "Dispatch" form are saved to `data/messages.json`.

Without Node: open `public/index.html` directly. Everything works except saving messages (the form falls back to your email client).

## Test checklist
- Nav links scroll to sections and highlight on scroll; the menu button works on phones.
- DISPATCH / INITIATE DISPATCH open the form. Try invalid input, then a valid message and check `data/messages.json`.
- Click each of the 7 layer tabs; click each Systems Matrix filter.
- "Copy Email Address" copies founder@saai.pro. "Touring" auto-scrolls the sections.
- Resize to ~390px (phone), ~820px (tablet) and desktop.

## Structure
```
server.js          Express server + /api/contact
data/              saved messages
public/index.html  markup
public/css/style.css
public/js/main.js  tabs, filters, modal, cursor swarm
```
Replace the SVG placeholder in `index.html` (`.portrait`) with your own photo via an `<img>`.
