const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getHabits,
  createHabit,
  updateHabitProgress,
} = require('../controllers/habitsController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Habit:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do hábito
 *         description:
 *           type: string
 *           description: Descrição detalhada do hábito (opcional)
 *         category:
 *           type: string
 *           enum: ['Saúde', 'Trabalho', 'Lazer, Estudo', 'Outros']
 *           default: 'Outros'
 *           description: Categoria do hábito
 *         frequency:
 *           type: string
 *           enum: ['Diário', 'Semanal', 'Todo dia']
 *           default: 'Diário'
 *           description: Frequência do hábito
 *         meta:
 *           type: number
 *           minimum: 1
 *           description: Meta de vezes que o hábito deve ser completado (opcional)
 *         progress:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               completed:
 *                 type: boolean
 */

/**
 * @swagger
 * /api/habits:
 *   post:
 *     summary: Criar novo hábito
 *     tags: [Hábitos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do hábito
 *               description:
 *                 type: string
 *                 description: Descrição detalhada do hábito (opcional)
 *               category:
 *                 type: string
 *                 enum: ['Saúde', 'Trabalho', 'Lazer, Estudo', 'Outros']
 *                 default: 'Outros'
 *                 description: Categoria do hábito
 *               frequency:
 *                 type: string
 *                 enum: ['Diário', 'Semanal', 'Todo dia']
 *                 default: 'Diário'
 *                 description: Frequência do hábito
 *               meta:
 *                 type: number
 *                 minimum: 1
 *                 description: Meta de vezes que o hábito deve ser completado (opcional)
 *     responses:
 *       201:
 *         description: Hábito criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habit'
 *       400:
 *         description: Erro na requisição - Campos inválidos ou faltando
 *       401:
 *         description: Não autorizado
 */
router.post('/', protect, createHabit);

/**
 * @swagger
 * /api/habits:
 *   get:
 *     summary: Listar todos os hábitos do usuário
 *     tags: [Hábitos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de hábitos recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Habit'
 *       401:
 *         description: Não autorizado
 */
router.get('/', protect, getHabits);

/**
 * @swagger
 * /api/habits/{id}/progress:
 *   put:
 *     summary: Atualizar progresso de um hábito
 *     tags: [Hábitos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do hábito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - completed
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Data do progresso
 *               completed:
 *                 type: boolean
 *                 description: Status de conclusão do hábito
 *     responses:
 *       200:
 *         description: Progresso atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habit'
 *       400:
 *         description: Erro na requisição
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Hábito não encontrado
 */
router.put('/:id/progress', protect, updateHabitProgress);

module.exports = router;