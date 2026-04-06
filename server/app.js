/**
 * Centrale Express-app zonder app.listen.
 *
 * Hierdoor kunnen we:
 * - de app normaal starten vanuit index.js
 * - dezelfde app ook in tests gebruiken via supertest
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");

const authRoutes = require("./routes/auth.routes");
const paintingRoutes = require("./routes/painting.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

const publicDirectory = path.join(__dirname, "public");
const uploadsDirectory = path.join(publicDirectory, "assets", "uploads");

if (!fs.existsSync(publicDirectory)) {
  fs.mkdirSync(publicDirectory, { recursive: true });
}

if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory, { recursive: true });
}

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: false
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDirectory));

app.get("/", (_req, res) => {
  res.send("API running...");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/paintings", paintingRoutes);
app.use("/api/users", userRoutes);

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

module.exports = app;