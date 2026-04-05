/**
 * Centrale databaseverbinding via Sequelize.
 *
 * Dit bestand:
 * - leest de database-instellingen uit de environment variables
 * - maakt één gedeelde Sequelize-connectie aan
 * - exporteert die connectie zodat modellen en de server deze kunnen gebruiken
 *
 * Belangrijk:
 * - We wijzigen hiermee de database-structuur niet.
 * - We gebruiken alleen de bestaande PostgreSQL-database zoals die al is ingericht.
 */

const { Sequelize } = require("sequelize");

/**
 * Maak een Sequelize-instantie aan op basis van de .env-configuratie.
 *
 * Vereiste variabelen:
 * - DB_NAME
 * - DB_USER
 * - DB_PASSWORD
 * - DB_HOST
 */
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false
  }
);

module.exports = sequelize;