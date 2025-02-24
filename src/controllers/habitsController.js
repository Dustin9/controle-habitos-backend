const Habit = require('../models/habits');

// Buscar hábitos
exports.getHabits = async (req, res) => {
try {
    const habits = await Habit.find();
    res.json(habits);
} catch (error) {
    res.status(500).json({ message: error.message });
}
};

// Criar hábito
exports.createHabit = async (req, res) => {
const { name, category, frequency } = req.body;
try {
    const habit = await Habit.create({ name, category, frequency });
    res.status(201).json(habit);
} catch (error) {
    res.status(400).json({ message: error.message });
}
};

// Atualizar progresso
exports.updateHabitProgress = async (req, res) => {
const { id } = req.params;
const { date, completed } = req.body;

try {
    const habit = await Habit.findById(id);
    habit.progress.push({ date, completed });
    await habit.save();
    res.json(habit);
} catch (error) {
    res.status(400).json({ message: error.message });
}
};