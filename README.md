# Nevil's Gallery 2026

Een modern vormgegeven webapplicatie voor het beheren en bekijken van schilderijen uit een persoonlijke collectie.

**GitHub:** [github.com/NevilDouglas/nevils-gallery-2026](https://github.com/NevilDouglas/nevils-gallery-2026)

---

## Technologie

### Frontend
- React 18
- Vite
- React Router

### Backend
- Node.js + Express
- Sequelize ORM
- PostgreSQL
- JWT-authenticatie
- Multer (afbeeldingsuploads)
- Swagger (API-documentatie)

---

## Projectstructuur

```
nevils-gallery-2026/
├── client/          # React frontend (Vite)
├── server/          # Express backend
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── public/      # Statische bestanden & uploads
│   └── index.js
├── Procfile         # Heroku startcommando
├── package.json     # Root build-script voor Heroku
└── README.md
```

---

## Lokale installatie

### 1. Backend

```bash
cd server
npm install
```

Maak een `.env` bestand aan in de `server/` map:

```env
PORT=4000
DB_NAME=db_nevils_gallery
DB_USER=postgres
DB_PASSWORD=jouwwachtwoord
DB_HOST=localhost
JWT_SECRET=eensterkgeheim
```

### 2. Frontend

```bash
cd client
npm install
```

Maak een `.env` bestand aan in de `client/` map:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

---

## Database setup

Zorg dat PostgreSQL draait op poort **5432** en maak een database aan:

```sql
CREATE DATABASE db_nevils_gallery;
```

Importeer de initiële data:

```bash
psql -U postgres -d db_nevils_gallery -f server/database.sql
```

---

## Starten

### Backend

```bash
cd server
npm run dev
```

### Frontend

```bash
cd client
npm run dev
```

De app is bereikbaar op `http://localhost:5173`.

---

## API-documentatie

Swagger UI is beschikbaar op:

```
http://localhost:4000/api-docs
```

---

## Inloggen

| Veld     | Waarde              |
|----------|---------------------|
| E-mail   | admin@example.com   |
| Wachtwoord | passwordadmin     |

---

## Deployment (Heroku)

De app is geconfigureerd voor deployment als één Heroku-app. De Express-server serveert zowel de API als de gebouwde React-frontend.

```bash
heroku create <app-naam>
heroku addons:create heroku-postgresql:essential-0
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=<sterk_geheim>
heroku config:set VITE_API_BASE_URL=/api
git push heroku main
```

> Geüploade afbeeldingen worden opgeslagen in `server/public/assets/uploads/`. Op Heroku gaan deze verloren bij een nieuwe deploy (ephemeral filesystem).

---

## Ontwerpkeuzes

- De PostgreSQL-database blijft ongewijzigd ten opzichte van de vorige versie.
- De applicatie sluit aan op de bestaande tabellen `schema_nevils_gallery.users` en `schema_nevils_gallery.paintings`.
- De kolom `image` bevat relatieve paden (tekstkolom).
- Nieuwe uploads worden opgeslagen onder `server/public/assets/uploads/`.
