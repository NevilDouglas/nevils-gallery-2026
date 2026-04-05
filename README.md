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