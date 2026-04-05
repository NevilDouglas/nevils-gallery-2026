/**
 * Auth-routes.
 *
 * Deze route verzorgt voorlopig alleen login.
 * JWT bevat het user-id en admin-veld, zodat de frontend
 * kan bepalen welke onderdelen zichtbaar mogen zijn.
 */

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in met username en password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login gelukt
 *       401:
 *         description: Ongeldige login
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required"
      });
    }

    const user = await User.findOne({
      where: { username }
    });

    if (!user) {
      return res.status(401).json({
        error: "User not found"
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        error: "Wrong password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        admin: user.admin
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({ token });
  } catch (error) {
    console.error("POST /auth/login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;