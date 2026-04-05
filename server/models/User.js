/**
 * Sequelize-model voor de tabel:
 * schema_nevils_gallery.users
 *
 * Dit model sluit bewust aan op de bestaande databasekolommen:
 * - id
 * - fname
 * - lname
 * - cname
 * - admin
 * - username
 * - password
 *
 * Belangrijk:
 * - Er worden geen nieuwe kolommen toegevoegd.
 * - Er worden geen bestaande kolommen aangepast.
 * - Daardoor blijft dit model compatibel met andere applicaties
 *   die dezelfde database gebruiken.
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define(
  "User",
  {
    /**
     * Primaire sleutel.
     *
     * De database gebruikt UUID's.
     * We geven Sequelize ook een UUID-default mee, zodat inserts
     * niet mislukken wanneer er lokaal een nieuw record wordt aangemaakt.
     */
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },

    /**
     * Voornaam van de gebruiker.
     */
    fname: {
      type: DataTypes.STRING
    },

    /**
     * Achternaam van de gebruiker.
     */
    lname: {
      type: DataTypes.STRING
    },

    /**
     * Weergavenaam / roepnaam / custom naam.
     */
    cname: {
      type: DataTypes.STRING
    },

    /**
     * Adminstatus.
     *
     * Let op:
     * Deze kolom is in de bestaande database een tekstveld,
     * geen boolean. Daarom bewaren we hier "true" of "false" als string.
     */
    admin: {
      type: DataTypes.STRING,
      defaultValue: "false"
    },

    /**
     * Gebruikersnaam waarmee wordt ingelogd.
     *
     * In jouw data kan dit ook op een e-mailadres lijken,
     * maar de kolom heet in de database nog steeds 'username'.
     */
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },

    /**
     * Gehashte wachtwoordstring.
     *
     * Hier slaan we nooit een plain-text wachtwoord op.
     */
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "users",
    schema: "schema_nevils_gallery",
    timestamps: false
  }
);

module.exports = User;