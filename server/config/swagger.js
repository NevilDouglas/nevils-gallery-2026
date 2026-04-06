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
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Request failed"
            }
          }
        },
        SuccessMessageResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Operation completed successfully"
            }
          }
        },
        LoginRequest: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: {
              type: "string",
              example: "admin@example.com"
            },
            password: {
              type: "string",
              example: "SecretPassword123"
            }
          }
        },
        LoginResponse: {
          type: "object",
          properties: {
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
          }
        },
        Painting: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid"
            },
            image: {
              type: "string",
              example: "/assets/img/initials/The_Mona_Lisa.jpg"
            },
            title: {
              type: "string",
              example: "The Mona Lisa"
            },
            artist: {
              type: "string",
              example: "Leonardo da Vinci"
            },
            ranking: {
              type: "string",
              example: "1"
            },
            description: {
              type: "string",
              example: "A famous portrait painting."
            },
            ownerid: {
              type: "string",
              format: "uuid",
              nullable: true
            },
            altText: {
              type: "string",
              example: "Portrait of a woman with folded hands"
            }
          }
        },
        PaintingMultipartInput: {
          type: "object",
          required: ["title", "artist", "ranking"],
          properties: {
            title: {
              type: "string"
            },
            artist: {
              type: "string"
            },
            ranking: {
              type: "string"
            },
            description: {
              type: "string"
            },
            ownerid: {
              type: "string",
              format: "uuid"
            },
            altText: {
              type: "string"
            },
            image: {
              type: "string",
              format: "binary"
            }
          }
        },
        UserSafe: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid"
            },
            fname: {
              type: "string",
              example: "Nevil"
            },
            lname: {
              type: "string",
              example: "Douglas"
            },
            cname: {
              type: "string",
              example: "Nevil"
            },
            admin: {
              type: "string",
              example: "true"
            },
            username: {
              type: "string",
              example: "admin@example.com"
            }
          }
        },
        UserInput: {
          type: "object",
          required: ["username", "password"],
          properties: {
            fname: {
              type: "string"
            },
            lname: {
              type: "string"
            },
            cname: {
              type: "string"
            },
            admin: {
              type: "string",
              example: "false"
            },
            username: {
              type: "string",
              example: "user@example.com"
            },
            password: {
              type: "string",
              example: "SecretPassword123"
            }
          }
        }
      }
    }
  },
  apis: ["./routes/*.js"]
};

module.exports = swaggerJSDoc(options);