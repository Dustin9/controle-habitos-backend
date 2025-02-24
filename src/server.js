const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const swaggerConfig = require('./config/swagger.js'); // Changed import to require

dotenv.config(); // Carrega variáveis do .env
connectDB(); // Conecta ao MongoDB

const app = express();
app.use(cors());
app.use(express.json()); // Permite JSON no body das requisições

// Rota de teste
app.get('/', (req, res) => {
res.send('API de Hábitos Funcionando!');
});

// Rotas da API
app.use('/api/habits', require('./routes/routes'));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
console.log(`Servidor rodando na porta ${PORT}`);
});
// Configuração do Swagger
swaggerConfig(app);
