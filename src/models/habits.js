const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
name: {
    type: String,
    required: true,
},
description: {
    type: String,
},
category: {
    type: String,
    enum: ['Saúde', 'Trabalho', 'Lazer', 'Estudo', 'Outros'],
    default: 'Outros',
},
frequency: {
    type: String,
    enum: ['Diário', 'Semanal', 'Todo dia'],
    default: 'Diário',
},
meta: {
    type: Number,
    min: 1,
    description: 'Meta de vezes que o hábito deve ser completado'
},
weeklyMeta: {
    type: Number,
    min: 1,
    max: 7,
    description: 'Número de dias por semana que o usuário pretende fazer o hábito'
},
progress: [
    {
    date: Date,
    completed: Boolean,
    streak: {
        type: Number,
        default: 0
    },
    frequency: {
        type: Number,
        default: 0
    }
    },
],
currentStreak: {
    type: Number,
    default: 0
},
bestStreak: {
    type: Number,
    default: 0
},
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Para futura autenticação
},
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);