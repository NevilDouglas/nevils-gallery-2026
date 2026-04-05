/**
 * Hoofdbestand van de Express-backend.
 *
 * Verantwoordelijkheden:
 * - laden van environment variables
 * - beveiligen van de app met helmet/cors
 * - serveren van statische assets (bestaande schilderijen + uploads)
 * - registreren van routes
 * - aanbieden van Swagger-documentatie
 * - centrale foutafhandeling
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");
const swaggerUi = require("swagger-ui-express");

const sequelize = require("./db");
const swaggerSpec = require("./config/swagger");

const authRoutes = require("./routes/auth.routes");
const paintingRoutes = require("./routes/painting.routes");
const userRoutes = require("./routes/user.routes");

const app = express();
const port = process.env.PORT || 4000;

/**
 * Root van publieke bestanden.
 *
 * Hierin komen:
 * - bestaande schilderijafbeeldingen uit het oude project
 * - nieuwe uploads via multer
 */
const publicDirectory = path.join(__dirname, "public");
const uploadsDirectory = path.join(publicDirectory, "assets", "uploads");

/**
 * Zorgt ervoor dat de nodige publieke mappen bestaan.
 */
if (!fs.existsSync(publicDirectory)) {
  fs.mkdirSync(publicDirectory, { recursive: true });
}

if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory, { recursive: true });
}

/**
 * Helmet beveiligt standaard response headers.
 *
 * crossOriginResourcePolicy staat uit, zodat afbeeldingen
 * ook probleemloos in de frontend kunnen worden weergegeven.
 */
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

/**
 * CORS voor lokale ontwikkeling.
 * Voeg later je productie-URL toe zodra je deployt.
 */
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: false
  })
);

/**
 * JSON en urlencoded body parsing.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Serveer publieke assets:
 * - bestaande schilderijen onder /assets/img/...
 * - uploads onder /assets/uploads/...
 */
app.use(express.static(publicDirectory));

/**
 * Simpele health check.
 */
app.get("/", (_req, res) => {
  res.send("API running...");
});

/**
 * Swagger UI op /api-docs
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * API-routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/paintings", paintingRoutes);
app.use("/api/users", userRoutes);

/**
 * Centrale foutafhandeling.
 *
 * Hiermee voorkomen we dat de hele server bij veel routefouten omvalt.
 */
app.use((err, _req, res, _next) => {
  console.error("Unhandled server error:", err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      error: "Bestand is te groot. Maximale grootte is 5 MB."
    });
  }

  if (err.message?.includes("Only JPG, PNG, WEBP and GIF")) {
    return res.status(400).json({ error: err.message });
  }

  return res.status(500).json({
    error: "Internal server error"
  });
});

/**
 * Eerst databaseverbinding testen, daarna pas server starten.
 */
sequelize
  .authenticate()
  .then(() => {
    console.log("DB connected");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });

/**
 * Extra logging voor onverwachte fouten.
 */
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});