const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getHabits,
  createHabit,
  updateHabitProgress,
  deleteHabit,
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
 *           enum: ['Saúde', 'Trabalho', 'Lazer', 'Estudo', 'Outros']
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
 *         weeklyMeta:
 *           type: number
 *           minimum: 1
 *           maximum: 7
 *           description: Número de dias por semana que o usuário pretende fazer o hábito (opcional)
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
 *               streak:
 *                 type: number
 *               frequency:
 *                 type: number
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
 *                 enum: ['Saúde', 'Trabalho', 'Lazer', 'Estudo', 'Outros']
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
 *               weeklyMeta:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 7
 *                 description: Número de dias por semana que o usuário pretende fazer o hábito (opcional)
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
 *     description: Atualiza o progresso de um hábito, incluindo streak e frequência. Para hábitos 'Todo dia', a frequência é obrigatória.
 *     tags: [Hábitos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: ID do hábito
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - completed
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Data do progresso (opcional, usa data atual se não fornecida)
 *               completed:
 *                 type: boolean
 *                 description: Status de conclusão do hábito
 *               frequency:
 *                 type: number
 *                 description: Frequência do hábito (obrigatório para hábitos 'Todo dia')
 *     responses:
 *       200:
 *         description: Progresso atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habit'
 *       400:
 *         description: Erro na requisição - Frequência não fornecida para hábito 'Todo dia' ou outros erros de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Para hábitos 'Todo dia', a frequência é obrigatória
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Hábito não encontrado
 */
router.put('/:id/progress', protect, updateHabitProgress);

/**
 * @swagger
 * /api/habits/{id}:
 *   delete:
 *     summary: Deletar um hábito específico
 *     description: Remove um hábito do usuário autenticado. O usuário só pode deletar seus próprios hábitos.
 *     tags: [Hábitos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: ID do hábito a ser deletado
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Hábito deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hábito deletado com sucesso
 *                   description: Mensagem de confirmação da operação
 *       401:
 *         description: Não autorizado - Token JWT inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Acesso não autorizado
 *       404:
 *         description: Hábito não encontrado ou não pertence ao usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hábito não encontrado ou não pertence ao usuário
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao deletar o hábito
 */
router.delete('/:id', protect, deleteHabit);

module.exports = router;