/**
 * Sequelize-model voor de tabel:
 * schema_nevils_gallery.paintings
 *
 * Dit model sluit aan op de bestaande databasekolommen:
 * - id
 * - image
 * - title
 * - artist
 * - ranking
 * - description
 * - ownerid
 * - altText
 *
 * Belangrijk:
 * - image blijft een gewone tekstkolom
 * - daarin kunnen zowel bestaande relatieve paden als nieuwe uploadpaden staan
 * - de database-structuur blijft dus intact
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Painting = sequelize.define(
  "Painting",
  {
    /**
     * Primaire sleutel.
     */
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },

    /**
     * Pad of URL naar de afbeelding.
     *
     * In deze applicatie gebruiken we bij voorkeur relatieve paden,
     * bijvoorbeeld:
     * - /assets/img/initials/The_Mona_Lisa.jpg
     * - /assets/uploads/1719999999999-custom.jpg
     */
    image: {
      type: DataTypes.STRING
    },

    /**
     * Titel van het schilderij.
     */
    title: {
      type: DataTypes.STRING
    },

    /**
     * Naam van de kunstenaar.
     */
    artist: {
      type: DataTypes.STRING
    },

    /**
     * Sorteer-/rankingveld.
     *
     * In de bestaande database is dit een tekstveld.
     */
    ranking: {
      type: DataTypes.STRING
    },

    /**
     * Beschrijving van het schilderij.
     */
    description: {
      type: DataTypes.TEXT
    },

    /**
     * Foreign key naar users.id.
     *
     * Deze kolom is optioneel.
     */
    ownerid: {
      type: DataTypes.UUID,
      allowNull: true
    },

    /**
     * Alt-tekst voor toegankelijkheid.
     *
     * Let op:
     * In PostgreSQL heet deze kolom letterlijk "altText".
     */
    altText: {
      type: DataTypes.STRING,
      field: "altText"
    }
  },
  {
    tableName: "paintings",
    schema: "schema_nevils_gallery",
    timestamps: false
  }
);

module.exports = Painting;