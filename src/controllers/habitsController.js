const Habit = require('../models/habits');

// Buscar hábitos
exports.getHabits = async (req, res) => {
  try {
    // Buscar apenas os hábitos do usuário autenticado
    const habits = await Habit.find({ user: req.user._id });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Criar hábito
exports.createHabit = async (req, res) => {
  const { name, description, category, frequency, meta } = req.body;

  try {
    // Validar campos obrigatórios
    if (!name) {
      return res.status(400).json({ 
        message: "Nome é um campo obrigatório" 
      });
    }

    // Validar meta se fornecida
    if (meta !== undefined && meta < 1) {
      return res.status(400).json({ 
        message: "A meta, quando fornecida, deve ser maior que zero" 
      });
    }

    // Criar o hábito com todos os campos
    const habit = await Habit.create({
      name,
      ...(description && { description }), // Só inclui descrição se foi fornecida
      category,
      frequency,
      ...(meta && { meta }), // Só inclui meta se foi fornecida
      user: req.user._id
    });

    res.status(201).json(habit);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Erro de validação", 
        details: error.message 
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// Atualizar progresso
exports.updateHabitProgress = async (req, res) => {
  const { id } = req.params;
  const { date, completed } = req.body;

  try {
    // Verificar se o hábito pertence ao usuário
    const habit = await Habit.findOne({ _id: id, user: req.user._id });
    
    if (!habit) {
      return res.status(404).json({ message: "Hábito não encontrado ou não pertence ao usuário" });
    }

    habit.progress.push({ date, completed });
    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};