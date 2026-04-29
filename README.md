# TNKS! — Menu digitale

Slideshow da proiettare con il menu del locale, generato da file Markdown e gestito tramite CMS.

---

## Struttura del progetto

```
tnks_web/
├── index.html          # Slideshow frontend (3 slide)
├── build.js            # Script che genera data.json dai file Markdown
├── data.json           # Dati del menu (generato automaticamente)
├── netlify.toml        # Config build per Netlify
├── content/
│   ├── birre/          # Un file .md per ogni birra
│   ├── piatti/         # Un file .md per ogni piatto
│   ├── vini/           # Un file .md per ogni vino
│   └── bevande/        # Un file .md per ogni bevanda
├── static/
│   ├── admin/          # Pannello CMS (Sveltia CMS)
│   │   ├── index.html
│   │   └── config.yml
│   └── bg/             # Immagini di sfondo (bg1.jpg, bg2.jpg, bg3.jpg)
└── assets/
    └── read_pptx.py    # Utilità per importare da PowerPoint
```

---

## Sviluppo locale

### 1. Genera i dati del menu

```bash
node build.js
```

### 2. Avvia un server locale

```bash
npx serve .
```

Il sito è disponibile su [http://localhost:3000](http://localhost:3000).

---

## Usare il CMS in locale

Il CMS (Sveltia CMS) permette di modificare birre, piatti, vini e bevande senza toccare i file a mano.

### Prerequisiti

Avere `local_backend: true` nel file [static/admin/config.yml](static/admin/config.yml) (già abilitato per sviluppo locale).

### Avvio

Apri **due terminali separati**:

**Terminale 1 — proxy server** (scrive sui file locali):
```bash
npx netlify-cms-proxy-server
```

**Terminale 2 — server statico**:
```bash
npx serve .
```

Poi apri: [http://localhost:3000/static/admin/](http://localhost:3000/static/admin/)

> Prima di fare commit/deploy, ricommentare `local_backend` nel `config.yml`:
> ```yaml
> # local_backend: true
> ```

---

## Deploy su Netlify

Il deploy avviene automaticamente ad ogni push sul branch `main`.

Netlify esegue `node build.js` (configurato in `netlify.toml`) e pubblica la cartella radice.

### Configurazione necessaria (una tantum)

Nel file `static/admin/config.yml` impostare il proprio repo GitHub:

```yaml
backend:
  name: github
  repo: owner/nome-repo   # ← sostituire
  branch: main
```

Per l'autenticazione GitHub usare [Sveltia CMS Auth](https://github.com/sveltia/sveltia-cms-auth) oppure il servizio già configurato:
```yaml
base_url: https://sveltia-cms-auth.netlify.app
```

---

## Aggiungere contenuti

Ogni elemento del menu è un file `.md` con frontmatter YAML. Esempio birra:

```markdown
---
nome: Diana Blanche
stile: Blanche
gradazione: 5,0%
birrificio: Birrificio Esempio
categoria: tap
prezzo_piccolo: 5
ordine: 3
---
```

I campi disponibili sono definiti in `static/admin/config.yml` per ogni collezione.

Dopo aver modificato i file, rieseguire `node build.js` per aggiornare `data.json`.
