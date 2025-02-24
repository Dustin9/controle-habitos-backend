const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
name: {
    type: String,
    required: true,
},
category: {
    type: String,
    enum: ['Saúde', 'Trabalho', 'Lazer'],
    default: 'Saúde',
},
frequency: {
    type: String,
    enum: ['Diário', 'Semanal'],
    default: 'Diário',
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