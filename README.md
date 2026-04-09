# Nevil's Gallery 2026

Een modern vormgegeven webapplicatie voor het beheren en bekijken van schilderijen uit een persoonlijke collectie.

## Technologie

### Frontend
- React
- Vite
- React Router

### Backend
- Node.js
- Express
- Sequelize
- PostgreSQL
- JWT-authenticatie
- Multer voor afbeeldingsuploads
- Swagger voor API-documentatie

## Belangrijke ontwerpkeuzes (in relatie tot een vorige versie)

- De bestaande PostgreSQL-database blijft ongewijzigd.
- De applicatie sluit aan op de bestaande tabellen:
  - `schema_nevils_gallery.users`
  - `schema_nevils_gallery.paintings`
- De kolom `image` blijft een tekstkolom en bevat relatieve paden.
- Bestaande schilderijafbeeldingen blijven bruikbaar.
- Nieuwe uploads worden opgeslagen onder `server/public/assets/uploads`.

## Projectstructuur

```text
nevils-gallery-2026/
├── client/
├── server/
├── README.md
└── .gitignore


# Nevil's Gallery 2026

## Installatie

### 1. Backend installeren

```bash cd server npm install ```

### 2. Frontend installeren

```bash cd client npm install ```

---

## Database setup

### PostgreSQL installeren

Zorg dat PostgreSQL draait op poort **5432**.

### Database aanmaken

```sql **CREATE** **DATABASE** db_nevils_gallery; ```

### Database importeren

```bash psql -U postgres -d db_nevils_gallery -f server/database.sql ```

---

## Environment variabelen

Kopieer:

``` server/.env.example → server/.env ```

Vul in:

- DB_USER
- DB_PASSWORD
- JWT_SECRET

---

## Starten van de app

### Backend

```bash cd server npm run dev ```

### Frontend

```bash cd client npm run dev ```

---

## API documentatie

Swagger:

``` [http://localhost:**4000**/api-docs](http://localhost:**4000**/api-docs) ```

---

## Belangrijk

- Uploads worden lokaal opgeslagen in:

``` server/public/assets/uploads ```

- Zorg dat deze map bestaat

## Inloggen

- Username: admin@example.com
- Password: passwordadmin