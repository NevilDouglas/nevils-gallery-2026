/**
 * Multer-configuratie voor het uploaden van schilderijafbeeldingen.
 *
 * Belangrijke ontwerpkeuzes:
 * - We slaan bestanden op onder server/public/assets/uploads
 * - In de database bewaren we alleen een relatief pad, bijvoorbeeld:
 *   /assets/uploads/1719999999999-starry-night.jpg
 * - Hierdoor blijft de database host-onafhankelijk en dus beter bruikbaar
 *   voor meerdere applicaties.
 */

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(__dirname, "..", "public", "assets", "uploads");

/**
 * Zorgt ervoor dat de uploadmap bestaat voordat multer bestanden opslaat.
 */
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

/**
 * Disk storage:
 * - bestandsnaam wordt veilig opgeschoond
 * - timestamp voorkomt botsingen
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname || "").toLowerCase();

    const safeBaseName = path
      .basename(file.originalname || "painting", extension)
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 80);

    cb(null, `${Date.now()}-${safeBaseName}${extension}`);
  }
});

/**
 * Alleen afbeeldingstypen toelaten die hier functioneel relevant zijn.
 */
const fileFilter = (_req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif"
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, WEBP and GIF files are allowed."));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = upload;