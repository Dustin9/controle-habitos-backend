const express = require('express');
const router = express.Router();
const {
getHabits,
createHabit,
updateHabitProgress,
} = require('../controllers/habitsController');

router.get('/', getHabits);
router.post('/', createHabit);
router.put('/:id/progress', updateHabitProgress);

module.exports = router;