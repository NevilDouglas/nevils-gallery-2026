/**
 * Routes voor paintings.
 *
 * Belangrijke ontwerpkeuzes:
 * - bestaande schilderijen met bestaande image-paden moeten blijven werken;
 * - nieuwe uploads worden via multer opgeslagen onder /assets/uploads/...;
 * - in de database bewaren we alleen het relatieve pad;
 * - als een painting wordt verwijderd of vervangen, ruimen we geüploade bestanden op.
 */

const express = require("express");
const fs = require("fs");
const path = require("path");
const Painting = require("../models/Painting");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

/**
 * Hulpfunctie om geüploade bestanden weer op te ruimen.
 *
 * We verwijderen alleen bestanden uit /assets/uploads.
 * Oude originele assets in /assets/img laten we bewust met rust.
 */
function deleteUploadedFileIfExists(relativePath) {
  if (!relativePath || !relativePath.startsWith("/assets/uploads/")) {
    return;
  }

  const fileName = relativePath.replace("/assets/uploads/", "");
  const absolutePath = path.join(__dirname, "..", "public", "assets", "uploads", fileName);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
}

/**
 * Bouwt een schoon payload-object op uit multipart/form-data.
 */
function buildPaintingPayload(req) {
  return {
    title: req.body.title?.trim() || "",
    artist: req.body.artist?.trim() || "",
    ranking: req.body.ranking?.trim() || "",
    description: req.body.description?.trim() || "",
    ownerid: req.body.ownerid?.trim() || null,
    altText: req.body.altText?.trim() || "",
    ...(req.file ? { image: `/assets/uploads/${req.file.filename}` } : {})
  };
}

/**
 * @swagger
 * /api/paintings:
 *   get:
 *     summary: Haal alle paintings op
 *     description: Retourneert de volledige lijst van paintings, oplopend gesorteerd op titel.
 *     tags: [Paintings]
 *     responses:
 *       200:
 *         description: Lijst van paintings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Painting'
 *       500:
 *         description: Interne serverfout
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", async (_req, res) => {
  try {
    const paintings = await Painting.findAll({
      order: [["title", "ASC"]]
    });

    return res.json(paintings);
  } catch (error) {
    console.error("GET /paintings error:", error);
    return res.status(500).json({ error: "Failed to fetch paintings" });
  }
});

/**
 * @swagger
 * /api/paintings:
 *   post:
 *     summary: Maak een painting aan
 *     description: Maakt een nieuwe painting aan. Alleen toegankelijk voor ingelogde admins.
 *     tags: [Paintings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/PaintingMultipartInput'
 *     responses:
 *       201:
 *         description: Painting aangemaakt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Painting'
 *       400:
 *         description: Ongeldige input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Niet ingelogd
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Geen admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Interne serverfout
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", requireAuth, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const payload = buildPaintingPayload(req);

    if (!payload.title || !payload.artist || !payload.ranking) {
      if (req.file) {
        deleteUploadedFileIfExists(`/assets/uploads/${req.file.filename}`);
      }

      return res.status(400).json({
        error: "Title, artist and ranking are required."
      });
    }

    const createdPainting = await Painting.create(payload);
    return res.status(201).json(createdPainting);
  } catch (error) {
    console.error("POST /paintings error:", error);

    if (req.file) {
      deleteUploadedFileIfExists(`/assets/uploads/${req.file.filename}`);
    }

    return res.status(500).json({ error: "Failed to create painting" });
  }
});

/**
 * @swagger
 * /api/paintings/{id}:
 *   put:
 *     summary: Werk een painting bij
 *     description: Werkt een bestaande painting bij. Alleen toegankelijk voor ingelogde admins.
 *     tags: [Paintings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Het id van de painting
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/PaintingMultipartInput'
 *     responses:
 *       200:
 *         description: Painting bijgewerkt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Painting'
 *       401:
 *         description: Niet ingelogd
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Geen admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Painting niet gevonden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Interne serverfout
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:id", requireAuth, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const painting = await Painting.findByPk(req.params.id);

    if (!painting) {
      if (req.file) {
        deleteUploadedFileIfExists(`/assets/uploads/${req.file.filename}`);
      }

      return res.status(404).json({ error: "Painting not found" });
    }

    const payload = buildPaintingPayload(req);

    painting.title = payload.title || painting.title;
    painting.artist = payload.artist || painting.artist;
    painting.ranking = payload.ranking || painting.ranking;
    painting.description = payload.description;
    painting.ownerid = payload.ownerid;
    painting.altText = payload.altText;

    if (payload.image) {
      deleteUploadedFileIfExists(painting.image);
      painting.image = payload.image;
    }

    await painting.save();

    return res.json(painting);
  } catch (error) {
    console.error("PUT /paintings/:id error:", error);

    if (req.file) {
      deleteUploadedFileIfExists(`/assets/uploads/${req.file.filename}`);
    }

    return res.status(500).json({ error: "Failed to update painting" });
  }
});

/**
 * @swagger
 * /api/paintings/{id}:
 *   delete:
 *     summary: Verwijder een painting
 *     description: Verwijdert een painting op basis van id. Alleen toegankelijk voor ingelogde admins.
 *     tags: [Paintings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Het id van de painting
 *     responses:
 *       200:
 *         description: Painting verwijderd
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessageResponse'
 *       401:
 *         description: Niet ingelogd
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Geen admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Painting niet gevonden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Interne serverfout
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const painting = await Painting.findByPk(req.params.id);

    if (!painting) {
      return res.status(404).json({ error: "Painting not found" });
    }

    deleteUploadedFileIfExists(painting.image);
    await painting.destroy();

    return res.json({ message: "Painting deleted successfully" });
  } catch (error) {
    console.error("DELETE /paintings/:id error:", error);
    return res.status(500).json({ error: "Failed to delete painting" });
  }
});

module.exports = router;