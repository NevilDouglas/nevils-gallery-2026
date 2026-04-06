/**
 * Startbestand van de backend.
 *
 * Dit bestand:
 * - laadt environment variables
 * - controleert de databaseverbinding
 * - start daarna pas de server
 */

require("dotenv").config();

const sequelize = require("./db");
const app = require("./app");

const port = process.env.PORT || 4000;

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

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});