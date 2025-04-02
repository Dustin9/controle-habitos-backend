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
  const { name, description, category, frequency, meta, weeklyMeta } = req.body;

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

    // Validar weeklyMeta
    if (weeklyMeta !== undefined) {
      if (weeklyMeta < 1 || weeklyMeta > 7) {
        return res.status(400).json({ 
          message: "A meta semanal deve estar entre 1 e 7 dias" 
        });
      }
    }

    // Criar o hábito com todos os campos
    const habit = await Habit.create({
      name,
      ...(description && { description }), // Só inclui descrição se foi fornecida
      category,
      frequency,
      ...(meta && { meta }), // Só inclui meta se foi fornecida
      ...(weeklyMeta && { weeklyMeta }), // Só inclui weeklyMeta se foi fornecida
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
  const { date, completed, frequency } = req.body;

  try {
    // Verificar se o hábito pertence ao usuário
    const habit = await Habit.findOne({ _id: id, user: req.user._id });
    
    if (!habit) {
      return res.status(404).json({ message: "Hábito não encontrado ou não pertence ao usuário" });
    }

    // Criar novo progresso
    const newProgress = {
      date: date ? new Date(date) : new Date(),
      completed,
      streak: 0,
      frequency: 0
    };

    // Atualizar streak e frequência baseado no tipo do hábito
    if (habit.frequency === 'Todo dia') {
      // Para hábitos diários, usar a frequência fornecida
      if (frequency === undefined) {
        return res.status(400).json({ 
          message: "Para hábitos 'Todo dia', a frequência é obrigatória" 
        });
      }
      newProgress.frequency = frequency;
      // Incrementar streak por 1 para hábitos diários
      const lastProgress = habit.progress[habit.progress.length - 1];
      newProgress.streak = lastProgress ? lastProgress.streak + 1 : 1;
    } else {
      // Para outros tipos, calcular sequencial
      const lastProgress = habit.progress[habit.progress.length - 1];
      newProgress.frequency = lastProgress ? lastProgress.frequency + 1 : 1;

      // Sempre incrementar streak por 1
      newProgress.streak = lastProgress ? lastProgress.streak + 1 : 1;
    }

    // Atualizar currentStreak e bestStreak
    habit.currentStreak = newProgress.streak;
    if (newProgress.streak > habit.bestStreak) {
      habit.bestStreak = newProgress.streak;
    }

    // Adicionar novo progresso
    habit.progress.push(newProgress);
    await habit.save();

    res.json(habit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Deletar hábito
exports.deleteHabit = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar se o hábito pertence ao usuário
    const habit = await Habit.findOneAndDelete({ _id: id, user: req.user._id });
    
    if (!habit) {
      return res.status(404).json({ message: "Hábito não encontrado ou não pertence ao usuário" });
    }

    res.json({ message: "Hábito deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};