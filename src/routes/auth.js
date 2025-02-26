const express = require("express");
const router = express.Router();
const {
register,
login,
forgotPassword,
resetPassword,
} = require("../controllers/authController");

// src/routes/auth.js
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Faz login do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 */
// src/routes/auth.js
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Faz cadastro do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cadastro bem-sucedido
 */
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

module.exports = router;