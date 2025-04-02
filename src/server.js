const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const swaggerConfig = require('./config/swagger.js');

dotenv.config();

const app = express();

// CORS Configuration
const corsOptions = {
    origin: [process.env.FRONTEND_URL, 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Swagger Configuration
swaggerConfig(app);

// Rota de teste
app.get('/', (req, res) => {
    res.json({ message: 'API de Hábitos Funcionando!', status: 'online' });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas da API
app.use('/api/habits', require('./routes/routes'));
app.use('/api/auth', require('./routes/auth'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    console.error('Stack:', err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Erro interno do servidor',
        status: 'error',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Rota não encontrada',
        status: 'error',
        path: req.url,
        timestamp: new Date().toISOString()
    });
});

// Connect to database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            console.log(`Swagger disponível em: http://localhost:${PORT}/api-docs`);
            console.log(`Frontend URL configurada: ${process.env.FRONTEND_URL}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
        process.exit(1);
    }
};

startServer();
