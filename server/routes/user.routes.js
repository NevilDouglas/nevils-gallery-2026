/**
 * Routes voor userbeheer.
 *
 * Opmerking:
 * - Geen afbeeldingsupload voor users, omdat de bestaande users-tabel
 *   daar geen kolom voor heeft.
 * - We houden de database dus bewust ongewijzigd.
 */

const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Haal alle users op
 *     description: Retourneert alle users zonder wachtwoordvelden. Alleen toegankelijk voor ingelogde admins.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lijst van users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserSafe'
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
router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["username", "ASC"]]
    });

    return res.json(users);
  } catch (error) {
    console.error("GET /users error:", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Maak een user aan
 *     description: Maakt een nieuwe user aan. Alleen toegankelijk voor ingelogde admins.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: User aangemaakt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSafe'
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
 *       409:
 *         description: Username bestaat al
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
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { fname, lname, cname, admin, username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required"
      });
    }

    const existingUser = await User.findOne({
      where: { username }
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Username already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fname: fname || "",
      lname: lname || "",
      cname: cname || "",
      admin: admin === "true" ? "true" : "false",
      username,
      password: hashedPassword
    });

    const safeUser = user.toJSON();
    delete safeUser.password;

    return res.status(201).json(safeUser);
  } catch (error) {
    console.error("POST /users error:", error);
    return res.status(500).json({ error: "Failed to create user" });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Werk een user bij
 *     description: Werkt een bestaande user bij. Alleen toegankelijk voor ingelogde admins.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Het id van de user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: User bijgewerkt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSafe'
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
 *         description: User niet gevonden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Username bestaat al
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
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { fname, lname, cname, admin, username, password } = req.body;

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });

      if (existingUser) {
        return res.status(409).json({
          error: "Username already exists"
        });
      }

      user.username = username;
    }

    user.fname = fname ?? user.fname;
    user.lname = lname ?? user.lname;
    user.cname = cname ?? user.cname;
    user.admin = admin === "true" ? "true" : "false";

    if (password && password.trim()) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    const safeUser = user.toJSON();
    delete safeUser.password;

    return res.json(safeUser);
  } catch (error) {
    console.error("PUT /users/:id error:", error);
    return res.status(500).json({ error: "Failed to update user" });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Verwijder een user
 *     description: Verwijdert een user op basis van id. Alleen toegankelijk voor ingelogde admins.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Het id van de user
 *     responses:
 *       200:
 *         description: User verwijderd
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessageResponse'
 *       400:
 *         description: Eigen account verwijderen niet toegestaan
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
 *       404:
 *         description: User niet gevonden
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
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        error: "You cannot delete your own account"
      });
    }

    const deletedCount = await User.destroy({
      where: { id: req.params.id }
    });

    if (!deletedCount) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE /users/:id error:", error);
    return res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;