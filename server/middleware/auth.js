/**
 * Authenticatie- en autorisatiemiddleware.
 *
 * Deze middleware wordt gebruikt om:
 * - te controleren of een gebruiker is ingelogd via JWT
 * - te controleren of een gebruiker adminrechten heeft
 *
 * Belangrijk:
 * - Frontend-weergave is nooit voldoende beveiliging.
 * - De backend moet altijd zelf controleren of iemand toegang heeft.
 */

const jwt = require("jsonwebtoken");

/**
 * Controleert of er een geldig Bearer-token in de request-header zit.
 *
 * Verwacht:
 * Authorization: Bearer <token>
 *
 * Bij succes:
 * - wordt req.user gevuld met de JWT-payload
 * - gaat de request verder naar de volgende middleware/route
 */
exports.requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "No token"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid token"
    });
  }
};

/**
 * Controleert of de ingelogde gebruiker admin is.
 *
 * Let op:
 * - In deze applicatie wordt admin als string opgeslagen ("true" / "false"),
 *   omdat dit zo aansluit op de bestaande database.
 */
exports.requireAdmin = (req, res, next) => {
  if (req.user.admin !== "true") {
    return res.status(403).json({
      error: "Admin only"
    });
  }

  return next();
};