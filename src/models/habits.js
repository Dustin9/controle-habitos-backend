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
    enum: ['Saúde', 'Trabalho', 'Lazer, Estudo', 'Outros'],
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
progress: [
    {
    date: Date,
    completed: Boolean,
    },
],
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Para futura autenticação
},
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);