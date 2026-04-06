/**
 * Centrale databaseverbinding via Sequelize.
 *
 * Ondersteunt:
 * - DATABASE_URL (voor Heroku / deployment)
 * - DB_* variabelen (voor lokale development)
 *
 * Belangrijk:
 * - Wijzig niets aan de database zelf
 * - Alleen connectieconfiguratie
 */

const { Sequelize } = require("sequelize");

// Zorg dat .env ALTIJD geladen wordt (ook als db.js direct gebruikt wordt)
require("dotenv").config();

let sequelize;

/**
 * ============================================================
 * PRIORITEIT 1: DATABASE_URL (deployment / Heroku)
 * ============================================================
 */
console.log("DATABASE_URL aanwezig:", Boolean(process.env.DATABASE_URL));

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl:
        process.env.NODE_ENV === "production"
          ? { require: true, rejectUnauthorized: false }
          : false
    }
  });

  console.log("🌍 Database via DATABASE_URL");
} else {
  /**
   * ============================================================
   * PRIORITEIT 2: Lokale configuratie
   * ============================================================
   */
  sequelize = new Sequelize(
    process.env.DB_DATABASE || process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: "postgres",
      logging: false
    }
  );

  console.log("💻 Database via lokale config");
}

module.exports = sequelize;