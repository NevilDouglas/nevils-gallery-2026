/**
 * Swagger-configuratie voor de API-documentatie.
 *
 * Doel:
 * - Een eenvoudige OpenAPI-documentatie beschikbaar maken tijdens ontwikkeling.
 * - Routes kunnen later verder worden uitgebreid met @swagger JSDoc-blokken.
 */

const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nevil's Gallery API",
      version: "1.0.0",
      description: "REST API voor Nevil's Gallery met auth, paintings en users."
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Lokale ontwikkelserver"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["./routes/*.js"]
};

module.exports = swaggerJSDoc(options);